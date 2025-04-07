import * as dn from 'dnum';
import { formatUnits } from 'viem';

type CalculatePriceDifferencePercentageArgs = {
	inputPriceRaw: bigint;
	basePriceRaw: bigint;
	decimals: number;
};

export const calculatePriceDifferencePercentage = ({
	inputPriceRaw,
	basePriceRaw,
	decimals,
}: CalculatePriceDifferencePercentageArgs) => {
	const inputPrice = Number(formatUnits(inputPriceRaw, decimals));
	const basePrice = Number(formatUnits(basePriceRaw, decimals));
	const difference = inputPrice - basePrice;
	const percentageDifference = (difference / basePrice) * 100;

	return percentageDifference.toFixed(2);
};

export const formatPrice = (amount: bigint, decimals: number): string => {
	const formattedUnits = Number(formatUnits(amount, decimals));
	return formattedUnits.toLocaleString('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: decimals,
	});
};

export const calculateEarningsAfterFees = (
	amount: bigint,
	decimals: number,
	fees: number[],
): string => {
	try {
		const decimalAmount = Number(formatUnits(amount, decimals));
		let earnings = dn.from(decimalAmount.toString(), decimals);

		for (const fee of fees) {
			if (fee > 0) {
				const feeMultiplier = dn.from((1 - fee / 100).toString(), decimals);
				earnings = dn.multiply(earnings, feeMultiplier);
			}
		}

		return dn.format(earnings, {
			digits: decimals,
			trailingZeros: false,
			locale: 'en-US',
		});
	} catch (error) {
		console.error('Error calculating earnings after fees:', error);
		return '0';
	}
};
