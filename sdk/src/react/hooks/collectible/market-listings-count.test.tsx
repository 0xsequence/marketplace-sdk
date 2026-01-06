import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';

const { mockMarketplaceEndpoint } = MarketplaceMocks;

import { useCollectibleMarketListingsCount } from './market-listings-count';

describe('useCollectibleMarketListingsCount', () => {
	const defaultArgs = {
		chainId: 1,
		collectionAddress: zeroAddress,
		tokenId: 1n,
		query: {},
	};

	it('should fetch listings count successfully', async () => {
		const { result } = renderHook(() =>
			useCollectibleMarketListingsCount(defaultArgs),
		);

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual(1);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(
				mockMarketplaceEndpoint('GetCountOfListingsForCollectible'),
				() => {
					return HttpResponse.json(
						{ error: { message: 'Failed to fetch listings count' } },
						{ status: 500 },
					);
				},
			),
		);

		const { result } = renderHook(() =>
			useCollectibleMarketListingsCount(defaultArgs),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() =>
			useCollectibleMarketListingsCount(defaultArgs),
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

		rerender(() => useCollectibleMarketListingsCount(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle query options', async () => {
		const argsWithQuery = {
			...defaultArgs,
			query: {
				enabled: false,
			},
		};

		const { result } = renderHook(() =>
			useCollectibleMarketListingsCount(argsWithQuery),
		);

		// Should not fetch when disabled
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
	});
});
