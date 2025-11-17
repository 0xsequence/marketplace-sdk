import { useMemo } from 'react';

import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import type {
	CollectibleCardAction,
	CollectibleOrder,
	ContractType,
	Order,
	OrderbookKind,
	PropertyFilter,
} from '../../../../types';
import { OrderSide } from '../../../../types';
import type { PriceFilter } from '../../../_internal';
import type { MarketCollectibleCardProps } from '../../../ui/components/marketplace-collectible-card/types';
import { useSellModal } from '../../../ui/modals/SellModal';
import { useCollectibleMarketList } from '../../collectible/market-list';
import { useCollectionBalanceDetails } from '../../collection/balance-details';

/**
 * Props for the useMarketCardData hook
 */
export interface UseMarketCardDataProps {
	/** The collection contract address */
	collectionAddress: Address;
	/** The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon) */
	chainId: number;
	/** Optional orderbook kind override - used to override marketplace config for internal tests */
	orderbookKind?: OrderbookKind;
	/** The contract type of the collection (ERC721, ERC1155, etc.) */
	collectionType: ContractType;
	/** Optional property filters to apply to the collectible search */
	filterOptions?: PropertyFilter[];
	/** Optional search text to filter collectibles by name or metadata */
	searchText?: string;
	/** Whether to show only listed collectibles (defaults to false) */
	showListedOnly?: boolean;
	/** Optional array of account addresses to filter collectibles by owner */
	inAccounts?: Address[];
	/** Optional price filters to apply to the collectible search */
	priceFilters?: PriceFilter[];
	/** Optional callback function called when a collectible card is clicked */
	onCollectibleClick?: (tokenId: string) => void;
	/** Optional callback function called when an action cannot be performed on a collectible */
	onCannotPerformAction?: (action: CollectibleCardAction) => void;
	/** Whether to prioritize owner actions in the card UI */
	prioritizeOwnerActions?: boolean;
	/** Optional URL prefix for asset images */
	assetSrcPrefixUrl?: string;
	/** Whether to hide the quantity selector on collectible cards */
	hideQuantitySelector?: boolean;
	/** Whether the query should be enabled (defaults to true when collectionAddress and chainId are provided) */
	enabled?: boolean;
}

/**
 * Hook to fetch market card data for a collection with infinite scrolling support
 *
 * This hook fetches collectibles from the marketplace API using infinite scrolling,
 * combines them with user balance information, and generates card props ready
 * for rendering collectible cards. Unlike `useMarketCardDataPaged`, this hook
 * uses infinite scrolling to load additional pages as needed.
 *
 * @param props - Configuration parameters
 * @param props.collectionAddress - The collection contract address
 * @param props.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param props.orderbookKind - Optional orderbook kind override for internal tests
 * @param props.collectionType - The contract type of the collection (ERC721, ERC1155, etc.)
 * @param props.filterOptions - Optional property filters to apply to the collectible search
 * @param props.searchText - Optional search text to filter collectibles by name or metadata
 * @param props.showListedOnly - Whether to show only listed collectibles (defaults to false)
 * @param props.inAccounts - Optional array of account addresses to filter collectibles by owner
 * @param props.priceFilters - Optional price filters to apply to the collectible search
 * @param props.onCollectibleClick - Optional callback function called when a collectible card is clicked
 * @param props.onCannotPerformAction - Optional callback function called when an action cannot be performed
 * @param props.prioritizeOwnerActions - Whether to prioritize owner actions in the card UI
 * @param props.assetSrcPrefixUrl - Optional URL prefix for asset images
 * @param props.hideQuantitySelector - Whether to hide the quantity selector on collectible cards
 * @param props.enabled - Whether the query should be enabled
 *
 * @returns An object containing:
 * @returns collectibleCards - Array of card props ready for rendering collectible cards (includes all loaded pages)
 * @returns isLoading - Whether the data is currently loading
 * @returns error - Any error that occurred during fetching
 * @returns hasNextPage - Whether there are more pages available to load
 * @returns isFetchingNextPage - Whether the next page is currently being fetched
 * @returns fetchNextPage - Function to fetch the next page of results
 * @returns allCollectibles - Array of all collectibles from all loaded pages
 *
 * @example
 * Basic usage with infinite scrolling:
 * ```typescript
 * const {
 *   collectibleCards,
 *   isLoading,
 *   error,
 *   hasNextPage,
 *   isFetchingNextPage,
 *   fetchNextPage
 * } = useMarketCardData({
 *   collectionAddress: '0x1234...',
 *   chainId: 137,
 *   collectionType: 'ERC721',
 * });
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return (
 *   <InfiniteRenderer   // use your favorite infinite scroll component here
 *     items={collectibleCards}
 *     hasNextPage={hasNextPage}
 *     isFetchingNextPage={isFetchingNextPage}
 *     onLoadMore={fetchNextPage}
 *     renderItem={(card) => (
 *       <CollectibleCard key={card.tokenId} {...card} />
 *     )}
 *   />
 * );
 * ```
 */
export function useMarketCardData({
	collectionAddress,
	chainId,
	orderbookKind,
	collectionType,
	filterOptions,
	searchText,
	showListedOnly = false,
	inAccounts,
	priceFilters,
	onCollectibleClick,
	onCannotPerformAction,
	prioritizeOwnerActions,
	assetSrcPrefixUrl,
	hideQuantitySelector,
	enabled,
}: UseMarketCardDataProps) {
	const { address: accountAddress } = useAccount();
	const { show: showSellModal } = useSellModal();

	const {
		data: collectiblesList,
		isLoading: collectiblesListIsLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		error: collectiblesListError,
	} = useCollectibleMarketList({
		collectionAddress,
		chainId,
		side: OrderSide.listing,
		filter: {
			includeEmpty: !showListedOnly,
			searchText,
			properties: filterOptions,
			prices: priceFilters,
			inAccounts: inAccounts ?? [],
		},
		query: {
			enabled: !!collectionAddress && !!chainId && enabled,
		},
	});

	const { data: collectionBalance, isLoading: balanceLoading } =
		useCollectionBalanceDetails({
			chainId,
			filter: {
				accountAddresses: accountAddress ? [accountAddress] : [],
				omitNativeBalances: true,
				contractWhitelist: [collectionAddress],
			},
			query: {
				enabled: !!accountAddress && enabled,
			},
		});

	// Flatten all collectibles from all pages
	const allCollectibles = useMemo(() => {
		if (!collectiblesList?.pages) return [];
		return collectiblesList.pages.flatMap((page) => page.collectibles);
	}, [collectiblesList?.pages]);

	const collectibleCards = useMemo(() => {
		return allCollectibles.map((collectible: CollectibleOrder) => {
			const balance = collectionBalance?.balances.find(
				(balance) => balance.tokenID === collectible.metadata.tokenId,
			)?.balance;

			const cardProps: MarketCollectibleCardProps = {
				tokenId: collectible.metadata.tokenId,
				chainId,
				collectionAddress,
				collectionType,
				cardLoading: collectiblesListIsLoading || balanceLoading,
				cardType: 'market',
				orderbookKind,
				collectible,
				onCollectibleClick,
				balance,
				balanceIsLoading: balanceLoading,
				onCannotPerformAction,
				prioritizeOwnerActions,
				assetSrcPrefixUrl,
				hideQuantitySelector,
				onOfferClick: ({ order }) => {
					if (!accountAddress) return;

					if (balance) {
						showSellModal({
							chainId,
							collectionAddress,
							tokenId: collectible.metadata.tokenId,
							order: order as Order,
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
