import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Address, Hex } from 'viem';
import type { MarketplaceConfig, Page, SdkConfig } from '../../types';
import type { MarketplaceType } from '../../types/types';
import { compareAddress } from '../../utils';
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
} from '../_internal';
import { fetchMarketplaceConfig } from '../queries/marketplaceConfig';
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
	marketplaceConfig: MarketplaceConfig,
	page: Page,
): Promise<ListCollectiblesReturn> {
	const marketplaceClient = getMarketplaceClient(config);
	const { chainId, collectionAddress, ...restArgs } = args;
	const parsedArgs = {
		...restArgs,
		chainId: String(chainId),
		contractAddress: collectionAddress,
		page: page,
		side: args.side,
	} satisfies ListCollectiblesArgs;

	if (args.marketplaceType === 'shop') {
		const shopCollection = marketplaceConfig.shop.collections.find(
			(collection) =>
				compareAddress(collection.itemsAddress, args.collectionAddress),
		);

		if (!shopCollection) {
			return { collectibles: [] };
		}

		const primarySaleItemsList = await marketplaceClient.listPrimarySaleItems(
			{
				chainId: args.chainId.toString(),
				primarySaleContractAddress: shopCollection.saleAddress as Address,
			},
			marketplaceConfig,
		);

		return {
			collectibles: primarySaleItemsList.primarySaleItems.map((item) => ({
				metadata: item.metadata,
				primarySale: {
					price: {
						amount: item.primarySaleItem.priceAmount,
						formatted: item.primarySaleItem.priceAmountFormatted,
						decimals: item.primarySaleItem.priceDecimals,
						currencyAddress: item.primarySaleItem.currencyAddress,
					},
					startDate: item.primarySaleItem.startDate,
					endDate: item.primarySaleItem.endDate,
					supplyCap: item.primarySaleItem.supplyCap,
					itemType: item.primarySaleItem.itemType,
				},
			})),
		};
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
		queryFn: async ({ pageParam }) => {
			const marketplaceConfig = await fetchMarketplaceConfig({ config });
			return fetchCollectibles(args, config, marketplaceConfig, pageParam);
		},
		initialPageParam: { page: 1, pageSize: 30 } as Page,
		getNextPageParam: (lastPage) =>
			lastPage.page?.more ? lastPage.page : undefined,
	});
}
