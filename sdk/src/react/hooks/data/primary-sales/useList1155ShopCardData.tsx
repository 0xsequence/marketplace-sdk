import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import {
	ContractType,
	type PrimarySaleItem,
	type TokenMetadata,
} from '../../../_internal';
import type { ShopCollectibleCardProps } from '../../../ui/components/marketplace-collectible-card/types';
import { useSalesContractABI } from '../../contracts/useSalesContractABI';
import { useCollection } from '../collections/useCollection';

interface UseList1155ShopCardDataProps {
	primarySaleItemsWithMetadata: Array<{
		metadata: TokenMetadata;
		primarySaleItem: PrimarySaleItem;
	}>;
	chainId: number;
	contractAddress: Address;
	salesContractAddress: Address;
	enabled?: boolean;
}

export function useList1155ShopCardData({
	primarySaleItemsWithMetadata,
	chainId,
	contractAddress,
	salesContractAddress,
	enabled = true,
}: UseList1155ShopCardDataProps) {
	const { abi, isLoading: versionLoading } = useSalesContractABI({
		contractAddress: salesContractAddress,
		contractType: ContractType.ERC1155,
		chainId,
		enabled,
	});

	const { data: collection, isLoading: collectionLoading } = useCollection({
		chainId,
		collectionAddress: contractAddress,
		query: {
			enabled,
		},
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

	const isLoading = versionLoading || collectionLoading || paymentTokenLoading;

	const collectibleCards = primarySaleItemsWithMetadata.map((item) => {
		const { metadata, primarySaleItem: saleData } = item;

		const salePrice = {
			amount: saleData?.priceAmount?.toString() || '',
			currencyAddress: (saleData?.currencyAddress ||
				paymentToken ||
				'0x') as Address,
		};

		const supply = saleData?.supply?.toString();
		const unlimitedSupply = saleData?.unlimitedSupply;

		return {
			collectibleId: metadata.tokenId,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType.ERC1155,
			tokenMetadata: metadata,
			cardLoading: isLoading,
			salesContractAddress: salesContractAddress,
			salePrice,
			quantityInitial: supply,
			quantityDecimals: collection?.decimals || 0,
			quantityRemaining: supply,
			unlimitedSupply,
			saleStartsAt: saleData?.startDate?.toString(),
			saleEndsAt: saleData?.endDate?.toString(),
			cardType: 'shop',
		} satisfies ShopCollectibleCardProps;
	});

	return {
		collectibleCards,
		tokenMetadataError: null,
		tokenSaleDetailsError: null,
		isLoading: enabled && isLoading,
	};
}
