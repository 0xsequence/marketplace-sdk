import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { Page, SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	type ListCollectiblesArgs,
	QueryArgSchema,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
import { listCollectiblesArgsSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const UseListCollectiblesArgsSchema = listCollectiblesArgsSchema
	.omit({
		contractAddress: true,
	})
	.extend({
		collectionAddress: AddressSchema,
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
	marketplaceClient: Awaited<ReturnType<typeof getMarketplaceClient>>,
	page: Page,
) => {
	const parsedArgs = UseListCollectiblesArgsSchema.parse(args);
	const arg = {
		...parsedArgs,
		contractAddress: parsedArgs.collectionAddress,
		page: page,
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
			fetchCollectibles(args, marketplaceClient, pageParam),
		initialPageParam: { page: 1, pageSize: 30 },
		getNextPageParam: (lastPage) =>
			lastPage.page?.more ? lastPage.page : undefined,
	});
};

export const useListCollectibles = (args: UseListCollectiblesArgs) => {
	const config = useConfig();
	return useInfiniteQuery(listCollectiblesOptions(args, config));
};
