import { type Page, SortOrder } from '@0xsequence/indexer';
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	balanceQueries,
	getIndexerClient,
} from '../_internal';
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

const useListBalancesArgsSchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.number()),
	accountAddress: AddressSchema.optional(),
	contractAddress: AddressSchema.optional(),
	tokenId: z.string().optional(),
	includeMetadata: z.boolean().optional(),
	metadataOptions: metadataOptionsSchema.optional(),
	includeCollectionTokens: z.boolean().optional(),
	page: pageSchema.optional(),
	query: QueryArgSchema,
});

export type UseFetchTokenBalancesReturn = Awaited<
	ReturnType<typeof fetchBalances>
>;

export type UseListBalancesArgs = z.input<typeof useListBalancesArgsSchema>;

const fetchBalances = async (
	args: UseListBalancesArgs,
	page: Page,
	config: SdkConfig,
) => {
	const parsedArgs = useListBalancesArgsSchema.parse(args);
	const indexerClient = getIndexerClient(parsedArgs.chainId, config);

	return indexerClient.getTokenBalances({
		...parsedArgs,
		tokenID: parsedArgs.tokenId,
		page: page,
	});
};

export const listBalancesOptions = (
	args: UseListBalancesArgs,
	config: SdkConfig,
) => {
	return infiniteQueryOptions({
		...args.query,
		queryKey: [...balanceQueries.lists, args, config],
		queryFn: ({ pageParam }: { pageParam: Page }) =>
			fetchBalances(args, pageParam, config),
		initialPageParam: { page: 1, pageSize: 30 } as Page,
		getNextPageParam: (lastPage) => lastPage.page.after,
	});
};

export const useListBalances = (args: UseListBalancesArgs) => {
	const config = useConfig();
	return useInfiniteQuery(listBalancesOptions(args, config));
};
