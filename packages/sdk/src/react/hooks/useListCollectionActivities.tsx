import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	getMarketplaceClient,
} from '../_internal';
import { collectionKeys, SortOrder } from '../_internal/api';
import { useConfig } from './useConfig';

const PaginationSchema = z.object({
	enabled: z.boolean().optional(),
	page: z.number().optional(),
	pageSize: z.number().optional(),
	sort: z
		.array(
			z.object({
				column: z.string(),
				order: z.nativeEnum(SortOrder),
			}),
		)
		.optional(),
});

const UseListCollectionActivitiesSchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	query: PaginationSchema.optional(),
});

export type UseListCollectionActivitiesArgs = z.infer<
	typeof UseListCollectionActivitiesSchema
>;

export type UseListCollectionActivitiesReturn = Awaited<
	ReturnType<typeof fetchListCollectionActivities>
>;

const fetchListCollectionActivities = async (
	args: UseListCollectionActivitiesArgs,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient
		.listCollectionActivities({
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
	});
};

export const useListCollectionActivities = (
	args: UseListCollectionActivitiesArgs,
) => {
	const config = useConfig();
	return useQuery(listCollectionActivitiesOptions(args, config));
};
