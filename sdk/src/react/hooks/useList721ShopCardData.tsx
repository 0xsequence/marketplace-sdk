import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { ERC721_SALE_ABI } from '../../utils';
import { ContractType, OrderSide, type TokenMetadata } from '../_internal';
import type { ShopCollectibleCardProps } from '../ui';
import { useFilterState } from './useFilterState';
import { useListCollectibles } from './useListCollectibles';
import { useListPrimarySaleItems } from './useListPrimarySaleItems';

interface UseList721ShopCardDataProps {
	tokenIds: string[];
	chainId: number;
	contractAddress: Address;
	salesContractAddress: Address;
	enabled?: boolean;
}

export function useList721ShopCardData({
	tokenIds,
	chainId,
	contractAddress,
	salesContractAddress,
	enabled = true,
}: UseList721ShopCardDataProps) {
	const { showListedOnly } = useFilterState();

	const {
		data: primarySaleItems,
		isLoading: primarySaleItemsLoading,
		error: primarySaleItemsError,
	} = useListPrimarySaleItems({
		chainId,
		primarySaleContractAddress: salesContractAddress,
		filter: {
			includeEmpty: !showListedOnly,
		},
	});

	// Check if we have minted tokens by looking at the first available token ID
	const firstAvailableTokenId =
		primarySaleItems?.pages[0]?.primarySaleItems[0]?.primarySaleItem.tokenId?.toString();
	const hasMintedTokens: boolean =
		Boolean(firstAvailableTokenId) && Number(firstAvailableTokenId) > 0;

	// Fetch metadata for minted tokens
	const { data: mintedTokensMetadata, isLoading: mintedTokensMetadataLoading } =
		useListCollectibles({
			chainId,
			collectionAddress: contractAddress,
			side: OrderSide.listing,
			filter: {
				includeEmpty: true,
			},
			query: {
				enabled: enabled && hasMintedTokens,
			},
		});

	// For ERC721, we'll fetch the sale details directly from the contract
	const {
		data: saleDetails,
		isLoading: saleDetailsLoading,
		error: saleDetailsError,
	} = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC721_SALE_ABI,
		functionName: 'saleDetails',
		query: {
			enabled,
		},
	});

	const isLoading =
		saleDetailsLoading ||
		primarySaleItemsLoading ||
		mintedTokensMetadataLoading;

	// Create a map of token metadata from minted tokens
	const mintedTokensMetadataMap = new Map<string, TokenMetadata>();
	for (const page of mintedTokensMetadata?.pages ?? []) {
		for (const collectible of page.collectibles) {
			mintedTokensMetadataMap.set(
				collectible.metadata.tokenId,
				collectible.metadata,
			);
		}
	}

	const collectibleCards = tokenIds.map((tokenId) => {
		const minted =
			hasMintedTokens && Number(tokenId) < Number(firstAvailableTokenId);

		const matchingPrimarySaleItem = primarySaleItems?.pages
			.find((item) =>
				item.primarySaleItems.find(
					(primarySaleItem) =>
						primarySaleItem.primarySaleItem.tokenId?.toString() === tokenId,
				),
			)
			?.primarySaleItems.find(
				(primarySaleItem) =>
					primarySaleItem.primarySaleItem.tokenId?.toString() === tokenId,
			);

		const saleData = matchingPrimarySaleItem?.primarySaleItem;
		let tokenMetadata = matchingPrimarySaleItem?.metadata;

		// If token is minted, prefer metadata from mintedTokensMetadata
		if (minted && mintedTokensMetadataMap.has(tokenId)) {
			tokenMetadata = mintedTokensMetadataMap.get(tokenId);
		}
		// Fallback to empty metadata if none found
		tokenMetadata = tokenMetadata || ({} as TokenMetadata);

		const salePrice = saleData
			? {
					amount: saleData.priceAmount?.toString() || '',
					currencyAddress: saleData.currencyAddress as Address,
				}
			: {
					amount: saleDetails?.cost?.toString() || '',
					currencyAddress: saleDetails?.paymentToken ?? ('0x' as Address),
				};

		const quantityInitial =
			saleData?.supply?.toString() ??
			(saleDetails?.supplyCap ? saleDetails.supplyCap.toString() : undefined);

		const quantityRemaining = minted ? undefined : '1';

		const saleStartsAt =
			saleData?.startDate?.toString() ?? saleDetails?.startTime?.toString();

		const saleEndsAt =
			saleData?.endDate?.toString() ?? saleDetails?.endTime?.toString();

		return {
			collectibleId: tokenId,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType.ERC721,
			tokenMetadata,
			cardLoading: isLoading,
			salesContractAddress: salesContractAddress,
			salePrice,
			quantityInitial,
			quantityRemaining,
			quantityDecimals: 0,
			saleStartsAt,
			saleEndsAt,
			marketplaceType: 'shop',
		} satisfies ShopCollectibleCardProps;
	});

	return {
		salePrice: collectibleCards[0]?.salePrice,
		collectibleCards,
		saleDetailsError,
		primarySaleItemsError,
		saleDetails,
		primarySaleItems,
		isLoading,
	};
}
