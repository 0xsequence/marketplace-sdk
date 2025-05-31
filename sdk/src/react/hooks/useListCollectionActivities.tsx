import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import { getMarketplaceClient } from '../_internal';
import { collectionKeys } from '../_internal/api';
import type { Activity, Page, SortBy } from '../_internal/api/marketplace.gen';
import { useConfig } from './useConfig';

/**
 * Arguments for listing collection activities
 */
export interface UseListCollectionActivitiesArgs {
	/** The blockchain network ID (e.g., 1 for Ethereum mainnet, 137 for Polygon) */
	chainId: number;
	/** The contract address of the NFT collection */
	collectionAddress: Address;
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
 * Return type for the useListCollectionActivities hook containing activity data
 */
export interface UseListCollectionActivitiesReturn {
	/** Array of activity records for the collection */
	activities: Activity[];
	/** Pagination information */
	page?: Page;
}

const fetchListCollectionActivities = async (
	args: UseListCollectionActivitiesArgs,
	config: SdkConfig,
): Promise<UseListCollectionActivitiesReturn> => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient
		.listCollectionActivities({
			contractAddress: args.collectionAddress,
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

export const listCollectionActivitiesOptions = (
	args: UseListCollectionActivitiesArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: [...collectionKeys.collectionActivities, args, config],
		queryFn: () => fetchListCollectionActivities(args, config),
		enabled: args.query?.enabled ?? true,
	});
};

/**
 * Hook to list activity history for an entire collection
 *
 * Retrieves the activity history (transfers, sales, listings, offers) for all collectables
 * within a specific NFT collection, including transaction hashes, timestamps, and participants.
 *
 * @param args - Configuration object containing collection details and pagination options
 * @returns React Query result with activity data, loading state, and error handling
 *
 * @example
 * ```tsx
 * const { data: activityData, isLoading, error } = useListCollectionActivities({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   query: {
 *     page: 1,
 *     pageSize: 50,
 *     enabled: true
 *   }
 * });
 *
 * if (isLoading) return <div>Loading collection activity...</div>;
 * if (error) return <div>Error loading activity</div>;
 *
 * return (
 *   <div>
 *     <h3>Collection Activity ({activityData?.activities.length} events)</h3>
 *     {activityData?.activities.map((activity, index) => (
 *       <div key={index}>
 *         <p>{activity.type} - Token #{activity.tokenId}</p>
 *         <p>From: {activity.fromAddress} To: {activity.toAddress}</p>
 *         <p>Time: {new Date(activity.timestamp * 1000).toLocaleString()}</p>
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useListCollectionActivities = (
	args: UseListCollectionActivitiesArgs,
) => {
	const config = useConfig();
	return useQuery(listCollectionActivitiesOptions(args, config));
};
