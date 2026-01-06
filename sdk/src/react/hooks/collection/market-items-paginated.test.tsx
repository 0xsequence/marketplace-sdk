import { OrderSide } from '@0xsequence/api-client';
import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import type { UseCollectionMarketItemsPaginatedParams } from './market-items-paginated';
import { useCollectionMarketItemsPaginated } from './market-items-paginated';

const { mockMarketplaceEndpoint } = MarketplaceMocks;

describe('useCollectionMarketItemsPaginated', () => {
	const defaultArgs: UseCollectionMarketItemsPaginatedParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
		side: OrderSide.listing,
		page: 1,
		pageSize: 10,
	};

	it('should fetch paginated orders successfully', async () => {
		const mockResponse = {
			orders: [],
			collectibles: [],
			page: {
				page: 1,
				pageSize: 10,
				more: false,
			},
		};

		server.use(
			http.post(mockMarketplaceEndpoint('ListOrdersWithCollectibles'), () => {
				return HttpResponse.json(mockResponse);
			}),
		);

		const { result } = renderHook(() =>
			useCollectionMarketItemsPaginated(defaultArgs),
		);

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual(mockResponse);
		expect(result.current.error).toBeNull();
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

		const { result } = renderHook(() =>
			useCollectionMarketItemsPaginated(defaultArgs),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when page changes', async () => {
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

		let requestedPage = 0;

		server.use(
			http.post(
				mockMarketplaceEndpoint('ListOrdersWithCollectibles'),
				async ({ request }) => {
					const body = (await request.json()) as any;
					requestedPage = body.page.page;
					return HttpResponse.json(
						requestedPage === 1 ? mockResponsePage1 : mockResponsePage2,
					);
				},
			),
		);

		const { result, rerender } = renderHook(
			(args: UseCollectionMarketItemsPaginatedParams = defaultArgs) =>
				useCollectionMarketItemsPaginated(args),
		);

		// Wait for initial data (page 1)
		await waitFor(() => {
			expect(result.current.data).toEqual(mockResponsePage1);
		});
		expect(requestedPage).toBe(1);

		// Change page and rerender
		const newArgs = {
			...defaultArgs,
			page: 2,
		};

		rerender(newArgs);

		// Wait for new data (page 2)
		await waitFor(() => {
			expect(result.current.data).toEqual(mockResponsePage2);
		});
		expect(requestedPage).toBe(2);
	});

	it('should not fetch if required params are missing', async () => {
		const { result } = renderHook(() =>
			useCollectionMarketItemsPaginated({
				...defaultArgs,
				chainId: undefined,
			} as any),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
	});
});
