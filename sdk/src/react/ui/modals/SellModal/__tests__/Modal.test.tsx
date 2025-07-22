import { cleanup, render, renderHook, screen, waitFor } from '@test';
import { TEST_COLLECTIBLE } from '@test/const';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WalletKind } from '../../../../_internal';
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

// Mock the queries to prevent actual API calls
vi.mock('../queries/sellQueries', () => ({
	useCheckSellApproval: vi.fn(() => ({
		data: { required: false, step: null },
		isLoading: false,
		isError: false,
	})),
	useExecuteApproval: vi.fn(() => ({
		mutate: vi.fn(),
		isLoading: false,
		isError: false,
	})),
	useExecuteSellTransaction: vi.fn(() => ({
		mutate: vi.fn(),
		isLoading: false,
		isError: false,
	})),
	useSellFlow: vi.fn(() => ({
		approval: {
			isRequired: false,
			isChecking: false,
			isExecuting: false,
			execute: vi.fn(),
		},
		sell: {
			execute: vi.fn(),
			isExecuting: false,
		},
	})),
}));

// Mock the ActionModal to prevent Radix UI issues
vi.mock('../../_internal/components/actionModal/ActionModal', () => ({
	ActionModal: vi.fn(({ children, ctas, title }) => (
		<div data-testid="action-modal">
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
		vi.resetAllMocks();
		vi.restoreAllMocks();
		// Reset store to initial state
		sellModalStore.send({ type: 'close' });
	});

	it('should show main button if there is no approval step', async () => {
		// Mock sequence wallet
		const { useAccount } = vi.mocked(await import('wagmi'));
		useAccount.mockReturnValue({
			address: '0x123',
			connector: { id: 'sequence' },
			isConnected: true,
			isConnecting: false,
			isDisconnected: false,
			isReconnecting: false,
			status: 'connected',
		} as any);

		// Mock useConnectorMetadata for sequence wallet
		const { useConnectorMetadata } = vi.mocked(
			await import('../../../../hooks/config/useConnectorMetadata'),
		);
		useConnectorMetadata.mockReturnValue({
			isWaaS: false,
			isSequence: true,
			walletKind: WalletKind.sequence,
		});

		// Mock useSellFlow to return no approval required
		const { useSellFlow } = vi.mocked(await import('../queries/sellQueries'));
		useSellFlow.mockReturnValue({
			approval: {
				isRequired: false,
				isChecking: false,
				isExecuting: false,
				execute: vi.fn(),
			},
			sell: {
				execute: vi.fn(),
				isExecuting: false,
			},
		} as any);

		// Render the modal
		const { result } = renderHook(() => useSellModal());
		result.current.show(defaultArgs);

		render(<SellModal />);

		// Simulate approval check completed with no approval needed
		sellModalStore.send({ type: 'approvalNotRequired' });

		// Wait for the component to update
		await waitFor(() => {
			// The Approve TOKEN button should not exist
			expect(screen.queryByText(/Approve/i)).toBeNull();

			// The Accept button should exist and be enabled
			const acceptButton = screen.getByRole('button', { name: 'Accept' });
			expect(acceptButton).toBeDefined();
			expect(acceptButton).not.toBeDisabled();
		});
	});

	it('(non-sequence wallets) should show approve token button if there is an approval step, disable main button', async () => {
		const { useAccount } = vi.mocked(await import('wagmi'));
		useAccount.mockReturnValue({
			address: '0x123',
			connector: { id: 'metamask' },
			isConnected: true,
			isConnecting: false,
			isDisconnected: false,
			isReconnecting: false,
			status: 'connected',
		} as any);

		// Mock useConnectorMetadata for non-sequence wallet
		const { useConnectorMetadata } = vi.mocked(
			await import('../../../../hooks/config/useConnectorMetadata'),
		);
		useConnectorMetadata.mockReturnValue({
			isWaaS: false,
			isSequence: false,
			walletKind: WalletKind.unknown,
		});

		// Mock useSellFlow to return approval required
		const { useSellFlow } = vi.mocked(await import('../queries/sellQueries'));
		useSellFlow.mockReturnValue({
			approval: {
				isRequired: true,
				isChecking: false,
				isExecuting: false,
				execute: vi.fn(),
			},
			sell: {
				execute: vi.fn(),
				isExecuting: false,
			},
		} as any);

		// Render the modal
		const { result } = renderHook(() => useSellModal());
		result.current.show(defaultArgs);

		render(<SellModal />);

		// Simulate approval check completed with approval needed
		sellModalStore.send({ type: 'approvalRequired', step: {} });

		await waitFor(() => {
			expect(screen.getByText(/Approve/i)).toBeDefined();

			expect(screen.getByRole('button', { name: 'Accept' })).toBeDefined();
			expect(screen.getByRole('button', { name: 'Accept' })).toBeDisabled();
		});
	});

	it('(WaaS wallets) should show fee options when Accept is clicked', async () => {
		const { useAccount } = vi.mocked(await import('wagmi'));
		useAccount.mockReturnValue({
			address: '0x123',
			connector: { id: 'sequence-waas' },
			isConnected: true,
			isConnecting: false,
			isDisconnected: false,
			isReconnecting: false,
			status: 'connected',
		} as any);

		// Mock useConnectorMetadata for WaaS wallet
		const { useConnectorMetadata } = vi.mocked(
			await import('../../../../hooks/config/useConnectorMetadata'),
		);
		useConnectorMetadata.mockReturnValue({
			isWaaS: true,
			isSequence: true,
			walletKind: WalletKind.sequence,
		});

		// Mock useSellFlow to return no approval required
		const { useSellFlow } = vi.mocked(await import('../queries/sellQueries'));
		useSellFlow.mockReturnValue({
			approval: {
				isRequired: false,
				isChecking: false,
				isExecuting: false,
				execute: vi.fn(),
			},
			sell: {
				execute: vi.fn(),
				isExecuting: false,
			},
		} as any);

		// Render the modal
		const { result } = renderHook(() => useSellModal());
		result.current.show(defaultArgs);

		render(<SellModal />);

		// Simulate approval check completed with no approval needed
		sellModalStore.send({ type: 'approvalNotRequired' });

		await waitFor(() => {
			// The Accept button should exist and be enabled
			const acceptButton = screen.getByRole('button', { name: 'Accept' });
			expect(acceptButton).toBeDefined();
			expect(acceptButton).not.toBeDisabled();
		});

		// Click the Accept button
		const acceptButton = screen.getByRole('button', { name: 'Accept' });
		acceptButton.click();

		// For WaaS wallets, it should show fee options
		await waitFor(() => {
			const storeSnapshot = sellModalStore.getSnapshot();
			expect(storeSnapshot.context.status).toBe('selecting_fees');
			expect(storeSnapshot.context.feeOptionsVisible).toBe(true);
		});
	});
});
