import { type Dnum, add, divide, format, from, multiply, subtract } from 'dnum';

export type Price = Dnum; // [value: bigint, decimals: number]

export interface PriceFormatOptions {
	symbol?: string;
	compact?: boolean;
	maxDecimals?: number;
	trailingZeros?: boolean;
}

// biome-ignore lint/complexity/noStaticOnlyClass: PriceManager provides good namespacing for price utilities
export class PriceManager {
	/**
	 * Create a Price from a string value with specified decimals
	 * Safely handles large numbers without overflow
	 */
	static fromString(value: string, decimals: number): Price {
		try {
			return from(value, decimals);
		} catch (error) {
			throw new Error(
				`Failed to parse price "${value}" with ${decimals} decimals: ${error}`,
			);
		}
	}

	/**
	 * Calculate item total with safe multiplication
	 * Prevents BigInt overflow that existed in original implementation
	 */
	static calculateItemTotal(
		unitPrice: string,
		quantity: number,
		decimals: number,
	): Price {
		try {
			const price = PriceManager.fromString(unitPrice, decimals);
			return multiply(price, quantity);
		} catch (error) {
			throw new Error(
				`Price calculation failed for ${unitPrice} * ${quantity}: ${error}`,
			);
		}
	}

	/**
	 * Calculate fees as a percentage of the subtotal
	 * Uses proper decimal handling for percentage calculations
	 */
	static calculateFees(subtotal: Price, feePercentage: number): Price {
		try {
			// Convert percentage to decimal (e.g., 2.5% -> 0.025)
			const feeDecimal = from((feePercentage / 100).toString(), subtotal[1]);
			return multiply(subtotal, feeDecimal);
		} catch (error) {
			throw new Error(`Fee calculation failed for ${feePercentage}%: ${error}`);
		}
	}

	/**
	 * Calculate grand total by adding subtotal and fees
	 */
	static calculateGrandTotal(subtotal: Price, fees: Price): Price {
		try {
			return add(subtotal, fees);
		} catch (error) {
			throw new Error(`Grand total calculation failed: ${error}`);
		}
	}

	/**
	 * Safe division for price calculations
	 */
	static divide(dividend: Price, divisor: number): Price {
		try {
			return divide(dividend, divisor);
		} catch (error) {
			throw new Error(`Division failed: ${error}`);
		}
	}

	/**
	 * Compare two prices safely
	 */
	static isGreaterThan(a: Price, b: Price): boolean {
		try {
			const diff = subtract(a, b);
			return diff[0] > 0n;
		} catch (error) {
			throw new Error(`Price comparison failed: ${error}`);
		}
	}

	/**
	 * Check if two prices are equal
	 */
	static isEqual(a: Price, b: Price): boolean {
		try {
			const diff = subtract(a, b);
			return diff[0] === 0n;
		} catch (error) {
			throw new Error(`Price comparison failed: ${error}`);
		}
	}

	/**
	 * Format price for display with various options
	 * Provides consistent formatting across the application
	 */
	static formatForDisplay(
		amount: Price,
		options: PriceFormatOptions = {},
	): string {
		try {
			const {
				symbol,
				compact = false,
				maxDecimals = 6,
				trailingZeros = false,
			} = options;

			const formatted = format(amount, {
				digits: maxDecimals,
				compact,
				trailingZeros,
			});

			return symbol ? `${symbol} ${formatted}` : formatted;
		} catch (error) {
			throw new Error(`Price formatting failed: ${error}`);
		}
	}

	/**
	 * Convert price to bigint for contract calls
	 * Extracts the raw bigint value from dnum
	 */
	static toBigInt(price: Price): bigint {
		return price[0];
	}

	/**
	 * Get the decimal places of a price
	 */
	static getDecimals(price: Price): number {
		return price[1];
	}

	/**
	 * Convert between different decimal precisions
	 * Useful for token conversions (ETH to USDC, etc.)
	 */
	static convertDecimals(amount: Price, targetDecimals: number): Price {
		try {
			return from(amount, targetDecimals);
		} catch (error) {
			throw new Error(`Decimal conversion failed: ${error}`);
		}
	}

	/**
	 * Validate that a price is positive
	 */
	static isPositive(price: Price): boolean {
		return price[0] > 0n;
	}

	/**
	 * Validate that a price is zero or positive
	 */
	static isNonNegative(price: Price): boolean {
		return price[0] >= 0n;
	}

	/**
	 * Create a zero price with specified decimals
	 */
	static zero(decimals: number): Price {
		return from('0', decimals);
	}

	/**
	 * Add multiple prices together
	 */
	static sum(prices: Price[]): Price {
		if (prices.length === 0) {
			throw new Error('Cannot sum empty array of prices');
		}

		return prices.reduce((acc, price) => {
			try {
				return add(acc, price);
			} catch (error) {
				throw new Error(`Failed to sum prices: ${error}`);
			}
		});
	}
}
