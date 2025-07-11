import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	mockCollection,
	mockMarketplaceEndpoint,
} from '../../../../../../_internal/api/__mocks__/marketplace.msw';
import { CollectionStatus } from '../../../../../../_internal/api/marketplace.gen';
import { useCollectionDetailsPolling } from '../../../useCollectionDetailsPolling';

describe('useCollectionDetailsPolling', () => {
	const defaultArgs = {
		chainId: 1,
		collectionAddress: zeroAddress,
	};

	beforeEach(() => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
	});

	it('should poll collection details until terminal state is reached', async () => {
		// Mock initial syncing state
		const syncingCollection = {
			...mockCollection,
			status: CollectionStatus.syncing_orders,
		};
		let requestCount = 0;

		server.use(
			http.post(mockMarketplaceEndpoint('GetCollectionDetail'), () => {
				requestCount++;
				// Return syncing state for first request, then active state
				const response =
					requestCount === 1
						? { collection: syncingCollection }
						: {
								collection: {
									...mockCollection,
									status: CollectionStatus.active,
								},
							};
				return HttpResponse.json(response);
			}),
		);

		const { result } = renderHook(() =>
			useCollectionDetailsPolling({
				...defaultArgs,
			}),
		);

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for first data fetch
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Should be in syncing state
		expect(result.current.data?.status).toBe(CollectionStatus.syncing_orders);

		// Advance timer and run pending timers to trigger next poll
		await vi.advanceTimersByTimeAsync(2000);
		await vi.runOnlyPendingTimersAsync();

		// Wait for second fetch to complete
		await waitFor(() => {
			expect(result.current.data?.status).toBe(CollectionStatus.active);
		});

		// Verify polling stops after reaching terminal state
		const currentRequestCount = requestCount;
		await vi.advanceTimersByTimeAsync(2000);
		await vi.runOnlyPendingTimersAsync();
		expect(requestCount).toBe(currentRequestCount); // Should not make additional requests
	}, 10000);

	it('should stop polling after max attempts', async () => {
		const syncingCollection = {
			...mockCollection,
			status: CollectionStatus.syncing_orders,
		};
		let requestCount = 0;

		server.use(
			http.post(mockMarketplaceEndpoint('GetCollectionDetail'), () => {
				requestCount++;
				return HttpResponse.json({ collection: syncingCollection });
			}),
		);

		renderHook(() =>
			useCollectionDetailsPolling({
				...defaultArgs,
			}),
		);

		// Fast-forward through all attempts
		for (let i = 0; i < 30; i++) {
			await vi.advanceTimersByTimeAsync(2000);
			await vi.runOnlyPendingTimersAsync();
		}

		const finalCount = requestCount;
		await vi.advanceTimersByTimeAsync(30000);
		await vi.runOnlyPendingTimersAsync();
		expect(requestCount).toBe(finalCount); // Should not increase after max attempts
		expect(requestCount).toBeLessThanOrEqual(30); // Should not exceed MAX_ATTEMPTS
	}, 10000);

	it('should handle error states', async () => {
		server.use(
			http.post(mockMarketplaceEndpoint('GetCollectionDetail'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch collection details' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() =>
			useCollectionDetailsPolling({
				...defaultArgs,
			}),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	}, 10000);
});
