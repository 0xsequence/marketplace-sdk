import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { MarketplaceConfig, Page, SdkConfig } from '../../types';
import type { MarketplaceType } from '../../types/types';
import { compareAddress } from '../../utils';
import type { ValuesOptional } from '../_internal';
import type {
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
import type { StandardInfiniteQueryOptions } from '../types/query';
import { type UseListBalancesArgs, fetchBalances } from './listBalances';

export interface FetchListCollectiblesParams
	extends Omit<ListCollectiblesArgs, 'chainId' | 'contractAddress'> {
	chainId: number;
	collectionAddress: Address;
	isLaos721?: boolean;
	marketplaceType?: MarketplaceType;
	config: SdkConfig;
}

/**
 * Fetches a list of collectibles with pagination support from the Marketplace API
 */
export async function fetchListCollectibles(
	params: FetchListCollectiblesParams,
	marketplaceConfig: MarketplaceConfig,
	page: Page,
): Promise<ListCollectiblesReturn> {
	const { collectionAddress, chainId, config, ...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);

	const apiArgs: ListCollectiblesArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		page: page,
		...additionalApiParams,
	};

	if (params.marketplaceType === 'shop') {
		const shopCollection = marketplaceConfig.shop.collections.find(
			(collection) =>
				compareAddress(collection.itemsAddress, params.collectionAddress),
		);

		if (!shopCollection) {
			return { collectibles: [] };
		}

		const primarySaleItemsList = await marketplaceClient.listPrimarySaleItems(
			{
				chainId: params.chainId.toString(),
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
					supplyCap: item.primarySaleItem.supply,
					itemType: item.primarySaleItem.itemType,
				},
			})),
		};
	}

	if (params.isLaos721 && params.side === OrderSide.listing) {
		try {
			const fetchBalancesArgs = {
				chainId: params.chainId,
				accountAddress: params.filter?.inAccounts?.[0] as Address,
				contractAddress: params.collectionAddress,
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

	return await marketplaceClient.listCollectibles(apiArgs);
}

export type ListCollectiblesQueryOptions =
	ValuesOptional<FetchListCollectiblesParams> & {
		query?: StandardInfiniteQueryOptions;
	};

export function listCollectiblesQueryOptions(
	params: ListCollectiblesQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.side &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return infiniteQueryOptions({
		queryKey: [...collectableKeys.lists, params],
		queryFn: async ({ pageParam }) => {
			const marketplaceConfig = await fetchMarketplaceConfig({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
			});
			return fetchListCollectibles(
				{
					// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
					chainId: params.chainId!,
					// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
					collectionAddress: params.collectionAddress!,
					// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
					config: params.config!,
					// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
					side: params.side!,
					filter: params.filter,
					isLaos721: params.isLaos721,
					marketplaceType: params.marketplaceType,
				},
				marketplaceConfig,
				pageParam,
			);
		},
		initialPageParam: { page: 1, pageSize: 30 } as Page,
		getNextPageParam: (lastPage) =>
			lastPage.page?.more ? lastPage.page : undefined,
		...params.query,
		enabled,
	});
}
