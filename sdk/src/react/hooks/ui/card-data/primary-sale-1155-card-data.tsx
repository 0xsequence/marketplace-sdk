import type {
	Address,
	CollectiblePrimarySaleItem,
} from '@0xsequence/api-client';
import { ContractType } from '@0xsequence/api-client';
import { zeroAddress } from 'viem';
import { useReadContract } from 'wagmi';
import type { ShopCollectibleCardProps } from '../../../ui/components/marketplace-collectible-card/types';

import { useSalesContractABI } from '../../contracts/useSalesContractABI';

interface UsePrimarySale1155CardDataProps {
	primarySaleItemsWithMetadata: CollectiblePrimarySaleItem[];
	chainId: number;
	contractAddress: Address;
	salesContractAddress: Address;
	enabled?: boolean;
}

type UsePrimarySale1155CardDataReturn = {
	collectibleCards: ShopCollectibleCardProps[];
	tokenMetadataError: null;
	tokenSaleDetailsError: null;
	isLoading: boolean;
};

export function usePrimarySale1155CardData({
	primarySaleItemsWithMetadata,
	chainId,
	contractAddress,
	salesContractAddress,
	enabled = true,
}: UsePrimarySale1155CardDataProps): UsePrimarySale1155CardDataReturn {
	const { abi, isLoading: versionLoading } = useSalesContractABI({
		contractAddress: salesContractAddress,
		contractType: ContractType.ERC1155,
		chainId,
		enabled,
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

	const isLoading = versionLoading || paymentTokenLoading;

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
			tokenMetadata: metadata,
			cardLoading: isLoading,
			salesContractAddress,
			salePrice,
			quantityInitial: supply,
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
