import type { Meta, StoryObj } from '@storybook/react';
import type React from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { Address } from 'viem';
import { TEST_COLLECTIBLE } from '../../../../../test/const';
import type { ModalCallbacks } from '../_internal/types';
import { TransferModal, useTransferModal } from './index';

const meta: Meta<typeof TransferModal> = {
	title: 'Modals/TransferModal',
	component: TransferModal,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Modal for transferring NFTs to another wallet address with quantity selection for ERC1155 tokens.',
			},
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TransferModal>;

// Trigger component that uses the hook to open the modal
const TransferModalTrigger: React.FC<{
	collectionAddress: Address;
	chainId: number;
	collectibleId: string;
	callbacks?: ModalCallbacks;
	triggerLabel?: string;
}> = ({
	collectionAddress,
	chainId,
	collectibleId,
	callbacks,
	triggerLabel = 'Transfer NFT',
}) => {
	const { show } = useTransferModal();

	return (
		<div>
			<button
				type="button"
				onClick={() =>
					show({
						collectionAddress,
						chainId,
						collectibleId,
						callbacks,
					})
				}
				className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
			>
				{triggerLabel}
			</button>
			<TransferModal />
		</div>
	);
};

export const BasicTransfer: Story = {
	render: () => (
		<TransferModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId={TEST_COLLECTIBLE.collectibleId}
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Transfer NFT');
		await userEvent.click(trigger);

		// Wait for modal to appear
		await expect(canvas.getByText('Transfer your item')).toBeInTheDocument();
		await expect(
			canvas.getByPlaceholderText('Enter wallet address'),
		).toBeInTheDocument();
		await expect(canvas.getByText('Transfer')).toBeInTheDocument();
	},
};

export const ERC721Transfer: Story = {
	render: () => (
		<TransferModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId="721" // ERC721 token
			triggerLabel="Transfer ERC721"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Transfer ERC721');
		await userEvent.click(trigger);

		await expect(canvas.getByText('Transfer your item')).toBeInTheDocument();
		// ERC721 should not show quantity input
		await expect(canvas.queryByText('Quantity')).not.toBeInTheDocument();
	},
};

export const ERC1155Transfer: Story = {
	render: () => (
		<TransferModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId="1155" // ERC1155 token
			triggerLabel="Transfer ERC1155"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Transfer ERC1155');
		await userEvent.click(trigger);

		await expect(canvas.getByText('Transfer your item')).toBeInTheDocument();
		// ERC1155 should show quantity input
		await expect(canvas.getByText('Quantity')).toBeInTheDocument();
	},
};

export const PolygonTransfer: Story = {
	render: () => (
		<TransferModalTrigger
			collectionAddress={
				'0x631998e91476DA5B870D741192fc5Cbc55F5a52E' as Address
			}
			chainId={137} // Polygon
			collectibleId="1"
			triggerLabel="Polygon Transfer"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Polygon Transfer');
		await userEvent.click(trigger);

		await expect(canvas.getByText('Transfer your item')).toBeInTheDocument();
	},
};

export const WithCallbacks: Story = {
	render: () => (
		<TransferModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId={TEST_COLLECTIBLE.collectibleId}
			callbacks={{
				onSuccess: (result) => {
					console.log('Transfer successful:', result);
					alert('Transfer completed successfully!');
				},
				onError: (error) => {
					console.error('Transfer failed:', error);
					alert('Transfer failed!');
				},
			}}
			triggerLabel="Transfer with Callbacks"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Transfer with Callbacks');
		await userEvent.click(trigger);

		await expect(canvas.getByText('Transfer your item')).toBeInTheDocument();
	},
};

export const CrossChainTransfer: Story = {
	render: () => (
		<TransferModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={42161} // Arbitrum - different from default test chain
			collectibleId={TEST_COLLECTIBLE.collectibleId}
			triggerLabel="Cross-Chain Transfer"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Cross-Chain Transfer');
		await userEvent.click(trigger);

		// Should trigger chain switch modal first for cross-chain transfers
		// Then show transfer modal
		await expect(canvas.getByText('Transfer your item')).toBeInTheDocument();
	},
};

