import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { ERC1155_SALES_CONTRACT_ABI } from '../../utils';
import { ContractType, type TokenMetadata } from '../_internal';
import type { ShopCollectibleCardProps } from '../ui/components/marketplace-collectible-card/types';
import { useCollection } from './useCollection';
import { useFilterState } from './useFilterState';
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

	const { data: collection, isLoading: collectionLoading } = useCollection({
		chainId,
		collectionAddress: contractAddress,
	});

	const { data: paymentToken, isLoading: paymentTokenLoading } =
		useReadContract({
			chainId,
			address: salesContractAddress,
			abi: ERC1155_SALES_CONTRACT_ABI,
			functionName: 'paymentToken',
			query: {
				enabled,
			},
		});

	const isLoading =
		primarySaleItemsLoading || collectionLoading || paymentTokenLoading;

	// Flatten all collectibles from all pages
	const allPrimarySaleItems =
		primarySaleItems?.pages.flatMap((page) => page.primarySaleItems) ?? [];

	const collectibleCards = tokenIds.map((tokenId) => {
		const matchingPrimarySaleItem = allPrimarySaleItems.find(
			(item) => item.primarySaleItem.tokenId?.toString() === tokenId,
		);

		const saleData = matchingPrimarySaleItem?.primarySaleItem;
		const tokenMetadata =
			matchingPrimarySaleItem?.metadata || ({} as TokenMetadata);

		const salePrice = {
			amount: saleData?.priceAmount?.toString() || '',
			currencyAddress: (saleData?.currencyAddress ||
				paymentToken ||
				'0x') as Address,
		};

		const supply = saleData?.supply?.toString();
		const unlimitedSupply = saleData?.unlimitedSupply;

		return {
			collectibleId: tokenId,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType.ERC1155,
			tokenMetadata: tokenMetadata,
			cardLoading: isLoading,
			salesContractAddress: salesContractAddress,
			salePrice,
			quantityInitial: supply,
			quantityDecimals: collection?.decimals || 0,
			quantityRemaining: supply,
			unlimitedSupply,
			saleStartsAt: saleData?.startDate?.toString(),
			saleEndsAt: saleData?.endDate?.toString(),
			marketplaceType: 'shop',
		} satisfies ShopCollectibleCardProps;
	});

	return {
		collectibleCards,
		tokenMetadataError: primarySaleItemsError,
		tokenSaleDetailsError: null,
		isLoading,
	};
}
