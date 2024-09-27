import { currencyKeys } from "../_internal/queryKeys";
import { getMarketplaceClient } from "../_internal/services";
import { type Config } from "../types/config";
import { useConfig } from "./useConfig";
import { queryOptions, useQuery } from "@tanstack/react-query";

export type UseCurrenciesArgs = {
  chainId: string;
};

const fetchCurrencies = async (args: UseCurrenciesArgs, config: Config) => {
  const marketplaceClient = getMarketplaceClient(args.chainId, config);
  return marketplaceClient.listCurrencies().then((resp) => resp.currencies);
};

export const currenciesOptions = (args: UseCurrenciesArgs, config: Config) => {
  return queryOptions({
    queryKey: [currencyKeys.lists, args, config],
    queryFn: () => fetchCurrencies(args, config),
  });
};

export const useCurrencies = (args: UseCurrenciesArgs) => {
  const config = useConfig();
  return useQuery(currenciesOptions(args, config));
};
