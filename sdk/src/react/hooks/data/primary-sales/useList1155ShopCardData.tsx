import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { ContractType, type TokenMetadata } from '../../../_internal';
import type { ShopCollectibleCardProps } from '../../../ui/components/marketplace-collectible-card/types';
import { useSalesContractABI } from '../../contracts/useSalesContractABI';
import { useFilterState } from '../../ui/useFilterState';
import { useCollection } from '../collections/useCollection';
import { useListPrimarySaleItems } from '../primary-sales/useListPrimarySaleItems';

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
	const { abi, isLoading: versionLoading } = useSalesContractABI({
		contractAddress: salesContractAddress,
		contractType: ContractType.ERC1155,
		chainId,
		enabled,
	});

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
			abi: abi || [],
			functionName: 'paymentToken',
			query: {
				enabled: enabled && !versionLoading && !!abi,
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
