import * as dnum from 'dnum';
import { describe, expect, it } from 'vitest';
import {
	applyFeeMultiplier,
	calculateFeeAmount,
	fromBigIntString,
	isPositive,
	isZero,
	parseInput,
	toBigIntString,
	toRawValue,
} from '../dnum-utils';

describe('dnum-utils', () => {
	describe('parseInput', () => {
		it('should parse valid decimal input', () => {
			const result = parseInput('1.5', 18);
			expect(result[0]).toBe(1500000000000000000n);
			expect(result[1]).toBe(18);
		});

		it('should parse integer input', () => {
			const result = parseInput('100', 6);
			expect(result[0]).toBe(100000000n);
			expect(result[1]).toBe(6);
		});

		it('should handle empty string', () => {
			const result = parseInput('', 18);
			expect(result[0]).toBe(0n);
			expect(result[1]).toBe(18);
		});

		it('should handle invalid input gracefully', () => {
			const result = parseInput('abc', 18);
			expect(result[0]).toBe(0n);
			expect(result[1]).toBe(18);
		});

		it('should handle zero', () => {
			const result = parseInput('0', 18);
			expect(result[0]).toBe(0n);
			expect(result[1]).toBe(18);
		});

		it('should handle very small decimals', () => {
			const result = parseInput('0.000001', 6);
			expect(result[0]).toBe(1n);
			expect(result[1]).toBe(6);
		});
	});

	describe('isZero', () => {
		it('should return true for zero', () => {
			expect(isZero([0n, 18])).toBe(true);
		});

		it('should return false for positive number', () => {
			expect(isZero([1500000000000000000n, 18])).toBe(false);
		});

		it('should return false for negative number', () => {
			expect(isZero([-1n, 18])).toBe(false);
		});

		it('should work with different decimals', () => {
			expect(isZero([0n, 6])).toBe(true);
			expect(isZero([0n, 0])).toBe(true);
		});
	});

	describe('isPositive', () => {
		it('should return true for positive number', () => {
			expect(isPositive([1n, 18])).toBe(true);
			expect(isPositive([1500000000000000000n, 18])).toBe(true);
		});

		it('should return false for zero', () => {
			expect(isPositive([0n, 18])).toBe(false);
		});

		it('should return false for negative number', () => {
			expect(isPositive([-1n, 18])).toBe(false);
			expect(isPositive([-1500000000000000000n, 18])).toBe(false);
		});

		it('should work with different decimals', () => {
			expect(isPositive([1000000n, 6])).toBe(true);
			expect(isPositive([1n, 0])).toBe(true);
		});
	});

	describe('toBigIntString', () => {
		it('should convert dnum to bigint string', () => {
			const result = toBigIntString([1500000000000000000n, 18]);
			expect(result).toBe('1500000000000000000');
		});

		it('should handle USDC (6 decimals)', () => {
			const result = toBigIntString([1000000n, 6]);
			expect(result).toBe('1000000');
		});

		it('should handle zero', () => {
			const result = toBigIntString([0n, 18]);
			expect(result).toBe('0');
		});

		it('should handle very large numbers', () => {
			const result = toBigIntString([1000000000000000000000000n, 18]);
			expect(result).toBe('1000000000000000000000000');
		});
	});

	describe('fromBigIntString', () => {
		it('should create dnum from bigint string', () => {
			const result = fromBigIntString('1500000000000000000', 18);
			expect(result[0]).toBe(1500000000000000000n);
			expect(result[1]).toBe(18);
		});

		it('should handle USDC (6 decimals)', () => {
			const result = fromBigIntString('1000000', 6);
			expect(result[0]).toBe(1000000n);
			expect(result[1]).toBe(6);
		});

		it('should handle zero', () => {
			const result = fromBigIntString('0', 18);
			expect(result[0]).toBe(0n);
			expect(result[1]).toBe(18);
		});

		it('should handle invalid input gracefully', () => {
			const result = fromBigIntString('invalid', 18);
			expect(result[0]).toBe(0n);
			expect(result[1]).toBe(18);
		});

		it('should handle empty string', () => {
			const result = fromBigIntString('', 18);
			expect(result[0]).toBe(0n);
			expect(result[1]).toBe(18);
		});

		it('should handle very large numbers', () => {
			const result = fromBigIntString('1000000000000000000000000', 18);
			expect(result[0]).toBe(1000000000000000000000000n);
			expect(result[1]).toBe(18);
		});
	});

	describe('toRawValue', () => {
		it('should extract raw bigint value', () => {
			const result = toRawValue([1500000000000000000n, 18]);
			expect(result).toBe(1500000000000000000n);
		});

		it('should work with USDC (6 decimals)', () => {
			const result = toRawValue([1000000n, 6]);
			expect(result).toBe(1000000n);
		});

		it('should handle zero', () => {
			const result = toRawValue([0n, 18]);
			expect(result).toBe(0n);
		});

		it('should handle very large numbers', () => {
			const result = toRawValue([1000000000000000000000000n, 18]);
			expect(result).toBe(1000000000000000000000000n);
		});
	});

	describe('applyFeeMultiplier', () => {
		describe('add operation', () => {
			it('should add fee percentage to amount', () => {
				const price = [100000000n, 6] as dnum.Dnum; // 100 USDC
				const result = applyFeeMultiplier(price, 2.5, 'add');
				// 100 * 1.025 = 102.5 USDC = 102500000
				expect(result[0]).toBe(102500000n);
				expect(result[1]).toBe(6);
			});

			it('should handle 18 decimals (ETH)', () => {
				const price = [1000000000000000000n, 18] as dnum.Dnum; // 1 ETH
				const result = applyFeeMultiplier(price, 3.5, 'add');
				// 1 * 1.035 = 1.035 ETH
				expect(result[0]).toBe(1035000000000000000n);
				expect(result[1]).toBe(18);
			});

			it('should handle zero fee', () => {
				const price = [100000000n, 6] as dnum.Dnum;
				const result = applyFeeMultiplier(price, 0, 'add');
				expect(result[0]).toBe(100000000n);
				expect(result[1]).toBe(6);
			});

			it('should chain multiple fees', () => {
				const price = [100000000000000000000n, 18] as dnum.Dnum; // 100 ETH
				let total = applyFeeMultiplier(price, 2.5, 'add'); // +2.5%
				total = applyFeeMultiplier(total, 1.0, 'add'); // +1%
				// 100 * 1.025 * 1.01 = 103.525 ETH
				expect(total[0]).toBe(103525000000000000000n);
				expect(total[1]).toBe(18);
			});

			it('should handle small amounts', () => {
				const price = [1n, 6] as dnum.Dnum; // 0.000001 USDC
				const result = applyFeeMultiplier(price, 2.5, 'add');
				// 0.000001 * 1.025 = 0.0000010025 USDC (rounds to 1n due to precision)
				expect(result[1]).toBe(6);
			});
		});

		describe('subtract operation', () => {
			it('should subtract fee percentage from amount', () => {
				const price = [100000000n, 6] as dnum.Dnum; // 100 USDC
				const result = applyFeeMultiplier(price, 2.5, 'subtract');
				// 100 * 0.975 = 97.5 USDC = 97500000
				expect(result[0]).toBe(97500000n);
				expect(result[1]).toBe(6);
			});

			it('should handle 18 decimals (ETH)', () => {
				const price = [1000000000000000000n, 18] as dnum.Dnum; // 1 ETH
				const result = applyFeeMultiplier(price, 3.5, 'subtract');
				// 1 * 0.965 = 0.965 ETH
				expect(result[0]).toBe(965000000000000000n);
				expect(result[1]).toBe(18);
			});

			it('should handle multiple fees (seller earnings)', () => {
				const price = [100000000000000000000n, 18] as dnum.Dnum; // 100 ETH
				let earnings = applyFeeMultiplier(price, 2.5, 'subtract'); // -2.5%
				earnings = applyFeeMultiplier(earnings, 1.0, 'subtract'); // -1%
				// 100 * 0.975 * 0.99 = 96.525 ETH
				expect(earnings[0]).toBe(96525000000000000000n);
				expect(earnings[1]).toBe(18);
			});

			it('should handle zero fee', () => {
				const price = [100000000n, 6] as dnum.Dnum;
				const result = applyFeeMultiplier(price, 0, 'subtract');
				expect(result[0]).toBe(100000000n);
				expect(result[1]).toBe(6);
			});
		});
	});

	describe('calculateFeeAmount', () => {
		it('should calculate fee amount for percentage', () => {
			const price = [100000000n, 6] as dnum.Dnum; // 100 USDC
			const fee = calculateFeeAmount(price, 2.5);
			// 100 * 0.025 = 2.5 USDC = 2500000
			expect(fee[0]).toBe(2500000n);
			expect(fee[1]).toBe(6);
		});

		it('should handle 18 decimals (ETH)', () => {
			const price = [1000000000000000000n, 18] as dnum.Dnum; // 1 ETH
			const fee = calculateFeeAmount(price, 3.5);
			// 1 * 0.035 = 0.035 ETH
			expect(fee[0]).toBe(35000000000000000n);
			expect(fee[1]).toBe(18);
		});

		it('should return zero for zero fee percentage', () => {
			const price = [100000000n, 6] as dnum.Dnum;
			const fee = calculateFeeAmount(price, 0);
			expect(fee[0]).toBe(0n);
			expect(fee[1]).toBe(6);
		});

		it('should handle small percentages', () => {
			const price = [1000000000000000000n, 18] as dnum.Dnum; // 1 ETH
			const fee = calculateFeeAmount(price, 0.01); // 0.01%
			// 1 * 0.0001 = 0.0001 ETH
			expect(fee[0]).toBe(100000000000000n);
			expect(fee[1]).toBe(18);
		});

		it('should work with dnum.add for total calculation', () => {
			const price = [100000000n, 6] as dnum.Dnum; // 100 USDC
			const fee = calculateFeeAmount(price, 2.5);
			const total = dnum.add(price, fee);
			// 100 + 2.5 = 102.5 USDC
			expect(total[0]).toBe(102500000n);
			expect(total[1]).toBe(6);
		});

		it('should calculate marketplace and royalty fees separately', () => {
			const price = [100000000000000000000n, 18] as dnum.Dnum; // 100 ETH
			const marketplaceFee = calculateFeeAmount(price, 2.5);
			const royaltyFee = calculateFeeAmount(price, 1.0);
			// Marketplace: 100 * 0.025 = 2.5 ETH
			expect(marketplaceFee[0]).toBe(2500000000000000000n);
			// Royalty: 100 * 0.01 = 1 ETH
			expect(royaltyFee[0]).toBe(1000000000000000000n);
		});
	});

	describe('round-trip conversions', () => {
		it('should maintain value through toBigIntString and fromBigIntString', () => {
			const original = [1500000000000000000n, 18] as const;
			const stringified = toBigIntString(original);
			const parsed = fromBigIntString(stringified, 18);
			expect(parsed[0]).toBe(original[0]);
			expect(parsed[1]).toBe(original[1]);
		});

		it('should maintain value through parseInput and toBigIntString', () => {
			const input = '1.5';
			const decimals = 18;
			const parsed = parseInput(input, decimals);
			const stringified = toBigIntString(parsed);
			expect(stringified).toBe('1500000000000000000');
		});

		it('should maintain value through toRawValue and manual tuple creation', () => {
			const original = [1500000000000000000n, 18] as dnum.Dnum;
			const raw = toRawValue(original);
			const reconstructed = [raw, 18] as dnum.Dnum;
			expect(reconstructed[0]).toBe(original[0]);
			expect(reconstructed[1]).toBe(original[1]);
		});
	});
});
