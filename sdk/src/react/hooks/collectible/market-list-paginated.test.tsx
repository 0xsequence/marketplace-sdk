import { MarketplaceMocks, OrderSide } from '@0xsequence/api-client';

const { mockCollectibleOrder, mockMarketplaceEndpoint } = MarketplaceMocks;

import { renderHook, server } from '@test';
import { waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import type { UseListCollectiblesPaginatedParams } from './market-list-paginated';
import { useCollectibleMarketListPaginated } from './market-list-paginated';

describe('useCollectibleMarketListPaginated', () => {
	const defaultArgs: UseListCollectiblesPaginatedParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
		side: OrderSide.listing,
		page: 1,
		pageSize: 30,
		query: {
			enabled: true,
		},
	};

	it('should fetch collectibles successfully', async () => {
		// Set up mock response
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					collectibles: [mockCollectibleOrder],
					page: { page: 1, pageSize: 30, more: false },
				});
			}),
		);

		const { result } = renderHook(() =>
			useCollectibleMarketListPaginated(defaultArgs),
		);

		// Wait for the query to complete
		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Verify the data
		expect(result.current.data?.collectibles).toEqual([mockCollectibleOrder]);
		expect(result.current.data?.page).toEqual({
			page: 1,
			pageSize: 30,
			more: false,
		});
	});

	it('should handle error states', async () => {
		// Override the handler to return an error
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch collectibles' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() =>
			useCollectibleMarketListPaginated(defaultArgs),
		);

		// Wait for the error state
		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should handle pagination correctly', async () => {
		// Set up mock response for page 2
		const modifiedCollectibleOrder = {
			...mockCollectibleOrder,
			metadata: {
				...mockCollectibleOrder.metadata,
				tokenId: 2n,
			},
		};

		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					collectibles: [modifiedCollectibleOrder],
					page: { page: 2, pageSize: 20, more: false },
				});
			}),
		);

		const paginatedArgs: UseListCollectiblesPaginatedParams = {
			...defaultArgs,
			page: 2,
			pageSize: 20,
			query: {
				enabled: true,
			},
		};

		const { result } = renderHook(() =>
			useCollectibleMarketListPaginated(paginatedArgs),
		);

		// Wait for the query to complete
		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Verify the data for page 2
		expect(result.current.data?.collectibles[0].metadata.tokenId).toBe(2n);
		expect(result.current.data?.page).toEqual({
			page: 2,
			pageSize: 20,
			more: false,
		});
	});

	it('should refetch when args change', async () => {
		// Set up initial mock response
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					collectibles: [mockCollectibleOrder],
					page: { page: 1, pageSize: 30, more: true },
				});
			}),
		);

		let currentArgs = defaultArgs;
		const { result, rerender } = renderHook(() =>
			useCollectibleMarketListPaginated(currentArgs),
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Change args and rerender
		currentArgs = {
			...defaultArgs,
			page: 2,
		};

		// Set up mock response for page 2
		const modifiedCollectibleOrder = {
			...mockCollectibleOrder,
			metadata: {
				...mockCollectibleOrder.metadata,
				tokenId: 2n,
			},
		};

		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					collectibles: [modifiedCollectibleOrder],
					page: { page: 2, pageSize: 30, more: false },
				});
			}),
		);

		rerender();

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data?.page?.page).toBe(2);
		});

		// Verify new data
		expect(result.current.data?.collectibles[0].metadata.tokenId).toBe(2n);
	});

	it('should not fetch when enabled is false', async () => {
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

		const disabledArgs: UseListCollectiblesPaginatedParams = {
			...defaultArgs,
			query: {
				enabled: false,
			},
		};

		const { result } = renderHook(() =>
			useCollectibleMarketListPaginated(disabledArgs),
		);

		// For disabled queries, we expect no loading state and no data
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
		expect(requestMade).toBe(false);
	});
});
