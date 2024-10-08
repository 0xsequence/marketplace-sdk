import {
	type ChainId,
	type CollectiblesFilter,
	type ListCollectiblesArgs,
	type Page,
	collectableKeys,
	getMarketplaceClient,
} from '@internal';
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import type { OrderSide, SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseListCollectablesArgs = {
	chainId: ChainId;
	collectionAddress: string;
	side: OrderSide;
	filters: CollectiblesFilter;
};

const fetchCollectables = async (
	args: UseListCollectablesArgs,
	page: Page,
	marketplaceClient: ReturnType<typeof getMarketplaceClient>,
) => {
	const arg = {
		...args,
		contractAddress: args.collectionAddress,
		page,
	} satisfies ListCollectiblesArgs;

	return marketplaceClient.listCollectibles(arg);
};

export const listCollectablesOptions = (
	args: UseListCollectablesArgs,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return infiniteQueryOptions({
		queryKey: [collectableKeys.lists, args, marketplaceClient],
		queryFn: ({ pageParam }) =>
			fetchCollectables(args, pageParam, marketplaceClient),
		initialPageParam: { page: 1, pageSize: 30 },
		getNextPageParam: (lastPage) =>
			lastPage.page?.more ? lastPage.page : undefined,
	});
};

export const useListCollectables = (args: UseListCollectablesArgs) => {
	const config = useConfig();
	return useInfiniteQuery(listCollectablesOptions(args, config));
};
