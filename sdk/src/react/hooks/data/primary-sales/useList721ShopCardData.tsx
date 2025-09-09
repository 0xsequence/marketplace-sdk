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

/**
 * Prepares shop card data for ERC721 primary sale items
 *
 * This hook transforms ERC721 primary sale items into shop card props, distinguishing
 * between minted and unminted tokens. It fetches token supplies to determine which
 * tokens have been minted and combines this with sale data for comprehensive display.
 *
 * @param params - Configuration for shop card data generation
 * @param params.primarySaleItemsWithMetadata - Array of sale items with metadata
 * @param params.chainId - The blockchain network ID
 * @param params.contractAddress - The ERC721 collection contract address
 * @param params.salesContractAddress - The primary sales contract address
 * @param params.enabled - Whether to enable data fetching (default: true)
 *
 * @returns Shop card data and sale information
 * @returns returns.salePrice - The sale price from the first card
 * @returns returns.collectibleCards - Array of props for shop collectible cards
 * @returns returns.saleDetailsError - Error from fetching sale details
 * @returns returns.saleDetails - Raw sale details from contract
 * @returns returns.isLoading - True while fetching data
 * @returns returns.tokenSuppliesData - Raw token supplies data
 *
 * @example
 * Basic usage with filtering:
 * ```typescript
 * const { collectibleCards, isLoading } = useList721ShopCardData({
 *   primarySaleItemsWithMetadata: saleItems,
 *   chainId: 1,
 *   contractAddress: '0x...collection',
 *   salesContractAddress: '0x...sales'
 * });
 *
 * // Show unminted tokens available for sale
 * const availableCards = collectibleCards.filter(
 *   card => card.quantityRemaining === '1'
 * );
 *
 * return (
 *   <div>
 *     {availableCards.map(card => (
 *       <ShopCollectibleCard key={card.collectibleId} {...card} />
 *     ))}
 *   </div>
 * );
 * ```
 *
 * @example
 * With show available filter:
 * ```typescript
 * const { showListedOnly } = useFilterState();
 *
 * const {
 *   collectibleCards,
 *   isLoading,
 *   saleDetails
 * } = useList721ShopCardData({
 *   primarySaleItemsWithMetadata,
 *   chainId,
 *   contractAddress: collection.address,
 *   salesContractAddress: saleContract
 * });
 *
 * if (isLoading) return <LoadingGrid />;
 *
 * // Cards are automatically filtered based on showListedOnly
 * // - true: only unminted tokens (available for sale)
 * // - false: all tokens (minted and unminted)
 *
 * console.log(`Sale ends at: ${saleDetails?.endTime}`);
 * console.log(`Showing ${collectibleCards.length} items`);
 * ```
 *
 * @remarks
 * - Automatically fetches all token supplies to determine minted status
 * - Unminted tokens show actual sale data (price, dates, quantity)
 * - Minted tokens show with zero price and no sale information
 * - Respects the global `showListedOnly` filter state
 * - For ERC721, quantity remaining is always '1' for unminted tokens
 * - Uses infinite query to fetch all token supplies efficiently
 * - Sale details are fetched directly from the contract
 *
 * @see {@link ShopCollectibleCardProps} - The card props type generated
 * @see {@link useFilterState} - For accessing the showListedOnly filter
 * @see {@link useSalesContractABI} - For detecting contract version
 * @see {@link tokenSuppliesQueryOptions} - For fetching token supplies
 */
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
		tokenSuppliesEnabled,
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
				cardType: 'shop',
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
