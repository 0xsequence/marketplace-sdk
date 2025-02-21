import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '../../_internal/test-utils';
import { useCancelOrder } from '../useCancelOrder';
import { MarketplaceKind } from '../../../types';
import { server } from '../../_internal/test/setup';
import { http, HttpResponse } from 'msw';
import { mockMarketplaceEndpoint } from '../../_internal/api/__mocks__/marketplace.msw';
import { useWallet } from '../../_internal/wallet/useWallet';
import {
	createMockWallet,
	commonWalletMocks,
} from '../../_internal/test/mocks/wallet';
import { StepType } from '../../_internal/api/marketplace.gen';

// Mock useWallet hook
vi.mock('../../_internal/wallet/useWallet');

// Mock @0xsequence/kit
vi.mock('@0xsequence/kit', () => ({
	useWaasFeeOptions: () => [null, vi.fn()],
	useChain: () => ({
		id: 1,
		name: 'Ethereum',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
	}),
}));

// Mock wagmi
vi.mock('wagmi', () => ({
	useAccount: () => ({
		address: '0x1234567890123456789012345678901234567890',
		isConnected: true,
	}),
	createConfig: () => ({
		chains: [
			{
				id: 1,
				name: 'Ethereum',
				nativeCurrency: {
					name: 'Ether',
					symbol: 'ETH',
					decimals: 18,
				},
			},
		],
		connectors: [],
		transports: {},
	}),
	http: () => ({}),
	WagmiProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('useCancelOrder', () => {
	const defaultProps = {
		collectionAddress: '0x1234567890123456789012345678901234567890',
		chainId: '1',
	};

	const mockOrderId = '0x9876543210987654321098765432109876543210';
	const mockTxHash = '0xabcd1234';

	// Create mock wallet instance with custom implementations
	const mockWallet = createMockWallet({
		getChainId: vi.fn().mockResolvedValue(1),
		address: vi
			.fn()
			.mockResolvedValue('0x1234567890123456789012345678901234567890'),
		handleSendTransactionStep: vi.fn().mockResolvedValue(mockTxHash),
		handleSignMessageStep: vi.fn().mockResolvedValue('0xsignature'),
		handleConfirmTransactionStep: vi.fn().mockResolvedValue(undefined),
		isWaaS: true,
		switchChain: vi.fn().mockResolvedValue(undefined),
	});

	beforeEach(() => {
		vi.clearAllMocks();

		// Set up the mock implementation for useWallet
		vi.mocked(useWallet).mockReturnValue({
			wallet: mockWallet,
			isLoading: false,
			isError: false,
		});

		// Mock default steps response
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateCancelTransaction'), () => {
				return HttpResponse.json({
					steps: [
						{
							id: StepType.cancel,
							data: '0x...',
							to: defaultProps.collectionAddress,
							value: '0',
							executeType: 'order',
						},
					],
				});
			}),
			http.post(mockMarketplaceEndpoint('Execute'), () => {
				return HttpResponse.json({
					orderId: mockOrderId,
					hash: mockTxHash,
				});
			}),
			http.post('*/GetTokenBalancesDetails', () => {
				return HttpResponse.json({
					page: { page: 1, pageSize: 10, more: false },
					balances: [],
					nativeBalances: [
						{
							balance: '2000000000000000000', // 2 ETH
							blockHash: '0x1234',
							blockNumber: 1234567,
						},
					],
				});
			}),
		);
	});

	afterEach(() => {
		server.resetHandlers();
		vi.clearAllMocks();
	});

	it('should initialize with default state', () => {
		const { result } = renderHook(() => useCancelOrder(defaultProps));

		expect(result.current.isExecuting).toBe(false);
		expect(result.current.cancellingOrderId).toBeNull();
	});

	it('should handle cancellation error', async () => {
		const onError = vi.fn();

		server.use(
			http.post(mockMarketplaceEndpoint('GenerateCancelTransaction'), () => {
				return HttpResponse.error();
			}),
		);

		const { result } = renderHook(() =>
			useCancelOrder({
				...defaultProps,
				onError,
			}),
		);

		try {
			await result.current.cancelOrder({
				orderId: mockOrderId,
				marketplace: MarketplaceKind.sequence_marketplace_v2,
			});
		} catch (error) {
			// Error is expected
		}

		await waitFor(() => {
			expect(onError).toHaveBeenCalled();
			expect(result.current.cancellingOrderId).toBeNull();
			expect(result.current.isExecuting).toBe(false);
		});
	});

	it('should update state during cancellation process', async () => {
		const { result } = renderHook(() => useCancelOrder(defaultProps));

		// Mock a delayed response
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateCancelTransaction'), () => {
				return new Promise((resolve) =>
					setTimeout(
						() =>
							resolve(
								HttpResponse.json({
									steps: [
										{
											id: StepType.cancel,
											data: '0x...',
											to: defaultProps.collectionAddress,
											value: '0',
											executeType: 'order',
										},
									],
								}),
							),
						100,
					),
				);
			}),
		);

		// Start the cancellation
		const cancelPromise = result.current.cancelOrder({
			orderId: mockOrderId,
			marketplace: MarketplaceKind.sequence_marketplace_v2,
		});

		// Wait for immediate state updates
		await waitFor(() => {
			expect(result.current.cancellingOrderId).toBe(mockOrderId);
		});

		// Wait for execution state to be true
		await waitFor(() => {
			expect(result.current.isExecuting).toBe(true);
		});

		// Wait for the cancellation to complete
		await cancelPromise;
	});

	it('should handle chain switching failure', async () => {
		const onError = vi.fn();

		// Mock wallet to fail chain switch
		const mockWalletWithFailedChainSwitch = createMockWallet({
			...commonWalletMocks,
			getChainId: vi.fn().mockResolvedValue(2), // Different chain than required
			switchChain: vi
				.fn()
				.mockRejectedValue(new Error('Failed to switch chain')),
			isWaaS: true,
		});

		vi.mocked(useWallet).mockReturnValue({
			wallet: mockWalletWithFailedChainSwitch,
			isLoading: false,
			isError: false,
		});

		const { result } = renderHook(() =>
			useCancelOrder({
				...defaultProps,
				onError,
			}),
		);

		try {
			await result.current.cancelOrder({
				orderId: mockOrderId,
				marketplace: MarketplaceKind.sequence_marketplace_v2,
			});
		} catch (error) {
			// Error is expected
		}

		await waitFor(() => {
			expect(onError).toHaveBeenCalledWith(expect.any(Error));
			expect(mockWalletWithFailedChainSwitch.switchChain).toHaveBeenCalledWith(
				1,
			);
			expect(result.current.cancellingOrderId).toBeNull();
			expect(result.current.isExecuting).toBe(false);
		});
	});

	it('should handle transaction confirmation failure', async () => {
		const onError = vi.fn();

		// Mock wallet with failed transaction confirmation
		const mockWalletWithFailedConfirmation = createMockWallet({
			...commonWalletMocks,
			getChainId: vi.fn().mockResolvedValue(1),
			handleSendTransactionStep: vi.fn().mockResolvedValue(mockTxHash),
			handleSignMessageStep: vi.fn().mockResolvedValue('0xsignature'),
			handleConfirmTransactionStep: vi
				.fn()
				.mockRejectedValue(new Error('Transaction confirmation failed')),
			isWaaS: true,
		});

		vi.mocked(useWallet).mockReturnValue({
			wallet: mockWalletWithFailedConfirmation,
			isLoading: false,
			isError: false,
		});

		const { result } = renderHook(() =>
			useCancelOrder({
				...defaultProps,
				onError,
			}),
		);

		try {
			await result.current.cancelOrder({
				orderId: mockOrderId,
				marketplace: MarketplaceKind.sequence_marketplace_v2,
			});
		} catch (error) {
			// Error is expected
		}

		await waitFor(() => {
			expect(onError).toHaveBeenCalledWith(expect.any(Error));
			expect(
				mockWalletWithFailedConfirmation.handleConfirmTransactionStep,
			).toHaveBeenCalled();
			expect(result.current.cancellingOrderId).toBeNull();
			expect(result.current.isExecuting).toBe(false);
		});
	});

	it('should successfully cancel an order', async () => {
		const onSuccess = vi.fn();

		// Mock successful responses for all steps
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateCancelTransaction'), () => {
				return new Promise((resolve) =>
					setTimeout(
						() =>
							resolve(
								HttpResponse.json({
									steps: [
										{
											id: StepType.cancel,
											data: '0x1234',
											to: defaultProps.collectionAddress,
											value: '0',
											executeType: 'order',
										},
									],
								}),
							),
						50,
					),
				);
			}),
			http.post(mockMarketplaceEndpoint('Execute'), () => {
				return HttpResponse.json({
					hash: mockTxHash,
				});
			}),
		);

		const mockSuccessWallet = createMockWallet({
			...commonWalletMocks,
			getChainId: vi.fn().mockResolvedValue(1),
			handleSendTransactionStep: vi.fn().mockResolvedValue(mockTxHash),
			handleSignMessageStep: vi.fn().mockResolvedValue('0xsignature'),
			handleConfirmTransactionStep: vi.fn().mockResolvedValue(undefined),
			isWaaS: true,
		});

		vi.mocked(useWallet).mockReturnValue({
			wallet: mockSuccessWallet,
			isLoading: false,
			isError: false,
		});

		const { result } = renderHook(() =>
			useCancelOrder({
				...defaultProps,
				onSuccess,
			}),
		);

		// Start the cancellation
		result.current.cancelOrder({
			orderId: mockOrderId,
			marketplace: MarketplaceKind.sequence_marketplace_v2,
		});

		// First, wait for the orderId to be set
		await waitFor(
			() => {
				expect(result.current.cancellingOrderId).toBe(mockOrderId);
			},
			{ timeout: 1000 },
		);

		// Then wait for execution to start
		await waitFor(
			() => {
				expect(result.current.isExecuting).toBe(true);
			},
			{ timeout: 1000 },
		);

		// Wait for the success callback to be called
		await waitFor(
			() => {
				expect(onSuccess).toHaveBeenCalledWith({
					hash: mockTxHash,
				});
			},
			{ timeout: 1000 },
		);

		// Finally verify the states are reset
		await waitFor(
			() => {
				expect(mockSuccessWallet.handleSendTransactionStep).toHaveBeenCalled();
				expect(
					mockSuccessWallet.handleConfirmTransactionStep,
				).toHaveBeenCalled();
				expect(result.current.cancellingOrderId).toBeNull();
				expect(result.current.isExecuting).toBe(false);
			},
			{ timeout: 1000 },
		);
	});
});
