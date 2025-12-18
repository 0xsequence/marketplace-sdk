import { MarketplaceMocks } from '@0xsequence/api-client';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import { useOrders } from './useOrders';

const { mockMarketplaceEndpoint, mockOrder } = MarketplaceMocks;

describe('useOrders', () => {
	const defaultArgs = {
		chainId: 1,
		input: [
			{
				contractAddress: zeroAddress,
				tokenId: '1',
			},
		],
	};

	it('should fetch orders successfully', async () => {
		server.use(
			http.post(mockMarketplaceEndpoint('GetOrders'), () => {
				return HttpResponse.json({
					orders: [mockOrder],
					page: { page: 1, pageSize: 10, more: false },
				});
			}),
		);

		const { result } = renderHook(() => useOrders(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data
		expect(result.current.data?.orders).toEqual([mockOrder]);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		server.use(
			http.post(mockMarketplaceEndpoint('GetOrders'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch orders' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useOrders(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		let callCount = 0;
		server.use(
			http.post(mockMarketplaceEndpoint('GetOrders'), () => {
				callCount++;
				return HttpResponse.json({
					orders: [mockOrder],
					page: { page: 1, pageSize: 10, more: false },
				});
			}),
		);

		let currentArgs = defaultArgs;
		const { result, rerender } = renderHook(() => useOrders(currentArgs));

		// Wait for initial data
		await waitFor(() => {
			expect((result.current as any).isSuccess).toBe(true);
		});
		
		// Reset call counter after initial load to specifically track the refetch
		callCount = 0;

		// Change args and rerender
		currentArgs = {
			...defaultArgs,
			chainId: 137,
		};

		rerender();

		// Wait for new data
		await waitFor(() => {
			expect(callCount).toBeGreaterThan(0);
		});

		expect((result.current as any).isSuccess).toBe(true);
	});

	it('should not fetch if required params are missing', async () => {
		const { result } = renderHook(() =>
			useOrders({
				...defaultArgs,
				chainId: undefined as any,
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.status).toBe('pending');
	});

	it('should respect the enabled flag in query options', async () => {
		let requestMade = false;
		server.use(
			http.post(mockMarketplaceEndpoint('GetOrders'), () => {
				requestMade = true;
				return HttpResponse.json({
					orders: [mockOrder],
					page: { page: 1, pageSize: 10, more: false },
				});
			}),
		);

		const { result } = renderHook(() =>
			useOrders({
				...defaultArgs,
				query: {
					enabled: false,
				},
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(requestMade).toBe(false);
	});
});
