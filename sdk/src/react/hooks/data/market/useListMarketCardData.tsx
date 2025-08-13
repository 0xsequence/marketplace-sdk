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
import type { MarketCollectibleCardProps } from '../../../ui/components/marketplace-collectible-card/types';
import { useSellModal } from '../../../ui/modals/SellModal';
import { useListCollectibles } from '../collectibles/useListCollectibles';
import { useCollectionBalanceDetails } from '../collections/useCollectionBalanceDetails';

interface UseListMarketCardDataProps {
	collectionAddress: Address;
	chainId: number;
	// orderbookKind is optional — used to override marketplace config for internal tests
	orderbookKind?: OrderbookKind;
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
 * Prepares marketplace card data for displaying collectibles with actions
 *
 * This hook combines collectible listings with user balances to generate
 * ready-to-use props for marketplace collectible cards. It handles pagination,
 * filtering, search, and determines available actions based on ownership.
 *
 * @param params - Configuration for fetching and displaying collectibles
 * @param params.collectionAddress - The NFT collection contract address
 * @param params.chainId - The blockchain network ID
 * @param params.orderbookKind - Optional orderbook type override
 * @param params.collectionType - The NFT standard (ERC721/ERC1155)
 * @param params.filterOptions - Property filters to apply
 * @param params.searchText - Text to search in metadata
 * @param params.showListedOnly - Whether to show only listed items
 * @param params.onCollectibleClick - Handler for collectible card clicks
 * @param params.onCannotPerformAction - Handler for restricted actions
 * @param params.prioritizeOwnerActions - Show owner actions first
 * @param params.assetSrcPrefixUrl - URL prefix for asset sources
 *
 * @returns Market card data and pagination controls
 * @returns returns.collectibleCards - Array of props for collectible cards
 * @returns returns.isLoading - True while fetching data
 * @returns returns.error - Error object if fetching fails
 * @returns returns.hasNextPage - Whether more pages exist
 * @returns returns.isFetchingNextPage - True while fetching next page
 * @returns returns.fetchNextPage - Function to load more collectibles
 * @returns returns.allCollectibles - Raw collectibles data
 *
 * @example
 * Basic marketplace grid:
 * ```typescript
 * const {
 *   collectibleCards,
 *   isLoading,
 *   fetchNextPage,
 *   hasNextPage
 * } = useListMarketCardData({
 *   collectionAddress: '0x...',
 *   chainId: 137,
 *   collectionType: ContractType.ERC721,
 *   onCollectibleClick: (tokenId) => {
 *     router.push(`/collectible/${tokenId}`);
 *   }
 * });
 *
 * return (
 *   <div className="grid">
 *     {collectibleCards.map((cardProps, index) => (
 *       <MarketplaceCollectibleCard key={index} {...cardProps} />
 *     ))}
 *     {hasNextPage && (
 *       <button onClick={() => fetchNextPage()}>Load More</button>
 *     )}
 *   </div>
 * );
 * ```
 *
 * @example
 * With filters and search:
 * ```typescript
 * const [searchQuery, setSearchQuery] = useState('');
 * const [showListedOnly, setShowListedOnly] = useState(false);
 *
 * const { collectibleCards, isLoading } = useListMarketCardData({
 *   collectionAddress,
 *   chainId,
 *   collectionType: ContractType.ERC1155,
 *   searchText: searchQuery,
 *   showListedOnly,
 *   filterOptions: [
 *     { name: 'Rarity', values: ['Legendary'] }
 *   ],
 *   onCannotPerformAction: (action) => {
 *     if (action === 'buy') {
 *       toast.error('Please connect wallet to buy');
 *     }
 *   },
 *   prioritizeOwnerActions: true
 * });
 * ```
 *
 * @remarks
 * - Automatically enriches collectibles with user balance information
 * - Handles offer click actions by showing the sell modal for owners
 * - Supports infinite scroll pagination via React Query
 * - Filters work on metadata properties defined in the collection
 * - Search matches against token name and description
 * - The `prioritizeOwnerActions` flag affects button ordering in cards
 *
 * @see {@link MarketCollectibleCardProps} - The card props type generated
 * @see {@link useListCollectibles} - Underlying hook for fetching collectibles
 * @see {@link useCollectionBalanceDetails} - Hook for fetching user balances
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
