import { from } from 'dnum';
import { describe, expect, it } from 'vitest';
import { CurrencyStatus } from '../../react/_internal/api/marketplace.gen';
import type { Currency } from '../../types';
import {
	compareAmounts,
	convertEthToUsd,
	convertPrice,
	convertUsdToEth,
	formatForDisplay,
	formatMultiCurrency,
	getStandardDecimals,
	isNativeToken,
} from '../currencyConverter';

// Mock currency definitions
const ETH: Currency = {
	chainId: 1,
	contractAddress: '0x0000000000000000000000000000000000000000',
	status: CurrencyStatus.active,
	symbol: 'ETH',
	name: 'Ethereum',
	decimals: 18,
	imageUrl: '',
	exchangeRate: 1,
	defaultChainCurrency: true,
	nativeCurrency: true,
	createdAt: '2024-01-01T00:00:00Z',
	updatedAt: '2024-01-01T00:00:00Z',
};

const USDC: Currency = {
	chainId: 1,
	contractAddress: '0xa0b86a33e6cfc06e7ac63fdf7b2dd9b7a5abcf30',
	status: CurrencyStatus.active,
	symbol: 'USDC',
	name: 'USD Coin',
	decimals: 6,
	imageUrl: '',
	exchangeRate: 2500,
	defaultChainCurrency: false,
	nativeCurrency: false,
	createdAt: '2024-01-01T00:00:00Z',
	updatedAt: '2024-01-01T00:00:00Z',
};

const DAI: Currency = {
	chainId: 1,
	contractAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
	status: CurrencyStatus.active,
	symbol: 'DAI',
	name: 'Dai Stablecoin',
	decimals: 18,
	imageUrl: '',
	exchangeRate: 2500,
	defaultChainCurrency: false,
	nativeCurrency: false,
	createdAt: '2024-01-01T00:00:00Z',
	updatedAt: '2024-01-01T00:00:00Z',
};

const WBTC: Currency = {
	chainId: 1,
	contractAddress: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
	status: CurrencyStatus.active,
	symbol: 'WBTC',
	name: 'Wrapped Bitcoin',
	decimals: 8,
	imageUrl: '',
	exchangeRate: 15,
	defaultChainCurrency: false,
	nativeCurrency: false,
	createdAt: '2024-01-01T00:00:00Z',
	updatedAt: '2024-01-01T00:00:00Z',
};

