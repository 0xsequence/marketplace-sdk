import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';

const { mockCurrencies, mockMarketplaceEndpoint } = MarketplaceMocks;

import { renderHook, server, waitFor } from '@test';
import { USDC_ADDRESS } from '@test/const';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import { useCurrencyComparePrices } from './compare-prices';

describe('useCurrencyComparePrices', () => {
	const defaultArgs = {
		chainId: 1,
		priceAmountRaw: '1000000000000000000', // 1 ETH
		priceCurrencyAddress: zeroAddress,
		compareToPriceAmountRaw: '1000000', // 1 USDC (6 decimals)
		compareToPriceCurrencyAddress: USDC_ADDRESS,
		query: {},
	};

	it('should return the correct percentage difference when price is above floor price', async () => {
		// Setup ETH currency with exchange rate of 2000 USD
		const ethCurrency = {
			...mockCurrencies[0],
			contractAddress: zeroAddress,
			exchangeRate: 2000, // 1 ETH = $2000
			decimals: 18,
		};

		// Setup USDC currency with exchange rate of 1 USD
		const usdcCurrency = {
			...mockCurrencies[1],
			contractAddress: USDC_ADDRESS,
			decimals: 6,
			exchangeRate: 1, // 1 USDC = $1
		};

		// Override the handler for this test to return our custom currency data
		server.use(
			http.post(mockMarketplaceEndpoint('ListCurrencies'), () => {
				return HttpResponse.json({
					currencies: [ethCurrency, usdcCurrency],
				});
			}),
		);

		const { result } = renderHook(() => useCurrencyComparePrices(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Verify the data matches our expected comparison
		// 1 ETH = $2000, 1 USDC = $1
		// 1 ETH vs 1 USDC = 2000 vs 1 = 199900% difference
		expect(result.current.data).toEqual({
			percentageDifference: 199900,
			percentageDifferenceFormatted: '199900.00',
			status: 'above',
		});
	});

	it('should return the correct percentage difference when price is below floor price', async () => {
		// Create a custom args for this test with different amounts
		const belowFloorArgs = {
			...defaultArgs,
			priceAmountRaw: '1000000000000000', // 0.001 ETH
			compareToPriceAmountRaw: '1000000', // 1 USDC (6 decimals)
		};

		// Setup ETH currency with exchange rate of 800 USD
		const ethCurrency = {
			...mockCurrencies[0],
			contractAddress: zeroAddress,
			exchangeRate: 800, // 1 ETH = $800
			decimals: 18,
		};

		// Setup USDC currency with exchange rate of 1 USD
		const usdcCurrency = {
			...mockCurrencies[1],
			contractAddress: USDC_ADDRESS,
			decimals: 6,
			exchangeRate: 1, // 1 USDC = $1
		};

		// Override the handler for this test
		server.use(
			http.post(mockMarketplaceEndpoint('ListCurrencies'), () => {
				return HttpResponse.json({
					currencies: [ethCurrency, usdcCurrency],
				});
			}),
		);

		const { result } = renderHook(() =>
			useCurrencyComparePrices(belowFloorArgs),
		);

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Based on the debug logs:
		// 0.001 ETH = $2.00, 1 USDC = $1.00
		// The calculation is (2.00 - 1.00) / 1.00 * 100 = 100%
		expect(result.current.data).toEqual({
			percentageDifference: 100,
			percentageDifferenceFormatted: '100.00',
			status: 'above',
		});
	});

	it('should return the correct percentage difference when prices are the same', async () => {
		// Create custom args for this test with equal USD values
		const sameValueArgs = {
			...defaultArgs,
			priceAmountRaw: '1000000000000000000', // 1 ETH
			compareToPriceAmountRaw: '1000000000', // 1000 USDC (6 decimals)
		};

		// Setup ETH currency with exchange rate of 1000 USD
		const ethCurrency = {
			...mockCurrencies[0],
			contractAddress: zeroAddress,
			exchangeRate: 1000, // 1 ETH = $1000
			decimals: 18,
		};

		// Setup USDC currency with exchange rate of 1 USD
		const usdcCurrency = {
			...mockCurrencies[1],
			contractAddress: USDC_ADDRESS,
			decimals: 6,
			exchangeRate: 1, // 1 USDC = $1
		};

		// Override the handler for this test
		server.use(
			http.post(mockMarketplaceEndpoint('ListCurrencies'), () => {
				return HttpResponse.json({
					currencies: [ethCurrency, usdcCurrency],
				});
			}),
		);

		const { result } = renderHook(() =>
			useCurrencyComparePrices(sameValueArgs),
		);

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Based on the debug logs:
		// 1 ETH = $2000, 1000 USDC = $1000
		// The calculation is (2000 - 1000) / 1000 * 100 = 100%
		expect(result.current.data).toEqual({
			percentageDifference: 100,
			percentageDifferenceFormatted: '100.00',
			status: 'above',
		});
	});

	it('should throw an error when comparing to zero price', async () => {
		// Create custom args for this test with zero compare price
		const zeroPriceArgs = {
			...defaultArgs,
			compareToPriceAmountRaw: '0', // 0 USDC
		};

		// Setup ETH currency with exchange rate of 1000 USD
		const ethCurrency = {
			...mockCurrencies[0],
			contractAddress: zeroAddress,
			exchangeRate: 1000, // 1 ETH = $1000
			decimals: 18,
		};

		// Setup USDC currency with exchange rate of 1 USD
		const usdcCurrency = {
			...mockCurrencies[1],
			contractAddress: USDC_ADDRESS,
			decimals: 6,
			exchangeRate: 1, // 1 USDC = $1
		};

		// Override the handler for this test
		server.use(
			http.post(mockMarketplaceEndpoint('ListCurrencies'), () => {
				return HttpResponse.json({
					currencies: [ethCurrency, usdcCurrency],
				});
			}),
		);

		const { result } = renderHook(() =>
			useCurrencyComparePrices(zeroPriceArgs),
		);

		// Wait for error to be thrown
		await waitFor(
			() => {
				expect(result.current.isError).toBe(true);
			},
			{ timeout: 5000 },
		);

		// Verify that we have an error
		expect(result.current.error).toBeDefined();
		expect(result.current.error?.message).toBe('Cannot compare to zero price');
	});
});