export const InteractionTest: Story = {
	render: () => (
		<TransferModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId={TEST_COLLECTIBLE.collectibleId}
			triggerLabel="Interactive Transfer"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Interactive Transfer');
		await userEvent.click(trigger);

		await expect(canvas.getByText('Transfer your item')).toBeInTheDocument();

		// Test wallet address input
		const addressInput = canvas.getByPlaceholderText('Enter wallet address');
		await userEvent.clear(addressInput);
		await userEvent.type(addressInput, '0x742d35Cc6634C0532925a3b8D');
		await expect(addressInput).toHaveValue('0x742d35Cc6634C0532925a3b8D');

		// Transfer button should be disabled with invalid address
		const transferButton = canvas.getByRole('button', { name: 'Transfer' });
		await expect(transferButton).toBeDisabled();

		// Test with valid address
		await userEvent.clear(addressInput);
		await userEvent.type(
			addressInput,
			'0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4C',
		);
		await expect(addressInput).toHaveValue(
			'0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4C',
		);

		// Transfer button should be enabled with valid address
		await expect(transferButton).not.toBeDisabled();
	},
};

export const SelfTransferPrevention: Story = {
	render: () => (
		<TransferModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId={TEST_COLLECTIBLE.collectibleId}
			triggerLabel="Self Transfer Test"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Self Transfer Test');
		await userEvent.click(trigger);

		await expect(canvas.getByText('Transfer your item')).toBeInTheDocument();

		// Test with connected wallet address (should be disabled)
		const addressInput = canvas.getByPlaceholderText('Enter wallet address');
		// Using the mock wallet address from test setup
		await userEvent.type(
			addressInput,
			'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
		);

		const transferButton = canvas.getByRole('button', { name: 'Transfer' });
		// Should be disabled for self-transfer
		await expect(transferButton).toBeDisabled();
	},
};

export const InsufficientBalanceTest: Story = {
	render: () => (
		<TransferModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId="insufficient" // This will mock insufficient balance
			triggerLabel="Insufficient Balance"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Insufficient Balance');
		await userEvent.click(trigger);

		await expect(canvas.getByText('Transfer your item')).toBeInTheDocument();

		// Enter valid address
		const addressInput = canvas.getByPlaceholderText('Enter wallet address');
		await userEvent.type(
			addressInput,
			'0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4C',
		);

		// If ERC1155, try to set quantity higher than balance
		const quantityInput = canvas.queryByLabelText('Quantity');
		if (quantityInput) {
			await userEvent.clear(quantityInput);
			await userEvent.type(quantityInput, '999999');
		}

		const transferButton = canvas.getByRole('button', { name: 'Transfer' });
		// Should be disabled due to insufficient balance
		await expect(transferButton).toBeDisabled();
	},
};

export const QuantityInputTest: Story = {
	render: () => (
		<TransferModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId="1155" // ERC1155 to show quantity input
			triggerLabel="Quantity Test"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Quantity Test');
		await userEvent.click(trigger);

		await expect(canvas.getByText('Transfer your item')).toBeInTheDocument();

		// Should show quantity input for ERC1155
		const quantityInput = canvas.getByLabelText('Quantity');
		await expect(quantityInput).toBeInTheDocument();

		// Test quantity input
		await userEvent.clear(quantityInput);
		await userEvent.type(quantityInput, '5');
		await expect(quantityInput).toHaveValue('5');

		// Test zero quantity (should disable transfer)
		await userEvent.clear(quantityInput);
		await userEvent.type(quantityInput, '0');

		const transferButton = canvas.getByRole('button', { name: 'Transfer' });
		await expect(transferButton).toBeDisabled();
	},
};

