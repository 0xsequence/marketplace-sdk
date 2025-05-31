import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import { currencyKeys } from '../_internal';
import { useConfig } from './useConfig';
import { convertPriceToUSD } from './useConvertPriceToUSD';

/**
 * Arguments for comparing prices between different currencies
 */
export interface UseComparePricesArgs {
	/** The blockchain network ID (e.g., 1 for Ethereum mainnet, 137 for Polygon) */
	chainId: number;
	/** Raw amount of the first price (in wei/smallest unit) */
	priceAmountRaw: string;
	/** Currency contract address for the first price */
	priceCurrencyAddress: Address;
	/** Raw amount of the second price to compare against (in wei/smallest unit) */
	compareToPriceAmountRaw: string;
	/** Currency contract address for the second price */
	compareToPriceCurrencyAddress: Address;
	/** Query configuration options */
	query?: {
		/** Whether the query should be enabled/disabled */
		enabled?: boolean;
	};
}

/**
 * Return type for the useComparePrices hook containing price comparison data
 */
export type UseComparePricesReturn = {
	/** Raw percentage difference between the prices */
	percentageDifference: number;
	/** Formatted percentage difference as a string */
	percentageDifferenceFormatted: string;
	/** Status indicating if the first price is above, same, or below the second */
	status: 'above' | 'same' | 'below';
};

const comparePrices = async (
	args: UseComparePricesArgs,
	config: SdkConfig,
): Promise<UseComparePricesReturn> => {
	const [priceUSD, compareToPriceUSD] = await Promise.all([
		convertPriceToUSD(
			{
				chainId: args.chainId,
				currencyAddress: args.priceCurrencyAddress,
				amountRaw: args.priceAmountRaw,
				query: {},
			},
			config,
		),
		convertPriceToUSD(
			{
				chainId: args.chainId,
				currencyAddress: args.compareToPriceCurrencyAddress,
				amountRaw: args.compareToPriceAmountRaw,
				query: {},
			},
			config,
		),
	]);
	const difference = priceUSD.usdAmount - compareToPriceUSD.usdAmount;

	if (compareToPriceUSD.usdAmount === 0) {
		throw new Error('Cannot compare to zero price');
	}

	const percentageDifference = (difference / compareToPriceUSD.usdAmount) * 100;
	const isAbove = percentageDifference > 0;
	const isSame = percentageDifference === 0;

	return {
		percentageDifference,
		percentageDifferenceFormatted: Math.abs(percentageDifference).toFixed(2),
		status: isAbove ? 'above' : isSame ? 'same' : 'below',
	};
};

export const comparePricesOptions = (
	args: UseComparePricesArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...currencyKeys.conversion, 'compare', args],
		queryFn: () => comparePrices(args, config),
	});
};

/**
 * Hook to compare prices between different currencies by converting both to USD
 *
 * Converts two prices in potentially different currencies to USD and calculates
 * the percentage difference, useful for comparing offers, listings, or floor prices.
 *
 * @param args - Configuration object containing both prices and their currencies
 * @returns React Query result with price comparison data, loading state, and error handling
 *
 * @example
 * ```tsx
 * const { data: comparison, isLoading, error } = useComparePrices({
 *   chainId: 137,
 *   priceAmountRaw: "1000000000000000000", // 1 ETH
 *   priceCurrencyAddress: "0x...", // ETH address
 *   compareToPriceAmountRaw: "2000000000", // 2000 USDC
 *   compareToPriceCurrencyAddress: "0x..." // USDC address
 * });
 *
 * if (isLoading) return <div>Comparing prices...</div>;
 * if (error) return <div>Error comparing prices</div>;
 *
 * return (
 *   <div>
 *     <p>Price is {comparison?.percentageDifferenceFormatted}% {comparison?.status} the comparison</p>
 *     <p>Status: {comparison?.status}</p>
 *   </div>
 * );
 * ```
 */
export const useComparePrices = (args: UseComparePricesArgs) => {
	const config = useConfig();
	return useQuery(comparePricesOptions(args, config));
};
