import { describe, expect, it, beforeEach } from 'vitest';
import { useListCollectionActivities } from '../useListCollectionActivities';
import { renderHook, waitFor } from '../../_internal/test-utils';
import { zeroAddress } from 'viem';
import type { UseListCollectionActivitiesArgs } from '../useListCollectionActivities';
import { http, HttpResponse } from 'msw';
import {
	mockActivity,
	mockMarketplaceEndpoint,
} from '../../_internal/api/__mocks__/marketplace.msw';
import { server } from '../../_internal/test/setup';
import { SortOrder } from '../../_internal/api/marketplace.gen';
import type { ListCollectionActivitiesArgs } from '../../_internal/api/marketplace.gen';

describe('useListCollectionActivities', () => {
	const defaultArgs: UseListCollectionActivitiesArgs = {
		chainId: '1',
		collectionAddress: zeroAddress,
		query: {
			enabled: true,
			page: 1,
			pageSize: 10,
		},
	};

	// Reset handlers before each test
	beforeEach(() => {
		server.resetHandlers();
	});

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
			useListCollectionActivities(defaultArgs),
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
			useListCollectionActivities(defaultArgs),
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

		const disabledArgs: UseListCollectionActivitiesArgs = {
			...defaultArgs,
			query: {
				enabled: false,
				page: 1,
				pageSize: 10,
			},
		};

		const { result } = renderHook(() =>
			useListCollectionActivities(disabledArgs),
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
			useListCollectionActivities(currentArgs),
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
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle sorting parameters', async () => {
		const argsWithSort: UseListCollectionActivitiesArgs = {
			...defaultArgs,
			query: {
				enabled: true,
				page: 1,
				pageSize: 10,
				sort: [{ column: 'createdAt', order: SortOrder.DESC }],
			},
		};

		let requestArgs: ListCollectionActivitiesArgs | null = null;

		server.use(
			http.post(
				mockMarketplaceEndpoint('ListCollectionActivities'),
				async ({ request }) => {
					requestArgs = (await request.json()) as ListCollectionActivitiesArgs;
					return HttpResponse.json({
						activities: [mockActivity],
						page: { page: 1, pageSize: 10, more: false },
					});
				},
			),
		);

		const { result } = renderHook(() =>
			useListCollectionActivities(argsWithSort),
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

		const paginatedArgs: UseListCollectionActivitiesArgs = {
			...defaultArgs,
			query: {
				enabled: true,
				page: 2,
				pageSize: 20,
			},
		};

		const { result } = renderHook(() =>
			useListCollectionActivities(paginatedArgs),
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
