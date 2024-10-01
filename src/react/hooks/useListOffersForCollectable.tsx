import {
	type ListOffersForCollectibleArgs,
	collectableKeys,
	getMarketplaceClient,
} from '@internal';
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import type { Page, SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseListOffersForCollectableArgs = ListOffersForCollectibleArgs & {
	chainId: string;
};

export type UseListOffersForCollectable = ReturnType<
	typeof fetchListOffersForCollectable
>;

const fetchListOffersForCollectable = async (
	config: SdkConfig,
	args: UseListOffersForCollectableArgs,
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

export const listOffersForCollectableOptions = (
	args: UseListOffersForCollectableArgs,
	config: SdkConfig,
) => {
	return infiniteQueryOptions({
		queryKey: [collectableKeys.offers, args, config],
		queryFn: ({ pageParam }) =>
			fetchListOffersForCollectable(config, args, pageParam),
		initialPageParam: { page: 1, pageSize: 30 },
		getNextPageParam: (lastPage) =>
			lastPage.page?.more ? lastPage.page : undefined,
	});
};

export const useListOffersForCollectable = (
	args: UseListOffersForCollectableArgs,
) => {
	const config = useConfig();
	return useInfiniteQuery(listOffersForCollectableOptions(args, config));
};