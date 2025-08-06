import type { TokenMetadata } from '@0xsequence/metadata';
import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { ContractType } from '../../../_internal';
import type { CollectiblePrimarySaleItem } from '../../../_internal/api/marketplace.gen';
import type { ShopCollectibleCardProps } from '../../../ui';
import { useSalesContractABI } from '../../contracts/useSalesContractABI';

interface UseList721ShopCardDataProps {
	primarySaleItemsWithMetadata: CollectiblePrimarySaleItem[];
	mintedTokensMetadata: TokenMetadata[];
	chainId: number;
	contractAddress: Address;
	salesContractAddress: Address;
	enabled?: boolean;
	includePrimarySale?: boolean;
}

export function useList721ShopCardData({
	primarySaleItemsWithMetadata,
	mintedTokensMetadata,
	chainId,
	contractAddress,
	salesContractAddress,
	enabled = true,
	includePrimarySale = true,
}: UseList721ShopCardDataProps) {
	const { abi, isLoading: versionLoading } = useSalesContractABI({
		contractAddress: salesContractAddress,
		contractType: ContractType.ERC721,
		chainId,
		enabled,
	});

	// For ERC721, we'll fetch the sale details directly from the contract
	const {
		data: saleDetails,
		isLoading: saleDetailsLoading,
		error: saleDetailsError,
	} = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: abi || [],
		functionName: 'saleDetails',
		query: {
			enabled: enabled && !versionLoading && !!abi,
		},
	});

	const primarySaleItemsCollectibleCards = primarySaleItemsWithMetadata.map(
		(item) => {
			const { metadata, primarySaleItem } = item;

			const salePrice = {
				amount: primarySaleItem.priceAmount?.toString(),
				currencyAddress: primarySaleItem.currencyAddress as Address,
			};

			const quantityInitial = primarySaleItem.supply?.toString();

			const quantityRemaining = '1';

			const saleStartsAt = primarySaleItem.startDate.toString();

			const saleEndsAt = primarySaleItem.endDate.toString();

			return {
				collectibleId: metadata.tokenId,
				chainId,
				collectionAddress: contractAddress,
				collectionType: ContractType.ERC721,
				tokenMetadata: metadata,
				cardLoading: saleDetailsLoading,
				salesContractAddress: salesContractAddress,
				salePrice,
				quantityInitial,
				quantityRemaining,
				quantityDecimals: 0,
				saleStartsAt,
				saleEndsAt,
				marketplaceType: 'shop',
			} satisfies ShopCollectibleCardProps;
		},
	);

	const mintedTokensCollectibleCards = mintedTokensMetadata.map((item) => {
		return {
			collectibleId: item.tokenId,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType.ERC721,
			tokenMetadata: item,
			cardLoading: saleDetailsLoading,
			salesContractAddress: salesContractAddress,
			salePrice: {
				amount: '0',
				currencyAddress: '0x0000000000000000000000000000000000000000',
			},
			quantityInitial: undefined,
			quantityRemaining: undefined,
			quantityDecimals: 0,
			saleStartsAt: undefined,
			saleEndsAt: undefined,
			marketplaceType: 'shop',
		} satisfies ShopCollectibleCardProps;
	});

	const collectibleCards = includePrimarySale
		? [...mintedTokensCollectibleCards, ...primarySaleItemsCollectibleCards]
		: mintedTokensCollectibleCards;

	return {
		salePrice: collectibleCards[0]?.salePrice,
		collectibleCards,
		saleDetailsError,
		saleDetails,
		isLoading: saleDetailsLoading,
	};
}
