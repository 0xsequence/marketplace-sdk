import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';

const { mockCurrencies, mockMarketplaceEndpoint } = MarketplaceMocks;

import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { renderHook, server, waitFor } from '../../../../test';
import { USDC_ADDRESS } from '../../../../test/const';
import { useCurrency as useCurrencyDetail } from './currency';

describe('useCurrency', () => {
	const defaultArgs = {
		chainId: 1,
		currencyAddress: USDC_ADDRESS,
	} as const;

	it('should fetch currency successfully when cache is empty', async () => {
		const { result } = renderHook(() => useCurrencyDetail(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual(
			mockCurrencies.find(
				(currency: { contractAddress: string }) =>
					currency.contractAddress.toLowerCase() ===
					defaultArgs.currencyAddress.toLowerCase(),
			),
		);
		expect(result.current.error).toBeNull();
	});

	it('should handle currency not found error', async () => {
		const argsWithInvalidAddress = {
			...defaultArgs,
			currencyAddress:
				'0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef' as `0x${string}`,
		};

		const { result } = renderHook(() =>
			useCurrencyDetail(argsWithInvalidAddress),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		if (result.current.error instanceof Error) {
			expect(result.current.error.message).toBe('Currency not found');
		}
		expect(result.current.data).toBeUndefined();
	});

	it('should handle API error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMarketplaceEndpoint('ListCurrencies'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch currencies' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useCurrencyDetail(defaultArgs));

		expect(result.current.data).toBeUndefined();
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		console.dir(result.current, { getters: true });

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
	});

	it('should refetch when chainId changes', async () => {
		const { result, rerender } = renderHook(() =>
			useCurrencyDetail(defaultArgs),
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

		rerender(() => useCurrencyDetail(newArgs));

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

		const { result } = renderHook(() => useCurrencyDetail(argsWithQuery));

		// Should not fetch when disabled
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
	});
});
