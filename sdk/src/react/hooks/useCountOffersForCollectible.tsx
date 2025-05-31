import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import { collectableKeys, getMarketplaceClient } from '../_internal';
import type { OrderFilter } from '../_internal/api/marketplace.gen';
import { useConfig } from './useConfig';

/**
 * Arguments for counting offers on a specific collectable
 */
export interface UseCountOffersForCollectibleArgs {
	/** The blockchain network ID (e.g., 1 for Ethereum mainnet, 137 for Polygon) */
	chainId: number;
	/** The contract address of the NFT collection */
	collectionAddress: Address;
	/** The specific token ID within the collection */
	collectibleId: string;
	/** Optional filters to apply when counting offers */
	filter?: OrderFilter;
	/** Query configuration options */
	query?: {
		/** Whether the query should be enabled/disabled */
		enabled?: boolean;
	};
}

/**
 * Return type for the useCountOffersForCollectible hook containing the count of offers
 */
export type UseCountOffersForCollectibleReturn = Awaited<
	ReturnType<typeof fetchCountOffersForCollectible>
>;

const fetchCountOffersForCollectible = async (
	args: UseCountOffersForCollectibleArgs,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient.getCountOfOffersForCollectible({
		contractAddress: args.collectionAddress,
		tokenId: args.collectibleId,
		filter: args.filter,
	});
};

export const countOffersForCollectibleOptions = (
	args: UseCountOffersForCollectibleArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.offersCount, args, config],
		queryFn: () => fetchCountOffersForCollectible(args, config),
	});
};

/**
 * Hook to count the number of offers for a specific collectable
 *
 * Returns the total count of active offers on a specific NFT, with optional
 * filtering by marketplace, creator addresses, or currency types.
 *
 * @param args - Configuration object containing collection details and optional filters
 * @returns React Query result with offer count, loading state, and error handling
 *
 * @example
 * ```tsx
 * const { data: offerCount, isLoading, error } = useCountOffersForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123',
 *   filter: {
 *     marketplace: [MarketplaceKind.opensea],
 *     currencies: ['0x...'] // Only USDC offers
 *   }
 * });
 *
 * if (isLoading) return <div>Loading offer count...</div>;
 * if (error) return <div>Error loading offers</div>;
 *
 * return <div>{offerCount?.count} offers available</div>;
 * ```
 */
export const useCountOffersForCollectible = (
	args: UseCountOffersForCollectibleArgs,
) => {
	const config = useConfig();
	return useQuery(countOffersForCollectibleOptions(args, config));
};
