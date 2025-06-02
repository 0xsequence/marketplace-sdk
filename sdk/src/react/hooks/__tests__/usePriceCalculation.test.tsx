import { renderHook } from '@testing-library/react';
import { from } from 'dnum';
import { describe, expect, it } from 'vitest';
import { createWrapper } from '../../../test/test-utils';
import { usePriceCalculation } from '../ui/modals/BuyModal/hooks/usePriceCalculation';

describe('usePriceCalculation Hook', () => {
	describe('Basic Price Calculations', () => {
		it('should calculate simple price correctly', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1000000000000000000', // 1 ETH
						quantity: 5,
						decimals: 18,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(true);
			expect(result.current.subtotal[0]).toBe(BigInt('5000000000000000000'));
			expect(result.current.grandTotal[0]).toBe(BigInt('5000000000000000000'));
			expect(result.current.display.grandTotal).toBe('5');
		});

		it('should handle zero price', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '0',
						quantity: 10,
						decimals: 18,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(false);
			expect(result.current.subtotal[0]).toBe(0n);
			expect(result.current.grandTotal[0]).toBe(0n);
		});

		it('should handle zero quantity', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1000000000000000000',
						quantity: 0,
						decimals: 18,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(false);
			expect(result.current.subtotal[0]).toBe(0n);
			expect(result.current.grandTotal[0]).toBe(0n);
		});
	});

	describe('BigInt Overflow Protection', () => {
		it('should handle maximum safe integer without overflow', () => {
			const largePrice = '999999999999999999'; // Just under 1 ETH
			const largeQuantity = 1000000;

			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: largePrice,
						quantity: largeQuantity,
						decimals: 18,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(true);
			expect(result.current.subtotal[0]).toBeGreaterThan(0n);
			// Should not throw overflow error
		});

		it('should handle extremely large numbers', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1000000000000000000000000000000', // 1 trillion ETH
						quantity: 999999,
						decimals: 18,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(true);
			expect(result.current.subtotal[0]).toBeGreaterThan(0n);
		});

		it('should handle maximum BigInt values', () => {
			// Test with very large but valid BigInt values
			const maxSafePrice = (2n ** 250n).toString(); // Very large number

			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: maxSafePrice,
						quantity: 1,
						decimals: 18,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(true);
			expect(result.current.subtotal[0]).toBeGreaterThan(0n);
		});
	});

	describe('Fee Calculations', () => {
		it('should calculate single fee correctly', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1000000000000000000', // 1 ETH
						quantity: 1,
						decimals: 18,
						fees: [{ type: 'platform', percentage: 10 }],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(true);
			expect(result.current.subtotal[0]).toBe(BigInt('1000000000000000000'));
			expect(result.current.fees[0]).toBe(BigInt('100000000000000000')); // 0.1 ETH
			expect(result.current.grandTotal[0]).toBe(BigInt('1100000000000000000')); // 1.1 ETH
		});

		it('should calculate multiple fees correctly', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '2000000000000000000', // 2 ETH
						quantity: 1,
						decimals: 18,
						fees: [
							{ type: 'platform', percentage: 5 },
							{ type: 'royalty', percentage: 2.5 },
							{ type: 'gas', percentage: 1 },
						],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(true);
			expect(result.current.subtotal[0]).toBe(BigInt('2000000000000000000'));

			// Total fees: 5% + 2.5% + 1% = 8.5% of 2 ETH = 0.17 ETH
			expect(result.current.fees[0]).toBe(BigInt('170000000000000000'));

			// Grand total: 2 ETH + 0.17 ETH = 2.17 ETH
			expect(result.current.grandTotal[0]).toBe(BigInt('2170000000000000000'));
		});

		it('should handle negative fees (discounts)', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1000000000000000000', // 1 ETH
						quantity: 1,
						decimals: 18,
						fees: [{ type: 'discount', percentage: -15 }],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(true);
			expect(result.current.subtotal[0]).toBe(BigInt('1000000000000000000'));
			expect(result.current.fees[0]).toBe(BigInt('-150000000000000000')); // -0.15 ETH
			expect(result.current.grandTotal[0]).toBe(BigInt('850000000000000000')); // 0.85 ETH
		});

		it('should handle 100% discount correctly', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1000000000000000000',
						quantity: 1,
						decimals: 18,
						fees: [{ type: 'full-discount', percentage: -100 }],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(false); // Free items should be invalid for purchase flow
			expect(result.current.grandTotal[0]).toBe(0n);
		});

		it('should handle fractional percentages', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1000000000000000000',
						quantity: 1,
						decimals: 18,
						fees: [{ type: 'precise-fee', percentage: 2.75 }],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(true);
			// 2.75% of 1 ETH = 0.0275 ETH
			expect(result.current.fees[0]).toBe(BigInt('27500000000000000'));
			expect(result.current.grandTotal[0]).toBe(BigInt('1027500000000000000'));
		});
	});

	describe('Different Decimal Precisions', () => {
		it('should handle USDC (6 decimals) correctly', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1000000', // 1 USDC
						quantity: 100,
						decimals: 6,
						fees: [{ type: 'platform', percentage: 2.5 }],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(true);
			expect(result.current.subtotal[0]).toBe(BigInt('100000000')); // 100 USDC
			expect(result.current.subtotal[1]).toBe(6);
			expect(result.current.fees[0]).toBe(BigInt('2500000')); // 2.5 USDC
			expect(result.current.grandTotal[0]).toBe(BigInt('102500000')); // 102.5 USDC
		});

		it('should handle custom token with 8 decimals', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '100000000', // 1 token with 8 decimals
						quantity: 50,
						decimals: 8,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(true);
			expect(result.current.subtotal[0]).toBe(BigInt('5000000000')); // 50 tokens
			expect(result.current.subtotal[1]).toBe(8);
		});

		it('should handle tokens with 0 decimals', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1', // 1 whole token
						quantity: 10,
						decimals: 0,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(true);
			expect(result.current.subtotal[0]).toBe(10n);
			expect(result.current.subtotal[1]).toBe(0);
			expect(result.current.display.grandTotal).toBe('10');
		});
	});

	describe('Edge Cases and Error Handling', () => {
		it('should handle invalid price input gracefully', () => {
			expect(() => {
				renderHook(
					() =>
						usePriceCalculation({
							unitPrice: 'invalid-price',
							quantity: 1,
							decimals: 18,
							fees: [],
						}),
					{ wrapper: createWrapper() },
				);
			}).toThrow(); // Should throw during dnum parsing
		});

		it('should handle negative quantity', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1000000000000000000',
						quantity: -5,
						decimals: 18,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(false);
			expect(result.current.subtotal[0]).toBeLessThan(0n);
		});

		it('should handle decimal quantities correctly', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1000000000000000000',
						quantity: 2.5,
						decimals: 18,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(true);
			// 2.5 * 1 ETH = 2.5 ETH
			expect(result.current.subtotal[0]).toBe(BigInt('2500000000000000000'));
		});

		it('should handle very small decimal quantities', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1000000000000000000',
						quantity: 0.001,
						decimals: 18,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(true);
			// 0.001 * 1 ETH = 0.001 ETH
			expect(result.current.subtotal[0]).toBe(BigInt('1000000000000000'));
		});
	});

	describe('Display Formatting', () => {
		it('should format large numbers with appropriate precision', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '123456789012345678901', // Very large amount
						quantity: 1,
						decimals: 18,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(true);
			expect(result.current.display.grandTotal).toMatch(/^\d+(\.\d{1,6})?$/); // Should limit to 6 decimals
		});

		it('should format small numbers with appropriate precision', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '123456789', // 0.000000000123456789 ETH
						quantity: 1,
						decimals: 18,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(true);
			expect(result.current.display.grandTotal).toMatch(/0\.000000123457/); // Should show meaningful precision
		});

		it('should format zero values correctly', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '0',
						quantity: 1,
						decimals: 18,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.display.grandTotal).toBe('0');
			expect(result.current.display.subtotal).toBe('0');
			expect(result.current.display.fees).toBe('0');
		});
	});

	describe('Contract Value Output', () => {
		it('should provide correct contractValue for transactions', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1500000000000000000', // 1.5 ETH
						quantity: 3,
						decimals: 18,
						fees: [{ type: 'platform', percentage: 5 }],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(true);
			// 3 * 1.5 ETH = 4.5 ETH + 5% = 4.725 ETH
			expect(result.current.contractValue).toBe(BigInt('4725000000000000000'));
			expect(result.current.contractValue).toBe(result.current.grandTotal[0]);
		});

		it('should handle contractValue for different decimal precision', () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1500000', // 1.5 USDC
						quantity: 100,
						decimals: 6,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			expect(result.current.isValid).toBe(true);
			expect(result.current.contractValue).toBe(BigInt('150000000')); // 150 USDC
		});
	});

	describe('Performance and Memory', () => {
		it('should handle rapid successive calculations efficiently', () => {
			const { result, rerender } = renderHook(
				(props) => usePriceCalculation(props),
				{
					wrapper: createWrapper(),
					initialProps: {
						unitPrice: '1000000000000000000',
						quantity: 1,
						decimals: 18,
						fees: [],
					},
				},
			);

			// Simulate rapid updates
			for (let i = 1; i <= 100; i++) {
				rerender({
					unitPrice: '1000000000000000000',
					quantity: i,
					decimals: 18,
					fees: [],
				});
			}

			expect(result.current.isValid).toBe(true);
			expect(result.current.subtotal[0]).toBe(BigInt('100000000000000000000')); // 100 ETH
		});

		it('should memoize results for same inputs', () => {
			const { result, rerender } = renderHook(
				(props) => usePriceCalculation(props),
				{
					wrapper: createWrapper(),
					initialProps: {
						unitPrice: '1000000000000000000',
						quantity: 5,
						decimals: 18,
						fees: [{ type: 'platform', percentage: 2.5 }],
					},
				},
			);

			const firstResult = result.current;

			// Rerender with same props
			rerender({
				unitPrice: '1000000000000000000',
				quantity: 5,
				decimals: 18,
				fees: [{ type: 'platform', percentage: 2.5 }],
			});

			const secondResult = result.current;

			// Results should be memoized (same object reference)
			expect(firstResult).toBe(secondResult);
		});
	});
});
