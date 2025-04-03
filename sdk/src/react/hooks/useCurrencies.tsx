import { queryOptions, useQuery } from '@tanstack/react-query';
import { zeroAddress } from 'viem';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	QueryArgSchema,
	currencyKeys,
	getMarketplaceClient,
	getQueryClient,
} from '../_internal';
import { useConfig } from './useConfig';
import { marketplaceConfigOptions } from './useMarketplaceConfig';

const ChainIdCoerce = ChainIdSchema.transform((val) => val.toString());

const UseCurrenciesArgsSchema = z.object({
	chainId: ChainIdCoerce,
	includeNativeCurrency: z.boolean().optional().default(true),
	collectionAddress: AddressSchema.optional(),
	query: QueryArgSchema,
});

type UseCurrenciesArgs = z.input<typeof UseCurrenciesArgsSchema>;

export type UseCurrenciesReturn = Awaited<ReturnType<typeof fetchCurrencies>>;

const fetchCurrencies = async (args: UseCurrenciesArgs, config: SdkConfig) => {
	const parsedArgs = UseCurrenciesArgsSchema.parse(args);
	const marketplaceClient = getMarketplaceClient(parsedArgs.chainId, config);

	let currencies = await marketplaceClient.listCurrencies().then((resp) =>
		resp.currencies.map((currency) => ({
			...currency,
			contractAddress: currency.contractAddress || zeroAddress,
		})),
	);

	if (parsedArgs.collectionAddress) {
		const queryClient = getQueryClient();
		const marketplaceConfig = await queryClient.fetchQuery(
			marketplaceConfigOptions(config),
		);

		const currenciesOptions = marketplaceConfig.collections.find(
			(collection) => collection.address === args.collectionAddress,
		)?.currencyOptions;

		// Filter currencies based on collection currency options
		if (currenciesOptions) {
			currencies = currencies.filter((currency) =>
				currenciesOptions.includes(currency.contractAddress),
			);
		}
	}

	if (!parsedArgs.includeNativeCurrency) {
		currencies = currencies.filter((currency) => !currency.nativeCurrency);
	}

	return currencies;
};

export const currenciesOptions = (
	args: UseCurrenciesArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...currencyKeys.lists, args],
		queryFn: () => fetchCurrencies(args, config),
		enabled: args.query?.enabled,
	});
};

export const useCurrencies = (args: UseCurrenciesArgs) => {
	const config = useConfig();
	return useQuery(currenciesOptions(args, config));
};
