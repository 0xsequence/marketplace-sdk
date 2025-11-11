import { queryOptions } from '@tanstack/react-query';
import { type Address, zeroAddress } from 'viem';
import type { SdkConfig } from '../../../types';
import { compareAddress } from '../../../utils';
import {
	getMarketplaceClient,
	getQueryClient,
	type ListCurrenciesRequest,
	type ValuesOptional,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';
import { marketplaceConfigOptions } from '../marketplace/config';

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
			chainId: chainId,
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

export type MarketCurrenciesQueryOptions =
	ValuesOptional<FetchMarketCurrenciesParams> & {
		query?: StandardQueryOptions;
	};

export function getMarketCurrenciesQueryKey(
	params: MarketCurrenciesQueryOptions,
) {
	const apiArgs: ListCurrenciesRequest = {
		chainId: params.chainId ?? 0,
	};

	const client = getMarketplaceClient(params.config!);
	const baseKey = client.queryKey.listCurrencies({
		...apiArgs,
		chainId: apiArgs.chainId.toString(),
	});

	// Append additional filtering params not part of the RPC request
	return [
		...baseKey,
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
