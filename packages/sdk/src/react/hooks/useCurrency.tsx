import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { useConfig } from './useConfig';
import {
	ChainIdSchema,
	AddressSchema,
	QueryArgSchema,
	getMarketplaceClient,
	type Currency,
	currencyKeys,
	type ChainId,
	getQueryClient,
} from '../_internal';
import type { SdkConfig } from '../../types';

const ChainIdCoerce = ChainIdSchema.transform((val) => val.toString());

const UseCurrencyArgsSchema = z.object({
	chainId: ChainIdCoerce,
	currencyAddress: AddressSchema,
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

	return currencies?.find(
		(currency) =>
			currency.contractAddress.toLowerCase() === currencyAddress.toLowerCase(),
	);
};

export const currencyOptions = (args: UseCurrencyArgs, config: SdkConfig) => {
	return queryOptions({
		...args.query,
		queryKey: [...currencyKeys.details, args.chainId, args.currencyAddress],
		queryFn: () => fetchCurrency(args.chainId, args.currencyAddress, config),
	});
};

export const useCurrency = (args: UseCurrencyArgs) => {
	const config = useConfig();
	return useQuery(currencyOptions(args, config));
};
