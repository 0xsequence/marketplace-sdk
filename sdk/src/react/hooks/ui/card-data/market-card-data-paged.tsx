import { useMemo } from 'react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import {
	type CollectibleCardAction,
	type CollectibleOrder,
	type ContractType,
	type OrderbookKind,
	OrderSide,
	type PropertyFilter,
} from '../../../../types';
import type { Order, PriceFilter } from '../../../_internal';
import type { MarketCollectibleCardProps } from '../../../ui/components/marketplace-collectible-card/types';
import { useSellModal } from '../../../ui/modals/SellModal';
import { useCollectibleMarketListPaginated } from '../../collectible/market-list-paginated';
import { useCollectionBalanceDetails } from '../../collection/balance-details';

export interface UseMarketCardDataPagedProps {
	collectionAddress: Address;
	chainId: number;
	// orderbookKind is optional — used to override marketplace config for internal tests
	orderbookKind?: OrderbookKind;
	collectionType: ContractType;
	filterOptions?: PropertyFilter[];
	searchText?: string;
	showListedOnly?: boolean;
	inAccounts?: Address[];
	priceFilters?: PriceFilter[];
	onCollectibleClick?: (tokenId: string) => void;
	onCannotPerformAction?: (action: CollectibleCardAction) => void;
	prioritizeOwnerActions?: boolean;
	assetSrcPrefixUrl?: string;
	hideQuantitySelector?: boolean;
	/** Page number to fetch (required for paged mode). */
	page: number;
	/** Number of items per page (required for paged mode). */
	pageSize: number;
	enabled?: boolean;
}

/**
 * Hook to fetch collectible card data with pagination support.
 *
 * Unlike `useMarketCardData`, this hook uses a paged query that fetches
 * only the specific page requested, eliminating the need for client-side slicing.
 *
 * @param params - Configuration parameters
 * @param params.page - Page number to fetch (required)
 * @param params.pageSize - Number of items per page (required)
 *
 * @returns Query result containing card data for the specific page only
 */
// TODO: Write test for this hook
export function useMarketCardDataPaged({
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
	page,
	pageSize,
	enabled,
}: UseMarketCardDataPagedProps) {
	const { address: accountAddress } = useAccount();
	const { show: showSellModal } = useSellModal();

	// Get collectibles with listings for the specific page
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
			prices: priceFilters,
			inAccounts: inAccounts ?? [],
		},
		query: {
			enabled: !!collectionAddress && !!chainId && enabled,
		},
		page,
		pageSize,
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
				enabled: !!accountAddress && enabled,
			},
		});

	// Get collectibles from the current page only (no flattening needed)
	const currentPageCollectibles = collectiblesListResponse?.collectibles ?? [];

	// Generate card props for each collectible in the current page
	const collectibleCards = useMemo(() => {
		return currentPageCollectibles.map((collectible: CollectibleOrder) => {
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
		currentPageCollectibles,
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
		hasMore: collectiblesListResponse?.page?.more ?? false,
	};
}
