import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import { collectableKeys, getMarketplaceClient } from '../_internal';
import type {
	CollectiblesFilter,
	OrderSide,
} from '../_internal/api/marketplace.gen';
import { useConfig } from './useConfig';

/**
 * Arguments for counting collectables in a collection
 */
export interface UseCountOfCollectablesArgs {
	/** The blockchain network ID (e.g., 1 for Ethereum mainnet, 137 for Polygon) */
	chainId: number;
	/** The contract address of the NFT collection */
	collectionAddress: Address;
	/** Optional filter to apply when counting collectables */
	filter?: CollectiblesFilter;
	/** Order side to filter by (listing or offer). Required when filter is provided */
	side?: OrderSide;
	/** Query configuration options */
	query?: {
		/** Whether the query should be enabled/disabled */
		enabled?: boolean;
	};
}

/**
 * Return type for the useCountOfCollectables hook containing the count of collectables
 */
export type UseCountOfCollectablesReturn = Awaited<
	ReturnType<typeof fetchCountOfCollectables>
>;

const fetchCountOfCollectables = async (
	args: UseCountOfCollectablesArgs,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	if (args.filter && args.side) {
		return marketplaceClient
			.getCountOfFilteredCollectibles({
				contractAddress: args.collectionAddress,
				filter: args.filter,
				side: args.side,
			})
			.then((resp) => resp.count);
	}
	return marketplaceClient
		.getCountOfAllCollectibles({
			contractAddress: args.collectionAddress,
		})
		.then((resp) => resp.count);
};

export const countOfCollectablesOptions = (
	args: UseCountOfCollectablesArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.counts, args],
		queryFn: () => fetchCountOfCollectables(args, config),
	});
};

/**
 * Hook to count the total number of collectables in a collection
 *
 * Returns either the total count of all collectables in a collection, or a filtered
 * count based on specific criteria like marketplace, properties, or order status.
 *
 * @param args - Configuration object containing collection details and optional filters
 * @returns React Query result with collectable count, loading state, and error handling
 *
 * @example
 * ```tsx
 * // Count all collectables in a collection
 * const { data: totalCount } = useCountOfCollectables({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * });
 *
 * // Count collectables with active listings
 * const { data: listedCount } = useCountOfCollectables({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   filter: {
 *     includeEmpty: false,
 *     marketplaces: [MarketplaceKind.opensea]
 *   },
 *   side: OrderSide.listing
 * });
 *
 * return (
 *   <div>
 *     <p>Total items: {totalCount}</p>
 *     <p>Listed items: {listedCount}</p>
 *   </div>
 * );
 * ```
 */
export const useCountOfCollectables = (args: UseCountOfCollectablesArgs) => {
	const config = useConfig();
	return useQuery(countOfCollectablesOptions(args, config));
};
