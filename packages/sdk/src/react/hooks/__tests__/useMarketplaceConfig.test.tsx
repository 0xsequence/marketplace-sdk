import { renderHook, waitFor } from '@test';
import { server } from '@test';
import { describe, expect, it } from 'vitest';
import {
	createConfigHandler,
	createErrorHandler,
	createStylesErrorHandler,
	mockConfig,
	mockStyles,
} from '../options/__mocks__/marketplaceConfig.msw';
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
		expect(result.current.data).toEqual({
			...mockConfig,
			cssString: mockStyles.replaceAll(/['"]/g, ''),
			manifestUrl: expect.stringContaining('/manifest.json'),
		});
		expect(result.current.error).toBeNull();
	});

	it('should handle config fetch error', async () => {
		// Override the handler for this test to return an error
		server.use(createErrorHandler());

		const { result } = renderHook(() => useMarketplaceConfig());

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should handle styles fetch error', async () => {
		// Override the handler for this test to return an error
		server.use(createStylesErrorHandler(), createConfigHandler());

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
		server.use(createErrorHandler(), createStylesErrorHandler());

		const { result } = renderHook(() => useMarketplaceConfig());

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should cache the config data', async () => {
		// First render to populate cache
		const { result, rerender } = renderHook(() => useMarketplaceConfig());

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Trigger a rerender
		rerender();

		// Should have data immediately from cache
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toEqual({
			...mockConfig,
			cssString: mockStyles.replaceAll(/['"]/g, ''),
			manifestUrl: expect.stringContaining('/manifest.json'),
		});
	});
});
