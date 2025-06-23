'use client';

import { Text } from '@0xsequence/design-system';
import type { ContractType, OrderbookKind } from '@0xsequence/marketplace-sdk';
import { ContractType as ContractTypeEnum } from '@0xsequence/marketplace-sdk';
import type { CollectibleCardProps } from '@0xsequence/marketplace-sdk/react';
import {
	useCollection,
	useFilterState,
	useListMarketCardData,
	useListPrimarySaleItems,
	useListShopCardData,
	useMarketplaceConfig,
} from '@0xsequence/marketplace-sdk/react';
import type { Address } from 'viem';
import { useMarketplace } from '../../store';
import { CollectibleCardRenderer } from '../collectibles/CollectibleCardRenderer';
import { InfiniteScrollView } from '../collectibles/InfiniteScrollView';
import { PaginatedView } from '../collectibles/PaginatedView';
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
	onCollectibleClick,
	showMarketTypeToggle = false,
	showFilters = false,
	showSaleControls = false,
	renderSaleControls,
}: CollectiblesPageControllerProps) {
	const {
		collectionAddress,
		chainId,
		setCollectibleId,
		orderbookKind,
		paginationMode,
		marketplaceType,
	} = useMarketplace();

	const { filterOptions, searchText, showListedOnly } = useFilterState();

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

	// Market data for market mode or non-shop mode
	const {
		collectibleCards: marketCards,
		isLoading: marketLoading,
		hasNextPage: marketHasNextPage,
		isFetchingNextPage: marketIsFetchingNextPage,
		fetchNextPage: marketFetchNextPage,
		allCollectibles: marketAllCollectibles,
	} = useListMarketCardData({
		collectionAddress,
		chainId,
		orderbookKind: orderbookKind as OrderbookKind,
		collectionType: collection?.type as ContractType,
		onCollectibleClick: handleCollectibleClick,
		filterOptions: showFilters ? filterOptions : undefined,
		searchText: showFilters ? searchText : undefined,
		showListedOnly: showFilters ? showListedOnly : undefined,
	});

	// Shop data for shop mode
	const { collectibleCards: shopCards, isLoading: shopCardDataLoading } =
		useListShopCardData({
			tokenIds: saleItemIds,
			chainId,
			contractAddress: collectionAddress as Address,
			salesContractAddress: saleContractAddress as Address,
			contractType: collection?.type as ContractType,
			enabled: isShop && saleItemIds.length > 0,
		});

	function handleCollectibleClick(tokenId: string) {
		setCollectibleId(tokenId);
		onCollectibleClick(tokenId);
	}

	// Use appropriate data based on mode
	const collectibleCards = isShop ? shopCards : marketCards;
	const isLoading = isShop
		? isLoadingPrimarySaleItems || shopCardDataLoading || collectionLoading
		: marketLoading;
	const hasNextPage = isShop ? false : marketHasNextPage; // Shop mode doesn't support infinite scroll yet
	const isFetchingNextPage = isShop ? false : marketIsFetchingNextPage;
	const fetchNextPage = isShop ? undefined : marketFetchNextPage;
	const allCollectibles = isShop ? [] : marketAllCollectibles; // Shop data structure is different

	const renderItemContent = (
		index: number,
		collectibleCard: CollectibleCardProps,
	) => (
		<CollectibleCardRenderer
			index={index}
			collectibleCard={collectibleCard}
			isLoading={collectionLoading}
		/>
	);

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

			{paginationMode === 'paginated' ? (
				<PaginatedView
					collectibleCards={collectibleCards}
					renderItemContent={renderItemContent}
					isLoading={isLoading}
				/>
			) : (
				<InfiniteScrollView
					collectionAddress={collectionAddress}
					chainId={chainId}
					collectibleCards={collectibleCards}
					collectiblesLoading={isLoading}
					hasNextPage={hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
					fetchNextPage={fetchNextPage}
					renderItemContent={renderItemContent}
					allCollectibles={allCollectibles}
					showFilters={showFilters}
				/>
			)}
		</div>
	);
}
