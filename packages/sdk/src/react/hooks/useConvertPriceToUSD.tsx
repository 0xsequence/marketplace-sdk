import { queryOptions, useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	currencyKeys,
	getQueryClient,
} from '../_internal';
import { useConfig } from './useConfig';
import { currenciesOptions } from './useCurrencies';

const ChainIdCoerce = ChainIdSchema.transform((val) => val.toString());

const UseConvertPriceToUSDArgsSchema = z.object({
	chainId: ChainIdCoerce,
	currencyAddress: AddressSchema,
	amountRaw: z.string(),
	query: QueryArgSchema,
});

export type UseConvertPriceToUSDArgs = z.input<
	typeof UseConvertPriceToUSDArgsSchema
>;

export type UseConvertPriceToUSDReturn = {
	usdAmount: number;
	usdAmountFormatted: string;
};

export const convertPriceToUSD = async (
	args: UseConvertPriceToUSDArgs,
	config: SdkConfig,
): Promise<UseConvertPriceToUSDReturn> => {
	const parsedArgs = UseConvertPriceToUSDArgsSchema.parse(args);
	const queryClient = getQueryClient();
	const currencies = await queryClient.fetchQuery(
		currenciesOptions(
			{
				chainId: parsedArgs.chainId,
			},
			config,
		),
	);
	const currencyDetails = currencies.find(
		(c) =>
			c.contractAddress.toLowerCase() ===
			parsedArgs.currencyAddress.toLowerCase(),
	);

	if (!currencyDetails) {
		throw new Error('Currency not found');
	}

	const amountDecimal = Number(
		formatUnits(BigInt(parsedArgs.amountRaw), currencyDetails.decimals),
	);
	const usdAmount = amountDecimal * currencyDetails.exchangeRate;

	return {
		usdAmount,
		usdAmountFormatted: usdAmount.toFixed(2),
	};
};

export const convertPriceToUSDOptions = (
	args: UseConvertPriceToUSDArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [
			...currencyKeys.conversion,
			args.chainId,
			args.currencyAddress,
			args.amountRaw,
		],
		queryFn: () => convertPriceToUSD(args, config),
	});
};

/**
 * Hook to convert a price amount from a specific currency to USD
 * @returns The price amount in USD and formatted USD amount
 * @example
 * ```ts
 * const { data } = useConvertPriceToUSD({
 *   chainId: 1,
 *   currencyAddress: "0x0000000000000000000000000000000000000000",
 *   amountRaw: "1000000000000000000",
 * });
 *
 * console.log(data);
 * // { usdAmount: 1000, usdAmountFormatted: "1000.00" }
 * ```
 */
export const useConvertPriceToUSD = (args: UseConvertPriceToUSDArgs) => {
	const config = useConfig();
	return useQuery(convertPriceToUSDOptions(args, config));
};
