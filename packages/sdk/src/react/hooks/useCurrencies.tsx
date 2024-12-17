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

const selectCurrencies = (data: Currency[], args: UseCurrenciesArgs) => {
	console.debug('[selectCurrencies]: Select Currencies Input:', { data, args });
	const argsParsed = UseCurrenciesArgsSchema.parse(args);
	// if collectionAddress is passed, filter currencies based on collection currency options
	console.debug('[selectCurrencies]: Select Currencies Args:', argsParsed);
	if (argsParsed.collectionAddress) {
		const queryClient = getQueryClient();
		const marketplaceConfigCache = queryClient.getQueriesData({
			queryKey: configKeys.marketplace,
		})[0][1] as MarketplaceConfig;
		
		console.debug('[selectCurrencies]: Marketplace Config Cache:', marketplaceConfigCache);
		
		const collection = marketplaceConfigCache?.collections.find(
			(collection) =>
				collection.collectionAddress === argsParsed.collectionAddress,
		);
		
		console.debug('[selectCurrencies]: Collection:', collection);

		if (!collection) {
			console.error('[selectCurrencies]: Collection Not Found:', argsParsed.collectionAddress);
			throw new CollectionNotFoundError(argsParsed.collectionAddress!);
		}

		console.debug('[selectCurrencies]: Currency Options:', collection.currencyOptions);


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
