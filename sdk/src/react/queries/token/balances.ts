import type { Indexer } from '@0xsequence/marketplace-api';
import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Address, Hex } from 'viem';
import type { SdkConfig } from '../../../types';
import { getIndexerClient } from '../../_internal';
import { createTokenQueryKey } from './queryKeys';

export type UseListBalancesArgs = {
	chainId: number;
	accountAddress?: Address;
	contractAddress?: Address;
	tokenId?: bigint;
	includeMetadata?: boolean;
	metadataOptions?: {
		verifiedOnly?: boolean;
		unverifiedOnly?: boolean;
		includeContracts?: Hex[];
	};
	includeCollectionTokens?: boolean;
	page?: Indexer.Page;
	//TODO: More options
	query?: {
		enabled?: boolean;
	};
};

export async function fetchBalances(
	args: UseListBalancesArgs,
	config: SdkConfig,
	page: Indexer.Page,
) {
	const indexerClient = getIndexerClient(args.chainId, config);
	return indexerClient.getTokenBalances({
		accountAddress: args.accountAddress!,
		contractAddress: args.contractAddress,
		tokenId: args.tokenId, // API now accepts bigint, no .toString() needed
		includeMetadata: args.includeMetadata,
		metadataOptions: args.metadataOptions,
		page,
	});
}

export function getListBalancesQueryKey(args: UseListBalancesArgs) {
	// Use normalized types for query key (tokenId as bigint)
	const apiArgs = {
		chainId: args.chainId,
		accountAddress: args.accountAddress,
		contractAddress: args.contractAddress,
		tokenId: args.tokenId, // Keep as bigint for query key consistency
		includeMetadata: args.includeMetadata,
		metadataOptions: args.metadataOptions,
		includeCollectionTokens: args.includeCollectionTokens,
	};

	return createTokenQueryKey('balances', apiArgs);
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
		initialPageParam: { page: 1, pageSize: 30, more: false },
		getNextPageParam: (lastPage) =>
			lastPage.page?.more
				? {
						page: lastPage.page.page + 1,
						pageSize: lastPage.page.pageSize,
						more: true,
					}
				: undefined,
	});
}
