import {
  type ChainId,
  ChainIdSchema,
  type Currency,
  type QueryArg,
  QueryArgSchema,
  configKeys,
  currencyKeys,
  getMarketplaceClient,
  getQueryClient,
} from "@internal";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { MarketplaceConfig, SdkConfig } from "@types";
import { z } from "zod";
import { useConfig } from "./useConfig";

const UseCurrenciesArgsSchema = z.object({
  chainId: ChainIdSchema.pipe(z.coerce.string()),
  collectionAddress: z.string(),
  includeNativeCurrency: z.boolean().optional(),
  query: QueryArgSchema,
});

export type UseCurrenciesReturn = Awaited<
  Awaited<ReturnType<typeof fetchCurrencies>>
>;

const fetchCurrencies = async (chainId: ChainId, config: SdkConfig) => {
  const marketplaceClient = getMarketplaceClient(chainId, config);
  return marketplaceClient.listCurrencies().then((resp) => resp.currencies);
};

const selectCurrencies = (data: Currency[], args: UseCurrenciesArgs) => {
  // if collectionAddress is passed, filter currencies based on collection currency options
  if (args.collectionAddress) {
    const queryClient = getQueryClient();
    const marketplaceConfigCache = queryClient.getQueriesData({
      queryKey: configKeys.marketplace,
    })[0][1] as MarketplaceConfig;

    const collection = marketplaceConfigCache?.collections.find(
      (collection) => collection.collectionAddress === args.collectionAddress
    );

    if (!collection) {
      throw new Error("Collection doesn't exist");
    }

    return data.filter(
      (currency) =>
        collection.currencyOptions?.includes(currency.contractAddress) ||
        // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
        currency.nativeCurrency == args.includeNativeCurrency ||
        currency.defaultChainCurrency
    );
  }
  // if includeNativeCurrency is true, return all currencies
  if (args.includeNativeCurrency) {
    return data;
  }

  // if includeNativeCurrency is false or undefined, filter out native currencies
  return data.filter((currency) => !currency.nativeCurrency);
};

export const currenciesOptions = (
  args: UseCurrenciesArgs,
  config: SdkConfig
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
