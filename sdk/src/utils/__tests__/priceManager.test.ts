import { describe, expect, it } from 'vitest';
import { PriceManager } from '../priceManager';

describe('PriceManager with dnum', () => {
	describe('calculateItemTotal', () => {
		it('should handle normal price calculations', () => {
			const price = '1.5';
			const quantity = 10;
			const decimals = 18;

			const result = PriceManager.calculateItemTotal(price, quantity, decimals);

			// Should return a valid dnum tuple
			expect(result).toHaveLength(2);
			expect(typeof result[0]).toBe('bigint');
			expect(typeof result[1]).toBe('number');
			expect(result[1]).toBe(18);

			// 1.5 * 10 = 15 ETH = 15000000000000000000 wei
			expect(result[0]).toBe(BigInt('15000000000000000000'));
		});

		it('should handle large numbers without overflow', () => {
			const largePrice = '999999999999999999999';
			const quantity = 999999;
			const decimals = 18;

			// This should not throw an error during calculation
			const result = PriceManager.calculateItemTotal(
				largePrice,
				quantity,
				decimals,
			);
			expect(typeof result[0]).toBe('bigint');
			expect(result[1]).toBe(18);
		});

		it('should maintain precision for decimal calculations', () => {
			const price = '0.123456789';
			const quantity = 3;
			const decimals = 18;

			const result = PriceManager.calculateItemTotal(price, quantity, decimals);
			const formatted = PriceManager.formatForDisplay(result);

			// 0.123456789 * 3 = 0.370370367, formatted to 6 decimals by default
			expect(formatted).toBe('0.37037');
		});

		it('should handle edge case of quantity 1', () => {
			const price = '123.456';
			const quantity = 1;
			const decimals = 6;

			const result = PriceManager.calculateItemTotal(price, quantity, decimals);

			expect(result[0]).toBe(BigInt('123456000'));
			expect(result[1]).toBe(6);
		});
	});

	describe('formatForDisplay', () => {
		it('should handle different decimal precisions', () => {
			const ethAmount = PriceManager.fromString('1.234567890123456789', 18);
			const usdcAmount = PriceManager.fromString('1234.56', 6);

			expect(PriceManager.formatForDisplay(ethAmount)).toBe('1.234568');
			// USDC amount may include thousands separator depending on locale
			expect(PriceManager.formatForDisplay(usdcAmount)).toMatch(/1[,]?234\.56/);
		});

		it('should format with currency symbol', () => {
			const amount = PriceManager.fromString('100.5', 18);
			const formatted = PriceManager.formatForDisplay(amount, {
				symbol: 'ETH',
			});

			expect(formatted).toBe('ETH 100.5');
		});

		it('should handle compact formatting', () => {
			const amount = PriceManager.fromString('1234567.89', 18);
			const formatted = PriceManager.formatForDisplay(amount, {
				compact: true,
			});

			// Compact formatting should show something like 1.2M or 1.23M
			expect(formatted).toMatch(/1\.[0-9]+M/);
		});
	});

	describe('calculateFees', () => {
		it('should calculate percentage fees correctly', () => {
			const subtotal = PriceManager.fromString('100', 18);
			const feePercentage = 2.5; // 2.5%

			const fees = PriceManager.calculateFees(subtotal, feePercentage);
			const feeFormatted = PriceManager.formatForDisplay(fees);

			expect(feeFormatted).toBe('2.5');
		});
	});

	describe('price comparison', () => {
		it('should compare prices correctly', () => {
			const price1 = PriceManager.fromString('100', 18);
			const price2 = PriceManager.fromString('50', 18);

			expect(PriceManager.isGreaterThan(price1, price2)).toBe(true);
			expect(PriceManager.isGreaterThan(price2, price1)).toBe(false);
			expect(PriceManager.isEqual(price1, price1)).toBe(true);
		});
	});

	describe('error handling', () => {
		it('should throw meaningful errors for invalid prices', () => {
			expect(() => {
				PriceManager.fromString('invalid', 18);
			}).toThrow(/Failed to parse price/);
		});

		it('should throw errors for calculation failures', () => {
			expect(() => {
				PriceManager.calculateItemTotal('invalid', 10, 18);
			}).toThrow(/Price calculation failed/);
		});
	});

	describe('BigInt safety vs original implementation', () => {
		it('should safely handle the original overflow case', () => {
			// This represents the dangerous case from useERC721SalePaymentParams.ts:67
			// Original: BigInt(price) * BigInt(quantity)
			const price = '999999999999999999'; // Large price in wei
			const quantity = 1000000; // Large quantity

			// This should work safely with dnum
			const result = PriceManager.calculateItemTotal(price, quantity, 18);
			expect(typeof result[0]).toBe('bigint');
			expect(result[1]).toBe(18);

			// The original BigInt approach would potentially overflow
			// We can't test the original directly, but this demonstrates the safety
		});
	});
});
