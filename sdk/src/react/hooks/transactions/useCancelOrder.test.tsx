import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	commonWalletMocks,
	createMockWallet,
} from '../../../../test/mocks/wallet';
import * as types from '../../../types';
import { StepType } from '../../../types';
import { WalletKind } from '../../_internal/api';
import { mockMarketplaceEndpoint } from '../../_internal/api/__mocks__/marketplace.msw';
import { useWallet } from '../../_internal/wallet/useWallet';
import { useConnectorMetadata } from '../config/useConnectorMetadata';
import { useCancelOrder } from './useCancelOrder';

// Mock useWallet hook
vi.mock('../../_internal/wallet/useWallet');
// Mock useConnectorMetadata hook
vi.mock('../config/useConnectorMetadata');

describe('useCancelOrder', () => {
	const defaultProps = {
		collectionAddress: '0x1234567890123456789012345678901234567890',
		chainId: 1,
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
	});

	vi.mock(import('@0xsequence/connect'), async (importOriginal) => {
		const actual = await importOriginal();
		return {
			...actual,
			useWaasFeeOptions: vi.fn().mockReturnValue([]),
		};
	});

	beforeEach(() => {
		// Set up the mock implementation for useWallet
		vi.mocked(useWallet).mockReturnValue({
			wallet: mockWallet,
			isLoading: false,
			isError: false,
		});
		// Set up the mock implementation for useConnectorMetadata
		vi.mocked(useConnectorMetadata).mockReturnValue({
			isWaaS: true,
			isSequence: false,
			walletKind: WalletKind.unknown,
		});
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
				marketplace: types.MarketplaceKind.sequence_marketplace_v2,
			});
		} catch (_error) {
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
			marketplace: types.MarketplaceKind.sequence_marketplace_v2,
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

	it.skip('should handle chain switching failure', async () => {
		const onError = vi.fn();

		vi.mocked(useWallet).mockReturnValue({
			wallet: mockWallet,
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
				marketplace: types.MarketplaceKind.sequence_marketplace_v2,
			});
		} catch (_error) {
			// Error is expected
		}

		await waitFor(() => {
			expect(onError).toHaveBeenCalledWith(expect.any(Error));
			expect(result.current.cancellingOrderId).toBeNull();
			expect(result.current.isExecuting).toBe(false);
		});
	});

	it('should handle transaction confirmation failure', async () => {
		const onError = vi.fn();

		// Mock the GenerateCancelTransaction endpoint to return a valid transaction step
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateCancelTransaction'), () => {
				return HttpResponse.json({
					steps: [
						{
							id: StepType.cancel,
							data: '0x1234',
							to: defaultProps.collectionAddress,
							value: '0',
							executeType: 'order',
						},
					],
				});
			}),
		);

		// Mock wallet with failed transaction confirmation
		const mockWalletWithFailedConfirmation = createMockWallet({
			...commonWalletMocks,
			getChainId: vi.fn().mockResolvedValue(1),
			handleSendTransactionStep: vi
				.fn()
				.mockRejectedValue(new Error('Transaction sending failed')),
			handleSignMessageStep: vi.fn().mockResolvedValue('0xsignature'),
			handleConfirmTransactionStep: vi.fn().mockResolvedValue(undefined),
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
				marketplace: types.MarketplaceKind.sequence_marketplace_v2,
			});
		} catch (_error) {
			// Error is expected
		}

		await waitFor(() => {
			expect(onError).toHaveBeenCalledWith(expect.any(Error));
			expect(
				mockWalletWithFailedConfirmation.handleSendTransactionStep,
			).toHaveBeenCalled();
			expect(result.current.cancellingOrderId).toBeNull();
			expect(result.current.isExecuting).toBe(false);
		});
	});

	it('should successfully cancel an order', async () => {
		const onSuccess = vi.fn();

		// Mock successful responses for all steps - make the response immediate
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateCancelTransaction'), () => {
				return HttpResponse.json({
					steps: [
						{
							id: StepType.cancel,
							data: '0x1234',
							to: defaultProps.collectionAddress,
							value: '0',
							executeType: 'order',
						},
					],
				});
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

		// Start the cancellation and wait for it to complete
		await result.current.cancelOrder({
			orderId: mockOrderId,
			marketplace: types.MarketplaceKind.sequence_marketplace_v2,
		});

		// After cancellation is complete, verify the success callback was called
		expect(onSuccess).toHaveBeenCalledWith({
			hash: mockTxHash,
		});

		// Verify final state
		expect(result.current.cancellingOrderId).toBeNull();
		expect(result.current.isExecuting).toBe(false);
	});
});
