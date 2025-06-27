import { renderHook, server, waitFor } from '@test';
import { USDC_ADDRESS } from '@test/const';
import { HttpResponse, http } from 'msw';
import type { Address } from 'viem';
import { describe, expect, it } from 'vitest';
import { mockConfig } from '../../_internal/api/__mocks__/builder.msw';
import {
	mockCurrencies,
	mockMarketplaceEndpoint,
} from '../../_internal/api/__mocks__/marketplace.msw';
import { useMarketCurrencies } from '../useMarketCurrencies';

describe('useMarketCurrencies', () => {
	const defaultArgs = {
		chainId: 1,
	};

	it('should fetch currencies successfully', async () => {
		const { result } = renderHook(() => useMarketCurrencies(defaultArgs));

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

	it('should filter out native currency when includeNativeCurrency is false', async () => {
		const argsWithoutNative = {
			...defaultArgs,
			includeNativeCurrency: false,
		};

		const { result } = renderHook(() => useMarketCurrencies(argsWithoutNative));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toEqual(
			mockCurrencies.filter((currency) => !currency.nativeCurrency),
		);
	});

	it('should filter currencies by collection address', async () => {
		const args = {
			...defaultArgs,
			collectionAddress: mockConfig.marketCollections[1]
				.itemsAddress as Address,
		} satisfies Parameters<typeof useMarketCurrencies>[0];

		const { result } = renderHook(() => useMarketCurrencies(args));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		const currencyAddresses = result.current.data?.map(
			(c) => c.contractAddress,
		);
		expect(currencyAddresses).toEqual(
			mockConfig.marketCollections[1].currencyOptions,
		);
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMarketplaceEndpoint('ListCurrencies'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch currencies' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useMarketCurrencies(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when chainId changes', async () => {
		const { result, rerender } = renderHook(() =>
			useMarketCurrencies(defaultArgs),
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change chainId and rerender
		const newArgs = {
			...defaultArgs,
			chainId: 5,
		};

		rerender(() => useMarketCurrencies(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle query options', async () => {
		const argsWithQuery = {
			...defaultArgs,
			query: {
				enabled: false,
			},
		};

		const { result } = renderHook(() => useMarketCurrencies(argsWithQuery));

		// Should not fetch when disabled
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should handle combined filters', async () => {
		const argsWithCombinedFilters = {
			...defaultArgs,
			includeNativeCurrency: false,
			currencyOptions: [USDC_ADDRESS],
		};

		const { result } = renderHook(() =>
			useMarketCurrencies(argsWithCombinedFilters),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toMatchInlineSnapshot(`
			[
			  {
			    "chainId": 1,
			    "contractAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
			    "createdAt": "2025-03-16T13:04:16.098Z",
			    "decimals": 6,
			    "defaultChainCurrency": true,
			    "exchangeRate": 1,
			    "imageUrl": "https://example.com/usdc.png",
			    "name": "USD Coin",
			    "nativeCurrency": false,
			    "status": "active",
			    "symbol": "USDC",
			    "updatedAt": "2025-03-16T13:04:16.098Z",
			  },
			]
		`);
	});

	it('should handle collection filter', async () => {
		const args = {
			...defaultArgs,
			includeNativeCurrency: false,
			collectionAddress: '0x1234567890123456789012345678901234567890',
		} satisfies Parameters<typeof useMarketCurrencies>[0];

		const { result } = renderHook(() => useMarketCurrencies(args));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
	});
});
