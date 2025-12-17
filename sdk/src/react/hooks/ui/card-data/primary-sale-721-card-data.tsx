import type {
	CollectiblePrimarySaleItem,
	TokenMetadata,
} from '@0xsequence/api-client';
import { ContractType } from '@0xsequence/api-client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { useFilterState } from '../../..';
import { tokenSuppliesQueryOptions } from '../../../queries/token/supplies';
import type { ShopCollectibleCardProps } from '../../../ui';
import { useConfig } from '../../config';
import { useSalesContractABI } from '../../contracts/useSalesContractABI';

interface UsePrimarySale721CardDataProps {
	primarySaleItemsWithMetadata: CollectiblePrimarySaleItem[];
	chainId: number;
	contractAddress: Address;
	salesContractAddress: Address;
	enabled?: boolean;
}

/**
 * Safely normalizes partial token metadata to full TokenMetadata type
 * Used for minted tokens where metadata might be incomplete
 */
function normalizeTokenMetadata(
	metadata: Partial<TokenMetadata> | undefined,
	tokenId: bigint,
): TokenMetadata {
	return {
		tokenId,
		name: metadata?.name ?? '',
		source: metadata?.source ?? '',
		attributes: metadata?.attributes ?? [],
		status: metadata?.status ?? 'active',
		description: metadata?.description,
		image: metadata?.image,
		video: metadata?.video,
		audio: metadata?.audio,
		properties: metadata?.properties,
		image_data: metadata?.image_data,
		external_url: metadata?.external_url,
		background_color: metadata?.background_color,
		animation_url: metadata?.animation_url,
		updatedAt: metadata?.updatedAt,
		assets: metadata?.assets,
		queuedAt: metadata?.queuedAt,
		lastFetched: metadata?.lastFetched,
		chainId: metadata?.chainId,
		contractAddress: metadata?.contractAddress,
	};
}

export function usePrimarySale721CardData({
	primarySaleItemsWithMetadata,
	chainId,
	contractAddress,
	salesContractAddress,
	enabled = true,
}: UsePrimarySale721CardDataProps) {
	const [allTokenSuppliesFetched, setAllTokenSuppliesFetched] = useState(false);
	const { showListedOnly: showAvailableSales } = useFilterState();

	const { abi, isLoading: versionLoading } = useSalesContractABI({
		contractAddress: salesContractAddress,
		contractType: ContractType.ERC721,
		chainId,
		enabled,
	});
	const config = useConfig();

	const tokenSuppliesEnabled = Boolean(
		chainId && contractAddress && config && (enabled ?? true),
	);
	// TODO: Find a way to remove this and use enabled in tokenSuppliesQueryOptions
	const tokenSuppliesQuery = useInfiniteQuery({
		...tokenSuppliesQueryOptions({
			chainId,
			collectionAddress: contractAddress,
			includeMetadata: true,
			config,
			query: {
				enabled: tokenSuppliesEnabled,
			},
		}),
	});

	const {
		data: tokenSuppliesData,
		fetchNextPage: fetchNextTokenSuppliesPage,
		hasNextPage: hasNextSuppliesPage,
		isFetchingNextPage: isFetchingNextSuppliesPage,
		isLoading: tokenSuppliesLoading,
	} = tokenSuppliesQuery;

	useEffect(() => {
		async function fetchAllPages() {
			if (!tokenSuppliesEnabled) return;

			if (!hasNextSuppliesPage && tokenSuppliesData) {
				setAllTokenSuppliesFetched(true);
				return;
			}

			if (isFetchingNextSuppliesPage || tokenSuppliesLoading) return;

			await fetchNextTokenSuppliesPage();
		}

		fetchAllPages();
	}, [
		hasNextSuppliesPage,
		isFetchingNextSuppliesPage,
		tokenSuppliesLoading,
		fetchNextTokenSuppliesPage,
		tokenSuppliesEnabled,
	]);

	const allTokenSupplies = tokenSuppliesData?.pages.flatMap(
		(page) => page.supplies,
	);
	const matchingTokenSupplies = allTokenSupplies?.filter((supply) =>
		primarySaleItemsWithMetadata.some(
			(primarySaleItem) =>
				BigInt(primarySaleItem.metadata.tokenId) === supply.tokenId,
		),
	);

	// For ERC721, we'll fetch the sale details directly from the contract
	const {
		data: saleDetails,
		isLoading: saleDetailsLoading,
		error: saleDetailsError,
	} = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: abi || [],
		functionName: 'saleDetails',
		query: {
			enabled: enabled && !versionLoading && !!abi,
		},
	});

	// Filter out primary sale items that have already been minted
	const unmintedPrimarySaleItems = primarySaleItemsWithMetadata.filter(
		(item) =>
			!matchingTokenSupplies?.some(
				(supply) => supply.tokenId === BigInt(item.metadata.tokenId),
			),
	);

	const primarySaleItemsCollectibleCards = unmintedPrimarySaleItems.map(
		(item) => {
			const { metadata, primarySaleItem } = item;

			const salePrice = {
				amount: primarySaleItem.priceAmount || 0n,
				currencyAddress: primarySaleItem.currencyAddress,
			};

			const quantityInitial = primarySaleItem.supply;

			const quantityRemaining = 1n;

			const saleStartsAt = primarySaleItem.startDate.toString();

			const saleEndsAt = primarySaleItem.endDate.toString();

			return {
				tokenId: BigInt(metadata.tokenId),
				chainId,
				collectionAddress: contractAddress,
				collectionType: ContractType.ERC721,
				tokenMetadata: {
					...metadata,
					tokenId: BigInt(metadata.tokenId),
					source: '',
				},
				cardLoading: saleDetailsLoading,
				salesContractAddress,
				salePrice,
				quantityInitial,
				quantityRemaining,
				saleStartsAt,
				saleEndsAt,
				cardType: 'shop',
			} satisfies ShopCollectibleCardProps;
		},
	);

	const mintedTokensCollectibleCards = allTokenSupplies?.map((item) => {
		return {
			tokenId: item.tokenId,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType.ERC721,
			tokenMetadata: normalizeTokenMetadata(item.tokenMetadata, item.tokenId),
			cardLoading: saleDetailsLoading,
			salesContractAddress,
			salePrice: {
				amount: 0n,
				currencyAddress: '0x0000000000000000000000000000000000000000',
			},
			quantityInitial: undefined,
			quantityRemaining: undefined,
			saleStartsAt: undefined,
			saleEndsAt: undefined,
			cardType: 'shop',
		} satisfies ShopCollectibleCardProps;
	});

	const collectibleCards = showAvailableSales
		? primarySaleItemsCollectibleCards
		: [
				...(mintedTokensCollectibleCards ?? []),
				...primarySaleItemsCollectibleCards,
			];

	return {
		salePrice: collectibleCards[0]?.salePrice,
		collectibleCards,
		saleDetailsError,
		saleDetails,
		isLoading:
			enabled &&
			(saleDetailsLoading || tokenSuppliesLoading || !allTokenSuppliesFetched),
		tokenSuppliesData,
	};
}
