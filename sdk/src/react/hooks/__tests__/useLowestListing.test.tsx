import { renderHook, server, waitFor } from '@test';
import { http, HttpResponse } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it, vi } from 'vitest';
import {
	mockMarketplaceEndpoint,
	mockOrder,
} from '../../_internal/api/__mocks__/marketplace.msw';
import { MarketplaceKind } from '../../_internal/api/marketplace.gen';
import { mockMarketplaceClient } from '../../test/mocks';
import { createWrapper } from '../../test/utils';
import { useLowestListing } from '../useLowestListing';

describe('useLowestListing', () => {
	const defaultArgs = {
		chainId: 1,
		collectionAddress: zeroAddress as `0x${string}`,
		tokenId: '1',
	};

	it('should fetch lowest listing data successfully', async () => {
		const { result } = renderHook(() => useLowestListing(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toBeDefined();
		expect(result.current.data?.order).toEqual(mockOrder);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMarketplaceEndpoint('GetCollectibleLowestListing'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch lowest listing' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useLowestListing(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() =>
			useLowestListing(defaultArgs),
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
			tokenId: '2',
		};

		rerender(() => useLowestListing(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data?.order).toEqual(mockOrder);
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle optional filter parameter', async () => {
		const argsWithFilter = {
			...defaultArgs,
			filters: {
				marketplace: [
					MarketplaceKind.sequence_marketplace_v2,
				] as MarketplaceKind[],
				currencies: [zeroAddress] as string[],
			},
		};

		const { result } = renderHook(() => useLowestListing(argsWithFilter));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data?.order).toEqual(mockOrder);
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle query options', async () => {
		const argsWithQuery = {
			...defaultArgs,
			query: {
				enabled: true,
				staleTime: 5000,
				cacheTime: 10000,
			},
		};

		const { result } = renderHook(() => useLowestListing(argsWithQuery));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data?.order).toEqual(mockOrder);
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle disabled query', async () => {
		const argsWithDisabledQuery = {
			...defaultArgs,
			query: {
				enabled: false,
			},
		};

		const { result } = renderHook(() =>
			useLowestListing(argsWithDisabledQuery),
		);

		// Should not be loading since query is disabled
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.isSuccess).toBe(false);
	});

	it('should fetch lowest listing successfully', async () => {
		const mockOrder = {
			orderId: '123',
			priceAmount: '1000000000000000000',
			priceAmountNet: '950000000000000000',
			// ... other order fields
		};

		mockMarketplaceClient.getCollectibleLowestListing.mockResolvedValueOnce({
			order: mockOrder,
		});

		const { result } = renderHook(
			() =>
				useLowestListing({
					collectionAddress: '0x123' as `0x${string}`,
					tokenId: 1n,
					chainId: 1,
				}),
			{
				wrapper: createWrapper(),
			},
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toEqual({
			...mockOrder,
			priceAmount: BigInt(mockOrder.priceAmount),
			priceAmountNet: BigInt(mockOrder.priceAmountNet),
		});
	});

	it('should handle null order response', async () => {
		mockMarketplaceClient.getCollectibleLowestListing.mockResolvedValueOnce({
			order: null,
		});

		const { result } = renderHook(
			() =>
				useLowestListing({
					collectionAddress: '0x123' as `0x${string}`,
					tokenId: 1n,
					chainId: 1,
				}),
			{
				wrapper: createWrapper(),
			},
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toBeNull();
	});

	it('should handle error response', async () => {
		const error = new Error('Failed to fetch');
		mockMarketplaceClient.getCollectibleLowestListing.mockRejectedValueOnce(
			error,
		);

		const { result } = renderHook(
			() =>
				useLowestListing({
					collectionAddress: '0x123' as `0x${string}`,
					tokenId: 1n,
					chainId: 1,
				}),
			{
				wrapper: createWrapper(),
			},
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
	});

	it('should respect query enabled option', async () => {
		const { result } = renderHook(
			() =>
				useLowestListing({
					collectionAddress: '0x123' as `0x${string}`,
					tokenId: 1n,
					chainId: 1,
					query: {
						enabled: false,
					},
				}),
			{
				wrapper: createWrapper(),
			},
		);

		expect(result.current.isLoading).toBe(false);
		expect(
			mockMarketplaceClient.getCollectibleLowestListing,
		).not.toHaveBeenCalled();
	});
});
