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
	},
};

export const ShopBuy: Story = {
	render: () => (
		<BuyModalTrigger
			modalProps={{
				chainId: 137,
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				collectibleId: '1',
				marketplace: MarketplaceKind.opensea,
				orderId: 'order-123',
				marketplaceType: 'market',
				nativeTokenAddress: '0xA0b86a33E6441b8C4505E2c4c1b8b8b8b8b8b8b8',
				skipNativeBalanceCheck: true,
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Buy modal with custom native token address and skip balance check',
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
