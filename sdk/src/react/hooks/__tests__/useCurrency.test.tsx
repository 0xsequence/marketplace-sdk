import { renderHook, server, waitFor } from '@test';
import { USDC_ADDRESS } from '@test/const';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import {
	mockCurrencies,
	mockMarketplaceEndpoint,
} from '../../_internal/api/__mocks__/marketplace.msw';
import { useCurrency } from '../useCurrency';
describe('useCurrency', () => {
	const defaultArgs = {
		chainId: 1,
		currencyAddress: USDC_ADDRESS,
	};

	it('should fetch currency successfully when cache is empty', async () => {
		const { result } = renderHook(() => useCurrency(defaultArgs));

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
				(currency) =>
					currency.contractAddress.toLowerCase() ===
					defaultArgs.currencyAddress.toLowerCase(),
			),
		);
		expect(result.current.error).toBeNull();
	});

	it('should handle currency not found error', async () => {
		const argsWithInvalidAddress = {
			...defaultArgs,
			currencyAddress: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
		};

		const { result } = renderHook(() => useCurrency(argsWithInvalidAddress));

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

		const { result } = renderHook(() => useCurrency(defaultArgs));

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
		const { result, rerender } = renderHook(() => useCurrency(defaultArgs));

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change chainId and rerender
		const newArgs = {
			...defaultArgs,
			chainId: 5,
		};

		rerender(() => useCurrency(newArgs));

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

		const { result } = renderHook(() => useCurrency(argsWithQuery));

		// Should not fetch when disabled
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
	});
});
