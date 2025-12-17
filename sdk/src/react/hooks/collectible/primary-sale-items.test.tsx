import {
	type CollectiblePrimarySaleItem,
	type ListPrimarySaleItemsResponse,
	MarketplaceAPI,
	MarketplaceContractType,
	MarketplaceMocks,
	type PrimarySaleItem,
} from '@0xsequence/api-client';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import type { Address } from 'viem';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import { usePrimarySaleItems } from './primary-sale-items';

const { mockMarketplaceEndpoint } = MarketplaceMocks;

// Mock token metadata
const mockTokenMetadata: MarketplaceAPI.TokenMetadata = {
	tokenId: 1n,
	name: 'Mock NFT',
	description: 'A mock NFT for testing',
	image: 'https://example.com/nft.png',
	attributes: [{ trait_type: 'Type', value: 'Mock' }],
	status: MarketplaceAPI.MetadataStatus.AVAILABLE,
};

// Helper to create mock primary sale item data
const createMockPrimarySaleItem = (
	overrides?: Partial<PrimarySaleItem>,
): PrimarySaleItem => ({
	itemAddress: '0x1234567890123456789012345678901234567890' as Address,
	contractType: MarketplaceContractType.ERC721,
	tokenId: 1n,
	itemType: 'global' as any,
	startDate: new Date('2024-01-01T00:00:00Z').toISOString(),
	endDate: new Date('2024-12-31T23:59:59Z').toISOString(),
	currencyAddress: zeroAddress,
	priceDecimals: 18,
	priceAmount: 1000000000000000000n, // 1 ETH
	priceAmountFormatted: '1.0',
	priceUsd: 1800.0,
	priceUsdFormatted: '1800.0',
	supply: 50n,
	supplyCap: 100n,
	unlimitedSupply: false,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	...overrides,
});

const createMockCollectiblePrimarySaleItem = (
	overrides?: Partial<PrimarySaleItem>,
	metadataOverrides?: Partial<MarketplaceAPI.TokenMetadata>,
): CollectiblePrimarySaleItem => ({
	metadata: {
		...mockTokenMetadata,
		...metadataOverrides,
	},
	primarySaleItem: createMockPrimarySaleItem(overrides),
});

describe('usePrimarySaleItems', () => {
	const defaultParams = {
		chainId: 1,
		primarySaleContractAddress:
			'0x1234567890123456789012345678901234567890' as Address,
	};

	it('should fetch primary sale items successfully', async () => {
		const mockItems = [
			createMockCollectiblePrimarySaleItem({ tokenId: 1n }),
			createMockCollectiblePrimarySaleItem({ tokenId: 2n }),
		];

		const mockResponse: ListPrimarySaleItemsResponse = {
			primarySaleItems: mockItems,
			page: {
				page: 1,
				pageSize: 10,
				more: false,
			},
		};

		server.use(
			http.post(mockMarketplaceEndpoint('ListPrimarySaleItems'), () =>
				HttpResponse.json(mockResponse),
			),
		);

		const { result } = renderHook(() => usePrimarySaleItems(defaultParams));

		// Initially loading
		expect(result.current.isLoading).toBe(true);

		// Wait for data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.data?.pages[0].primarySaleItems).toHaveLength(2);
		expect(
			result.current.data?.pages[0].primarySaleItems[0].primarySaleItem.tokenId,
		).toBe(1n);
		expect(
			result.current.data?.pages[0].primarySaleItems[1].primarySaleItem.tokenId,
		).toBe(2n);
	});

	it('should handle pagination', async () => {
		const page1Items = [createMockCollectiblePrimarySaleItem({ tokenId: 1n })];
		const page2Items = [createMockCollectiblePrimarySaleItem({ tokenId: 2n })];

		server.use(
			http.post(
				mockMarketplaceEndpoint('ListPrimarySaleItems'),
				async ({ request }) => {
					const body = (await request.json()) as any;
					const page = body.page?.page || 1;

					if (page === 1) {
						return HttpResponse.json({
							primarySaleItems: page1Items,
							page: {
								page: 1,
								pageSize: 1,
								more: true,
							},
						});
					}

					return HttpResponse.json({
						primarySaleItems: page2Items,
						page: {
							page: 2,
							pageSize: 1,
							more: false,
						},
					});
				},
			),
		);

		const { result } = renderHook(() =>
			usePrimarySaleItems({
				...defaultParams,
				page: { page: 1, pageSize: 1 },
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data?.pages).toHaveLength(1);
		expect(result.current.data?.pages[0].primarySaleItems).toHaveLength(1);
		expect(result.current.hasNextPage).toBe(true);

		// Fetch next page
		await result.current.fetchNextPage();

		await waitFor(() => {
			expect(result.current.data?.pages).toHaveLength(2);
		});

		expect(result.current.data?.pages[1].primarySaleItems).toHaveLength(1);
		expect(
			result.current.data?.pages[1].primarySaleItems[0].primarySaleItem.tokenId,
		).toBe(2n);
		expect(result.current.hasNextPage).toBe(false);
	});

	it('should pass filter parameters to the API', async () => {
		const mockItems = [createMockCollectiblePrimarySaleItem()];
		let observedFilter: any;

		server.use(
			http.post(
				mockMarketplaceEndpoint('ListPrimarySaleItems'),
				async ({ request }) => {
					const body = (await request.json()) as any;
					observedFilter = body.filter;
					return HttpResponse.json({
						primarySaleItems: mockItems,
						page: { page: 1, pageSize: 10, more: false },
					});
				},
			),
		);

		const filter = {
			status: 'active',
		};

		const { result } = renderHook(() =>
			usePrimarySaleItems({
				...defaultParams,
				filter: filter as any, // Cast if needed depending on exact type match
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(observedFilter).toEqual(filter);
	});

	it('should handle error states', async () => {
		server.use(
			http.post(mockMarketplaceEndpoint('ListPrimarySaleItems'), () =>
				HttpResponse.json(
					{ error: { message: 'Failed to fetch items' } },
					{ status: 500 },
				),
			),
		);

		const { result } = renderHook(() => usePrimarySaleItems(defaultParams));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
	});

	it('should respect enabled option', async () => {
		const { result } = renderHook(() =>
			usePrimarySaleItems({
				...defaultParams,
				query: { enabled: false },
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should handle empty results', async () => {
		server.use(
			http.post(mockMarketplaceEndpoint('ListPrimarySaleItems'), () =>
				HttpResponse.json({
					primarySaleItems: [],
					page: { page: 1, pageSize: 10, more: false },
				}),
			),
		);

		const { result } = renderHook(() => usePrimarySaleItems(defaultParams));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data?.pages[0].primarySaleItems).toHaveLength(0);
	});
});
