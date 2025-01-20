import { QueryClient, queryOptions, useQuery } from '@tanstack/react-query';
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
	useMarketplaceQueryClient,
} from '../_internal';
import { useConfig } from './useConfig';

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
	queryClient: QueryClient,
): Promise<Currency | undefined> => {
	const parsedChainId = ChainIdCoerce.parse(chainId);

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

export const currencyOptions = (
	args: UseCurrencyArgs,
	config: SdkConfig,
	queryClient: QueryClient,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...currencyKeys.details, args.chainId, args.currencyAddress],
		queryFn: () =>
			fetchCurrency(args.chainId, args.currencyAddress, config, queryClient),
	});
};

export const useCurrency = (args: UseCurrencyArgs) => {
	const config = useConfig();
	const queryClient = useMarketplaceQueryClient();
	return useQuery(currencyOptions(args, config, queryClient));
};
