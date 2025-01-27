import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import { collectableKeys, getMarketplaceClient } from '../_internal';
import { useConfig } from './useConfig';
import {
	getListCollectibleActivitiesArgsSchema,
	getListCollectibleActivitiesReturnSchema,
} from '../_internal/api/zod-schema';

export type UseListCollectibleActivitiesArgs = z.infer<
	typeof getListCollectibleActivitiesArgsSchema
>;

export type UseListCollectibleActivitiesReturn = z.infer<
	typeof getListCollectibleActivitiesReturnSchema
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
