/**
 * Validation utilities for MakeOfferModal
 * Pure functions for validating offer form inputs
 *
 * All functions in this module are:
 * - Pure (no side effects)
 * - Testable without React
 * - Type-safe with dnum
 */

import { type Dnum, greaterThan } from 'dnum';
import { isPositive } from './dnum-utils';

export type FieldValidation = {
	isValid: boolean;
	error: string | null;
};

export type OfferValidation = {
	price: FieldValidation;
	quantity: FieldValidation;
	balance: FieldValidation;
	openseaCriteria?: FieldValidation;
};

/**
 * Validate offer form inputs
 * Pure function - no React hooks, fully testable
 *
 * @example
 * validateOfferForm({
 *   price: [1000000000000000000n, 18],
 *   quantity: [1n, 0],
 *   balance: [2000000000000000000n, 18],
 * })
 * // Returns: { price: { isValid: true, error: null }, quantity: { isValid: true, error: null }, ... }
 */
export function validateOfferForm({
	price,
	quantity,
	balance,
	lowestListing,
	orderbookKind,
}: {
	price: Dnum;
	quantity: Dnum;
	balance?: Dnum;
	lowestListing?: Dnum;
	orderbookKind?: string;
}): OfferValidation {
	const validation: OfferValidation = {
		price: { isValid: true, error: null },
		quantity: { isValid: true, error: null },
		balance: { isValid: true, error: null },
	};

	// Price validation
	if (!isPositive(price)) {
		validation.price = {
			isValid: false,
			error: 'Price must be greater than 0',
		};
	}

	// Quantity validation
	if (!isPositive(quantity)) {
		validation.quantity = {
			isValid: false,
			error: 'Quantity must be greater than 0',
		};
	}

	// Balance validation
	if (balance && greaterThan(price, balance)) {
		validation.balance = {
			isValid: false,
			error: 'Insufficient balance for this offer',
		};
	}

	// OpenSea specific validation
	if (orderbookKind === 'opensea' && lowestListing) {
		const meetsMinimum = greaterThan(price, lowestListing);
		validation.openseaCriteria = {
			isValid: meetsMinimum,
			error: meetsMinimum
				? null
				: 'Offer must be higher than lowest listing for OpenSea',
		};
	}

	return validation;
}

/**
 * Check if entire form is valid
 * Pure function - no React hooks, fully testable
 *
 * @example
 * const validation = validateOfferForm({ ... });
 * isFormValid(validation) // true or false
 */
export function isFormValid(validation: OfferValidation): boolean {
	return (
		validation.price.isValid &&
		validation.quantity.isValid &&
		validation.balance.isValid &&
		(validation.openseaCriteria?.isValid ?? true)
	);
}

/**
 * Get all validation errors as an array of error messages
 * Pure function - useful for displaying all errors at once
 *
 * @example
 * const errors = getValidationErrors(validation);
 * // Returns: ["Price must be greater than 0", "Insufficient balance"]
 */
export function getValidationErrors(validation: OfferValidation): string[] {
	const errors: string[] = [];

	if (validation.price.error) errors.push(validation.price.error);
	if (validation.quantity.error) errors.push(validation.quantity.error);
	if (validation.balance.error) errors.push(validation.balance.error);
	if (validation.openseaCriteria?.error)
		errors.push(validation.openseaCriteria.error);

	return errors;
}

/**
 * Get a single combined error message if form is invalid
 * Pure function - useful for displaying a single error state
 *
 * @example
 * getFirstValidationError(validation) // "Price must be greater than 0"
 */
export function getFirstValidationError(
	validation: OfferValidation,
): string | null {
	const errors = getValidationErrors(validation);
	return errors.length > 0 ? errors[0] : null;
}
