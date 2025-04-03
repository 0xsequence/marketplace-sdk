import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { Page, SdkConfig } from '../../types';
import {
	AddressSchema,
	type ListCollectiblesArgs,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
import { listCollectiblesArgsSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const UseListCollectiblesPaginatedArgsSchema = listCollectiblesArgsSchema
	.omit({
		contractAddress: true,
	})
	.extend({
		collectionAddress: AddressSchema,
		chainId: z.number(),
		query: z
			.object({
				enabled: z.boolean().optional(),
				page: z.number().optional().default(1),
				pageSize: z.number().optional().default(30),
			})
			.optional()
			.default({}),
	});

export type UseListCollectiblesPaginatedArgs = z.infer<
	typeof UseListCollectiblesPaginatedArgsSchema
>;

export type UseListCollectiblesPaginatedReturn = Awaited<
	ReturnType<typeof fetchCollectiblesPaginated>
>;

const fetchCollectiblesPaginated = async (
	args: UseListCollectiblesPaginatedArgs,
	marketplaceClient: Awaited<ReturnType<typeof getMarketplaceClient>>,
) => {
	const parsedArgs = UseListCollectiblesPaginatedArgsSchema.parse(args);
	const page: Page = {
		page: parsedArgs.query?.page ?? 1,
		pageSize: parsedArgs.query?.pageSize ?? 30,
	};

	const arg = {
		...parsedArgs,
		contractAddress: parsedArgs.collectionAddress,
		page,
	} as ListCollectiblesArgs;

	return marketplaceClient.listCollectibles(arg);
};

export const listCollectiblesPaginatedOptions = (
	args: UseListCollectiblesPaginatedArgs,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return queryOptions({
		queryKey: [...collectableKeys.lists, 'paginated', args],
		queryFn: () => fetchCollectiblesPaginated(args, marketplaceClient),
		enabled: args.query?.enabled ?? true,
	});
};

export const useListCollectiblesPaginated = (
	args: UseListCollectiblesPaginatedArgs,
) => {
	const config = useConfig();
	return useQuery(listCollectiblesPaginatedOptions(args, config));
};
