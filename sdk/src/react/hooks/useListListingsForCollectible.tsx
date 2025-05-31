import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import { collectableKeys, getMarketplaceClient } from '../_internal';
import type {
	ListListingsForCollectibleArgs,
	OrderFilter,
	Page,
} from '../_internal/api/marketplace.gen';
import { useConfig } from './useConfig';

/**
 * Arguments for listing active listings on a collectable
 */
export interface UseListListingsForCollectibleArgs {
	/** The blockchain network ID (e.g., 1 for Ethereum mainnet, 137 for Polygon) */
	chainId: number;
	/** The contract address of the NFT collection */
	collectionAddress: Address;
	/** The specific token ID within the collection */
	collectibleId: string;
	/** Optional filters to apply when listing active listings */
	filter?: OrderFilter;
	/** Pagination options */
	page?: Page;
}

/**
 * Return type for the useListListingsForCollectible hook containing listings data
 */
export type UseListListingsForCollectibleReturn = Awaited<
	ReturnType<typeof fetchListListingsForCollectible>
>;

const fetchListListingsForCollectible = async (
	config: SdkConfig,
	args: UseListListingsForCollectibleArgs,
) => {
	const listArgs: ListListingsForCollectibleArgs = {
		contractAddress: args.collectionAddress,
		tokenId: args.collectibleId,
		filter: args.filter,
		page: args.page,
	};

	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient.listCollectibleListings(listArgs);
};

export const listListingsForCollectibleOptions = (
	args: UseListListingsForCollectibleArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: [...collectableKeys.listings, args, config],
		queryFn: () => fetchListListingsForCollectible(config, args),
	});
};

/**
 * Hook to list active listings for a specific collectable
 *
 * Retrieves all active listings (for sale) for a specific NFT, including listing details
 * such as price, expiration, marketplace, and seller information.
 *
 * @param args - Configuration object containing collection and token details
 * @returns React Query result with listings data, loading state, and error handling
 *
 * @example
 * ```tsx
 * const { data: listingsData, isLoading, error } = useListListingsForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123',
 *   filter: {
 *     marketplace: [MarketplaceKind.sequence_marketplace_v2],
 *     currencies: ['0x...'] // Only ETH listings
 *   },
 *   page: {
 *     page: 1,
 *     pageSize: 10
 *   }
 * });
 *
 * if (isLoading) return <div>Loading listings...</div>;
 * if (error) return <div>Error loading listings</div>;
 *
 * return (
 *   <div>
 *     <h3>Active Listings ({listingsData?.listings.length})</h3>
 *     {listingsData?.listings.map((listing, index) => (
 *       <div key={index}>
 *         <p>Price: {listing.priceAmountFormatted}</p>
 *         <p>Seller: {listing.createdBy}</p>
 *         <p>Expires: {listing.validUntil}</p>
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useListListingsForCollectible = (
	args: UseListListingsForCollectibleArgs,
) => {
	const config = useConfig();

	return useQuery(listListingsForCollectibleOptions(args, config));
};
