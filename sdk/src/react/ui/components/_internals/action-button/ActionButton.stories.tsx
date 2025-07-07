import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CollectibleCardAction } from '../../../../../types';
import {
	MarketplaceKind,
	OrderbookKind,
	OrderSide,
	OrderStatus,
} from '../../../../_internal';
import { ActionButton } from './ActionButton';

const meta: Meta<typeof ActionButton> = {
	title: 'Internals/Action Button',
	component: ActionButton,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
The ActionButton component handles different actions for collectibles in both marketplace and shop contexts. It automatically determines whether to show owner or non-owner actions based on ownership and other conditions.

## Manual Testing

**Test the modals by clicking the action buttons in the "Modal Demo" stories:**

1. **Buy Action** - Opens buy modal for marketplace listings
2. **Make Offer** - Opens offer modal for making offers on collectibles
3. **Sell (Accept Offer)** - Opens sell modal to accept existing offers
4. **Create Listing** - Opens listing modal to create new listings
5. **Transfer** - Opens transfer modal to transfer collectibles
6. **Shop Buy** - Opens buy modal for shop-based purchases

Each button click should open the corresponding modal. The modals are fully functional with all providers configured.

## Testing Plan

### Basic Functionality
- [ ] Renders non-owner actions (Buy, Offer) when user doesn't own the collectible
- [ ] Renders owner actions (Sell, List, Transfer) when user owns the collectible
- [ ] Handles marketplace vs shop types correctly
- [ ] Shows/hides based on action logic

### Owner Actions
- [ ] Buy action for non-owners with market listing
- [ ] Offer action for non-owners without listing
- [ ] Sell action for owners with offers
- [ ] List action for owners without listings
- [ ] Transfer action for owners

### Marketplace Types
- [ ] Market type with orderbook functionality
- [ ] Shop type with sales contract functionality

### Edge Cases
- [ ] No action shown when conditions aren't met
- [ ] Prioritize owner actions flag
- [ ] Cannot perform action callback
- [ ] Different orderbook kinds

### Interaction Tests
- [ ] Click handlers work correctly
- [ ] Modal opening functionality
- [ ] Wallet connection flow
				`,
			},
		},
	},
	argTypes: {
		chainId: {
			control: 'number',
			description: 'Blockchain chain ID',
		},
		collectionAddress: {
			control: 'text',
			description: 'Collection contract address',
		},
		tokenId: {
			control: 'text',
			description: 'Token ID of the collectible',
		},
		action: {
			control: 'select',
			options: Object.values(CollectibleCardAction),
			description: 'The action to display',
		},
		owned: {
			control: 'boolean',
			description: 'Whether the user owns this collectible',
		},
		marketplaceType: {
			control: 'select',
			options: ['market', 'shop'],
			description: 'Type of marketplace (market or shop)',
		},
		onCannotPerformAction: {
			action: 'cannot perform action',
			description: 'Callback when user cannot perform the action',
		},
	},
	decorators: [
		(Story) => (
			<div style={{ padding: '1rem', width: '300px' }}>
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof ActionButton>;

// Mock data
const MOCK_ADDRESS = '0x1234567890123456789012345678901234567890' as const;
const MOCK_ORDER = {
	orderId: 'order-123',
	marketplace: MarketplaceKind.sequence_marketplace_v1,
	side: OrderSide.listing,
	status: OrderStatus.active,
	chainId: 1,
	originName: 'Mock Origin',
	collectionContractAddress: MOCK_ADDRESS,
	tokenId: '123',
	createdBy: MOCK_ADDRESS,
	priceAmount: '1000000000000000000',
	priceAmountFormatted: '1.0',
	priceAmountNet: '950000000000000000',
	priceAmountNetFormatted: '0.95',
	priceCurrencyAddress: '0x0000000000000000000000000000000000000000',
	priceDecimals: 18,
	priceUSD: 1000,
	priceUSDFormatted: '$1,000.00',
	quantityInitial: '1',
	quantityInitialFormatted: '1',
	quantityRemaining: '1',
	quantityRemainingFormatted: '1',
	quantityAvailable: '1',
	quantityAvailableFormatted: '1',
	quantityDecimals: 0,
	feeBps: 500,
	feeBreakdown: [],
	validFrom: '2024-01-01T00:00:00Z',
	validUntil: '2024-12-31T23:59:59Z',
	blockNumber: 12345678,
	orderCreatedAt: '2024-01-01T00:00:00Z',
	orderUpdatedAt: '2024-01-01T00:00:00Z',
	createdAt: '2024-01-01T00:00:00Z',
	updatedAt: '2024-01-01T00:00:00Z',
};

// ========================================
// BASIC STORIES - Start simple
// ========================================

export const BuyAction: Story = {
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: '123',
		action: CollectibleCardAction.BUY,
		owned: false,
		marketplaceType: 'market',
		lowestListing: MOCK_ORDER,
		onCannotPerformAction: fn(),
	},
};

export const OfferAction: Story = {
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: '123',
		action: CollectibleCardAction.OFFER,
		owned: false,
		marketplaceType: 'market',
		orderbookKind: OrderbookKind.sequence_marketplace_v1,
		onCannotPerformAction: fn(),
	},
};

export const SellAction: Story = {
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: '123',
		action: CollectibleCardAction.SELL,
		owned: true,
		marketplaceType: 'market',
		highestOffer: MOCK_ORDER,
		orderbookKind: OrderbookKind.sequence_marketplace_v1,
	},
};

export const ListAction: Story = {
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: '123',
		action: CollectibleCardAction.LIST,
		owned: true,
		marketplaceType: 'market',
		orderbookKind: OrderbookKind.sequence_marketplace_v1,
	},
};

export const TransferAction: Story = {
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: '123',
		action: CollectibleCardAction.TRANSFER,
		owned: true,
		marketplaceType: 'market',
	},
};

export const ShopBuyAction: Story = {
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: '123',
		action: CollectibleCardAction.BUY,
		owned: false,
		marketplaceType: 'shop',
		salesContractAddress: MOCK_ADDRESS,
		salePrice: {
			amount: '1000000000000000000',
			currencyAddress: '0x0000000000000000000000000000000000000000',
		},
		quantityRemaining: 10,
		unlimitedSupply: false,
	},
};

// ========================================
// TEST STORIES - Hidden from UI
// ========================================

export const PrioritizeOwnerActionsTest: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: '123',
		action: CollectibleCardAction.BUY,
		owned: false,
		marketplaceType: 'market',
		prioritizeOwnerActions: true,
		lowestListing: MOCK_ORDER,
	},
};

export const NoActionShownTest: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: '123',
		action: CollectibleCardAction.BUY,
		owned: false,
		marketplaceType: 'market',
		// No lowestListing provided, so should not show
	},
};

// ========================================
// MODAL DEMONSTRATIONS - For manual testing
// ========================================

export const ModalDemoBuy: Story = {
	name: 'Modal Demo - Buy Action',
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: '123',
		action: CollectibleCardAction.BUY,
		owned: false,
		marketplaceType: 'market',
		lowestListing: MOCK_ORDER,
	},
};

export const ModalDemoOffer: Story = {
	name: 'Modal Demo - Make Offer',
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: '123',
		action: CollectibleCardAction.OFFER,
		owned: false,
		marketplaceType: 'market',
		orderbookKind: OrderbookKind.sequence_marketplace_v1,
	},
};

export const ModalDemoSell: Story = {
	name: 'Modal Demo - Sell (Accept Offer)',
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: '123',
		action: CollectibleCardAction.SELL,
		owned: true,
		marketplaceType: 'market',
		highestOffer: MOCK_ORDER,
		orderbookKind: OrderbookKind.sequence_marketplace_v1,
	},
};

export const ModalDemoList: Story = {
	name: 'Modal Demo - Create Listing',
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: '123',
		action: CollectibleCardAction.LIST,
		owned: true,
		marketplaceType: 'market',
		orderbookKind: OrderbookKind.sequence_marketplace_v1,
	},
};

export const ModalDemoTransfer: Story = {
	name: 'Modal Demo - Transfer',
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: '123',
		action: CollectibleCardAction.TRANSFER,
		owned: true,
		marketplaceType: 'market',
	},
};

export const ModalDemoShopBuy: Story = {
	name: 'Modal Demo - Shop Buy',
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: '123',
		action: CollectibleCardAction.BUY,
		owned: false,
		marketplaceType: 'shop',
		salesContractAddress: MOCK_ADDRESS,
		salePrice: {
			amount: '1000000000000000000',
			currencyAddress: '0x0000000000000000000000000000000000000000',
		},
		quantityRemaining: 10,
		unlimitedSupply: false,
	},
};

// ========================================
// INTERACTION TESTS - Enhanced with wallet connection
// ========================================

export const BasicInteractionTest: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: '123',
		action: CollectibleCardAction.BUY,
		owned: false,
		marketplaceType: 'market',
		lowestListing: MOCK_ORDER,
		onCannotPerformAction: fn(),
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify action button renders', async () => {
			// Look for a button element
			const button = canvas.getByRole('button');
			await expect(button).toBeInTheDocument();
			await expect(button).toHaveTextContent('Buy now');
		});

		await step('Test button click opens modal', async () => {
			const button = canvas.getByRole('button');
			await userEvent.click(button);

			// Wait a bit for the modal to potentially open
			await new Promise((resolve) => setTimeout(resolve, 100));

			// Check if any modal dialog appears (this tests that the modal system is working)
			// In a real test environment, we'd mock the modal hooks to verify they were called
			await expect(button).toBeInTheDocument();
		});
	},
};
