import type {
	Address,
	CollectiblePrimarySaleItem,
	MarketplaceTokenMetadata,
} from '@0xsequence/api-client';
import { ContractType, MetadataStatus } from '@0xsequence/api-client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';
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

type TokenMetadataInput = {
	name?: string;
	attributes?: MarketplaceTokenMetadata['attributes'];
	status?: string;
	description?: string;
	image?: string;
	video?: string;
	audio?: string;
	properties?: MarketplaceTokenMetadata['properties'];
	image_data?: string;
	external_url?: string;
	background_color?: string;
	animation_url?: string;
	decimals?: number;
	updatedAt?: string;
};

function normalizeTokenMetadata(
	metadata: TokenMetadataInput | undefined,
	tokenId: bigint,
): MarketplaceTokenMetadata {
	return {
		tokenId,
		name: metadata?.name ?? '',
		attributes: metadata?.attributes ?? [],
		status: (metadata?.status as MetadataStatus) ?? MetadataStatus.AVAILABLE,
		description: metadata?.description,
		image: metadata?.image,
		video: metadata?.video,
		audio: metadata?.audio,
		properties: metadata?.properties,
		image_data: metadata?.image_data,
		external_url: metadata?.external_url,
		background_color: metadata?.background_color,
		animation_url: metadata?.animation_url,
		decimals: metadata?.decimals,
		updatedAt: metadata?.updatedAt,
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
	const tokenSuppliesQuery = useInfiniteQuery({
		...tokenSuppliesQueryOptions({
			chainId,
			collectionAddress: contractAddress,
			includeMetadata: true,
			config,
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
				currencyAddress: zeroAddress,
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
