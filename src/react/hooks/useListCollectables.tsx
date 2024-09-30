import {
	type ChainId,
	type CollectiblesFilter,
	type ListCollectiblesWithHighestOfferArgs,
	type ListCollectiblesWithLowestListingArgs,
	type Page,
	collectableKeys,
	getMarketplaceClient,
} from '@internal';
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseListCollectablesArgs = {
	chainId: ChainId;
	collectionAddress: string;
	includeOrders: 'highestOffer' | 'lowestListing';
	filters: CollectiblesFilter;
};

const fetchCollectablesWithLowestListing = async (
	args: ListCollectiblesWithLowestListingArgs,
	marketplaceClient: ReturnType<typeof getMarketplaceClient>,
) => {
	return marketplaceClient.listCollectiblesWithLowestListing(args);
};

const fetchCollectablesWithHighestOffer = async (
	args: ListCollectiblesWithHighestOfferArgs,
	marketplaceClient: ReturnType<typeof getMarketplaceClient>,
) => {
	return marketplaceClient.listCollectiblesWithHighestOffer(args);
};

const fetchCollectables = async (
	args: UseListCollectablesArgs,
	page: Page,
	marketplaceClient: ReturnType<typeof getMarketplaceClient>,
) => {
	const arg = {
		contractAddress: args.collectionAddress,
		filter: args.filters,
		page,
	} satisfies ListCollectiblesWithLowestListingArgs;

	if (args.includeOrders === 'highestOffer') {
		return fetchCollectablesWithHighestOffer(arg, marketplaceClient);
		// biome-ignore lint/style/noUselessElse: An else block looks better here
	} else {
		return fetchCollectablesWithLowestListing(arg, marketplaceClient);
	}
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
