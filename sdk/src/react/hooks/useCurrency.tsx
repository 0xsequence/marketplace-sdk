import { queryOptions, skipToken, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import {
	type Currency,
	currencyKeys,
	getMarketplaceClient,
	getQueryClient,
} from '../_internal';
import { useConfig } from './useConfig';

/**
 * Arguments for fetching currency information
 */
export interface UseCurrencyArgs {
	/** The blockchain network ID (e.g., 1 for Ethereum mainnet, 137 for Polygon) */
	chainId: number;
	/** The contract address of the currency/token. Optional - if not provided, query will be skipped */
	currencyAddress?: Address;
	/** Query configuration options */
	query?: {
		/** Whether the query should be enabled/disabled */
		enabled?: boolean;
	};
}

/**
 * Return type for the useCurrency hook containing currency/token information
 */
export type UseCurrencyReturn = Currency | undefined;

const fetchCurrency = async (
	chainId: number,
	currencyAddress: string,
	config: SdkConfig,
): Promise<Currency | undefined> => {
	const queryClient = getQueryClient();

	let currencies = queryClient.getQueryData([...currencyKeys.lists, chainId]) as
		| Currency[]
		| undefined;

	if (!currencies) {
		const marketplaceClient = getMarketplaceClient(chainId, config);
		currencies = await marketplaceClient
			.listCurrencies()
			.then((resp) => resp.currencies);
	}

	if (!currencies?.length) {
		throw new Error('No currencies returned');
	}
	const currency = currencies.find(
		(currency) =>
			currency.contractAddress.toLowerCase() === currencyAddress.toLowerCase(),
	);

	if (!currency) {
		throw new Error('Currency not found');
	}

	return currency;
};

export const currencyOptions = (args: UseCurrencyArgs, config: SdkConfig) => {
	const { chainId, currencyAddress } = args;

	return queryOptions({
		...args.query,
		queryKey: [...currencyKeys.details, args.chainId, args.currencyAddress],
		queryFn:
			chainId && currencyAddress
				? () => fetchCurrency(chainId, currencyAddress, config)
				: skipToken,
	});
};

/**
 * Hook to fetch information about a specific currency/token
 *
 * Retrieves detailed information about a currency including its name, symbol, decimals,
 * exchange rate, and whether it's the default or native currency for the chain.
 *
 * @param args - Configuration object containing chain ID and optional currency address
 * @returns React Query result with currency data, loading state, and error handling
 *
 * @example
 * ```tsx
 * const { data: currency, isLoading, error } = useCurrency({
 *   chainId: 137,
 *   currencyAddress: '0x...' // USDC on Polygon
 * });
 *
 * if (isLoading) return <div>Loading currency info...</div>;
 * if (error) return <div>Error loading currency</div>;
 * if (!currency) return <div>Currency not found</div>;
 *
 * return (
 *   <div>
 *     <h2>{currency.name} ({currency.symbol})</h2>
 *     <p>Decimals: {currency.decimals}</p>
 *     <p>Exchange Rate: ${currency.exchangeRate}</p>
 *   </div>
 * );
 * ```
 */
export const useCurrency = (args: UseCurrencyArgs) => {
	const config = useConfig();
	return useQuery(currencyOptions(args, config));
};
