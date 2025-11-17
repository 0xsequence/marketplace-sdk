import { formatUnits } from 'viem';
import type { Currency } from '../../../../_internal';

export const OVERFLOW_PRICE = 100000000;
export const UNDERFLOW_PRICE = 0.0001;

export const formatPriceNumber = (
	amount: bigint,
	decimals: number,
): {
	formattedNumber: string;
	isUnderflow: boolean;
	isOverflow: boolean;
} => {
	const formattedPrice = formatUnits(amount, decimals);
	const numericPrice = Number.parseFloat(formattedPrice);

	if (numericPrice < UNDERFLOW_PRICE) {
		return {
			formattedNumber: UNDERFLOW_PRICE.toString(),
			isUnderflow: true,
			isOverflow: false,
		};
	}

	if (numericPrice > OVERFLOW_PRICE) {
		return {
			formattedNumber: OVERFLOW_PRICE.toLocaleString('en-US', {
				maximumFractionDigits: 2,
			}),
			isUnderflow: false,
			isOverflow: true,
		};
	}

	const maxDecimals = numericPrice < 0.01 ? 6 : 4;

	return {
		formattedNumber: numericPrice.toLocaleString('en-US', {
			minimumFractionDigits: 0,
			maximumFractionDigits: maxDecimals,
		}),
		isUnderflow: false,
		isOverflow: false,
	};
};

/**
 * Formatted price data structure
 */
export type FormattedPrice = {
	/** Price type determines the presentation style */
	type: 'free' | 'underflow' | 'overflow' | 'normal';
	/** Formatted display text (e.g., "0.0001", "100,000,000") */
	displayText: string;
	/** Currency symbol (e.g., "ETH", "USDC") */
	symbol: string;
};

/**
 * Formats price data into a structured object for presentation.
 * This pure data transformation function is easily testable and
 * separates business logic from UI concerns.
 *
 * @param amount - Raw amount bigint (in base units)
 * @param currency - Currency object with symbol and decimals
 * @returns FormattedPrice object for presentation layer
 *
 * @example
 * ```ts
 * const priceData = formatPriceData(1000000000000000000n, {
 *   symbol: 'ETH',
 *   decimals: 18
 * });
 * // Returns: { type: 'normal', displayText: '1', symbol: 'ETH' }
 * ```
 */
export function formatPriceData(
	amount: bigint,
	currency: Currency,
): FormattedPrice {
	const isFree = amount === 0n;

	if (isFree) {
		return { type: 'free', displayText: 'Free', symbol: '' };
	}

	const { formattedNumber, isUnderflow, isOverflow } = formatPriceNumber(
		amount,
		currency.decimals,
	);

	if (isUnderflow) {
		return {
			type: 'underflow',
			displayText: formattedNumber,
			symbol: currency.symbol,
		};
	}

	if (isOverflow) {
		return {
			type: 'overflow',
			displayText: formattedNumber,
			symbol: currency.symbol,
		};
	}

	return {
		type: 'normal',
		displayText: formattedNumber,
		symbol: currency.symbol,
	};
}
