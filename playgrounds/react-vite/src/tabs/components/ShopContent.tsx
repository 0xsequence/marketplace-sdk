import {
	CollectibleCard,
	useListCollectibles,
	useListPrimarySaleItems,
	useListShopCardData,
} from '@0xsequence/marketplace-sdk/react';

import { useNavigate } from 'react-router';
import { useMarketplace, VirtualizedCollectiblesView } from 'shared-components';
import type { Address } from 'viem';
import { ContractType, OrderSide } from '../../../../../sdk/src';

import type { ShopContentProps } from '../types';

export function ShopContent({
	saleContractAddress,
	saleItemIds,
	collectionAddress,
	chainId,
}: ShopContentProps) {
	const navigate = useNavigate();
	const { setCollectibleId } = useMarketplace();

	const { data: collectibles, isLoading: collectiblesLoading } =
		useListPrimarySaleItems({
			chainId,
			primarySaleContractAddress: saleContractAddress as Address,
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
	} = useListCollectibles({
		chainId,
		collectionAddress: collectionAddress as Address,
		side: OrderSide.listing,
		filter: {
			includeEmpty: true,
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
		? (collectiblesFromMetadata?.pages.flatMap((page) =>
				page.collectibles.map((item) => item.metadata.tokenId),
			) ?? [])
		: [];

	// Create a list of all collectibles including both minted and unminted
	const allMintedCollectibles = hasMintedTokens
		? (collectiblesFromMetadata?.pages.flatMap((page) => page.collectibles) ??
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

	// Create a combined list of all collectibles
	const combinedCollectibles = [
		...allMintedCollectibles,
		...(shouldIncludePrimarySale ? allCollectibles : []),
	].sort((a, b) => Number(a.metadata.tokenId) - Number(b.metadata.tokenId));

	const { collectibleCards, isLoading: cardDataLoading } = useListShopCardData({
		tokenIds,
		chainId,
		contractAddress: collectionAddress as Address,
		salesContractAddress: saleContractAddress as Address,
		contractType,
		enabled: tokenIds.length > 0,
	});

	function renderItemContent({
		index,
		primarySaleItem,
	}: {
		index: number;
		primarySaleItem: { metadata: { tokenId: string } };
	}) {
		const card = collectibleCards[index];
		if (!card || !saleContractAddress) return null;

		const handleClick = () => {
			setCollectibleId(primarySaleItem.metadata.tokenId);
			navigate(
				`/${collectionAddress}/collectible/${primarySaleItem.metadata.tokenId}`,
			);
		};

		return (
			<button
				onClick={handleClick}
				onKeyUp={(e) => e.key === 'Enter' && handleClick()}
				tabIndex={0}
				className="cursor-pointer"
				type="button"
			>
				<CollectibleCard key={primarySaleItem.metadata.tokenId} {...card} />
			</button>
		);
	}

	if (!saleContractAddress || !saleItemIds) {
		return <div>No sale contract address or item ids found</div>;
	}

	return (
		<VirtualizedCollectiblesView
			mode="paginated"
			collectionAddress={collectionAddress}
			chainId={chainId}
			collectibleCards={collectibleCards}
			isLoading={
				collectiblesLoading ||
				isLoadingCollectiblesFromMetadata ||
				cardDataLoading
			}
			renderItemContent={(index: number) =>
				renderItemContent({
					index,
					primarySaleItem: combinedCollectibles[index],
				})
			}
		/>
	);
}
