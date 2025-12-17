import { MarketplaceMocks, OrderSide } from '@0xsequence/api-client';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import type { UseCollectionMarketItemsCountParams } from './market-items-count';
import { useCollectionMarketItemsCount } from './market-items-count';

const { mockMarketplaceEndpoint } = MarketplaceMocks;

describe('useCollectionMarketItemsCount', () => {
	const defaultArgs: UseCollectionMarketItemsCountParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
		side: OrderSide.listing,
	};

	it('should fetch orders count successfully', async () => {
		const mockCount = 100;

		server.use(
			http.post(mockMarketplaceEndpoint('GetCountOfAllOrders'), () => {
				return HttpResponse.json({ count: mockCount });
			}),
		);

		const { result } = renderHook(() =>
			useCollectionMarketItemsCount(defaultArgs),
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
			http.post(mockMarketplaceEndpoint('GetCountOfAllOrders'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch count' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() =>
			useCollectionMarketItemsCount(defaultArgs),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const mockCount1 = 50;
		const mockCount2 = 75;

		let callCount = 0;
		server.use(
			http.post(mockMarketplaceEndpoint('GetCountOfAllOrders'), () => {
				callCount++;
				return HttpResponse.json({
					count: callCount === 1 ? mockCount1 : mockCount2,
				});
			}),
		);

		const { result, rerender } = renderHook(
			(args: UseCollectionMarketItemsCountParams = defaultArgs) =>
				useCollectionMarketItemsCount(args),
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
			useCollectionMarketItemsCount({
				...defaultArgs,
				chainId: undefined,
			} as any),
		);

		// In TanStack Query v5, disabled queries start in 'pending' state but isLoading is false (if using useQuery)
		// However, the exact behavior depends on the version.
		// Based on market-filtered-count.test.tsx, we check isLoading is false.
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
	});
});
