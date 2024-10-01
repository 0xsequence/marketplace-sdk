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

export type UseCollectableReturn = ReturnType<typeof fetchCollectableOffers>;

const fetchCollectableOffers = async (
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

export const listCollectableOffersOptions = (
	args: UseListOffersForCollectableArgs,
	config: SdkConfig,
) => {
	return infiniteQueryOptions({
		queryKey: [collectableKeys.offers, args, config],
		queryFn: ({ pageParam }) => fetchCollectableOffers(config, args, pageParam),
		initialPageParam: { page: 1, pageSize: 30 },
		getNextPageParam: (lastPage) =>
			lastPage.page?.more ? lastPage.page : undefined,
	});
};

export const useListCollectableOffers = (
	args: UseListOffersForCollectableArgs,
) => {
	const config = useConfig();
	return useInfiniteQuery(listCollectableOffersOptions(args, config));
};
