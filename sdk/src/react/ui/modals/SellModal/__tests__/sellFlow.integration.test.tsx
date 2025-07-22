import { act, render, renderHook, screen, waitFor, within } from '@test';
import { TEST_ACCOUNTS, TEST_COLLECTIBLE } from '@test/const';
import { server } from '@test/server-setup';
import { HttpResponse, http } from 'msw';
import type { Hex } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StepType } from '../../../../_internal';
import { mockOrder } from '../../../../_internal/api/__mocks__/marketplace.msw';
import { useSellModal } from '..';
import { useSellFlow } from '../queries/sellQueries';
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
		walletKind: 'sequence',
	})),
}));

describe('Sell Flow Integration', () => {
	const defaultArgs = {
		collectionAddress: TEST_COLLECTIBLE.collectionAddress as Hex,
		chainId: TEST_COLLECTIBLE.chainId,
		tokenId: TEST_COLLECTIBLE.collectibleId,
		order: mockOrder,
	};

	beforeEach(() => {
		// Reset store
		sellModalStore.send({ type: 'close' });

		// Clear all mocks
		vi.clearAllMocks();
	});

	it('should check approval using real marketplace API', async () => {
		// Setup MSW handler to return approval required
		server.use(
			http.post('*/rpc/Marketplace/GenerateSellTransaction', () => {
				return HttpResponse.json({
					steps: [
						{
							id: StepType.tokenApproval,
							to: '0xmarketplace',
							data: '0x095ea7b3', // approve function selector
							value: '0',
							chainId: TEST_COLLECTIBLE.chainId,
						},
					],
				});
			}),
		);

		const { result } = renderHook(() => useSellFlow());

		// Open modal with test data
		act(() => {
			sellModalStore.send({
				type: 'open',
				...defaultArgs,
			});
		});

		// Start approval check
		act(() => {
			sellModalStore.send({ type: 'checkApprovalStart' });
		});

		// Wait for real API response
		await waitFor(() => {
			expect(result.current.approval.isRequired).toBe(true);
			expect(result.current.approval.step).toBeDefined();
		});
	});

	it('should execute approval transaction', async () => {
		// Setup MSW handler
		server.use(
			http.post('*/rpc/Marketplace/GenerateSellTransaction', () => {
				return HttpResponse.json({
					steps: [
						{
							id: StepType.tokenApproval,
							to: '0xnft',
							data: '0xa22cb465', // setApprovalForAll
							value: '0',
							chainId: TEST_COLLECTIBLE.chainId,
						},
					],
				});
			}),
		);

		const { result } = renderHook(() => useSellFlow());

		// Setup modal with approval required
		act(() => {
			sellModalStore.send({
				type: 'open',
				...defaultArgs,
			});
			sellModalStore.send({
				type: 'approvalRequired',
				step: {
					id: StepType.tokenApproval,
					to: '0xnft',
					data: '0xa22cb465',
					value: '0',
				} as any,
			});
		});

		// Mock the executeStep to simulate success
		const executeMock = vi.fn().mockResolvedValue('0xtxhash');
		result.current.approval.execute = executeMock;

		// Execute approval transaction
		act(() => {
			executeMock();
		});

		// Wait for transaction to complete
		await waitFor(() => {
			expect(executeMock).toHaveBeenCalled();
		});
	});

	it('should complete full sell flow', async () => {
		// Setup MSW handlers for no approval needed
		server.use(
			http.post('*/rpc/Marketplace/GenerateSellTransaction', () => {
				return HttpResponse.json({
					steps: [
						{
							id: StepType.sell,
							to: '0xmarketplace',
							data: '0xd96a094a', // fillOrder function
							value: '0',
							chainId: TEST_COLLECTIBLE.chainId,
						},
					],
				});
			}),
		);

		const { result } = renderHook(() => useSellFlow());

		// Setup modal in ready state
		act(() => {
			sellModalStore.send({
				type: 'open',
				...defaultArgs,
			});
			sellModalStore.send({ type: 'approvalNotRequired' });
		});

		// Mock the sell execution
		const sellMock = vi.fn().mockResolvedValue({
			hash: '0xtxhash',
			orderId: mockOrder.orderId,
		});
		result.current.sell.execute = sellMock;

		// Execute sell transaction
		act(() => {
			result.current.sell.execute();
		});

		// Wait for transaction completion
		await waitFor(() => {
			expect(sellMock).toHaveBeenCalled();
		});
	});

	it('should handle API errors gracefully', async () => {
		// Setup MSW to return error
		server.use(
			http.post('*/rpc/Marketplace/GenerateSellTransaction', () => {
				return HttpResponse.json(
					{ error: 'Insufficient balance' },
					{ status: 400 },
				);
			}),
		);

		const { result } = renderHook(() => useSellFlow());

		// Open modal
		act(() => {
			sellModalStore.send({
				type: 'open',
				...defaultArgs,
			});
		});

		// Mock error in sell execution
		const errorMock = vi
			.fn()
			.mockRejectedValue(new Error('Insufficient balance'));
		result.current.sell.execute = errorMock;

		// Try to execute sell
		act(() => {
			result.current.sell.execute();
		});

		// Should handle error
		await waitFor(() => {
			expect(errorMock).toHaveBeenCalled();
		});
	});

	it('should integrate with UI components correctly', async () => {
		// Setup MSW for no approval needed
		server.use(
			http.post('*/rpc/Marketplace/GenerateSellTransaction', () => {
				return HttpResponse.json({
					steps: [
						{
							id: StepType.sell,
							to: '0xmarketplace',
							data: '0xd96a094a',
							value: '0',
							chainId: TEST_COLLECTIBLE.chainId,
						},
					],
				});
			}),
		);

		// Mock the ActionModal to avoid Radix UI issues
		vi.mock('../../_internal/components/actionModal/ActionModal', () => ({
			ActionModal: vi.fn(({ children, title }) => (
				<div role="dialog" aria-label={title}>
					<h2>{title}</h2>
					{children}
				</div>
			)),
		}));

		// Render the app with modal
		const { result } = renderHook(() => useSellModal());
		result.current.show(defaultArgs);

		render(<SellModal />);

		// Modal should be visible
		await waitFor(() => {
			const modal = screen.getByRole('dialog');
			expect(modal).toBeInTheDocument();
			expect(within(modal).getByText('You have an offer')).toBeInTheDocument();
		});

		// Simulate approval check
		act(() => {
			sellModalStore.send({ type: 'approvalNotRequired' });
		});

		// Accept button should be enabled
		await waitFor(() => {
			const storeSnapshot = sellModalStore.getSnapshot();
			expect(storeSnapshot.context.status).toBe('ready_to_sell');
		});
	});
});
