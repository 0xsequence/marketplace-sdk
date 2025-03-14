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
