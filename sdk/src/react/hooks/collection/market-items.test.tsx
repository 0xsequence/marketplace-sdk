import { OrderSide } from '@0xsequence/api-client';
import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import type { UseCollectionMarketItemsParams } from './market-items';
import { useCollectionMarketItems } from './market-items';

const { mockMarketplaceEndpoint } = MarketplaceMocks;

describe('useCollectionMarketItems', () => {
	const defaultArgs: UseCollectionMarketItemsParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
		side: OrderSide.listing,
	};

	it('should fetch initial page successfully', async () => {
		const mockResponse = {
			orders: [],
			collectibles: [],
			page: {
				page: 1,
				pageSize: 10,
				more: true,
			},
		};

		server.use(
			http.post(mockMarketplaceEndpoint('ListOrdersWithCollectibles'), () => {
				return HttpResponse.json(mockResponse);
			}),
		);

		const { result } = renderHook(() => useCollectionMarketItems(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data?.pages[0]).toEqual(mockResponse);
		expect(result.current.hasNextPage).toBe(true);
	});

	it('should fetch next page successfully', async () => {
		const mockResponsePage1 = {
			orders: [],
			collectibles: [],
			page: { page: 1, pageSize: 10, more: true },
		};
		const mockResponsePage2 = {
			orders: [],
			collectibles: [],
			page: { page: 2, pageSize: 10, more: false },
		};

		server.use(
			http.post(
				mockMarketplaceEndpoint('ListOrdersWithCollectibles'),
				async ({ request }) => {
					const body = (await request.json()) as any;
					const page = body.page?.page || 1;
					return HttpResponse.json(
						page === 1 ? mockResponsePage1 : mockResponsePage2,
					);
				},
			),
		);

		const { result } = renderHook(() => useCollectionMarketItems(defaultArgs));

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.data?.pages[0]).toEqual(mockResponsePage1);
		});

		// Fetch next page
		await result.current.fetchNextPage();

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data?.pages).toHaveLength(2);
			expect(result.current.data?.pages[1]).toEqual(mockResponsePage2);
		});

		expect(result.current.hasNextPage).toBe(false);
	});

	it('should handle error states', async () => {
		server.use(
			http.post(mockMarketplaceEndpoint('ListOrdersWithCollectibles'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch orders' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useCollectionMarketItems(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const mockResponseSideListing = {
			orders: [],
			collectibles: [],
			page: { page: 1, pageSize: 10, more: false },
		};
		const mockResponseSideOffer = {
			orders: [],
			collectibles: [],
			page: { page: 1, pageSize: 10, more: false },
		};

		let requestedSide: OrderSide | undefined;

		server.use(
			http.post(
				mockMarketplaceEndpoint('ListOrdersWithCollectibles'),
				async ({ request }) => {
					const body = (await request.json()) as any;
					requestedSide = body.side;
					return HttpResponse.json(
						requestedSide === OrderSide.listing
							? mockResponseSideListing
							: mockResponseSideOffer,
					);
				},
			),
		);

		const { result, rerender } = renderHook(
			(args: UseCollectionMarketItemsParams = defaultArgs) =>
				useCollectionMarketItems(args),
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.data?.pages[0]).toEqual(mockResponseSideListing);
		});
		expect(requestedSide).toBe(OrderSide.listing);

		// Change args and rerender
		const newArgs = {
			...defaultArgs,
			side: OrderSide.offer,
		};

		rerender(newArgs);

		// Wait for new data
		await waitFor(() => {
			// We can't strictly assert equality here because the mock response is identical structure,
			// but we can check the side effect (requestedSide)
			expect(result.current.isLoading).toBe(false);
		});
		expect(requestedSide).toBe(OrderSide.offer);
	});

	it('should not fetch if required params are missing', async () => {
		const { result } = renderHook(() =>
			useCollectionMarketItems({
				...defaultArgs,
				chainId: undefined,
			} as any),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
	});
});
