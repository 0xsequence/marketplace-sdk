import {
	act,
	fireEvent,
	render,
	renderHook,
	screen,
	waitFor,
	within,
} from '@test';
import { TEST_ACCOUNTS, TEST_COLLECTIBLE } from '@test/const';
import { server } from '@test/server-setup';
import { HttpResponse, http } from 'msw';
import type { Hex } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StepType, WalletKind } from '../../../../_internal';
import { mockOrder } from '../../../../_internal/api/__mocks__/marketplace.msw';
import { useSellModal } from '..';
import { SellModal } from '../SellModal';
import { sellModalStore } from '../store/sellModalStore';

// Mock wagmi at module level
vi.mock('wagmi', async () => {
	const actual = await vi.importActual('wagmi');
	return {
		...actual,
		useAccount: vi.fn(() => ({
			address: TEST_ACCOUNTS[1],
			isConnected: true,
			isConnecting: false,
			isDisconnected: false,
			isReconnecting: false,
			status: 'connected',
			connector: { id: 'sequence' },
		})),
	};
});

// Mock the hooks that might cause infinite loops
vi.mock('../hooks/useLoadData', () => ({
	useLoadData: vi.fn(() => ({
		collection: { name: 'Test Collection' },
		collectible: { name: 'Test NFT #1' },
		currency: {
			imageUrl: 'https://example.com/eth.png',
			symbol: 'ETH',
			decimals: 18,
		},
		isError: false,
		isLoading: false,
	})),
}));

// Mock the useConnectorMetadata hook
vi.mock('../../../../hooks/config/useConnectorMetadata', () => ({
	useConnectorMetadata: vi.fn(() => ({
		isWaaS: false,
		isSequence: true,
		walletKind: WalletKind.sequence,
	})),
}));

// Mock the ActionModal to prevent Radix UI issues
vi.mock('../../_internal/components/actionModal/ActionModal', () => ({
	ActionModal: vi.fn(({ children, ctas, title, onClose }) => (
		<div data-testid="action-modal" role="dialog" aria-label={title}>
			<button onClick={onClose} aria-label="Close">
				×
			</button>
			<h2>{title}</h2>
			{children}
			<div data-testid="modal-actions">
				{ctas
					?.filter((cta: any) => !cta.hidden)
					.map((cta: any, index: number) => (
						<button
							key={index}
							onClick={cta.onClick}
							disabled={cta.disabled}
							data-testid={`action-${cta.label.toLowerCase().replace(/\s+/g, '-')}`}
						>
							{cta.label}
						</button>
					))}
			</div>
		</div>
	)),
}));

// Mock the fee options component
vi.mock('../../_internal/components/selectWaasFeeOptions', () => ({
	default: vi.fn((props) => (
		<div data-testid="waas-fee-options">
			<h3>Select Fee Option</h3>
			<label>
				<input type="radio" name="fee" value="eth" defaultChecked />
				ETH
			</label>
			<label>
				<input type="radio" name="fee" value="usdc" />
				USDC
			</label>
			<button onClick={() => props.onConfirm?.({ token: 'ETH' } as any)}>
				Confirm
			</button>
		</div>
	)),
	SelectWaasFeeOptions: vi.fn((props) => (
		<div data-testid="waas-fee-options">
			<h3>Select Fee Option</h3>
			<label>
				<input type="radio" name="fee" value="eth" defaultChecked />
				ETH
			</label>
			<label>
				<input type="radio" name="fee" value="usdc" />
				USDC
			</label>
			<button onClick={() => props.onConfirm?.({ token: 'ETH' } as any)}>
				Confirm
			</button>
		</div>
	)),
}));

