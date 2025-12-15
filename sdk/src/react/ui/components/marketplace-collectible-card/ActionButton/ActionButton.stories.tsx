import {
	MarketplaceKind,
	OrderSide,
	OrderStatus,
} from '@0xsequence/api-client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { defaultHandlers } from '../../../../../../test/handlers';
import { CollectibleCardAction } from '../../../../../types';
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
		cardType: {
			control: 'select',
			options: ['market', 'shop', 'inventory-non-tradable'],
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
	slug: 'test-order',
	collectionContractAddress: MOCK_ADDRESS,
	tokenId: 123n,
	createdBy: MOCK_ADDRESS,
	priceAmount: 1000000000000000000n,
	priceAmountFormatted: '1.0',
	priceAmountNet: 950000000000000000n,
	priceAmountNetFormatted: '0.95',
	priceCurrencyAddress:
		'0x0000000000000000000000000000000000000000' as `0x${string}`,
	priceDecimals: 18,
	priceUSD: 1000,
	priceUSDFormatted: '$1,000.00',
	quantityInitial: 1n,
	quantityInitialFormatted: '1',
	quantityRemaining: 1n,
	quantityRemainingFormatted: '1',
	quantityAvailable: 1n,
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

export const OfferAction: Story = {
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: 123n,
		action: CollectibleCardAction.OFFER,
		owned: false,
		cardType: 'market',
		onCannotPerformAction: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await new Promise((resolve) => setTimeout(resolve, 500));

		const button = canvas.getByText('Make an offer');
		await userEvent.click(button);
		await new Promise((resolve) => setTimeout(resolve, 500));

		const modal = body.getByText('Enter price');
		await expect(modal).toBeInTheDocument();
	},
};

export const SellAction: Story = {
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: 123n,
		action: CollectibleCardAction.SELL,
		owned: true,
		cardType: 'market',
		highestOffer: {
			...MOCK_ORDER,
			side: OrderSide.offer,
			status: OrderStatus.active,
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await new Promise((resolve) => setTimeout(resolve, 500));

		const button = canvas.getByText('Sell');
		await userEvent.click(button);
		await new Promise((resolve) => setTimeout(resolve, 500));

		const modal = body.getByText('Offer received');
		await expect(modal).toBeInTheDocument();
	},
};

export const ListAction: Story = {
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: 123n,
		action: CollectibleCardAction.LIST,
		owned: true,
		cardType: 'market',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await new Promise((resolve) => setTimeout(resolve, 500));

		const button = canvas.getByText('Create listing');
		await userEvent.click(button);
		await new Promise((resolve) => setTimeout(resolve, 500));

		const modal = body.getByText('Enter price');
		await expect(modal).toBeInTheDocument();
	},
};

export const TransferAction: Story = {
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: 123n,
		action: CollectibleCardAction.TRANSFER,
		owned: true,
		cardType: 'market',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await new Promise((resolve) => setTimeout(resolve, 500));

		const button = canvas.getByText('Transfer');
		await userEvent.click(button);
		await new Promise((resolve) => setTimeout(resolve, 500));

		const modal = body.getByText('Wallet address');
		await expect(modal).toBeInTheDocument();
	},
};

export const ShopBuyAction: Story = {
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: 123n,
		action: CollectibleCardAction.BUY,
		owned: false,
		cardType: 'shop',
		salesContractAddress: MOCK_ADDRESS,
		salePrice: {
			amount: 1000000000000000000n,
			currencyAddress:
				'0x0000000000000000000000000000000000000000' as `0x${string}`,
		},
		quantityRemaining: 100n,
		unlimitedSupply: false,
		onCannotPerformAction: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await new Promise((resolve) => setTimeout(resolve, 500));

		const button = canvas.getByText('Buy now');
		await userEvent.click(button);
		await new Promise((resolve) => setTimeout(resolve, 500));

		const modal = body.getByText('Select Quantity');
		await expect(modal).toBeInTheDocument();
	},
};

export const MarketBuyAction: Story = {
	args: {
		chainId: 1,
		collectionAddress: MOCK_ADDRESS,
		tokenId: 123n,
		action: CollectibleCardAction.BUY,
		owned: false,
		cardType: 'market',
		lowestListing: {
			...MOCK_ORDER,
			side: OrderSide.listing,
			status: OrderStatus.active,
		},
		onCannotPerformAction: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await new Promise((resolve) => setTimeout(resolve, 500));

		const button = canvas.getByText('Buy now');
		await userEvent.click(button);
		await new Promise((resolve) => setTimeout(resolve, 500));

		const modal = body.getByText('Select Quantity');
		await expect(modal).toBeInTheDocument();
	},
};
