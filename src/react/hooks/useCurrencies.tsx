import { SdkConfig } from '../../types/sdk-config';
import { currencyKeys } from '../_internal/api/queryKeys';
import { getMarketplaceClient } from '../_internal/api/services';
import { useConfig } from './useConfig';
import { queryOptions, useQuery } from '@tanstack/react-query';

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
