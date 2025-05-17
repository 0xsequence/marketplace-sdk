import { useQuery } from '@tanstack/react-query';
import { type UseMarketCurrenciesArgs, currenciesOptions } from '../queries';
import { useConfig } from './useConfig';

export const useMarketCurrencies = (args: UseMarketCurrenciesArgs) => {
	const config = useConfig();
	return useQuery(currenciesOptions(args, config));
};
