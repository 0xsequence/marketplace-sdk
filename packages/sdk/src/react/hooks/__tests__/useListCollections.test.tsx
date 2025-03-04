import { ResourceStatus } from '@0xsequence/metadata';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { MarketplaceType, OrderbookKind } from '../../../types';
import { mockContractInfo } from '../../_internal/api/__mocks__/metadata.msw';
import { renderHook, waitFor } from '../../_internal/test-utils';
import { server } from '../../_internal/test/setup';
import {
	createConfigHandler,
	mockConfig,
} from '../options/__mocks__/marketplaceConfig.msw';
import { useListCollections } from '../useListCollections';

describe('useListCollections', () => {
	const defaultArgs = {
		query: {
			enabled: true,
		},
	};

	it('should fetch collections successfully', async () => {
		// Mock marketplace config with collection
		server.use(
			createConfigHandler({
				...mockConfig,
				collections: [
					{
						chainId: 1,
						address:
							'0x1234567890123456789012345678901234567890' as `0x${string}`,
						feePercentage: 2.5,
						marketplaceType: MarketplaceType.ORDERBOOK,
						currencyOptions: [],
						exchanges: [],
						bannerUrl: '',
						destinationMarketplace: OrderbookKind.sequence_marketplace_v2,
					},
				],
			}),
			http.post('*/rpc/Metadata/GetContractInfoBatch', () => {
				return HttpResponse.json({
					contractInfoMap: {
						'0x1234567890123456789012345678901234567890': mockContractInfo,
					},
				});
			}),
		);

		const { result } = renderHook(() => useListCollections(defaultArgs));

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual([mockContractInfo]);
		expect(result.current.error).toBeNull();
	});

	it('should handle empty collections', async () => {
		// Mock marketplace config with empty collections
		server.use(
			createConfigHandler({
				...mockConfig,
				collections: [],
			}),
		);

		const { result } = renderHook(() => useListCollections(defaultArgs));

		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		expect(result.current.data).toEqual([]);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Mock marketplace config with collection
		server.use(
			createConfigHandler({
				...mockConfig,
				collections: [
					{
						chainId: 1,
						address:
							'0x1234567890123456789012345678901234567890' as `0x${string}`,
						feePercentage: 2.5,
						marketplaceType: MarketplaceType.ORDERBOOK,
						currencyOptions: [],
						exchanges: [],
						bannerUrl: '',
						destinationMarketplace: OrderbookKind.sequence_marketplace_v2,
					},
				],
			}),
			http.post('*/rpc/Metadata/GetContractInfoBatch', () => {
				return new HttpResponse(
					JSON.stringify({ error: { message: 'Failed to fetch collections' } }),
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useListCollections(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should handle disabled queries', async () => {
		let requestMade = false;

		// Mock marketplace config with collection
		server.use(
			createConfigHandler({
				...mockConfig,
				collections: [
					{
						chainId: 1,
						address:
							'0x1234567890123456789012345678901234567890' as `0x${string}`,
						feePercentage: 2.5,
						marketplaceType: MarketplaceType.ORDERBOOK,
						currencyOptions: [],
						exchanges: [],
						bannerUrl: '',
						destinationMarketplace: OrderbookKind.sequence_marketplace_v2,
					},
				],
			}),
			http.post('*/rpc/Metadata/GetContractInfoBatch', () => {
				requestMade = true;
				return HttpResponse.json({
					contractInfoMap: {
						'0x1234567890123456789012345678901234567890': mockContractInfo,
					},
				});
			}),
		);

		const disabledArgs = {
			query: {
				enabled: false,
			},
		};

		const { result } = renderHook(() => useListCollections(disabledArgs));

		// For disabled queries, we expect no loading state and no data
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
		expect(requestMade).toBe(false);
	});

	it('should handle multiple collections from different chains', async () => {
		const mockContractInfo2 = {
			...mockContractInfo,
			address: '0x1234567890123456789012345678901234567890' as `0x${string}`,
			chainId: 137, // Different chain (Polygon)
		};

		// Mock marketplace config with multiple collections
		server.use(
			createConfigHandler({
				...mockConfig,
				collections: [
					{
						chainId: 1,
						address:
							'0x1234567890123456789012345678901234567890' as `0x${string}`,
						feePercentage: 2.5,
						marketplaceType: MarketplaceType.ORDERBOOK,
						currencyOptions: [],
						exchanges: [],
						bannerUrl: '',
						destinationMarketplace: OrderbookKind.sequence_marketplace_v2,
					},
					{
						chainId: 137,
						address: mockContractInfo2.address,
						feePercentage: 2.5,
						marketplaceType: MarketplaceType.ORDERBOOK,
						currencyOptions: [],
						exchanges: [],
						bannerUrl: '',
						destinationMarketplace: OrderbookKind.sequence_marketplace_v2,
					},
				],
			}),
			http.post('*/rpc/Metadata/GetContractInfoBatch', async ({ request }) => {
				const body = (await request.json()) as { chainID: string };
				if (body.chainID === '1') {
					return HttpResponse.json({
						contractInfoMap: {
							'0x1234567890123456789012345678901234567890': mockContractInfo,
						},
					});
				}
				return HttpResponse.json({
					contractInfoMap: {
						[mockContractInfo2.address]: mockContractInfo2,
					},
				});
			}),
		);

		const { result } = renderHook(() => useListCollections(defaultArgs));

		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		expect(result.current.data).toHaveLength(2);
		expect(result.current.data).toEqual(
			expect.arrayContaining([mockContractInfo, mockContractInfo2]),
		);
	});

	it('should handle collections with different resource statuses', async () => {
		const mockUnavailableContract = {
			...mockContractInfo,
			address: '0x9876543210987654321098765432109876543210' as `0x${string}`,
			status: ResourceStatus.NOT_AVAILABLE,
		};

		// Mock marketplace config with multiple collections
		server.use(
			createConfigHandler({
				...mockConfig,
				collections: [
					{
						chainId: 1,
						address:
							'0x1234567890123456789012345678901234567890' as `0x${string}`,
						feePercentage: 2.5,
						marketplaceType: MarketplaceType.ORDERBOOK,
						currencyOptions: [],
						exchanges: [],
						bannerUrl: '',
						destinationMarketplace: OrderbookKind.sequence_marketplace_v2,
					},
					{
						chainId: 1,
						address: mockUnavailableContract.address,
						feePercentage: 2.5,
						marketplaceType: MarketplaceType.ORDERBOOK,
						currencyOptions: [],
						exchanges: [],
						bannerUrl: '',
						destinationMarketplace: OrderbookKind.sequence_marketplace_v2,
					},
				],
			}),
		);

		// Mock metadata response for both contracts
		server.use(
			http.post('*/rpc/Metadata/GetContractInfoBatch', () => {
				return HttpResponse.json({
					contractInfoMap: {
						'0x1234567890123456789012345678901234567890': mockContractInfo,
						'0x9876543210987654321098765432109876543210':
							mockUnavailableContract,
					},
				});
			}),
		);

		const { result } = renderHook(() => useListCollections(defaultArgs));

		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		expect(result.current.data).toHaveLength(2);
		expect(result.current.data).toEqual(
			expect.arrayContaining([mockContractInfo, mockUnavailableContract]),
		);
	});
});
