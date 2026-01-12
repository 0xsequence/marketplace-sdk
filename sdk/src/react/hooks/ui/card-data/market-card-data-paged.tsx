import type {
	Address,
	CollectibleOrder,
	ContractType,
	PropertyFilter,
} from '@0xsequence/api-client';
import { type Indexer, OrderSide } from '@0xsequence/api-client';
import { useAccount } from 'wagmi';
import type { CollectibleCardAction } from '../../../../types';
import type { Order } from '../../../_internal';
import type { MarketCollectibleCardProps } from '../../../ui/components/marketplace-collectible-card/types';
import { useSellModal } from '../../../ui/modals/SellModal';
import { normalizePriceFilters } from '../../../utils/normalizePriceFilters';
import { useCollectibleMarketListPaginated } from '../../collectible/market-list-paginated';
import { useCollectionBalanceDetails } from '../../collection/balance-details';
import type { UrlPriceFilter } from '../url-state/filter-state';

/**
 * Props for the useMarketCardDataPaged hook
 */
export interface UseMarketCardDataPagedProps {
	/** The collection contract address */
	collectionAddress: Address;
	/** The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon) */
	chainId: number;
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
	priceFilters?: UrlPriceFilter[];
	/** Optional callback function called when a collectible card is clicked */
	onCollectibleClick?: (tokenId: bigint) => void;
	/** Optional callback function called when an action cannot be performed on a collectible */
	onCannotPerformAction?: (action: CollectibleCardAction) => void;
	/** Whether to prioritize owner actions in the card UI */
	prioritizeOwnerActions?: boolean;
	/** Optional URL prefix for asset images */
	assetSrcPrefixUrl?: string;
	/** Whether to hide the quantity selector on collectible cards */
	hideQuantitySelector?: boolean;
	/** The current page number (1-indexed) */
	page: number;
	/** The number of items per page */
	pageSize: number;
	/** Whether the query should be enabled (defaults to true when collectionAddress and chainId are provided) */
	enabled?: boolean;
}

/**
 * Hook to fetch paginated market card data for a collection
 *
 * This hook fetches collectibles for a specific page from the marketplace API,
 * combines them with user balance information, and generates card props ready
 * for rendering collectible cards. Unlike `useMarketCardData`, this hook
 * fetches a single page of results rather than using infinite scrolling.
 *
 * @param props - Configuration parameters
 * @param props.collectionAddress - The collection contract address
 * @param props.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
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
 * @param props.page - The current page number
 * @param props.pageSize - The number of items per page
 * @param props.enabled - Whether the query should be enabled
 *
 * @returns An object containing:
 * @returns collectibleCards - Array of card props ready for rendering collectible cards
 * @returns isLoading - Whether the data is currently loading
 * @returns error - Any error that occurred during fetching
 * @returns hasMore - Whether there are more pages available after the current page
 *
 * @example
 * Basic usage with pagination:
 * ```typescript
 * const [page, setPage] = useState(1);
 * const pageSize = 20;
 *
 * const {
 *   collectibleCards,
 *   isLoading,
 *   error,
 *   hasMore
 * } = useMarketCardDataPaged({
 *   collectionAddress: '0x1234...',
 *   chainId: 137,
 *   collectionType: 'ERC721',
 *   page,
 *   pageSize
 * });
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return (
 *   <div>
 *     {collectibleCards.map(card => (
 *       <CollectibleCard key={card.tokenId} {...card} />
 *     ))}
 *     {hasMore && (
 *       <button onClick={() => setPage(p => p + 1)}>Next Page</button>
 *     )}
 *   </div>
 * );
 * ```
 *
 * @example
 * With filters and search:
 * ```typescript
 * const { collectibleCards, isLoading } = useMarketCardDataPaged({
 *   collectionAddress: '0x5678...',
 *   chainId: 1,
 *   collectionType: 'ERC1155',
 *   searchText: 'rare',
 *   showListedOnly: true,
 *   filterOptions: [
 *     { name: 'Rarity', values: ['Legendary'], type: PropertyType.STRING }
 *   ],
 *   priceFilters: [
 *     { min: '0', max: '1', currency: 'ETH' }
 *   ],
 *   page: 1,
 *   pageSize: 30,
 *   onCollectibleClick: (tokenId) => {
 *     console.log('Clicked collectible:', tokenId);
 *   }
 * });
 * ```
 *
 * @example
 * With owner filtering and custom callbacks:
 * ```typescript
 * const { collectibleCards } = useMarketCardDataPaged({
 *   collectionAddress: '0x9abc...',
 *   chainId: 137,
 *   collectionType: 'ERC721',
 *   inAccounts: ['0xowner1...', '0xowner2...'],
 *   prioritizeOwnerActions: true,
 *   onCannotPerformAction: (action) => {
 *     console.warn(`Cannot perform action: ${action}`);
 *   },
 *   page: 2,
 *   pageSize: 25,
 *   enabled: Boolean(collectionAddress && chainId)
 * });
 * ```
 */
export function useMarketCardDataPaged({
	collectionAddress,
	chainId,
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
	page,
	pageSize,
	enabled,
}: UseMarketCardDataPagedProps) {
	const { address: accountAddress } = useAccount();
	const { show: showSellModal } = useSellModal();
	const {
		data: collectiblesListResponse,
		isLoading: collectiblesListIsLoading,
		error: collectiblesListError,
	} = useCollectibleMarketListPaginated({
		collectionAddress,
		chainId,
		side: OrderSide.listing,
		filter: {
			includeEmpty: !showListedOnly,
			searchText,
			properties: filterOptions,
			prices: normalizePriceFilters(priceFilters),
			inAccounts: inAccounts ?? [],
		},
		query: {
			enabled: !!collectionAddress && !!chainId && enabled,
		},
		page,
		pageSize,
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

	const currentPageCollectibles = collectiblesListResponse?.collectibles ?? [];

	const collectibleCards = currentPageCollectibles.map(
		(collectible: CollectibleOrder) => {
			const balanceAmount = collectionBalance?.balances.find(
				(b: Indexer.TokenBalance) => b.tokenId === collectible.metadata.tokenId,
			)?.balance;

			const cardProps: MarketCollectibleCardProps = {
				tokenId: collectible.metadata.tokenId,
				chainId,
				collectionAddress,
				collectionType,
				cardLoading: collectiblesListIsLoading || balanceLoading,
				cardType: 'market',
				collectible,
				onCollectibleClick,
				balance: balanceAmount?.toString(),
				balanceIsLoading: balanceLoading,
				onCannotPerformAction,
				prioritizeOwnerActions,
				assetSrcPrefixUrl,
				hideQuantitySelector,
				onOfferClick: ({ order }) => {
					if (!accountAddress) return;

					if (balanceAmount) {
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
		},
	);

	return {
		collectibleCards,
		isLoading: collectiblesListIsLoading || balanceLoading,
		error: collectiblesListError,
		hasMore: collectiblesListResponse?.page?.more ?? false,
	};
}
