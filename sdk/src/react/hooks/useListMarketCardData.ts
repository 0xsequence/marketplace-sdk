import { useMemo } from 'react';

import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { MARKETPLACE_TYPES, OrderSide } from '../../types';
import type {
	CollectibleCardAction,
	CollectibleOrder,
	ContractType,
	Order,
	OrderbookKind,
	PropertyFilter,
} from '../../types';
import type { MarketCollectibleCardProps } from '../ui/components/marketplace-collectible-card/types';
import { useSellModal } from '../ui/modals/SellModal';
import { useCollectionBalanceDetails } from './useCollectionBalanceDetails';
import { useListCollectibles } from './useListCollectibles';

interface UseListMarketCardDataProps {
	collectionAddress: Address;
	chainId: number;
	orderbookKind: OrderbookKind;
	collectionType: ContractType;
	filterOptions?: PropertyFilter[];
	searchText?: string;
	showListedOnly?: boolean;
	onCollectibleClick?: (tokenId: string) => void;
	onCannotPerformAction?: (action: CollectibleCardAction) => void;
	prioritizeOwnerActions?: boolean;
	assetSrcPrefixUrl?: string;
}

/**
 * Hook to prepare collectible card data for marketplace display
 *
 * @description
 * This hook fetches collectibles from a collection and prepares them for display
 * in marketplace card format. It handles pagination, filtering, user balances,
 * and interaction callbacks.
 *
 * @param props - Configuration options for the marketplace collectible cards
 * @param props.collectionAddress - The blockchain address of the collection
 * @param props.chainId - The blockchain network ID
 * @param props.orderbookKind - The type of orderbook to use for trading
 * @param props.collectionType - The type of collection (ERC721, ERC1155, etc.)
 * @param props.filterOptions - Optional filters to apply to the collectibles
 * @param props.searchText - Optional search text to filter collectibles
 * @param props.showListedOnly - Whether to show only listed collectibles
 * @param props.onCollectibleClick - Callback when a collectible is clicked
 * @param props.onCannotPerformAction - Callback when an action cannot be performed
 * @param props.prioritizeOwnerActions - Whether to prioritize owner actions in UI
 * @param props.assetSrcPrefixUrl - Optional prefix URL for asset sources
 *
 * @returns Object containing:
 * - collectibleCards: Array of formatted card data ready for rendering
 * - isLoading: Whether data is currently being fetched
 * - error: Any error that occurred during fetching
 * - hasNextPage: Whether more pages of data are available
 * - isFetchingNextPage: Whether the next page is currently being fetched
 * - fetchNextPage: Function to fetch the next page of results
 * - allCollectibles: Raw array of all fetched collectibles
 *
 * @example
 * ```tsx
 * const { collectibleCards, isLoading } = useListMarketCardData({
 *   collectionAddress: '0x123...',
 *   chainId: 1,
 *   orderbookKind: OrderbookKind.SEQUENCE_MARKETPLACE_V2,
 *   collectionType: ContractType.ERC721
 * });
 * ```
 */
export function useListMarketCardData({
	collectionAddress,
	chainId,
	orderbookKind,
	collectionType,
	filterOptions,
	searchText,
	showListedOnly = false,
	onCollectibleClick,
	onCannotPerformAction,
	prioritizeOwnerActions,
	assetSrcPrefixUrl,
}: UseListMarketCardDataProps) {
	const { address: accountAddress } = useAccount();
	const { show: showSellModal } = useSellModal();

	// Get collectibles with listings
	const {
		data: collectiblesList,
		isLoading: collectiblesListIsLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		error: collectiblesListError,
	} = useListCollectibles({
		collectionAddress,
		chainId,
		side: OrderSide.listing,
		filter: {
			includeEmpty: !showListedOnly,
			searchText,
			properties: filterOptions,
		},
		query: {
			enabled: !!collectionAddress && !!chainId,
		},
	});

	// Get user balances for this collection
	const { data: collectionBalance, isLoading: balanceLoading } =
		useCollectionBalanceDetails({
			chainId,
			filter: {
				accountAddresses: accountAddress ? [accountAddress] : [],
				omitNativeBalances: true,
				contractWhitelist: [collectionAddress],
			},
			query: {
				enabled: !!accountAddress,
			},
		});

	// Flatten all collectibles from all pages
	const allCollectibles = useMemo(() => {
		if (!collectiblesList?.pages) return [];
		return collectiblesList.pages.flatMap((page) => page.collectibles);
	}, [collectiblesList?.pages]);

	// Generate card props for each collectible
	const collectibleCards = useMemo(() => {
		return allCollectibles.map((collectible: CollectibleOrder) => {
			const balance = collectionBalance?.balances.find(
				(balance) => balance.tokenID === collectible.metadata.tokenId,
			)?.balance;

			const cardProps: MarketCollectibleCardProps = {
				collectibleId: collectible.metadata.tokenId,
				chainId,
				collectionAddress,
				collectionType,
				cardLoading: collectiblesListIsLoading || balanceLoading,
				marketplaceType: 'market',
				orderbookKind,
				collectible,
				onCollectibleClick,
				balance,
				balanceIsLoading: balanceLoading,
				onCannotPerformAction,
				prioritizeOwnerActions,
				assetSrcPrefixUrl,
				onOfferClick: ({ order }) => {
					if (!accountAddress || !order) return;

					if (balance) {
						showSellModal({
							chainId,
							collectionAddress,
							tokenId: collectible.metadata.tokenId,
							order,
						});
						return;
					}
				},
			};

			return cardProps;
		});
	}, [
		allCollectibles,
		chainId,
		collectionAddress,
		collectionType,
		collectiblesListIsLoading,
		balanceLoading,
		orderbookKind,
		onCollectibleClick,
		collectionBalance?.balances,
		onCannotPerformAction,
		prioritizeOwnerActions,
		assetSrcPrefixUrl,
		accountAddress,
		showSellModal,
	]);

	return {
		collectibleCards,
		isLoading: collectiblesListIsLoading || balanceLoading,
		error: collectiblesListError,

		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
		allCollectibles,
	};
}
