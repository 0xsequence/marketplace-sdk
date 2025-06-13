import { renderHook, server, waitFor } from '@test';
import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';
import { ContractType } from '../../_internal';
import {
	mockIndexerEndpoint,
	mockTokenBalance,
} from '../../_internal/api/__mocks__/indexer.msw';
import {
	laosHandlers,
	mockTokenBalancesResponse,
} from '../../_internal/api/__mocks__/laos.msw';
import { marketplaceConfigHandlers } from '../../_internal/api/__mocks__/marketplace.msw';
import { useBalanceOfCollectible } from '../useBalanceOfCollectible';

describe('useBalanceOfCollectible with LAOS', () => {
	const defaultArgs = {
		collectionAddress:
			'0x1234567890123456789012345678901234567890' as `0x${string}`,
		collectableId: '1',
		userAddress:
			'0xuser1234567890123456789012345678901234567890' as `0x${string}`,
		chainId: 11155111,
	};

	// Mock marketplace config with LAOS collection
	const laosMarketplaceConfig = {
		baseUrl: 'https://marketplace-api.sequence.app',
		projectId: 1,
		chainId: 11155111,
		marketplace: {
			id: 'test-marketplace',
			name: 'Test Marketplace',
		},
		market: {
			id: 'test-market',
			name: 'Test Market',
			collections: [
				{
					collectionId: 'laos-collection',
					contractAddress: '0x1234567890123456789012345678901234567890',
					itemsAddress: '0x1234567890123456789012345678901234567890',
					contractType: ContractType.LAOS_ERC_721,
					name: 'LAOS Test Collection',
					description: 'A test LAOS collection',
					imageUrl: 'https://example.com/logo.png',
					bannerImageUrl: 'https://example.com/banner.png',
				},
				{
					collectionId: 'regular-collection',
					contractAddress: '0x9876543210987654321098765432109876543210',
					itemsAddress: '0x9876543210987654321098765432109876543210',
					contractType: ContractType.ERC721,
					name: 'Regular Test Collection',
					description: 'A test regular collection',
					imageUrl: 'https://example.com/logo2.png',
					bannerImageUrl: 'https://example.com/banner2.png',
				},
			],
			currencies: [],
		},
	};

	// Setup handlers for LAOS and marketplace config
	afterEach(() => {
		server.resetHandlers();
	});

	it('should use LAOS API when collection is LAOS_ERC_721', async () => {
		// Add LAOS handlers and marketplace config handler
		server.use(...laosHandlers, ...marketplaceConfigHandlers);

		const { result } = renderHook(() => useBalanceOfCollectible(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);

		// Wait for the query to complete
		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Should return LAOS API response (first balance)
		expect(result.current.data).toEqual(mockTokenBalancesResponse.balances[0]);
		expect(result.current.data?.balance).toBe('5');
		expect(result.current.data?.contractInfo?.type).toBe('LAOS-ERC-721');
	});

	it('should use indexer API when collection is regular ERC_721', async () => {
		const regularCollectionArgs = {
			...defaultArgs,
			collectionAddress:
				'0x9876543210987654321098765432109876543210' as `0x${string}`,
		};

		server.use(
			http.post('*/rpc/MarketplaceService/LookupMarketplace', () => {
				return HttpResponse.json({
					config: laosMarketplaceConfig,
				});
			}),
			http.post(mockIndexerEndpoint('GetTokenBalances'), () => {
				return HttpResponse.json({
					page: { page: 1, pageSize: 10, more: false },
					balances: [mockTokenBalance],
				});
			}),
		);

		const { result } = renderHook(() =>
			useBalanceOfCollectible(regularCollectionArgs),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Should return indexer API response
		expect(result.current.data).toEqual(mockTokenBalance);
		expect(result.current.data?.contractInfo?.type).toBe('ERC721');
	});

	it('should handle LAOS API errors gracefully', async () => {
		const errorArgs = {
			...defaultArgs,
			userAddress:
				'0x0000000000000000000000000000000000000001' as `0x${string}`, // Special address for 500 error
		};

		server.use(
			...laosHandlers,
			http.post('*/rpc/MarketplaceService/LookupMarketplace', () => {
				return HttpResponse.json({
					config: laosMarketplaceConfig,
				});
			}),
		);

		const { result } = renderHook(() => useBalanceOfCollectible(errorArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
	});

	it('should return null when LAOS API returns empty balances', async () => {
		const emptyBalanceArgs = {
			...defaultArgs,
			userAddress:
				'0x0000000000000000000000000000000000000003' as `0x${string}`, // Special address for empty response
		};

		server.use(
			...laosHandlers,
			http.post('*/rpc/MarketplaceService/LookupMarketplace', () => {
				return HttpResponse.json({
					config: laosMarketplaceConfig,
				});
			}),
		);

		const { result } = renderHook(() =>
			useBalanceOfCollectible(emptyBalanceArgs),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toBeNull();
	});

	it('should auto-detect LAOS from marketplace config', async () => {
		server.use(
			...laosHandlers,
			http.post('*/rpc/MarketplaceService/LookupMarketplace', () => {
				return HttpResponse.json({
					config: laosMarketplaceConfig,
				});
			}),
		);

		const { result } = renderHook(() => useBalanceOfCollectible(defaultArgs));

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Verify it used LAOS API (returns LAOS-specific data structure)
		expect(result.current.data?.contractInfo?.type).toBe('LAOS-ERC-721');
		expect(result.current.data?.tokenMetadata).toBeDefined();
	});

	it('should fallback to indexer when marketplace config is unavailable', async () => {
		// No marketplace config handler - should fallback to indexer
		server.use(
			http.post(mockIndexerEndpoint('GetTokenBalances'), () => {
				return HttpResponse.json({
					page: { page: 1, pageSize: 10, more: false },
					balances: [mockTokenBalance],
				});
			}),
		);

		const { result } = renderHook(() => useBalanceOfCollectible(defaultArgs));

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Should use indexer since no marketplace config to determine LAOS
		expect(result.current.data).toEqual(mockTokenBalance);
		expect(result.current.data?.contractInfo?.type).toBe('ERC721');
	});

	it('should handle collection not found in marketplace config', async () => {
		const unknownCollectionArgs = {
			...defaultArgs,
			collectionAddress:
				'0x0000000000000000000000000000000000000999' as `0x${string}`, // Unknown collection
		};

		server.use(
			http.post('*/rpc/MarketplaceService/LookupMarketplace', () => {
				return HttpResponse.json({
					config: laosMarketplaceConfig,
				});
			}),
			http.post(mockIndexerEndpoint('GetTokenBalances'), () => {
				return HttpResponse.json({
					page: { page: 1, pageSize: 10, more: false },
					balances: [mockTokenBalance],
				});
			}),
		);

		const { result } = renderHook(() =>
			useBalanceOfCollectible(unknownCollectionArgs),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Should fallback to indexer when collection not found in config
		expect(result.current.data).toEqual(mockTokenBalance);
		expect(result.current.data?.contractInfo?.type).toBe('ERC721');
	});

	it('should respect enabled query option for LAOS collections', () => {
		server.use(
			...laosHandlers,
			http.post('*/rpc/MarketplaceService/LookupMarketplace', () => {
				return HttpResponse.json({
					config: laosMarketplaceConfig,
				});
			}),
		);

		const { result } = renderHook(() =>
			useBalanceOfCollectible({
				...defaultArgs,
				query: {
					enabled: false,
				},
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should handle LAOS metadata correctly', async () => {
		server.use(
			...laosHandlers,
			http.post('*/rpc/MarketplaceService/LookupMarketplace', () => {
				return HttpResponse.json({
					config: laosMarketplaceConfig,
				});
			}),
		);

		const { result } = renderHook(() => useBalanceOfCollectible(defaultArgs));

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		const balance = result.current.data;
		expect(balance?.tokenMetadata).toBeDefined();
		expect(balance?.tokenMetadata?.name).toBe('Test Token 1');
		expect(balance?.tokenMetadata?.description).toBe(
			'A test token for LAOS testing',
		);
		expect(balance?.tokenMetadata?.image).toBe(
			'https://example.com/token1.png',
		);
		expect(balance?.tokenMetadata?.attributes).toEqual([
			{
				trait_type: 'Rarity',
				value: 'Common',
			},
		]);
	});

	it('should pass correct parameters to LAOS API', async () => {
		let capturedRequestBody: Record<string, unknown> = {};

		server.use(
			http.post('*/rpc/MarketplaceService/LookupMarketplace', () => {
				return HttpResponse.json({
					config: laosMarketplaceConfig,
				});
			}),
			http.post(
				'https://extensions.api.laosnetwork.io/token/GetTokenBalances',
				async ({ request }) => {
					const body = await request.json();
					capturedRequestBody = body as Record<string, unknown>;
					return HttpResponse.json(mockTokenBalancesResponse);
				},
			),
		);

		const { result } = renderHook(() => useBalanceOfCollectible(defaultArgs));

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Verify LAOS API was called with correct parameters
		expect(capturedRequestBody).toEqual({
			chainId: '11155111',
			accountAddress: defaultArgs.userAddress,
			includeMetadata: true,
			page: {
				sort: [
					{
						column: 'CREATED_AT',
						order: 'DESC',
					},
				],
			},
		});
	});
});
