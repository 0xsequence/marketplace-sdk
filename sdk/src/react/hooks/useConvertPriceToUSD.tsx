import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import { formatUnits } from 'viem';
import type { SdkConfig } from '../../types';
import { currencyKeys, getQueryClient } from '../_internal';
import { currenciesOptions } from '../queries/marketCurrencies';
import { useConfig } from './useConfig';

/**
 * Arguments for converting price to USD
 */
export interface UseConvertPriceToUSDArgs {
	/** The blockchain network ID (e.g., 1 for Ethereum mainnet, 137 for Polygon) */
	chainId: number;
	/** The contract address of the currency to convert from */
	currencyAddress: Address;
	/** Raw amount in smallest unit (wei) as a string */
	amountRaw: string;
	/** Query configuration options */
	query?: {
		/** Whether the query should be enabled/disabled */
		enabled?: boolean;
	};
}

/**
 * Return type for the useConvertPriceToUSD hook containing USD conversion data
 */
export type UseConvertPriceToUSDReturn = {
	/** The amount converted to USD as a number */
	usdAmount: number;
	/** The formatted USD amount as a string with 2 decimal places */
	usdAmountFormatted: string;
};

export const convertPriceToUSD = async (
	args: UseConvertPriceToUSDArgs,
	config: SdkConfig,
): Promise<UseConvertPriceToUSDReturn> => {
	const queryClient = getQueryClient();
	const currencies = await queryClient.fetchQuery(
		currenciesOptions(
			{
				chainId: args.chainId,
			},
			config,
		),
	);
	const currencyDetails = currencies.find(
		(c) =>
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
 *
 * Converts any cryptocurrency amount to USD using current exchange rates.
 * Useful for displaying prices in a common currency across different tokens.
 *
 * @param args - Configuration object containing currency and amount details
 * @returns React Query result with USD conversion data, loading state, and error handling
 *
 * @example
 * ```tsx
 * const { data: usdPrice, isLoading, error } = useConvertPriceToUSD({
 *   chainId: 137,
 *   currencyAddress: "0x...", // USDC address
 *   amountRaw: "1000000000000000000", // 1 token in wei
 * });
 *
 * if (isLoading) return <div>Converting to USD...</div>;
 * if (error) return <div>Error converting price</div>;
 *
 * return (
 *   <div>
 *     <p>Price: ${usdPrice?.usdAmountFormatted}</p>
 *     <p>Exact: ${usdPrice?.usdAmount}</p>
 *   </div>
 * );
 * ```
 */
export const useConvertPriceToUSD = (args: UseConvertPriceToUSDArgs) => {
	const config = useConfig();
	return useQuery(convertPriceToUSDOptions(args, config));
};
