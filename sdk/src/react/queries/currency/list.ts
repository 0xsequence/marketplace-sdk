import type {
	Address,
	Currency,
	ListCurrenciesRequest,
} from '@0xsequence/api-client';
import { zeroAddress } from 'viem';
import { compareAddress } from '../../../utils';
import {
	buildQueryOptions,
	getMarketplaceClient,
	getQueryClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';
import { marketplaceConfigOptions } from '../marketplace/config';

export type FetchMarketCurrenciesParams = ListCurrenciesRequest & {
	includeNativeCurrency?: boolean;
	collectionAddress?: Address;
};

export type MarketCurrenciesQueryOptions =
	SdkQueryParams<FetchMarketCurrenciesParams>;

/**
 * Fetches supported currencies for a marketplace
 */
export async function fetchMarketCurrencies(
	params: WithRequired<MarketCurrenciesQueryOptions, 'chainId' | 'config'>,
): Promise<Currency[]> {
	const { chainId, includeNativeCurrency, collectionAddress, config } = params;
	const includeNativeCurrencyOption = includeNativeCurrency ?? true;
	const marketplaceClient = getMarketplaceClient(config);

	let currencies = await marketplaceClient
		.listCurrencies({
			chainId,
		})
		.then((resp) =>
			resp.currencies.map((currency) => ({
				...currency,
				contractAddress: currency.contractAddress || zeroAddress,
			})),
		);

	if (collectionAddress) {
		const queryClient = getQueryClient();
		const marketplaceConfig = await queryClient.fetchQuery(
			marketplaceConfigOptions(config),
		);

		const currenciesOptions = marketplaceConfig.market.collections.find(
			(collection) =>
				compareAddress(collection.itemsAddress, collectionAddress),
		)?.currencyOptions;

		// Filter currencies based on collection currency options
		if (currenciesOptions) {
			currencies = currencies.filter((currency) =>
				currenciesOptions.includes(currency.contractAddress),
			);
		}
	}

	if (!includeNativeCurrencyOption) {
		currencies = currencies.filter((currency) => !currency.nativeCurrency);
	}

	return currencies;
}

export function getMarketCurrenciesQueryKey(
	params: MarketCurrenciesQueryOptions,
) {
	return [
		'currency',
		'list',
		{
			chainId: params.chainId,
			includeNativeCurrency: params.includeNativeCurrency,
			collectionAddress: params.collectionAddress,
		},
	] as const;
}

export function marketCurrenciesQueryOptions(
	params: WithOptionalParams<
		WithRequired<MarketCurrenciesQueryOptions, 'chainId' | 'config'>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getMarketCurrenciesQueryKey,
			requiredParams: ['chainId', 'config'] as const,
			fetcher: fetchMarketCurrencies,
		},
		params,
	);
}
