import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	currencyKeys,
} from '../_internal';
import { useConfig } from './useConfig';
import { convertPriceToUSD } from './useConvertPriceToUSD';
import { ChainId } from '@0xsequence/network';

const ChainIdCoerce = ChainIdSchema.transform((val) => val.toString());

const UseComparePricesArgsSchema: z.ZodObject<{
    chainId: z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>, string, string | number>;
    // First price details
    priceAmountRaw: z.ZodString;
    priceCurrencyAddress: z.ZodEffects<z.ZodString, Address, string>;
    // Second price details (to compare against)
    compareToPriceAmountRaw: z.ZodString;
    compareToPriceCurrencyAddress: z.ZodEffects<z.ZodString, Address, string>;
    query: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled?: boolean | undefined;
    }, {
        enabled?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	chainId: ChainIdCoerce,
	// First price details
	priceAmountRaw: z.string(),
	priceCurrencyAddress: AddressSchema,
	// Second price details (to compare against)
	compareToPriceAmountRaw: z.string(),
	compareToPriceCurrencyAddress: AddressSchema,
	query: QueryArgSchema,
});

type UseComparePricesArgs = z.input<typeof UseComparePricesArgsSchema>;

export type UseComparePricesReturn = {
	percentageDifference: number;
	percentageDifferenceFormatted: string;
	status: 'above' | 'same' | 'below';
};

const comparePrices = async (
	args: UseComparePricesArgs,
	config: SdkConfig,
): Promise<UseComparePricesReturn> => {
	const parsedArgs = UseComparePricesArgsSchema.parse(args);
	const [priceUSD, compareToPriceUSD] = await Promise.all([
		convertPriceToUSD(
			{
				chainId: parsedArgs.chainId,
				currencyAddress: parsedArgs.priceCurrencyAddress,
				amountRaw: parsedArgs.priceAmountRaw,
				query: {},
			},
			config,
		),
		convertPriceToUSD(
			{
				chainId: parsedArgs.chainId,
				currencyAddress: parsedArgs.compareToPriceCurrencyAddress,
				amountRaw: parsedArgs.compareToPriceAmountRaw,
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
): any => {
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
export const useComparePrices = (args: UseComparePricesArgs): DefinedQueryObserverResult<TData, TError> => {
	const config = useConfig();
	return useQuery(comparePricesOptions(args, config));
};
