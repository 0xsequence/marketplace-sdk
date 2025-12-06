import * as marketplaceGen from '@0xsequence/api-client';
import { MarketplaceMocks } from '@0xsequence/api-client';

const { mockMarketplaceEndpoint, mockOrder } = MarketplaceMocks;

import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import { useCollectibleMarketLowestListing } from './market-lowest-listing';

describe('useCollectibleMarketLowestListing', () => {
	const defaultArgs = {
		chainId: 1,
		collectionAddress: zeroAddress,
		tokenId: 1n,
	};

	it('should fetch lowest listing data successfully', async () => {
		const { result } = renderHook(() =>
			useCollectibleMarketLowestListing(defaultArgs),
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
		expect(result.current.data).toEqual(mockOrder);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(
				mockMarketplaceEndpoint('GetLowestPriceListingForCollectible'),
				() => {
					return HttpResponse.json(
						{ error: { message: 'Failed to fetch lowest listing' } },
						{ status: 500 },
					);
				},
			),
		);

		const { result } = renderHook(() =>
			useCollectibleMarketLowestListing(defaultArgs),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() =>
			useCollectibleMarketLowestListing(defaultArgs),
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
			tokenId: 2n,
		};

		rerender(() => useCollectibleMarketLowestListing(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data).toEqual(mockOrder);
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle optional filter parameter', async () => {
		const argsWithFilter = {
			...defaultArgs,
			filters: {
				marketplace: [
					marketplaceGen.MarketplaceKind.sequence_marketplace_v2,
				] as marketplaceGen.MarketplaceKind[],
				currencies: [zeroAddress] as string[],
			},
		};

		const { result } = renderHook(() =>
			useCollectibleMarketLowestListing(argsWithFilter),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toEqual(mockOrder);
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle query options', async () => {
		const argsWithQuery = {
			...defaultArgs,
			query: {
				enabled: true,
				staleTime: 5000,
				cacheTime: 10000,
			},
		};

		const { result } = renderHook(() =>
			useCollectibleMarketLowestListing(argsWithQuery),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toEqual(mockOrder);
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle disabled query', async () => {
		const argsWithDisabledQuery = {
			...defaultArgs,
			query: {
				enabled: false,
			},
		};

		const { result } = renderHook(() =>
			useCollectibleMarketLowestListing(argsWithDisabledQuery),
		);

		// Should not be loading since query is disabled
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.isSuccess).toBe(false);
	});
});
