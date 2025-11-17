import type {
	CollectiblePrimarySaleItem,
	TokenMetadata,
} from '@0xsequence/marketplace-api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { useFilterState } from '../../..';
import { ContractType } from '../../../_internal';
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
				currencyAddress: primarySaleItem.currencyAddress as Address,
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
				quantityDecimals: 0,
				saleStartsAt,
				saleEndsAt,
				cardType: 'shop',
			} satisfies ShopCollectibleCardProps;
		},
	);

	const mintedTokensCollectibleCards = allTokenSupplies?.map((item) => {
		const metadata = item.tokenMetadata || {};
		return {
			tokenId: item.tokenId,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType.ERC721,
			tokenMetadata: {
				...metadata,
				tokenId: item.tokenId,
				name: (metadata as any).name || '',
				source: (metadata as any).source || '',
				attributes: (metadata as any).attributes || [],
				status: (metadata as any).status || 'active',
			} as unknown as TokenMetadata,
			cardLoading: saleDetailsLoading,
			salesContractAddress,
			salePrice: {
				amount: 0n,
				currencyAddress: '0x0000000000000000000000000000000000000000',
			},
			quantityInitial: undefined,
			quantityRemaining: undefined,
			quantityDecimals: 0,
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
