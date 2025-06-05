import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import {
	ContractType,
	ERC721_SALE_ABI,
	type TokenMetadata,
} from '../../../../sdk/src';
import type { ShopCollectibleCardProps } from '../ui/components/marketplace-collectible-card';
import { useCollectionDetails } from './useCollectionDetails';
import { useListPrimarySaleItems } from './useListPrimarySaleItems';
import { useSequentialTokenSupplies } from './useSequentialTokenSupplies';

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

	const {
		data: tokenSupplies,
		isLoading: tokenSuppliesLoading,
		errors: tokenSuppliesErrors,
	} = useSequentialTokenSupplies({
		chainId,
		tokenIds,
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
		chainId,
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
		tokenSuppliesLoading ||
		primarySaleItemsLoading;

	type TokenMintStatus = 'minted' | 'not minted';
	const tokenSupplyMap = new Map<string, TokenMintStatus>(
		tokenIds.map((tokenId) => {
			const supplies = tokenSupplies?.supplies[contractAddress];
			const supply = supplies?.find((s) => s.tokenID === tokenId);
			const isMinted = supply ? BigInt(supply.supply) > 0n : false;

			return [tokenId, isMinted ? 'minted' : 'not minted'];
		}),
	);

	const collectibleCards = tokenIds.map((tokenId) => {
		const minted = tokenSupplyMap.get(tokenId) === 'minted';

		const matchingPrimarySaleItem = primarySaleItems?.primarySaleItems.find(
			(item) => item.primarySaleItem.tokenId?.toString() === tokenId,
		);

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
		tokenSuppliesErrors,
		saleDetails,
		primarySaleItems,
		isLoading,
	};
}
