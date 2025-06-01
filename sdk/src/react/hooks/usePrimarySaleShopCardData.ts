import type { Address } from 'viem';
import type { ContractType } from '../../types';
import type { ShopCollectibleCardProps } from '../ui/components/marketplace-collectible-card';
import { useListPrimarySaleItems } from './useListPrimarySaleItems';

interface UsePrimarySaleShopCardDataProps {
	chainId: number;
	primarySaleContractAddress: Address;
	collectionAddress: Address;
	enabled?: boolean;
}

/**
 * Hook to fetch primary sale items and transform them into shop card data format
 * This replaces the need for manual tokenIds and uses the new API
 */
export function usePrimarySaleShopCardData({
	chainId,
	primarySaleContractAddress,
	collectionAddress,
	enabled = true,
}: UsePrimarySaleShopCardDataProps) {
	const {
		data: primarySaleData,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useListPrimarySaleItems({
		chainId,
		primarySaleContractAddress,
		filter: {
			includeEmpty: false, // Only show available items
		},
		query: {
			enabled,
		},
	});

	// Transform primary sale API data into collectible cards format
	const collectibleCards: ShopCollectibleCardProps[] = [];
	let salePrice: { amount: string; currencyAddress: Address } | undefined;

	if (primarySaleData?.pages) {
		for (const page of primarySaleData.pages) {
			for (const item of page.primarySaleItems) {
				const primarySaleItem = item.primarySaleItem;
				const metadata = item.metadata;

				// Set salePrice from first item if not already set
				if (!salePrice) {
					salePrice = {
						amount: primarySaleItem.priceAmount,
						currencyAddress: primarySaleItem.currencyAddress as Address,
					};
				}

				const collectibleCard: ShopCollectibleCardProps = {
					collectibleId: metadata.tokenId,
					chainId,
					collectionAddress: collectionAddress,
					collectionType: primarySaleItem.contractType as ContractType,
					tokenMetadata: metadata,
					cardLoading: isLoading,
					salesContractAddress: primarySaleContractAddress,
					salePrice: {
						amount: primarySaleItem.priceAmount,
						currencyAddress: primarySaleItem.currencyAddress as Address,
					},
					quantityInitial: primarySaleItem.supplyCap,
					quantityDecimals: 0, // Will be set by collection details
					quantityRemaining: primarySaleItem.supplyCap, // API should provide remaining quantity
					saleStartsAt: primarySaleItem.startDate,
					saleEndsAt: primarySaleItem.endDate,
					marketplaceType: 'shop',
				};

				collectibleCards.push(collectibleCard);
			}
		}
	}

	return {
		salePrice,
		collectibleCards,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	};
}
