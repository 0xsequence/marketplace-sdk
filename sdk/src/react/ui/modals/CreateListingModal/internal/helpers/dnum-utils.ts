/**
 * Dnum utilities for CreateListingModal
 * Pure functions for working with decimal numbers using dnum library
 *
 * This module provides utilities for:
 * - Parsing user input strings into Dnum values
 * - Converting between different decimal precisions
 * - Safe comparisons without precision loss
 * - Formatting for display
 *
 * Why dnum over parseUnits/formatUnits:
 * - No precision loss with large numbers (uses BigInt internally)
 * - Type-safe decimal handling
 * - Built-in formatting options
 * - Consistent API for all operations
 */

import * as dnum from 'dnum';

/**
 * Parse a user input string into a Dnum value with specified decimals
 * Handles empty strings, invalid inputs gracefully
 *
 * @example
 * parseInput("1.5", 18) // [1500000000000000000n, 18]
 * parseInput("", 18)    // [0n, 18]
 * parseInput("abc", 18) // [0n, 18] (graceful fallback)
 */
export function parseInput(input: string, decimals: number): dnum.Dnum {
	if (!input || input === '') {
		return [0n, decimals];
	}

	try {
		return dnum.from(input, decimals);
	} catch {
		// Graceful fallback for invalid input
		return [0n, decimals];
	}
}

/**
 * Convert a Dnum value to wei/smallest unit string representation
 * Returns the bigint value as a string for use with smart contracts
 *
 * @example
 * toWeiString([1500000000000000000n, 18]) // "1500000000000000000"
 * toWeiString([0n, 18])                   // "0"
 */
export function toWeiString(value: dnum.Dnum): string {
	return value[0].toString();
}

/**
 * Convert a wei/smallest unit string into a Dnum value
 *
 * @example
 * fromWeiString("1500000000000000000", 18) // [1500000000000000000n, 18]
 * fromWeiString("0", 18)                   // [0n, 18]
 */
export function fromWeiString(weiString: string, decimals: number): dnum.Dnum {
	try {
		const value = BigInt(weiString);
		return [value, decimals];
	} catch {
		return [0n, decimals];
	}
}

/**
 * Check if a Dnum value is zero
 *
 * @example
 * isZero([0n, 18])                    // true
 * isZero([1500000000000000000n, 18])  // false
 */
export function isZero(value: dnum.Dnum): boolean {
	return value[0] === 0n;
}

/**
 * Check if a Dnum value is greater than zero
 *
 * @example
 * isPositive([1n, 18])  // true
 * isPositive([0n, 18])  // false
 * isPositive([-1n, 18]) // false
 */
export function isPositive(value: dnum.Dnum): boolean {
	return value[0] > 0n;
}

/**
 * Convert a Dnum value back to a decimal string for display/editing
 * Useful for populating input fields
 *
 * @example
 * toDecimalString([1500000000000000000n, 18]) // "1.5"
 * toDecimalString([0n, 18])                   // "0"
 */
export function toDecimalString(value: dnum.Dnum): string {
	return dnum.toString(value);
}

/**
 * Convert a Dnum value to a JavaScript number
 * WARNING: May lose precision for very large numbers
 * Only use for display/analytics where precision loss is acceptable
 *
 * @example
 * toNumber([1500000000000000000n, 18]) // 1.5
 * toNumber([0n, 18])                   // 0
 */
export function toNumber(value: dnum.Dnum): number {
	return dnum.toNumber(value);
}

/**
 * Compare two Dnum values for equality
 * Works regardless of decimal precision
 *
 * @example
 * equals([1000000n, 6], [1000000000000000000n, 18]) // true (both equal 1.0)
 * equals([0n, 6], [1n, 18])                         // false
 */
export function equals(a: dnum.Dnum, b: dnum.Dnum): boolean {
	return dnum.equal(a, b);
}

/**
 * Check if first value is greater than second
 * Works regardless of decimal precision
 *
 * @example
 * greaterThan([2000000n, 6], [1000000n, 6]) // true
 * greaterThan([1000000n, 6], [1000000n, 6]) // false
 */
export function greaterThan(a: dnum.Dnum, b: dnum.Dnum): boolean {
	return dnum.greaterThan(a, b);
}

/**
 * Check if first value is less than second
 * Works regardless of decimal precision
 *
 * @example
 * lessThan([1000000n, 6], [2000000n, 6]) // true
 * lessThan([1000000n, 6], [1000000n, 6]) // false
 */
export function lessThan(a: dnum.Dnum, b: dnum.Dnum): boolean {
	return dnum.lessThan(a, b);
}

/**
 * Format a Dnum value for display
 * Provides rich formatting options for UI presentation
 *
 * @example
 * format([1500000000000000000n, 18], { digits: 2 })         // "1.50"
 * format([1500000000000000000n, 18], { compact: true })     // "1.5"
 * format([1234567890000000000000n, 18], { compact: true })  // "1.2K"
 */
export function format(
	value: dnum.Dnum,
	options?: Parameters<typeof dnum.format>[1],
): string {
	return dnum.format(value, options);
}
