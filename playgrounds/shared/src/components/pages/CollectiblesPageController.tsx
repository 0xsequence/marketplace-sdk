'use client';

import { Text } from '@0xsequence/design-system';
import { ContractType as ContractTypeEnum } from '@0xsequence/marketplace-sdk';
import {
	useCollection,
	useListPrimarySaleItems,
	useMarketplaceConfig,
} from '@0xsequence/marketplace-sdk/react';
import type { Address } from 'viem';
import { MarketContent } from '../../../../../playgrounds/react-vite/src/tabs/components/MarketContent';
import { ShopContent } from '../../../../../playgrounds/react-vite/src/tabs/components/ShopContent';
import { useMarketplace } from '../../store';
import { FilterBadges } from '../filters/badges/FilterBadges';

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
	}) => React.ReactNode;
}

export function CollectiblesPageController({
	showMarketTypeToggle = false,
	showFilters = false,
	showSaleControls = false,
	renderSaleControls,
}: CollectiblesPageControllerProps) {
	const { collectionAddress, chainId, paginationMode, marketplaceType } =
		useMarketplace();

	const { data: marketplaceConfig } = useMarketplaceConfig();
	const saleConfig = marketplaceConfig?.shop.collections.find(
		(c) => c.itemsAddress === collectionAddress,
	);
	const isShop = showMarketTypeToggle && marketplaceType === 'shop';
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
					Mode:{' '}
					{paginationMode === 'paginated' ? 'Paginated' : 'Infinite Scroll'}
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
				})}

			{showFilters && <FilterBadges />}

			{isShop ? (
				<ShopContent
					saleContractAddress={saleContractAddress}
					saleItemIds={saleItemIds}
					collectionAddress={collectionAddress as Address}
					chainId={chainId}
					paginationMode={paginationMode}
				/>
			) : (
				<MarketContent />
			)}
		</div>
	);
}
