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
