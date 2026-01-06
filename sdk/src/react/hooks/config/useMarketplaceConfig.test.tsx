import * as BuilderMocks from '@0xsequence/api-client/mocks/builder';
import { renderHook, server, waitFor } from '@test';
import { describe, expect, it } from 'vitest';

const { createLookupMarketplaceErrorHandler } = BuilderMocks;

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
});
