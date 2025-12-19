import { MarketplaceMocks, OrderSide } from '@0xsequence/api-client';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import type { UseCollectionMarketFilteredCountParams } from './market-filtered-count';
import { useCollectionMarketFilteredCount } from './market-filtered-count';

const { mockMarketplaceEndpoint } = MarketplaceMocks;

describe('useCollectionMarketFilteredCount', () => {
	const defaultArgs: UseCollectionMarketFilteredCountParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
		side: OrderSide.listing,
	};

	it('should fetch filtered orders count successfully', async () => {
		const mockCount = 42;

		server.use(
			http.post(mockMarketplaceEndpoint('GetCountOfFilteredOrders'), () => {
				return HttpResponse.json({ count: mockCount });
			}),
		);

		const { result } = renderHook(() =>
			useCollectionMarketFilteredCount(defaultArgs),
		);

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toBe(mockCount);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMarketplaceEndpoint('GetCountOfFilteredOrders'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch count' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() =>
			useCollectionMarketFilteredCount(defaultArgs),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const mockCount1 = 10;
		const mockCount2 = 20;

		let callCount = 0;
		server.use(
			http.post(mockMarketplaceEndpoint('GetCountOfFilteredOrders'), () => {
				callCount++;
				return HttpResponse.json({
					count: callCount === 1 ? mockCount1 : mockCount2,
				});
			}),
		);

		const { result, rerender } = renderHook(
			(args: UseCollectionMarketFilteredCountParams = defaultArgs) =>
				useCollectionMarketFilteredCount(args),
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.data).toBe(mockCount1);
		});

		// Change args and rerender
		const newArgs = {
			...defaultArgs,
			side: OrderSide.offer,
		};

		rerender(newArgs);

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBe(mockCount2);
		});
	});

	it('should not fetch if required params are missing', async () => {
		const { result } = renderHook(() =>
			useCollectionMarketFilteredCount({
				...defaultArgs,
				chainId: undefined,
			} as any),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isPending).toBe(true); // enabled: false results in isPending: true, isLoading: false (in v5) or similar depending on version.
		// Actually, in TanStack Query v5, disabled queries start in 'pending' state.
		// Let's check what `market-floor.test.tsx` did.
		// It checked `isLoading` is false.
	});
});
