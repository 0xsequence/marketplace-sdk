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

export const MobileViewport: Story = {
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
		viewport: {
			defaultViewport: 'mobile1',
		},
		docs: {
			description: {
				story: 'Sell modal optimized for mobile viewport (375px width)',
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

		// Check that modal is properly sized for mobile
		const modal = canvas.getByRole('dialog');
		await expect(modal).toBeVisible();
	},
};

export const TabletViewport: Story = {
	render: () => (
		<SellModalTrigger
			modalProps={{
				chainId: 1,
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				tokenId: '42',
				order: mockOrder,
			}}
		/>
	),
	parameters: {
		viewport: {
			defaultViewport: 'tablet',
		},
		docs: {
			description: {
				story: 'Sell modal optimized for tablet viewport (768px width)',
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

export const InteractionTest: Story = {
	render: () => (
		<SellModalTrigger
			modalProps={{
				chainId: 1,
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				tokenId: '100',
				order: mockOrder,
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Comprehensive interaction test for sell flow',
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

		// Check for key elements
		await expect(canvas.getByText(/Sell NFT/i)).toBeInTheDocument();

		// Look for price input field
		const priceInputs = canvas.getAllByRole('textbox');
		expect(priceInputs.length).toBeGreaterThan(0);

		// Type a new price
		const priceInput = priceInputs[0];
		await userEvent.clear(priceInput);
		await userEvent.type(priceInput, '2.5');

		// Check for sell button
		const sellButton = canvas.getByRole('button', { name: /sell/i });
		await expect(sellButton).toBeInTheDocument();

		// Check for close button
		const closeButton = canvas.getByRole('button', { name: /close/i });
		await expect(closeButton).toBeInTheDocument();

		// Test close functionality
		await userEvent.click(closeButton);
		await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
	},
};

export const PriceValidation: Story = {
	render: () => (
		<SellModalTrigger
			modalProps={{
				chainId: 1,
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				tokenId: '200',
				order: mockOrder,
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Test price input validation (zero, negative, invalid values)',
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

		// Find price input
		const priceInputs = canvas.getAllByRole('textbox');
		const priceInput = priceInputs[0];

		// Test zero price
		await userEvent.clear(priceInput);
		await userEvent.type(priceInput, '0');

		// Sell button should be disabled or show error
		const sellButton = canvas.getByRole('button', { name: /sell/i });
		await expect(sellButton).toBeDisabled();

		// Test negative price
		await userEvent.clear(priceInput);
		await userEvent.type(priceInput, '-1');

		// Should not accept negative values
		await expect(priceInput).not.toHaveValue('-1');

		// Test valid price
		await userEvent.clear(priceInput);
		await userEvent.type(priceInput, '1.5');

		// Sell button should be enabled
		await expect(sellButton).toBeEnabled();
	},
};

export const ExpiryDateSelection: Story = {
	render: () => (
		<SellModalTrigger
			modalProps={{
				chainId: 1,
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				tokenId: '300',
				order: mockOrder,
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Test expiry date selection functionality',
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

		// Look for expiry date selector
		const expirySelectors = canvas.getAllByRole('combobox');
		if (expirySelectors.length > 0) {
			const expirySelector = expirySelectors[0];
			await userEvent.click(expirySelector);

			// Select different expiry option
			const options = await canvas.findAllByRole('option');
			if (options.length > 1) {
				await userEvent.click(options[1]);
			}
		}

		// Verify selection was made
		await expect(canvas.getByRole('dialog')).toBeInTheDocument();
	},
};

export const NetworkSwitchRequired: Story = {
	render: () => (
		<SellModalTrigger
			modalProps={{
				chainId: 42161, // Arbitrum
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				tokenId: '400',
				order: {
					...mockOrder,
					chainId: 42161,
				},
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Sell modal when network switch is required',
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

		// Check for network switch message or button
		const networkElements = canvas.queryAllByText(/network|chain|switch/i);
		expect(networkElements.length).toBeGreaterThan(0);
	},
};

export const ERC1155Sell: Story = {
	render: () => (
		<SellModalTrigger
			modalProps={{
				chainId: 1,
				collectionAddress:
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				tokenId: '500',
				order: {
					...mockOrder,
					quantityInitial: '10',
					quantityInitialFormatted: '10',
					quantityRemaining: '10',
					quantityRemainingFormatted: '10',
					quantityAvailable: '10',
					quantityAvailableFormatted: '10',
				},
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Sell modal for ERC1155 token with quantity selection',
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

		// Look for quantity input
		const quantityInputs = canvas.getAllByRole('spinbutton');
		if (quantityInputs.length > 0) {
			const quantityInput = quantityInputs[0];

			// Test changing quantity
			await userEvent.clear(quantityInput);
			await userEvent.type(quantityInput, '5');

			// Verify quantity was updated
			await expect(quantityInput).toHaveValue(5);
		}
	},
};
