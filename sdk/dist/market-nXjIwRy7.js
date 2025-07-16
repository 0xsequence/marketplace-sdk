import { OrderSide } from "./marketplace.gen-HpnpL5xU.js";
import { useConfig } from "./useConfig-UcRv5hCZ.js";
import { useListCollectibles } from "./useListCollectibles-BhLFdV3h.js";
import { useCollectionBalanceDetails } from "./useCollectionBalanceDetails-BEI04WRk.js";
import { currencyQueryOptions } from "./currency-D5SWIT_9.js";
import { marketCurrenciesQueryOptions } from "./marketCurrencies-DnKtp0ka.js";
import { useAccount } from "wagmi";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { observable } from "@legendapp/state";

//#region src/react/hooks/data/market/useCurrency.tsx
/**
* Hook to fetch currency details from the marketplace
*
* Retrieves detailed information about a specific currency by its contract address.
* The currency data is cached from previous currency list calls when possible.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.currencyAddress - The currency contract address
* @param params.query - Optional React Query configuration
*
* @returns Query result containing currency details
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useCurrency({
*   chainId: 137,
*   currencyAddress: '0x...'
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data, isLoading } = useCurrency({
*   chainId: 1,
*   currencyAddress: '0x...',
*   query: {
*     enabled: Boolean(selectedCurrency)
*   }
* })
* ```
*/
function useCurrency(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = currencyQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/ui/modals/SellModal/store.ts
const initialState = {
	isOpen: false,
	collectionAddress: "",
	chainId: 0,
	tokenId: "",
	order: void 0,
	callbacks: void 0,
	sellIsBeingProcessed: false,
	open: (args) => {
		sellModal$.collectionAddress.set(args.collectionAddress);
		sellModal$.chainId.set(args.chainId);
		sellModal$.tokenId.set(args.tokenId);
		sellModal$.order.set(args.order);
		sellModal$.callbacks.set(args.callbacks);
		sellModal$.isOpen.set(true);
	},
	close: () => {
		sellModal$.isOpen.set(false);
		sellModal$.callbacks.set(void 0);
		sellModal$.sellIsBeingProcessed.set(false);
	},
	steps: {
		approval: {
			exist: false,
			isExecuting: false,
			execute: () => Promise.resolve()
		},
		transaction: {
			exist: false,
			isExecuting: false,
			execute: () => Promise.resolve()
		}
	}
};
const sellModal$ = observable(initialState);

//#endregion
//#region src/react/ui/modals/SellModal/index.tsx
const useSellModal = (callbacks) => {
	return {
		show: (args) => sellModal$.open({
			...args,
			callbacks
		}),
		close: () => sellModal$.close()
	};
};

//#endregion
//#region src/react/hooks/data/market/useListMarketCardData.tsx
function useListMarketCardData({ collectionAddress, chainId, orderbookKind, collectionType, filterOptions, searchText, showListedOnly = false, onCollectibleClick, onCannotPerformAction, prioritizeOwnerActions, assetSrcPrefixUrl }) {
	const { address: accountAddress } = useAccount();
	const { show: showSellModal } = useSellModal();
	const { data: collectiblesList, isLoading: collectiblesListIsLoading, fetchNextPage, hasNextPage, isFetchingNextPage, error: collectiblesListError } = useListCollectibles({
		collectionAddress,
		chainId,
		side: OrderSide.listing,
		filter: {
			includeEmpty: !showListedOnly,
			searchText,
			properties: filterOptions
		},
		query: { enabled: !!collectionAddress && !!chainId }
	});
	const { data: collectionBalance, isLoading: balanceLoading } = useCollectionBalanceDetails({
		chainId,
		filter: {
			accountAddresses: accountAddress ? [accountAddress] : [],
			omitNativeBalances: true,
			contractWhitelist: [collectionAddress]
		},
		query: { enabled: !!accountAddress }
	});
	const allCollectibles = useMemo(() => {
		if (!collectiblesList?.pages) return [];
		return collectiblesList.pages.flatMap((page) => page.collectibles);
	}, [collectiblesList?.pages]);
	const collectibleCards = useMemo(() => {
		return allCollectibles.map((collectible) => {
			const balance = collectionBalance?.balances.find((balance$1) => balance$1.tokenID === collectible.metadata.tokenId)?.balance;
			const cardProps = {
				collectibleId: collectible.metadata.tokenId,
				chainId,
				collectionAddress,
				collectionType,
				cardLoading: collectiblesListIsLoading || balanceLoading,
				marketplaceType: "market",
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
							order
						});
						return;
					}
				}
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
		showSellModal
	]);
	return {
		collectibleCards,
		isLoading: collectiblesListIsLoading || balanceLoading,
		error: collectiblesListError,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
		allCollectibles
	};
}

//#endregion
//#region src/react/hooks/data/market/useMarketCurrencies.tsx
/**
* Hook to fetch supported currencies for a marketplace
*
* Retrieves the list of currencies supported by the marketplace for a specific chain.
* Can optionally filter to exclude native currency or filter by collection.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.includeNativeCurrency - Whether to include native currency (default: true)
* @param params.collectionAddress - Optional collection address to filter currencies
* @param params.query - Optional React Query configuration
*
* @returns Query result containing supported currencies
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useMarketCurrencies({
*   chainId: 137
* })
* ```
*
* @example
* Exclude native currency:
* ```typescript
* const { data, isLoading } = useMarketCurrencies({
*   chainId: 1,
*   includeNativeCurrency: false
* })
* ```
*/
function useMarketCurrencies(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = marketCurrenciesQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
export { sellModal$, useCurrency, useListMarketCardData, useMarketCurrencies, useSellModal };
//# sourceMappingURL=market-nXjIwRy7.js.map