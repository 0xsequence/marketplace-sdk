import type { ChainId } from '@0xsequence/network';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { zeroAddress } from 'viem';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	type CurrencyStatus,
	QueryArgSchema,
	currencyKeys,
	getMarketplaceClient,
	getQueryClient,
} from '../_internal';
import { useConfig } from './useConfig';
import { marketplaceConfigOptions } from './useMarketplaceConfig';

const ChainIdCoerce = ChainIdSchema.transform((val) => val.toString());

const UseCurrenciesArgsSchema: z.ZodObject<
	{
		chainId: z.ZodEffects<
			z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>,
			string,
			string | number
		>;
		includeNativeCurrency: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
		collectionAddress: z.ZodOptional<
			z.ZodEffects<z.ZodString, Address, string>
		>;
		query: z.ZodOptional<
			z.ZodObject<
				{
					enabled: z.ZodOptional<z.ZodBoolean>;
				},
				'strip',
				z.ZodTypeAny,
				{
					enabled?: boolean | undefined;
				},
				{
					enabled?: boolean | undefined;
				}
			>
		>;
	},
	'strip'
> = z.object({
	chainId: ChainIdCoerce,
	includeNativeCurrency: z.boolean().optional().default(true),
	collectionAddress: AddressSchema.optional(),
	query: QueryArgSchema,
});

type UseCurrenciesArgs = z.input<typeof UseCurrenciesArgsSchema>;

export type UseCurrenciesReturn = Awaited<ReturnType<typeof fetchCurrencies>>;

const fetchCurrencies = async (
	args: UseCurrenciesArgs,
	config: SdkConfig,
): Promise<
	{
		contractAddress: string;
		chainId: number;
		status: CurrencyStatus;
		name: string;
		symbol: string;
		decimals: number;
		imageUrl: string;
		exchangeRate: number;
		defaultChainCurrency: boolean;
		nativeCurrency: boolean;
		createdAt: string;
		updatedAt: string;
		deletedAt?: string;
	}[]
> => {
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
			(collection: { address: string | undefined }) =>
				collection.address === args.collectionAddress,
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
): any => {
	return queryOptions({
		...args.query,
		queryKey: [...currencyKeys.lists, args],
		queryFn: () => fetchCurrencies(args, config),
		enabled: args.query?.enabled,
	});
};

export const useCurrencies = (
	args: UseCurrenciesArgs,
): DefinedQueryObserverResult<TData, TError> => {
	const config = useConfig();
	return useQuery(currenciesOptions(args, config));
};
