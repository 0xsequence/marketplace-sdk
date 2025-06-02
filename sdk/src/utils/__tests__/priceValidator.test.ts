import { from } from 'dnum';
import { describe, expect, it } from 'vitest';
import { CurrencyStatus } from '../../react/_internal/api/marketplace.gen';
import type { Currency } from '../../types';
import {
	validateBatch,
	validateExpirationDate,
	validatePriceInput,
	validatePriceRange,
	validateQuantity,
	validateSufficientBalance,
} from '../priceValidator';

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

describe('PriceValidator', () => {
	describe('validatePriceInput', () => {
		it('should validate valid price inputs', () => {
			const result = validatePriceInput('1.5', {
				currency: ETH,
				maxDecimals: 18,
			});

			expect(result.isValid).toBe(true);
			expect(result.error).toBeUndefined();
			expect(result.parsed).toBeDefined();
			expect(result.normalizedValue).toBe('1.5');
		});

		it('should validate integer price inputs', () => {
			const result = validatePriceInput('100', {
				currency: USDC,
				maxDecimals: 6,
			});

			expect(result.isValid).toBe(true);
			expect(result.parsed?.[0]).toBe(BigInt('100000000')); // 100 USDC with 6 decimals
		});

		it('should reject empty inputs', () => {
			const result = validatePriceInput('', { currency: ETH });

			expect(result.isValid).toBe(false);
			expect(result.error).toContain('empty');
		});

		it('should reject null/undefined inputs', () => {
			const result1 = validatePriceInput(null as unknown as string, {
				currency: ETH,
			});
			const result2 = validatePriceInput(undefined as unknown as string, {
				currency: ETH,
			});

			expect(result1.isValid).toBe(false);
			expect(result2.isValid).toBe(false);
		});

		it('should reject inputs with invalid characters', () => {
			const result = validatePriceInput('1.5abc', {
				currency: ETH,
			});

			expect(result.isValid).toBe(false);
			expect(result.error).toContain('numbers, dots, and commas');
		});

		it('should reject multiple decimal points', () => {
			const result = validatePriceInput('1.5.2', {
				currency: ETH,
			});

			expect(result.isValid).toBe(false);
			expect(result.error).toContain('multiple decimal points');
		});

		it('should enforce maximum decimal places', () => {
			const result = validatePriceInput('1.1234567890', {
				currency: USDC,
				maxDecimals: 6,
			});

			expect(result.isValid).toBe(false);
			expect(result.error).toContain('more than 6 decimal places');
		});

		it('should handle comma as decimal separator', () => {
			const result = validatePriceInput('1,5', {
				currency: ETH,
			});

			expect(result.isValid).toBe(true);
			expect(result.normalizedValue).toBe('1.5');
		});

		it('should reject zero when not allowed', () => {
			const result = validatePriceInput('0', {
				currency: ETH,
				allowZero: false,
			});

			expect(result.isValid).toBe(false);
			expect(result.error).toContain('greater than zero');
		});

		it('should accept zero when allowed', () => {
			const result = validatePriceInput('0', {
				currency: ETH,
				allowZero: true,
			});

			expect(result.isValid).toBe(true);
		});

		it('should enforce minimum value', () => {
			const result = validatePriceInput('0.5', {
				currency: ETH,
				minValue: '1.0',
			});

			expect(result.isValid).toBe(false);
			expect(result.error).toContain('at least 1.0');
		});

		it('should enforce maximum value', () => {
			const result = validatePriceInput('150', {
				currency: USDC,
				maxValue: '100',
			});

			expect(result.isValid).toBe(false);
			expect(result.error).toContain('cannot exceed 100');
		});

		it('should handle very small values', () => {
			const result = validatePriceInput('0.000000000000000001', {
				currency: ETH,
				maxDecimals: 18,
			});

			expect(result.isValid).toBe(true);
			expect(result.parsed?.[0]).toBe(1n); // 1 wei
		});

		it('should handle very large values', () => {
			const result = validatePriceInput('1000000000000', {
				currency: ETH,
				maxDecimals: 18,
			});

			expect(result.isValid).toBe(true);
			expect(result.parsed?.[0]).toBeGreaterThan(0n);
		});

		it('should trim whitespace', () => {
			const result = validatePriceInput('  1.5  ', {
				currency: ETH,
			});

			expect(result.isValid).toBe(true);
			expect(result.normalizedValue).toBe('1.5');
		});
	});

	describe('validateQuantity', () => {
		it('should validate positive integer quantities', () => {
			const result = validateQuantity(5, {
				maxQuantity: 100,
				requireInteger: true,
			});

			expect(result.isValid).toBe(true);
		});

		it('should validate string quantities', () => {
			const result = validateQuantity('10', {
				maxQuantity: 100,
				requireInteger: true,
			});

			expect(result.isValid).toBe(true);
			expect(result.normalizedValue).toBe('10');
		});

		it('should reject negative quantities', () => {
			const result = validateQuantity(-5, {});

			expect(result.isValid).toBe(false);
			expect(result.error).toContain('cannot be negative');
		});

		it('should reject zero quantities by default', () => {
			const result = validateQuantity(0, {});

			expect(result.isValid).toBe(false);
			expect(result.error).toContain('at least 1');
		});

		it('should allow custom minimum quantity', () => {
			const result = validateQuantity(5, { minQuantity: 10 });

			expect(result.isValid).toBe(false);
			expect(result.error).toContain('at least 10');
		});

		it('should enforce maximum quantity', () => {
			const result = validateQuantity(150, { maxQuantity: 100 });

			expect(result.isValid).toBe(false);
			expect(result.error).toContain('cannot exceed 100');
		});

		it('should enforce integer requirement', () => {
			const result = validateQuantity(2.5, {
				requireInteger: true,
			});

			expect(result.isValid).toBe(false);
			expect(result.error).toContain('whole number');
		});

		it('should allow fractional quantities when enabled', () => {
			const result = validateQuantity(2.5, {
				requireInteger: false,
				maxDecimals: 1,
			});

			expect(result.isValid).toBe(true);
		});

		it('should enforce decimal places for fractional quantities', () => {
			const result = validateQuantity(2.555, {
				requireInteger: false,
				maxDecimals: 2,
			});

			expect(result.isValid).toBe(false);
			expect(result.error).toContain('more than 2 decimal places');
		});

		it('should handle invalid string inputs', () => {
			const result = validateQuantity('invalid', {});

			expect(result.isValid).toBe(false);
			expect(result.error).toContain('valid number');
		});

		it('should handle infinity and NaN', () => {
			const result1 = validateQuantity(Number.POSITIVE_INFINITY, {});
			const result2 = validateQuantity(Number.NaN, {});

			expect(result1.isValid).toBe(false);
			expect(result2.isValid).toBe(false);
		});

		it('should handle very large safe integers', () => {
			const result = validateQuantity(Number.MAX_SAFE_INTEGER - 1, {
				maxQuantity: Number.MAX_SAFE_INTEGER,
			});

			expect(result.isValid).toBe(true);
		});
	});

	describe('validateSufficientBalance', () => {
		it('should validate sufficient balance', () => {
			const price = from('1', 18); // 1 ETH
			const balance = from('2', 18); // 2 ETH

			const result = validateSufficientBalance(price, balance, ETH);

			expect(result.isValid).toBe(true);
		});

		it('should reject insufficient balance', () => {
			const price = from('2', 18); // 2 ETH
			const balance = from('1', 18); // 1 ETH

			const result = validateSufficientBalance(price, balance, ETH);

			expect(result.isValid).toBe(false);
			expect(result.error).toContain('Insufficient ETH balance');
		});

		it('should handle different decimal precisions', () => {
			const price = from('1000000', 6); // 1 USDC (6 decimals)
			const balance = from('2000000000000000000', 18); // 2 ETH converted to 18 decimals

			// This would fail in real scenario but tests the decimal handling
			const result = validateSufficientBalance(price, balance, USDC);

			expect(result.isValid).toBe(true); // Large balance should be sufficient
		});

		it('should handle exact balance match', () => {
			const price = from('1.5', 18);
			const balance = from('1.5', 18);

			const result = validateSufficientBalance(price, balance, ETH);

			expect(result.isValid).toBe(true);
		});

		it('should handle very small differences', () => {
			const price = from('1.000000000000000001', 18);
			const balance = from('1.000000000000000000', 18);

			const result = validateSufficientBalance(price, balance, ETH);

			expect(result.isValid).toBe(false);
		});
	});

	describe('validatePriceRange', () => {
		it('should validate price within range', () => {
			const price = from('1.5', 18);
			const floorPrice = from('1', 18);
			const ceilPrice = from('2', 18);

			const result = validatePriceRange(price, floorPrice, ceilPrice, ETH);

			expect(result.isValid).toBe(true);
		});

		it('should reject price below floor', () => {
			const price = from('0.5', 18);
			const floorPrice = from('1', 18);

			const result = validatePriceRange(price, floorPrice, null, ETH);

			expect(result.isValid).toBe(false);
			expect(result.error).toContain('below floor price');
		});

		it('should reject price above ceiling', () => {
			const price = from('3', 18);
			const ceilPrice = from('2', 18);

			const result = validatePriceRange(price, null, ceilPrice, ETH);

			expect(result.isValid).toBe(false);
			expect(result.error).toContain('exceeds ceiling price');
		});

		it('should allow price equal to floor', () => {
			const price = from('1', 18);
			const floorPrice = from('1', 18);

			const result = validatePriceRange(price, floorPrice, null, ETH);

			expect(result.isValid).toBe(true);
		});

		it('should allow price equal to ceiling', () => {
			const price = from('2', 18);
			const ceilPrice = from('2', 18);

			const result = validatePriceRange(price, null, ceilPrice, ETH);

			expect(result.isValid).toBe(true);
		});

		it('should handle null floor and ceiling', () => {
			const price = from('1.5', 18);

			const result = validatePriceRange(price, null, null, ETH);

			expect(result.isValid).toBe(true);
		});
	});

	describe('validateExpirationDate', () => {
		it('should validate future date within limits', () => {
			const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now

			const result = validateExpirationDate(futureDate);

			expect(result.isValid).toBe(true);
		});

		it('should reject date too soon', () => {
			const soonDate = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

			const result = validateExpirationDate(soonDate, 5); // 5 min minimum

			expect(result.isValid).toBe(false);
			expect(result.error).toContain('at least 5 minutes');
		});

		it('should reject date too far in future', () => {
			const distantDate = new Date(Date.now() + 400 * 24 * 60 * 60 * 1000); // 400 days

			const result = validateExpirationDate(distantDate, 5, 365); // 365 days max

			expect(result.isValid).toBe(false);
			expect(result.error).toContain('more than 365 days');
		});

		it('should handle past dates', () => {
			const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago

			const result = validateExpirationDate(pastDate);

			expect(result.isValid).toBe(false);
		});

		it('should handle edge case at minimum boundary', () => {
			const minBoundaryDate = new Date(Date.now() + 5 * 60 * 1000 + 1000); // Just over 5 minutes

			const result = validateExpirationDate(minBoundaryDate, 5);

			expect(result.isValid).toBe(true);
		});

		it('should handle edge case at maximum boundary', () => {
			const maxBoundaryDate = new Date(
				Date.now() + 365 * 24 * 60 * 60 * 1000 - 1000,
			); // Just under 365 days

			const result = validateExpirationDate(maxBoundaryDate, 5, 365);

			expect(result.isValid).toBe(true);
		});
	});

	describe('validateBatch', () => {
		it('should pass when all validations succeed', () => {
			const validations = [
				() => validatePriceInput('1.5', { currency: ETH }),
				() => validateQuantity(10, { maxQuantity: 100 }),
				() => ({ isValid: true }),
			];

			const result = validateBatch(validations);

			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should fail when any validation fails', () => {
			const validations = [
				() => validatePriceInput('1.5', { currency: ETH }),
				() => validateQuantity(-5, {}), // This will fail
				() => ({ isValid: true }),
			];

			const result = validateBatch(validations);

			expect(result.isValid).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0]).toContain('negative');
		});

		it('should collect all errors', () => {
			const validations = [
				() => validatePriceInput('', { currency: ETH }), // Fail
				() => validateQuantity(-5, {}), // Fail
				() => ({ isValid: false, error: 'Custom error' }), // Fail
			];

			const result = validateBatch(validations);

			expect(result.isValid).toBe(false);
			expect(result.errors).toHaveLength(3);
			expect(result.error).toBe(result.errors[0]); // First error as main error
		});

		it('should handle empty validation array', () => {
			const result = validateBatch([]);

			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});
	});

	describe('Edge Cases and Complex Scenarios', () => {
		it('should handle maximum precision inputs', () => {
			const maxPrecisionInput = `1.${'0'.repeat(17)}1`; // 18 decimal places

			const result = validatePriceInput(maxPrecisionInput, {
				currency: ETH,
				maxDecimals: 18,
			});

			expect(result.isValid).toBe(true);
		});

		it('should handle very large price inputs', () => {
			const largePriceInput = '999999999999999999999999999999';

			const result = validatePriceInput(largePriceInput, {
				currency: ETH,
				maxDecimals: 18,
			});

			expect(result.isValid).toBe(true);
		});

		it('should validate complex multi-step scenarios', () => {
			// Scenario: User wants to buy 50 NFTs at 0.05 ETH each with 2.5% platform fee
			const unitPrice = '0.05';
			const quantity = 50;
			const userBalance = from('3', 18); // 3 ETH balance

			const priceValidation = validatePriceInput(unitPrice, {
				currency: ETH,
				minValue: '0.001',
				maxValue: '10',
			});

			const quantityValidation = validateQuantity(quantity, {
				maxQuantity: 100,
				requireInteger: true,
			});

			// Calculate total price (50 * 0.05 = 2.5 ETH + 2.5% fee = 2.5625 ETH)
			const totalPrice = from('2.5625', 18);
			const balanceValidation = validateSufficientBalance(
				totalPrice,
				userBalance,
				ETH,
			);

			expect(priceValidation.isValid).toBe(true);
			expect(quantityValidation.isValid).toBe(true);
			expect(balanceValidation.isValid).toBe(true);
		});

		it('should handle international number formats gracefully', () => {
			// European format with comma as decimal separator
			const result = validatePriceInput('1234,56', {
				currency: USDC,
				maxDecimals: 6,
			});

			expect(result.isValid).toBe(true);
			expect(result.normalizedValue).toBe('1234.56');
		});

		it('should validate price ranges with different currencies', () => {
			const ethPrice = from('1', 18); // 1 ETH
			const ethFloor = from('0.5', 18); // 0.5 ETH floor
			const ethCeiling = from('2', 18); // 2 ETH ceiling

			const result = validatePriceRange(ethPrice, ethFloor, ethCeiling, ETH);

			expect(result.isValid).toBe(true);
		});
	});

	describe('Performance and Stress Tests', () => {
		it('should handle many validations efficiently', () => {
			const startTime = performance.now();

			// Perform many validations
			for (let i = 0; i < 1000; i++) {
				validatePriceInput(`${i}.${i}`, { currency: ETH });
				validateQuantity(i, { maxQuantity: 2000 });
			}

			const endTime = performance.now();
			const duration = endTime - startTime;

			// Should complete in reasonable time (less than 100ms)
			expect(duration).toBeLessThan(100);
		});

		it('should handle complex batch validations efficiently', () => {
			const complexValidations = Array.from({ length: 100 }, (_, i) => [
				() => validatePriceInput(`${i}.5`, { currency: ETH }),
				() => validateQuantity(i + 1, { maxQuantity: 1000 }),
				() => ({
					isValid: i % 10 !== 0, // Fail every 10th validation
					error: i % 10 === 0 ? `Error ${i}` : undefined,
				}),
			]).flat();

			const startTime = performance.now();
			const result = validateBatch(complexValidations);
			const endTime = performance.now();

			expect(endTime - startTime).toBeLessThan(50);
			expect(result.isValid).toBe(false); // Should fail due to every 10th validation
			expect(result.errors.length).toBeGreaterThan(0);
		});
	});
});
