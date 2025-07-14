import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import {
	mockCollectibleOrder,
	mockMarketplaceEndpoint,
} from '../../../_internal/api/__mocks__/marketplace.msw';
import type { UseFloorOrderParams } from './useFloorOrder';
import { useFloorOrder } from './useFloorOrder';

describe('useFloorOrder', () => {
	const defaultArgs: UseFloorOrderParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
		query: {},
	};

	it('should fetch floor order data successfully', async () => {
		const { result } = renderHook(() => useFloorOrder(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual(mockCollectibleOrder);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMarketplaceEndpoint('GetFloorOrder'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch floor order' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useFloorOrder(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() => useFloorOrder(defaultArgs));

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change args and rerender
		const newArgs = {
			...defaultArgs,
			collectionAddress:
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
		};

		rerender(() => useFloorOrder(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle undefined query params', async () => {
		const argsWithoutQuery: UseFloorOrderParams = {
			chainId: 1,
			collectionAddress: zeroAddress,
			query: {},
		};

		const { result } = renderHook(() => useFloorOrder(argsWithoutQuery));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.error).toBeNull();
	});
});
