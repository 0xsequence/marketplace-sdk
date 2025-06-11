import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import {
	ContractType,
	ERC721_SALE_ABI,
	type TokenMetadata,
} from '../../../../sdk/src';
import type { ShopCollectibleCardProps } from '../ui/components/marketplace-collectible-card';
import { useCollectionDetails } from './useCollectionDetails';
import { useGetTokenRanges } from './useGetTokenRanges';
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
	const {
		data: collectionDetails,
		error: collectionDetailsError,
		isLoading: collectionDetailsLoading,
	} = useCollectionDetails({
		chainId,
		collectionAddress: contractAddress,
		query: {
			enabled,
		},
	});

	const { data: tokenRanges, isLoading: tokenRangesLoading } =
		useGetTokenRanges({
			chainId,
			collectionAddress: contractAddress,
			query: {
				enabled,
			},
		});

	// Create a set of minted token IDs from tokenRanges
	const mintedTokenIds = new Set<string>();
	if (tokenRanges?.tokenIDRanges) {
		for (const range of tokenRanges.tokenIDRanges) {
			const start = Number.parseInt(range.start);
			const end = Number.parseInt(range.end);
			for (let i = start; i <= end; i++) {
				mintedTokenIds.add(i.toString());
			}
		}
	}

	const {
		data: primarySaleItems,
		isLoading: primarySaleItemsLoading,
		error: primarySaleItemsError,
	} = useListPrimarySaleItems({
		primarySaleContractAddress: salesContractAddress,
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
		collectionDetailsLoading ||
		tokenRangesLoading ||
		primarySaleItemsLoading;

	const collectibleCards = tokenIds.map((tokenId) => {
		const minted = mintedTokenIds.has(tokenId);

		// TODO: This hook should be rewritten to not take tokenIds, it will fail if its not on the first page
		const matchingPrimarySaleItem = primarySaleItems?.pages
			.flatMap((page) => page.primarySaleItems)
			.find((item) => item.primarySaleItem.tokenId?.toString() === tokenId);

		const saleData = matchingPrimarySaleItem?.primarySaleItem;
		const tokenMetadata = matchingPrimarySaleItem?.metadata;

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
			saleData?.supplyCap?.toString() ??
			(saleDetails?.supplyCap ? saleDetails.supplyCap.toString() : undefined);

		const quantityRemaining = minted ? undefined : '1';

		const saleStartsAt =
			saleData?.startDate?.toString() ?? saleDetails?.startTime?.toString();

		const saleEndsAt =
			saleData?.endDate?.toString() ?? saleDetails?.endTime?.toString();

		return {
			collectibleId: tokenId,
			chainId,
			collectionAddress: contractAddress as Address,
			collectionType: ContractType.ERC721,
			tokenMetadata: tokenMetadata as TokenMetadata,
			cardLoading: isLoading,
			salesContractAddress: salesContractAddress as Address,
			salePrice,
			quantityInitial,
			quantityDecimals: collectionDetails?.tokenQuantityDecimals,
			quantityRemaining,
			saleStartsAt,
			saleEndsAt,
			marketplaceType: 'shop',
		} satisfies ShopCollectibleCardProps;
	});

	return {
		salePrice: collectibleCards[0]?.salePrice,
		collectibleCards,
		collectionDetailsError,
		saleDetailsError,
		primarySaleItemsError,
		saleDetails,
		primarySaleItems,
		isLoading,
	};
}