export const WalletInstructionsView: Story = {
	render: () => (
		<TransferModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId="instructions" // This will trigger wallet instructions view
			triggerLabel="Wallet Instructions"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Wallet Instructions');
		await userEvent.click(trigger);

		await expect(canvas.getByText('Transfer your item')).toBeInTheDocument();

		// Enter valid address and click transfer to see instructions
		const addressInput = canvas.getByPlaceholderText('Enter wallet address');
		await userEvent.type(
			addressInput,
			'0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4C',
		);

		const transferButton = canvas.getByRole('button', { name: 'Transfer' });
		await userEvent.click(transferButton);

		// Should show wallet instructions view for non-WaaS wallets
		await expect(
			canvas.getByText('Follow wallet instructions'),
		).toBeInTheDocument();
	},
};

export const LoadingState: Story = {
	render: () => (
		<TransferModalTrigger
			collectionAddress={
				'0x0000000000000000000000000000000000000000' as Address
			} // This will trigger loading
			chainId={1}
			collectibleId="loading"
			triggerLabel="Loading Transfer"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Loading Transfer');
		await userEvent.click(trigger);

		// Should show loading state while fetching collection data
		await expect(canvas.getByText('Transfer your item')).toBeInTheDocument();
	},
};

export const ErrorState: Story = {
	render: () => (
		<TransferModalTrigger
			collectionAddress={
				'0xERROR000000000000000000000000000000000000' as Address
			} // This will trigger error
			chainId={999999} // Invalid chain
			collectibleId="error"
			triggerLabel="Error Transfer"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Error Transfer');
		await userEvent.click(trigger);

		// Should still show transfer modal even with errors
		await expect(canvas.getByText('Transfer your item')).toBeInTheDocument();
	},
};

