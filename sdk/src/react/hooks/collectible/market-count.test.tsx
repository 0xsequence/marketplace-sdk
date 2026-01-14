import type { Address } from '@0xsequence/api-client';
import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';

const { mockMarketplaceEndpoint } = MarketplaceMocks;

import { OrderSide } from '@0xsequence/api-client';
import type { UseCollectibleMarketCountParams } from './market-count';
import { useCollectibleMarketCount } from './market-count';

describe('useCollectibleMarketCount', () => {
	const defaultArgs: UseCollectibleMarketCountParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
		query: {},
	};

	const defaultArgsWithFilter: UseCollectibleMarketCountParams = {
		...defaultArgs,
		filter: {
			includeEmpty: true,
		},
		side: OrderSide.listing,
	};

	it('should fetch count of all collectables successfully', async () => {
		const { result } = renderHook(() => useCollectibleMarketCount(defaultArgs));

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
			useCollectibleMarketCount(defaultArgsWithFilter),
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

		const { result } = renderHook(() => useCollectibleMarketCount(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() =>
			useCollectibleMarketCount(defaultArgs),
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		const testAddress: Address = '0x1234567890123456789012345678901234567890';

		// Change args and rerender
		const newArgs = {
			...defaultArgs,
			collectionAddress: testAddress,
		};

		rerender(() => useCollectibleMarketCount(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle undefined query params', async () => {
		const argsWithoutQuery: UseCollectibleMarketCountParams = {
			chainId: 1,
			collectionAddress: zeroAddress,
		};

		const { result } = renderHook(() =>
			useCollectibleMarketCount(argsWithoutQuery),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.error).toBeNull();
	});
});
