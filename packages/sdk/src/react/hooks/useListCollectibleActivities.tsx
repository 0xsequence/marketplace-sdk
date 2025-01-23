import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
import { useConfig } from './useConfig';
import { pageSchema } from '../_internal/api/zod-schema';

const UseListCollectibleActivitiesSchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	tokenId: z.string(),
	query: pageSchema
		.extend({
			enabled: z.boolean().optional(),
		})
		.optional(),
});

export type UseListCollectibleActivitiesArgs = z.infer<
	typeof UseListCollectibleActivitiesSchema
>;

export type UseListCollectibleActivitiesReturn = Awaited<
	ReturnType<typeof fetchCollectibleActivities>
>;

const fetchCollectibleActivities = async (
	args: UseListCollectibleActivitiesArgs,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient
		.listCollectibleActivities({
			contractAddress: args.collectionAddress,
			tokenId: args.tokenId,
			page: args.query?.enabled
				? {
						page: args.query.page ?? 1,
						pageSize: args.query.pageSize ?? 10,
						sort: args.query.sort,
					}
				: undefined,
		})
		.then((data) => ({
			activities: data.activities,
			page: data.page,
		}));
};

export const listCollectibleActivitiesOptions = (
	args: UseListCollectibleActivitiesArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: [...collectableKeys.collectibleActivities, args, config],
		queryFn: () => fetchCollectibleActivities(args, config),
	});
};

export const useListCollectibleActivities = (
	args: UseListCollectibleActivitiesArgs,
) => {
	const config = useConfig();
	return useQuery(listCollectibleActivitiesOptions(args, config));
};
