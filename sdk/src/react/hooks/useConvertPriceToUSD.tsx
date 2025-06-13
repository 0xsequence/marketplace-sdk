import { queryOptions, useQuery } from '@tanstack/react-query';
import { type Address, formatUnits } from 'viem';
import type { SdkConfig } from '../../types';
import { type Currency, currencyKeys, getQueryClient } from '../_internal';
import { marketCurrenciesQueryOptions } from '../queries/marketCurrencies';
import { useConfig } from './useConfig';

export interface UseConvertPriceToUSDArgs {
	chainId: number;
	currencyAddress: Address;
	amountRaw: string;
	query?: {
		enabled?: boolean;
	};
}

export type UseConvertPriceToUSDReturn = {
	usdAmount: number;
	usdAmountFormatted: string;
};

export const convertPriceToUSD = async (
	args: UseConvertPriceToUSDArgs,
	config: SdkConfig,
): Promise<UseConvertPriceToUSDReturn> => {
	const queryClient = getQueryClient();
	const currencies = (await queryClient.fetchQuery(
		marketCurrenciesQueryOptions({
			chainId: args.chainId,
			config,
		}),
	)) as Currency[];
	const currencyDetails = currencies.find(
		(c: Currency) =>
			c.contractAddress.toLowerCase() === args.currencyAddress.toLowerCase(),
	);

	if (!currencyDetails) {
		throw new Error('Currency not found');
	}

	const amountDecimal = Number(
		formatUnits(BigInt(args.amountRaw), currencyDetails.decimals),
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
		queryKey: [...currencyKeys.conversion, args],
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
