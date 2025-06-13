import { server } from '@test';
import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';
import { ContractType } from '../../_internal';
import { laosHandlers } from '../../_internal/api/__mocks__/laos.msw';
import { mockMarketplaceEndpoint } from '../../_internal/api/__mocks__/marketplace.msw';
import { fetchInventory } from '../inventory';

describe('fetchInventory with LAOS', () => {
	const mockConfig = {
		projectAccessKey: 'test-key',
		projectId: '1',
		chainId: 11155111,
		apiUrl: 'https://marketplace-api.sequence.app',
		isDev: false,
	};

	const defaultArgs = {
		accountAddress:
			'0xuser1234567890123456789012345678901234567890' as `0x${string}`,
		collectionAddress:
			'0x1234567890123456789012345678901234567890' as `0x${string}`,
		chainId: 11155111,
		isLaos721: true,
	};

	afterEach(() => {
		server.resetHandlers();
	});

	it('should fetch LAOS inventory using LAOS API', async () => {
		server.use(
			...laosHandlers,
			// Mock marketplace config
			http.post('*/rpc/MarketplaceService/LookupMarketplace', () => {
				return HttpResponse.json({
					config: {
						market: {
							collections: [
								{
									collectionId: 'laos-test',
									contractAddress: '0x1234567890123456789012345678901234567890',
									itemsAddress: '0x1234567890123456789012345678901234567890',
									contractType: ContractType.LAOS_ERC_721,
									name: 'LAOS Test Collection',
								},
							],
						},
					},
				});
			}),
			// Mock empty marketplace collectibles
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					collectibles: [],
					page: { page: 1, pageSize: 10, more: false },
				});
			}),
		);

		const result = await fetchInventory(defaultArgs, mockConfig, {
			page: 1,
			pageSize: 10,
		});

		expect(result).toBeDefined();
		expect(result.collectibles).toBeDefined();
		// Should include balances from LAOS API
		expect(result.collectibles.length).toBeGreaterThan(0);

		// Verify LAOS-specific properties
		const firstCollectible = result.collectibles[0];
		expect(firstCollectible.balance).toBe('5'); // From mock LAOS response
		expect(firstCollectible.contractInfo?.type).toBe('LAOS-ERC-721');
	});

	it('should handle LAOS API errors gracefully', async () => {
		const errorArgs = {
			...defaultArgs,
			accountAddress:
				'0x0000000000000000000000000000000000000001' as `0x${string}`, // Special address for 500 error
		};

		server.use(
			...laosHandlers,
			http.post('*/rpc/MarketplaceService/LookupMarketplace', () => {
				return HttpResponse.json({
					config: {
						market: {
							collections: [
								{
									collectionId: 'laos-test',
									contractAddress: '0x1234567890123456789012345678901234567890',
									itemsAddress: '0x1234567890123456789012345678901234567890',
									contractType: ContractType.LAOS_ERC_721,
									name: 'LAOS Test Collection',
								},
							],
						},
					},
				});
			}),
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					collectibles: [],
					page: { page: 1, pageSize: 10, more: false },
				});
			}),
		);

		await expect(
			fetchInventory(errorArgs, mockConfig, { page: 1, pageSize: 10 }),
		).rejects.toThrow('Failed to get token balances: Internal Server Error');
	});

	it('should handle empty LAOS balances', async () => {
		const emptyArgs = {
			...defaultArgs,
			accountAddress:
				'0x0000000000000000000000000000000000000003' as `0x${string}`, // Special address for empty response
		};

		server.use(
			...laosHandlers,
			http.post('*/rpc/MarketplaceService/LookupMarketplace', () => {
				return HttpResponse.json({
					config: {
						market: {
							collections: [
								{
									collectionId: 'laos-test',
									contractAddress: '0x1234567890123456789012345678901234567890',
									itemsAddress: '0x1234567890123456789012345678901234567890',
									contractType: ContractType.LAOS_ERC_721,
									name: 'LAOS Test Collection',
								},
							],
						},
					},
				});
			}),
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					collectibles: [],
					page: { page: 1, pageSize: 10, more: false },
				});
			}),
		);

		const result = await fetchInventory(emptyArgs, mockConfig, {
			page: 1,
			pageSize: 10,
		});

		expect(result).toBeDefined();
		expect(result.collectibles).toEqual([]);
		expect(result.page.more).toBe(false);
	});

	it('should include LAOS metadata in inventory items', async () => {
		server.use(
			...laosHandlers,
			http.post('*/rpc/MarketplaceService/LookupMarketplace', () => {
				return HttpResponse.json({
					config: {
						market: {
							collections: [
								{
									collectionId: 'laos-test',
									contractAddress: '0x1234567890123456789012345678901234567890',
									itemsAddress: '0x1234567890123456789012345678901234567890',
									contractType: ContractType.LAOS_ERC_721,
									name: 'LAOS Test Collection',
								},
							],
						},
					},
				});
			}),
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					collectibles: [],
					page: { page: 1, pageSize: 10, more: false },
				});
			}),
		);

		const result = await fetchInventory(defaultArgs, mockConfig, {
			page: 1,
			pageSize: 10,
		});

		expect(result.collectibles.length).toBeGreaterThan(0);

		const firstCollectible = result.collectibles[0];
		expect(firstCollectible.metadata).toBeDefined();
		expect(firstCollectible.metadata.name).toBe('Test Token 1');
		expect(firstCollectible.metadata.description).toBe(
			'A test token for LAOS testing',
		);
		expect(firstCollectible.metadata.image).toBe(
			'https://example.com/token1.png',
		);
		expect(firstCollectible.metadata.attributes).toEqual([
			{
				trait_type: 'Rarity',
				value: 'Common',
			},
		]);
	});

	it('should handle non-LAOS collections correctly', async () => {
		const nonLaosArgs = {
			...defaultArgs,
			isLaos721: false,
		};

		server.use(
			// Mock marketplace config without LAOS collections
			http.post('*/rpc/MarketplaceService/LookupMarketplace', () => {
				return HttpResponse.json({
					config: {
						market: {
							collections: [
								{
									collectionId: 'regular-test',
									contractAddress: '0x1234567890123456789012345678901234567890',
									itemsAddress: '0x1234567890123456789012345678901234567890',
									contractType: ContractType.ERC721,
									name: 'Regular Test Collection',
								},
							],
						},
					},
				});
			}),
			// Mock marketplace collectibles
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					collectibles: [
						{
							metadata: {
								tokenId: '1',
								name: 'Regular NFT',
								description: 'A regular NFT',
								image: 'https://example.com/regular.png',
							},
							order: null,
						},
					],
					page: { page: 1, pageSize: 10, more: false },
				});
			}),
		);

		const result = await fetchInventory(nonLaosArgs, mockConfig, {
			page: 1,
			pageSize: 10,
		});

		expect(result).toBeDefined();
		expect(result.collectibles).toBeDefined();
		expect(result.collectibles.length).toBeGreaterThan(0);

		// Should use marketplace data, not LAOS API
		const firstCollectible = result.collectibles[0];
		expect(firstCollectible.metadata.name).toBe('Regular NFT');
	});
});
