import {
	type ListOffersForCollectibleArgs,
	collectableKeys,
	getMarketplaceClient,
} from '@internal';
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import type { Page, SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseListOffersForCollectibleArgs = ListOffersForCollectibleArgs & {
	chainId: string;
};

export type UseListOffersForCollectible = ReturnType<
	typeof fetchListOffersForCollectible
>;

const fetchListOffersForCollectible = async (
	config: SdkConfig,
	args: UseListOffersForCollectibleArgs,
	page: Page,
) => {
	const arg = {
		contractAddress: args.contractAddress,
		tokenId: args.tokenId,
		filter: args.filter,
		page,
	} satisfies ListOffersForCollectibleArgs;

	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient.listCollectibleOffers(arg);
};

export const listOffersForCollectibleOptions = (
	args: UseListOffersForCollectibleArgs,
	config: SdkConfig,
) => {
	return infiniteQueryOptions({
		queryKey: [...collectableKeys.offers, args, config],
		queryFn: ({ pageParam }) =>
			fetchListOffersForCollectible(config, args, pageParam),
		initialPageParam: { page: 1, pageSize: 30 },
		getNextPageParam: (lastPage) =>
			lastPage.page?.more ? lastPage.page : undefined,
	});
};

export const useListOffersForCollectible = (
	args: UseListOffersForCollectibleArgs,
) => {
	const config = useConfig();
	return useInfiniteQuery(listOffersForCollectibleOptions(args, config));
};
