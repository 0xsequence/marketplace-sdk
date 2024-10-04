import {
	type ChainId,
	type QueryArg,
	configKeys,
	currencyKeys,
	getMarketplaceClient,
	getQueryClient,
} from '@internal';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Currency, MarketplaceConfig, SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseCurrenciesArgs = {
	chainId: ChainId;
	collectionAddress?: string;
	includeNativeCurrency?: boolean;
} & QueryArg;

export type UseCurrenciesReturn = ReturnType<typeof fetchCurrencies>;

// const getCollectionCurrencies = (
// 	chainId: ChainId,
// 	collectionAddress: string,
// ) => {
// 	const queryClient = getQueryClient();
// 	const currencyCache = queryClient.getQueryData<Currency[]>([
// 		currencyKeys.lists,
// 		chainId,
// 	]);
// 	const marketplaceConfigCache = queryClient.getQueryData<MarketplaceConfig>([
// 		configKeys.marketplace,
// 	]);
//
// 	if (currencyCache && marketplaceConfigCache && collectionAddress) {
// 		const collection = marketplaceConfigCache.collections.find(
// 			(collection) => collection.collectionAddress === collectionAddress,
// 		);
//
// 		return currencyCache.filter((currency) => {
// 			if (
// 				collection?.currencyOptions?.includes(currency.contractAddress) ||
// 				currency.nativeCurrency ||
// 				currency.defaultChainCurrency
// 			)
// 				return currency;
// 		});
// 	}
// };
//
// const fetchCurrencies = async (args: UseCurrenciesArgs, config: SdkConfig) => {
// 	const queryClient = getQueryClient();
// 	const cache = queryClient.getQueryData<Currency[]>([
// 		currencyKeys.lists,
// 		args.chainId,
// 	]);
// 	if (cache) {
// 		if (args.collectionAddress) {
// 			return getCollectionCurrencies(args.chainId, args.collectionAddress);
// 		} else if (args.includeNativeCurrency) {
// 			return cache;
// 		}
// 	}
// 	const marketplaceClient = getMarketplaceClient(args.chainId, config);
// 	return marketplaceClient.listCurrencies().then((resp) => resp.currencies);
// };

const fetchCurrencies = async (chainId: ChainId, config: SdkConfig) => {
	const marketplaceClient = getMarketplaceClient(chainId, config);
	return marketplaceClient.listCurrencies().then((resp) => resp.currencies);
};

const selectCurrencies = (data: Currency[], args: UseCurrenciesArgs) => {
	// if collectionAddress is passed, filter currencies based on collection currency options
	if (args.collectionAddress) {
		const queryClient = getQueryClient();
		const marketplaceConfigCache = queryClient.getQueryData<MarketplaceConfig>([
			configKeys.marketplace,
		]);

		const collection = marketplaceConfigCache?.collections.find(
			(collection) => collection.collectionAddress === args.collectionAddress,
		);

		return data.filter(
			(currency) =>
				collection?.currencyOptions?.includes(currency.contractAddress) ||
				currency.nativeCurrency ||
				currency.defaultChainCurrency === !!args.includeNativeCurrency,
		);
	}
	// if includeNativeCurrency is true, return all currencies
	if (args.includeNativeCurrency) {
		return data;
	}

	// if includeNativeCurrency is false or undefined, filter out native currencies
	return data.filter((currency) => !currency.nativeCurrency);
};

export const currenciesOptions = (
	args: UseCurrenciesArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [currencyKeys.lists, args.chainId],
		queryFn: () => fetchCurrencies(args.chainId, config),
		select: (data) => selectCurrencies(data, args),
	});
};

export const useCurrencies = (args: UseCurrenciesArgs) => {
	const config = useConfig();
	return useQuery(currenciesOptions(args, config));
};
