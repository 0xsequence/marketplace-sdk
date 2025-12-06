import { IndexerMocks, MarketplaceMocks } from '@0xsequence/api-client';

const { mockIndexerEndpoint, mockTokenBalance } = IndexerMocks;
const { mockCollectibleOrder, mockMarketplaceEndpoint } = MarketplaceMocks;

import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { type Address, zeroAddress } from 'viem';
import { beforeEach, describe, expect, it } from 'vitest';
import type { UseInventoryArgs } from '../../queries';
import { useInventory } from './inventory';

// Make sure mockCollectibleOrder has a tokenId of "1" for tests
mockCollectibleOrder.metadata.tokenId = 1n;

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

		// Verify the data is defined and has collectibles
		expect(result.current.data).toBeDefined();
		expect(result.current.data?.collectibles).toBeDefined();
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
		expect(result.current.data?.collectibles).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});
});
