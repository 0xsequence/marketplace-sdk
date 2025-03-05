import { act } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	mockMarketplaceEndpoint,
	mockSteps,
} from '../../_internal/api/__mocks__/marketplace.msw';
import { MarketplaceKind } from '../../_internal/api/marketplace.gen';
import { renderHook, waitFor } from '../../_internal/test-utils';
import { server } from '../../_internal/test/setup';
import { useConfig } from '../useConfig';
import { useGenerateCancelTransaction } from '../useGenerateCancelTransaction';

// Mock useConfig hook
vi.mock('../useConfig', () => ({
	useConfig: vi.fn(),
}));

describe('useGenerateCancelTransaction', () => {
	const defaultArgs = {
		chainId: '1',
		orderId: '0x9876543210987654321098765432109876543210',
		marketplace: MarketplaceKind.sequence_marketplace_v2,
		collectionAddress: zeroAddress,
		maker: '0x1234567890123456789012345678901234567890',
	};

	const mockConfig = {
		projectAccessKey: 'test-key',
		projectId: 'test-id',
	};

	beforeEach(() => {
		// Mock useConfig to return config
		(useConfig as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
			mockConfig,
		);
	});

	it('should generate cancel transaction successfully', async () => {
		const { result } = renderHook(() =>
			useGenerateCancelTransaction(defaultArgs),
		);

		await act(async () => {
			await result.current.generateCancelTransactionAsync(defaultArgs);
		});

		await waitFor(() => {
			expect(result.current.data).toEqual(mockSteps);
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
			} catch (error) {
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
			useGenerateCancelTransaction(invalidArgs),
		);

		await act(async () => {
			try {
				await result.current.generateCancelTransactionAsync(invalidArgs);
			} catch (error) {
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
				[mockSteps[0]],
				defaultArgs,
				undefined,
			);
		});
	});
});
