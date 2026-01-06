import type { ListCollectionActivitiesRequest } from '@0xsequence/api-client';
import { SortOrder } from '@0xsequence/api-client';
import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';

const { mockActivity, mockMarketplaceEndpoint } = MarketplaceMocks;

import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import type { UseCollectionMarketActivitiesParams } from './market-activities';
import { useCollectionMarketActivities } from './market-activities';

describe('useCollectionMarketActivities', () => {
	const defaultArgs: UseCollectionMarketActivitiesParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
		page: 1,
		pageSize: 10,
		query: {
			enabled: true,
		},
	};

	it('should fetch collection activities successfully', async () => {
		// Set up the default success handler
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectionActivities'), () => {
				return HttpResponse.json({
					activities: [mockActivity],
					page: { page: 1, pageSize: 10, more: false },
				});
			}),
		);

		const { result } = renderHook(() =>
			useCollectionMarketActivities(defaultArgs),
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
			http.post(mockMarketplaceEndpoint('ListCollectionActivities'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch activities' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() =>
			useCollectionMarketActivities(defaultArgs),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should handle disabled queries', async () => {
		// Set up a mock handler to ensure no requests are made
		let requestMade = false;
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectionActivities'), () => {
				requestMade = true;
				return HttpResponse.json({
					activities: [mockActivity],
					page: { page: 1, pageSize: 10, more: false },
				});
			}),
		);

		const disabledArgs: UseCollectionMarketActivitiesParams = {
			...defaultArgs,
			query: {
				enabled: false,
			},
		};

		const { result } = renderHook(() =>
			useCollectionMarketActivities(disabledArgs),
		);

		// For disabled queries, we expect no loading state and no data
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
		expect(requestMade).toBe(false);
	});

	it('should refetch when args change', async () => {
		// Set up the success handler
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectionActivities'), () => {
				return HttpResponse.json({
					activities: [mockActivity],
					page: { page: 1, pageSize: 10, more: false },
				});
			}),
		);

		let currentArgs = defaultArgs;
		const { result, rerender } = renderHook(() =>
			useCollectionMarketActivities(currentArgs),
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change args and rerender
		currentArgs = {
			...defaultArgs,
			collectionAddress: '0x1234567890123456789012345678901234567890',
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

	it('should handle sorting parameters', async () => {
		const argsWithSort: UseCollectionMarketActivitiesParams = {
			...defaultArgs,
			page: 1,
			pageSize: 10,
			sort: [{ column: 'createdAt', order: SortOrder.DESC }],
			query: {
				enabled: true,
			},
		};

		let requestArgs: ListCollectionActivitiesRequest | null = null;

		server.use(
			http.post(
				mockMarketplaceEndpoint('ListCollectionActivities'),
				async ({ request }) => {
					requestArgs =
						(await request.json()) as ListCollectionActivitiesRequest;
					return HttpResponse.json({
						activities: [mockActivity],
						page: { page: 1, pageSize: 10, more: false },
					});
				},
			),
		);

		const { result } = renderHook(() =>
			useCollectionMarketActivities(argsWithSort),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		await waitFor(() => {
			expect(requestArgs).not.toBeNull();
			expect(requestArgs?.page?.sort).toEqual([
				{ column: 'createdAt', order: SortOrder.DESC },
			]);
		});
	});

	it('should handle pagination correctly', async () => {
		// Override the handler for this test to return paginated data
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectionActivities'), () => {
				return HttpResponse.json({
					activities: [mockActivity],
					page: { page: 2, pageSize: 20, more: false },
				});
			}),
		);

		const paginatedArgs: UseCollectionMarketActivitiesParams = {
			...defaultArgs,
			page: 2,
			pageSize: 20,
			query: {
				enabled: true,
			},
		};

		const { result } = renderHook(() =>
			useCollectionMarketActivities(paginatedArgs),
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
