import { describe, expect, test } from 'vitest';
import { compareAddress, truncateEnd, truncateMiddle } from '../address';

describe('address utils', () => {
	describe('truncateMiddle', () => {
		test('should truncate address with default parameters', () => {
			const address = '0x1234567890123456789012345678901234567890';
			const result = truncateMiddle(address);
			expect(result).toBe('0x12345678901234567890…890');
		});

		test('should return full address if minPrefix + minSuffix >= 40', () => {
			const address = '0x1234567890123456789012345678901234567890';
			const result = truncateMiddle(address, 35, 6);
			expect(result).toBe(address);
		});

		test('should truncate with custom prefix and suffix lengths', () => {
			const address = '0x1234567890123456789012345678901234567890';
			const result = truncateMiddle(address, 10, 5);
			expect(result).toBe('0x1234567890…67890');
		});
	});

	describe('truncateEnd', () => {
		test('should return empty string for undefined input', () => {
			expect(truncateEnd(undefined, 10)).toBe('');
		});

		test('should not truncate text shorter than truncateAt', () => {
			const text = 'Short';
			expect(truncateEnd(text, 10)).toBe('Short');
		});

		test('should truncate text longer than truncateAt', () => {
			const text = 'This is a very long text';
			expect(truncateEnd(text, 10)).toBe('This is a ...');
		});

		test('should truncate text equal to truncateAt', () => {
			const text = '1234567890';
			expect(truncateEnd(text, 10)).toBe('1234567890...');
		});
	});

	describe('compareAddress', () => {
		test('should return true for matching addresses with different cases', () => {
			expect(compareAddress('0x1234567890abcdef', '0x1234567890ABCDEF')).toBe(
				true,
			);
		});

		test('should return false for different addresses', () => {
			expect(compareAddress('0x1234567890abcdef', '0x1234567890abcdef1')).toBe(
				false,
			);
		});

		test('should handle undefined or empty inputs', () => {
			expect(compareAddress()).toBe(true);
			expect(compareAddress('', '')).toBe(true);
			expect(compareAddress('0x123', '')).toBe(false);
		});
	});
});
