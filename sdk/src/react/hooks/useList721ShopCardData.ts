import type { Address } from 'viem';
import { useReadContract, useReadContracts } from 'wagmi';
import {
	ContractType,
	ERC721_ABI,
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
		data: tokenMetadata,
		isLoading: tokenMetadataLoading,
		error: tokenMetadataError,
	} = useListTokenMetadata({
		chainId,
		contractAddress,
		tokenIds,
		query: {
			enabled,
		},
	});

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

	// Add ownerOf multicall for all tokenIds
	const { data: ownersData, isLoading: ownersLoading } = useReadContracts({
		contracts: tokenIds.map((tokenId) => ({
			chainId,
			address: contractAddress,
			abi: ERC721_ABI,
			functionName: 'ownerOf',
			args: [BigInt(tokenId)],
		})),
		query: {
			enabled,
		},
	});

	const isLoading =
		saleDetailsLoading ||
		tokenMetadataLoading ||
		collectionDetailsLoading ||
		ownersLoading;

	const collectibleCards = tokenIds.map((tokenId, index) => {
		const token = tokenMetadata?.find((token) => token.tokenId === tokenId);
		const hasOwner = !ownersData?.[index].error && !!ownersData?.[index].result;

		return {
			collectibleId: tokenId,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType.ERC721,
			tokenMetadata: token as TokenMetadata,
			cardLoading: isLoading,
			salesContractAddress,
			salePrice: {
				amount: saleDetails?.cost?.toString() || '',
				currencyAddress: saleDetails?.paymentToken ?? '0x',
			},
			quantityInitial: saleDetails?.supplyCap
				? saleDetails.supplyCap.toString()
				: undefined,
			quantityDecimals: collectionDetails?.tokenQuantityDecimals,
			// Set quantityRemaining based on ownership
			quantityRemaining: hasOwner ? undefined : '1',
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
		saleDetails,
		isLoading,
	};
}
