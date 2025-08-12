'use client';

import { Switch } from '@0xsequence/design-system';
import { ContractType, cn } from '@0xsequence/marketplace-sdk';
import type { CollectibleCardProps } from '@0xsequence/marketplace-sdk/react';
import {
	CollectibleCard,
	useFilterState,
	useList721ShopCardData,
	useList1155ShopCardData,
	useListPrimarySaleItems,
} from '@0xsequence/marketplace-sdk/react';
import type { Address } from 'viem';
import { useShopFilters } from '../../hooks/useShopFilters';
import { useMarketplace } from '../../store';
import { InfiniteScrollView } from '../collectibles/InfiniteScrollView';
import { PaginatedView } from '../collectibles/PaginatedView';

export interface ShopContentProps {
	saleContractAddress: Address;
	saleItemIds: string[];
	collectionAddress: Address;
	chainId: number;
	onCollectibleClick: (tokenId: string) => void;
}

export function ShopContent({
	saleContractAddress,
	saleItemIds,
	collectionAddress,
	chainId,
	onCollectibleClick,
}: ShopContentProps) {
	const { paginationMode } = useMarketplace();
	const { filterOptions } = useShopFilters();
	const {
		showListedOnly: showAvailableSales,
		setShowListedOnly: setShowAvailableSales,
	} = useFilterState();
	const {
		data: primarySaleItems,
		isLoading: primarySaleItemsLoading,
		fetchNextPage: fetchNextPagePrimarySaleItems,
		hasNextPage: primarySaleItemsHasNextPage,
	} = useListPrimarySaleItems({
		chainId,
		primarySaleContractAddress: saleContractAddress,
		filter: filterOptions,
	});

	// Flatten all primary sale items from all pages
	const allPrimarySaleItems =
		primarySaleItems?.pages.flatMap((page) => page.primarySaleItems) ?? [];

	const contractType = allPrimarySaleItems[0]?.primarySaleItem
		.contractType as ContractType;

	const tokenIds = allPrimarySaleItems.map((item) => item.metadata.tokenId);

	const {
		collectibleCards: collectibleCards721,
		isLoading: cardDataLoading721,
	} = useList721ShopCardData({
		primarySaleItemsWithMetadata: allPrimarySaleItems,
		chainId,
		contractAddress: collectionAddress,
		salesContractAddress: saleContractAddress,
		enabled: tokenIds.length > 0 && contractType === ContractType.ERC721,
	});
	const {
		collectibleCards: collectibleCards1155,
		isLoading: cardDataLoading1155,
	} = useList1155ShopCardData({
		chainId,
		contractAddress: collectionAddress,
		salesContractAddress: saleContractAddress,
		enabled: contractType === ContractType.ERC1155,
		primarySaleItemsWithMetadata: allPrimarySaleItems,
	});

	const collectibleCards =
		contractType === ContractType.ERC721
			? collectibleCards721
			: collectibleCards1155;
	const cardDataLoading =
		contractType === ContractType.ERC721
			? cardDataLoading721
			: cardDataLoading1155;

	function handleCollectibleClick(tokenId: string) {
		onCollectibleClick(tokenId);
	}

	const fetchNextPage = async () => {
		if (primarySaleItemsHasNextPage) {
			await fetchNextPagePrimarySaleItems();
		}
	};

	const renderItemContent = (index: number, card: CollectibleCardProps) => {
		if (!card) return null;

		return (
			<button
				type="button"
				key={index}
				onClick={() => handleCollectibleClick(card.collectibleId)}
				className={cn('w-full cursor-pointer')}
			>
				<CollectibleCard {...card} />
			</button>
		);
	};

	if (!saleContractAddress || !saleItemIds) {
		return <div>No sale contract address or item ids found</div>;
	}

	return paginationMode === 'paginated' ? (
		<PaginatedView
			collectionAddress={collectionAddress}
			chainId={chainId}
			collectibleCards={collectibleCards}
			renderItemContent={renderItemContent}
			isLoading={primarySaleItemsLoading || cardDataLoading}
		/>
	) : (
		<div>
			<div className="mb-4 flex items-center gap-2 rounded-sm bg-background-secondary p-2">
				<Switch
					checked={showAvailableSales}
					onCheckedChange={setShowAvailableSales}
				/>
				<span className="text-sm">Show Available</span>
			</div>

			<InfiniteScrollView
				collectionAddress={collectionAddress}
				chainId={chainId}
				collectibleCards={collectibleCards}
				isLoading={primarySaleItemsLoading || cardDataLoading}
				renderItemContent={renderItemContent}
				hasNextPage={primarySaleItemsHasNextPage}
				isFetchingNextPage={primarySaleItemsLoading}
				fetchNextPage={fetchNextPage}
			/>
		</div>
	);
}
