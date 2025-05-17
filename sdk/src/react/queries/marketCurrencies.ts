import { queryOptions } from '@tanstack/react-query';
import { type Address, zeroAddress } from 'viem';
import type { SdkConfig } from '../../types';
import {
	currencyKeys,
	getMarketplaceClient,
	getQueryClient,
} from '../_internal';
import { marketplaceConfigOptions } from './marketplaceConfig';

type QueryArg = {
	enabled?: boolean;
};

export interface UseMarketCurrenciesArgs {
	chainId: number;
	includeNativeCurrency?: boolean;
	collectionAddress?: Address;
	query?: QueryArg;
}

const fetchMarketCurrencies = async (
	args: UseMarketCurrenciesArgs,
	config: SdkConfig,
) => {
	const includeNativeCurrency = args.includeNativeCurrency ?? true;
	const marketplaceClient = getMarketplaceClient(args.chainId, config);

	let currencies = await marketplaceClient.listCurrencies().then((resp) =>
		resp.currencies.map((currency) => ({
			...currency,
			contractAddress: currency.contractAddress || zeroAddress,
		})),
	);

	if (args.collectionAddress) {
		const queryClient = getQueryClient();
		const marketplaceConfig = await queryClient.fetchQuery(
			marketplaceConfigOptions(config),
		);

		const currenciesOptions = marketplaceConfig.market.collections.find(
			(collection) => collection.itemsAddress === args.collectionAddress,
		)?.currencyOptions;

		// Filter currencies based on collection currency options
		if (currenciesOptions) {
			currencies = currencies.filter((currency) =>
				currenciesOptions.includes(currency.contractAddress),
			);
		}
	}

	if (!includeNativeCurrency) {
		currencies = currencies.filter((currency) => !currency.nativeCurrency);
	}

	return currencies;
};

export const currenciesOptions = (
	args: UseMarketCurrenciesArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...currencyKeys.lists, args],
		queryFn: () => fetchMarketCurrencies(args, config),
		enabled: args.query?.enabled,
	});
};
