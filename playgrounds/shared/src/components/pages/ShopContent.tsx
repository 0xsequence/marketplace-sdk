'use client';

import { ContractType, cn } from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	useListPrimarySaleItems,
	useListShopCardData,
	useSearchMintedTokenMetadata,
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

	const { data: collectibles, isLoading: collectiblesLoading } =
		useListPrimarySaleItems({
			chainId,
			primarySaleContractAddress: saleContractAddress,
		});

	// Flatten all collectibles from primary sale pages
	const allCollectibles =
		collectibles?.pages.flatMap((page) => page.primarySaleItems) ?? [];

	// Check if we have minted tokens by looking at the first available token ID
	const firstAvailableTokenId = allCollectibles[0]?.metadata.tokenId;
	const contractType = allCollectibles[0]?.primarySaleItem
		.contractType as ContractType;
	const hasMintedTokens: boolean =
		contractType === ContractType.ERC721 && // Only check for minted tokens if it's ERC721
		Boolean(firstAvailableTokenId) &&
		Number(firstAvailableTokenId) > 0;

	// Only fetch metadata if we have minted tokens and it's an ERC721 contract
	const {
		data: collectiblesFromMetadata,
		isLoading: isLoadingCollectiblesFromMetadata,
		hasNextPage: hasNextPageMetadata,
	} = useSearchMintedTokenMetadata({
		chainId,
		collectionAddress,
		filter: {
			text: '',
		},
		query: {
			enabled:
				hasMintedTokens &&
				collectionAddress !== undefined &&
				contractType === ContractType.ERC721,
		},
	});

	// Get minted token IDs if available
	const mintedTokenIds = hasMintedTokens
		? (collectiblesFromMetadata?.tokenMetadata.map((item) => item.tokenId) ??
			[])
		: [];

	// Only include primary sale items if we've finished fetching all metadata
	const shouldIncludePrimarySale = !hasMintedTokens || !hasNextPageMetadata;

	// Combine token IDs from both sources
	const tokenIds = hasMintedTokens
		? Array.from(
				new Set([
					...mintedTokenIds,
					...(shouldIncludePrimarySale
						? allCollectibles.map((item) => item.metadata.tokenId)
						: []),
				]),
			).sort((a, b) => Number(a) - Number(b))
		: allCollectibles.map((item) => item.metadata.tokenId);

	const { collectibleCards, isLoading: cardDataLoading } = useListShopCardData({
		tokenIds,
		chainId,
		contractAddress: collectionAddress,
		salesContractAddress: saleContractAddress,
		contractType,
		enabled: tokenIds.length > 0,
	});

	function handleCollectibleClick(tokenId: string) {
		onCollectibleClick(tokenId);
	}

	const renderItemContent = (index: number) => {
		const card = collectibleCards[index];
		if (!card) return null;

		return (
			<button
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
				collectiblesLoading ||
				isLoadingCollectiblesFromMetadata ||
				cardDataLoading
			}
		/>
	) : (
		<InfiniteScrollView
			collectionAddress={collectionAddress}
			chainId={chainId}
			collectibleCards={collectibleCards}
			isLoading={
				collectiblesLoading ||
				isLoadingCollectiblesFromMetadata ||
				cardDataLoading
			}
			renderItemContent={renderItemContent}
			hasNextPage={hasNextPageMetadata}
			isFetchingNextPage={isLoadingCollectiblesFromMetadata}
			fetchNextPage={async () => {}} // TODO: Implement infinite scroll for shop mode
		/>
	);
}
