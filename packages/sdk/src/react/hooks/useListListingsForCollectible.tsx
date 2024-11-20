import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	ChainIdSchema,
	type ListListingsForCollectibleArgs,
	type Page,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
import { listListingsForCollectibleArgsSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const UseListListingsForCollectibleArgsSchema =
	listListingsForCollectibleArgsSchema.extend({
		chainId: ChainIdSchema.pipe(z.coerce.string()),
	});

type UseListListingsForCollectibleArgs = z.infer<
	typeof UseListListingsForCollectibleArgsSchema
>;

export type UseListListingsForCollectibleReturn = Awaited<
	ReturnType<typeof fetchListListingsForCollectible>
>;

const fetchListListingsForCollectible = async (
	config: SdkConfig,
	args: UseListListingsForCollectibleArgs,
	page: Page,
) => {
	const arg = {
		contractAddress: args.contractAddress,
		tokenId: args.tokenId,
		filter: args.filter,
		page,
	} satisfies ListListingsForCollectibleArgs;

	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient.listCollectibleListings(arg);
};

export const listListingsForCollectibleOptions = (
	args: UseListListingsForCollectibleArgs,
	config: SdkConfig,
) => {
	return infiniteQueryOptions({
		queryKey: [...collectableKeys.listings, args, config],
		queryFn: ({ pageParam }) =>
			fetchListListingsForCollectible(config, args, pageParam),
		initialPageParam: { page: 1, pageSize: 30 },
		getNextPageParam: (lastPage) =>
			lastPage.page?.more ? lastPage.page : undefined,
	});
};

export const useListListingsForCollectible = (
	args: UseListListingsForCollectibleArgs,
) => {
	const config = useConfig();
	return useInfiniteQuery(listListingsForCollectibleOptions(args, config));
};