import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { useConfig } from './useConfig';
import {
	ChainIdSchema,
	AddressSchema,
	QueryArgSchema,
	getMarketplaceClient,
	type Currency,
	getQueryClient,
	configKeys,
	currencyKeys,
	ChainId,
} from '../_internal';
import { SdkConfig, MarketplaceConfig } from '../../types';

const ChainIdCoerce = ChainIdSchema.transform((val) => val.toString());

const UseCurrenciesArgsSchema = z.object({
	chainId: ChainIdCoerce,
	collectionAddress: AddressSchema.optional(),
	includeNativeCurrency: z.boolean().optional(),
	query: QueryArgSchema,
});

type UseCurrenciesArgs = z.input<typeof UseCurrenciesArgsSchema>;

export type UseCurrenciesReturn = Awaited<ReturnType<typeof fetchCurrencies>>;

const fetchCurrencies = async (chainId: ChainId, config: SdkConfig) => {
	const parsedChainId = ChainIdCoerce.parse(chainId);
	const marketplaceClient = getMarketplaceClient(parsedChainId, config);
	return marketplaceClient.listCurrencies().then((resp) => resp.currencies);
};

const selectCurrencies = (data: Currency[], args: UseCurrenciesArgs) => {
	const argsParsed = UseCurrenciesArgsSchema.parse(args);
	// if collectionAddress is passed, filter currencies based on collection currency options
	if (argsParsed.collectionAddress) {
		const queryClient = getQueryClient();
		const marketplaceConfigCache = queryClient.getQueriesData({
			queryKey: configKeys.marketplace,
		})[0][1] as MarketplaceConfig;

		const collection = marketplaceConfigCache?.collections.find(
			(collection) =>
				collection.collectionAddress === argsParsed.collectionAddress,
		);

		if (!collection) {
			throw new Error("Collection doesn't exist");
		}

		return data.filter(
			(currency) =>
				collection.currencyOptions?.includes(currency.contractAddress) ||
				// biome-ignore lint/suspicious/noDoubleEquals: <explanation>
				currency.nativeCurrency == argsParsed.includeNativeCurrency ||
				currency.defaultChainCurrency,
		);
	}
	// if includeNativeCurrency is true, return all currencies
	if (argsParsed.includeNativeCurrency) {
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
		queryKey: [...currencyKeys.lists, args.chainId],
		queryFn: () => fetchCurrencies(args.chainId, config),
		select: (data) => selectCurrencies(data, args),
		enabled: args.query?.enabled,
	});
};

export const useCurrencies = (args: UseCurrenciesArgs) => {
	const config = useConfig();
	return useQuery(currenciesOptions(args, config));
};
