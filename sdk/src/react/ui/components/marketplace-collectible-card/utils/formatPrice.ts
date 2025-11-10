import { fromBigIntString, toNumber } from '../../../../../utils';

export const OVERFLOW_PRICE = 100000000;
export const UNDERFLOW_PRICE = 0.0001;

export const formatPriceNumber = (
	amount: string,
	decimals: number,
): {
	formattedNumber: string;
	isUnderflow: boolean;
	isOverflow: boolean;
} => {
	const dnum = fromBigIntString(amount, decimals);
	const numericPrice = toNumber(dnum);

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
