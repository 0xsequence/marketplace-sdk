import type { TokenMetadata } from '@0xsequence/metadata';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { useFilterState } from '../../..';
import { ContractType } from '../../../_internal';
import type { CollectiblePrimarySaleItem } from '../../../_internal/api/marketplace.gen';
import type { ShopCollectibleCardProps } from '../../../ui';
import { useConfig } from '../../config';
import { useSalesContractABI } from '../../contracts/useSalesContractABI';
import { tokenSuppliesQueryOptions } from '../tokens';

interface UseList721ShopCardDataProps {
	primarySaleItemsWithMetadata: CollectiblePrimarySaleItem[];
	chainId: number;
	contractAddress: Address;
	salesContractAddress: Address;
	enabled?: boolean;
}

export function useList721ShopCardData({
	primarySaleItemsWithMetadata,
	chainId,
	contractAddress,
	salesContractAddress,
	enabled = true,
}: UseList721ShopCardDataProps) {
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
	]);

	const allTokenSupplies = tokenSuppliesData?.pages.flatMap(
		(page) => page.tokenIDs,
	);
	const matchingTokenSupplies = allTokenSupplies?.filter((item) =>
		primarySaleItemsWithMetadata.some(
			(primarySaleItem) => primarySaleItem.metadata.tokenId === item.tokenID,
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
				(supply) => supply.tokenID === item.metadata.tokenId,
			),
	);

	const primarySaleItemsCollectibleCards = unmintedPrimarySaleItems.map(
		(item) => {
			const { metadata, primarySaleItem } = item;

			const salePrice = {
				amount: primarySaleItem.priceAmount?.toString(),
				currencyAddress: primarySaleItem.currencyAddress as Address,
			};

			const quantityInitial = primarySaleItem.supply?.toString();

			const quantityRemaining = '1';

			const saleStartsAt = primarySaleItem.startDate.toString();

			const saleEndsAt = primarySaleItem.endDate.toString();

			return {
				collectibleId: metadata.tokenId,
				chainId,
				collectionAddress: contractAddress,
				collectionType: ContractType.ERC721,
				tokenMetadata: metadata,
				cardLoading: saleDetailsLoading,
				salesContractAddress: salesContractAddress,
				salePrice,
				quantityInitial,
				quantityRemaining,
				quantityDecimals: 0,
				saleStartsAt,
				saleEndsAt,
				marketplaceType: 'shop',
			} satisfies ShopCollectibleCardProps;
		},
	);

	const mintedTokensCollectibleCards = allTokenSupplies?.map((item) => {
		return {
			collectibleId: item.tokenID,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType.ERC721,
			tokenMetadata: item.tokenMetadata as TokenMetadata,
			cardLoading: saleDetailsLoading,
			salesContractAddress: salesContractAddress,
			salePrice: {
				amount: '0',
				currencyAddress: '0x0000000000000000000000000000000000000000',
			},
			quantityInitial: undefined,
			quantityRemaining: undefined,
			quantityDecimals: 0,
			saleStartsAt: undefined,
			saleEndsAt: undefined,
			marketplaceType: 'shop',
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
			saleDetailsLoading || tokenSuppliesLoading || !allTokenSuppliesFetched,
		tokenSuppliesData,
	};
}
