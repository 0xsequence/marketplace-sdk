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
import { InfiniteScrollView } from '../collectibles/InfiniteScrollView';

export interface ShopContentProps {
	saleContractAddress: Address;
	saleItemIds: bigint[];
	collectionAddress: Address;
	chainId: number;
	onCollectibleClick: (tokenId: bigint) => void;
}

export function ShopContent({
	saleContractAddress,
	saleItemIds,
	collectionAddress,
	chainId,
	onCollectibleClick,
}: ShopContentProps) {
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
		.contractType as unknown as ContractType;

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

	function handleCollectibleClick(tokenId: bigint) {
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
			<div
				key={index}
				role="button"
				tabIndex={0}
				onClick={() => handleCollectibleClick(card.tokenId)}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						handleCollectibleClick(card.tokenId);
					}
				}}
				className={cn('w-full cursor-pointer')}
			>
				<CollectibleCard {...card} />
			</div>
		);
	};

	if (!saleContractAddress || !saleItemIds) {
		return <div>No sale contract address or item ids found</div>;
	}

	return (
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
