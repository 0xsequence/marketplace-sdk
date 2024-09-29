import {
	type ChainId,
	type QueryArg,
	currencyKeys,
	getMarketplaceClient,
} from '@internal';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseCurrenciesArgs = {
	chainId: ChainId;
} & QueryArg;

const fetchCurrencies = async (args: UseCurrenciesArgs, config: SdkConfig) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient.listCurrencies().then((resp) => resp.currencies);
};

export const currenciesOptions = (
	args: UseCurrenciesArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		initialData: args.query?.initialData,
		queryKey: [currencyKeys.lists, args, config],
		queryFn: () => fetchCurrencies(args, config),
	});
};

export const useCurrencies = (args: UseCurrenciesArgs) => {
	const config = useConfig();
	return useQuery(currenciesOptions(args, config));
};