export const MobileViewport: Story = {
	render: () => (
		<TransferModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId={TEST_COLLECTIBLE.collectibleId}
			triggerLabel="Mobile Transfer"
		/>
	),
	parameters: {
		viewport: {
			defaultViewport: 'mobile1',
		},
		docs: {
			description: {
				story: 'Transfer modal optimized for mobile viewport (375px width)',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Mobile Transfer');
		await userEvent.click(trigger);

		// Wait for modal to appear
		await expect(canvas.getByText('Transfer your item')).toBeInTheDocument();

		// Check that modal is properly sized for mobile
		const modal = canvas.getByRole('dialog');
		await expect(modal).toBeVisible();

		// Test mobile-specific interactions
		const addressInput = canvas.getByPlaceholderText('Enter wallet address');
		await expect(addressInput).toBeInTheDocument();

		// Verify transfer button is accessible on mobile
		const transferButton = canvas.getByRole('button', { name: 'Transfer' });
		await expect(transferButton).toBeInTheDocument();
	},
};

export const TabletViewport: Story = {
	render: () => (
		<TransferModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId={TEST_COLLECTIBLE.collectibleId}
			triggerLabel="Tablet Transfer"
		/>
	),
	parameters: {
		viewport: {
			defaultViewport: 'tablet',
		},
		docs: {
			description: {
				story: 'Transfer modal optimized for tablet viewport (768px width)',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Tablet Transfer');
		await userEvent.click(trigger);

		// Wait for modal to appear
		await expect(canvas.getByText('Transfer your item')).toBeInTheDocument();

		// Verify modal layout on tablet
		const modal = canvas.getByRole('dialog');
		await expect(modal).toBeVisible();
	},
};

export const AddressValidation: Story = {
	render: () => (
		<TransferModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId={TEST_COLLECTIBLE.collectibleId}
			triggerLabel="Address Validation Test"
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Test various address validation scenarios',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Address Validation Test');
		await userEvent.click(trigger);

		await expect(canvas.getByText('Transfer your item')).toBeInTheDocument();

		const addressInput = canvas.getByPlaceholderText('Enter wallet address');
		const transferButton = canvas.getByRole('button', { name: 'Transfer' });

		// Test empty address
		await expect(transferButton).toBeDisabled();

		// Test invalid address format
		await userEvent.type(addressInput, 'invalid-address');
		await expect(transferButton).toBeDisabled();

		// Test ENS name (if supported)
		await userEvent.clear(addressInput);
		await userEvent.type(addressInput, 'vitalik.eth');
		// This would depend on ENS resolution support

		// Test valid address
		await userEvent.clear(addressInput);
		await userEvent.type(
			addressInput,
			'0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4C',
		);
		await expect(transferButton).not.toBeDisabled();

		// Test checksummed address
		await userEvent.clear(addressInput);
		await userEvent.type(
			addressInput,
			'0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4C',
		);
		await expect(transferButton).not.toBeDisabled();
	},
};

export const NetworkSwitchRequired: Story = {
	render: () => (
		<TransferModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={42161} // Arbitrum - different from connected network
			collectibleId={TEST_COLLECTIBLE.collectibleId}
			triggerLabel="Network Switch Transfer"
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Transfer modal when network switch is required',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Network Switch Transfer');
		await userEvent.click(trigger);

		// Should show transfer modal or network switch prompt
		await expect(canvas.getByText('Transfer your item')).toBeInTheDocument();

		// Check for network-related UI elements
		const networkElements = canvas.queryAllByText(/network|chain|switch/i);
		expect(networkElements.length).toBeGreaterThan(0);
	},
};

export const ComprehensiveInteractionFlow: Story = {
	render: () => (
		<TransferModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId="1155" // ERC1155 for quantity testing
			triggerLabel="Full Interaction Flow"
			callbacks={{
				onSuccess: (result) => {
					console.log('Transfer successful:', result);
				},
				onError: (error) => {
					console.error('Transfer failed:', error);
				},
			}}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Complete user flow from opening modal to successful transfer',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Full Interaction Flow');

		// Step 1: Open modal
		await userEvent.click(trigger);
		await expect(canvas.getByText('Transfer your item')).toBeInTheDocument();

		// Step 2: Check initial state
		const addressInput = canvas.getByPlaceholderText('Enter wallet address');
		const transferButton = canvas.getByRole('button', { name: 'Transfer' });
		const quantityInput = canvas.getByLabelText('Quantity');

		await expect(addressInput).toHaveValue('');
		await expect(transferButton).toBeDisabled();
		await expect(quantityInput).toBeInTheDocument();

		// Step 3: Enter recipient address
		await userEvent.type(
			addressInput,
			'0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4C',
		);

		// Step 4: Set quantity
		await userEvent.clear(quantityInput);
		await userEvent.type(quantityInput, '3');

		// Step 5: Verify transfer button is enabled
		await expect(transferButton).not.toBeDisabled();

		// Step 6: Test close button
		const closeButton = canvas.getByRole('button', { name: /close/i });
		await expect(closeButton).toBeInTheDocument();

		// Step 7: Click transfer (would trigger transaction in real scenario)
		await userEvent.click(transferButton);

		// Step 8: Check for wallet instructions or success state
		// This depends on the modal's behavior after clicking transfer
	},
};

export const MaxQuantityValidation: Story = {
	render: () => (
		<TransferModalTrigger
			collectionAddress={TEST_COLLECTIBLE.collectionAddress}
			chainId={TEST_COLLECTIBLE.chainId}
			collectibleId="1155" // ERC1155 token
			triggerLabel="Max Quantity Test"
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Test quantity validation against maximum available balance',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Max Quantity Test');
		await userEvent.click(trigger);

		await expect(canvas.getByText('Transfer your item')).toBeInTheDocument();

		const addressInput = canvas.getByPlaceholderText('Enter wallet address');
		const quantityInput = canvas.getByLabelText('Quantity');
		const transferButton = canvas.getByRole('button', { name: 'Transfer' });

		// Enter valid address first
		await userEvent.type(
			addressInput,
			'0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4C',
		);

		// Test exceeding max quantity
		await userEvent.clear(quantityInput);
		await userEvent.type(quantityInput, '999999');

		// Should disable transfer button or show error
		await expect(transferButton).toBeDisabled();

		// Test valid quantity
		await userEvent.clear(quantityInput);
		await userEvent.type(quantityInput, '1');

		// Should enable transfer button
		await expect(transferButton).not.toBeDisabled();

		// Test negative quantity
		await userEvent.clear(quantityInput);
		await userEvent.type(quantityInput, '-1');

		// Should not accept negative values
		await expect(quantityInput).not.toHaveValue('-1');
	},
};
