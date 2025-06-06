import { queryOptions, skipToken, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	type Currency,
	QueryArgSchema,
	currencyKeys,
	getMarketplaceClient,
	getQueryClient,
} from '../_internal';
import { useConfig } from './useConfig';

const UseCurrencyArgsSchema = z.object({
	chainId: z.number(),
	currencyAddress: AddressSchema.optional(),
	query: QueryArgSchema,
});

type UseCurrencyArgs = z.input<typeof UseCurrencyArgsSchema>;

export type UseCurrencyReturn = Currency | undefined;

const fetchCurrency = async (
	chainId: number,
	currencyAddress: string,
	config: SdkConfig,
): Promise<Currency | undefined> => {
	const queryClient = getQueryClient();

	let currencies = queryClient.getQueryData([...currencyKeys.lists, chainId]) as
		| Currency[]
		| undefined;

	if (!currencies) {
		const marketplaceClient = getMarketplaceClient(config);
		currencies = await marketplaceClient
			.listCurrencies({ chainId: String(chainId) })
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

export const currencyOptions = (args: UseCurrencyArgs, config: SdkConfig) => {
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

export const useCurrency = (args: UseCurrencyArgs) => {
	const config = useConfig();
	return useQuery(currencyOptions(args, config));
};
