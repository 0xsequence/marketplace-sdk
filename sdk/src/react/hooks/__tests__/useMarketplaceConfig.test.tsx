import { renderHook, server, waitFor } from '@test';
import { describe, expect, it } from 'vitest';
import { createLookupMarketplaceConfigErrorHandler } from '../../_internal/api/__mocks__/builder.msw';

import { createStylesErrorHandler } from '../../_internal/api/__mocks__/builder.msw';
import { useMarketplaceConfig } from '../useMarketplaceConfig';

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
		server.use(createLookupMarketplaceConfigErrorHandler());

		const { result } = renderHook(() => useMarketplaceConfig());

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should handle styles fetch error', async () => {
		// Override the handler for this test to return an error
		server.use(createStylesErrorHandler());

		const { result } = renderHook(() => useMarketplaceConfig());

		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// They just result in an empty cssString
		expect(result.current.isError).toBe(false);
		expect(result.current.data?.cssString).toBe('');
	});

	it('should handle both config and styles fetch errors', async () => {
		// Override both handlers to return errors
		server.use(
			createLookupMarketplaceConfigErrorHandler(),
			createStylesErrorHandler(),
		);

		const { result } = renderHook(() => useMarketplaceConfig());

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});
});
