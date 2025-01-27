import { describe, expect, test } from 'vitest';
import { calculatePriceDifferencePercentage } from '../price';

describe('price utils', () => {
	describe('calculatePriceDifferencePercentage', () => {
		test('should calculate positive price difference percentage', () => {
			const result = calculatePriceDifferencePercentage({
				inputPriceRaw: BigInt(110000000), // 1.1
				basePriceRaw: BigInt(100000000), // 1.0
				decimals: 8,
			});
			expect(result).toBe('10.00');
		});

		test('should calculate negative price difference percentage', () => {
			const result = calculatePriceDifferencePercentage({
				inputPriceRaw: BigInt(90000000), // 0.9
				basePriceRaw: BigInt(100000000), // 1.0
				decimals: 8,
			});
			expect(result).toBe('-10.00');
		});

		test('should handle zero price difference', () => {
			const result = calculatePriceDifferencePercentage({
				inputPriceRaw: BigInt(100000000), // 1.0
				basePriceRaw: BigInt(100000000), // 1.0
				decimals: 8,
			});
			expect(result).toBe('0.00');
		});

		test('should handle different decimal places', () => {
			const result = calculatePriceDifferencePercentage({
				inputPriceRaw: BigInt(1200), // 1.2
				basePriceRaw: BigInt(1000), // 1.0
				decimals: 3,
			});
			expect(result).toBe('20.00');
		});
	});
});
