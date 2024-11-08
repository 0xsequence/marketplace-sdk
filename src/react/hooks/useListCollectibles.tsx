import {
	ChainIdSchema,
	type ListCollectiblesArgs,
	type Page,
	QueryArgSchema,
	collectableKeys,
	getMarketplaceClient,
} from '@internal';
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { z } from 'zod';
import { listCollectiblesArgsSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const UseListCollectiblesArgsSchema = listCollectiblesArgsSchema
	.omit({
		contractAddress: true,
	})
	.extend({
		collectionAddress: z.string(),
		chainId: ChainIdSchema.pipe(z.coerce.string()),
		query: QueryArgSchema,
	});

export type UseListCollectiblesArgs = z.infer<
	typeof UseListCollectiblesArgsSchema
>;

export type UseListCollectiblesReturn = Awaited<
	ReturnType<typeof fetchCollectibles>
>;

const fetchCollectibles = async (
	args: UseListCollectiblesArgs,
	page: Page,
	marketplaceClient: Awaited<ReturnType<typeof getMarketplaceClient>>,
) => {
	const parsedArgs = UseListCollectiblesArgsSchema.parse(args);
	const arg = {
		...parsedArgs,
		contractAddress: parsedArgs.collectionAddress,
		page,
	} satisfies ListCollectiblesArgs;

	return marketplaceClient.listCollectibles(arg);
};

export const listCollectiblesOptions = (
	args: UseListCollectiblesArgs,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return infiniteQueryOptions({
		queryKey: [...collectableKeys.lists, args, marketplaceClient],
		queryFn: ({ pageParam }) =>
			fetchCollectibles(args, pageParam, marketplaceClient),
		initialPageParam: { page: 1, pageSize: 30 },
		getNextPageParam: (lastPage) =>
			lastPage.page?.more ? lastPage.page : undefined,
	});
};

export const useListCollectibles = (args: UseListCollectiblesArgs) => {
	const config = useConfig();
	return useInfiniteQuery(listCollectiblesOptions(args, config));
};
