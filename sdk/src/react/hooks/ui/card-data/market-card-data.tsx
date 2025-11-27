import { OrderSide } from '@0xsequence/api-client';
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
import type { PriceFilter } from '../../../_internal';
import type { MarketCollectibleCardProps } from '../../../ui/components/marketplace-collectible-card/types';
import { useSellModal } from '../../../ui/modals/SellModal';
import { useCollectibleMarketList } from '../../collectible/market-list';
import { useCollectionBalanceDetails } from '../../collection/balance-details';

interface UseMarketCardDataProps {
	collectionAddress: Address;
	chainId: number;
	// orderbookKind is optional — used to override marketplace config for internal tests
	orderbookKind?: OrderbookKind;
	collectionType: ContractType;
	filterOptions?: PropertyFilter[];
	searchText?: string;
	showListedOnly?: boolean;
	priceFilters?: PriceFilter[];
	onCollectibleClick?: (tokenId: bigint) => void;
	onCannotPerformAction?: (action: CollectibleCardAction) => void;
	prioritizeOwnerActions?: boolean;
	assetSrcPrefixUrl?: string;
	hideQuantitySelector?: boolean;
	enabled?: boolean;
}

export function useMarketCardData({
	collectionAddress,
	chainId,
	orderbookKind,
	collectionType,
	filterOptions,
	searchText,
	showListedOnly = false,
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

	// Get collectibles with listings
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
		},
		query: {
			enabled:
				enabled !== undefined ? enabled : !!collectionAddress && !!chainId,
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
		return allCollectibles.map((collectible) => {
			const balanceObj = collectionBalance?.balances.find(
				(b: { tokenId: bigint }) =>
					b.tokenId === BigInt(collectible.metadata.tokenId),
			);
			const balance = balanceObj?.balance?.toString();

			const cardProps: MarketCollectibleCardProps = {
				tokenId: BigInt(collectible.metadata.tokenId),
				chainId,
				collectionAddress,
				collectionType,
				cardLoading: collectiblesListIsLoading || balanceLoading,
				cardType: 'market',
				orderbookKind,
				collectible: {
					...collectible,
					metadata: {
						...collectible.metadata,
						tokenId: BigInt(collectible.metadata.tokenId),
					},
				} as CollectibleOrder,
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
							tokenId: BigInt(collectible.metadata.tokenId),
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
	} as {
		collectibleCards: MarketCollectibleCardProps[];
		isLoading: boolean;
		error: Error | null;
		hasNextPage: boolean | undefined;
		isFetchingNextPage: boolean;
		fetchNextPage: () => Promise<unknown>;
		allCollectibles: CollectibleOrder[];
	};
}
