import { add } from 'dnum';
import { useMemo } from 'react';
import { BuyModalErrorFactory } from '../../../../../types/buyModalErrors';
import type {
	FeeBreakdown,
	FeeConfig,
	PriceCalculationProps,
	PriceCalculationResult,
} from '../../../../../types/priceTypes';
import { type Price, PriceManager } from '../../../../../utils/priceManager';

/**
 * Hook for comprehensive price calculations using dnum
 * Handles item pricing, fees, totals, and validation with overflow protection
 */
export const usePriceCalculation = ({
	unitPrice,
	quantity,
	decimals,
	fees = [],
}: PriceCalculationProps): PriceCalculationResult => {
	return useMemo(() => {
		try {
			// Input validation
			if (!unitPrice || quantity <= 0 || decimals < 0) {
				throw new Error('Invalid price calculation inputs');
			}

			// Calculate subtotal with dnum for overflow protection
			const subtotal = PriceManager.calculateItemTotal(
				unitPrice,
				quantity,
				decimals,
			);

			// Calculate individual fees and create breakdown
			const feeBreakdown: FeeBreakdown[] = [];
			let totalFees = PriceManager.zero(decimals);

			for (const fee of fees) {
				try {
					const feeAmount = PriceManager.calculateFees(
						subtotal,
						fee.percentage,
					);
					totalFees = add(totalFees, feeAmount);

					feeBreakdown.push({
						type: fee.type,
						name: fee.name || fee.type,
						percentage: fee.percentage,
						amount: feeAmount,
						formatted: PriceManager.formatForDisplay(feeAmount),
					});
				} catch (error) {
					throw new Error(`Fee calculation failed for ${fee.type}: ${error}`);
				}
			}

			// Calculate grand total
			const grandTotal = PriceManager.calculateGrandTotal(subtotal, totalFees);

			// Validation
			const isValid = PriceManager.isPositive(grandTotal);
			if (!isValid) {
				throw new Error('Calculated price is not positive');
			}

			// Format for display
			const display = {
				subtotal: PriceManager.formatForDisplay(subtotal),
				fees: PriceManager.formatForDisplay(totalFees),
				grandTotal: PriceManager.formatForDisplay(grandTotal),
			};

			// Extract bigint value for contract calls
			const contractValue = PriceManager.toBigInt(grandTotal);

			return {
				subtotal,
				fees: totalFees,
				grandTotal,
				display,
				isValid,
				contractValue,
				breakdown: feeBreakdown,
			};
		} catch (error) {
			// Convert to structured error for better debugging
			throw BuyModalErrorFactory.priceCalculation(
				'usePriceCalculation',
				[unitPrice, quantity.toString(), decimals.toString()],
				error instanceof Error ? error.message : 'Unknown calculation error',
			);
		}
	}, [unitPrice, quantity, decimals, fees]);
};

/**
 * Hook for simple price calculations without fees
 */
export const useSimplePriceCalculation = (
	unitPrice: string,
	quantity: number,
	decimals: number,
) => {
	return usePriceCalculation({
		unitPrice,
		quantity,
		decimals,
		fees: [],
	});
};

/**
 * Hook for marketplace price calculations with standard fees
 */
export const useMarketplacePriceCalculation = ({
	unitPrice,
	quantity,
	decimals,
	platformFeePercentage = 0,
	royaltyPercentage = 0,
}: {
	unitPrice: string;
	quantity: number;
	decimals: number;
	platformFeePercentage?: number;
	royaltyPercentage?: number;
}) => {
	const fees: FeeConfig[] = [];

	if (platformFeePercentage > 0) {
		fees.push({
			type: 'platform',
			percentage: platformFeePercentage,
			name: 'Platform Fee',
			description: 'Marketplace platform fee',
		});
	}

	if (royaltyPercentage > 0) {
		fees.push({
			type: 'royalty',
			percentage: royaltyPercentage,
			name: 'Creator Royalty',
			description: 'Royalty paid to creator',
		});
	}

	return usePriceCalculation({
		unitPrice,
		quantity,
		decimals,
		fees,
	});
};

/**
 * Hook for price validation without full calculation
 */
export const usePriceValidation = (
	unitPrice: string,
	quantity: number,
	decimals: number,
) => {
	return useMemo(() => {
		try {
			// Validate inputs
			if (!unitPrice || unitPrice === '0') {
				return {
					isValid: false,
					error: 'Price is required and must be greater than zero',
				};
			}

			if (quantity <= 0) {
				return {
					isValid: false,
					error: 'Quantity must be greater than zero',
				};
			}

			if (decimals < 0 || decimals > 30) {
				return {
					isValid: false,
					error: 'Invalid decimal precision',
				};
			}

			// Try to parse with dnum
			const price = PriceManager.fromString(unitPrice, decimals);

			if (!PriceManager.isPositive(price)) {
				return {
					isValid: false,
					error: 'Price must be positive',
				};
			}

			return {
				isValid: true,
				parsed: price,
			};
		} catch (error) {
			return {
				isValid: false,
				error: error instanceof Error ? error.message : 'Invalid price format',
			};
		}
	}, [unitPrice, quantity, decimals]);
};

/**
 * Hook for comparing two prices
 */
export const usePriceComparison = (priceA: Price, priceB: Price) => {
	return useMemo(() => {
		try {
			const isHigher = PriceManager.isGreaterThan(priceA, priceB);
			const isLower = PriceManager.isGreaterThan(priceB, priceA);
			const isEqual = PriceManager.isEqual(priceA, priceB);

			// Calculate difference and percentage
			const difference = isHigher
				? PriceManager.subtract(priceA, priceB)
				: PriceManager.subtract(priceB, priceA);

			// Calculate percentage change (difference / priceB * 100)
			let percentageChange = 0;
			if (PriceManager.isPositive(priceB)) {
				const multiplied = PriceManager.multiply(difference, 100);
				const divided = PriceManager.divide(
					multiplied,
					Number(PriceManager.toBigInt(priceB)),
				);
				percentageChange = Number(PriceManager.toBigInt(divided));
			}

			return {
				difference,
				percentage: percentageChange,
				isHigher,
				isLower,
				isEqual,
			};
		} catch (error) {
			throw BuyModalErrorFactory.priceCalculation(
				'usePriceComparison',
				['price comparison'],
				error instanceof Error ? error.message : 'Price comparison failed',
			);
		}
	}, [priceA, priceB]);
};
