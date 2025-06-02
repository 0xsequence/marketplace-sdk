import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	type ListListingsForCollectibleArgs,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
import { listListingsForCollectibleArgsSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const UseListListingsForCollectibleArgsSchema =
	listListingsForCollectibleArgsSchema
		.extend({
			chainId: z.number(),
			collectionAddress: z.string(),
			collectibleId: z.string(),
		})
		.omit({ contractAddress: true, tokenId: true });

type UseListListingsForCollectibleArgs = z.infer<
	typeof UseListListingsForCollectibleArgsSchema
>;

export type UseListListingsForCollectibleReturn = Awaited<
	ReturnType<typeof fetchListListingsForCollectible>
>;

const fetchListListingsForCollectible = async (
	config: SdkConfig,
	args: UseListListingsForCollectibleArgs,
) => {
	const arg = {
		chainId: String(args.chainId),
		contractAddress: args.collectionAddress,
		tokenId: args.collectibleId,
		filter: args.filter,
		page: args.page,
	} satisfies ListListingsForCollectibleArgs;

	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.listCollectibleListings(arg);
};

export const listListingsForCollectibleOptions = (
	args: UseListListingsForCollectibleArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: [...collectableKeys.listings, args, config],
		queryFn: () => fetchListListingsForCollectible(config, args),
	});
};

export const useListListingsForCollectible = (
	args: UseListListingsForCollectibleArgs,
) => {
	const config = useConfig();

	return useQuery(listListingsForCollectibleOptions(args, config));
};
