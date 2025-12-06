import { ContractType, OrderbookKind } from '@0xsequence/api-client';
import {
	mockIndexerEndpoint,
	mockTokenBalance,
} from '@0xsequence/api-client/mocks/indexer';
import {
	mockCollectibleOrder,
	mockMarketplaceEndpoint,
} from '@0xsequence/api-client/mocks/marketplace';
import { PropertyType } from '@0xsequence/metadata';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDisconnect } from 'wagmi';
import { renderHook, server, waitFor } from '../../../../../test';
import * as types from '../../../../types';
import { useMarketCardDataPaged } from './market-card-data-paged';

describe('useMarketCardDataPaged', () => {
	const defaultProps = {
		collectionAddress: zeroAddress,
		chainId: 1,
		orderbookKind: OrderbookKind.sequence_marketplace_v2,
		collectionType: ContractType.ERC721,
		page: 1,
		pageSize: 10,
	};

	beforeEach(() => {
		// Set up default handlers for successful API responses
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					page: { page: 1, pageSize: 10, more: false },
					collectibles: [mockCollectibleOrder],
				});
			}),
			http.post(mockIndexerEndpoint('GetTokenBalancesDetails'), () => {
				return HttpResponse.json({
					page: { page: 1, pageSize: 10, more: false },
					balances: [
						{
							...mockTokenBalance,
							balance: '1',
							contractAddress: zeroAddress,
						},
					],
					nativeBalances: [],
				});
			}),
		);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should fetch collectibles and balances when wallet is connected', async () => {
		const { result } = renderHook(() => useMarketCardDataPaged(defaultProps));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.collectibleCards).toHaveLength(1);
		expect(result.current.error).toBeNull();
	});

	it('should handle disconnected wallet state', async () => {
		const { result: disconnect } = renderHook(() => useDisconnect());
		await disconnect.current.disconnectAsync();

		const { result } = renderHook(() => useMarketCardDataPaged(defaultProps));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.collectibleCards).toHaveLength(1);
		// Should still work without wallet, just won't show balance
		expect(result.current.error).toBeNull();
	});

	it('should handle API errors gracefully', async () => {
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return new HttpResponse(null, {
					status: 500,
					statusText: 'Internal Server Error',
				});
			}),
		);

		const { result } = renderHook(() => useMarketCardDataPaged(defaultProps));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.error).toBeTruthy();
		expect(result.current.collectibleCards).toHaveLength(0);
	});

	it('should handle search text filtering', async () => {
		const { result } = renderHook(() =>
			useMarketCardDataPaged({
				...defaultProps,
				searchText: 'test search',
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.collectibleCards).toHaveLength(1);
	});

	it('should handle property filtering', async () => {
		const { result } = renderHook(() =>
			useMarketCardDataPaged({
				...defaultProps,
				filterOptions: [
					{
						name: 'Background',
						type: PropertyType.STRING,
						values: ['Blue'],
					},
				],
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.collectibleCards).toHaveLength(1);
	});

	it('should handle listed-only filtering', async () => {
		const { result } = renderHook(() =>
			useMarketCardDataPaged({
				...defaultProps,
				showListedOnly: true,
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.collectibleCards).toHaveLength(1);
	});

	it('should handle collectible click callback', async () => {
		const onCollectibleClick = vi.fn();

		const { result } = renderHook(() =>
			useMarketCardDataPaged({
				...defaultProps,
				onCollectibleClick,
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Simulate clicking the collectible
		result.current.collectibleCards[0].onCollectibleClick?.(1n);
		expect(onCollectibleClick).toHaveBeenCalledWith(1n);
	});

	it('should handle cannot perform action callback', async () => {
		const onCannotPerformAction = vi.fn();

		const { result } = renderHook(() =>
			useMarketCardDataPaged({
				...defaultProps,
				onCannotPerformAction,
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Simulate action that cannot be performed
		result.current.collectibleCards[0].onCannotPerformAction?.(
			types.CollectibleCardAction.BUY,
		);
		expect(onCannotPerformAction).toHaveBeenCalledWith(
			types.CollectibleCardAction.BUY,
		);
	});

	it('should prioritize owner actions when specified', async () => {
		const { result } = renderHook(() =>
			useMarketCardDataPaged({
				...defaultProps,
				prioritizeOwnerActions: true,
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.collectibleCards[0].prioritizeOwnerActions).toBe(
			true,
		);
	});

	it('should use custom asset source prefix URL when provided', async () => {
		const assetSrcPrefixUrl = 'https://custom-cdn.example.com/';

		const { result } = renderHook(() =>
			useMarketCardDataPaged({
				...defaultProps,
				assetSrcPrefixUrl,
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.collectibleCards[0].assetSrcPrefixUrl).toBe(
			assetSrcPrefixUrl,
		);
	});

	it('should handle pagination correctly with hasMore', async () => {
		// Mock first page with more pages available
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					page: { page: 1, pageSize: 10, more: true },
					collectibles: [mockCollectibleOrder],
				});
			}),
		);

		const { result } = renderHook(() => useMarketCardDataPaged(defaultProps));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.hasMore).toBe(true);
		expect(result.current.collectibleCards).toHaveLength(1);
	});

	it('should fetch correct page when page prop is set', async () => {
		// Mock page 2
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					page: { page: 2, pageSize: 10, more: false },
					collectibles: [
						{
							...mockCollectibleOrder,
							metadata: {
								...mockCollectibleOrder.metadata,
								tokenId: 2n,
							},
						},
					],
				});
			}),
		);

		const { result } = renderHook(() =>
			useMarketCardDataPaged({
				...defaultProps,
				page: 2,
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.collectibleCards).toHaveLength(1);
		expect(result.current.collectibleCards[0].tokenId).toBe(2n);
		expect(result.current.hasMore).toBe(false);
	});

	it('should handle different page sizes correctly', async () => {
		const pageSize = 20;
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					page: { page: 1, pageSize, more: false },
					collectibles: Array.from({ length: pageSize }, (_, i) => ({
						...mockCollectibleOrder,
						metadata: {
							...mockCollectibleOrder.metadata,
							tokenId: String(i + 1),
						},
					})),
				});
			}),
		);

		const { result } = renderHook(() =>
			useMarketCardDataPaged({
				...defaultProps,
				page: 1,
				pageSize,
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.collectibleCards).toHaveLength(pageSize);
	});

	it('should handle combined filters (search text and properties)', async () => {
		const { result } = renderHook(() =>
			useMarketCardDataPaged({
				...defaultProps,
				searchText: 'test search',
				filterOptions: [
					{
						name: 'Background',
						type: PropertyType.STRING,
						values: ['Blue'],
					},
				],
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.collectibleCards).toHaveLength(1);
	});

	it('should respect enabled prop', async () => {
		const { result } = renderHook(() =>
			useMarketCardDataPaged({
				...defaultProps,
				enabled: false,
			}),
		);

		// When disabled, should not fetch data
		expect(result.current.isLoading).toBe(false);
		expect(result.current.collectibleCards).toHaveLength(0);
	});

	it('should handle empty page results', async () => {
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					page: { page: 1, pageSize: 10, more: false },
					collectibles: [],
				});
			}),
		);

		const { result } = renderHook(() => useMarketCardDataPaged(defaultProps));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.collectibleCards).toHaveLength(0);
		expect(result.current.hasMore).toBe(false);
	});
});
