import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import { collectableKeys, getMarketplaceClient } from '../_internal';
import type { Activity, Page, SortBy } from '../_internal/api/marketplace.gen';
import { useConfig } from './useConfig';

/**
 * Arguments for listing collectable activities
 */
export interface UseListCollectibleActivitiesArgs {
	/** The blockchain network ID (e.g., 1 for Ethereum mainnet, 137 for Polygon) */
	chainId: number;
	/** The contract address of the NFT collection */
	collectionAddress: Address;
	/** The specific token ID within the collection */
	tokenId: string;
	/** Query configuration options */
	query?: {
		/** Whether the query should be enabled/disabled */
		enabled?: boolean;
		/** Page number for pagination */
		page?: number;
		/** Number of items per page */
		pageSize?: number;
		/** Sort criteria for the results */
		sort?: SortBy[];
	};
}

/**
 * Return type for the useListCollectibleActivities hook containing activity data
 */
export interface UseListCollectibleActivitiesReturn {
	/** Array of activity records for the collectable */
	activities: Activity[];
	/** Pagination information */
	page?: Page;
}

const fetchCollectibleActivities = async (
	args: UseListCollectibleActivitiesArgs,
	config: SdkConfig,
): Promise<UseListCollectibleActivitiesReturn> => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient
		.listCollectibleActivities({
			contractAddress: args.collectionAddress,
			tokenId: args.tokenId,
			page: args.query
				? {
						page: args.query.page ?? 1,
						pageSize: args.query.pageSize ?? 10,
						sort: args.query.sort,
					}
				: undefined,
		})
		.then((data) => ({
			activities: data.activities,
			page: data.page,
		}));
};

export const listCollectibleActivitiesOptions = (
	args: UseListCollectibleActivitiesArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: [...collectableKeys.collectibleActivities, args, config],
		queryFn: () => fetchCollectibleActivities(args, config),
		enabled: args.query?.enabled ?? true,
	});
};

/**
 * Hook to list activity history for a specific collectable
 *
 * Retrieves the activity history (transfers, sales, listings, offers) for a specific NFT,
 * including transaction hashes, timestamps, participants, and associated marketplaces.
 *
 * @param args - Configuration object containing collection and token details
 * @returns React Query result with activity data, loading state, and error handling
 *
 * @example
 * ```tsx
 * const { data: activityData, isLoading, error } = useListCollectibleActivities({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenId: '123',
 *   query: {
 *     page: 1,
 *     pageSize: 20,
 *     enabled: true
 *   }
 * });
 *
 * if (isLoading) return <div>Loading activity...</div>;
 * if (error) return <div>Error loading activity</div>;
 *
 * return (
 *   <div>
 *     <h3>Recent Activity ({activityData?.activities.length} events)</h3>
 *     {activityData?.activities.map((activity, index) => (
 *       <div key={index}>
 *         <p>{activity.type} - {activity.timestamp}</p>
 *         <p>From: {activity.fromAddress} To: {activity.toAddress}</p>
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useListCollectibleActivities = (
	args: UseListCollectibleActivitiesArgs,
) => {
	const config = useConfig();
	return useQuery(listCollectibleActivitiesOptions(args, config));
};
