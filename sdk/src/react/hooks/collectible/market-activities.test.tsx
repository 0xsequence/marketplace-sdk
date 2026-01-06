import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';

const { mockActivity, mockMarketplaceEndpoint } = MarketplaceMocks;

import type { UseListCollectibleActivitiesParams } from './market-activities';
import { useCollectibleMarketActivities } from './market-activities';

describe('useCollectibleMarketActivities', () => {
	const defaultArgs: UseListCollectibleActivitiesParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
		tokenId: 1n,
		page: 1,
		pageSize: 10,
		query: {
			enabled: true,
		},
	};

	it('should fetch collectible activities successfully', async () => {
		// Set up the default success handler
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibleActivities'), () => {
				return HttpResponse.json({
					activities: [mockActivity],
					page: { page: 1, pageSize: 10, more: false },
				});
			}),
		);

		const { result } = renderHook(() =>
			useCollectibleMarketActivities(defaultArgs),
		);

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual({
			activities: [mockActivity],
			page: { page: 1, pageSize: 10, more: false },
		});
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibleActivities'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch activities' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() =>
			useCollectibleMarketActivities(defaultArgs),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		// Set up the success handler
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibleActivities'), () => {
				return HttpResponse.json({
					activities: [mockActivity],
					page: { page: 1, pageSize: 10, more: false },
				});
			}),
		);

		let currentArgs = defaultArgs;
		const { result, rerender } = renderHook(() =>
			useCollectibleMarketActivities(currentArgs),
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change args and rerender
		currentArgs = {
			chainId: 1,
			tokenId: 2n,
			collectionAddress:
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
			page: 1,
			pageSize: 10,
			query: {
				enabled: true,
			},
		};

		rerender();

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle disabled queries', async () => {
		// Set up a mock handler to ensure no requests are made
		let requestMade = false;
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibleActivities'), () => {
				requestMade = true;
				return HttpResponse.json({
					activities: [mockActivity],
					page: { page: 1, pageSize: 10, more: false },
				});
			}),
		);

		// Create a disabled query args
		const disabledArgs: UseListCollectibleActivitiesParams = {
			...defaultArgs,
			query: {
				enabled: false,
			},
		};

		// Render hook with disabled query
		const { result } = renderHook(() =>
			useCollectibleMarketActivities(disabledArgs),
		);

		// For disabled queries, we expect no loading state and no data
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
		expect(requestMade).toBe(false);
	});

	it('should handle pagination correctly', async () => {
		// Override the handler for this test to return paginated data
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibleActivities'), () => {
				return HttpResponse.json({
					activities: [mockActivity],
					page: { page: 2, pageSize: 20, more: false },
				});
			}),
		);

		const paginatedArgs: UseListCollectibleActivitiesParams = {
			...defaultArgs,
			page: 2,
			pageSize: 20,
			query: {
				enabled: true,
			},
		};

		const { result } = renderHook(() =>
			useCollectibleMarketActivities(paginatedArgs),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data?.page).toEqual({
			page: 2,
			pageSize: 20,
			more: false,
		});
	});
});
