import { queryOptions, useQuery } from '@tanstack/react-query';
import { Address, zeroAddress } from 'viem';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import { InvalidCurrencyOptionsError } from '../../utils/_internal/error/transaction';
import {
	AddressSchema,
	type ChainId,
	ChainIdSchema,
	type Currency,
	QueryArgSchema,
	currencyKeys,
	getMarketplaceClient,
} from '../_internal';
import { useConfig } from './useConfig';

const ChainIdCoerce = ChainIdSchema.transform((val) => val.toString());

const UseCurrenciesArgsSchema = z.object({
	chainId: ChainIdCoerce,
	includeNativeCurrency: z.boolean().optional().default(true),
	currencyOptions: z.array(AddressSchema).optional(),
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
	const argsParsed = UseCurrenciesArgsSchema.parse(args);
	// if collectionAddress is passed, filter currencies based on collection currency options
	if (argsParsed.currencyOptions) {
		if (!argsParsed.currencyOptions) {
			throw new InvalidCurrencyOptionsError(argsParsed.currencyOptions);
		}
		const lowerCaseCurrencyOptions = argsParsed.currencyOptions.map((option) =>
			option.toLowerCase(),
		);

		return data.filter(
			(currency) =>
				lowerCaseCurrencyOptions.includes(
					currency.contractAddress.toLowerCase(),
				) ||
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
