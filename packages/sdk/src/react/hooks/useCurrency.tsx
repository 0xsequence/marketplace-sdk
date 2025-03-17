import { queryOptions, skipToken, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	type ChainId,
	ChainIdSchema,
	type Currency,
	QueryArgSchema,
	currencyKeys,
	getMarketplaceClient,
	getQueryClient,
} from '../_internal';
import { useConfig } from './useConfig';
import { ChainId } from '@0xsequence/network';

const ChainIdCoerce = ChainIdSchema.transform((val) => val.toString());

const UseCurrencyArgsSchema: z.ZodObject<{
    chainId: z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>, string, string | number>;
    currencyAddress: z.ZodOptional<z.ZodEffects<z.ZodString, Address, string>>;
    query: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled?: boolean | undefined;
    }, {
        enabled?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	chainId: ChainIdCoerce,
	currencyAddress: AddressSchema.optional(),
	query: QueryArgSchema,
});

type UseCurrencyArgs = z.input<typeof UseCurrencyArgsSchema>;

export type UseCurrencyReturn = Currency | undefined;

const fetchCurrency = async (
	chainId: ChainId,
	currencyAddress: string,
	config: SdkConfig,
): Promise<Currency | undefined> => {
	const parsedChainId = ChainIdCoerce.parse(chainId);
	const queryClient = getQueryClient();

	let currencies = queryClient.getQueryData([...currencyKeys.lists, chainId]) as
		| Currency[]
		| undefined;

	if (!currencies) {
		const marketplaceClient = getMarketplaceClient(parsedChainId, config);
		currencies = await marketplaceClient
			.listCurrencies()
			.then((resp) => resp.currencies);
	}

	if (!currencies?.length) {
		throw new Error('No currencies returned');
	}
	const currency = currencies.find(
		(currency) =>
			currency.contractAddress.toLowerCase() === currencyAddress.toLowerCase(),
	);

	if (!currency) {
		throw new Error('Currency not found');
	}

	return currency;
};

export const currencyOptions = (args: UseCurrencyArgs, config: SdkConfig): any => {
	const { chainId, currencyAddress } = args;

	return queryOptions({
		...args.query,
		queryKey: [...currencyKeys.details, args.chainId, args.currencyAddress],
		queryFn:
			chainId && currencyAddress
				? () => fetchCurrency(chainId, currencyAddress, config)
				: skipToken,
	});
};

export const useCurrency = (args: UseCurrencyArgs): DefinedQueryObserverResult<TData, TError> => {
	const config = useConfig();
	return useQuery(currencyOptions(args, config));
};
