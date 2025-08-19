import { useInfiniteQuery } from '@tanstack/react-query';
import { ContractType } from '../../../_internal';
import {
	inventoryOptions,
	type UseInventoryArgs,
} from '../../../queries/inventory';
import { useConfig } from '../../config/useConfig';
import { useMarketplaceConfig } from '../../config/useMarketplaceConfig';

/**
 * Fetches a user's collectible inventory for a specific collection with infinite scroll
 *
 * This hook combines data from both the marketplace API and indexer to provide
 * a complete view of owned collectibles. It automatically detects LAOS ERC-721 collections
 * and handles them appropriately. The hook ensures all owned tokens are returned,
 * even if they're not listed in the marketplace.
 *
 * @param args - Configuration for inventory fetching
 * @param args.accountAddress - The wallet address to fetch inventory for
 * @param args.collectionAddress - The collection contract address
 * @param args.chainId - The blockchain network ID
 * @param args.query - Optional query configuration
 * @param args.query.enabled - Whether to enable the query (default: true)
 *
 * @returns Infinite query result with paginated collectibles
 * @returns returns.data - Pages of collectibles with balance information
 * @returns returns.fetchNextPage - Function to load more collectibles
 * @returns returns.hasNextPage - Whether more pages are available
 * @returns returns.isLoading - True during initial fetch
 * @returns returns.isFetchingNextPage - True while fetching next page
 *
 * @example
 * Basic usage with pagination:
 * ```typescript
 * const {
 *   data,
 *   fetchNextPage,
 *   hasNextPage,
 *   isLoading
 * } = useInventory({
 *   accountAddress: '0x...',
 *   collectionAddress: '0x...',
 *   chainId: 137
 * });
 *
 * const allCollectibles = data?.pages.flatMap(page => page.collectibles) ?? [];
 *
 * return (
 *   <div>
 *     {allCollectibles.map(item => (
 *       <CollectibleCard
 *         key={item.metadata.tokenId}
 *         metadata={item.metadata}
 *         balance={item.balance}
 *       />
 *     ))}
 *     {hasNextPage && (
 *       <button onClick={() => fetchNextPage()}>
 *         Load More
 *       </button>
 *     )}
 *   </div>
 * );
 * ```
 *
 * @example
 * With filtering and balance display:
 * ```typescript
 * const { data } = useInventory({
 *   accountAddress: userAddress,
 *   collectionAddress: collection.address,
 *   chainId: collection.chainId,
 *   query: {
 *     enabled: !!userAddress && isConnected
 *   }
 * });
 *
 * // Get all items across pages
 * const inventory = data?.pages.flatMap(p => p.collectibles) ?? [];
 *
 * // Show ERC1155 balances
 * inventory.forEach(item => {
 *   if (item.contractType === ContractType.ERC1155) {
 *     console.log(`Token ${item.metadata.tokenId}: ${item.balance} owned`);
 *   }
 * });
 * ```
 *
 * @remarks
 * - Combines marketplace API data with indexer data for completeness
 * - Automatically detects and handles LAOS ERC-721 collections
 * - Caches results and maintains state across component re-renders
 * - Returns enriched collectibles with balance and contract info
 * - Handles both ERC-721 and ERC-1155 tokens appropriately
 * - Uses infinite query for efficient pagination of large collections
 *
 * @see {@link UseInventoryArgs} - Full parameter type definition
 * @see {@link CollectibleWithBalance} - The enriched collectible type returned
 * @see {@link useMarketplaceConfig} - Used to detect LAOS collections
 */
export function useInventory(args: UseInventoryArgs) {
	const config = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();

	const isLaos721 =
		marketplaceConfig?.market?.collections?.find(
			(c) =>
				c.itemsAddress === args.collectionAddress && c.chainId === args.chainId,
		)?.contractType === ContractType.LAOS_ERC_721;

	return useInfiniteQuery(inventoryOptions({ ...args, isLaos721 }, config));
}
