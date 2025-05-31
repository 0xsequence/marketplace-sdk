import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import { collectableKeys, getMarketplaceClient } from '../_internal';
import type {
	CollectiblesFilter,
	ListCollectiblesArgs,
	OrderSide,
	Page,
} from '../_internal/api/marketplace.gen';
import { useConfig } from './useConfig';

/**
 * Arguments for listing collectables with pagination
 */
export interface UseListCollectiblesPaginatedArgs {
	/** The blockchain network ID (e.g., 1 for Ethereum mainnet, 137 for Polygon) */
	chainId: number;
	/** The contract address of the NFT collection */
	collectionAddress: Address;
	/** Order side to filter by (listing or offer) */
	side: OrderSide;
	/** Optional filter criteria for collectables */
	filter?: CollectiblesFilter;
	/** Query configuration options */
	query?: {
		/** Whether the query should be enabled/disabled */
		enabled?: boolean;
		/** Page number for pagination (default: 1) */
		page?: number;
		/** Number of items per page (default: 30) */
		pageSize?: number;
	};
}

/**
 * Return type for the useListCollectiblesPaginated hook containing collectables and pagination
 */
export type UseListCollectiblesPaginatedReturn = Awaited<
	ReturnType<typeof fetchCollectiblesPaginated>
>;

const fetchCollectiblesPaginated = async (
	args: UseListCollectiblesPaginatedArgs,
	marketplaceClient: Awaited<ReturnType<typeof getMarketplaceClient>>,
) => {
	const page: Page = {
		page: args.query?.page ?? 1,
		pageSize: args.query?.pageSize ?? 30,
	};

	const listArgs: ListCollectiblesArgs = {
		side: args.side,
		contractAddress: args.collectionAddress,
		filter: args.filter,
		page,
	};

	return marketplaceClient.listCollectibles(listArgs);
};

export const listCollectiblesPaginatedOptions = (
	args: UseListCollectiblesPaginatedArgs,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return queryOptions({
		queryKey: [...collectableKeys.lists, 'paginated', args],
		queryFn: () => fetchCollectiblesPaginated(args, marketplaceClient),
		enabled: args.query?.enabled ?? true,
	});
};

/**
 * Hook to list collectables with pagination support
 *
 * Retrieves a paginated list of collectables from a collection, with support for filtering
 * by order side (listings or offers), marketplace, properties, and other criteria.
 *
 * @param args - Configuration object containing collection details and pagination options
 * @returns React Query result with collectables data, loading state, and error handling
 *
 * @example
 * ```tsx
 * const { data: collectables, isLoading, error } = useListCollectiblesPaginated({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing,
 *   filter: {
 *     includeEmpty: false,
 *     marketplaces: [MarketplaceKind.opensea],
 *     properties: [{ name: 'rarity', type: PropertyType.STRING, values: ['rare'] }]
 *   },
 *   query: {
 *     page: 1,
 *     pageSize: 20
 *   }
 * });
 *
 * if (isLoading) return <div>Loading collectables...</div>;
 * if (error) return <div>Error loading collectables</div>;
 *
 * return (
 *   <div>
 *     <h3>Found {collectables?.collectibles.length} collectables</h3>
 *     {collectables?.collectibles.map((item, index) => (
 *       <div key={index}>
 *         <h4>{item.metadata.name}</h4>
 *         <p>Price: {item.order?.priceAmountFormatted}</p>
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useListCollectiblesPaginated = (
	args: UseListCollectiblesPaginatedArgs,
) => {
	const config = useConfig();
	return useQuery(listCollectiblesPaginatedOptions(args, config));
};
