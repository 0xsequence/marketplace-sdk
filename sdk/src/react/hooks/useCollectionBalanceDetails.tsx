import type { GetTokenBalancesDetailsReturn } from '@0xsequence/indexer';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import { balanceQueries, getIndexerClient } from '../_internal';
import { useConfig } from './useConfig';

/**
 * Filter options for collection balance details
 */
export interface CollectionBalanceFilter {
	/** Array of account addresses to fetch balances for */
	accountAddresses: Address[];
	/** Optional whitelist of contract addresses to include */
	contractWhitelist?: Address[];
	/** Whether to omit native token balances */
	omitNativeBalances: boolean;
}

/**
 * Arguments for fetching collection balance details
 */
export interface UseCollectionBalanceDetailsArgs {
	/** The blockchain network ID (e.g., 1 for Ethereum mainnet, 137 for Polygon) */
	chainId: number;
	/** Filter criteria for balance queries */
	filter: CollectionBalanceFilter;
	/** Query configuration options */
	query?: {
		/** Whether the query should be enabled/disabled */
		enabled?: boolean;
	};
}

const fetchCollectionBalanceDetails = async (
	args: UseCollectionBalanceDetailsArgs,
	indexerClient: Awaited<ReturnType<typeof getIndexerClient>>,
) => {
	const promises = args.filter.accountAddresses.map((accountAddress) =>
		indexerClient.getTokenBalancesDetails({
			filter: {
				accountAddresses: [accountAddress],
				contractWhitelist: args.filter.contractWhitelist,
				omitNativeBalances: args.filter.omitNativeBalances,
			},
		}),
	);

	const responses = await Promise.all(promises);
	const mergedResponse = responses.reduce<GetTokenBalancesDetailsReturn>(
		(acc, curr) => {
			if (!curr) return acc;
			return {
				page: curr.page,
				nativeBalances: [
					...(acc.nativeBalances || []),
					...(curr.nativeBalances || []),
				],
				balances: [...(acc.balances || []), ...(curr.balances || [])],
			};
		},
		{ page: {}, nativeBalances: [], balances: [] },
	);

	if (!mergedResponse) {
		throw new Error('Failed to fetch collection balance details');
	}

	return mergedResponse;
};

export const collectionBalanceDetailsOptions = (
	args: UseCollectionBalanceDetailsArgs,
	config: SdkConfig,
) => {
	const indexerClient = getIndexerClient(args.chainId, config);

	return queryOptions({
		queryKey: [...balanceQueries.collectionBalanceDetails, args, config],
		queryFn: () => fetchCollectionBalanceDetails(args, indexerClient),
		...args.query,
	});
};

/**
 * Hook to fetch detailed balance information for multiple accounts across collections
 *
 * Retrieves comprehensive token balance details including native balances and ERC20/ERC721/ERC1155
 * tokens for specified accounts, with optional filtering by contract addresses.
 *
 * @param args - Configuration object containing chain ID and filter criteria
 * @returns React Query result with detailed balance data, loading state, and error handling
 *
 * @example
 * ```tsx
 * const { data: balanceDetails, isLoading, error } = useCollectionBalanceDetails({
 *   chainId: 137,
 *   filter: {
 *     accountAddresses: ['0x...', '0x...'],
 *     contractWhitelist: ['0x...'], // Optional: only these contracts
 *     omitNativeBalances: false
 *   }
 * });
 *
 * if (isLoading) return <div>Loading balances...</div>;
 * if (error) return <div>Error loading balances</div>;
 *
 * return (
 *   <div>
 *     <h3>Native Balances: {balanceDetails?.nativeBalances.length}</h3>
 *     <h3>Token Balances: {balanceDetails?.balances.length}</h3>
 *   </div>
 * );
 * ```
 */
export const useCollectionBalanceDetails = (
	args: UseCollectionBalanceDetailsArgs,
) => {
	const config = useConfig();
	return useQuery(collectionBalanceDetailsOptions(args, config));
};
