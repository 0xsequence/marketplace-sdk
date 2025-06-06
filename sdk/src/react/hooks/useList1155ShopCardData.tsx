import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import {
	ContractType,
	ERC1155_SALES_CONTRACT_ABI,
	type TokenMetadata,
} from '../../../../sdk/src';
import type { ShopCollectibleCardProps } from '../ui/components/marketplace-collectible-card';
import { useCollectionDetails } from './useCollectionDetails';
import { useListTokenMetadata } from './useListTokenMetadata';
import { useTokenSaleDetailsBatch } from './useTokenSaleDetailsBatch';

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

	const {
		extendedSupplyData,
		getInitialSupply,
		getRemainingSupply,
		loading: tokenSaleDetailsLoading,
		error: tokenSaleDetailsError,
	} = useTokenSaleDetailsBatch({
		collectionAddress: contractAddress,
		tokenIds,
		salesContractAddress,
		chainId,
		query: {
			enabled,
		},
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

	const isLoading =
		tokenSaleDetailsLoading || tokenMetadataLoading || collectionDetailsLoading;

	const collectibleCards = tokenIds.map((tokenId) => {
		const token = tokenMetadata?.find((token) => token.tokenId === tokenId);

		const saleData = extendedSupplyData?.find(
			(data) => data.tokenId === tokenId,
		);

		const cost =
			saleData && typeof saleData.result === 'object'
				? saleData.result.cost?.toString() || ''
				: '';
		const saleStartsAt =
			saleData && typeof saleData.result === 'object'
				? saleData.result.startTime?.toString()
				: undefined;
		const saleEndsAt =
			saleData && typeof saleData.result === 'object'
				? saleData.result.endTime?.toString()
				: undefined;

		return {
			collectibleId: tokenId,
			chainId,
			collectionAddress: contractAddress as Address,
			collectionType: ContractType.ERC1155,
			tokenMetadata: token as TokenMetadata,
			cardLoading: isLoading,
			salesContractAddress: salesContractAddress as Address,
			salePrice: {
				amount: cost,
				currencyAddress: paymentToken ?? ('0x' as Address),
			},
			quantityInitial: getInitialSupply(tokenId)?.toString() ?? undefined,
			quantityDecimals: collectionDetails?.tokenQuantityDecimals,
			quantityRemaining: getRemainingSupply(tokenId)?.toString(),
			saleStartsAt,
			saleEndsAt,
			marketplaceType: 'shop',
		} satisfies ShopCollectibleCardProps;
	});

	return {
		collectibleCards,
		tokenMetadataError,
		tokenSaleDetailsError,
		collectionDetailsError,
		isLoading,
	};
}
