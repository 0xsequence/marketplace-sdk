import type { CollectiblePrimarySaleItem } from '@0xsequence/api-client';
import { type Address, zeroAddress } from 'viem';
import { useReadContract } from 'wagmi';
import { ContractType } from '../../../_internal';
import type { ShopCollectibleCardProps } from '../../../ui/components/marketplace-collectible-card/types';

import { useCollectionMetadata } from '../../collection/metadata';
import { useSalesContractABI } from '../../contracts/useSalesContractABI';

interface UsePrimarySale1155CardDataProps {
	primarySaleItemsWithMetadata: CollectiblePrimarySaleItem[];
	chainId: number;
	contractAddress: Address;
	salesContractAddress: Address;
	enabled?: boolean;
}

export function usePrimarySale1155CardData({
	primarySaleItemsWithMetadata,
	chainId,
	contractAddress,
	salesContractAddress,
	enabled = true,
}: UsePrimarySale1155CardDataProps) {
	const { abi, isLoading: versionLoading } = useSalesContractABI({
		contractAddress: salesContractAddress,
		contractType: ContractType.ERC1155,
		chainId,
		enabled,
	});

	const { data: collection, isLoading: collectionLoading } =
		useCollectionMetadata({
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
			amount: saleData?.priceAmount || 0n,
			currencyAddress: saleData?.currencyAddress || paymentToken || zeroAddress,
		};

		const supply = saleData?.supply;
		const unlimitedSupply = saleData?.unlimitedSupply;

		return {
			tokenId: metadata.tokenId,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType.ERC1155,
			tokenMetadata: {
				...metadata,
				source: '', // Add source field required by metadata API types
			},
			cardLoading: isLoading,
			salesContractAddress,
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
