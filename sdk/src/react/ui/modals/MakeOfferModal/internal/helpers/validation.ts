import { type Dnum, greaterThan } from 'dnum';
import { isPositive } from '../../../_internal/helpers/dnum-utils';

export type FieldValidation = {
	isValid: boolean;
	error: string | null;
};

export type OfferValidation = {
	price: FieldValidation;
	quantity: FieldValidation;
	balance: FieldValidation;
	openseaCriteria?: FieldValidation;
	openseaMinPrice?: FieldValidation;
};

export function validateOfferForm({
	price,
	quantity,
	balance,
	lowestListing,
	orderbookKind,
	usdAmount,
}: {
	price: Dnum;
	quantity: Dnum;
	balance?: Dnum;
	lowestListing?: Dnum;
	orderbookKind?: string;
	usdAmount?: number;
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

	// OpenSea minimum price validation ($0.01 USD)
	if (orderbookKind === 'opensea' && usdAmount !== undefined) {
		const meetsMinPrice = usdAmount >= 0.01;
		validation.openseaMinPrice = {
			isValid: meetsMinPrice,
			error: meetsMinPrice ? null : 'Lowest price must be at least $0.01',
		};
	}

	return validation;
}

export function isFormValid(validation: OfferValidation): boolean {
	return (
		validation.price.isValid &&
		validation.quantity.isValid &&
		validation.balance.isValid &&
		(validation.openseaCriteria?.isValid ?? true) &&
		(validation.openseaMinPrice?.isValid ?? true)
	);
}

export function getValidationErrors(validation: OfferValidation): string[] {
	const errors: string[] = [];

	if (validation.price.error) errors.push(validation.price.error);
	if (validation.quantity.error) errors.push(validation.quantity.error);
	if (validation.balance.error) errors.push(validation.balance.error);
	if (validation.openseaCriteria?.error)
		errors.push(validation.openseaCriteria.error);
	if (validation.openseaMinPrice?.error)
		errors.push(validation.openseaMinPrice.error);

	return errors;
}

export function getFirstValidationError(
	validation: OfferValidation,
): string | null {
	const errors = getValidationErrors(validation);
	return errors.length > 0 ? errors[0] : null;
}
