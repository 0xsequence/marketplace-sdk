import { renderHook, server, waitFor } from '@test';
import { http, HttpResponse } from 'msw';
import type { Address } from 'viem';
import { describe, expect, it } from 'vitest';
import { OrderbookKind } from '../../../types';
import {
	createLookupMarketplaceConfigHandler,
	mockConfig,
} from '../../_internal/api/__mocks__/builder.msw';
import { mockEthCollection } from '../../_internal/api/__mocks__/metadata.msw';
import { useListCollections } from '../useListCollections';

describe('useListCollections', () => {
	it('should fetch collections successfully', async () => {
		const { result } = renderHook(() => useListCollections());

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify the data matches our mock
		expect(result.current.data).toMatchSnapshot();
		expect(result.current.error).toBeNull();
	});

	it('should handle empty collections', async () => {
		// Mock marketplace config with empty collections
		server.use(
			createLookupMarketplaceConfigHandler({
				...mockConfig,
				collections: [],
			}),
		);

		const { result } = renderHook(() => useListCollections());

		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		expect(result.current.data).toEqual([]);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Mock marketplace config with collection
		server.use(
			createLookupMarketplaceConfigHandler({
				...mockConfig,
				collections: [
					{
						chainId: 1,
						address:
							'0x1234567890123456789012345678901234567890' as `0x${string}`,
						feePercentage: 2.5,
						currencyOptions: [],
						exchanges: [],
						bannerUrl: '',
						destinationMarketplace: OrderbookKind.sequence_marketplace_v2,
						filterSettings: {
							filterOrder: [],
							exclusions: [],
						},
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

		const { result } = renderHook(() => useListCollections());

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});
	});

	it('should handle disabled queries', async () => {
		let requestMade = false;

		// Mock marketplace config with collection
		server.use(
			createLookupMarketplaceConfigHandler({
				...mockConfig,
				collections: [
					{
						chainId: 1,
						address: '0x1234567890123456789012345678901234567890' as Address,
						feePercentage: 2.5,
						currencyOptions: [],
						exchanges: [],
						bannerUrl: '',
						destinationMarketplace: OrderbookKind.sequence_marketplace_v2,
						filterSettings: {
							filterOrder: [],
							exclusions: [],
						},
					},
				],
			}),
			http.post('*/rpc/Metadata/GetContractInfoBatch', () => {
				requestMade = true;
				return HttpResponse.json({
					contractInfoMap: {
						'0x1234567890123456789012345678901234567890': mockEthCollection,
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
		const { result } = renderHook(() => useListCollections());

		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		const set = new Set(result.current.data?.map((c) => c.chainId));
		expect(set.size).toBeGreaterThan(1);
	});
});
