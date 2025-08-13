import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '../../../../types';
import {
	collectableKeys,
	getMarketplaceClient,
	type ListOffersForCollectibleArgs,
} from '../../../_internal';
import type { OrderFilter, Page } from '../../../_internal/api/marketplace.gen';
import { useConfig } from '../../config/useConfig';

interface UseListOffersForCollectibleArgs {
	chainId: number;
	collectionAddress: string;
	collectibleId: string;
	filter?: OrderFilter;
	page?: Page;
}

export type UseListOffersForCollectibleReturn = Awaited<
	ReturnType<typeof fetchListOffersForCollectible>
>;

const fetchListOffersForCollectible = async (
	config: SdkConfig,
	args: UseListOffersForCollectibleArgs,
) => {
	const arg = {
		chainId: String(args.chainId),
		contractAddress: args.collectionAddress,
		tokenId: args.collectibleId,
		filter: args.filter,
		page: args.page,
	} satisfies ListOffersForCollectibleArgs;

	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.listCollectibleOffers(arg);
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
 * Fetches all offers for a specific collectible
 *
 * This hook retrieves a list of active offers made on a specific NFT,
 * including offer details like price, expiry, and maker information.
 * Results can be filtered and paginated as needed.
 *
 * @param args - Configuration for fetching offers
 * @param args.chainId - The blockchain network ID
 * @param args.collectionAddress - The NFT collection contract address
 * @param args.collectibleId - The specific token ID
 * @param args.filter - Optional filter for offers
 * @param args.page - Optional pagination configuration
 *
 * @returns Query result containing offers data
 * @returns returns.data - The offers response when loaded
 * @returns returns.data.offers - Array of offer orders
 * @returns returns.data.page - Pagination information
 * @returns returns.isLoading - True while fetching offers
 * @returns returns.error - Error object if fetching fails
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useListOffersForCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123'
 * });
 *
 * if (isLoading) return <div>Loading offers...</div>;
 *
 * return (
 *   <div>
 *     <h3>{data?.offers.length || 0} offers</h3>
 *     {data?.offers.map(offer => (
 *       <OfferCard key={offer.orderId} offer={offer} />
 *     ))}
 *   </div>
 * );
 * ```
 *
 * @example
 * With filtering and pagination:
 * ```typescript
 * const { data } = useListOffersForCollectible({
 *   chainId: 1,
 *   collectionAddress: collectionAddress,
 *   collectibleId: tokenId,
 *   filter: {
 *     isValid: true,
 *     priceMin: '1000000000000000000' // 1 ETH minimum
 *   },
 *   page: {
 *     page: 1,
 *     pageSize: 20,
 *     sort: [{
 *       column: 'PRICE_PER_TOKEN',
 *       order: 'DESC'
 *     }]
 *   }
 * });
 *
 * // Show highest offers first
 * const topOffers = data?.offers.slice(0, 3);
 * ```
 *
 * @example
 * Checking for user's offers:
 * ```typescript
 * const { address } = useAccount();
 * const { data } = useListOffersForCollectible({
 *   chainId,
 *   collectionAddress,
 *   collectibleId,
 *   filter: {
 *     makers: address ? [address] : []
 *   }
 * });
 *
 * const hasUserOffer = (data?.offers.length || 0) > 0;
 * ```
 *
 * @remarks
 * - Returns only active (non-expired, non-filled) offers by default
 * - Offers are sorted by creation time (newest first) unless specified
 * - The filter parameter allows filtering by maker, price range, validity
 * - Use pagination for collectibles with many offers
 * - Offer prices are in the smallest unit of the currency (wei)
 *
 * @see {@link OrderFilter} - Available filter options
 * @see {@link useHighestOffer} - For getting just the highest offer
 * @see {@link useCountOffersForCollectible} - For getting offer count only
 */
export const useListOffersForCollectible = (
	args: UseListOffersForCollectibleArgs,
) => {
	const config = useConfig();

	return useQuery(listOffersForCollectibleOptions(args, config));
};
