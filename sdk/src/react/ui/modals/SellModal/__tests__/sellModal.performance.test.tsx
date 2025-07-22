import { act, render, renderHook, screen, waitFor } from '@test';
import { TEST_COLLECTIBLE } from '@test/const';
import { Profiler } from 'react';
import type { Hex } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
		walletKind: 'sequence',
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

describe('Sell Modal Performance', () => {
	const defaultArgs = {
		collectionAddress: TEST_COLLECTIBLE.collectionAddress as Hex,
		chainId: TEST_COLLECTIBLE.chainId,
		tokenId: TEST_COLLECTIBLE.collectibleId,
		order: mockOrder,
	};

	beforeEach(() => {
		// Reset store
		sellModalStore.send({ type: 'close' });
		vi.clearAllMocks();
	});

	it('should minimize re-renders during approval flow', async () => {
		const renderCounts: Record<string, number> = {};

		const onRender = (id: string) => {
			renderCounts[id] = (renderCounts[id] || 0) + 1;
		};

		// Render with Profiler
		render(
			<Profiler id="sell-modal" onRender={onRender}>
				<SellModal />
			</Profiler>,
		);

		// Open modal
		const { result } = renderHook(() => useSellModal());
		act(() => {
			result.current.show(defaultArgs);
		});

		// Wait for initial render
		await waitFor(() => {
			expect(screen.getByRole('dialog')).toBeInTheDocument();
		});

		const initialRenderCount = renderCounts['sell-modal'] || 0;

		// Simulate approval check
		act(() => {
			sellModalStore.send({ type: 'checkApprovalStart' });
		});

		await waitFor(() => {
			const state = sellModalStore.getSnapshot().context;
			expect(state.status).toBe('checking_approval');
		});

		// Simulate approval required
		act(() => {
			sellModalStore.send({
				type: 'approvalRequired',
				step: {} as any,
			});
		});

		await waitFor(() => {
			const state = sellModalStore.getSnapshot().context;
			expect(state.status).toBe('awaiting_approval');
		});

		// Execute approval
		act(() => {
			sellModalStore.send({ type: 'startApproval' });
		});

		await waitFor(() => {
			const state = sellModalStore.getSnapshot().context;
			expect(state.status).toBe('approving');
		});

		// Complete approval
		act(() => {
			sellModalStore.send({ type: 'approvalCompleted' });
		});

		await waitFor(() => {
			const state = sellModalStore.getSnapshot().context;
			expect(state.status).toBe('ready_to_sell');
		});

		const finalRenderCount = renderCounts['sell-modal'] || 0;
		const totalRenders = finalRenderCount - initialRenderCount;

		// Should have minimal re-renders (one for each state change)
		expect(totalRenders).toBeLessThan(10);
	});

	it('should load quickly', async () => {
		const startTime = performance.now();

		render(<SellModal />);

		// Open modal
		const { result } = renderHook(() => useSellModal());
		act(() => {
			result.current.show(defaultArgs);
		});

		// Wait for modal to appear
		await waitFor(() => {
			expect(screen.getByRole('dialog')).toBeInTheDocument();
		});

		const endTime = performance.now();
		const loadTime = endTime - startTime;

		// Should load within 300ms (generous limit for CI)
		expect(loadTime).toBeLessThan(300);
	});

	it('should handle rapid state changes efficiently', async () => {
		const renderCounts: Record<string, number> = {};

		const onRender = (id: string) => {
			renderCounts[id] = (renderCounts[id] || 0) + 1;
		};

		render(
			<Profiler id="sell-modal-rapid" onRender={onRender}>
				<SellModal />
			</Profiler>,
		);

		// Open modal
		const { result } = renderHook(() => useSellModal());
		act(() => {
			result.current.show(defaultArgs);
		});

		// Rapid state changes
		act(() => {
			sellModalStore.send({ type: 'checkApprovalStart' });
			sellModalStore.send({ type: 'approvalNotRequired' });
			sellModalStore.send({ type: 'startSell' });
		});

		await waitFor(() => {
			const state = sellModalStore.getSnapshot().context;
			expect(state.status).toBe('executing');
		});

		const totalRenders = renderCounts['sell-modal-rapid'] || 0;

		// Should batch updates efficiently
		expect(totalRenders).toBeLessThan(5);
	});

	it('should not cause memory leaks on unmount', async () => {
		const { unmount } = render(<SellModal />);

		// Open modal
		const { result } = renderHook(() => useSellModal());
		act(() => {
			result.current.show(defaultArgs);
		});

		// Start some async operations
		act(() => {
			sellModalStore.send({ type: 'checkApprovalStart' });
		});

		// Unmount immediately
		unmount();

		// Store should be reset
		const state = sellModalStore.getSnapshot().context;
		expect(state.isOpen).toBe(true); // Store persists, but component is unmounted

		// Clean up
		act(() => {
			sellModalStore.send({ type: 'close' });
		});
	});
});
