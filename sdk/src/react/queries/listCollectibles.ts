import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Hex } from 'viem';
import type { Page, SdkConfig } from '../../types';
import type {
	CollectibleOrder,
	CollectiblesFilter,
	ListCollectiblesArgs,
	ListCollectiblesReturn,
} from '../_internal';
import { OrderSide, collectableKeys, getMarketplaceClient } from '../_internal';
import { fetchBalances } from './listBalances';
export type UseListCollectiblesArgs = {
	collectionAddress: Hex;
	chainId: number;
	side: OrderSide;
	filter?: CollectiblesFilter;
	isLaos721?: boolean;
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
): Promise<ListCollectiblesReturn> {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	const parsedArgs = {
		...args,
		contractAddress: args.collectionAddress,
		page: page,
		side: args.side,
	} satisfies ListCollectiblesArgs;

	if (args.isLaos721 && args.side === OrderSide.listing) {
		try {
			const balances = await fetchBalances(args, config, page);
			const collectibles: CollectibleOrder[] = balances.balances.map(
				(balance) => {
					if (!balance.tokenMetadata)
						throw new Error('Token metadata not found');
					return {
						metadata: {
							tokenId: balance.tokenID ?? '',
							attributes: balance.tokenMetadata.attributes,
							image: balance.tokenMetadata.image,
							name: balance.tokenMetadata.name,
							description: balance.tokenMetadata.description,
							video: balance.tokenMetadata.video,
							audio: balance.tokenMetadata.audio,
						},
					};
				},
			);
			return {
				collectibles: collectibles,
				//@ts-expect-error
				page: balances.page,
			};
		} catch (error) {
			// If the request fails, ignore the error and return the collectibles from our indexer
			console.error(error);
		}
	}
	return await marketplaceClient.listCollectibles(parsedArgs);
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
