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
	const difference = Number(
		formatUnits(inputPriceRaw - basePriceRaw, decimals),
	);
	const basePrice = Number(formatUnits(basePriceRaw, decimals));
	const percentageDifference = (difference / basePrice) * 100;

	return Math.abs(percentageDifference).toFixed(2);
};
