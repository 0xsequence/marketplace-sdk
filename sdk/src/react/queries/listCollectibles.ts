import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Address, Hex } from 'viem';
import type { Page, SdkConfig } from '../../types';
import { MarketplaceType } from '../../types/new-marketplace-types';
import type {
	CollectiblesFilter,
	ListCollectiblesArgs,
	ListCollectiblesReturn,
} from '../_internal';
import {
	type CollectibleOrder,
	OrderSide,
	collectableKeys,
	getMarketplaceClient,
	getMetadataClient,
} from '../_internal';
import { type UseListBalancesArgs, fetchBalances } from './listBalances';

export type UseListCollectiblesArgs = {
	collectionAddress: Hex;
	chainId: number;
	side: OrderSide;
	filter?: CollectiblesFilter;
	isLaos721?: boolean;
	marketplaceType?: MarketplaceType;
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
	const marketplaceClient = getMarketplaceClient(config);
	const { chainId, collectionAddress, ...restArgs } = args;
	const metadataClient = getMetadataClient(config);
	const parsedArgs = {
		...restArgs,
		chainId: String(chainId),
		contractAddress: collectionAddress,
		page: page,
		side: args.side,
	} satisfies ListCollectiblesArgs;

	if (args.marketplaceType === MarketplaceType.SHOP) {
		const shopCollection = config.tmpShopConfig?.collections.find(
			(collection) => collection.address === args.collectionAddress,
		);

		if (shopCollection) {
			const collectibles = await metadataClient.getTokenMetadata({
				contractAddress: args.collectionAddress,
				tokenIDs: shopCollection.tokenIds,
				chainID: args.chainId.toString(),
			});
			return {
				collectibles: collectibles.tokenMetadata.map((collectible) => ({
					metadata: {
						tokenId: collectible.tokenId,
						attributes: collectible.attributes,
						image: collectible.image,
						name: collectible.name,
						description: collectible.description,
						video: collectible.video,
						audio: collectible.audio,
					},
				})),
			};
		}
	}

	if (args.isLaos721 && args.side === OrderSide.listing) {
		try {
			const fetchBalancesArgs = {
				chainId: args.chainId,
				accountAddress: args.filter?.inAccounts?.[0] as Address,
				contractAddress: args.collectionAddress,
				page: page,
				includeMetadata: true,
				isLaos721: true,
			} satisfies UseListBalancesArgs;

			const balances = await fetchBalances(fetchBalancesArgs, config, page);
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
