import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { MarketplaceConfig, SdkConfig } from '../../types';
import { CollectionNotFoundError } from '../../utils/_internal/error/transaction';
import {
	AddressSchema,
	type ChainId,
	ChainIdSchema,
	type Currency,
	QueryArgSchema,
	configKeys,
	currencyKeys,
	getMarketplaceClient,
	getQueryClient,
} from '../_internal';
import { useConfig } from './useConfig';
import { zeroAddress } from 'viem';
import { useMarketplaceConfig } from './useMarketplaceConfig';

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
	return marketplaceClient.listCurrencies().then((resp) =>
		resp.currencies.map((currency) => ({
			...currency,
			// TODO: remove this, when we are sure of the schema
			contractAddress: currency.contractAddress || zeroAddress,
		})),
	);
};

//TODO: Implement more proper way to get marketplace config
const useControlledMarketplaceConfig = (projectId: number) => {
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const queryClient = getQueryClient();
	const marketplaceConfigCache = queryClient.getQueriesData({
		queryKey: configKeys.marketplace,
	})[0][1] as MarketplaceConfig;

	if (marketplaceConfigCache.projectId !== projectId) {
		return marketplaceConfig;
	}

	return marketplaceConfigCache;
};

const selectCurrencies = (
	data: Currency[],
	args: UseCurrenciesArgs,
	marketplaceConfig: MarketplaceConfig | undefined,
) => {
	console.debug('[selectCurrencies]: Select Currencies Input:', { data, args });
	const argsParsed = UseCurrenciesArgsSchema.parse(args);
	// if collectionAddress is passed, filter currencies based on collection currency options
	console.debug('[selectCurrencies]: Select Currencies Args:', argsParsed);
	if (argsParsed.collectionAddress) {
		const collection = marketplaceConfig?.collections.find(
			(collection) =>
				collection.collectionAddress === argsParsed.collectionAddress,
		);

		console.debug('[selectCurrencies]: Collection:', collection);

		if (!collection) {
			throw new CollectionNotFoundError(argsParsed.collectionAddress!);
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
	marketplaceConfig: MarketplaceConfig | undefined,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...currencyKeys.lists, args.chainId],
		queryFn: () => fetchCurrencies(args.chainId, config),
		select: (data) => selectCurrencies(data, args, marketplaceConfig),
		enabled: args.query?.enabled,
	});
};

export const useCurrencies = (args: UseCurrenciesArgs) => {
	const config = useConfig();
	const marketplaceConfig = useControlledMarketplaceConfig(
		Number(config.projectId),
	);
	return useQuery(currenciesOptions(args, config, marketplaceConfig));
};
