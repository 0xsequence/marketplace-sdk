import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import { currencyKeys, type QueryArg } from '../_internal';
import { useConfig } from './useConfig';
import { convertPriceToUSD } from './useConvertPriceToUSD';

export interface UseComparePricesArgs {
	chainId: number;
	// First price details
	priceAmountRaw: string;
	priceCurrencyAddress: Address;
	// Second price details (to compare against)
	compareToPriceAmountRaw: string;
	compareToPriceCurrencyAddress: Address;
	query: QueryArg;
}

export interface UseComparePricesReturn {
	percentageDifference: number;
	percentageDifferenceFormatted: string;
	status: 'above' | 'same' | 'below';
}

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
 * @param args - The arguments for the hook
 * @returns The percentage difference between the two prices
 * @example
 * ```ts
 * const { data } = useComparePrices({
 *   chainId: 1,
 *   priceAmountRaw: "1000000000000000000",
 *   priceCurrencyAddress: "0x0000000000000000000000000000000000000000",
 * });
 *
 * console.log(data);
 * // { percentageDifference: 10, percentageDifferenceFormatted: "10.00", isAbove: true, isSame: false, isBelow: false }
 * ```
 */
export const useComparePrices = (args: UseComparePricesArgs) => {
	const config = useConfig();
	return useQuery(comparePricesOptions(args, config));
};
