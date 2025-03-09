import { renderHook, waitFor } from '@test';
import { server } from '@test';
import { http, HttpResponse } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import {
	mockMarketplaceEndpoint,
	mockOrder,
} from '../../_internal/api/__mocks__/marketplace.msw';
import { MarketplaceKind } from '../../_internal/api/marketplace.gen';
import { useListListingsForCollectible } from '../useListListingsForCollectible';

describe('useListListingsForCollectible', () => {
	const defaultArgs = {
		chainId: '1',
		collectionAddress: zeroAddress,
		collectibleId: '1',
		page: {
			page: 1,
			pageSize: 10,
		},
	} as const;

	it('should fetch listings data successfully', async () => {
		const { result } = renderHook(() =>
			useListListingsForCollectible(defaultArgs),
		);

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toBeDefined();
		expect(result.current.data?.listings).toEqual([mockOrder]);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibleListings'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch listings' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() =>
			useListListingsForCollectible(defaultArgs),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() =>
			useListListingsForCollectible(defaultArgs),
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change args and rerender
		const newArgs = {
			...defaultArgs,
			collectibleId: '2',
		};

		rerender(() => useListListingsForCollectible(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data?.listings).toEqual([mockOrder]);
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle pagination correctly', async () => {
		const paginatedArgs = {
			...defaultArgs,
			page: {
				page: 2,
				pageSize: 20,
			},
		} as const;

		const { result } = renderHook(() =>
			useListListingsForCollectible(paginatedArgs),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data?.page).toBeDefined();
		expect(result.current.data?.page?.page).toBe(1);
		expect(result.current.data?.page?.pageSize).toBe(10);
		expect(result.current.data?.page?.more).toBe(false);
	});

	it('should handle optional filter parameter', async () => {
		const argsWithFilter = {
			...defaultArgs,
			filter: {
				marketplace: [
					MarketplaceKind.sequence_marketplace_v2,
				] as MarketplaceKind[],
				currencies: [zeroAddress] as string[],
			},
		} as const;

		const { result } = renderHook(() =>
			useListListingsForCollectible(argsWithFilter),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data?.listings).toEqual([mockOrder]);
		expect(result.current.isSuccess).toBe(true);
	});
});
