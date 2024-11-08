import {
  type ChainId,
  type ListCollectiblesArgs,
  type Page,
  collectableKeys,
  getMarketplaceClient,
} from "@internal";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import type { SdkConfig } from "@types";
import { useConfig } from "./useConfig";

export type UseListCollectiblesArgs = Omit<
  ListCollectiblesArgs,
  "contractAddress"
> & {
  collectionAddress: string;
  chainId: ChainId;
};

export type UseListCollectiblesReturn = Awaited<
  ReturnType<typeof fetchCollectibles>
>;

const fetchCollectibles = async (
  args: UseListCollectiblesArgs,
  page: Page,
  marketplaceClient: Awaited<ReturnType<typeof getMarketplaceClient>>
) => {
  const arg = {
    ...args,
    contractAddress: args.collectionAddress,
    page,
  } satisfies ListCollectiblesArgs;

  return marketplaceClient.listCollectibles(arg);
};

export const listCollectiblesOptions = (
  args: UseListCollectiblesArgs,
  config: SdkConfig
) => {
  const marketplaceClient = getMarketplaceClient(args.chainId, config);
  return infiniteQueryOptions({
    queryKey: [...collectableKeys.lists, args, marketplaceClient],
    queryFn: ({ pageParam }) =>
      fetchCollectibles(args, pageParam, marketplaceClient),
    initialPageParam: { page: 1, pageSize: 30 },
    getNextPageParam: (lastPage) =>
      lastPage.page?.more ? lastPage.page : undefined,
  });
};

export const useListCollectibles = (args: UseListCollectiblesArgs) => {
  const config = useConfig();
  return useInfiniteQuery(listCollectiblesOptions(args, config));
};
