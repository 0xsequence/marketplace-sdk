import { type Dnum, from } from 'dnum';
import type { Currency } from '../types';

/**
 * Result of a validation operation
 */
export interface ValidationResult {
	isValid: boolean;
	error?: string;
	parsed?: Dnum;
	normalizedValue?: string;
}

/**
 * Options for price validation
 */
export interface PriceValidationOptions {
	/** Maximum allowed decimal places */
	maxDecimals?: number;
	/** Minimum allowed value */
	minValue?: string;
	/** Maximum allowed value */
	maxValue?: string;
	/** Currency context for validation */
	currency?: Currency;
	/** Whether to allow zero values */
	allowZero?: boolean;
}

/**
 * Options for quantity validation
 */
export interface QuantityValidationOptions {
	/** Maximum allowed quantity */
	maxQuantity?: number;
	/** Minimum allowed quantity */
	minQuantity?: number;
	/** Whether quantity must be a whole number */
	requireInteger?: boolean;
	/** Maximum decimal places for fractional quantities */
	maxDecimals?: number;
}

/**
 * Helper to format dnum for error messages
 * @param amount - Amount as dnum
 * @param symbol - Currency symbol
 * @returns Formatted string
 */
function formatDnum(amount: Dnum, symbol: string): string {
	const divisor = 10n ** BigInt(amount[1]);
	const wholePart = amount[0] / divisor;
	const fractionalPart = amount[0] % divisor;

	if (fractionalPart === 0n) {
		return `${wholePart} ${symbol}`;
	}

	const fractionalStr = fractionalPart.toString().padStart(amount[1], '0');
	const trimmedFractional = fractionalStr.replace(/0+$/, '');

	return `${wholePart}.${trimmedFractional} ${symbol}`;
}

/**
 * Validate a price input string and convert to dnum
 * @param input - Raw price input from user
 * @param options - Validation options
 * @returns Validation result with parsed dnum if valid
 */
export function validatePriceInput(
	input: string,
	options: PriceValidationOptions = {},
): ValidationResult {
	const {
		maxDecimals = 18,
		minValue = '0',
		maxValue,
		currency,
		allowZero = false,
	} = options;

	// Basic input validation
	if (!input || typeof input !== 'string') {
		return {
			isValid: false,
			error: 'Price input is required',
		};
	}

	// Trim whitespace
	const trimmed = input.trim();
	if (!trimmed) {
		return {
			isValid: false,
			error: 'Price input cannot be empty',
		};
	}

	// Check for invalid characters
	if (!/^[\d.,]+$/.test(trimmed)) {
		return {
			isValid: false,
			error: 'Price can only contain numbers, dots, and commas',
		};
	}

	// Normalize decimal separator (handle both . and ,)
	const normalized = trimmed.replace(',', '.');

	// Check for multiple decimal points
	const decimalCount = (normalized.match(/\./g) || []).length;
	if (decimalCount > 1) {
		return {
			isValid: false,
			error: 'Price cannot contain multiple decimal points',
		};
	}

	// Check decimal places
	const decimalPart = normalized.split('.')[1];
	if (decimalPart && decimalPart.length > maxDecimals) {
		return {
			isValid: false,
			error: `Price cannot have more than ${maxDecimals} decimal places`,
		};
	}

	try {
		// Parse with dnum
		const decimals = currency?.decimals ?? maxDecimals;
		const parsed = from(normalized, decimals);

		// Check for zero
		if (parsed[0] === 0n && !allowZero) {
			return {
				isValid: false,
				error: 'Price must be greater than zero',
			};
		}

		// Check minimum value
		if (minValue !== '0') {
			const minDnum = from(minValue, decimals);
			if (parsed[0] < minDnum[0]) {
				return {
					isValid: false,
					error: `Price must be at least ${minValue}${currency ? ` ${currency.symbol}` : ''}`,
				};
			}
		}

		// Check maximum value
		if (maxValue) {
			const maxDnum = from(maxValue, decimals);
			if (parsed[0] > maxDnum[0]) {
				return {
					isValid: false,
					error: `Price cannot exceed ${maxValue}${currency ? ` ${currency.symbol}` : ''}`,
				};
			}
		}

		return {
			isValid: true,
			parsed,
			normalizedValue: normalized,
		};
	} catch (error) {
		return {
			isValid: false,
			error: `Invalid price format: ${error instanceof Error ? error.message : 'Unknown error'}`,
		};
	}
}

/**
 * Validate quantity input for NFT purchases
 * @param quantity - Quantity value (number or string)
 * @param options - Validation options
 * @returns Validation result
 */
