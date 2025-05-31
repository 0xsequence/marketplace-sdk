import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import { collectableKeys, getMarketplaceClient } from '../_internal';
import type {
	ListCollectibleOffersArgs,
	OrderFilter,
	Page,
} from '../_internal/api/marketplace.gen';
import { useConfig } from './useConfig';

/**
 * Arguments for listing offers on a collectable
 */
export interface UseListOffersForCollectibleArgs {
	/** The blockchain network ID (e.g., 1 for Ethereum mainnet, 137 for Polygon) */
	chainId: number;
	/** The contract address of the NFT collection */
	collectionAddress: Address;
	/** The specific token ID within the collection */
	collectibleId: string;
	/** Optional filters to apply when listing offers */
	filter?: OrderFilter;
	/** Pagination options */
	page?: Page;
}

/**
 * Return type for the useListOffersForCollectible hook containing offers data
 */
export type UseListOffersForCollectibleReturn = Awaited<
	ReturnType<typeof fetchListOffersForCollectible>
>;

const fetchListOffersForCollectible = async (
	config: SdkConfig,
	args: UseListOffersForCollectibleArgs,
) => {
	const listArgs: ListCollectibleOffersArgs = {
		contractAddress: args.collectionAddress,
		tokenId: args.collectibleId,
		filter: args.filter,
		page: args.page,
	};

	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient.listCollectibleOffers(listArgs);
};

export const listOffersForCollectibleOptions = (
	args: UseListOffersForCollectibleArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: [...collectableKeys.offers, args, config],
		queryFn: () => fetchListOffersForCollectible(config, args),
	});
};

/**
 * Hook to list offers for a specific collectable
 *
 * Retrieves all active offers (bids) for a specific NFT, including offer details
 * such as price, expiration, marketplace, and bidder information.
 *
 * @param args - Configuration object containing collection and token details
 * @returns React Query result with offers data, loading state, and error handling
 *
 * @example
 * ```tsx
 * const { data: offersData, isLoading, error } = useListOffersForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123',
 *   filter: {
 *     marketplace: [MarketplaceKind.opensea],
 *     currencies: ['0x...'] // Only USDC offers
 *   },
 *   page: {
 *     page: 1,
 *     pageSize: 10
 *   }
 * });
 *
 * if (isLoading) return <div>Loading offers...</div>;
 * if (error) return <div>Error loading offers</div>;
 *
 * return (
 *   <div>
 *     <h3>Active Offers ({offersData?.offers.length})</h3>
 *     {offersData?.offers.map((offer, index) => (
 *       <div key={index}>
 *         <p>Price: {offer.priceAmountFormatted}</p>
 *         <p>From: {offer.createdBy}</p>
 *         <p>Expires: {offer.validUntil}</p>
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useListOffersForCollectible = (
	args: UseListOffersForCollectibleArgs,
) => {
	const config = useConfig();

	return useQuery(listOffersForCollectibleOptions(args, config));
};
