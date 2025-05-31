import type { GetTokenBalancesReturn, Page } from '@0xsequence/indexer';
import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Hex } from 'viem';
import type { SdkConfig } from '../../types';
import { LaosAPI, balanceQueries, getIndexerClient } from '../_internal';

export type UseListBalancesArgs = {
	chainId: number;
	accountAddress?: Hex;
	contractAddress?: Hex;
	tokenId?: string;
	includeMetadata?: boolean;
	metadataOptions?: {
		verifiedOnly?: boolean;
		unverifiedOnly?: boolean;
		includeContracts?: Hex[];
	};
	includeCollectionTokens?: boolean;
	page?: Page;
	isLaos721?: boolean;
	//TODO: More options
	query?: {
		enabled?: boolean;
	};
};

export async function fetchBalances(
	args: UseListBalancesArgs,
	config: SdkConfig,
	page: Page,
): Promise<GetTokenBalancesReturn> {
	if (args.isLaos721 && args.accountAddress) {
		const laosClient = new LaosAPI();
		return laosClient.getTokenBalances({
			chainId: args.chainId.toString(),
			accountAddress: args.accountAddress,
			includeMetadata: args.includeMetadata,
			page: {
				sort: [
					{
						column: 'CREATED_AT',
						order: 'DESC',
					},
				],
			},
		});
	}

	const indexerClient = getIndexerClient(args.chainId, config);
	return indexerClient.getTokenBalances({
		...args,
		tokenID: args.tokenId,
		page: page,
	});
}

/**
 * Creates a tanstack infinite query options object for the balances query
 *
 * @param args - The query arguments
 * @param config - SDK configuration
 * @returns Query options configuration
 */
export function listBalancesOptions(
	args: UseListBalancesArgs,
	config: SdkConfig,
) {
	return infiniteQueryOptions({
		...args.query,
		queryKey: [...balanceQueries.lists, args, config],
		queryFn: ({ pageParam }) => fetchBalances(args, config, pageParam),
		initialPageParam: { page: 1, pageSize: 30 } as Page,
		getNextPageParam: (lastPage) => lastPage.page.after,
	});
}
