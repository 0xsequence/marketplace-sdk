import * as marketplaceGen from '@0xsequence/api-client';
import { MarketplaceMocks } from '@0xsequence/api-client';

const { mockMarketplaceEndpoint, mockOrder } = MarketplaceMocks;

import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import type { UseCollectibleMarketListingsParams } from './market-listings';
import { useCollectibleMarketListings } from './market-listings';

describe('useCollectibleMarketListings', () => {
	const defaultArgs: UseCollectibleMarketListingsParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
		tokenId: 1n,
		page: {
			page: 1,
			pageSize: 10,
		},
	} as const;

	it('should fetch listings data successfully', async () => {
		const { result } = renderHook(() =>
			useCollectibleMarketListings(defaultArgs),
		);

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toBeDefined();
		expect(result.current.data?.listings).toEqual([mockOrder]);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMarketplaceEndpoint('ListListingsForCollectible'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch listings' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() =>
			useCollectibleMarketListings(defaultArgs),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() =>
			useCollectibleMarketListings(defaultArgs),
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change args and rerender
		const newArgs = {
			...defaultArgs,
			tokenId: 2n,
		};

		rerender(() => useCollectibleMarketListings(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data?.listings).toEqual([mockOrder]);
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle pagination correctly', async () => {
		const paginatedArgs = {
			...defaultArgs,
			page: {
				page: 2,
				pageSize: 20,
			},
		} as const;

		const { result } = renderHook(() =>
			useCollectibleMarketListings(paginatedArgs),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data?.page).toBeDefined();
		expect(result.current.data?.page?.page).toBe(1);
		expect(result.current.data?.page?.pageSize).toBe(10);
		expect(result.current.data?.page?.more).toBe(false);
	});

	it('should handle optional filter parameter', async () => {
		const argsWithFilter = {
			...defaultArgs,
			filter: {
				marketplace: [
					marketplaceGen.MarketplaceKind.sequence_marketplace_v2,
				] as marketplaceGen.MarketplaceKind[],
				currencies: [zeroAddress] as string[],
			},
		} as const;

		const { result } = renderHook(() =>
			useCollectibleMarketListings(argsWithFilter),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data?.listings).toEqual([mockOrder]);
		expect(result.current.isSuccess).toBe(true);
	});
});
