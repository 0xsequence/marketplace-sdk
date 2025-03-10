import { renderHook, server, waitFor } from '@test';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import {
	mockCurrencies,
	mockMarketplaceEndpoint,
} from '../../_internal/api/__mocks__/marketplace.msw';
import { mockConfig } from '../options/__mocks__/marketplaceConfig.msw';
import { useCurrencies } from '../useCurrencies';

describe('useCurrencies', () => {
	const defaultArgs = {
		chainId: '1',
	};

	it('should fetch currencies successfully', async () => {
		const { result } = renderHook(() => useCurrencies(defaultArgs));

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

		const { result } = renderHook(() => useCurrencies(argsWithoutNative));

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
			collectionAddress: mockConfig.collections[1].address,
		} satisfies Parameters<typeof useCurrencies>[0];

		const { result } = renderHook(() => useCurrencies(args));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		const currencyAddresses = result.current.data?.map(
			(c) => c.contractAddress,
		);
		expect(currencyAddresses).toEqual(
			mockConfig.collections[1].currencyOptions,
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

		const { result } = renderHook(() => useCurrencies(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when chainId changes', async () => {
		const { result, rerender } = renderHook(() => useCurrencies(defaultArgs));

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change chainId and rerender
		const newArgs = {
			...defaultArgs,
			chainId: '5',
		};

		rerender(() => useCurrencies(newArgs));

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

		const { result } = renderHook(() => useCurrencies(argsWithQuery));

		// Should not fetch when disabled
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should handle combined filters', async () => {
		const argsWithCombinedFilters = {
			...defaultArgs,
			includeNativeCurrency: false,
			currencyOptions: [
				'0x1234567890123456789012345678901234567890', // USDC address from mock
			],
		};

		const { result } = renderHook(() => useCurrencies(argsWithCombinedFilters));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		console.log('result.current.data', result.current.data);

		// Should only include non-native currencies from the currencyOptions list
		expect(result.current.data).toEqual(
			mockCurrencies.filter(
				(currency) =>
					!currency.nativeCurrency &&
					currency.contractAddress.toLowerCase() ===
						'0x1234567890123456789012345678901234567890'.toLowerCase(),
			),
		);
	});

	it('should handle collection filter', async () => {
		const args = {
			...defaultArgs,
			includeNativeCurrency: false,
			collectionAddress: '0x1234567890123456789012345678901234567890',
		} satisfies Parameters<typeof useCurrencies>[0];

		const { result } = renderHook(() => useCurrencies(args));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
	});
});
