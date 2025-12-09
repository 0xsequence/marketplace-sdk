'use client';

import { Text } from '@0xsequence/design-system';
import { ContractType as ContractTypeEnum } from '@0xsequence/marketplace-sdk';
import {
	useCollection,
	useListPrimarySaleItems,
	useMarketplaceConfig,
} from '@0xsequence/marketplace-sdk/react';
import type { Address } from 'viem';
import { useMarketplace } from '../../store';
import { FilterBadges } from '../filters/badges/FilterBadges';
import { MarketContent } from './MarketContent';
import { ShopContent } from './ShopContent';

export interface CollectiblesPageControllerProps {
	onCollectibleClick: (tokenId: string) => void;
	showMarketTypeToggle?: boolean;
	showFilters?: boolean;
	showSaleControls?: boolean;
	renderSaleControls?: (props: {
		chainId: number;
		salesContractAddress: Address;
		collectionAddress: Address;
		tokenIds: string[];
		isLoading: boolean;
		salePrice?: {
			amount?: bigint;
			currencyAddress?: Address;
		};
	}) => React.ReactNode;
	collectionAddress: Address;
	chainId: number;
}

export function CollectiblesPageController({
	onCollectibleClick,
	showMarketTypeToggle = false,
	showFilters = false,
	showSaleControls = false,
	renderSaleControls,
	collectionAddress,
	chainId,
}: CollectiblesPageControllerProps) {
	const { paginationMode, cardType } = useMarketplace();

	const { data: marketplaceConfig } = useMarketplaceConfig();
	const saleConfig = marketplaceConfig?.shop.collections.find(
		(c) => c.itemsAddress === collectionAddress,
	);
	const isShop = showMarketTypeToggle && cardType === 'shop';
	const saleContractAddress = saleConfig?.saleAddress as Address;

	const { data: collection, isLoading: collectionLoading } = useCollection({
		collectionAddress,
		chainId,
		query: {
			enabled: isShop || !showMarketTypeToggle,
		},
	});

	const { data: primarySaleItems, isLoading: isLoadingPrimarySaleItems } =
		useListPrimarySaleItems({
			chainId,
			primarySaleContractAddress: saleContractAddress,
			query: {
				enabled: isShop && !!saleContractAddress,
			},
		});
	const ERC721SalePrice = {
		amount:
			primarySaleItems?.pages[0].primarySaleItems[0].primarySaleItem
				.priceAmount,
		currencyAddress: primarySaleItems?.pages[0].primarySaleItems[0]
			.primarySaleItem.currencyAddress as Address,
	};

	const saleItemIds = isShop
		? (primarySaleItems?.pages
				.flatMap((page) => page.primarySaleItems)
				.map((item) => item.primarySaleItem.tokenId?.toString() ?? '')
				.filter(Boolean) ?? [])
		: [];

	const is721 = collection?.type === ContractTypeEnum.ERC721;

	return (
		<div className="flex flex-col gap-4 pt-3">
			<div className="flex items-center justify-between">
				<Text variant="large">
					{showMarketTypeToggle ? (isShop ? 'Shop' : 'Market') : 'Collectibles'}
				</Text>
				<Text variant="small" color="text80">
					Mode: {paginationMode === 'paged' ? 'Paginated' : 'Infinite Scroll'}
				</Text>
			</div>

			{showSaleControls &&
				isShop &&
				is721 &&
				renderSaleControls &&
				renderSaleControls({
					chainId,
					salesContractAddress: saleContractAddress,
					collectionAddress: collectionAddress as Address,
					tokenIds: saleItemIds,
					isLoading: collectionLoading || isLoadingPrimarySaleItems,
					salePrice: ERC721SalePrice,
				})}

			{showFilters && (
				<FilterBadges chainId={chainId} collectionAddress={collectionAddress} />
			)}

			{isShop ? (
				<ShopContent
					saleContractAddress={saleContractAddress}
					saleItemIds={saleItemIds}
					collectionAddress={collectionAddress}
					chainId={chainId}
					onCollectibleClick={onCollectibleClick}
				/>
			) : (
				<MarketContent
					collectionAddress={collectionAddress}
					chainId={chainId}
					onCollectibleClick={onCollectibleClick}
				/>
			)}
		</div>
	);
}
