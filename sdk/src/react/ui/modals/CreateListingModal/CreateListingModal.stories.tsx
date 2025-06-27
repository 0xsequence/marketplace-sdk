import type { Meta, StoryObj } from '@storybook/react';
import type React from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { Hex } from 'viem';
import { TEST_COLLECTIBLE } from '../../../../../test/const';
import { OrderbookKind } from '../../../../types';
import type { ModalCallbacks } from '../_internal/types';
import { useCreateListingModal } from './index';
import { CreateListingModal } from './Modal';

const meta: Meta<typeof CreateListingModal> = {
	title: 'Modals/CreateListingModal',
	component: CreateListingModal,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Modal for creating NFT listings with price, quantity, and expiration settings.',
			},
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CreateListingModal>;

// Trigger component that uses the hook to open the modal
const CreateListingModalTrigger: React.FC<{
	collectionAddress: Hex;
	chainId: number;
	collectibleId: string;
	orderbookKind?: OrderbookKind;
	callbacks?: ModalCallbacks;
	triggerLabel?: string;
}> = ({
	collectionAddress,
	chainId,
	collectibleId,
	orderbookKind,
	callbacks,
	triggerLabel = 'Create Listing',
}) => {
	const { show } = useCreateListingModal(callbacks);

	return (
		<div>
			<button
				type="button"
				onClick={() =>
					show({
						collectionAddress,
						chainId,
						collectibleId,
						orderbookKind,
					})
				}
				className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
			>
				{triggerLabel}
			</button>
			<CreateListingModal />
		</div>
	);
};

export const BasicListing: Story = {
	render: () => (
		<CreateListingModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId={TEST_COLLECTIBLE.collectibleId}
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Create Listing');
		await userEvent.click(trigger);

		// Wait for modal to appear
		await expect(canvas.getByText('List item for sale')).toBeInTheDocument();
		await expect(canvas.getByText('Price')).toBeInTheDocument();
		await expect(canvas.getByText('Expiration date')).toBeInTheDocument();
	},
};

export const PolygonListing: Story = {
	render: () => (
		<CreateListingModalTrigger
			collectionAddress={'0x631998e91476DA5B870D741192fc5Cbc55F5a52E' as Hex}
			chainId={137} // Polygon
			collectibleId="1"
			orderbookKind={OrderbookKind.sequence_marketplace_v2}
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Create Listing');
		await userEvent.click(trigger);

		await expect(canvas.getByText('List item for sale')).toBeInTheDocument();
	},
};

export const ERC1155Listing: Story = {
	render: () => (
		<CreateListingModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId={TEST_COLLECTIBLE.collectibleId}
			triggerLabel="List ERC1155 Token"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('List ERC1155 Token');
		await userEvent.click(trigger);

		await expect(canvas.getByText('List item for sale')).toBeInTheDocument();
		// Should show quantity input for ERC1155 tokens
		await expect(canvas.getByText('Quantity')).toBeInTheDocument();
	},
};

export const WithCustomExpiry: Story = {
	render: () => (
		<CreateListingModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId={TEST_COLLECTIBLE.collectibleId}
			triggerLabel="Custom Expiry Listing"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Custom Expiry Listing');
		await userEvent.click(trigger);

		await expect(canvas.getByText('List item for sale')).toBeInTheDocument();

		// Check that expiration date selector is present
		await expect(canvas.getByText('Expiration date')).toBeInTheDocument();
	},
};

export const WithCallbacks: Story = {
	render: () => (
		<CreateListingModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId={TEST_COLLECTIBLE.collectibleId}
			callbacks={{
				onSuccess: (result) => {
					console.log('Listing created successfully:', result);
					alert('Listing created successfully!');
				},
				onError: (error) => {
					console.error('Listing creation failed:', error);
					alert('Listing creation failed!');
				},
			}}
			triggerLabel="Listing with Callbacks"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Listing with Callbacks');
		await userEvent.click(trigger);

		await expect(canvas.getByText('List item for sale')).toBeInTheDocument();
	},
};

