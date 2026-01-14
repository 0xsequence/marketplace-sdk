import { QueryClient } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
	GetCountOfListingsForCollectibleResponse,
	GetCountOfOffersForCollectibleResponse,
	ListListingsForCollectibleResponse,
	ListOffersForCollectibleResponse,
} from '../../_internal';
import {
	invalidateQueriesOnCancel,
	updateQueriesOnCancel,
} from './optimisticCancelUpdates';

describe('optimisticCancelUpdates', () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
					staleTime: 0,
				},
			},
		});
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		queryClient.clear();
	});

	describe('updateQueriesOnCancel', () => {
		const orderId = 'test-order-123';

		describe('offers count updates', () => {
			it('should decrement offers count by 1', () => {
				const initialData: GetCountOfOffersForCollectibleResponse = {
					count: 5,
				};

				queryClient.setQueryData(
					['collectible', 'market-offers-count', 'test-key'],
					initialData,
				);

				updateQueriesOnCancel({ orderId, queryClient });

				const updatedData =
					queryClient.getQueryData<GetCountOfOffersForCollectibleResponse>([
						'collectible',
						'market-offers-count',
						'test-key',
					]);

				expect(updatedData).toBe(4);
			});

			it('should not go below 0 when count is 0', () => {
				const initialData: GetCountOfOffersForCollectibleResponse = {
					count: 0,
				};

				queryClient.setQueryData(
					['collectible', 'market-offers-count', 'test-key'],
					initialData,
				);

				updateQueriesOnCancel({ orderId, queryClient });

				const updatedData = queryClient.getQueryData<number>([
					'collectible',
					'market-offers-count',
					'test-key',
				]);

				expect(updatedData).toBe(0);
			});

			it('should return 0 when no data exists', () => {
				updateQueriesOnCancel({ orderId, queryClient });

				const updatedData = queryClient.getQueryData<number>([
					'collectible',
					'market-offers-count',
					'test-key',
				]);

				expect(updatedData).toBeUndefined();
			});
		});

		describe('offers list updates', () => {
			it('should remove offer with matching orderId', () => {
				const initialData: ListOffersForCollectibleResponse = {
					offers: [
						{ orderId: 'order-1', createdBy: '0x123' } as any,
						{ orderId: 'test-order-123', createdBy: '0x456' } as any,
						{ orderId: 'order-3', createdBy: '0x789' } as any,
					],
				};

				queryClient.setQueryData(
					['collectible', 'market-offers', 'test-key'],
					initialData,
				);

				updateQueriesOnCancel({ orderId, queryClient });

				const updatedData =
					queryClient.getQueryData<ListOffersForCollectibleResponse>([
						'collectible',
						'market-offers',
						'test-key',
					]);

				expect(updatedData?.offers).toHaveLength(2);
				expect(updatedData?.offers?.map((o) => o.orderId)).toEqual([
					'order-1',
					'order-3',
				]);
			});

			it('should return original data when offers array is undefined', () => {
				const initialData: ListOffersForCollectibleResponse = {
					offers: undefined as any,
				};

				queryClient.setQueryData(
					['collectible', 'market-offers', 'test-key'],
					initialData,
				);

				updateQueriesOnCancel({ orderId, queryClient });

				const updatedData =
					queryClient.getQueryData<ListOffersForCollectibleResponse>([
						'collectible',
						'market-offers',
						'test-key',
					]);

				expect(updatedData).toEqual(initialData);
			});

			it('should return original data when data is undefined', () => {
				updateQueriesOnCancel({ orderId, queryClient });

				const updatedData =
					queryClient.getQueryData<ListOffersForCollectibleResponse>([
						'collectible',
						'market-offers',
						'test-key',
					]);

				expect(updatedData).toBeUndefined();
			});

			it('should not remove offers with different orderIds', () => {
				const initialData: ListOffersForCollectibleResponse = {
					offers: [
						{ orderId: 'order-1', createdBy: '0x123' } as any,
						{ orderId: 'order-2', createdBy: '0x456' } as any,
					],
				};

				queryClient.setQueryData(
					['collectible', 'market-offers', 'test-key'],
					initialData,
				);

				updateQueriesOnCancel({ orderId, queryClient });

				const updatedData =
					queryClient.getQueryData<ListOffersForCollectibleResponse>([
						'collectible',
						'market-offers',
						'test-key',
					]);

				expect(updatedData?.offers).toHaveLength(2);
			});
		});

		describe('listings count updates', () => {
			it('should decrement listings count by 1', () => {
				const initialData: GetCountOfListingsForCollectibleResponse = {
					count: 10,
				};

				queryClient.setQueryData(
					['collectible', 'market-listings-count', 'test-key'],
					initialData,
				);

				updateQueriesOnCancel({ orderId, queryClient });

				const updatedData = queryClient.getQueryData<number>([
					'collectible',
					'market-listings-count',
					'test-key',
				]);

				expect(updatedData).toBe(9);
			});

			it('should not go below 0 when count is 0', () => {
				const initialData: GetCountOfListingsForCollectibleResponse = {
					count: 0,
				};

				queryClient.setQueryData(
					['collectible', 'market-listings-count', 'test-key'],
					initialData,
				);

				updateQueriesOnCancel({ orderId, queryClient });

				const updatedData = queryClient.getQueryData<number>([
					'collectible',
					'market-listings-count',
					'test-key',
				]);

				expect(updatedData).toBe(0);
			});
		});

		describe('listings list updates', () => {
			it('should remove listing with matching orderId', () => {
				const initialData: ListListingsForCollectibleResponse = {
					listings: [
						{ orderId: 'listing-1', createdBy: '0x123' } as any,
						{ orderId: 'test-order-123', createdBy: '0x456' } as any,
						{ orderId: 'listing-3', createdBy: '0x789' } as any,
					],
				};

				queryClient.setQueryData(
					['collectible', 'market-listings', 'test-key'],
					initialData,
				);

				updateQueriesOnCancel({ orderId, queryClient });

				const updatedData =
					queryClient.getQueryData<ListListingsForCollectibleResponse>([
						'collectible',
						'market-listings',
						'test-key',
					]);

				expect(updatedData?.listings).toHaveLength(2);
				expect(updatedData?.listings?.map((l) => l.orderId)).toEqual([
					'listing-1',
					'listing-3',
				]);
			});

			it('should return original data when listings array is undefined', () => {
				const initialData: ListListingsForCollectibleResponse = {
					listings: undefined as any,
				};

				queryClient.setQueryData(
					['collectible', 'market-listings', 'test-key'],
					initialData,
				);

				updateQueriesOnCancel({ orderId, queryClient });

				const updatedData =
					queryClient.getQueryData<ListListingsForCollectibleResponse>([
						'collectible',
						'market-listings',
						'test-key',
					]);

				expect(updatedData).toEqual(initialData);
			});
		});

		describe('delayed invalidations', () => {
			it('should invalidate market-highest-offer after 2 seconds', () => {
				const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

				updateQueriesOnCancel({ orderId, queryClient });

				// Should not be called immediately
				expect(invalidateSpy).not.toHaveBeenCalledWith(
					expect.objectContaining({
						queryKey: ['collectible', 'market-highest-offer'],
					}),
				);

				// Fast-forward time by 2 seconds
				vi.advanceTimersByTime(2000);

				// Should be called after 2 seconds
				expect(invalidateSpy).toHaveBeenCalledWith({
					queryKey: ['collectible', 'market-highest-offer'],
					exact: false,
					predicate: expect.any(Function),
				});
			});

			it('should invalidate market-lowest-listing after 2 seconds', () => {
				const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

				updateQueriesOnCancel({ orderId, queryClient });

				// Should not be called immediately
				expect(invalidateSpy).not.toHaveBeenCalledWith(
					expect.objectContaining({
						queryKey: ['collectible', 'market-lowest-listing'],
					}),
				);

				// Fast-forward time by 2 seconds
				vi.advanceTimersByTime(2000);

				// Should be called after 2 seconds
				expect(invalidateSpy).toHaveBeenCalledWith({
					queryKey: ['collectible', 'market-lowest-listing'],
					exact: false,
				});
			});

			it('should not invalidate persistent queries for market-highest-offer', () => {
				// Set up a persistent query
				queryClient.setQueryData(
					['collectible', 'market-highest-offer', 'persistent'],
					{ price: '1000' },
				);
				queryClient.setQueryDefaults(
					['collectible', 'market-highest-offer', 'persistent'],
					{ meta: { persistent: true } },
				);

				// Set up a non-persistent query
				queryClient.setQueryData(
					['collectible', 'market-highest-offer', 'regular'],
					{ price: '2000' },
				);

				updateQueriesOnCancel({ orderId, queryClient });

				// Fast-forward time by 2 seconds
				vi.advanceTimersByTime(2000);

				const regularQuery = queryClient.getQueryCache().find({
					queryKey: ['collectible', 'market-highest-offer', 'regular'],
				});

				// The regular query should be invalidated (stale)
				expect(regularQuery?.isStale()).toBe(true);
			});
		});

		describe('multiple queries updates', () => {
			it('should update all matching queries with partial key match', () => {
				// Set up multiple queries with different keys but matching pattern
				queryClient.setQueryData(
					['collectible', 'market-offers-count', 'collection-1'],
					{ count: 5 } as GetCountOfOffersForCollectibleResponse,
				);
				queryClient.setQueryData(
					['collectible', 'market-offers-count', 'collection-2'],
					{ count: 3 } as GetCountOfOffersForCollectibleResponse,
				);

				updateQueriesOnCancel({ orderId, queryClient });

				const data1 = queryClient.getQueryData<number>([
					'collectible',
					'market-offers-count',
					'collection-1',
				]);
				const data2 = queryClient.getQueryData<number>([
					'collectible',
					'market-offers-count',
					'collection-2',
				]);

				expect(data1).toBe(4);
				expect(data2).toBe(2);
			});
		});
	});

	describe('invalidateQueriesOnCancel', () => {
		it('should invalidate all market-offers queries', () => {
			const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

			invalidateQueriesOnCancel({ queryClient });

			expect(invalidateSpy).toHaveBeenCalledWith({
				queryKey: ['collectible', 'market-offers'],
				exact: false,
			});
		});

		it('should invalidate all market-offers-count queries', () => {
			const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

			invalidateQueriesOnCancel({ queryClient });

			expect(invalidateSpy).toHaveBeenCalledWith({
				queryKey: ['collectible', 'market-offers-count'],
				exact: false,
			});
		});

		it('should invalidate all market-listings queries', () => {
			const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

			invalidateQueriesOnCancel({ queryClient });

			expect(invalidateSpy).toHaveBeenCalledWith({
				queryKey: ['collectible', 'market-listings'],
				exact: false,
			});
		});

		it('should invalidate all market-listings-count queries', () => {
			const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

			invalidateQueriesOnCancel({ queryClient });

			expect(invalidateSpy).toHaveBeenCalledWith({
				queryKey: ['collectible', 'market-listings-count'],
				exact: false,
			});
		});

		it('should invalidate all market-highest-offer queries', () => {
			const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

			invalidateQueriesOnCancel({ queryClient });

			expect(invalidateSpy).toHaveBeenCalledWith({
				queryKey: ['collectible', 'market-highest-offer'],
				exact: false,
			});
		});

		it('should invalidate all market-lowest-listing queries', () => {
			const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

			invalidateQueriesOnCancel({ queryClient });

			expect(invalidateSpy).toHaveBeenCalledWith({
				queryKey: ['collectible', 'market-lowest-listing'],
				exact: false,
			});
		});

		it('should invalidate all 6 query types in a single call', () => {
			const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

			invalidateQueriesOnCancel({ queryClient });

			expect(invalidateSpy).toHaveBeenCalledTimes(6);
		});

		it('should mark existing queries as stale', () => {
			// Set up some queries
			queryClient.setQueryData(['collectible', 'market-offers', 'test'], {
				offers: [],
			});
			queryClient.setQueryData(['collectible', 'market-listings', 'test'], {
				listings: [],
			});

			invalidateQueriesOnCancel({ queryClient });

			const offersQuery = queryClient
				.getQueryCache()
				.find({ queryKey: ['collectible', 'market-offers', 'test'] });
			const listingsQuery = queryClient
				.getQueryCache()
				.find({ queryKey: ['collectible', 'market-listings', 'test'] });

			expect(offersQuery?.isStale()).toBe(true);
			expect(listingsQuery?.isStale()).toBe(true);
		});
	});
});
