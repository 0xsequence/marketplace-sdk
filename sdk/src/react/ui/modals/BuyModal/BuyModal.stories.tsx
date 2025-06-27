import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { MarketplaceKind } from '../../../_internal';
import { BuyModal } from './components/Modal';
import { useBuyModal } from './index';
import type { BuyModalProps } from './store';

const meta: Meta<typeof BuyModal> = {
	title: 'Modals/BuyModal',
	component: BuyModal,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'BuyModal component for purchasing NFTs from marketplace or shop',
			},
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BuyModal>;

// Helper component to trigger modal
const BuyModalTrigger = ({ modalProps }: { modalProps: BuyModalProps }) => {
	const { show } = useBuyModal();

	return (
		<div>
			<button
				type="button"
				onClick={() => show(modalProps)}
				style={{
					padding: '12px 24px',
					backgroundColor: '#007bff',
					color: 'white',
					border: 'none',
					borderRadius: '6px',
					cursor: 'pointer',
					fontSize: '16px',
					fontWeight: '500',
				}}
			>
				Open Buy Modal
			</button>
			<BuyModal />
		</div>
	);
};

export const MarketplaceBuy: Story = {
	render: () => (
		<BuyModalTrigger
			modalProps={{
				chainId: 1,
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				collectibleId: '1',
				marketplace: MarketplaceKind.opensea,
				orderId: 'order-123',
				marketplaceType: 'market',
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Buy modal for purchasing NFTs from marketplace (OpenSea, etc.)',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByText('Open Buy Modal');

		// Click to open modal
		await userEvent.click(button);

		// Wait for modal to appear
		await expect(canvas.getByRole('dialog')).toBeInTheDocument();

		// Check for loading state initially
		await expect(canvas.getByTestId('spinner')).toBeInTheDocument();
	},
};

export const ShopBuy: Story = {
	render: () => (
		<BuyModalTrigger
			modalProps={{
				chainId: 137,
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				marketplaceType: 'shop',
				salesContractAddress:
					'0xABCDEF1234567890123456789012345678901234' as `0x${string}`,
				items: [
					{
						tokenId: '1',
						quantity: '1',
					},
				],
				quantityDecimals: 0,
				quantityRemaining: 10,
				salePrice: {
					amount: '1000000000000000000', // 1 ETH
					currencyAddress:
						'0x0000000000000000000000000000000000000000' as `0x${string}`,
				},
				nativeTokenAddress:
					'0xA0b86a33E6441b8C4505E2c4c1b8b8b8b8b8b8b8' as `0x${string}`,
				skipNativeBalanceCheck: true,
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Buy modal for shop purchases with custom native token address and skip balance check',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByText('Open Buy Modal');

		// Click to open modal
		await userEvent.click(button);

		// Wait for modal to appear
		await expect(canvas.getByRole('dialog')).toBeInTheDocument();
	},
};

export const MultipleItemsShopBuy: Story = {
	render: () => (
		<BuyModalTrigger
			modalProps={{
				chainId: 1,
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				marketplaceType: 'shop',
				salesContractAddress:
					'0xABCDEF1234567890123456789012345678901234' as `0x${string}`,
				items: [
					{ tokenId: '1', quantity: '2' },
					{ tokenId: '2', quantity: '1' },
					{ tokenId: '3', quantity: '3' },
				],
				quantityDecimals: 0,
				quantityRemaining: 100,
				salePrice: {
					amount: '500000000000000000', // 0.5 ETH per item
					currencyAddress:
						'0x0000000000000000000000000000000000000000' as `0x${string}`,
				},
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Shop buy modal with multiple items in cart',
			},
		},
	},
};

export const PolygonMarketplaceBuy: Story = {
	render: () => (
		<BuyModalTrigger
			modalProps={{
				chainId: 137, // Polygon
				collectionAddress:
					'0x631998e91476DA5B870D741192fc5Cbc55F5a52E' as `0x${string}`,
				collectibleId: '42',
				marketplace: MarketplaceKind.sequence_marketplace_v2,
				orderId: 'polygon-order-456',
				marketplaceType: 'market',
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Buy modal for Polygon network with Sequence Marketplace',
			},
		},
	},
};

export const ArbitrumMarketplaceBuy: Story = {
	render: () => (
		<BuyModalTrigger
			modalProps={{
				chainId: 42161, // Arbitrum
				collectionAddress:
					'0x9876543210987654321098765432109876543210' as `0x${string}`,
				collectibleId: '999',
				marketplace: MarketplaceKind.opensea,
				orderId: 'arb-order-789',
				marketplaceType: 'market',
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Buy modal for Arbitrum network',
			},
		},
	},
};

export const WithCustomCreditCardCallback: Story = {
	render: () => (
		<BuyModalTrigger
			modalProps={{
				chainId: 1,
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				collectibleId: '1',
				marketplace: MarketplaceKind.opensea,
				orderId: 'order-123',
				marketplaceType: 'market',
				customCreditCardProviderCallback: (buyStep) => {
					console.log(
						'Custom credit card provider callback triggered',
						buyStep,
					);
					alert('Custom credit card provider integration would open here');
				},
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Buy modal with custom credit card provider callback',
			},
		},
	},
};

export const ERC1155ShopBuy: Story = {
	render: () => (
		<BuyModalTrigger
			modalProps={{
				chainId: 1,
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				marketplaceType: 'shop',
				salesContractAddress:
					'0xABCDEF1234567890123456789012345678901234' as `0x${string}`,
				items: [
					{
						tokenId: '1155',
						quantity: '5', // Multiple quantity for ERC1155
					},
				],
				quantityDecimals: 0,
				quantityRemaining: 1000, // Large remaining quantity typical for ERC1155
				salePrice: {
					amount: '100000000000000000', // 0.1 ETH per item
					currencyAddress:
						'0x0000000000000000000000000000000000000000' as `0x${string}`,
				},
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Shop buy modal for ERC1155 tokens with quantity selection',
			},
		},
	},
};

export const LoadingState: Story = {
	render: () => (
		<BuyModalTrigger
			modalProps={{
				chainId: 999999, // Non-existent chain to trigger loading/error
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				collectibleId: '1',
				marketplace: MarketplaceKind.opensea,
				orderId: 'order-123',
				marketplaceType: 'market',
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Buy modal in loading state (simulated with invalid chain)',
			},
		},
		msw: {
			handlers: [
				// Override handlers to simulate slow loading
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByText('Open Buy Modal');

		// Click to open modal
		await userEvent.click(button);

		// Should show loading spinner
		await expect(canvas.getByTestId('spinner')).toBeInTheDocument();
	},
};

export const ErrorState: Story = {
	render: () => (
		<BuyModalTrigger
			modalProps={{
				chainId: 1,
				collectionAddress:
					'0x0000000000000000000000000000000000000000' as `0x${string}`, // Invalid address to trigger error
				collectibleId: 'invalid-id',
				marketplace: MarketplaceKind.opensea,
				orderId: 'invalid-order',
				marketplaceType: 'market',
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Buy modal in error state (simulated with invalid data)',
			},
		},
	},
};

export const WithCallbacks: Story = {
	render: () => {
		const modalProps: BuyModalProps = {
			chainId: 1,
			collectionAddress:
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
			collectibleId: '1',
			marketplace: MarketplaceKind.opensea,
			orderId: 'order-123',
			marketplaceType: 'market',
		};

		const { show } = useBuyModal({
			onSuccess: ({ hash, orderId }) => {
				console.log('Buy successful:', { hash, orderId });
				alert(`Purchase successful! Order ID: ${orderId}`);
			},
			onError: (error) => {
				console.error('Buy failed:', error);
				alert(`Purchase failed: ${error.message}`);
			},
		});

		return (
			<div>
				<button
					type="button"
					onClick={() => show(modalProps)}
					style={{
						padding: '12px 24px',
						backgroundColor: '#28a745',
						color: 'white',
						border: 'none',
						borderRadius: '6px',
						cursor: 'pointer',
						fontSize: '16px',
						fontWeight: '500',
					}}
				>
					Buy with Callbacks
				</button>
				<BuyModal />
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story: 'Buy modal with success and error callbacks',
			},
		},
	},
};

export const InteractionTest: Story = {
	render: () => (
		<BuyModalTrigger
			modalProps={{
				chainId: 1,
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				collectibleId: '1',
				marketplace: MarketplaceKind.opensea,
				orderId: 'order-123',
				marketplaceType: 'market',
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Interactive test for buy modal user flows',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByText('Open Buy Modal');

		// Click to open modal
		await userEvent.click(button);

		// Wait for modal to appear
		await expect(canvas.getByRole('dialog')).toBeInTheDocument();

		// Wait for content to load
		await canvas.findByText('Buy item');

		// Check for key elements
		await expect(canvas.getByText('Transaction details')).toBeInTheDocument();

		// Test close button
		const closeButton = canvas.getByLabelText('Close');
		await userEvent.click(closeButton);

		// Modal should close
		await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
	},
};

export const MobileViewport: Story = {
	render: () => (
		<BuyModalTrigger
			modalProps={{
				chainId: 1,
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				collectibleId: '1',
				marketplace: MarketplaceKind.opensea,
				orderId: 'order-123',
				marketplaceType: 'market',
			}}
		/>
	),
	parameters: {
		viewport: {
			defaultViewport: 'mobile1',
		},
		docs: {
			description: {
				story: 'Buy modal optimized for mobile viewport',
			},
		},
	},
};

export const TabletViewport: Story = {
	render: () => (
		<BuyModalTrigger
			modalProps={{
				chainId: 1,
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				collectibleId: '1',
				marketplace: MarketplaceKind.opensea,
				orderId: 'order-123',
				marketplaceType: 'market',
			}}
		/>
	),
	parameters: {
		viewport: {
			defaultViewport: 'tablet',
		},
		docs: {
			description: {
				story: 'Buy modal optimized for tablet viewport',
			},
		},
	},
};
