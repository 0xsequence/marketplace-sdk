import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import {
	ContractType,
	ERC721_SALE_ABI,
	type TokenMetadata,
} from '../../../../sdk/src';
import type { ShopCollectibleCardProps } from '../ui/components/marketplace-collectible-card';
import { useCollectionDetails } from './useCollectionDetails';
import { useListTokenMetadata } from './useListTokenMetadata';

interface UseList721ShopCardDataProps {
	tokenIds: string[];
	chainId: number;
	contractAddress: Address;
	salesContractAddress: Address;
}

export function useList721ShopCardData({
	tokenIds,
	chainId,
	contractAddress,
	salesContractAddress,
}: UseList721ShopCardDataProps) {
	const {
		data: tokenMetadata,
		isLoading: tokenMetadataLoading,
		error: tokenMetadataError,
	} = useListTokenMetadata({
		chainId,
		contractAddress,
		tokenIds,
	});

	const {
		data: collectionDetails,
		error: collectionDetailsError,
		isLoading: collectionDetailsLoading,
	} = useCollectionDetails({
		chainId,
		collectionAddress: contractAddress,
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
	});

	console.log('saleDetails', saleDetails);

	const collectibleCards = tokenIds.map((tokenId) => {
		const token = tokenMetadata?.find((token) => token.tokenId === tokenId);

		return {
			collectibleId: tokenId,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType.ERC721,
			tokenMetadata: token as TokenMetadata,
			cardLoading:
				saleDetailsLoading || tokenMetadataLoading || collectionDetailsLoading,
			salesContractAddress,
			salePrice: {
				amount: saleDetails?.cost?.toString() || '',
				currencyAddress: saleDetails?.paymentToken ?? '0x',
			},
			quantityInitial: saleDetails?.supplyCap
				? saleDetails.supplyCap.toString()
				: undefined,
			quantityDecimals: collectionDetails?.tokenQuantityDecimals,
			// For ERC721 the remaining supply is the total supply minus the current supply
			// This would need to be calculated based on contract data
			quantityRemaining: undefined, // This would need to be calculated
			saleStartsAt: saleDetails?.startTime?.toString(),
			saleEndsAt: saleDetails?.endTime?.toString(),
			marketplaceType: 'shop',
		} satisfies ShopCollectibleCardProps;
	});

	return {
		salePrice: collectibleCards[0]?.salePrice,
		collectibleCards,
		tokenMetadataError,
		saleDetailsError,
		collectionDetailsError,
	};
}
