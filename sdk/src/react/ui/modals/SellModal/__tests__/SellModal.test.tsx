import {
	act,
	cleanup,
	fireEvent,
	render,
	renderHook,
	screen,
	waitFor,
	within,
} from '@test';
import { TEST_COLLECTIBLE } from '@test/const';
import { server } from '@test/server-setup';
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
			address: '0x123',
			isConnected: true,
			isConnecting: false,
			isDisconnected: false,
			isReconnecting: false,
			status: 'connected',
			connector: null,
		})),
	};
});

// Mock the hooks that might cause infinite loops
vi.mock('../hooks/useLoadData', () => ({
	useLoadData: vi.fn(() => ({
		collection: { name: 'Test Collection' },
		collectible: { name: 'Test Token' },
		currency: {
			imageUrl: 'https://example.com/currency.png',
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
	ActionModal: vi.fn(({ children, ctas, title }) => (
		<div data-testid="action-modal" role="dialog" aria-label={title}>
			<h2>{title}</h2>
			{children}
			{ctas
				?.filter((cta: any) => !cta.hidden)
				.map((cta: any, index: number) => (
					<button key={index} onClick={cta.onClick} disabled={cta.disabled}>
						{cta.label}
					</button>
				))}
		</div>
	)),
}));

const defaultArgs = {
	collectionAddress: TEST_COLLECTIBLE.collectionAddress,
	chainId: TEST_COLLECTIBLE.chainId,
	tokenId: TEST_COLLECTIBLE.collectibleId,
	order: mockOrder,
};

describe('SellModal', () => {
	beforeEach(() => {
		cleanup();
		// Reset all mocks
		vi.clearAllMocks();
		// Reset store to initial state
		sellModalStore.send({ type: 'close' });

		// Setup default MSW handlers
		server.use(
			http.post('*/rpc/Marketplace/GenerateSellTransaction', () => {
				return HttpResponse.json({
					steps: [], // No approval needed by default
				});
			}),
		);
	});

	afterEach(() => {
		// Ensure store is closed after each test
		sellModalStore.send({ type: 'close' });
	});

	it('should render modal with proper accessibility', async () => {
		// Open modal
		const { result } = renderHook(() => useSellModal());
		result.current.show(defaultArgs);

		render(<SellModal />);

		// Wait for modal to appear
		await waitFor(() => {
			const modal = screen.getByRole('dialog');
			expect(modal).toBeInTheDocument();
			expect(modal).toHaveAttribute('aria-label', 'You have an offer');
		});

		// Check modal content
		const modal = screen.getByRole('dialog');
		expect(within(modal).getByText('You have an offer')).toBeInTheDocument();
	});

	it('should handle approval flow with real UI interactions', async () => {
		// Setup MSW to return approval required
		server.use(
			http.post('*/rpc/Marketplace/GenerateSellTransaction', () => {
				return HttpResponse.json({
					steps: [
						{
							id: StepType.tokenApproval,
							to: '0xmarketplace',
							data: '0xapprovaldata',
						},
					],
				});
			}),
		);

		// Mock useSellFlow to return approval required
		vi.mock('../queries/sellQueries', () => ({
			useSellFlow: vi.fn(() => ({
				approval: {
					isRequired: true,
					isChecking: false,
					isExecuting: false,
					execute: vi.fn(),
					step: {
						id: StepType.tokenApproval,
						to: '0xmarketplace',
						data: '0xapprovaldata',
					},
				},
				sell: {
					execute: vi.fn(),
					isExecuting: false,
				},
			})),
		}));

		// Open modal
		const { result } = renderHook(() => useSellModal());
		result.current.show(defaultArgs);

		render(<SellModal />);

		// Simulate approval required state
		act(() => {
			sellModalStore.send({
				type: 'approvalRequired',
				step: {
					id: StepType.tokenApproval,
					to: '0xmarketplace',
					data: '0xapprovaldata',
				} as any,
			});
		});

		// Wait for approval button to appear
		await waitFor(() => {
			const buttons = screen.getAllByRole('button');
			const approveButton = buttons.find((btn) =>
				btn.textContent?.includes('Approve'),
			);
			expect(approveButton).toBeInTheDocument();
			expect(approveButton).toBeEnabled();
		});

		// Accept button should be disabled
		const acceptButton = screen.getByRole('button', { name: 'Accept' });
		expect(acceptButton).toBeDisabled();
	});

	it('should show WaaS fee options in real modal', async () => {
		// Mock useConnectorMetadata for WaaS wallet
		const { useConnectorMetadata } = vi.mocked(
			await import('../../../../hooks/config/useConnectorMetadata'),
		);
		useConnectorMetadata.mockReturnValue({
			isWaaS: true,
			isSequence: true,
			walletKind: WalletKind.sequence,
		});

		// Open modal in ready state
		const { result } = renderHook(() => useSellModal());
		result.current.show(defaultArgs);

		render(<SellModal />);

		// Set modal to ready state
		act(() => {
			sellModalStore.send({ type: 'approvalNotRequired' });
		});

		// Wait for Accept button to be enabled
		await waitFor(() => {
			const acceptButton = screen.getByRole('button', { name: 'Accept' });
			expect(acceptButton).toBeEnabled();
		});

		// Click Accept to trigger fee selection
		const acceptButton = screen.getByRole('button', { name: 'Accept' });
		fireEvent.click(acceptButton);

		// Fee options should appear in the modal
		await waitFor(() => {
			const storeSnapshot = sellModalStore.getSnapshot();
			expect(storeSnapshot.context.status).toBe('selecting_fees');
			expect(storeSnapshot.context.feeOptionsVisible).toBe(true);
		});
	});

	it('should handle error state properly', async () => {
		// Open modal
		const { result } = renderHook(() => useSellModal());
		result.current.show(defaultArgs);

		render(<SellModal />);

		// Simulate error state
		const testError = new Error('Transaction failed');
		act(() => {
			sellModalStore.send({
				type: 'errorOccurred',
				error: testError,
			});
		});

		// Should show error state
		await waitFor(() => {
			const storeSnapshot = sellModalStore.getSnapshot();
			expect(storeSnapshot.context.status).toBe('error');
			expect(storeSnapshot.context.error).toBe(testError);
		});
	});

	it('should handle successful completion', async () => {
		// Open modal
		const { result } = renderHook(() => useSellModal());
		const onSuccess = vi.fn();
		result.current.show({
			...defaultArgs,
			onSuccess,
		});

		render(<SellModal />);

		// Simulate successful completion
		act(() => {
			sellModalStore.send({
				type: 'sellCompleted',
				hash: '0xtxhash' as any,
				orderId: mockOrder.orderId,
			});
		});

		// Should show completed state
		await waitFor(() => {
			const storeSnapshot = sellModalStore.getSnapshot();
			expect(storeSnapshot.context.status).toBe('completed');
		});

		// Callback should have been called
		expect(onSuccess).toHaveBeenCalledWith({
			hash: '0xtxhash',
			orderId: mockOrder.orderId,
		});
	});
});
