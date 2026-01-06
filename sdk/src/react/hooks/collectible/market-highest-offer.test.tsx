import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';

const { mockMarketplaceEndpoint, mockOrder } = MarketplaceMocks;

import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import type { UseCollectibleMarketHighestOfferParams } from './market-highest-offer';
import { useCollectibleMarketHighestOffer } from './market-highest-offer';

describe('useCollectibleMarketHighestOffer', () => {
	const defaultArgs: UseCollectibleMarketHighestOfferParams = {
		chainId: mockOrder.chainId,
		collectionAddress: zeroAddress,
		tokenId: mockOrder.tokenId ?? 1n,
	};

	it('should fetch highest offer data successfully', async () => {
		const { result } = renderHook(() =>
			useCollectibleMarketHighestOffer(defaultArgs),
		);

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock with BigInt values
		expect(result.current.data).toEqual(mockOrder);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(
				mockMarketplaceEndpoint('GetHighestPriceOfferForCollectible'),
				() => {
					return HttpResponse.json(
						{ error: { message: 'Failed to fetch highest offer' } },
						{ status: 500 },
					);
				},
			),
		);

		const { result } = renderHook(() =>
			useCollectibleMarketHighestOffer(defaultArgs),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() =>
			useCollectibleMarketHighestOffer(defaultArgs),
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change args and rerender
		const newArgs = {
			...defaultArgs,
			tokenId: 2n,
			collectionAddress:
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
		};

		rerender(() => useCollectibleMarketHighestOffer(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args using string values
		expect(result.current.data).toEqual(mockOrder);
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle undefined query params', async () => {
		const argsWithoutQuery: UseCollectibleMarketHighestOfferParams = {
			chainId: 1,
			collectionAddress: zeroAddress,
			tokenId: 1n,
		};

		const { result } = renderHook(() =>
			useCollectibleMarketHighestOffer(argsWithoutQuery),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.error).toBeNull();
	});
});
