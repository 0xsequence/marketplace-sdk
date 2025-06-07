import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import {
	ContractType,
	ERC1155_SALES_CONTRACT_ABI,
	type TokenMetadata,
} from '../../../../sdk/src';
import type { ShopCollectibleCardProps } from '../ui/components/marketplace-collectible-card';
import { useCollectionDetails } from './useCollectionDetails';
import { useListPrimarySaleItems } from './useListPrimarySaleItems';

interface UseList1155ShopCardDataProps {
	tokenIds: string[];
	chainId: number;
	contractAddress: Address;
	salesContractAddress: Address;
	enabled?: boolean;
}

export function useList1155ShopCardData({
	tokenIds,
	chainId,
	contractAddress,
	salesContractAddress,
	enabled = true,
}: UseList1155ShopCardDataProps) {
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

	const {
		data: primarySaleItems,
		isLoading: primarySaleItemsLoading,
		error: primarySaleItemsError,
	} = useListPrimarySaleItems({
		primarySaleContractAddress: salesContractAddress,
		chainId,
	});

	const { data: paymentToken } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: 'paymentToken',
		query: {
			enabled,
		},
	});

	const isLoading = primarySaleItemsLoading || collectionDetailsLoading;

	const collectibleCards = tokenIds.map((tokenId) => {
		const matchingPrimarySaleItem = primarySaleItems?.primarySaleItems.find(
			(item) => item.primarySaleItem.tokenId?.toString() === tokenId,
		);

		const saleData = matchingPrimarySaleItem?.primarySaleItem;
		const tokenMetadata = matchingPrimarySaleItem?.metadata;

		const cost =
			saleData && typeof saleData === 'object'
				? saleData.priceAmount?.toString() || ''
				: '';
		const saleStartsAt =
			saleData && typeof saleData === 'object'
				? saleData.startDate?.toString()
				: undefined;
		const saleEndsAt =
			saleData && typeof saleData === 'object'
				? saleData.endDate?.toString()
				: undefined;

		return {
			collectibleId: tokenId,
			chainId,
			collectionAddress: contractAddress as Address,
			collectionType: ContractType.ERC1155,
			tokenMetadata: tokenMetadata as TokenMetadata,
			cardLoading: isLoading,
			salesContractAddress: salesContractAddress as Address,
			salePrice: {
				amount: cost,
				currencyAddress: paymentToken ?? ('0x' as Address),
			},
			quantityInitial: saleData?.supplyCap?.toString() ?? undefined,
			quantityDecimals: collectionDetails?.tokenQuantityDecimals,
			quantityRemaining: saleData?.supplyCap?.toString() ?? undefined,
			saleStartsAt,
			saleEndsAt,
			marketplaceType: 'shop',
		} satisfies ShopCollectibleCardProps;
	});

	return {
		collectibleCards,
		primarySaleItemsError,
		collectionDetailsError,
		isLoading,
	};
}
