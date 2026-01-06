import {
	type CollectiblePrimarySaleItem,
	MarketplaceAPI,
	type PrimarySaleItem,
} from '@0xsequence/api-client';
import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';

const { mockMarketplaceEndpoint } = MarketplaceMocks;

// Mock token metadata that matches the marketplace TokenMetadata type
const mockTokenMetadata: MarketplaceAPI.TokenMetadata = {
	tokenId: 1n,
	name: 'Mock NFT',
	description: 'A mock NFT for testing',
	image: 'https://example.com/nft.png',
	attributes: [{ trait_type: 'Type', value: 'Mock' }],
	status: MarketplaceAPI.MetadataStatus.AVAILABLE,
};

import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import type { Address } from 'viem';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import { ContractType } from '../../../../../api/src/adapters/marketplace/marketplace.gen';
import type { UsePrimarySaleItemParams } from './primary-sale-item';
import { usePrimarySaleItem } from './primary-sale-item';

// Helper to create mock primary sale item data with overrides
const createMockPrimarySaleItem = (
	overrides?: Partial<PrimarySaleItem>,
): PrimarySaleItem => ({
	itemAddress: '0x1234567890123456789012345678901234567890' as Address,
	contractType: MarketplaceAPI.ContractType.ERC721,
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

describe('usePrimarySaleItem', () => {
	const defaultParams: UsePrimarySaleItemParams = {
		chainId: 1,
		primarySaleContractAddress: '0x1234567890123456789012345678901234567890',
		tokenId: '1',
	};

	it('should fetch primary sale item data successfully', async () => {
		const mockItem = createMockCollectiblePrimarySaleItem();

		server.use(
			http.post(mockMarketplaceEndpoint('GetPrimarySaleItem'), () =>
				HttpResponse.json({ item: mockItem }),
			),
		);

		const { result } = renderHook(() => usePrimarySaleItem(defaultParams));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data structure
		expect(result.current.data?.item).toBeDefined();
		expect(result.current.data?.item.metadata).toBeDefined();
		expect(result.current.data?.item.primarySaleItem).toBeDefined();
		expect(result.current.error).toBeNull();
	});

	it('should handle bigint tokenId parameter', async () => {
		const mockItem = createMockCollectiblePrimarySaleItem({ tokenId: 42n });

		let observedRequest: any;

		server.use(
			http.post(
				mockMarketplaceEndpoint('GetPrimarySaleItem'),
				async ({ request }) => {
					const body = await request.json();
					observedRequest = body;
					return HttpResponse.json({ item: mockItem });
				},
			),
		);

		const { result } = renderHook(() =>
			usePrimarySaleItem({
				...defaultParams,
				tokenId: 42n,
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify tokenId was sent as a number (BigInt is converted during serialization)
		expect(observedRequest.tokenId).toBe('42');
		expect(result.current.data?.item.primarySaleItem.tokenId).toBe(42n);
	});

	it('should fetch primary sale item with correct contract address and chain', async () => {
		const specificAddress =
			'0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' as Address;
		const mockItem = createMockCollectiblePrimarySaleItem({
			itemAddress: specificAddress,
		});

		let observedChainId: number | undefined;
		let observedContractAddress: string | undefined;

		server.use(
			http.post(
				mockMarketplaceEndpoint('GetPrimarySaleItem'),
				async ({ request }) => {
					const body = (await request.json()) as any;
					observedChainId = Number(body.chainId);
					observedContractAddress = body.primarySaleContractAddress;
					return HttpResponse.json({ item: mockItem });
				},
			),
		);

		const { result } = renderHook(() =>
			usePrimarySaleItem({
				chainId: 137,
				primarySaleContractAddress: specificAddress,
				tokenId: '1',
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the correct parameters were sent to the API
		expect(observedChainId).toBe(137);
		expect(observedContractAddress).toBe(specificAddress);
		expect(result.current.data?.item.primarySaleItem.itemAddress).toBe(
			specificAddress,
		);
	});

	it('should handle error states', async () => {
		server.use(
			http.post(mockMarketplaceEndpoint('GetPrimarySaleItem'), () =>
				HttpResponse.json(
					{ error: { message: 'Failed to fetch primary sale item' } },
					{ status: 500 },
				),
			),
		);

		const { result } = renderHook(() => usePrimarySaleItem(defaultParams));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should handle network errors gracefully', async () => {
		server.use(
			http.post(
				mockMarketplaceEndpoint('GetPrimarySaleItem'),
				() => new HttpResponse(null, { status: 500 }),
			),
		);

		const { result } = renderHook(() => usePrimarySaleItem(defaultParams));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should handle different tokenId parameters', async () => {
		const mockItem1 = createMockCollectiblePrimarySaleItem({ tokenId: 1n });
		const mockItem2 = createMockCollectiblePrimarySaleItem({ tokenId: 2n });

		server.use(
			http.post(
				mockMarketplaceEndpoint('GetPrimarySaleItem'),
				async ({ request }) => {
					const body = (await request.json()) as any;

					if (body.tokenId === '1') {
						return HttpResponse.json({ item: mockItem1 });
					}
					return HttpResponse.json({ item: mockItem2 });
				},
			),
		);

		// Test with tokenId 1
		const { result: result1 } = renderHook(() =>
			usePrimarySaleItem({
				...defaultParams,
				tokenId: '1',
			}),
		);

		await waitFor(() => {
			expect(result1.current.isLoading).toBe(false);
		});

		expect(result1.current.data?.item.primarySaleItem.tokenId).toBe(1n);

		// Test with tokenId 2
		const { result: result2 } = renderHook(() =>
			usePrimarySaleItem({
				...defaultParams,
				tokenId: '2',
			}),
		);

		await waitFor(() => {
			expect(result2.current.isLoading).toBe(false);
		});

		expect(result2.current.data?.item.primarySaleItem.tokenId).toBe(2n);
	});

	it('should respect custom query options', async () => {
		const mockItem = createMockCollectiblePrimarySaleItem();

		server.use(
			http.post(mockMarketplaceEndpoint('GetPrimarySaleItem'), () =>
				HttpResponse.json({ item: mockItem }),
			),
		);

		const { result } = renderHook(() =>
			usePrimarySaleItem({
				...defaultParams,
				query: {
					staleTime: 60_000,
					enabled: true,
				},
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data?.item).toBeDefined();
	});

	it('should handle query disabled state', async () => {
		const { result } = renderHook(() =>
			usePrimarySaleItem({
				...defaultParams,
				query: {
					enabled: false,
				},
			}),
		);

		// Should not be loading or fetching since enabled is false
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should not fetch when required params are missing', async () => {
		const incompleteParams = {
			chainId: 1,
			// Missing primarySaleContractAddress and tokenId
		} as UsePrimarySaleItemParams;

		const { result } = renderHook(() => usePrimarySaleItem(incompleteParams));

		// Should not be loading since required params are missing
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should handle primary sale items with unlimited supply', async () => {
		const mockItem = createMockCollectiblePrimarySaleItem({
			unlimitedSupply: true,
			supplyCap: 0n,
		});

		server.use(
			http.post(mockMarketplaceEndpoint('GetPrimarySaleItem'), () =>
				HttpResponse.json({ item: mockItem }),
			),
		);

		const { result } = renderHook(() => usePrimarySaleItem(defaultParams));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data?.item.primarySaleItem.unlimitedSupply).toBe(
			true,
		);
		expect(result.current.data?.item.primarySaleItem.supplyCap).toBe(0n);
	});

	it('should handle items with different contract types', async () => {
		const mockItem = createMockCollectiblePrimarySaleItem({
			contractType: MarketplaceAPI.ContractType.ERC1155,
			tokenId: 5n,
		});

		server.use(
			http.post(mockMarketplaceEndpoint('GetPrimarySaleItem'), () =>
				HttpResponse.json({ item: mockItem }),
			),
		);

		const { result } = renderHook(() => usePrimarySaleItem(defaultParams));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data?.item.primarySaleItem.contractType).toBe(
			MarketplaceAPI.ContractType.ERC1155,
		);
	});

	it('should include metadata with primary sale item', async () => {
		const customMetadata: Partial<MarketplaceAPI.TokenMetadata> = {
			tokenId: 1n,
			name: 'Rare NFT',
			description: 'A very rare NFT from primary sale',
			image: 'https://example.com/rare-nft.png',
			attributes: [
				{ trait_type: 'Rarity', value: 'Legendary' },
				{ trait_type: 'Type', value: 'Primary' },
			],
			status: MarketplaceAPI.MetadataStatus.AVAILABLE,
		};

		const mockItem = createMockCollectiblePrimarySaleItem(
			undefined,
			customMetadata,
		);

		server.use(
			http.post(mockMarketplaceEndpoint('GetPrimarySaleItem'), () =>
				HttpResponse.json({ item: mockItem }),
			),
		);

		const { result } = renderHook(() => usePrimarySaleItem(defaultParams));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify metadata is included
		const metadata = result.current.data?.item.metadata;
		expect(metadata).toBeDefined();
		expect(metadata?.name).toBe('Rare NFT');
		expect(metadata?.description).toBe('A very rare NFT from primary sale');
		expect(metadata?.attributes).toHaveLength(2);
	});

	it('should handle price information correctly', async () => {
		const mockItem = createMockCollectiblePrimarySaleItem({
			priceAmount: 5000000000000000000n, // 5 ETH
			priceAmountFormatted: '5.0',
			priceDecimals: 18,
			priceUsd: 9000.0,
			priceUsdFormatted: '9000.0',
		});

		server.use(
			http.post(mockMarketplaceEndpoint('GetPrimarySaleItem'), () =>
				HttpResponse.json({ item: mockItem }),
			),
		);

		const { result } = renderHook(() => usePrimarySaleItem(defaultParams));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		const primarySaleItem = result.current.data?.item.primarySaleItem;
		expect(primarySaleItem?.priceAmount).toBe(5000000000000000000n);
		expect(primarySaleItem?.priceAmountFormatted).toBe('5.0');
		expect(primarySaleItem?.priceDecimals).toBe(18);
		expect(primarySaleItem?.priceUsd).toBe(9000.0);
	});

	it('should handle supply information correctly', async () => {
		const mockItem = createMockCollectiblePrimarySaleItem({
			supply: 75n,
			supplyCap: 100n,
			unlimitedSupply: false,
		});

		server.use(
			http.post(mockMarketplaceEndpoint('GetPrimarySaleItem'), () =>
				HttpResponse.json({ item: mockItem }),
			),
		);

		const { result } = renderHook(() => usePrimarySaleItem(defaultParams));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		const primarySaleItem = result.current.data?.item.primarySaleItem;
		expect(primarySaleItem?.supply).toBe(75n);
		expect(primarySaleItem?.supplyCap).toBe(100n);
		expect(primarySaleItem?.unlimitedSupply).toBe(false);
	});

	it('should handle date ranges for sale periods', async () => {
		const startDate = new Date('2024-06-01T00:00:00Z');
		const endDate = new Date('2024-12-31T23:59:59Z');

		const mockItem = createMockCollectiblePrimarySaleItem({
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString(),
		});

		server.use(
			http.post(mockMarketplaceEndpoint('GetPrimarySaleItem'), () =>
				HttpResponse.json({ item: mockItem }),
			),
		);

		const { result } = renderHook(() => usePrimarySaleItem(defaultParams));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		const primarySaleItem = result.current.data?.item.primarySaleItem;
		expect(primarySaleItem?.startDate).toBe(startDate.toISOString());
		expect(primarySaleItem?.endDate).toBe(endDate.toISOString());
	});

	it('should work with different currency addresses', async () => {
		const usdcAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as Address;

		const mockItem = createMockCollectiblePrimarySaleItem({
			currencyAddress: usdcAddress,
			priceAmount: 100000000n, // 100 USDC (6 decimals)
			priceDecimals: 6,
			priceAmountFormatted: '100.0',
		});

		server.use(
			http.post(mockMarketplaceEndpoint('GetPrimarySaleItem'), () =>
				HttpResponse.json({ item: mockItem }),
			),
		);

		const { result } = renderHook(() => usePrimarySaleItem(defaultParams));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		const primarySaleItem = result.current.data?.item.primarySaleItem;
		expect(primarySaleItem?.currencyAddress).toBe(usdcAddress);
		expect(primarySaleItem?.priceDecimals).toBe(6);
	});
});
