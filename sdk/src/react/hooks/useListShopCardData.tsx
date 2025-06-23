import type { Address } from 'viem';
import { useList1155ShopCardData } from '..';
import { ContractType } from '../_internal';
import { useList721ShopCardData } from './useList721ShopCardData';

interface UseListShopCardDataProps {
	tokenIds: string[];
	chainId: number;
	contractAddress: Address;
	salesContractAddress: Address;
	contractType: ContractType | undefined;
	enabled?: boolean;
}

export function useListShopCardData({
	tokenIds,
	chainId,
	contractAddress,
	salesContractAddress,
	contractType,
	enabled = true,
}: UseListShopCardDataProps) {
	const shouldUse721 = contractType === ContractType.ERC721;
	const shouldUse1155 = contractType === ContractType.ERC1155;

	const erc721Data = useList721ShopCardData({
		tokenIds,
		chainId,
		contractAddress,
		salesContractAddress,
		enabled: enabled && shouldUse721,
	});

	const erc1155Data = useList1155ShopCardData({
		tokenIds,
		chainId,
		contractAddress,
		salesContractAddress,
		enabled: enabled && shouldUse1155,
	});

	if (shouldUse721) {
		return erc721Data;
	}

	if (shouldUse1155) {
		// Map ERC1155 data to match ERC721 structure
		return {
			collectibleCards: erc1155Data.collectibleCards,
			isLoading: erc1155Data.isLoading,
			saleDetailsError: erc1155Data.tokenSaleDetailsError,
			primarySaleItemsError: erc1155Data.tokenMetadataError,
			saleDetails: undefined,
			primarySaleItems: undefined,
			salePrice: erc1155Data.collectibleCards[0]?.salePrice,
		};
	}

	// Return a default state when contract type is not determined yet
	return {
		collectibleCards: [],
		isLoading: !contractType,
		collectionDetailsError: null,
		saleDetailsError: null,
		primarySaleItemsError: null,
		saleDetails: undefined,
		primarySaleItems: undefined,
		salePrice: undefined,
	};
}
