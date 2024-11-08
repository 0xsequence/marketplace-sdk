import { type Page, SortOrder } from '@0xsequence/indexer';
import { QueryArgSchema, balanceQueries, getIndexerClient } from '@internal';
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { z } from 'zod';
import { useConfig } from './useConfig';

export const metadataOptionsSchema = z.object({
	verifiedOnly: z.boolean().optional(),
	unverifiedOnly: z.boolean().optional(),
	includeContracts: z.array(z.string()).optional(),
});

const sortOrderSchema = z.nativeEnum(SortOrder);

const sortBySchema = z.object({
	column: z.string(),
	order: sortOrderSchema,
});

const pageSchema = z.object({
	page: z.number().optional(),
	column: z.string().optional(),
	before: z.any().optional(),
	after: z.any().optional(),
	sort: z.array(sortBySchema).optional(),
	pageSize: z.number().optional(),
	more: z.boolean().optional(),
});

const useTokenBalancesArgsSchema = z.object({
	chainId: z.number(),
	accountAddress: z.string().optional(),
	contractAddress: z.string().optional(),
	tokenId: z.string().optional(),
	includeMetadata: z.boolean().optional(),
	metadataOptions: metadataOptionsSchema.optional(),
	includeCollectionTokens: z.boolean().optional(),
	page: pageSchema.optional(),
	query: QueryArgSchema,
});

export type UseFetchTokenBalancesReturn = Awaited<
	ReturnType<typeof fetchTokenBalances>
>;

export type UseTokenBalancesArgs = z.infer<typeof useTokenBalancesArgsSchema>;

const fetchTokenBalances = async (
	args: UseTokenBalancesArgs,
	page: Page,
	config: SdkConfig,
) => {
	const parsedArgs = useTokenBalancesArgsSchema.parse(args);
	const indexerClient = getIndexerClient(parsedArgs.chainId, config);

	return indexerClient.getTokenBalances({
		...parsedArgs,
		tokenID: parsedArgs.tokenId,
		page: page,
	});
};

export const tokenBalancesOptions = (
	args: UseTokenBalancesArgs,
	config: SdkConfig,
) => {
	return infiniteQueryOptions({
		...args.query,
		queryKey: [...balanceQueries.lists, args, config],
		queryFn: ({ pageParam }: { pageParam: Page }) =>
			fetchTokenBalances(args, pageParam, config),
		initialPageParam: { page: 1, pageSize: 30 } as Page,
		getNextPageParam: (lastPage) => lastPage.page.after,
	});
};

export const useTokenBalances = (args: UseTokenBalancesArgs) => {
	const config = useConfig();
	return useInfiniteQuery(tokenBalancesOptions(args, config));
};
