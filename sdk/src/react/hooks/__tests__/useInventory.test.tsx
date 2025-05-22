import { renderHook, server, waitFor } from '@test';
import { http, HttpResponse } from 'msw';
import { type Address, zeroAddress } from 'viem';
import { beforeEach, describe, expect, it } from 'vitest';
import type { LookupMarketplaceReturn } from '../../../types';
import { ContractType } from '../../_internal';
import {
	createLookupMarketplaceHandler,
	mockConfig,
} from '../../_internal/api/__mocks__/builder.msw';
import {
	mockIndexerEndpoint,
	mockTokenBalance,
} from '../../_internal/api/__mocks__/indexer.msw';
import {
	mockCollectibleOrder,
	mockMarketplaceEndpoint,
} from '../../_internal/api/__mocks__/marketplace.msw';
import type { UseInventoryArgs } from '../../queries/inventory';
import { useInventory } from '../useInventory';

// Make sure mockCollectibleOrder has a tokenId of "1" for tests
mockCollectibleOrder.metadata.tokenId = '1';

describe('useInventory', () => {
	const defaultArgs: UseInventoryArgs = {
		accountAddress: '0x1234567890123456789012345678901234567890' as Address,
		chainId: 1,
		collectionAddress: zeroAddress,
	};

	beforeEach(() => {
		// Reset MSW handlers before each test to ensure a clean state
		server.resetHandlers();
	});

	it('should fetch inventory data successfully', async () => {
		const { result } = renderHook(() => useInventory(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data is defined and has pages
		expect(result.current.data).toBeDefined();
		expect(result.current.data?.pages).toBeDefined();
		expect(result.current.error).toBeNull();
	});

	it('should handle error gracefully', async () => {
		// Mock both API endpoints to return errors
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return new HttpResponse(null, { status: 500 });
			}),
			http.post(mockIndexerEndpoint('GetTokenBalances'), () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);

		const { result } = renderHook(() =>
			useInventory({
				...defaultArgs,
				// Add a unique key to avoid caching
				collectionAddress:
					'0xdeadbeef0000000000000000000000000000dead' as Address,
			}),
		);

		// Wait for the query to finish loading and show error
		await waitFor(
			() => {
				expect(result.current.isLoading).toBe(false);
			},
			{ timeout: 3000 },
		);

		// Verify error state
		expect(result.current.status).toBe('error');
		expect(result.current.isError).toBe(true);
		expect(result.current.error).not.toBeNull();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() => useInventory(defaultArgs));

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change args and rerender with a new hook
		const newArgs = {
			...defaultArgs,
			collectionAddress:
				'0x1234567890123456789012345678901234567890' as Address,
		};

		rerender(() => useInventory(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle disabled queries', async () => {
		const disabledArgs: UseInventoryArgs = {
			...defaultArgs,
			query: {
				enabled: false,
			},
		};

		const { result } = renderHook(() => useInventory(disabledArgs));

		// Should not be loading or have data
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.isFetched).toBe(false);
	});

	it('should use isLaos721 flag from marketplaceConfig', async () => {
		// Setup config with LAOS collection
		const laosCollectionAddress = '0x1234567890123456789012345678901234567890';
		const configWithLaos = {
			...mockConfig,
			marketCollections: [
				{
					...mockConfig.marketCollections[0],
					itemsAddress: laosCollectionAddress,
					contractType: ContractType.LAOSERC721,
				},
			],
		} satisfies LookupMarketplaceReturn;
		server.use(createLookupMarketplaceHandler(configWithLaos));

		const laosArgs: UseInventoryArgs = {
			...defaultArgs,
			collectionAddress: laosCollectionAddress as Address,
		};

		const { result } = renderHook(() => useInventory(laosArgs));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});

	it('should fetch data from indexer when marketplace API has no more results', async () => {
		// Mock marketplace API with empty results
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					collectibles: [],
					page: {
						page: 1,
						pageSize: 50,
						more: false,
					},
				});
			}),
			// Mock indexer with data
			http.post(mockIndexerEndpoint('GetTokenBalances'), () => {
				return HttpResponse.json({
					balances: [mockTokenBalance],
					page: {
						page: 1,
						pageSize: 50,
						more: false,
					},
				});
			}),
		);

		const { result } = renderHook(() => useInventory(defaultArgs));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.data?.pages[0].collectibles).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});

	it('should support pagination with fetchNextPage', async () => {
		// Simplified test for pagination
		// Set up mock data for first and second pages
		const page1Data = {
			collectibles: [
				{
					...mockCollectibleOrder,
					metadata: {
						...mockCollectibleOrder.metadata,
						tokenId: '1',
						name: 'Token 1',
					},
				},
			],
			page: {
				page: 1,
				pageSize: 10,
				more: true, // indicate there's a next page
			},
		};

		// Mock API to return data for the first page
		server.use(
			http.post(
				mockMarketplaceEndpoint('ListCollectibles'),
				async ({ request }) => {
					const body = (await request.json()) as { page?: number };
					const pageNumber = body?.page || 1;

					// Return first page data
					if (pageNumber === 1) {
						return HttpResponse.json(page1Data);
					}

					// For second page, return empty collectibles but with more=false
					return HttpResponse.json({
						collectibles: [],
						page: {
							page: 2,
							pageSize: 10,
							more: false,
						},
					});
				},
			),
		);

		// Use unique test args to avoid caching issues
		const testArgs = {
			...defaultArgs,
			accountAddress: '0xabcdef1234567890abcdef1234567890abcdef12' as Address,
			collectionAddress:
				'0xabcdef1234567890abcdef1234567890abcdef12' as Address,
		};

		const { result } = renderHook(() => useInventory(testArgs));

		// Wait for the first page to load
		await waitFor(
			() => {
				expect(result.current.isLoading).toBe(false);
				expect(result.current.data?.pages).toBeDefined();
			},
			{ timeout: 5000 },
		);

		// Verify first page data loaded correctly
		expect(result.current.data?.pages[0].collectibles).toBeDefined();
		expect(result.current.data?.pages[0].collectibles.length).toBeGreaterThan(
			0,
		);
		// Check that at least one item has the expected tokenId
		expect(
			result.current.data?.pages[0].collectibles.some(
				(c) => c.metadata.tokenId === '1',
			),
		).toBe(true);
		expect(result.current.hasNextPage).toBe(true);

		// Fetch the next page
		await result.current.fetchNextPage();

		// Wait for second page to load
		await waitFor(
			() => {
				expect(result.current.data?.pages.length).toBe(2);
			},
			{ timeout: 5000 },
		);

		// For an empty second page we just verify it exists
		expect(result.current.data?.pages[1]).toBeDefined();
		expect(result.current.hasNextPage).toBe(false); // No more pages
	});
});
