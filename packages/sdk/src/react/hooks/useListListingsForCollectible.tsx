import { queryOptions, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import type { SdkConfig } from "../../types";
import {
  ChainIdSchema,
  type ListListingsForCollectibleArgs,
  collectableKeys,
  getMarketplaceClient,
} from "../_internal";
import { listListingsForCollectibleArgsSchema } from "../_internal/api/zod-schema";
import { useConfig } from "./useConfig";

const UseListListingsForCollectibleArgsSchema =
  listListingsForCollectibleArgsSchema
    .extend({
      chainId: ChainIdSchema.pipe(z.coerce.string()),
      collectionAddress: z.string(),
    })
    .omit({ contractAddress: true });

type UseListListingsForCollectibleArgs = z.infer<
  typeof UseListListingsForCollectibleArgsSchema
>;

export type UseListListingsForCollectibleReturn = Awaited<
  ReturnType<typeof fetchListListingsForCollectible>
>;

const fetchListListingsForCollectible = async (
  config: SdkConfig,
  args: UseListListingsForCollectibleArgs
) => {
  const arg = {
    contractAddress: args.collectionAddress,
    tokenId: args.tokenId,
    filter: args.filter,
    page: args.page,
  } satisfies ListListingsForCollectibleArgs;

  const marketplaceClient = getMarketplaceClient(args.chainId, config);
  return marketplaceClient.listCollectibleListings(arg);
};

export const listListingsForCollectibleOptions = (
  args: UseListListingsForCollectibleArgs,
  config: SdkConfig
) => {
  return queryOptions({
    queryKey: [...collectableKeys.offers, args, config],
    queryFn: () => fetchListListingsForCollectible(config, args),
  });
};

export const useListListingsForCollectible = (
  args: UseListListingsForCollectibleArgs
) => {
  const config = useConfig();

  return useQuery(listListingsForCollectibleOptions(args, config));
};
