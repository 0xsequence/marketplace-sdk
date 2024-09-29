import { currencyKeys } from '@api/queryKeys';
import { getMarketplaceClient } from '@api/services';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseCurrenciesArgs = {
	chainId: string;
};

const fetchCurrencies = async (args: UseCurrenciesArgs, config: SdkConfig) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient.listCurrencies().then((resp) => resp.currencies);
};

export const currenciesOptions = (
	args: UseCurrenciesArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: [currencyKeys.lists, args, config],
		queryFn: () => fetchCurrencies(args, config),
	});
};

export const useCurrencies = (args: UseCurrenciesArgs) => {
	const config = useConfig();
	return useQuery(currenciesOptions(args, config));
};
