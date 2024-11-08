import {
	ChainIdSchema,
	type ListOffersForCollectibleArgs,
	collectableKeys,
	getMarketplaceClient,
} from '@internal';
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import type { Page, SdkConfig } from '@types';
import { z } from 'zod';
import { listOffersForCollectibleArgsSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const UseListOffersForCollectibleArgsSchema =
	listOffersForCollectibleArgsSchema.extend({
		chainId: ChainIdSchema.pipe(z.coerce.string()),
	});

type UseListOffersForCollectibleArgs = z.infer<
	typeof UseListOffersForCollectibleArgsSchema
>;

export type UseListOffersForCollectibleReturn = Awaited<
	ReturnType<typeof fetchListOffersForCollectible>
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