export function validateQuantity(
	quantity: number | string,
	options: QuantityValidationOptions = {},
): ValidationResult {
	const {
		maxQuantity = Number.MAX_SAFE_INTEGER,
		minQuantity = 1,
		requireInteger = true,
		maxDecimals = 0,
	} = options;

	// Convert to number if string
	let numQuantity: number;
	if (typeof quantity === 'string') {
		numQuantity = Number.parseFloat(quantity);
	} else {
		numQuantity = quantity;
	}

	// Check for valid number
	if (!Number.isFinite(numQuantity)) {
		return {
			isValid: false,
			error: 'Quantity must be a valid number',
		};
	}

	// Check for negative values
	if (numQuantity < 0) {
		return {
			isValid: false,
			error: 'Quantity cannot be negative',
		};
	}

	// Check minimum quantity
	if (numQuantity < minQuantity) {
		return {
			isValid: false,
			error: `Quantity must be at least ${minQuantity}`,
		};
	}

	// Check maximum quantity
	if (numQuantity > maxQuantity) {
		return {
			isValid: false,
			error: `Quantity cannot exceed ${maxQuantity}`,
		};
	}

	// Check for integer requirement
	if (requireInteger && !Number.isInteger(numQuantity)) {
		return {
			isValid: false,
			error: 'Quantity must be a whole number',
		};
	}

	// Check decimal places for fractional quantities
	if (!requireInteger && maxDecimals > 0) {
		const decimalPart = numQuantity.toString().split('.')[1];
		if (decimalPart && decimalPart.length > maxDecimals) {
			return {
				isValid: false,
				error: `Quantity cannot have more than ${maxDecimals} decimal places`,
			};
		}
	}

	return {
		isValid: true,
		normalizedValue: numQuantity.toString(),
	};
}

/**
 * Validate that user has sufficient balance for a purchase
 * @param totalPrice - Total price as dnum
 * @param userBalance - User's balance as dnum
 * @param currency - Currency being used
 * @returns Validation result
 */
export function validateSufficientBalance(
	totalPrice: Dnum,
	userBalance: Dnum,
	currency: Currency,
): ValidationResult {
	// Ensure both amounts have same decimal precision
	const priceDecimals = totalPrice[1];
	const balanceDecimals = userBalance[1];

	let normalizedBalance = userBalance;
	let normalizedPrice = totalPrice;

	if (priceDecimals !== balanceDecimals) {
		const maxDecimals = Math.max(priceDecimals, balanceDecimals);

		// Normalize to same decimals
		if (priceDecimals < maxDecimals) {
			const multiplier = 10n ** BigInt(maxDecimals - priceDecimals);
			normalizedPrice = [totalPrice[0] * multiplier, maxDecimals];
		}

		if (balanceDecimals < maxDecimals) {
			const multiplier = 10n ** BigInt(maxDecimals - balanceDecimals);
			normalizedBalance = [userBalance[0] * multiplier, maxDecimals];
		}
	}

	if (normalizedBalance[0] < normalizedPrice[0]) {
		return {
			isValid: false,
			error: `Insufficient ${currency.symbol} balance. Required: ${formatDnum(normalizedPrice, currency.symbol)}, Available: ${formatDnum(normalizedBalance, currency.symbol)}`,
		};
	}

	return {
		isValid: true,
	};
}

/**
 * Validate price range for listings and offers
 * @param price - Price to validate as dnum
 * @param floorPrice - Optional floor price as dnum
 * @param ceilPrice - Optional ceiling price as dnum
 * @param currency - Currency context
 * @returns Validation result
 */
export function validatePriceRange(
	price: Dnum,
	floorPrice: Dnum | null,
	ceilPrice: Dnum | null,
	currency: Currency,
): ValidationResult {
	if (floorPrice && price[0] < floorPrice[0]) {
		return {
			isValid: false,
			error: `Price is below floor price of ${formatDnum(floorPrice, currency.symbol)}`,
		};
	}

	if (ceilPrice && price[0] > ceilPrice[0]) {
		return {
			isValid: false,
			error: `Price exceeds ceiling price of ${formatDnum(ceilPrice, currency.symbol)}`,
		};
	}

	return {
		isValid: true,
	};
}

/**
 * Validate expiration date for listings and offers
 * @param expirationDate - Date when listing/offer expires
 * @param minDurationMinutes - Minimum duration in minutes from now
 * @param maxDurationDays - Maximum duration in days from now
 * @returns Validation result
 */
export function validateExpirationDate(
	expirationDate: Date,
	minDurationMinutes = 5,
	maxDurationDays = 365,
): ValidationResult {
	const now = new Date();
	const minDate = new Date(now.getTime() + minDurationMinutes * 60 * 1000);
	const maxDate = new Date(
		now.getTime() + maxDurationDays * 24 * 60 * 60 * 1000,
	);

	if (expirationDate < minDate) {
		return {
			isValid: false,
			error: `Expiration must be at least ${minDurationMinutes} minutes from now`,
		};
	}

	if (expirationDate > maxDate) {
		return {
			isValid: false,
			error: `Expiration cannot be more than ${maxDurationDays} days from now`,
		};
	}

	return {
		isValid: true,
	};
}

/**
 * Batch validate multiple inputs at once
 * @param validations - Array of validation functions to run
 * @returns Combined validation result
 */
export function validateBatch(
	validations: Array<() => ValidationResult>,
): ValidationResult & { errors: string[] } {
	const errors: string[] = [];

	for (const validate of validations) {
		const result = validate();
		if (!result.isValid && result.error) {
			errors.push(result.error);
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
		error: errors.length > 0 ? errors[0] : undefined,
	};
}
