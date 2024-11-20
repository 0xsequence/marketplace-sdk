import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	ChainIdSchema,
	type ListOffersForCollectibleArgs,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
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
) => {
	const arg = {
		contractAddress: args.contractAddress,
		tokenId: args.tokenId,
		filter: args.filter,
		page: args.page,
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
		queryFn: () => fetchListOffersForCollectible(config, args),
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
