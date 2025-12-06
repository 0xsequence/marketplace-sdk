'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type CollectionBalanceDetailsQueryOptions,
	type CollectionBalanceFilter,
	collectionBalanceDetailsQueryOptions,
	type FetchCollectionBalanceDetailsParams,
	type fetchCollectionBalanceDetails,
} from '../../queries/collection/balance-details';
import { useConfig } from '../config/useConfig';

export type UseCollectionBalanceDetailsParams = Optional<
	CollectionBalanceDetailsQueryOptions,
	'config'
>;

/**
 * Hook to fetch detailed balance information for multiple accounts
 *
 * Retrieves token balances and native balances for multiple account addresses,
 * with support for contract whitelisting and optional native balance exclusion.
 * Aggregates results from multiple account addresses into a single response.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.filter - Filter configuration for balance queries
 * @param params.filter.accountAddresses - Array of account addresses to query balances for
 * @param params.filter.contractWhitelist - Optional array of contract addresses to filter by
 * @param params.filter.omitNativeBalances - Whether to exclude native token balances
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing aggregated balance details for all accounts
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: balanceDetails, isLoading } = useCollectionBalanceDetails({
 *   chainId: 137,
 *   filter: {
 *     accountAddresses: ['0x1234...', '0x5678...'],
 *     omitNativeBalances: false
 *   }
 * })
 *
 * if (data) {
 *   console.log(`Found ${data.balances.length} token balances`);
 *   console.log(`Found ${data.nativeBalances.length} native balances`);
 * }
 * ```
 *
 * @example
 * With contract whitelist:
 * ```typescript
 * const { data: balanceDetails } = useCollectionBalanceDetails({
 *   chainId: 1,
 *   filter: {
 *     accountAddresses: [userAddress],
 *     contractWhitelist: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'], // USDC only
 *     omitNativeBalances: true
 *   },
 *   query: {
 *     enabled: Boolean(userAddress),
 *     refetchInterval: 60000 // Refresh every minute
 *   }
 * })
 * ```
 */
export function useCollectionBalanceDetails(
	params: UseCollectionBalanceDetailsParams,
) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = collectionBalanceDetailsQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { collectionBalanceDetailsQueryOptions };

export type {
	FetchCollectionBalanceDetailsParams,
	CollectionBalanceDetailsQueryOptions,
	CollectionBalanceFilter,
};

// Legacy exports for backward compatibility
export type UseCollectionBalanceDetailsArgs = {
	chainId: number;
	filter: CollectionBalanceFilter;
	query?: {
		enabled?: boolean;
	};
};

export type UseCollectionBalanceDetailsReturn = Awaited<
	ReturnType<typeof fetchCollectionBalanceDetails>
>;
