import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Hex } from 'viem';
import type { Page, SdkConfig } from '../../types';
import type { CollectiblesFilter, ListCollectiblesArgs } from '../_internal';
import {
	type OrderSide,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';

export type UseListCollectiblesArgs = {
	collectionAddress: Hex;
	chainId: number;
	side: OrderSide;
	filter?: CollectiblesFilter;
	query?: {
		enabled?: boolean;
	};
};

/**
 * Fetches a list of collectibles with pagination support
 *
 * @param args - Arguments for the API call
 * @param config - SDK configuration
 * @param page - Page parameters for pagination
 * @returns The collectibles data
 */
export async function fetchCollectibles(
	args: UseListCollectiblesArgs,
	config: SdkConfig,
	page: Page,
) {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	const parsedArgs = {
		...args,
		contractAddress: args.collectionAddress,
		page: page,
		side: args.side,
	} satisfies ListCollectiblesArgs;

	return marketplaceClient.listCollectibles(parsedArgs);
}

/**
 * Creates a tanstack infinite query options object for the collectibles query
 *
 * @param args - The query arguments
 * @param config - SDK configuration
 * @returns Query options configuration
 */
export function listCollectiblesOptions(
	args: UseListCollectiblesArgs,
	config: SdkConfig,
) {
	return infiniteQueryOptions({
		...args.query,
		queryKey: [...collectableKeys.lists, args, config],
		queryFn: ({ pageParam }) => fetchCollectibles(args, config, pageParam),
		initialPageParam: { page: 1, pageSize: 30 } as Page,
		getNextPageParam: (lastPage) =>
			lastPage.page?.more ? lastPage.page : undefined,
	});
}
