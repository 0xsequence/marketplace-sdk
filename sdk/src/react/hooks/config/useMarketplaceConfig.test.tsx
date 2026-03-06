import * as BuilderMocks from '@0xsequence/api-client/mocks/builder';
import { OrderbookKind } from '@0xsequence/api-client';
import { renderHook, server, waitFor } from '@test';
import { describe, expect, it } from 'vitest';

const { createLookupMarketplaceErrorHandler, createLookupMarketplaceHandler, mockConfig } = BuilderMocks;

import { useMarketplaceConfig } from './useMarketplaceConfig';

describe('useMarketplaceConfig', () => {
	it('should fetch marketplace config and styles successfully', async () => {
		const { result } = renderHook(() => useMarketplaceConfig());

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toBeDefined();
		expect(result.current.data).toMatchSnapshot();
		expect(result.current.error).toBeNull();
	});

	it('should handle config fetch error', async () => {
		// Override the handler for this test to return an error
		server.use(createLookupMarketplaceErrorHandler());

		const { result } = renderHook(() => useMarketplaceConfig());

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should normalize Magic Eden market collections to OpenSea', async () => {
		server.use(
			createLookupMarketplaceHandler({
				...mockConfig,
				marketCollections: mockConfig.marketCollections.map((collection, index) =>
					index === 1
						? {
							...collection,
							destinationMarketplace: OrderbookKind.magic_eden,
						}
						: collection,
				),
			}),
		);

		const { result } = renderHook(() => useMarketplaceConfig());

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data?.market.collections[1]?.destinationMarketplace).toBe(
			OrderbookKind.opensea,
		);
	});
});
