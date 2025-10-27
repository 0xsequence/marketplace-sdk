import { queryOptions } from '@tanstack/react-query';
import { type Address, zeroAddress } from 'viem';
import type { SdkConfig } from '../../../types';
import { compareAddress } from '../../../utils';
import {
	currencyKeys,
	getMarketplaceClient,
	getQueryClient,
	type ListCurrenciesArgs,
	OrderbookKind,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';
import { marketplaceConfigOptions } from './marketplaceConfig';

export interface FetchMarketCurrenciesParams {
	chainId: number;
	includeNativeCurrency?: boolean;
	collectionAddress?: Address;
	config: SdkConfig;
}

/**
 * Fetches supported currencies for a marketplace
 */
export async function fetchMarketCurrencies(
	params: FetchMarketCurrenciesParams,
) {
	const { chainId, includeNativeCurrency, collectionAddress, config } = params;
	const includeNativeCurrencyOption = includeNativeCurrency ?? true;
	const marketplaceClient = getMarketplaceClient(config);

	let currencies = await marketplaceClient
		.listCurrencies({
			chainId: String(chainId),
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
		const collection = marketplaceConfig.market.collections.find((collection) =>
			compareAddress(collection.itemsAddress, collectionAddress),
		);
		const isOpensea =
			collection?.destinationMarketplace === OrderbookKind.opensea;

		const currenciesOptions = marketplaceConfig.market.collections.find(
			(collection) =>
				compareAddress(collection.itemsAddress, collectionAddress),
		)?.currencyOptions;

		// Filter currencies based on collection currency options
		// Skip filtering for OpenSea as it uses API-based currency support flags
		if (currenciesOptions && !isOpensea) {
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

export type MarketCurrenciesQueryOptions =
	ValuesOptional<FetchMarketCurrenciesParams> & {
		query?: StandardQueryOptions;
	};

export function getMarketCurrenciesQueryKey(
	params: MarketCurrenciesQueryOptions,
) {
	const apiArgs = {
		chainId: String(params.chainId),
	} satisfies QueryKeyArgs<ListCurrenciesArgs>;

	return [
		...currencyKeys.lists,
		apiArgs,
		{
			includeNativeCurrency: params.includeNativeCurrency,
			collectionAddress: params.collectionAddress,
		},
	] as const;
}

export function marketCurrenciesQueryOptions(
	params: MarketCurrenciesQueryOptions,
) {
	const enabled = Boolean(
		params.chainId && params.config && (params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getMarketCurrenciesQueryKey(params),
		queryFn: () =>
			fetchMarketCurrencies({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				includeNativeCurrency: params.includeNativeCurrency,
				collectionAddress: params.collectionAddress,
			}),
		...params.query,
		enabled,
	});
}