describe('Sell Modal E2E', () => {
	const defaultArgs = {
		collectionAddress: TEST_COLLECTIBLE.collectionAddress as Hex,
		chainId: TEST_COLLECTIBLE.chainId,
		tokenId: TEST_COLLECTIBLE.collectibleId,
		order: {
			...mockOrder,
			priceAmountFormatted: '1.0',
			priceCurrencyAddress: '0x0000000000000000000000000000000000000000' as Hex,
		},
	};

	beforeEach(() => {
		// Reset store
		sellModalStore.send({ type: 'close' });

		// Clear all mocks
		vi.clearAllMocks();

		// Setup default MSW handlers
		server.resetHandlers();
	});

	it('should complete full sell flow from UI to completion', async () => {
		// Setup MSW handlers for the full flow
		server.use(
			// First call - check approval
			http.post('*/rpc/Marketplace/GenerateSellTransaction', () => {
				return HttpResponse.json({
					steps: [
						{
							id: StepType.tokenApproval,
							to: '0xmarketplace',
							data: '0xa22cb465',
							value: '0',
						},
					],
				});
			}),
		);

		// Render the modal
		render(<SellModal />);

		// Open modal using the hook
		const { result } = renderHook(() => useSellModal());
		act(() => {
			result.current.show(defaultArgs);
		});

		// Modal should open with order details
		const modal = await screen.findByRole('dialog', {
			name: 'You have an offer',
		});
		expect(within(modal).getByText('You have an offer')).toBeInTheDocument();
		expect(within(modal).getByText('Offer received')).toBeInTheDocument();

		// Simulate approval check
		act(() => {
			sellModalStore.send({ type: 'checkApprovalStart' });
		});

		// Wait for approval to be required
		await waitFor(() => {
			sellModalStore.send({
				type: 'approvalRequired',
				step: {
					id: StepType.tokenApproval,
					to: '0xmarketplace',
					data: '0xa22cb465',
					value: '0',
				} as any,
			});
		});

		// Approve button should appear
		const approveButton = await screen.findByTestId('action-approve-eth');
		expect(approveButton).toBeInTheDocument();
		expect(approveButton).toBeEnabled();

		// Accept button should be disabled
		const acceptButton = screen.getByTestId('action-accept');
		expect(acceptButton).toBeDisabled();

		// Click approve
		fireEvent.click(approveButton);

		// Simulate approval transaction
		act(() => {
			sellModalStore.send({ type: 'startApproval' });
		});

		// Wait and complete approval
		await waitFor(() => {
			act(() => {
				sellModalStore.send({ type: 'approvalCompleted' });
			});
		});

		// Now accept button should be enabled
		await waitFor(() => {
			const updatedAcceptButton = screen.getByTestId('action-accept');
			expect(updatedAcceptButton).toBeEnabled();
		});

		// Update MSW to return sell step
		server.use(
			http.post('*/rpc/Marketplace/GenerateSellTransaction', () => {
				return HttpResponse.json({
					steps: [
						{
							id: StepType.sell,
							to: '0xmarketplace',
							data: '0xselldata',
							value: '0',
						},
					],
				});
			}),
		);

		// Click Accept
		const enabledAcceptButton = screen.getByTestId('action-accept');
		fireEvent.click(enabledAcceptButton);

		// Simulate sell execution
		act(() => {
			sellModalStore.send({ type: 'startSell' });
		});

		// Wait a bit for the state to update
		await waitFor(() => {
			const state = sellModalStore.getSnapshot().context;
			expect(state.status).toBe('executing');
		});

		// Complete the sale
		act(() => {
			sellModalStore.send({
				type: 'sellCompleted',
				hash: '0xtxhash' as Hex,
				orderId: defaultArgs.order.orderId,
			});
		});

		// Should show success state
		await waitFor(() => {
			const state = sellModalStore.getSnapshot().context;
			if (state.status === 'error') {
				console.error('Error state:', state.error);
			}
			expect(state.status).toBe('completed');
		});
	});

	it('should handle WaaS fee selection flow', async () => {
		// Mock WaaS connector
		const { useConnectorMetadata } = vi.mocked(
			await import('../../../../hooks/config/useConnectorMetadata'),
		);
		useConnectorMetadata.mockReturnValue({
			isWaaS: true,
			isSequence: true,
			walletKind: WalletKind.sequence,
		});

		// Setup MSW for no approval needed
		server.use(
			http.post('*/rpc/Marketplace/GenerateSellTransaction', () => {
				return HttpResponse.json({
					steps: [
						{
							id: StepType.sell,
							to: '0xmarketplace',
							data: '0xselldata',
							value: '0',
						},
					],
				});
			}),
		);

		// Render and open modal
		render(<SellModal />);
		const { result } = renderHook(() => useSellModal());
		act(() => {
			result.current.show(defaultArgs);
		});

		// Set to ready state
		act(() => {
			sellModalStore.send({ type: 'approvalNotRequired' });
		});

		// Accept button should be enabled
		const acceptButton = await screen.findByTestId('action-accept');
		expect(acceptButton).toBeEnabled();

		// Click Accept - should show fee options
		fireEvent.click(acceptButton);

		// Fee options should appear
		await waitFor(() => {
			const state = sellModalStore.getSnapshot().context;
			expect(state.status).toBe('selecting_fees');
			expect(state.feeOptionsVisible).toBe(true);
		});

		// Fee options UI should be visible
		const feeOptions = await screen.findByTestId('waas-fee-options');
		expect(feeOptions).toBeInTheDocument();

		// Select ETH and confirm
		const confirmButton = within(feeOptions).getByText('Confirm');
		fireEvent.click(confirmButton);

		// The fee selection component should handle the fee selection
		// but since we're mocking it, we need to manually hide the fee options
		act(() => {
			sellModalStore.send({ type: 'hideFeeOptions' });
		});

		// After fee selection, should go back to ready state
		await waitFor(() => {
			const state = sellModalStore.getSnapshot().context;
			expect(state.feeOptionsVisible).toBe(false);
		});

		// Now trigger the actual sell
		act(() => {
			sellModalStore.send({ type: 'startSell' });
		});

		// Should proceed with sell
		await waitFor(() => {
			const state = sellModalStore.getSnapshot().context;
			expect(state.status).toBe('executing');
		});
	});

	it('should handle errors gracefully', async () => {
		// Setup MSW to return error
		server.use(
			http.post('*/rpc/Marketplace/GenerateSellTransaction', () => {
				return HttpResponse.json(
					{ error: 'Insufficient funds for gas' },
					{ status: 400 },
				);
			}),
		);

		// Render and open modal
		render(<SellModal />);
		const { result } = renderHook(() => useSellModal());
		act(() => {
			result.current.show(defaultArgs);
		});

		// Set to ready state
		act(() => {
			sellModalStore.send({ type: 'approvalNotRequired' });
		});

		// Try to sell
		const acceptButton = await screen.findByTestId('action-accept');
		fireEvent.click(acceptButton);

		// Simulate error
		act(() => {
			sellModalStore.send({
				type: 'errorOccurred',
				error: new Error('Insufficient funds for gas'),
			});
		});

		// Should show error state
		await waitFor(() => {
			const state = sellModalStore.getSnapshot().context;
			expect(state.status).toBe('error');
			expect(state.error?.message).toBe('Insufficient funds for gas');
		});
	});

	it('should allow closing the modal at any time', async () => {
		// Render and open modal
		render(<SellModal />);
		const { result } = renderHook(() => useSellModal());
		act(() => {
			result.current.show(defaultArgs);
		});

		// Modal should be open
		const modal = await screen.findByRole('dialog');
		expect(modal).toBeInTheDocument();

		// Find and click close button
		const closeButton = screen.getByLabelText('Close');
		fireEvent.click(closeButton);

		// Modal should close
		await waitFor(() => {
			const state = sellModalStore.getSnapshot().context;
			expect(state.isOpen).toBe(false);
		});
	});
});
