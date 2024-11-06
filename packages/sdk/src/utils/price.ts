export const calculatePriceDifferencePercentage = (
	inputPrice: number,
	basePrice: number,
) => {
	const difference = basePrice - inputPrice;
	const percentageDifference = (difference / basePrice) * 100;

	return Math.abs(percentageDifference).toFixed(2);
};
