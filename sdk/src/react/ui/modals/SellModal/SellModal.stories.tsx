import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import {
	MarketplaceKind,
	OrderSide,
	OrderStatus,
} from '../../../_internal/api/marketplace.gen';
import { useSellModal } from './index';
import { SellModal } from './Modal';

const meta: Meta<typeof SellModal> = {
	title: 'Modals/SellModal',
	component: SellModal,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: 'SellModal component for selling NFTs on marketplace',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof SellModal>;

// Helper component to trigger modal
const SellModalTrigger = ({
	modalProps,
}: {
	modalProps: Parameters<ReturnType<typeof useSellModal>['show']>[0];
}) => {
	const { show } = useSellModal();

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
				}}
			>
				Open Sell Modal
			</button>
			<SellModal />
		</div>
	);
};

const mockOrder = {
	orderId: 'order-123',
	marketplace: MarketplaceKind.opensea,
	side: OrderSide.listing,
	status: OrderStatus.active,
	chainId: 1,
	originName: 'OpenSea',
	collectionContractAddress: '0x1234567890123456789012345678901234567890',
	tokenId: '1',
	createdBy: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
	priceAmount: '1000000000000000000', // 1 ETH
	priceAmountFormatted: '1.0',
	priceAmountNet: '950000000000000000', // 0.95 ETH after fees
	priceAmountNetFormatted: '0.95',
	priceCurrencyAddress: '0x0000000000000000000000000000000000000000',
	priceDecimals: 18,
	priceUSD: 2000,
	priceUSDFormatted: '$2,000.00',
	quantityInitial: '1',
	quantityInitialFormatted: '1',
	quantityRemaining: '1',
	quantityRemainingFormatted: '1',
	quantityAvailable: '1',
	quantityAvailableFormatted: '1',
	quantityDecimals: 0,
	feeBps: 250, // 2.5% fee
	feeBreakdown: [],
	blockNumber: 18000000,
	validFrom: (Math.floor(Date.now() / 1000) - 3600).toString(), // 1 hour ago
	validUntil: (Math.floor(Date.now() / 1000) + 86400).toString(), // 24 hours from now
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

export const BasicSell: Story = {
	render: () => (
		<SellModalTrigger
			modalProps={{
				chainId: 1,
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				tokenId: '1',
				order: mockOrder,
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Basic sell modal for listing an NFT on marketplace',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByText('Open Sell Modal');

		// Click to open modal
		await userEvent.click(button);

		// Wait for modal to appear
		await expect(canvas.getByRole('dialog')).toBeInTheDocument();
	},
};

export const PolygonSell: Story = {
	render: () => (
		<SellModalTrigger
			modalProps={{
				chainId: 137,
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				tokenId: '42',
				order: {
					...mockOrder,
					priceAmount: '100000000000000000000', // 100 MATIC
					priceCurrencyAddress: '0x0000000000000000000000000000000000001010', // MATIC
				},
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Sell modal for Polygon network with MATIC pricing',
			},
		},
	},
};

export const HighValueSell: Story = {
	render: () => (
		<SellModalTrigger
			modalProps={{
				chainId: 1,
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				tokenId: '999',
				order: {
					...mockOrder,
					priceAmount: '10000000000000000000', // 10 ETH
					marketplace: MarketplaceKind.sequence_marketplace_v2,
				},
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Sell modal for high-value NFT (10 ETH)',
			},
		},
	},
};

export const WithCustomExpiry: Story = {
	render: () => (
		<SellModalTrigger
			modalProps={{
				chainId: 1,
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				tokenId: '123',
				order: {
					...mockOrder,
					validUntil: (Math.floor(Date.now() / 1000) + 604800).toString(), // 7 days from now
				},
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Sell modal with custom expiry (7 days)',
			},
		},
	},
};

export const WithCallbacks: Story = {
	render: () => {
		const modalProps = {
			chainId: 1,
			collectionAddress:
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
			tokenId: '456',
			order: mockOrder,
		};

		const { show } = useSellModal({
			onSuccess: (result) => {
				console.log('Sell successful:', result);
			},
			onError: (error) => {
				console.error('Sell failed:', error);
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
					}}
				>
					Open Sell Modal with Callbacks
				</button>
				<SellModal />
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story: 'Sell modal with success, error, and close callbacks',
			},
		},
	},
};

export const LoadingState: Story = {
	render: () => (
		<SellModalTrigger
			modalProps={{
				chainId: 999999, // Non-existent chain to trigger loading
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				tokenId: '1',
				order: mockOrder,
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Sell modal in loading state (simulated with invalid chain)',
			},
		},
	},
};

export const ErrorState: Story = {
	render: () => (
		<SellModalTrigger
			modalProps={{
				chainId: 1,
				collectionAddress:
					'0x0000000000000000000000000000000000000000' as `0x${string}`, // Invalid address
				tokenId: 'invalid-token',
				order: {
					...mockOrder,
					orderId: '', // Invalid order
				},
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Sell modal in error state (simulated with invalid data)',
			},
		},
	},
};
