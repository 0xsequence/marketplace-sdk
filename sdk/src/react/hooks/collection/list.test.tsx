import { OrderbookKind } from '@0xsequence/api-client';
import * as BuilderMocks from '@0xsequence/api-client/mocks/builder';
import * as MetadataMocks from '@0xsequence/api-client/mocks/metadata';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import type { Address } from '@0xsequence/api-client';
import { describe, expect, it } from 'vitest';

const { createLookupMarketplaceHandler, mockConfig } = BuilderMocks;
const { mockEthCollection } = MetadataMocks;

import { useCollectionList } from './list';

describe('useCollectionList', () => {
	it('should fetch collections successfully', async () => {
		const { result } = renderHook(() => useCollectionList());

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
			createLookupMarketplaceHandler({
				...mockConfig,
				marketCollections: [],
			}),
		);

		const { result } = renderHook(() => useCollectionList());

		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		expect(result.current.data).toMatchSnapshot();
		expect(result.current.error).toBeNull();
	});

	it('should handle disabled queries', async () => {
		let requestMade = false;

		// Mock marketplace config with collection
		server.use(
			createLookupMarketplaceHandler({
				...mockConfig,
				marketCollections: [
					{
						id: 1,
						projectId: 1,
						contractType: 'ERC721',
						chainId: 1,
						itemsAddress:
							'0x1234567890123456789012345678901234567890' as Address,
						feePercentage: 2.5,
						currencyOptions: [],
						bannerUrl: '',
						destinationMarketplace: OrderbookKind.opensea,
						filterSettings: {
							filterOrder: ['Category', 'Level', 'Element'],
							exclusions: [],
						},
						createdAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
						updatedAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
						private: false,
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

		const disabledParams = {
			query: {
				enabled: false,
			},
		};

		const { result } = renderHook(() => useCollectionList(disabledParams));

		// For disabled queries, we expect no loading state and no data
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
		expect(requestMade).toBe(false);
	});

	it('should handle multiple collections from different chains', async () => {
		const { result } = renderHook(() => useCollectionList());

		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		const set = new Set(result.current.data?.map((c) => c.chainId));
		expect(set.size).toBeGreaterThan(1);
	});
});
