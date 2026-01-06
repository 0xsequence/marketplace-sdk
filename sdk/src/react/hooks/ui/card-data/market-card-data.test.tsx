import {
	ContractType,
	OrderbookKind,
	PropertyType,
} from '@0xsequence/api-client';
import * as IndexerMocks from '@0xsequence/api-client/mocks/indexer';
import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';

const { mockIndexerEndpoint, mockTokenBalance } = IndexerMocks;
const { mockCollectibleOrder, mockMarketplaceEndpoint } = MarketplaceMocks;

import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDisconnect } from 'wagmi';
import { renderHook, server, waitFor } from '../../../../../test';
import * as types from '../../../../types';
import { useMarketCardData } from './market-card-data';

describe('useMarketCardData', () => {
	const defaultProps = {
		collectionAddress: zeroAddress,
		chainId: 1,
		orderbookKind: OrderbookKind.sequence_marketplace_v2,
		collectionType: ContractType.ERC721,
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
		const { result } = renderHook(() => useMarketCardData(defaultProps));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.collectibleCards).toHaveLength(1);
		expect(result.current.error).toBeNull();
	});

	it('should handle disconnected wallet state', async () => {
		const { result: disconnect } = renderHook(() => useDisconnect());
		await disconnect.current.disconnectAsync();

		const { result } = renderHook(() => useMarketCardData(defaultProps));

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

		const { result } = renderHook(() => useMarketCardData(defaultProps));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.error).toBeTruthy();
		expect(result.current.collectibleCards).toHaveLength(0);
	});

	it('should handle search text filtering', async () => {
		const { result } = renderHook(() =>
			useMarketCardData({
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
			useMarketCardData({
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
			useMarketCardData({
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
			useMarketCardData({
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
			useMarketCardData({
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
			useMarketCardData({
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
			useMarketCardData({
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

	it('should handle pagination correctly', async () => {
		// Mock first page
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					page: { page: 1, pageSize: 10, more: true },
					collectibles: [mockCollectibleOrder],
				});
			}),
		);

		const { result } = renderHook(() => useMarketCardData(defaultProps));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.hasNextPage).toBe(true);
		expect(result.current.isFetchingNextPage).toBe(false);

		// Mock second page
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					page: { page: 2, pageSize: 10, more: false },
					collectibles: [
						{
							...mockCollectibleOrder,
							metadata: { ...mockCollectibleOrder.metadata, tokenId: 2n },
						},
					],
				});
			}),
		);

		// Fetch next page
		await result.current.fetchNextPage();

		await waitFor(() => {
			expect(result.current.isFetchingNextPage).toBe(false);
		});

		expect(result.current.allCollectibles).toHaveLength(2);
		expect(result.current.hasNextPage).toBe(false);
	});

	it('should handle combined filters (search text and properties)', async () => {
		const { result } = renderHook(() =>
			useMarketCardData({
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
});
