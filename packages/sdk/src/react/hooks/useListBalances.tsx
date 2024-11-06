import type { MetadataOptions, Page } from '@0xsequence/indexer';
import {
	type ChainId,
	type QueryArg,
	balanceQueries,
	getIndexerClient,
} from '@internal';
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseTokenBalancesArgs = {
	chainId: ChainId;
	accountAddress?: string;
	contractAddress?: string;
	tokenId?: string;
	includeMetadata?: boolean;
	metadataOptions?: MetadataOptions;
	includeCollectionTokens?: boolean;
	page?: Page;
} & QueryArg;

export type UseFetchTokenBalancesReturn = ReturnType<typeof fetchTokenBalances>;

const fetchTokenBalances = async (
	args: UseTokenBalancesArgs,
	page: Page,
	config: SdkConfig,
) => {
	const indexerClient = getIndexerClient(args.chainId, config);

	return indexerClient.getTokenBalances({
		...args,
		tokenID: args.tokenId,
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
