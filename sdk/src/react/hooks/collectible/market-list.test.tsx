import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import type { ListCollectiblesArgs } from '../../_internal';
import {
	mockCollectibleOrder,
	mockMarketplaceEndpoint,
} from '../../_internal/api/__mocks__/marketplace.msw';
import {
	MarketplaceKind,
	OrderSide,
} from '../../_internal/api/marketplace.gen';
import type { UseCollectibleMarketListParams } from './market-list';
import { useCollectibleMarketList } from './market-list';

describe('useCollectibleMarketList', () => {
	const defaultArgs: UseCollectibleMarketListParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
		side: OrderSide.listing,
		query: {
			enabled: true,
		},
	};

	it('should fetch collectibles successfully', async () => {
		// Set up the default success handler
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					collectibles: [mockCollectibleOrder],
					page: { page: 1, pageSize: 30, more: false },
				});
			}),
		);

		const { result } = renderHook(() => useCollectibleMarketList(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data?.pages[0]).toEqual({
			collectibles: [mockCollectibleOrder],
			page: { page: 1, pageSize: 30, more: false },
		});
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch collectibles' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useCollectibleMarketList(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should handle infinite pagination correctly', async () => {
		// Mock responses for different pages
		const pages = [
			{
				collectibles: [mockCollectibleOrder],
				page: { page: 1, pageSize: 30, more: true },
			},
			{
				collectibles: [{ ...mockCollectibleOrder, tokenId: '2' }],
				page: { page: 2, pageSize: 30, more: false },
			},
		];

		let currentPage = 0;
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				const response = pages[currentPage];
				currentPage = Math.min(currentPage + 1, pages.length - 1);
				return HttpResponse.json(response);
			}),
		);

		const { result } = renderHook(() => useCollectibleMarketList(defaultArgs));

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify first page
		expect(result.current.data?.pages[0]).toEqual(pages[0]);
		expect(result.current.hasNextPage).toBe(true);

		// Fetch next page
		await result.current.fetchNextPage();

		// Wait for second page to load
		await waitFor(() => {
			expect(result.current.isFetchingNextPage).toBe(false);
		});

		// Verify both pages are present
		expect(result.current.data?.pages).toHaveLength(2);
		expect(result.current.data?.pages[1]).toEqual(pages[1]);
		expect(result.current.hasNextPage).toBe(false);
	});

	it('should handle disabled queries', async () => {
		// Set up a mock handler to ensure no requests are made
		let requestMade = false;
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				requestMade = true;
				return HttpResponse.json({
					collectibles: [mockCollectibleOrder],
					page: { page: 1, pageSize: 30, more: false },
				});
			}),
		);

		const disabledArgs: UseCollectibleMarketListParams = {
			...defaultArgs,
			query: {
				enabled: false,
			},
		};

		const { result } = renderHook(() => useCollectibleMarketList(disabledArgs));

		// For disabled queries, we expect no loading state and no data
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
		expect(requestMade).toBe(false);
	});

	it('should refetch when args change', async () => {
		// Set up the success handler
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					collectibles: [mockCollectibleOrder],
					page: { page: 1, pageSize: 30, more: false },
				});
			}),
		);

		let currentArgs = defaultArgs;
		const { result, rerender } = renderHook(() =>
			useCollectibleMarketList(currentArgs),
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change args and rerender
		currentArgs = {
			...defaultArgs,
			collectionAddress:
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
		};

		rerender();

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data?.pages[0]).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data?.pages[0]).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle filter parameters', async () => {
		const argsWithFilter: UseCollectibleMarketListParams = {
			...defaultArgs,
			filter: {
				includeEmpty: true,
				searchText: 'test',
				marketplaces: [MarketplaceKind.sequence_marketplace_v2],
			},
		};

		let requestArgs: ListCollectiblesArgs | undefined;
		server.use(
			http.post(
				mockMarketplaceEndpoint('ListCollectibles'),
				async ({ request }) => {
					requestArgs = (await request.json()) as ListCollectiblesArgs;
					return HttpResponse.json({
						collectibles: [mockCollectibleOrder],
						page: { page: 1, pageSize: 30, more: false },
					});
				},
			),
		);

		const { result } = renderHook(() =>
			useCollectibleMarketList(argsWithFilter),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify that filter parameters were passed correctly
		expect(requestArgs?.filter).toEqual({
			includeEmpty: true,
			searchText: 'test',
			marketplaces: [MarketplaceKind.sequence_marketplace_v2],
		});
	});
});
