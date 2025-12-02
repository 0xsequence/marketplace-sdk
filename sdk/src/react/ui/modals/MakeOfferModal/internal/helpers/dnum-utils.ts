/**
 * Dnum helpers for MakeOfferModal
 *
 * Only includes wrappers for:
 * 1. Functions dnum doesn't export directly (isZero, isPositive)
 * 2. Common patterns that need standardized error handling (parseInput, fromBigIntString)
 * 3. Contract interaction helpers (toBigIntString)
 *
 * Everything else should use dnum directly:
 * - dnum.greaterThan(), dnum.lessThan(), dnum.equal()
 * - dnum.toString(), dnum.toNumber(), dnum.format()
 */

import * as dnum from 'dnum';

/**
 * Parse user input with graceful error handling
 * Unlike dnum.from(), this never throws - returns zero for invalid input
 *
 * @example
 * parseInput("1.5", 18)  // [1500000000000000000n, 18]
 * parseInput("", 18)     // [0n, 18]
 * parseInput("abc", 18)  // [0n, 18] - graceful fallback instead of throwing
 */
export function parseInput(input: string, decimals: number): dnum.Dnum {
	if (!input || input === '') {
		return [0n, decimals];
	}

	try {
		return dnum.from(input, decimals);
	} catch {
		return [0n, decimals];
	}
}

/**
 * Check if value is zero
 * Semantic helper for readability
 *
 * @example
 * isZero([0n, 18])                    // true
 * isZero([1500000000000000000n, 18])  // false
 */
export function isZero(value: dnum.Dnum): boolean {
	return value[0] === 0n;
}

/**
 * Check if value is greater than zero
 * Semantic helper for validation
 *
 * @example
 * isPositive([1n, 18])   // true
 * isPositive([0n, 18])   // false
 * isPositive([-1n, 18])  // false
 */
export function isPositive(value: dnum.Dnum): boolean {
	return value[0] > 0n;
}

/**
 * Convert Dnum to raw bigint string for contract calls
 * This is what gets sent to smart contracts
 *
 * @example
 * toBigIntString([1500000000000000000n, 18]) // "1500000000000000000"
 * toBigIntString([1000000n, 6])              // "1000000" (USDC)
 */
export function toBigIntString(value: dnum.Dnum): string {
	return value[0].toString();
}

/**
 * Create Dnum from raw bigint string (from contract/API)
 * Handles invalid input gracefully
 *
 * @example
 * fromBigIntString("1500000000000000000", 18) // [1500000000000000000n, 18]
 * fromBigIntString("1000000", 6)              // [1000000n, 6] (USDC)
 * fromBigIntString("invalid", 18)             // [0n, 18] - graceful fallback
 */
export function fromBigIntString(
	bigIntString: string,
	decimals: number,
): dnum.Dnum {
	try {
		const value = BigInt(bigIntString);
		return [value, decimals];
	} catch {
		return [0n, decimals];
	}
}

// Re-export commonly used dnum functions for convenience
export { equal, greaterThan, lessThan, toNumber } from 'dnum';
