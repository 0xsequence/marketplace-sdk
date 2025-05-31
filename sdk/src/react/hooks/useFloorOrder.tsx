import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import { collectableKeys, getMarketplaceClient } from '../_internal';
import { useConfig } from './useConfig';

/**
 * Arguments for fetching the floor order of a collection
 */
export interface UseFloorOrderArgs {
	/** The blockchain network ID (e.g., 1 for Ethereum mainnet, 137 for Polygon) */
	chainId: number;
	/** The contract address of the NFT collection */
	collectionAddress: Address;
	/** Query configuration options */
	query?: {
		/** Whether the query should be enabled/disabled */
		enabled?: boolean;
	};
}

/**
 * Return type for the useFloorOrder hook containing the lowest-priced collectable and its order details
 */
export type UseFloorOrderReturn = Awaited<ReturnType<typeof fetchFloorOrder>>;

const fetchFloorOrder = async (args: UseFloorOrderArgs, config: SdkConfig) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient
		.getFloorOrder({ contractAddress: args.collectionAddress })
		.then((data) => data.collectible);
};

export const floorOrderOptions = (
	args: UseFloorOrderArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: [...collectableKeys.floorOrders, args, config],
		queryFn: () => fetchFloorOrder(args, config),
	});
};

/**
 * Hook to fetch the floor order (lowest-priced listing) for an NFT collection
 *
 * Returns the collectable with the lowest listing price in the specified collection,
 * along with its associated order details including price, marketplace, and timing information.
 *
 * @param args - Configuration object containing chain ID and collection address
 * @returns React Query result with floor order data, loading state, and error handling
 *
 * @example
 * ```tsx
 * const { data: floorOrder, isLoading, error } = useFloorOrder({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * });
 *
 * if (isLoading) return <div>Loading floor price...</div>;
 * if (error) return <div>Error loading floor price</div>;
 *
 * return (
 *   <div>
 *     <h2>Floor Price: {floorOrder?.order?.priceAmountFormatted}</h2>
 *     <img src={floorOrder?.metadata?.image} alt={floorOrder?.metadata?.name} />
 *   </div>
 * );
 * ```
 */
export const useFloorOrder = (args: UseFloorOrderArgs) => {
	const config = useConfig();
	return useQuery(floorOrderOptions(args, config));
};
