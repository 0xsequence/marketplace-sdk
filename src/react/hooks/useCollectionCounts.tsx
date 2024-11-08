import {
  ChainIdSchema,
  OrderSide,
  QueryArgSchema,
  collectableKeys,
  getMarketplaceClient,
} from "@internal";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { SdkConfig } from "@types";
import { z } from "zod";
import { collectiblesFilterSchema } from "../_internal/api/zod-schema";
import { useConfig } from "./useConfig";

const UseCountOfCollectableSchema = z.object({
  chainId: ChainIdSchema.pipe(z.coerce.string()),
  collectionAddress: z.string(),
  query: QueryArgSchema,
  filter: collectiblesFilterSchema
    .extend({
      side: z.nativeEnum(OrderSide),
    })
    .optional(),
});

export type UseCountOfCollectablesArgs = z.infer<
  typeof UseCountOfCollectableSchema
>;

export type UseHighestOfferReturn = Awaited<
  ReturnType<typeof fetchCountOfCollectables>
>;

const fetchCountOfCollectables = async (
  args: UseCountOfCollectablesArgs,
  config: SdkConfig
) => {
  const parsedArgs = UseCountOfCollectableSchema.parse(args);
  const marketplaceClient = getMarketplaceClient(parsedArgs.chainId, config);
  if (parsedArgs.filter) {
    return marketplaceClient
      .getCountOfFilteredCollectibles({
        ...parsedArgs,
        contractAddress: parsedArgs.collectionAddress,
        side: parsedArgs.filter.side,
      })
      .then((resp) => resp.count);
    // biome-ignore lint/style/noUselessElse: <explanation>
  } else {
    return marketplaceClient
      .getCountOfAllCollectibles({
        ...parsedArgs,
        contractAddress: parsedArgs.collectionAddress,
      })
      .then((resp) => resp.count);
  }
};

export const countOfCollectablesOptions = (
  args: UseCountOfCollectablesArgs,
  config: SdkConfig
) => {
  return queryOptions({
    ...args.query,
    queryKey: [...collectableKeys.counts, args],
    queryFn: () => fetchCountOfCollectables(args, config),
  });
};

export const useCountOfCollectables = (args: UseCountOfCollectablesArgs) => {
  const config = useConfig();
  return useQuery(countOfCollectablesOptions(args, config));
};