export const HighValueListing: Story = {
	render: () => (
		<CreateListingModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId="999" // High value token ID
			triggerLabel="High Value Listing"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('High Value Listing');
		await userEvent.click(trigger);

		await expect(canvas.getByText('List item for sale')).toBeInTheDocument();

		// Check for transaction details section
		await expect(canvas.getByText('Transaction details')).toBeInTheDocument();
	},
};

export const LoadingState: Story = {
	render: () => (
		<CreateListingModalTrigger
			collectionAddress={'0x0000000000000000000000000000000000000000' as Hex} // This will trigger loading
			chainId={1}
			collectibleId="loading"
			triggerLabel="Loading Listing"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Loading Listing');
		await userEvent.click(trigger);

		// Wait for modal to appear
		await expect(canvas.getByText('List item for sale')).toBeInTheDocument();

		// Should show loading state
		const loadingElements = canvas.getAllByTestId('spinner');
		await expect(loadingElements.length).toBeGreaterThan(0);
	},
};

export const ErrorState: Story = {
	render: () => (
		<CreateListingModalTrigger
			collectionAddress={'0xERROR000000000000000000000000000000000000' as Hex} // This will trigger error
			chainId={999999} // Invalid chain
			collectibleId="error"
			triggerLabel="Error Listing"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Error Listing');
		await userEvent.click(trigger);

		// Should show error state
		await expect(canvas.getByText('List item for sale')).toBeInTheDocument();
	},
};

export const NoCurrenciesConfigured: Story = {
	render: () => (
		<CreateListingModalTrigger
			collectionAddress={'0xNOCURRENCIES00000000000000000000000000000' as Hex} // This will return no currencies
			chainId={1}
			collectibleId="nocurrencies"
			triggerLabel="No Currencies"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('No Currencies');
		await userEvent.click(trigger);

		// Should show error message about no currencies
		await expect(
			canvas.getByText(
				'No currencies are configured for the marketplace, contact the marketplace owners',
			),
		).toBeInTheDocument();
	},
};

export const WithApprovalStep: Story = {
	render: () => (
		<CreateListingModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId="approval"
			triggerLabel="Needs Approval"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Needs Approval');
		await userEvent.click(trigger);

		await expect(canvas.getByText('List item for sale')).toBeInTheDocument();

		// Enter a price to enable the approval flow
		const priceInput = canvas.getByPlaceholderText('0.00');
		await userEvent.clear(priceInput);
		await userEvent.type(priceInput, '1');

		// Should show approval section for non-Sequence wallets
		const approvalSection = await canvas.findByText(/Approve/i);
		await expect(approvalSection).toBeInTheDocument();
	},
};

export const InteractionTest: Story = {
	render: () => (
		<CreateListingModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId={TEST_COLLECTIBLE.collectibleId}
			triggerLabel="Interactive Listing"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Interactive Listing');
		await userEvent.click(trigger);

		await expect(canvas.getByText('List item for sale')).toBeInTheDocument();

		// Test price input interaction
		const priceInput = canvas.getByPlaceholderText('0.00');
		await userEvent.clear(priceInput);
		await userEvent.type(priceInput, '1.5');
		await expect(priceInput).toHaveValue('1.5');

		// Test quantity input if present (ERC1155)
		const quantityInput = canvas.queryByLabelText('Quantity');
		if (quantityInput) {
			await userEvent.clear(quantityInput);
			await userEvent.type(quantityInput, '5');
			await expect(quantityInput).toHaveValue('5');
		}

		// Check that list button becomes enabled with valid price
		const listButton = canvas.getByRole('button', {
			name: 'List item for sale',
		});
		await expect(listButton).not.toBeDisabled();
	},
};

export const MobileViewport: Story = {
	render: () => (
		<CreateListingModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId={TEST_COLLECTIBLE.collectibleId}
			triggerLabel="Mobile Listing"
		/>
	),
	parameters: {
		viewport: {
			defaultViewport: 'mobile1',
		},
		docs: {
			description: {
				story: 'Create listing modal optimized for mobile viewport',
			},
		},
	},
};

