import { type Dnum, greaterThan } from 'dnum';
import { isPositive } from '../../../_internal/helpers/dnum-utils';

export type FieldValidation = {
	isValid: boolean;
	error: string | null;
};

export type ListingValidation = {
	price: FieldValidation;
	quantity: FieldValidation;
	balance?: FieldValidation;
};

export function validateListingForm({
	price,
	quantity,
	balance,
}: {
	price: Dnum;
	quantity: Dnum;
	balance?: Dnum;
}): ListingValidation {
	const validation: ListingValidation = {
		price: { isValid: true, error: null },
		quantity: { isValid: true, error: null },
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

	// Balance validation (for ERC1155)
	if (balance && greaterThan(quantity, balance)) {
		validation.balance = {
			isValid: false,
			error: 'Insufficient balance for this quantity',
		};
	}

	return validation;
}

export function isFormValid(validation: ListingValidation): boolean {
	return (
		validation.price.isValid &&
		validation.quantity.isValid &&
		(validation.balance?.isValid ?? true)
	);
}

export function getValidationErrors(validation: ListingValidation): string[] {
	const errors: string[] = [];

	if (validation.price.error) errors.push(validation.price.error);
	if (validation.quantity.error) errors.push(validation.quantity.error);
	if (validation.balance?.error) errors.push(validation.balance.error);

	return errors;
}

export function getFirstValidationError(
	validation: ListingValidation,
): string | null {
	const errors = getValidationErrors(validation);
	return errors.length > 0 ? errors[0] : null;
}
