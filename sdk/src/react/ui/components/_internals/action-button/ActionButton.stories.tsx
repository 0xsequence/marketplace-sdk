import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CollectibleCardAction } from '../../../../../types';
import {
	MarketplaceKind,
	OrderbookKind,
	OrderSide,
	OrderStatus,
} from '../../../../_internal';
import { defaultHandlers } from './__mocks__/handlers';
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

**Test the modals by clicking the action buttons:**

1. **Buy Action** - Opens buy modal for marketplace listings
2. **Make Offer** - Opens offer modal for making offers on collectibles
3. **Sell (Accept Offer)** - Opens sell modal to accept existing offers
4. **Create Listing** - Opens listing modal to create new listings
5. **Transfer** - Opens transfer modal to transfer collectibles
6. **Shop Buy** - Opens buy modal for shop-based purchases

Each button click should open the corresponding modal. The modals are fully functional with all providers configured.

## MSW Integration

All stories now use Mock Service Worker (MSW) to mock API requests, ensuring the components work with realistic data without requiring a backend server.
				`,
			},
		},
		// Use the pre-composed success handlers for all stories by default
		msw: {
			handlers: defaultHandlers.success,
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
		highestOffer: {
			...MOCK_ORDER,
			side: OrderSide.offer,
			status: OrderStatus.active,
		},
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