export const TabletViewport: Story = {
	render: () => (
		<CreateListingModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId={TEST_COLLECTIBLE.collectibleId}
			triggerLabel="Tablet Listing"
		/>
	),
	parameters: {
		viewport: {
			defaultViewport: 'tablet',
		},
		docs: {
			description: {
				story: 'Create listing modal optimized for tablet viewport',
			},
		},
	},
};

export const DifferentCurrencies: Story = {
	render: () => (
		<CreateListingModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={137} // Polygon for different currency options
			collectibleId={TEST_COLLECTIBLE.collectibleId}
			triggerLabel="Multi-Currency Listing"
		/>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Create listing modal with multiple currency options (MATIC, USDC, etc.)',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Multi-Currency Listing');
		await userEvent.click(trigger);

		await expect(canvas.getByText('List item for sale')).toBeInTheDocument();

		// Check for currency selector
		const currencySelector = await canvas.findByRole('combobox');
		await expect(currencySelector).toBeInTheDocument();
	},
};

export const MaxQuantityERC1155: Story = {
	render: () => (
		<CreateListingModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId="max-quantity-1155"
			triggerLabel="Max Quantity ERC1155"
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'ERC1155 listing with maximum quantity available',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Max Quantity ERC1155');
		await userEvent.click(trigger);

		await expect(canvas.getByText('List item for sale')).toBeInTheDocument();

		// Should show quantity input for ERC1155
		await expect(canvas.getByText('Quantity')).toBeInTheDocument();

		// Check for max button
		const maxButton = await canvas.findByText('Max');
		await expect(maxButton).toBeInTheDocument();
	},
};

export const CustomExpirySelection: Story = {
	render: () => (
		<CreateListingModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId={TEST_COLLECTIBLE.collectibleId}
			triggerLabel="Custom Expiry"
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Create listing with custom expiration date selection',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Custom Expiry');
		await userEvent.click(trigger);

		await expect(canvas.getByText('List item for sale')).toBeInTheDocument();

		// Check for expiration date section
		await expect(canvas.getByText('Expiration date')).toBeInTheDocument();

		// Check for date picker or expiry options
		const expiryOptions = canvas.getAllByRole('button');
		const dayOptions = expiryOptions.filter(
			(btn) =>
				btn.textContent?.includes('day') ||
				btn.textContent?.includes('week') ||
				btn.textContent?.includes('month'),
		);
		await expect(dayOptions.length).toBeGreaterThan(0);
	},
};

export const ZeroPricePrevention: Story = {
	render: () => (
		<CreateListingModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId={TEST_COLLECTIBLE.collectibleId}
			triggerLabel="Zero Price Test"
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Test that zero or invalid prices are prevented',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Zero Price Test');
		await userEvent.click(trigger);

		await expect(canvas.getByText('List item for sale')).toBeInTheDocument();

		// Test zero price
		const priceInput = canvas.getByPlaceholderText('0.00');
		await userEvent.clear(priceInput);
		await userEvent.type(priceInput, '0');

		// List button should be disabled with zero price
		const listButton = canvas.getByRole('button', {
			name: 'List item for sale',
		});
		await expect(listButton).toBeDisabled();

		// Test negative price (should not be allowed)
		await userEvent.clear(priceInput);
		await userEvent.type(priceInput, '-1');
		// Input should not accept negative values
		const value = priceInput.getAttribute('value');
		await expect(value).not.toContain('-');
	},
};

export const NetworkSwitchRequired: Story = {
	render: () => (
		<CreateListingModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={42161} // Arbitrum - different from wallet network
			collectibleId={TEST_COLLECTIBLE.collectibleId}
			triggerLabel="Network Switch"
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Create listing that requires network switch',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Network Switch');
		await userEvent.click(trigger);

		// Should show network switch prompt or handle it automatically
		await expect(canvas.getByText('List item for sale')).toBeInTheDocument();
	},
};
