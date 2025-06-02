import { queryOptions, useQuery } from '@tanstack/react-query';
import type { z } from 'zod';
import type { SdkConfig } from '../../types';
import { getMarketplaceClient } from '../_internal';
import { collectionKeys } from '../_internal/api';
import type {
	getListCollectionActivitiesArgsSchema,
	getListCollectionActivitiesReturnSchema,
} from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

export type UseListCollectionActivitiesArgs = z.infer<
	typeof getListCollectionActivitiesArgsSchema
>;

export type UseListCollectionActivitiesReturn = z.infer<
	typeof getListCollectionActivitiesReturnSchema
>;

const fetchListCollectionActivities = async (
	args: UseListCollectionActivitiesArgs,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient
		.listCollectionActivities({
			chainId: String(args.chainId),
			contractAddress: args.collectionAddress,
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

export const listCollectionActivitiesOptions = (
	args: UseListCollectionActivitiesArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: [...collectionKeys.collectionActivities, args, config],
		queryFn: () => fetchListCollectionActivities(args, config),
		enabled: args.query?.enabled ?? true,
	});
};

export const useListCollectionActivities = (
	args: UseListCollectionActivitiesArgs,
) => {
	const config = useConfig();
	return useQuery(listCollectionActivitiesOptions(args, config));
};
