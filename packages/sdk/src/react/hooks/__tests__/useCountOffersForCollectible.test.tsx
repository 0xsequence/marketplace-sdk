import { renderHook, server, waitFor } from '@test';
import { http, HttpResponse } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import { mockMarketplaceEndpoint } from '../../_internal/api/__mocks__/marketplace.msw';
import { useCountOffersForCollectible } from '../useCountOffersForCollectible';

describe('useCountOffersForCollectible', () => {
	const defaultArgs = {
		chainId: '1',
		collectionAddress: zeroAddress,
		collectibleId: '1',
		query: {},
	};

	it('should fetch offers count successfully', async () => {
		const { result } = renderHook(() =>
			useCountOffersForCollectible(defaultArgs),
		);

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual({ count: 1 });
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(
				mockMarketplaceEndpoint('GetCountOfOffersForCollectible'),
				() => {
					return HttpResponse.json(
						{ error: { message: 'Failed to fetch offers count' } },
						{ status: 500 },
					);
				},
			),
		);

		const { result } = renderHook(() =>
			useCountOffersForCollectible(defaultArgs),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() =>
			useCountOffersForCollectible(defaultArgs),
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change args and rerender
		const newArgs = {
			...defaultArgs,
			collectionAddress:
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
			collectibleId: '2',
		};

		rerender(() => useCountOffersForCollectible(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle query options', async () => {
		const argsWithQuery = {
			...defaultArgs,
			query: {
				enabled: false,
			},
		};

		const { result } = renderHook(() =>
			useCountOffersForCollectible(argsWithQuery),
		);

		// Should not fetch when disabled
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
	});
});
