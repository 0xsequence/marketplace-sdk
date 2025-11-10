import type { Dnum } from 'dnum';
import type { Currency } from '../../../../../_internal';
import { greaterThan, isPositive, isZero } from './dnum-utils';

export type FieldValidation = {
	isValid: boolean;
	error: string | null;
};

export type FormValidation = {
	price: FieldValidation;
	quantity: FieldValidation;
	currency: FieldValidation;
	expiry: FieldValidation;
};

/**
 * Validate listing form fields
 * Pure function - no React hooks, fully testable
 *
 * Now uses dnum for safe decimal comparisons without precision loss
 */
export function validateListingForm(params: {
	price: Dnum;
	quantity: Dnum;
	selectedCurrency: Currency | null;
	expiryDate: Date;
	balance?: Dnum;
}): FormValidation {
	// Price validation - must be > 0
	const priceValidation: FieldValidation = {
		isValid: isPositive(params.price),
		error:
			isZero(params.price) || !isPositive(params.price)
				? 'Enter a price greater than 0'
				: null,
	};

	// Quantity validation - must be > 0 and <= balance
	const quantityValidation: FieldValidation = (() => {
		if (isZero(params.quantity) || !isPositive(params.quantity)) {
			return {
				isValid: false,
				error: 'Enter a quantity greater than 0',
			};
		}

		// Check balance if provided - quantity must not exceed balance
		if (params.balance) {
			try {
				if (greaterThan(params.quantity, params.balance)) {
					return {
						isValid: false,
						error: 'Insufficient balance',
					};
				}
			} catch {
				return {
					isValid: false,
					error: 'Invalid quantity format',
				};
			}
		}

		return {
			isValid: true,
			error: null,
		};
	})();

	// Currency validation
	const currencyValidation: FieldValidation = {
		isValid: !!params.selectedCurrency?.contractAddress,
		error: !params.selectedCurrency?.contractAddress
			? 'Select a currency'
			: null,
	};

	// Expiry validation
	const expiryValidation: FieldValidation = {
		isValid: params.expiryDate > new Date(),
		error:
			params.expiryDate <= new Date() ? 'Expiry must be in the future' : null,
	};

	return {
		price: priceValidation,
		quantity: quantityValidation,
		currency: currencyValidation,
		expiry: expiryValidation,
	};
}

/**
 * Check if entire form is valid
 * Pure function - no React hooks, fully testable
 */
export function isFormValid(validation: FormValidation): boolean {
	return Object.values(validation).every((v) => v.isValid);
}

/**
 * Get validation errors as a map
 * Pure function - no React hooks, fully testable
 */
export function getValidationErrors(
	validation: FormValidation,
): Record<string, string | null> {
	return Object.entries(validation).reduce(
		(acc, [key, val]) => ({
			...acc,
			[key]: val.error,
		}),
		{},
	);
}
