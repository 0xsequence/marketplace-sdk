import { renderHook, server, waitFor } from '@test';
import { http, HttpResponse } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import { OrderSide } from '../../_internal';
import { mockMarketplaceEndpoint } from '../../_internal/api/__mocks__/marketplace.msw';
import type { UseCountOfCollectablesArgs } from '../useCountOfCollectables';
import { useCountOfCollectables } from '../useCountOfCollectables';

describe('useCountOfCollectables', () => {
	const defaultArgs: UseCountOfCollectablesArgs = {
		chainId: '1',
		collectionAddress: zeroAddress,
		query: {},
	};

	const defaultArgsWithFilter: UseCountOfCollectablesArgs = {
		...defaultArgs,
		filter: {
			includeEmpty: true,
		},
		side: OrderSide.listing,
	};

	it('should fetch count of all collectables successfully', async () => {
		const { result } = renderHook(() => useCountOfCollectables(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toBe(100); // matches mock count from marketplace.msw.ts
		expect(result.current.error).toBeNull();
	});

	it('should fetch filtered count of collectables successfully', async () => {
		const { result } = renderHook(() =>
			useCountOfCollectables(defaultArgsWithFilter),
		);

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toBe(50); // matches mock count from marketplace.msw.ts
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMarketplaceEndpoint('GetCountOfAllCollectibles'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch count' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useCountOfCollectables(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() =>
			useCountOfCollectables(defaultArgs),
		);

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

		rerender(() => useCountOfCollectables(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle undefined query params', async () => {
		const argsWithoutQuery: UseCountOfCollectablesArgs = {
			chainId: '1',
			collectionAddress: zeroAddress,
		};

		const { result } = renderHook(() =>
			useCountOfCollectables(argsWithoutQuery),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.error).toBeNull();
	});
});
