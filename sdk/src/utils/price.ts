import * as dn from 'dnum';
import { formatUnits } from 'viem';

type CalculatePriceDifferencePercentageArgs = {
	inputPriceRaw: bigint;
	basePriceRaw: bigint;
	decimals: number;
};

/**
 * Calculates the percentage difference between two prices
 * @param args - Object containing input price, base price, and decimals
 * @returns The percentage difference as a string with 2 decimal places
 * @example
 * ```ts
 * const diff = calculatePriceDifferencePercentage({
 *   inputPriceRaw: 1000000n,
 *   basePriceRaw: 900000n,
 *   decimals: 6
 * }); // Returns "11.11"
 * ```
 */
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

/**
 * Formats a raw price amount with the specified number of decimal places
 * @param amount - The raw price amount as a bigint
 * @param decimals - Number of decimal places to format to
 * @returns Formatted price string with proper decimal and thousands separators
 * @example
 * ```ts
 * const formatted = formatPrice(1000000n, 6); // Returns "1.000000"
 * ```
 */
export const formatPrice = (amount: bigint, decimals: number): string => {
	const formattedUnits = Number(formatUnits(amount, decimals));
	return formattedUnits.toLocaleString('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: decimals,
	});
};

/**
 * Calculates the final earnings amount after applying multiple fee percentages
 * @param amount - The raw amount as a bigint (e.g., from a blockchain transaction)
 * @param decimals - The number of decimal places for the currency (e.g., 18 for ETH, 6 for USDC)
 * @param fees - Array of fee percentages to apply (e.g., [2.5, 1.0] for 2.5% and 1% fees)
 * @returns Formatted string representing the final earnings after all fees are applied
 * @throws Will return '0' if there's an error in calculation
 * @example
 * ```ts
 * const earnings = calculateEarningsAfterFees(
 *   1000000000000000000n, // 1 ETH
 *   18,                   // ETH decimals
 *   [2.5, 1.0]           // 2.5% and 1% fees
 * ); // Returns "0.96525" (1 ETH after 2.5% and 1% fees)
 * ```
 */
export const calculateEarningsAfterFees = (
	amount: bigint,
	decimals: number,
	fees: number[],
): string => {
	try {
		// formatUnits already returns a string, no need for Number conversion
		const decimalAmount = formatUnits(amount, decimals);
		let earnings = dn.from(decimalAmount, decimals);

		for (const fee of fees) {
			if (fee > 0) {
				// dnum accepts numbers directly via Numberish type
				const feeMultiplier = dn.from(1 - fee / 100, decimals);
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

/**
 * Formats a price amount with fee applied
 * @param amount - The raw price amount as a bigint
 * @param decimals - Number of decimal places for the currency
 * @param feePercentage - Fee percentage to apply (e.g., 3.5 for 3.5%)
 * @returns Formatted price string with fee applied and proper decimal/thousands separators
 * @example
 * ```ts
 * const priceWithFee = formatPriceWithFee(1000000n, 6, 3.5); // Returns "1.035"
 * ```
 */
export const formatPriceWithFee = (
	amount: bigint,
	decimals: number,
	feePercentage: number,
): string => {
	try {
		// formatUnits already returns a string, no need for Number conversion
		const decimalAmount = formatUnits(amount, decimals);
		const price = dn.from(decimalAmount, decimals);
		// dnum accepts numbers directly via Numberish type
		const feeMultiplier = dn.from(1 + feePercentage / 100, decimals);
		const totalPrice = dn.multiply(price, feeMultiplier);

		return dn.format(totalPrice, {
			digits: decimals,
			trailingZeros: false,
			locale: 'en-US',
		});
	} catch (error) {
		console.error('Error formatting price with fee:', error);
		return '0';
	}
};

export const calculateTotalOfferCost = (
	offerAmountRaw: bigint,
	decimals: number,
	royaltyPercentage = 0,
): bigint => {
	try {
		const dnumAmount = [offerAmountRaw, decimals] as dn.Dnum;
		let totalCost = dn.from(dnumAmount);

		if (royaltyPercentage > 0) {
			// dnum accepts numbers directly via Numberish type
			const royaltyFee = dn.multiply(
				totalCost,
				dn.from(royaltyPercentage / 100, decimals),
			);
			totalCost = dn.add(totalCost, royaltyFee);
		}

		const totalCostString = dn.format(totalCost, {
			digits: decimals,
			trailingZeros: true,
		});

		const cleanAmount = totalCostString.replace(/,/g, '');

		return BigInt(Math.round(Number(cleanAmount) * 10 ** decimals));
	} catch (error) {
		console.error('Error calculating total offer cost:', error);
		return offerAmountRaw;
	}
};

/**
 * Validates if a price value meets OpenSea's decimal constraints for offers
 * OpenSea allows maximum 4 decimal places for offers and minimum 0.0001
 * @param value - The price value as a string
 * @returns Object containing validation result and error message
 * @example
 * ```ts
 * const result = validateOpenseaOfferDecimals('0.12345');
 * // Returns { isValid: false, errorMessage: "Offer amount must be at least 0.0001" }
 * ```
 */
export const validateOpenseaOfferDecimals = (
	value: string,
): { isValid: boolean; errorMessage?: string } => {
	if (!value || value === '0') return { isValid: true };

	const [_, decimals = ''] = value.split('.');
	if (decimals.length > 4) {
		return {
			isValid: false,
			errorMessage: 'Offer amount must be at least 0.0001',
		};
	}

	return { isValid: true };
};
