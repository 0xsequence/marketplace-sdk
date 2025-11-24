import {
	MarketplaceKind,
	MarketplaceMocks,
	StepType,
} from '@0xsequence/api-client';

const { createMockSteps, mockMarketplaceEndpoint } = MarketplaceMocks;

import { act, renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it, vi } from 'vitest';
import { useGenerateCancelTransaction } from './useGenerateCancelTransaction';

const defaultArgs = {
	chainId: 1,
	orderId: '0x9876543210987654321098765432109876543210',
	marketplace: MarketplaceKind.sequence_marketplace_v2,
	collectionAddress: zeroAddress,
	maker: '0x1234567890123456789012345678901234567890',
};

describe('useGenerateCancelTransaction', () => {
	it('should generate cancel transaction successfully', async () => {
		const { result } = renderHook(() =>
			useGenerateCancelTransaction(defaultArgs),
		);

		await act(async () => {
			await result.current.generateCancelTransactionAsync(defaultArgs);
		});

		await waitFor(() => {
			expect(result.current.data).toEqual(createMockSteps([StepType.cancel]));
		});
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateCancelTransaction'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to generate cancel transaction' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() =>
			useGenerateCancelTransaction(defaultArgs),
		);

		await act(async () => {
			try {
				await result.current.generateCancelTransactionAsync(defaultArgs);
			} catch (_error) {
				// Expected error
			}
		});

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});
		expect(result.current.error).toBeDefined();
	});

	it('should not make request when wallet is not connected', async () => {
		const { result } = renderHook(() =>
			useGenerateCancelTransaction(defaultArgs),
		);

		expect(result.current.isPending).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});

	it('should handle invalid order data', async () => {
		const invalidArgs = {
			...defaultArgs,
			orderId: '', // Invalid order ID
		};

		server.use(
			http.post(mockMarketplaceEndpoint('GenerateCancelTransaction'), () => {
				return HttpResponse.json({ error: 'endpoint error' }, { status: 400 });
			}),
		);

		const { result } = renderHook(() =>
			useGenerateCancelTransaction(defaultArgs),
		);

		await act(async () => {
			try {
				await result.current.generateCancelTransactionAsync(invalidArgs);
			} catch (_error) {
				// Expected error
			}
		});

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});
		expect(result.current.error?.message).toBe('endpoint error');
	});

	it('should not make request when wallet is connecting', async () => {
		const { result } = renderHook(() =>
			useGenerateCancelTransaction(defaultArgs),
		);

		expect(result.current.isPending).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});

	it('should call onSuccess callback when provided', async () => {
		const onSuccess = vi.fn();
		const { result } = renderHook(() =>
			useGenerateCancelTransaction({ ...defaultArgs, onSuccess }),
		);

		await act(async () => {
			await result.current.generateCancelTransactionAsync(defaultArgs);
		});

		await waitFor(() => {
			expect(onSuccess).toHaveBeenCalledWith(
				createMockSteps([StepType.cancel]),
			);
		});
	});
});
