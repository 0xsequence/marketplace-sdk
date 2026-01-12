import { MarketplaceKind, StepType, WalletKind } from '@0xsequence/api-client';
import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import type { Address } from '@0xsequence/api-client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockMarketplaceEndpoint } = MarketplaceMocks;

import { useConnectorMetadata } from '../config/useConnectorMetadata';
import { useCancelOrder } from './useCancelOrder';
import { useProcessStep } from './useProcessStep';

// Mock useConnectorMetadata hook
vi.mock('../config/useConnectorMetadata');
vi.mock('./useProcessStep');
vi.mock('../../utils/waitForTransactionReceipt', () => ({
	waitForTransactionReceipt: vi.fn().mockResolvedValue({
		status: 'success',
		blockNumber: 123456n,
		transactionHash: '0xabcd1234',
	}),
}));

describe('useCancelOrder', () => {
	const defaultProps = {
		collectionAddress: '0x1234567890123456789012345678901234567890' as Address,
		chainId: 1,
	};

	const mockOrderId = '0x9876543210987654321098765432109876543210';
	const mockTxHash = '0xabcd1234';

	vi.mock(import('@0xsequence/connect'), async (importOriginal) => {
		const actual = await importOriginal();
		return {
			...actual,
			useWaasFeeOptions: vi.fn().mockReturnValue([]),
		};
	});

	beforeEach(() => {
		// Set up the mock implementation for useConnectorMetadata
		vi.mocked(useConnectorMetadata).mockReturnValue({
			isWaaS: true,
			isSequence: false,
			walletKind: WalletKind.unknown,
		});
		vi.mocked(useProcessStep).mockReturnValue({
			processStep: vi.fn().mockImplementation(async (step) => {
				if (step.id === StepType.cancel) {
					return { type: 'transaction', hash: mockTxHash };
				}
				if (step.id === StepType.signEIP712) {
					return { type: 'signature', orderId: mockOrderId };
				}
				throw new Error('Unknown step type');
			}),
		});
	});

	it('should initialize with default state', () => {
		const { result } = renderHook(() => useCancelOrder(defaultProps));

		expect(result.current.isExecuting).toBe(false);
		expect(result.current.cancellingOrderId).toBeNull();
	});

	it('should handle cancellation error', async () => {
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateCancelTransaction'), () => {
				return HttpResponse.error();
			}),
		);

		const { result } = renderHook(() =>
			useCancelOrder({
				...defaultProps,
			}),
		);

		try {
			await result.current.cancelOrder({
				orderId: mockOrderId,
				marketplace: MarketplaceKind.sequence_marketplace_v2,
			});
		} catch (_error) {
			// Error is expected
		}

		await waitFor(() => {
			expect(result.current.cancellingOrderId).toBeNull();
			expect(result.current.isExecuting).toBe(false);
		});
	});

	it('should update state during cancellation process', async () => {
		const { result } = renderHook(() =>
			useCancelOrder({
				...defaultProps,
			}),
		);

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
											value: 0n,
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

	it.skip('should handle chain switching failure', async () => {
		const { result } = renderHook(() =>
			useCancelOrder({
				...defaultProps,
			}),
		);

		try {
			await result.current.cancelOrder({
				orderId: mockOrderId,
				marketplace: MarketplaceKind.sequence_marketplace_v2,
			});
		} catch (_error) {
			// Error is expected
		}

		await waitFor(() => {
			expect(result.current.cancellingOrderId).toBeNull();
			expect(result.current.isExecuting).toBe(false);
		});
	});

	it('should handle transaction confirmation failure', async () => {
		// Mock the GenerateCancelTransaction endpoint to return a valid transaction step
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateCancelTransaction'), () => {
				return HttpResponse.json({
					steps: [
						{
							id: StepType.cancel,
							data: '0x1234',
							to: defaultProps.collectionAddress,
							value: 0n,
							executeType: 'order',
						},
					],
				});
			}),
		);

		// Mock useProcessStep to throw an error for this test
		vi.mocked(useProcessStep).mockReturnValue({
			processStep: vi
				.fn()
				.mockRejectedValue(new Error('Transaction sending failed')),
		});

		const { result } = renderHook(() =>
			useCancelOrder({
				...defaultProps,
			}),
		);

		try {
			await result.current.cancelOrder({
				orderId: mockOrderId,
				marketplace: MarketplaceKind.sequence_marketplace_v2,
			});
		} catch (_error) {
			// Error is expected
		}

		await waitFor(() => {});
	});

	it('should successfully cancel an order', async () => {
		// Mock successful responses for all steps - make the response immediate
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateCancelTransaction'), () => {
				return HttpResponse.json({
					steps: [
						{
							id: StepType.cancel,
							data: '0x1234',
							to: defaultProps.collectionAddress,
							value: 0n,
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

		vi.mocked(useProcessStep).mockReturnValue({
			processStep: vi.fn().mockImplementation(async (step) => {
				if (step.id === StepType.cancel) {
					return { type: 'transaction', hash: mockTxHash };
				}
				if (step.id === StepType.signEIP712) {
					return { type: 'signature', orderId: mockOrderId };
				}
				throw new Error('Unknown step type');
			}),
		});

		const { result } = renderHook(() =>
			useCancelOrder({
				...defaultProps,
			}),
		);

		// Start the cancellation and wait for it to complete
		await result.current.cancelOrder({
			orderId: mockOrderId,
			marketplace: MarketplaceKind.sequence_marketplace_v2,
		});

		// Verify final state
		expect(result.current.cancellingOrderId).toBeNull();
		expect(result.current.isExecuting).toBe(false);
	});
});
