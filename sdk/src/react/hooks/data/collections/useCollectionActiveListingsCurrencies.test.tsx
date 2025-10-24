import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import {
	mockCurrencies,
	mockMarketplaceEndpoint,
} from '../../../_internal/api/__mocks__/marketplace.msw';
import type { UseCollectionActiveListingsCurrenciesParams } from './useCollectionActiveListingsCurrencies';
import { useCollectionActiveListingsCurrencies } from './useCollectionActiveListingsCurrencies';

describe('useCollectionActiveListingsCurrencies', () => {
	const defaultArgs: UseCollectionActiveListingsCurrenciesParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
	};

	it('should fetch active listings currencies data successfully', async () => {
		const { result } = renderHook(() =>
			useCollectionActiveListingsCurrencies(defaultArgs),
		);

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual(mockCurrencies);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(
				mockMarketplaceEndpoint('GetCollectionActiveListingsCurrencies'),
				() => {
					return HttpResponse.json(
						{
							error: { message: 'Failed to fetch active listings currencies' },
						},
						{ status: 500 },
					);
				},
			),
		);

		const { result } = renderHook(() =>
			useCollectionActiveListingsCurrencies(defaultArgs),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() =>
			useCollectionActiveListingsCurrencies(defaultArgs),
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change args and rerender
		const newArgs = {
			...defaultArgs,
			collectionAddress:
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
		};

		rerender(() => useCollectionActiveListingsCurrencies(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle undefined query params', async () => {
		const argsWithoutQuery: UseCollectionActiveListingsCurrenciesParams = {
			chainId: 1,
			collectionAddress: zeroAddress,
			query: {},
		};

		const { result } = renderHook(() =>
			useCollectionActiveListingsCurrencies(argsWithoutQuery),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.error).toBeNull();
	});
});
