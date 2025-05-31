import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import {
	ContractType,
	ERC721_SALE_ABI,
	MARKETPLACE_TYPES,
	type TokenMetadata,
} from '../../../../sdk/src';
import type { ShopCollectibleCardProps } from '../ui/components/marketplace-collectible-card';
import { useCollectionDetails } from './useCollectionDetails';
import { useGetTokenSuppliesMap } from './useGetTokenSuppliesMap';
import { useListTokenMetadata } from './useListTokenMetadata';

interface UseList721ShopCardDataProps {
	tokenIds: string[];
	chainId: number;
	contractAddress: Address;
	salesContractAddress: Address;
	enabled?: boolean;
}

/**
 * Hook to prepare ERC721 collectible card data for shop display
 *
 * @description
 * This hook fetches and prepares ERC721 collectibles for display in a shop context.
 * It combines token metadata, sales contract details, minted token counts,
 * and collection information to create a complete set of data for rendering
 * collectible cards.
 *
 * @param props - Configuration options for the shop collectible cards
 * @param props.tokenIds - Array of token IDs to fetch data for
 * @param props.chainId - The blockchain network ID
 * @param props.contractAddress - The ERC721 contract address
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
 * const { collectibleCards, isLoading } = useList721ShopCardData({
 *   tokenIds: ['1', '2', '3'],
 *   chainId: 1,
 *   contractAddress: '0x123...',
 *   salesContractAddress: '0x456...'
 * });
 * ```
 */
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

	const { data: tokenSupplies, isLoading: tokenSuppliesLoading } =
		useGetTokenSuppliesMap({
			chainId,
			tokenIds,
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

	const isLoading =
		saleDetailsLoading ||
		tokenMetadataLoading ||
		collectionDetailsLoading ||
		tokenSuppliesLoading;

	const tokenSupplyMap = new Map(
		tokenIds.map((tokenId) => {
			const supplies = tokenSupplies?.supplies[contractAddress];
			const supply = supplies?.find((s) => s.tokenID === tokenId);
			// If supply exists and is greater than 0, token exists and is owned
			return [tokenId, supply ? BigInt(supply.supply) > 0n : false];
		}),
	);

	const collectibleCards = tokenIds.map((tokenId) => {
		const token = tokenMetadata?.find((token) => token.tokenId === tokenId);
		const hasOwner = tokenSupplyMap.get(tokenId) ?? false;

		return {
			collectibleId: tokenId,
			chainId,
			collectionAddress: contractAddress as Address,
			collectionType: ContractType.ERC721,
			tokenMetadata: token as TokenMetadata,
			cardLoading: isLoading,
			salesContractAddress: salesContractAddress as Address,
			salePrice: {
				amount: saleDetails?.cost?.toString() || '',
				currencyAddress: saleDetails?.paymentToken ?? ('0x' as Address),
			},
			quantityInitial: saleDetails?.supplyCap
				? saleDetails.supplyCap.toString()
				: undefined,
			quantityDecimals: collectionDetails?.tokenQuantityDecimals,
			// Set quantityRemaining based on supply status
			quantityRemaining: hasOwner ? undefined : '1',
			saleStartsAt: saleDetails?.startTime?.toString(),
			saleEndsAt: saleDetails?.endTime?.toString(),
			marketplaceType: MARKETPLACE_TYPES.SHOP,
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
