import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import {
	ContractType,
	ERC1155_SALES_CONTRACT_ABI,
	MARKETPLACE_TYPES,
	type TokenMetadata,
} from '../../../../sdk/src';
import type { ShopCollectibleCardProps } from '../ui/components/marketplace-collectible-card';
import { useTokenSaleDetailsBatch } from './use1155SaleDetailsBatch';
import { useCollectionDetails } from './useCollectionDetails';
import { useListTokenMetadata } from './useListTokenMetadata';

interface UseList1155ShopCardDataProps {
	tokenIds: string[];
	chainId: number;
	contractAddress: Address;
	salesContractAddress: Address;
	enabled?: boolean;
}

/**
 * Hook to prepare ERC1155 collectible card data for shop display
 *
 * @description
 * This hook fetches and prepares ERC1155 collectibles for display in a shop context.
 * It combines token metadata, sales contract details, and collection information
 * to create a complete set of data for rendering collectible cards.
 *
 * @param props - Configuration options for the shop collectible cards
 * @param props.tokenIds - Array of token IDs to fetch data for
 * @param props.chainId - The blockchain network ID
 * @param props.contractAddress - The ERC1155 contract address
 * @param props.salesContractAddress - The sales contract address for purchases
 * @param props.enabled - Whether to enable data fetching (default: true)
 *
 * @returns Object containing:
 * - collectibleCards: Array of formatted card data ready for rendering
 * - isLoading: Whether data is currently being fetched
 * - error: Any error that occurred during fetching
 *
 * @example
 * ```tsx
 * const { collectibleCards, isLoading } = useList1155ShopCardData({
 *   tokenIds: ['1', '2', '3'],
 *   chainId: 137,
 *   contractAddress: '0x123...',
 *   salesContractAddress: '0x456...'
 * });
 * ```
 */
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
			marketplaceType: MARKETPLACE_TYPES.SHOP,
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