describe('CurrencyConverter', () => {
	describe('convertPrice', () => {
		it('should convert ETH to USDC correctly', () => {
			const ethAmount = from('1', 18); // 1 ETH
			const ethToUsdRate = 2500; // 1 ETH = 2500 USD

			const result = convertPrice(ethAmount, ETH, USDC, ethToUsdRate);

			// Should be 2500 USDC with 6 decimals
			expect(result[0]).toBe(BigInt('2500000000'));
			expect(result[1]).toBe(6);
		});

		it('should convert USDC to ETH correctly', () => {
			const usdcAmount = from('2500', 6); // 2500 USDC
			const usdToEthRate = 0.0004; // 1 USD = 0.0004 ETH

			const result = convertPrice(usdcAmount, USDC, ETH, usdToEthRate);

			// Should be 1 ETH with 18 decimals
			expect(result[0]).toBe(BigInt('1000000000000000000'));
			expect(result[1]).toBe(18);
		});

		it('should handle same currency conversion', () => {
			const ethAmount = from('5.5', 18);

			const result = convertPrice(ethAmount, ETH, ETH, 1);

			// Should return the same amount
			expect(result[0]).toBe(ethAmount[0]);
			expect(result[1]).toBe(ethAmount[1]);
		});

		it('should handle different decimal precisions', () => {
			const wbtcAmount = from('0.1', 8); // 0.1 WBTC (8 decimals)
			const wbtcToEthRate = 15; // 1 WBTC = 15 ETH

			const result = convertPrice(wbtcAmount, WBTC, ETH, wbtcToEthRate);

			// Should be 1.5 ETH
			expect(result[0]).toBe(BigInt('1500000000000000000'));
			expect(result[1]).toBe(18);
		});

		it('should handle very large exchange rates', () => {
			const ethAmount = from('1', 18);
			const largeRate = 1000000; // Hypothetical very high rate

			const result = convertPrice(ethAmount, ETH, USDC, largeRate);

			expect(result[0]).toBeGreaterThan(0n);
			expect(result[1]).toBe(6);
		});

		it('should handle very small exchange rates', () => {
			const usdcAmount = from('1000000', 6); // 1M USDC
			const smallRate = 0.000001; // Very small rate

			const result = convertPrice(usdcAmount, USDC, ETH, smallRate);

			expect(result[0]).toBeGreaterThan(0n);
			expect(result[1]).toBe(18);
		});
	});

	describe('convertUsdToEth', () => {
		it('should convert USD to ETH correctly', () => {
			const usdAmount = from('5000', 2); // $5000 with 2 decimals
			const ethUsdRate = 2500; // 1 ETH = $2500

			const result = convertUsdToEth(usdAmount, ethUsdRate);

			// Should be 2 ETH
			expect(result[0]).toBe(BigInt('2000000000000000000'));
			expect(result[1]).toBe(18);
		});

		it('should handle fractional ETH results', () => {
			const usdAmount = from('1250', 2); // $1250
			const ethUsdRate = 2500; // 1 ETH = $2500

			const result = convertUsdToEth(usdAmount, ethUsdRate);

			// Should be 0.5 ETH
			expect(result[0]).toBe(BigInt('500000000000000000'));
			expect(result[1]).toBe(18);
		});
	});

	describe('convertEthToUsd', () => {
		it('should convert ETH to USD correctly', () => {
			const ethAmount = from('2.5', 18); // 2.5 ETH
			const ethUsdRate = 3000; // 1 ETH = $3000

			const result = convertEthToUsd(ethAmount, ethUsdRate);

			// Should be $7500
			expect(result[0]).toBe(BigInt('7500'));
			expect(result[1]).toBe(2);
		});

		it('should handle small ETH amounts', () => {
			const ethAmount = from('0.001', 18); // 0.001 ETH
			const ethUsdRate = 2000; // 1 ETH = $2000

			const result = convertEthToUsd(ethAmount, ethUsdRate);

			// Should be $2
			expect(result[0]).toBe(BigInt('2'));
			expect(result[1]).toBe(2);
		});
	});

	describe('formatMultiCurrency', () => {
		it('should format multiple currencies correctly', () => {
			const ethAmount = from('1', 18); // 1 ETH
			const targetCurrencies = [
				{ currency: USDC, exchangeRate: 2500 },
				{ currency: DAI, exchangeRate: 2500 },
			];

			const result = formatMultiCurrency(ethAmount, ETH, targetCurrencies);

			expect(result).toHaveLength(2);
			expect(result[0].symbol).toBe('USDC');
			expect(result[0].formatted).toContain('2500');
			expect(result[1].symbol).toBe('DAI');
			expect(result[1].formatted).toContain('2500');
		});

		it('should handle multiple currencies with different rates', () => {
			const ethAmount = from('2', 18); // 2 ETH
			const targetCurrencies = [
				{ currency: USDC, exchangeRate: 2500 }, // $5000
				{ currency: WBTC, exchangeRate: 0.067 }, // ~0.134 WBTC
			];

			const result = formatMultiCurrency(ethAmount, ETH, targetCurrencies);

			expect(result).toHaveLength(2);
			expect(result[0].symbol).toBe('USDC');
			expect(result[0].value[0]).toBe(BigInt('5000000000')); // 5000 USDC
			expect(result[1].symbol).toBe('WBTC');
			expect(result[1].value[1]).toBe(8); // WBTC decimals
		});
	});

	describe('formatForDisplay', () => {
		it('should format with currency symbol', () => {
			const amount = from('123.456789', 18);

			const result = formatForDisplay(amount, ETH);

			expect(result).toContain('ETH');
			expect(result).toContain('123.456789');
		});

		it('should format without currency symbol when disabled', () => {
			const amount = from('123.456789', 18);

			const result = formatForDisplay(amount, ETH, {
				showSymbol: false,
			});

			expect(result).not.toContain('ETH');
			expect(result).toContain('123.456789');
		});

		it('should respect maxDecimals option', () => {
			const amount = from('123.456789123456789', 18);

			const result = formatForDisplay(amount, ETH, {
				maxDecimals: 3,
				showSymbol: false,
			});

			expect(result).toBe('123.457'); // Rounded to 3 decimals
		});

		it('should handle compact formatting', () => {
			const largeAmount = from('1234567.89', 18);

			const result = formatForDisplay(largeAmount, ETH, {
				compact: true,
				showSymbol: false,
			});

			expect(result).toMatch(/1\.23[4-5]M/); // Should use compact notation
		});
	});

	describe('compareAmounts', () => {
		it('should compare same currency amounts correctly', () => {
			const amount1 = from('1.5', 18);
			const amount2 = from('2.0', 18);

			const result = compareAmounts(amount1, amount2, ETH, ETH);

			expect(result).toBe(-1); // amount1 < amount2
		});

		it('should compare equal amounts correctly', () => {
			const amount1 = from('1.5', 18);
			const amount2 = from('1.5', 18);

			const result = compareAmounts(amount1, amount2, ETH, ETH);

			expect(result).toBe(0); // amounts are equal
		});

		it('should compare different currency amounts with exchange rate', () => {
			const ethAmount = from('1', 18); // 1 ETH
			const usdcAmount = from('2500', 6); // 2500 USDC
			const ethToUsdcRate = 2500; // 1 ETH = 2500 USDC

			const result = compareAmounts(
				ethAmount,
				usdcAmount,
				ETH,
				USDC,
				ethToUsdcRate,
			);

			expect(result).toBe(0); // Should be equal when converted
		});

		it('should handle different decimal precisions', () => {
			const wbtcAmount = from('1', 8); // 1 WBTC (8 decimals)
			const ethAmount = from('15', 18); // 15 ETH (18 decimals)
			const wbtcToEthRate = 15; // 1 WBTC = 15 ETH

			const result = compareAmounts(
				wbtcAmount,
				ethAmount,
				WBTC,
				ETH,
				wbtcToEthRate,
			);

			expect(result).toBe(0); // Should be equal when converted
		});
	});

	describe('isNativeToken', () => {
		it('should identify zero address as native token', () => {
			const nativeToken: Currency = {
				...ETH,
				contractAddress: '0x0000000000000000000000000000000000000000',
			};

			const result = isNativeToken(nativeToken);

			expect(result).toBe(true);
		});

		it('should identify empty address as native token', () => {
			const nativeToken: Currency = {
				...ETH,
				contractAddress: '',
			};

			const result = isNativeToken(nativeToken);

			expect(result).toBe(true);
		});

		it('should identify special ETH address as native token', () => {
			const nativeToken: Currency = {
				...ETH,
				contractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
			};

			const result = isNativeToken(nativeToken);

			expect(result).toBe(true);
		});

		it('should identify ERC20 tokens as non-native', () => {
			const result = isNativeToken(USDC);

			expect(result).toBe(false);
		});
	});

	describe('getStandardDecimals', () => {
		it('should return correct decimals for known tokens', () => {
			expect(getStandardDecimals('ETH')).toBe(18);
			expect(getStandardDecimals('USDC')).toBe(6);
			expect(getStandardDecimals('USDT')).toBe(6);
			expect(getStandardDecimals('DAI')).toBe(18);
			expect(getStandardDecimals('MATIC')).toBe(18);
			expect(getStandardDecimals('BNB')).toBe(18);
		});

		it('should handle case insensitive symbols', () => {
			expect(getStandardDecimals('eth')).toBe(18);
			expect(getStandardDecimals('usdc')).toBe(6);
			expect(getStandardDecimals('Dai')).toBe(18);
		});

		it('should return default decimals for unknown tokens', () => {
			expect(getStandardDecimals('UNKNOWN')).toBe(18);
			expect(getStandardDecimals('')).toBe(18);
		});
	});

	describe('Edge Cases and Error Handling', () => {
		it('should handle zero amounts gracefully', () => {
			const zeroAmount = from('0', 18);

			const result = convertPrice(zeroAmount, ETH, USDC, 2500);

			expect(result[0]).toBe(0n);
			expect(result[1]).toBe(6);
		});

		it('should handle extreme exchange rates', () => {
			const amount = from('1', 18);
			const extremeRate = 1e15; // Very large rate

			const result = convertPrice(amount, ETH, USDC, extremeRate);

			expect(result[0]).toBeGreaterThan(0n);
			expect(result[1]).toBe(6);
		});

		it('should handle very small exchange rates', () => {
			const amount = from('1000000', 6); // 1M USDC
			const verySmallRate = 1e-15; // Very small rate

			const result = convertPrice(amount, USDC, ETH, verySmallRate);

			// Result might be 0 due to precision limits, but should not throw
			expect(result[1]).toBe(18);
		});

		it('should handle maximum decimal precision', () => {
			const highPrecisionToken: Currency = {
				chainId: 1,
				contractAddress: '0x1234567890123456789012345678901234567890',
				status: CurrencyStatus.active,
				symbol: 'PREC',
				name: 'High Precision Token',
				decimals: 77, // Maximum allowed decimals
				imageUrl: '',
				exchangeRate: 1,
				defaultChainCurrency: false,
				nativeCurrency: false,
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			};

			const amount = from('1', 77);

			const result = convertPrice(amount, highPrecisionToken, ETH, 1);

			expect(result[1]).toBe(18); // Should convert to ETH decimals
		});
	});

	describe('Performance and Memory', () => {
		it('should handle many conversions efficiently', () => {
			const startTime = performance.now();
			const amount = from('1', 18);

			// Perform many conversions
			for (let i = 0; i < 1000; i++) {
				convertPrice(amount, ETH, USDC, 2500 + i);
			}

			const endTime = performance.now();
			const duration = endTime - startTime;

			// Should complete in reasonable time (less than 100ms)
			expect(duration).toBeLessThan(100);
		});

		it('should handle large numbers without memory issues', () => {
			const largeAmount = from('999999999999999999999999999999', 18);

			const result = convertPrice(largeAmount, ETH, USDC, 2500);

			expect(result[0]).toBeGreaterThan(0n);
			expect(result[1]).toBe(6);
		});
	});
});
