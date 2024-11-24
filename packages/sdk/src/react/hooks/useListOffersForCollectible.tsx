import { queryOptions, useQuery } from '@tanstack/react-query';
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

const UseListOffersForCollectibleArgsSchema = listOffersForCollectibleArgsSchema
  .extend({
    chainId: ChainIdSchema.pipe(z.coerce.string()),
    collectionAddress: z.string(),
    collectibleId: z.string(),
  })
  .omit({ contractAddress: true, tokenId: true });

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
		contractAddress: args.collectionAddress,
		tokenId: args.collectibleId,
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
	return queryOptions({
		queryKey: [...collectableKeys.offers, args, config],
		queryFn: () => fetchListOffersForCollectible(config, args),
	});
};

export const useListOffersForCollectible = (
	args: UseListOffersForCollectibleArgs,
) => {
	const config = useConfig();

	return useQuery(listOffersForCollectibleOptions(args, config));
};
