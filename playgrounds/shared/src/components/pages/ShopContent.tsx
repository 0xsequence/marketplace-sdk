'use client';

import { ContractType, cn } from '@0xsequence/marketplace-sdk';
import type { CollectibleCardProps } from '@0xsequence/marketplace-sdk/react';
import {
	CollectibleCard,
	useFilterState,
	useList721ShopCardData,
	useListPrimarySaleItems,
	useSearchTokenMetadata,
} from '@0xsequence/marketplace-sdk/react';
import type { Address } from 'viem';
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
	const { showListedOnly: showAvailableSales } = useFilterState();
	const {
		data: primarySaleItems,
		isLoading: primarySaleItemsLoading,
		fetchNextPage: fetchNextPagePrimarySaleItems,
	} = useListPrimarySaleItems({
		chainId,
		primarySaleContractAddress: saleContractAddress,
	});

	// Flatten all primary sale items from all pages
	const allPrimarySaleItems =
		primarySaleItems?.pages.flatMap((page) => page.primarySaleItems) ?? [];

	// Check if we have minted tokens by looking at the first available token ID
	const hasMintedTokens = Number(allPrimarySaleItems[0]?.metadata.tokenId) > 0;
	const contractType = allPrimarySaleItems[0]?.primarySaleItem
		.contractType as ContractType;

	const {
		data: mintedCollectibles,
		isLoading: mintedCollectiblesIsLoading,
		hasNextPage: mintedCollectiblesHasNextPage,
		fetchNextPage: fetchNextPageMintedCollectibles,
	} = useSearchTokenMetadata({
		chainId,
		collectionAddress,
		onlyMinted: true,
		query: {
			enabled: shouldEnableMintedTokenSearch(),
		},
	});

	const allMintedTokensMetadata = mintedCollectibles?.tokenMetadata ?? [];
	const mintedTokenIds = hasMintedTokens
		? (mintedCollectibles?.tokenMetadata.map((item) => item.tokenId) ?? [])
		: [];

	function shouldEnableMintedTokenSearch(): boolean {
		// Don't search for minted tokens if we're only showing available sales
		if (showAvailableSales) {
			return false;
		}

		// Only search if we have minted tokens, and it's an ERC721 contract
		return hasMintedTokens && contractType === ContractType.ERC721;
	}

	const shouldIncludePrimarySale =
		!hasMintedTokens || !mintedCollectiblesHasNextPage;
	const tokenIds = hasMintedTokens
		? Array.from(
				new Set([
					...mintedTokenIds,
					...(shouldIncludePrimarySale
						? allPrimarySaleItems.map((item) => item.metadata.tokenId)
						: []),
				]),
			).sort((a, b) => Number(a) - Number(b))
		: allPrimarySaleItems.map((item) => item.metadata.tokenId);

	const { collectibleCards, isLoading: cardDataLoading } =
		useList721ShopCardData({
			primarySaleItemsWithMetadata: allPrimarySaleItems,
			mintedTokensMetadata: allMintedTokensMetadata,
			chainId,
			contractAddress: collectionAddress,
			salesContractAddress: saleContractAddress,
			enabled: tokenIds.length > 0,
			includePrimarySale: shouldIncludePrimarySale,
		});

	function handleCollectibleClick(tokenId: string) {
		onCollectibleClick(tokenId);
	}

	const fetchNextPage = async () => {
		if (hasMintedTokens && mintedCollectiblesHasNextPage) {
			await fetchNextPageMintedCollectibles();
		} else if (
			shouldIncludePrimarySale &&
			primarySaleItems?.pages[primarySaleItems.pages.length - 1].page?.more
		) {
			await fetchNextPagePrimarySaleItems();
		}
	};

	const renderItemContent = (index: number, card: CollectibleCardProps) => {
		if (!card) return null;

		return (
			<button
				key={index}
				onClick={() => handleCollectibleClick(card.collectibleId)}
				className={cn('w-full cursor-pointer')}
				type="button"
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
			isLoading={
				primarySaleItemsLoading ||
				mintedCollectiblesIsLoading ||
				cardDataLoading
			}
		/>
	) : (
		<InfiniteScrollView
			collectionAddress={collectionAddress}
			chainId={chainId}
			collectibleCards={collectibleCards}
			isLoading={
				primarySaleItemsLoading ||
				mintedCollectiblesIsLoading ||
				cardDataLoading
			}
			renderItemContent={renderItemContent}
			hasNextPage={
				(hasMintedTokens && mintedCollectiblesHasNextPage) ||
				(!mintedCollectiblesHasNextPage &&
					shouldIncludePrimarySale &&
					primarySaleItems?.pages[primarySaleItems.pages.length - 1].page?.more)
			}
			isFetchingNextPage={
				mintedCollectiblesIsLoading || primarySaleItemsLoading
			}
			fetchNextPage={fetchNextPage}
		/>
	);
}
