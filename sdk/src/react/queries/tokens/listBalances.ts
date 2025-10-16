import type { GetTokenBalancesReturn, Page } from '@0xsequence/indexer';
import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Address, Hex } from 'viem';
import type { SdkConfig } from '../../../types';
import { balanceQueries, getIndexerClient } from '../../_internal';

export type UseListBalancesArgs = {
	chainId: number;
	accountAddress?: Address;
	contractAddress?: Address;
	tokenId?: string;
	includeMetadata?: boolean;
	metadataOptions?: {
		verifiedOnly?: boolean;
		unverifiedOnly?: boolean;
		includeContracts?: Hex[];
	};
	includeCollectionTokens?: boolean;
	page?: Page;
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
	const indexerClient = getIndexerClient(args.chainId, config);
	return indexerClient.getTokenBalances({
		...args,
		tokenID: args.tokenId,
		page: page,
	});
}

export function getListBalancesQueryKey(args: UseListBalancesArgs) {
	const apiArgs = {
		chainId: args.chainId,
		accountAddress: args.accountAddress,
		contractAddress: args.contractAddress,
		tokenID: args.tokenId,
		includeMetadata: args.includeMetadata,
		metadataOptions: args.metadataOptions,
		includeCollectionTokens: args.includeCollectionTokens,
	};

	return [...balanceQueries.lists, apiArgs] as const;
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
		queryKey: getListBalancesQueryKey(args),
		queryFn: ({ pageParam }) => fetchBalances(args, config, pageParam),
		initialPageParam: { page: 1, pageSize: 30 } as Page,
		getNextPageParam: (lastPage) => lastPage.page.after,
	});
}
