import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import { collectableKeys, getMarketplaceClient } from '../_internal';
import type { OrderFilter } from '../_internal/api/marketplace.gen';
import { useConfig } from './useConfig';

/**
 * Arguments for counting listings on a specific collectable
 */
export interface UseCountListingsForCollectibleArgs {
	/** The blockchain network ID (e.g., 1 for Ethereum mainnet, 137 for Polygon) */
	chainId: number;
	/** The contract address of the NFT collection */
	collectionAddress: Address;
	/** The specific token ID within the collection */
	collectibleId: string;
	/** Optional filters to apply when counting listings */
	filter?: OrderFilter;
	/** Query configuration options */
	query?: {
		/** Whether the query should be enabled/disabled */
		enabled?: boolean;
	};
}

/**
 * Return type for the useCountListingsForCollectible hook containing the count of listings
 */
export type UseCountListingsForCollectibleReturn = Awaited<
	ReturnType<typeof fetchCountListingsForCollectible>
>;

const fetchCountListingsForCollectible = async (
	args: UseCountListingsForCollectibleArgs,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient.getCountOfListingsForCollectible({
		contractAddress: args.collectionAddress,
		tokenId: args.collectibleId,
		filter: args.filter,
	});
};

export const countListingsForCollectibleOptions = (
	args: UseCountListingsForCollectibleArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.listingsCount, args, config],
		queryFn: () => fetchCountListingsForCollectible(args, config),
	});
};

/**
 * Hook to count the number of active listings for a specific collectable
 *
 * Returns the total count of active listings (for sale) for a specific NFT, with optional
 * filtering by marketplace, creator addresses, or currency types.
 *
 * @param args - Configuration object containing collection details and optional filters
 * @returns React Query result with listing count, loading state, and error handling
 *
 * @example
 * ```tsx
 * const { data: listingCount, isLoading, error } = useCountListingsForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123',
 *   filter: {
 *     marketplace: [MarketplaceKind.sequence_marketplace_v2],
 *     currencies: ['0x...'] // Only ETH listings
 *   }
 * });
 *
 * if (isLoading) return <div>Loading listing count...</div>;
 * if (error) return <div>Error loading listings</div>;
 *
 * return <div>{listingCount?.count} listings available</div>;
 * ```
 */
export const useCountListingsForCollectible = (
	args: UseCountListingsForCollectibleArgs,
) => {
	const config = useConfig();
	return useQuery(countListingsForCollectibleOptions(args, config));
};
