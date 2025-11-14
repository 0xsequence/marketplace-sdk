'use client';
import { t as DEFAULT_MARKETPLACE_FEE_PERCENTAGE } from "./src-0OZDnCPq.js";
import { a as TransactionExecutionError$1, c as BaseError$1, i as NoWalletConnectedError, n as InvalidContractTypeError, o as TransactionSignatureError, s as UserRejectedRequestError$1, t as ChainSwitchError } from "./transaction-D6a81-bE.js";
import { a as getSequenceApiClient, l as getQueryClient, o as marketplaceApiURL, r as getMarketplaceClient } from "./api-D2fhCs18.js";
import { G as WalletKind, I as StepType, S as OrderSide, l as ExecuteType, o as CollectionStatus, s as ContractType, w as OrderbookKind, x as OfferType } from "./marketplace.gen-CbSVdSOZ.js";
import { n as getPresentableChainName, t as getNetwork } from "./network-CbrL_hu0.js";
import { n as PROVIDER_ID, t as TransactionType } from "./_internal-CadQmXdE.js";
import { t as CollectibleCardAction } from "./types-Bm9DM-SP.js";
import { n as SequenceMarketplaceV1_ABI, r as EIP2981_ABI } from "./marketplace-B8zmIy_s.js";
import { i as ERC721_SALE_ABI_V0, r as ERC721_SALE_ABI_V1 } from "./primary-sale-BeSWfjja.js";
import { n as ERC1155_ABI, r as ERC721_ABI } from "./token-dR3boxw7.js";
import { C as cn$1, E as truncateMiddle, a as formatPriceWithFee, o as validateOpenseaOfferDecimals, r as calculateTotalOfferCost, t as calculateEarningsAfterFees, w as compareAddress } from "./utils-Dr-4WqI6.js";
import { o as marketCheckoutOptionsQueryOptions, r as primarySaleCheckoutOptionsQueryOptions } from "./checkout-Cus2ih9a.js";
import { A as listCollectiblesQueryOptions, B as balanceOfCollectibleOptions, D as listCollectiblesPaginatedQueryOptions, N as highestOfferQueryOptions, P as countOfCollectablesQueryOptions, h as listOffersForCollectibleQueryOptions, o as primarySaleItemsQueryOptions, r as primarySaleItemsCountQueryOptions, s as collectibleQueryOptions, u as countOffersForCollectibleQueryOptions, v as lowestListingQueryOptions, w as listListingsForCollectibleQueryOptions, y as countListingsForCollectibleQueryOptions, z as listCollectibleActivitiesQueryOptions } from "./collectible-B1NWzMbQ.js";
import { n as useSalesContractABI, t as SalesContractVersion } from "./contracts-DpXVgLLZ.js";
import { n as marketplaceConfigOptions } from "./config-Bcwj-muV.js";
import { r as tokenBalancesOptions } from "./token-balances-DvVi2VxX.js";
import { C as listCollectionActivitiesQueryOptions, D as listCollectionsQueryOptions, O as collectionBalanceDetailsQueryOptions, _ as getCountOfFilteredOrdersQueryOptions, a as listItemsOrdersForCollectionPaginatedQueryOptions, d as listItemsOrdersForCollectionQueryOptions, o as countItemsOrdersForCollectionQueryOptions, p as floorOrderQueryOptions, t as collectionQueryOptions, v as collectionMarketDetailQueryOptions } from "./collection-Bxcq3NMa.js";
import { f as marketCurrenciesQueryOptions, i as comparePricesQueryOptions, s as convertPriceToUSDQueryOptions, t as currencyQueryOptions } from "./currency-Dj4yU2To.js";
import { n as inventoryOptions } from "./inventory-YV8GQ3nN.js";
import { f as listTokenMetadataQueryOptions, h as listBalancesOptions, l as searchTokenMetadataQueryOptions, o as tokenSuppliesQueryOptions, r as getTokenRangesQueryOptions } from "./token-Ce_HUTYn.js";
import { t as waitForTransactionReceipt } from "./utils-B7g7lMTe.js";
import { f as determineCardAction, h as chess_tile_default, n as CARD_TITLE_MAX_LENGTH_DEFAULT, o as getShopCardState, r as CARD_TITLE_MAX_LENGTH_WITH_OFFER, s as renderSkeletonIfLoading, t as Card } from "./Card-DnXNU_Od.js";
import { t as useFilterState } from "./url-state-CEB3qsMI.js";
import { n as filtersQueryOptions } from "./marketplace-D7Sbvc1x.js";
import { NetworkType, networks } from "@0xsequence/network";
import { ChainNotConfiguredError, ConnectorAccountNotFoundError, ConnectorAlreadyConnectedError, ConnectorChainMismatchError, ConnectorNotFoundError, ConnectorUnavailableReconnectingError, ProviderNotFoundError, SwitchChainNotSupportedError, WagmiProviderNotFoundError, useAccount, useBalance, useChainId, usePublicClient, useReadContract, useReadContracts, useSendTransaction, useSignMessage, useSignTypedData, useSwitchChain, useWriteContract } from "wagmi";
import { useChain, useOpenConnectModal, useWaasFeeOptions } from "@0xsequence/connect";
import { Component, createContext, forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { QueryClientProvider, queryOptions, skipToken, useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { TransactionStatus } from "@0xsequence/indexer";
import * as dn from "dnum";
import { AddIcon, Button, CalendarIcon, CartIcon, CheckmarkIcon, ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, CloseIcon, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuPortal, DropdownMenuTrigger, ExternalLinkIcon, Field, FieldLabel, IconButton, Image, InfoIcon, Modal, NetworkImage, NumericInput, Select, Separator, Skeleton, Spinner, SubtractIcon, Text, TextInput, ThemeProvider, TimeIcon, TokenImage, Tooltip, WarningIcon, cn } from "@0xsequence/design-system";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { BaseError, ChainMismatchError, ChainNotFoundError, ContractFunctionExecutionError, ContractFunctionRevertedError, ContractFunctionZeroDataError, FeeCapTooHighError, FeeCapTooLowError, HttpRequestError, InsufficientFundsError, IntrinsicGasTooHighError, IntrinsicGasTooLowError, InvalidAddressError, InvalidHexValueError, LimitExceededRpcError, NonceTooLowError, SwitchChainError, TimeoutError, TransactionExecutionError, TransactionReceiptNotFoundError, UserRejectedRequestError, WaitForTransactionReceiptTimeoutError, decodeFunctionData, encodeFunctionData, erc20Abi, erc721Abi, formatUnits, hexToBigInt, isAddress, isHex, maxUint256, parseEventLogs, parseUnits, toHex, zeroAddress } from "viem";
import { Databeat } from "@databeat/tracker";
import { createStore } from "@xstate/store";
import { useSelector } from "@xstate/store/react";
import { addDays, differenceInDays, endOfDay, format, formatDistanceToNow, getHours, getMinutes, isSameDay, setHours, setMinutes, startOfDay } from "date-fns";
import { avalanche, optimism } from "viem/chains";
import { readContract } from "viem/actions";
import { SequenceCheckoutProvider, useERC1155SaleContractCheckout, useSelectPaymentModal } from "@0xsequence/checkout";
import { Show, observer, use$ } from "@legendapp/state/react";
import { DayPicker } from "react-day-picker";
import { observable } from "@legendapp/state";
import { addDays as addDays$1 } from "date-fns/addDays";
import { createPortal } from "react-dom";

//#region src/utils/_internal/error/context.ts
var MarketplaceSdkProviderNotFoundError = class extends BaseError$1 {
	name = "MarketplaceSDKProviderNotFoundError";
	constructor() {
		super("`useConfig` must be used within `MarketplaceSdkProvider`.");
	}
};

//#endregion
//#region src/utils/_internal/error/config.ts
var ConfigError = class extends BaseError$1 {
	name = "ConfigError";
};
var InvalidProjectAccessKeyError = class extends ConfigError {
	name = "InvalidProjectAccessKeyError";
	constructor(projectAccessKey) {
		super(`Invalid project access key: ${projectAccessKey}`);
	}
};

//#endregion
//#region src/react/_internal/databeat/index.ts
var DatabeatAnalytics = class extends Databeat {
	trackSellItems(args) {
		this.track({
			event: "SELL_ITEMS",
			props: args.props,
			nums: args.nums
		});
	}
	trackBuyModalOpened(args) {
		this.track({
			event: "BUY_MODAL_OPENED",
			props: args.props,
			nums: args.nums
		});
	}
	trackCreateListing(args) {
		this.track({
			event: "CREATE_LISTING",
			props: args.props,
			nums: args.nums
		});
	}
	trackCreateOffer(args) {
		this.track({
			event: "CREATE_OFFER",
			props: args.props,
			nums: args.nums
		});
	}
	trackTransactionFailed(args) {
		this.track({
			event: "TRANSACTION_FAILED",
			props: args
		});
	}
};
const useAnalytics = () => {
	return useContext(MarketplaceSdkContext).analytics;
};

//#endregion
//#region src/react/providers/analytics-provider.tsx
function AnalyticsProvider({ config, children }) {
	const { address, isConnected } = useAccount();
	const isWindowDefined = typeof window !== "undefined";
	const analytics = useMemo(() => {
		const server = "https://nodes.sequence.app";
		const auth = {};
		auth.headers = { "X-Access-Key": config.projectAccessKey };
		return new DatabeatAnalytics(server, auth, {
			defaultEnabled: true,
			initProps: () => {
				return { origin: isWindowDefined ? window.location.origin : "" };
			}
		});
	}, [config.projectAccessKey, isWindowDefined]);
	useEffect(() => {
		if (!isConnected || !address) {
			analytics?.reset();
			return;
		}
		analytics?.identify(address.toLowerCase());
	}, [
		analytics,
		address,
		isConnected
	]);
	return /* @__PURE__ */ jsx(Fragment, { children: children(analytics) });
}

//#endregion
//#region src/react/providers/theme-provider.tsx
const ThemeProvider$1 = ({ children, theme, root }) => {
	const { shadowDom } = useConfig();
	if (!shadowDom) return /* @__PURE__ */ jsx(ThemeProvider, {
		theme,
		root,
		children
	});
	return children;
};

//#endregion
//#region src/react/providers/index.tsx
const MarketplaceSdkContext = createContext({});
function MarketplaceProvider({ config, children, openConnectModal }) {
	if (config.projectAccessKey === "" || !config.projectAccessKey) throw new InvalidProjectAccessKeyError(config.projectAccessKey);
	return /* @__PURE__ */ jsx(AnalyticsProvider, {
		config,
		children: (analytics) => {
			if (openConnectModal) {
				const context = {
					...config,
					openConnectModal,
					analytics
				};
				return /* @__PURE__ */ jsx(MarketplaceSdkContext.Provider, {
					value: context,
					children: /* @__PURE__ */ jsx(ThemeProvider$1, { children: /* @__PURE__ */ jsx("div", {
						id: PROVIDER_ID,
						children
					}) })
				});
			}
			return /* @__PURE__ */ jsx(MarketplaceProviderWithSequenceConnect, {
				config,
				analytics,
				children: /* @__PURE__ */ jsx(ThemeProvider$1, { children })
			});
		}
	});
}
function MarketplaceQueryClientProvider({ children }) {
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: getQueryClient(),
		children
	});
}
function MarketplaceProviderWithSequenceConnect({ config, children, analytics }) {
	const { setOpenConnectModal } = useOpenConnectModal();
	const context = {
		...config,
		openConnectModal: () => setOpenConnectModal(true),
		analytics
	};
	return /* @__PURE__ */ jsx(MarketplaceSdkContext.Provider, {
		value: context,
		children: /* @__PURE__ */ jsx("div", {
			id: PROVIDER_ID,
			children
		})
	});
}

//#endregion
//#region src/react/hooks/config/useConfig.tsx
function useConfig() {
	const context = useContext(MarketplaceSdkContext);
	if (!context) throw new MarketplaceSdkProviderNotFoundError();
	return context;
}

//#endregion
//#region src/react/hooks/checkout/market-checkout-options.tsx
/**
* Hook to fetch checkout options for marketplace orders
*
* Retrieves checkout options including available payment methods, fees, and transaction details
* for a set of marketplace orders. Requires a connected wallet to calculate wallet-specific options.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.orders - Array of orders to checkout containing collection address, order ID, and marketplace
* @param params.additionalFee - Additional fee to include in checkout (defaults to 0)
* @param params.query - Optional React Query configuration
*
* @returns Query result containing checkout options with payment methods and fees
*
* @example
* Basic usage:
* ```typescript
* const { data: checkoutOptions, isLoading } = useMarketCheckoutOptions({
*   chainId: 137,
*   orders: [{
*     collectionAddress: '0x1234...',
*     orderId: '123',
*     marketplace: MarketplaceKind.sequence_marketplace_v2
*   }],
*   additionalFee: 0
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data: checkoutOptions } = useMarketCheckoutOptions({
*   chainId: 1,
*   orders: orders,
*   query: {
*     enabled: orders.length > 0,
*     staleTime: 30000
*   }
* })
* ```
*/
function useMarketCheckoutOptions(params) {
	const { address } = useAccount();
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...marketCheckoutOptionsQueryOptions({
		config,
		walletAddress: address,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/checkout/primary-sale-checkout-options.tsx
/**
* Hook to fetch checkout options for primary sale contract items
*
* Retrieves checkout options including available payment methods, fees, and transaction details
* for items from a primary sales contract. Requires a connected wallet to calculate wallet-specific options.
*
* @param params - Configuration parameters or skipToken to skip the query
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.contractAddress - The primary sales contract address
* @param params.collectionAddress - The collection contract address
* @param params.items - Array of items to purchase with tokenId and quantity
* @param params.query - Optional React Query configuration
*
* @returns Query result containing checkout options with payment methods and fees
*
* @example
* Basic usage:
* ```typescript
* const { data: checkoutOptions, isLoading } = usePrimarySaleCheckoutOptions({
*   chainId: 137,
*   contractAddress: '0x1234...',
*   collectionAddress: '0x5678...',
*   items: [{
*     tokenId: '1',
*     quantity: '1'
*   }]
* })
* ```
*
* @example
* With skipToken to conditionally skip:
* ```typescript
* const { data: checkoutOptions } = usePrimarySaleCheckoutOptions(
*   items.length > 0 ? {
*     chainId: 1,
*     contractAddress: contractAddress,
*     collectionAddress: collectionAddress,
*     items: items
*   } : skipToken
* )
* ```
*/
function usePrimarySaleCheckoutOptions(params) {
	const { address } = useAccount();
	const defaultConfig = useConfig();
	return useQuery({ ...primarySaleCheckoutOptionsQueryOptions(params === skipToken ? {
		config: defaultConfig,
		walletAddress: address,
		chainId: 0,
		contractAddress: "",
		collectionAddress: "",
		items: [],
		query: { enabled: false }
	} : {
		config: defaultConfig,
		walletAddress: address,
		...params
	}) });
}

//#endregion
//#region src/react/hooks/collectible/balance.tsx
/**
* Hook to fetch the balance of a specific collectible for a user
*
* @param args - The arguments for fetching the balance
* @returns Query result containing the balance data
*
* @example
* ```tsx
* const { data, isLoading, error } = useCollectibleBalance({
*   collectionAddress: '0x123...',
*   collectableId: '1',
*   userAddress: '0x456...',
*   chainId: 1,
*   query: {
*     enabled: true,
*     refetchInterval: 10000,
*   }
* });
* ```
*/
function useCollectibleBalance(args) {
	const config = useConfig();
	return useQuery(balanceOfCollectibleOptions({ ...args }, config));
}

//#endregion
//#region src/react/hooks/collectible/erc721-sale-details.tsx
function useErc721SaleDetails({ chainId, salesContractAddress, itemsContractAddress, enabled = true }) {
	const { version, isLoading: versionLoading, error: versionError } = useSalesContractABI({
		contractAddress: salesContractAddress,
		contractType: ContractType.ERC721,
		chainId,
		enabled
	});
	const { saleDetails: saleDetailsV0, quantityMinted: quantityMintedV0, quantityTotal: quantityTotalV0, quantityRemaining: quantityRemainingV0, isLoading: saleDetailsLoadingV0, error: saleDetailsErrorV0 } = useErc721SaleDetailsV0({
		chainId,
		salesContractAddress,
		itemsContractAddress,
		enabled: enabled && !versionLoading && version === SalesContractVersion.V0
	});
	const { saleDetails: saleDetailsV1, quantityMinted: quantityMintedV1, quantityTotal: quantityTotalV1, quantityRemaining: quantityRemainingV1, isLoading: saleDetailsLoadingV1, error: saleDetailsErrorV1 } = useErc721SaleDetailsV1({
		chainId,
		salesContractAddress,
		itemsContractAddress,
		enabled: enabled && !versionLoading && version === SalesContractVersion.V1
	});
	return {
		saleDetails: saleDetailsV0 || saleDetailsV1,
		quantityMinted: quantityMintedV0 || quantityMintedV1,
		quantityTotal: quantityTotalV0 || quantityTotalV1,
		quantityRemaining: quantityRemainingV0 || quantityRemainingV1,
		isLoading: versionLoading || saleDetailsLoadingV0 || saleDetailsLoadingV1,
		error: versionError || saleDetailsErrorV0 || saleDetailsErrorV1
	};
}
const useErc721SaleDetailsV0 = ({ chainId, salesContractAddress, itemsContractAddress, enabled }) => {
	const { data: saleDetails, isLoading: saleDetailsLoading, error: saleDetailsError } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC721_SALE_ABI_V0,
		functionName: "saleDetails",
		query: { enabled }
	});
	const { data: erc721TotalSupply, isLoading: erc721SupplyLoading, error: erc721SupplyError } = useReadContract({
		chainId,
		address: itemsContractAddress,
		abi: ERC721_ABI,
		functionName: "totalSupply",
		query: { enabled }
	});
	const supplyCap = saleDetails?.supplyCap;
	const totalMinted = erc721TotalSupply;
	let quantityRemaining;
	if (supplyCap !== void 0 && totalMinted !== void 0) quantityRemaining = supplyCap - totalMinted;
	return {
		saleDetails,
		quantityMinted: erc721TotalSupply,
		quantityTotal: supplyCap,
		quantityRemaining,
		isLoading: saleDetailsLoading || erc721SupplyLoading,
		error: saleDetailsError || erc721SupplyError
	};
};
const useErc721SaleDetailsV1 = ({ chainId, salesContractAddress, itemsContractAddress, enabled }) => {
	const { data: saleDetails, isLoading: saleDetailsLoading, error: saleDetailsError } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC721_SALE_ABI_V1,
		functionName: "saleDetails",
		query: { enabled }
	});
	const { data: erc721TotalSupply, isLoading: erc721SupplyLoading, error: erc721SupplyError } = useReadContract({
		chainId,
		address: itemsContractAddress,
		abi: ERC721_ABI,
		functionName: "totalSupply",
		query: { enabled }
	});
	let quantityTotal;
	if (saleDetails?.remainingSupply !== void 0 && erc721TotalSupply !== void 0) quantityTotal = erc721TotalSupply + saleDetails.remainingSupply;
	return {
		saleDetails,
		quantityMinted: erc721TotalSupply,
		quantityTotal,
		quantityRemaining: saleDetails?.remainingSupply,
		isLoading: saleDetailsLoading || erc721SupplyLoading,
		error: saleDetailsError || erc721SupplyError
	};
};

//#endregion
//#region src/react/hooks/collectible/market-activities.tsx
/**
* Hook to fetch a list of activities for a specific collectible
*
* Fetches activities (transfers, sales, offers, etc.) for a specific token
* from the marketplace with support for pagination and sorting.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.tokenId - The specific token ID to fetch activities for
* @param params.page - Page number to fetch (default: 1)
* @param params.pageSize - Number of activities per page (default: 10)
* @param params.sort - Sort order for activities
* @param params.query - Optional React Query configuration
*
* @returns Query result containing activities data
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useCollectibleMarketActivities({
*   chainId: 137,
*   collectionAddress: '0x...',
*   tokenId: '123'
* })
* ```
*
* @example
* With pagination:
* ```typescript
* const { data } = useCollectibleMarketActivities({
*   chainId: 1,
*   collectionAddress: '0x...',
*   tokenId: '456',
*   page: 2,
*   pageSize: 20
* })
* ```
*
* @example
* With sorting:
* ```typescript
* const { data } = useCollectibleMarketActivities({
*   chainId: 137,
*   collectionAddress: '0x...',
*   tokenId: '789',
*   sort: 'timestamp_desc',
*   pageSize: 50
* })
* ```
*/
function useCollectibleMarketActivities(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...listCollectibleActivitiesQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/collectible/market-count.tsx
/**
* Hook to get the count of collectibles in a market collection
*
* Counts either all collectibles or filtered collectibles based on provided parameters.
* When filter and side parameters are provided, returns count of filtered collectibles.
* Otherwise returns count of all collectibles in the collection.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.filter - Optional filter criteria for collectibles
* @param params.side - Optional order side (BUY/SELL) when using filters
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the count of collectibles
*
* @example
* Basic usage (count all collectibles):
* ```typescript
* const { data: totalCount, isLoading } = useCollectibleMarketCount({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
* ```
*
* @example
* With filters (count filtered collectibles):
* ```typescript
* const { data: filteredCount } = useCollectibleMarketCount({
*   chainId: 137,
*   collectionAddress: '0x...',
*   filter: { priceRange: { min: '1000000000000000000' } },
*   side: OrderSide.SELL
* })
* ```
*/
function useCollectibleMarketCount(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...countOfCollectablesQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/collectible/market-highest-offer.tsx
/**
* Hook to fetch the highest offer for a collectible
*
* Retrieves the highest offer currently available for a specific token
* in a collection from the marketplace.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.tokenId - The token ID within the collection
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the highest offer data or null if no offers exist
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useCollectibleMarketHighestOffer({
*   chainId: 137,
*   collectionAddress: '0x...',
*   tokenId: '1'
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data, isLoading } = useCollectibleMarketHighestOffer({
*   chainId: 1,
*   collectionAddress: '0x...',
*   tokenId: '42',
*   query: {
*     refetchInterval: 15000,
*     enabled: hasTokenId
*   }
* })
* ```
*/
function useCollectibleMarketHighestOffer(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...highestOfferQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/collectible/market-list.tsx
/**
* Hook to fetch a list of collectibles with infinite pagination support
*
* Fetches collectibles from the marketplace with support for filtering, pagination,
* and special handling for shop marketplace types.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.side - Order side (listing or bid)
* @param params.filter - Optional filtering parameters
* @param params.marketplaceType - Type of marketplace (shop, etc.)
* @param params.query - Optional React Query configuration
*
* @returns Infinite query result containing collectibles data with pagination
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading, fetchNextPage, hasNextPage } = useCollectibleMarketList {
*   chainId: 137,
*   collectionAddress: '0x...',
*   side: OrderSide.listing
* })
* ```
*
* @example
* With filtering:
* ```typescript
* const { data, fetchNextPage } = useCollectibleMarketList {
*   chainId: 1,
*   collectionAddress: '0x...',
*   side: OrderSide.listing,
*   filter: {
*     searchText: 'dragon',
*     includeEmpty: false,
*     marketplaces: [MarketplaceKind.sequence_marketplace_v2]
*   }
* })
* ```
*/
function useCollectibleMarketList(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useInfiniteQuery({ ...listCollectiblesQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/collectible/market-list-paginated.tsx
/**
* Hook to fetch a list of collectibles with pagination support
*
* Fetches collectibles from the marketplace with support for filtering and pagination.
* Unlike the infinite query version, this hook fetches a specific page of results.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.side - Order side (listing or bid)
* @param params.filter - Optional filtering parameters
* @param params.page - Page number to fetch (default: 1)
* @param params.pageSize - Number of items per page (default: 30)
* @param params.query - Optional React Query configuration
*
* @returns Query result containing collectibles data for the specific page
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useCollectibleMarketListPaginated({
*   chainId: 137,
*   collectionAddress: '0x...',
*   side: OrderSide.listing,
*   page: 1,
*   pageSize: 20
* })
* ```
*
* @example
* With filtering:
* ```typescript
* const { data } = useCollectibleMarketListPaginated({
*   chainId: 1,
*   collectionAddress: '0x...',
*   side: OrderSide.listing,
*   page: 2,
*   pageSize: 50,
*   filter: {
*     searchText: 'rare',
*     includeEmpty: false
*   }
* })
* ```
*
* @example
* Controlled pagination:
* ```typescript
* const [currentPage, setCurrentPage] = useState(1);
* const { data, isLoading } = useCollectibleMarketListPaginated({
*   chainId: 137,
*   collectionAddress: '0x...',
*   side: OrderSide.listing,
*   page: currentPage,
*   pageSize: 25
* });
*
* const hasMorePages = data?.page?.more;
* ```
*/
function useCollectibleMarketListPaginated(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...listCollectiblesPaginatedQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/collectible/market-listings.tsx
/**
* Hook to fetch listings for a specific collectible
*
* Fetches active listings (sales) for a specific token from the marketplace
* with support for filtering and pagination.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.collectibleId - The specific token ID to fetch listings for
* @param params.filter - Optional filtering parameters (marketplace, currencies, etc.)
* @param params.page - Optional pagination parameters
* @param params.query - Optional React Query configuration
*
* @returns Query result containing listings data for the collectible
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useCollectibleMarketListings({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '123'
* })
* ```
*
* @example
* With pagination:
* ```typescript
* const { data } = useCollectibleMarketListings({
*   chainId: 1,
*   collectionAddress: '0x...',
*   collectibleId: '456',
*   page: {
*     page: 2,
*     pageSize: 20
*   }
* })
* ```
*
* @example
* With filtering:
* ```typescript
* const { data } = useCollectibleMarketListings({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '789',
*   filter: {
*     marketplace: [MarketplaceKind.sequence_marketplace_v2],
*     currencies: ['0x...'] // Specific currency addresses
*   }
* })
* ```
*/
function useCollectibleMarketListings(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...listListingsForCollectibleQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/collectible/market-listings-count.tsx
/**
* Hook to get the count of listings for a specific collectible
*
* Counts the number of active listings for a given collectible in the marketplace.
* Useful for displaying listing counts in UI components.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.collectibleId - The specific collectible/token ID
* @param params.filter - Optional filter criteria for listings
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the count of listings
*
* @example
* Basic usage:
* ```typescript
* const { data: listingCount, isLoading } = useCollectibleMarketListingsCount({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '123'
* })
* ```
*
* @example
* With filter:
* ```typescript
* const { data: filteredCount } = useCollectibleMarketListingsCount({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '123',
*   filter: { priceRange: { min: '1000000000000000000' } }
* })
* ```
*/
function useCollectibleMarketListingsCount(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...countListingsForCollectibleQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/collectible/market-lowest-listing.tsx
/**
* Hook to fetch the lowest listing for a collectible
*
* Retrieves the lowest priced listing currently available for a specific token
* in a collection from the marketplace.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.tokenId - The token ID within the collection
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the lowest listing data or null if no listings exist
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useCollectibleMarketLowestListing({
*   chainId: 137,
*   collectionAddress: '0x...',
*   tokenId: '1'
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data, isLoading } = useCollectibleMarketLowestListing({
*   chainId: 1,
*   collectionAddress: '0x...',
*   tokenId: '42',
*   query: {
*     refetchInterval: 15000,
*     enabled: hasTokenId
*   }
* })
* ```
*/
function useCollectibleMarketLowestListing(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...lowestListingQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/collectible/market-offers.tsx
/**
* Hook to fetch offers for a specific collectible
*
* Fetches offers for a specific collectible from the marketplace.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.collectibleId - The specific collectible ID to fetch offers for
* @param params.filter - Optional filtering parameters
* @param params.page - Optional pagination parameters
* @param params.query - Optional React Query configuration
*
* @returns Query result containing offers data
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useCollectibleMarketOffers({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '1'
* })
* ```
*
* @example
* With filtering:
* ```typescript
* const { data } = useCollectibleMarketOffers({
*   chainId: 1,
*   collectionAddress: '0x...',
*   collectibleId: '1',
*   filter: {
*     marketplace: [MarketplaceKind.sequence_marketplace_v2]
*   }
* })
* ```
*/
function useCollectibleMarketOffers(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...listOffersForCollectibleQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/collectible/market-offers-count.tsx
/**
* Hook to get the count of offers for a specific collectible
*
* Counts the number of active offers for a given collectible in the marketplace.
* Useful for displaying offer counts in UI components.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.collectibleId - The specific collectible/token ID
* @param params.filter - Optional filter criteria for offers
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the count of offers
*
* @example
* Basic usage:
* ```typescript
* const { data: offerCount, isLoading } = useCollectibleMarketOffersCount({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '123'
* })
* ```
*
* @example
* With filter:
* ```typescript
* const { data: filteredCount } = useCollectibleMarketOffersCount({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '123',
*   filter: { priceRange: { min: '1000000000000000000' } }
* })
* ```
*/
function useCollectibleMarketOffersCount(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...countOffersForCollectibleQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/collectible/metadata.tsx
/**
* Hook to fetch metadata for a specific collectible
*
* This hook retrieves metadata for an individual NFT from a collection,
* including properties like name, description, image, attributes, etc.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.collectibleId - The token ID of the collectible
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the collectible metadata
*
* @example
* Basic usage:
* ```typescript
* const { data: collectible, isLoading } = useCollectibleMetadata({
*   chainId: 137,
*   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
*   collectibleId: '12345'
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data } = useCollectibleMetadata({
*   chainId: 137,
*   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
*   collectibleId: '12345',
*   query: {
*     enabled: Boolean(collectionAddress && tokenId),
*     staleTime: 30_000
*   }
* })
* ```
*/
function useCollectibleMetadata(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...collectibleQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/collectible/primary-sale-items.tsx
/**
* Hook to fetch primary sale items with pagination support
*
* Retrieves a paginated list of primary sale items for a specific contract address
* from the marketplace.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.primarySaleContractAddress - The primary sale contract address
* @param params.filter - Optional filter parameters for the query
* @param params.page - Optional pagination parameters
* @param params.query - Optional React Query configuration
*
* @returns Infinite query result containing the primary sale items data
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = usePrimarySaleItems({
*   chainId: 137,
*   primarySaleContractAddress: '0x...',
* })
* ```
*
* @example
* With filters and pagination:
* ```typescript
* const { data, isLoading } = usePrimarySaleItems({
*   chainId: 1,
*   primarySaleContractAddress: '0x...',
*   filter: { status: 'active' },
*   page: { page: 1, pageSize: 20 },
*   query: {
*     enabled: isReady
*   }
* })
* ```
*/
function usePrimarySaleItems(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useInfiniteQuery(primarySaleItemsQueryOptions({
		config,
		...rest
	}));
}

//#endregion
//#region src/react/hooks/collectible/primary-sale-items-count.tsx
function usePrimarySaleItemsCount(args) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = args;
	return useQuery(primarySaleItemsCountQueryOptions({
		config,
		...rest
	}));
}

//#endregion
//#region src/react/hooks/collectible/token-balances.tsx
/**
* Hook to fetch all token balances for a user in a collection
*
* @param args - The arguments for fetching the balances
* @returns Query result containing the balances data
*
* @example
* ```tsx
* const { data, isLoading, error } = useCollectibleTokenBalances({
*   collectionAddress: '0x123...',
*   userAddress: '0x456...',
*   chainId: 1,
*   query: {
*     enabled: true,
*     refetchInterval: 10000,
*   }
* });
* ```
*/
function useCollectibleTokenBalances(args) {
	const config = useConfig();
	return useQuery(tokenBalancesOptions({ ...args }, config));
}

//#endregion
//#region src/react/hooks/collection/balance-details.tsx
/**
* Hook to fetch detailed balance information for multiple accounts
*
* Retrieves token balances and native balances for multiple account addresses,
* with support for contract whitelisting and optional native balance exclusion.
* Aggregates results from multiple account addresses into a single response.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.filter - Filter configuration for balance queries
* @param params.filter.accountAddresses - Array of account addresses to query balances for
* @param params.filter.contractWhitelist - Optional array of contract addresses to filter by
* @param params.filter.omitNativeBalances - Whether to exclude native token balances
* @param params.query - Optional React Query configuration
*
* @returns Query result containing aggregated balance details for all accounts
*
* @example
* Basic usage:
* ```typescript
* const { data: balanceDetails, isLoading } = useCollectionBalanceDetails({
*   chainId: 137,
*   filter: {
*     accountAddresses: ['0x1234...', '0x5678...'],
*     omitNativeBalances: false
*   }
* })
*
* if (data) {
*   console.log(`Found ${data.balances.length} token balances`);
*   console.log(`Found ${data.nativeBalances.length} native balances`);
* }
* ```
*
* @example
* With contract whitelist:
* ```typescript
* const { data: balanceDetails } = useCollectionBalanceDetails({
*   chainId: 1,
*   filter: {
*     accountAddresses: [userAddress],
*     contractWhitelist: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'], // USDC only
*     omitNativeBalances: true
*   },
*   query: {
*     enabled: Boolean(userAddress),
*     refetchInterval: 60000 // Refresh every minute
*   }
* })
* ```
*/
function useCollectionBalanceDetails(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...collectionBalanceDetailsQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/config/useMarketplaceConfig.tsx
const useMarketplaceConfig = () => {
	return useQuery(marketplaceConfigOptions(useConfig()));
};

//#endregion
//#region src/react/hooks/collection/list.tsx
/**
* Hook to fetch collections from marketplace configuration
*
* Retrieves all collections configured in the marketplace, with optional filtering
* by marketplace type. Combines metadata from the metadata API with marketplace
* configuration to provide complete collection information.
*
* @param params - Configuration parameters
* @param params.marketplaceType - Optional filter by marketplace type
* @param params.query - Optional React Query configuration
*
* @returns Query result containing array of collections with metadata
*
* @example
* Basic usage:
* ```typescript
* const { data: collections, isLoading } = useListCollections();
*
* if (isLoading) return <div>Loading collections...</div>;
*
* return (
*   <div>
*     {collections?.map(collection => (
*       <div key={collection.itemsAddress}>
*         {collection.name}
*       </div>
*     ))}
*   </div>
* );
* ```
*
* @example
* Filtering by marketplace type:
* ```typescript
* const { data: marketCollections } = useCollectionList({
*   marketplaceType: 'market'
* });
* ```
*/
function useCollectionList(params = {}) {
	const defaultConfig = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const { config = defaultConfig, marketplaceConfig: paramMarketplaceConfig,...rest } = params;
	return useQuery({ ...listCollectionsQueryOptions({
		config,
		marketplaceConfig: paramMarketplaceConfig || marketplaceConfig,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/collection/market-activities.tsx
/**
* Hook to fetch a list of activities for an entire collection
*
* Fetches activities (transfers, sales, offers, etc.) for all tokens
* in a collection from the marketplace with support for pagination and sorting.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.page - Page number to fetch (default: 1)
* @param params.pageSize - Number of activities per page (default: 10)
* @param params.sort - Sort order for activities
* @param params.query - Optional React Query configuration
*
* @returns Query result containing activities data for the collection
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useCollectionMarketActivities({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
* ```
*
* @example
* With pagination:
* ```typescript
* const { data } = useCollectionMarketActivities({
*   chainId: 1,
*   collectionAddress: '0x...',
*   page: 2,
*   pageSize: 20
* })
* ```
*
* @example
* With sorting:
* ```typescript
* const { data } = useCollectionMarketActivities({
*   chainId: 137,
*   collectionAddress: '0x...',
*   sort: [{ column: 'createdAt', order: SortOrder.DESC }],
*   pageSize: 50
* })
* ```
*/
function useCollectionMarketActivities(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...listCollectionActivitiesQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/collection/market-detail-polling.tsx
const INITIAL_POLLING_INTERVAL = 2e3;
const MAX_POLLING_INTERVAL = 3e4;
const MAX_ATTEMPTS = 30;
const isTerminalState = (status) => {
	return [
		CollectionStatus.active,
		CollectionStatus.failed,
		CollectionStatus.inactive,
		CollectionStatus.incompatible_type
	].includes(status);
};
const collectionMarketDetailPollingOptions = (args, config) => {
	return queryOptions({
		...collectionMarketDetailQueryOptions({
			...args,
			config
		}),
		refetchInterval: (query) => {
			const data = query.state.data;
			if (data && isTerminalState(data.status)) return false;
			const currentAttempt = (query.state.dataUpdateCount || 0) + 1;
			if (currentAttempt >= MAX_ATTEMPTS) return false;
			return Math.min(INITIAL_POLLING_INTERVAL * 1.5 ** currentAttempt, MAX_POLLING_INTERVAL);
		},
		refetchOnWindowFocus: false,
		retry: false,
		enabled: args.query?.enabled ?? true
	});
};
const useCollectionMarketDetailPolling = (args) => {
	return useQuery(collectionMarketDetailPollingOptions(args, useConfig()));
};

//#endregion
//#region src/react/hooks/collection/market-filtered-count.tsx
function useCollectionMarketFilteredCount(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...getCountOfFilteredOrdersQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/collection/market-floor.tsx
/**
* Hook to fetch the floor order for a collection
*
* Retrieves the lowest priced order (listing) currently available for any token
* in the specified collection from the marketplace.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.filter - Optional filter criteria for collectibles
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the floor order data for the collection
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useCollectionMarketFloor({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
* ```
*
* @example
* With filters and custom query options:
* ```typescript
* const { data, isLoading } = useCollectionMarketFloor({
*   chainId: 1,
*   collectionAddress: '0x...',
*   filter: {
*     minPrice: '1000000000000000000' // 1 ETH in wei
*   },
*   query: {
*     refetchInterval: 30000,
*     enabled: hasCollectionAddress
*   }
* })
* ```
*/
function useCollectionMarketFloor(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...floorOrderQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/collection/market-items.tsx
/**
* Hook to fetch all listings for a collection with infinite pagination support
*
* Fetches active listings (sales) for all tokens in a collection from the marketplace
* with support for filtering and infinite scroll pagination.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.filter - Optional filtering parameters (marketplace, currencies, etc.)
* @param params.query - Optional React Query configuration
*
* @returns Infinite query result containing listings data with pagination
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading, fetchNextPage, hasNextPage } = useCollectionMarketItems({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
* ```
*
* @example
* With filtering:
* ```typescript
* const { data, fetchNextPage } = useCollectionMarketItems({
*   chainId: 1,
*   collectionAddress: '0x...',
*   filter: {
*     marketplace: [MarketplaceKind.sequence_marketplace_v2],
*     currencies: ['0x...']
*   }
* })
* ```
*
* @example
* Accessing paginated data:
* ```typescript
* const { data } = useCollectionMarketItems({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
*
* const allListings = data?.pages.flatMap(page => page.listings) ?? []
* ```
*/
function useCollectionMarketItems(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useInfiniteQuery({ ...listItemsOrdersForCollectionQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/collection/market-items-count.tsx
/**
* Hook to get the count of orders for a collection
*
* Counts the total number of active orders (listings) for all tokens
* in a collection. Useful for displaying order counts in collection UI.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.filter - Optional filter criteria for orders
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the count of orders
*
* @example
* Basic usage:
* ```typescript
* const { data: orderCount, isLoading } = useCollectionMarketItemsCount({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
* ```
*
* @example
* With filter:
* ```typescript
* const { data: filteredCount } = useCollectionMarketItemsCount({
*   chainId: 137,
*   collectionAddress: '0x...',
*   filter: {
*     marketplace: [MarketplaceKind.sequence_marketplace_v2]
*   }
* })
* ```
*
* @example
* Combined with list hook:
* ```typescript
* const { data: totalCount } = useCollectionMarketItemsCount({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
*
* const { data: orders } = useListItemsOrdersForCollection({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
*
* return <div>Showing {orders?.pages[0]?.listings.length ?? 0} of {totalCount} orders</div>
* ```
*/
function useCollectionMarketItemsCount(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...countItemsOrdersForCollectionQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/collection/market-items-paginated.tsx
/**
* Hook to fetch all listings for a collection with pagination support
*
* Fetches active listings (sales) for all tokens in a collection from the marketplace
* with support for filtering and pagination. Unlike the infinite query version,
* this hook fetches a specific page of results.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.side - Order side (listing or bid)
* @param params.filter - Optional filtering parameters (marketplace, currencies, etc.)
* @param params.page - Page number to fetch (default: 1)
* @param params.pageSize - Number of items per page (default: 30)
* @param params.query - Optional React Query configuration
*
* @returns Query result containing listings data for the specific page
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useCollectionMarketItemsPaginated({
*   chainId: 137,
*   collectionAddress: '0x...',
*   side: OrderSide.listing,
*   page: 1,
*   pageSize: 20
* })
* ```
*
* @example
* With filtering:
* ```typescript
* const { data } = useCollectionMarketItemsPaginated({
*   chainId: 1,
*   collectionAddress: '0x...',
*   side: OrderSide.listing,
*   page: 2,
*   pageSize: 50,
*   filter: {
*     marketplace: [MarketplaceKind.sequence_marketplace_v2],
*     currencies: ['0x...']
*   }
* })
* ```
*
* @example
* Controlled pagination:
* ```typescript
* const [currentPage, setCurrentPage] = useState(1);
* const { data, isLoading } = useCollectionMarketItemsPaginated({
*   chainId: 137,
*   collectionAddress: '0x...',
*   side: OrderSide.listing,
*   page: currentPage,
*   pageSize: 25
* });
*
* const hasMorePages = data?.page?.more;
* ```
*/
function useCollectionMarketItemsPaginated(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...listItemsOrdersForCollectionPaginatedQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/collection/metadata.tsx
/**
* Hook to fetch collection information from the metadata API
*
* Retrieves basic contract information including name, symbol, type,
* and extension data for a given collection contract.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.query - Optional React Query configuration
*
* @returns Query result containing contract information
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useCollectionMetadata({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data, isLoading } = useCollectionMetadata({
*   chainId: 1,
*   collectionAddress: '0x...',
*   query: {
*     refetchInterval: 30000,
*     enabled: userWantsToFetch
*   }
* })
* ```
*/
function useCollectionMetadata(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...collectionQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/currency/compare-prices.tsx
/**
* Hook to compare prices between different currencies by converting both to USD
*
* Compares two prices by converting both to USD using real-time exchange rates
* and returns the percentage difference with comparison status.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.priceAmountRaw - The raw amount of the first price (wei format)
* @param params.priceCurrencyAddress - The currency address of the first price
* @param params.compareToPriceAmountRaw - The raw amount of the second price to compare against (wei format)
* @param params.compareToPriceCurrencyAddress - The currency address of the second price
* @param params.query - Optional React Query configuration
*
* @returns Query result containing percentage difference and comparison status
*
* @example
* Basic usage:
* ```typescript
* const { data: comparison, isLoading } = useCurrencyComparePrices({
*   chainId: 1,
*   priceAmountRaw: '1000000000000000000', // 1 ETH in wei
*   priceCurrencyAddress: '0x0000000000000000000000000000000000000000', // ETH
*   compareToPriceAmountRaw: '2000000000', // 2000 USDC in wei (6 decimals)
*   compareToPriceCurrencyAddress: '0xA0b86a33E6B8DbF5E71Eaa9bfD3F6fD8e8Be3F69' // USDC
* })
*
* if (data) {
*   console.log(`${data.percentageDifferenceFormatted}% ${data.status}`);
*   // e.g., "25.50% above" or "10.25% below"
* }
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data: comparison } = useCurrencyComparePrices({
*   chainId: 137,
*   priceAmountRaw: price1,
*   priceCurrencyAddress: currency1Address,
*   compareToPriceAmountRaw: price2,
*   compareToPriceCurrencyAddress: currency2Address,
*   query: {
*     enabled: Boolean(price1 && price2),
*     refetchInterval: 30000 // Refresh every 30 seconds
*   }
* })
* ```
*/
function useCurrencyComparePrices(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...comparePricesQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/currency/convert-to-usd.tsx
/**
* Hook to convert a price amount from a specific currency to USD
*
* Converts cryptocurrency amounts to their USD equivalent using current exchange rates.
* Fetches currency data and calculates the USD value based on the provided amount
* and currency address.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.currencyAddress - The currency contract address to convert from
* @param params.amountRaw - The raw amount in smallest units (e.g., wei for ETH)
* @param params.query - Optional React Query configuration
*
* @returns Query result containing USD amount and formatted USD amount
*
* @example
* Basic ETH to USD conversion:
* ```typescript
* const { data: conversion, isLoading } = useCurrencyConvertToUSD({
*   chainId: 1,
*   currencyAddress: '0x0000000000000000000000000000000000000000', // ETH
*   amountRaw: '1000000000000000000' // 1 ETH in wei
* })
*
* if (data) {
*   console.log(`$${data.usdAmountFormatted}`); // e.g., "$2000.00"
*   console.log(data.usdAmount); // e.g., 2000
* }
* ```
*
* @example
* ERC-20 token conversion with conditional enabling:
* ```typescript
* const { data: conversion } = useCurrencyConvertToUSD({
*   chainId: 137,
*   currencyAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC on Polygon
*   amountRaw: '1000000', // 1 USDC (6 decimals)
*   query: {
*     enabled: Boolean(userHasTokens),
*     refetchInterval: 30000 // Update price every 30 seconds
*   }
* })
* ```
*/
function useCurrencyConvertToUSD(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...convertPriceToUSDQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/currency/currency.tsx
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
	return useQuery({ ...currencyQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/currency/list.tsx
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
* const { data, isLoading } = useCurrencyList({
*   chainId: 137
* })
* ```
*
* @example
* Exclude native currency:
* ```typescript
* const { data, isLoading } = useCurrencyList({
*   chainId: 1,
*   includeNativeCurrency: false
* })
* ```
*/
function useCurrencyList(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...marketCurrenciesQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/inventory/inventory.tsx
function useInventory(args) {
	const config = useConfig();
	return useQuery(inventoryOptions({ ...args }, config));
}

//#endregion
//#region src/react/hooks/token/balances.tsx
/**
* Hook to fetch a list of token balances with pagination support
*
* @param args - The arguments for fetching the balances
* @returns Infinite query result containing the balances data
*
* @example
* ```tsx
* const { data, isLoading, error, fetchNextPage } = useTokenBalances({
*   chainId: 1,
*   accountAddress: '0x123...',
*   includeMetadata: true,
*   query: {
*     enabled: true,
*     refetchInterval: 10000,
*   }
* });
* ```
*/
function useTokenBalances(args) {
	const config = useConfig();
	return useInfiniteQuery(listBalancesOptions({ ...args }, config));
}

//#endregion
//#region src/react/hooks/token/currency-balance.tsx
/**
* Hook to fetch cryptocurrency balance for a user
*
* Retrieves the balance of a specific currency (native token or ERC-20)
* for a given user address using wagmi. Handles both native tokens (ETH, MATIC, etc.)
* and ERC-20 tokens with automatic decimal formatting through direct blockchain calls.
*
* @param args - Configuration parameters
* @param args.currencyAddress - The currency contract address (use zero address for native tokens)
* @param args.chainId - The chain ID to query on
* @param args.userAddress - The user address to check balance for
* @param args.query - Optional wagmi query configuration
*
* @returns Wagmi query result containing raw and formatted balance values
*
* @example
* Native token balance (ETH):
* ```typescript
* const { data: ethBalance, isLoading } = useTokenCurrencyBalance({
*   currencyAddress: '0x0000000000000000000000000000000000000000', // Zero address for ETH
*   chainId: 1,
*   userAddress: '0x1234...'
* })
*
* if (data) {
*   console.log(`ETH Balance: ${data.formatted} ETH`); // e.g., "1.5 ETH"
*   console.log(`Raw balance: ${data.value.toString()}`); // e.g., "1500000000000000000"
* }
* ```
*
* @example
* ERC-20 token balance (USDC):
* ```typescript
* const { data: usdcBalance } = useTokenCurrencyBalance({
*   currencyAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
*   chainId: 1,
*   userAddress: userAddress,
*   query: {
*     enabled: Boolean(userAddress), // Only fetch when user is connected
*     refetchInterval: 30000 // Update every 30 seconds
*   }
* })
*
* if (data) {
*   console.log(`USDC Balance: $${data.formatted}`); // e.g., "$1000.50"
* }
* ```
*/
function useTokenCurrencyBalance(args) {
	const { currencyAddress, chainId, userAddress, query } = args;
	const hasAllParams = Boolean(currencyAddress && chainId && userAddress);
	const isNativeToken = currencyAddress === zeroAddress;
	const nativeBalance = useBalance({
		address: userAddress,
		chainId,
		query: {
			...query,
			enabled: hasAllParams && isNativeToken && (query?.enabled ?? true)
		}
	});
	const erc20Balance = useReadContracts({
		contracts: hasAllParams && !isNativeToken && currencyAddress && userAddress ? [{
			address: currencyAddress,
			abi: erc20Abi,
			functionName: "balanceOf",
			args: [userAddress],
			chainId
		}, {
			address: currencyAddress,
			abi: erc20Abi,
			functionName: "decimals",
			chainId
		}] : [],
		query: {
			...query,
			enabled: hasAllParams && !isNativeToken && (query?.enabled ?? true)
		}
	});
	if (isNativeToken) return {
		...nativeBalance,
		data: nativeBalance.data ? {
			value: nativeBalance.data.value,
			formatted: nativeBalance.data.formatted
		} : void 0
	};
	const [balanceResult, decimalsResult] = erc20Balance.data || [];
	const balance = balanceResult?.result;
	const decimals = decimalsResult?.result;
	const formattedData = balance !== void 0 && decimals !== void 0 ? {
		value: balance,
		formatted: formatUnits(balance, decimals)
	} : void 0;
	return {
		...erc20Balance,
		data: formattedData
	};
}

//#endregion
//#region src/react/hooks/token/metadata.tsx
/**
* Hook to fetch metadata for multiple tokens
*
* Retrieves metadata for a batch of tokens from a specific contract using the metadata API.
* This hook is optimized for fetching multiple token metadata in a single request.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.contractAddress - The contract address containing the tokens
* @param params.tokenIds - Array of token IDs to fetch metadata for
* @param params.config - Optional SDK configuration (defaults from context)
* @param params.query - Optional React Query configuration
*
* @returns Query result containing an array of token metadata
*
* @example
* Basic usage:
* ```typescript
* const { data: metadata, isLoading } = useTokenMetadata({
*   chainId: 137,
*   contractAddress: '0x...',
*   tokenIds: ['1', '2', '3']
* })
* ```
*
* @example
* With query options:
* ```typescript
* const { data: metadata } = useTokenMetadata({
*   chainId: 1,
*   contractAddress: '0x...',
*   tokenIds: selectedTokenIds,
*   query: {
*     enabled: selectedTokenIds.length > 0,
*     staleTime: 10 * 60 * 1000 // 10 minutes
*   }
* })
* ```
*/
function useTokenMetadata(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...listTokenMetadataQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/token/metadata-search.tsx
/**
* Hook to search token metadata using filters with infinite pagination support
*
* Searches for tokens in a collection based on text and property filters.
* Supports filtering by attributes, ranges, and text search.
* Can optionally filter to only show minted tokens (tokens with supply > 0).
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.filter - Filter criteria for the search
* @param params.filter.text - Optional text search query
* @param params.filter.properties - Optional array of property filters
* @param params.page - Optional pagination parameters
* @param params.query - Optional React Query configuration
* @param params.onlyMinted - If true, only return minted tokens (tokens with supply > 0)
*
* @returns Infinite query result containing matching token metadata with pagination support
*
* @example
* Basic text search with pagination:
* ```typescript
* const { data, isLoading, fetchNextPage, hasNextPage } = useTokenMetadataSearch({
*   chainId: 137,
*   collectionAddress: '0x...',
*   filter: {
*     text: 'dragon'
*   }
* })
* ```
*
* @example
* Property filters:
* ```typescript
* const { data, fetchNextPage } = useTokenMetadataSearch({
*   chainId: 1,
*   collectionAddress: '0x...',
*   filter: {
*     properties: [
*       {
*         name: 'Rarity',
*         type: PropertyType.STRING,
*         values: ['Legendary', 'Epic']
*       },
*       {
*         name: 'Level',
*         type: PropertyType.INT,
*         min: 50,
*         max: 100
*       }
*     ]
*   }
* })
* ```
*
* @example
* Search only minted tokens:
* ```typescript
* const { data, fetchNextPage } = useTokenMetadataSearch({
*   chainId: 1,
*   collectionAddress: '0x...',
*   onlyMinted: true,
*   filter: {
*     text: 'dragon'
*   }
* })
* ```
*/
function useTokenMetadataSearch(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, onlyMinted,...rest } = params;
	const { data: suppliesData, hasNextPage: hasNextSuppliesPage, isFetching: isSuppliesFetching, isLoading: isSuppliesLoading, error: suppliesError, fetchNextPage: fetchNextSuppliesPage } = useInfiniteQuery(tokenSuppliesQueryOptions({
		chainId: params.chainId,
		collectionAddress: params.collectionAddress,
		config,
		includeMetadata: true,
		query: { enabled: onlyMinted && !!params.collectionAddress && (params.query?.enabled ?? true) }
	}));
	const queryOptions$1 = searchTokenMetadataQueryOptions({
		config,
		...rest
	});
	const result = useInfiniteQuery({
		...queryOptions$1,
		enabled: onlyMinted ? !isSuppliesLoading && !suppliesError && queryOptions$1.enabled : queryOptions$1.enabled
	});
	if (onlyMinted && suppliesError) return {
		...result,
		isError: true,
		error: suppliesError,
		data: void 0
	};
	if (!onlyMinted) return {
		...result,
		data: result.data ? {
			tokenMetadata: result.data.pages.flatMap((page) => page.tokenMetadata),
			page: result.data.pages[result.data.pages.length - 1]?.page
		} : void 0
	};
	const mintedTokenIds = new Set(suppliesData?.pages.flatMap((page) => page.tokenIDs)?.filter((token) => BigInt(token.supply) > 0n).map((token) => token.tokenID) ?? []);
	const filteredTokenMetadata = result.data?.pages.flatMap((page) => page.tokenMetadata).filter((metadata) => mintedTokenIds.has(metadata.tokenId));
	const lastPage = result.data?.pages[result.data.pages.length - 1]?.page;
	const shouldFetchNextMetadataPage = result.hasNextPage && (filteredTokenMetadata?.length ?? 0) < (mintedTokenIds?.size ?? 0);
	const fetchNextPage = async () => {
		if (hasNextSuppliesPage && !isSuppliesFetching) await fetchNextSuppliesPage();
	};
	return {
		...result,
		hasNextPage: shouldFetchNextMetadataPage || hasNextSuppliesPage,
		data: result.data ? {
			tokenMetadata: filteredTokenMetadata ?? [],
			page: lastPage
		} : void 0,
		isLoading: result.isLoading || isSuppliesLoading,
		isFetching: result.isFetching || isSuppliesFetching,
		error: result.error || suppliesError,
		fetchNextPage
	};
}

//#endregion
//#region src/react/hooks/token/ranges.tsx
/**
* Hook to fetch token ID ranges for a collection
*
* Retrieves the available token ID ranges for a specific collection,
* which is useful for understanding the token distribution and
* available tokens within a collection.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address to fetch ranges for
* @param params.query - Optional React Query configuration
*
* @returns Query result containing token ID ranges for the collection
*
* @example
* Basic usage:
* ```typescript
* const { data: tokenRanges, isLoading } = useTokenRanges({
*   chainId: 137,
*   collectionAddress: '0x1234...'
* })
*
* if (data) {
*   console.log(`Token ranges: ${JSON.stringify(data.tokenIDRanges)}`);
*   data.tokenIDRanges?.forEach(range => {
*     console.log(`Range: ${range.start} - ${range.end}`);
*   });
* }
* ```
*
* @example
* With conditional enabling:
* ```typescript
* const { data: tokenRanges } = useTokenRanges({
*   chainId: 1,
*   collectionAddress: selectedCollection?.address,
*   query: {
*     enabled: Boolean(selectedCollection?.address),
*     staleTime: 300000, // Cache for 5 minutes
*     refetchInterval: 60000 // Refresh every minute
*   }
* })
* ```
*/
function useTokenRanges(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...getTokenRangesQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/ui/modals/_internal/components/selectWaasFeeOptions/store.ts
const selectWaasFeeOptionsStore = createStore({
	context: {
		selectedFeeOption: void 0,
		pendingFeeOptionConfirmation: void 0,
		isVisible: false
	},
	on: {
		show: (context) => ({
			...context,
			isVisible: true
		}),
		hide: () => ({
			selectedFeeOption: void 0,
			pendingFeeOptionConfirmation: void 0,
			isVisible: false
		}),
		setSelectedFeeOption: (context, event) => ({
			...context,
			selectedFeeOption: event.feeOption
		}),
		setPendingFeeOptionConfirmation: (context, event) => ({
			...context,
			pendingFeeOptionConfirmation: event.confirmation
		})
	}
});
const useSelectWaasFeeOptionsStore = () => {
	return {
		isVisible: useSelector(selectWaasFeeOptionsStore, (state) => state.context.isVisible),
		selectedFeeOption: useSelector(selectWaasFeeOptionsStore, (state) => state.context.selectedFeeOption),
		pendingFeeOptionConfirmation: useSelector(selectWaasFeeOptionsStore, (state) => state.context.pendingFeeOptionConfirmation),
		show: () => selectWaasFeeOptionsStore.send({ type: "show" }),
		hide: () => selectWaasFeeOptionsStore.send({ type: "hide" }),
		setSelectedFeeOption: (feeOption) => selectWaasFeeOptionsStore.send({
			type: "setSelectedFeeOption",
			feeOption
		}),
		setPendingFeeOptionConfirmation: (confirmation) => selectWaasFeeOptionsStore.send({
			type: "setPendingFeeOptionConfirmation",
			confirmation
		})
	};
};

//#endregion
//#region src/react/ui/modals/_internal/components/consts.ts
const MODAL_WIDTH = "360px";
const MODAL_OVERLAY_PROPS = { style: { background: "hsla(0, 0%, 15%, 0.9)" } };
const MODAL_CONTENT_PROPS = { style: {
	width: MODAL_WIDTH,
	height: "auto"
} };

//#endregion
//#region src/react/ui/modals/_internal/components/transaction-footer/index.tsx
function TransactionFooter({ transactionHash, orderId, isConfirming, isConfirmed, isFailed, isTimeout, chainId }) {
	const icon = (isConfirmed || orderId) && /* @__PURE__ */ jsx(PositiveCircle, {}) || isConfirming && /* @__PURE__ */ jsx(Spinner, { size: "md" });
	const title = (isConfirmed || orderId) && "Transaction complete" || isConfirming && "Processing transaction" || isFailed && "Transaction failed" || isTimeout && "Transaction took longer than expected";
	const transactionUrl = `${networks[chainId]?.blockExplorer?.rootUrl}tx/${transactionHash}`;
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center",
		children: [
			icon,
			/* @__PURE__ */ jsx(Text, {
				className: "ml-2 grow font-body text-sm",
				color: "text50",
				fontWeight: "medium",
				children: title
			}),
			/* @__PURE__ */ jsx("a", {
				className: "ml-2 text-right no-underline",
				href: transactionUrl,
				target: "_blank",
				rel: "noopener noreferrer",
				children: /* @__PURE__ */ jsx(Text, {
					className: "text-right font-body text-sm text-violet-400",
					fontWeight: "medium",
					children: transactionHash && truncateMiddle(transactionHash, 4, 4)
				})
			})
		]
	});
}
const PositiveCircle = () => /* @__PURE__ */ jsx("div", {
	className: "flex h-5 w-5 items-center justify-center rounded-full bg-[#35a554]",
	children: /* @__PURE__ */ jsx(CheckmarkIcon, {
		size: "xs",
		color: "white"
	})
});

//#endregion
//#region src/react/ui/modals/_internal/components/timeAgo/index.tsx
function TimeAgo({ date }) {
	const [timeAgo, setTimeAgo] = useState("");
	useEffect(() => {
		const interval = setInterval(() => {
			setTimeAgo(formatDistanceToNow(date));
		}, 1e3);
		return () => clearInterval(interval);
	}, [date]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex grow items-center justify-end",
		children: /* @__PURE__ */ jsx(Text, {
			className: "text-sm",
			color: "text50",
			children: timeAgo
		})
	});
}

//#endregion
//#region src/react/ui/modals/_internal/components/transactionStatusModal/store.ts
const initialContext$5 = {
	isOpen: false,
	hash: void 0,
	orderId: void 0,
	status: "PENDING",
	transactionType: void 0,
	price: void 0,
	collectionAddress: "",
	chainId: 0,
	collectibleId: "",
	callbacks: void 0,
	queriesToInvalidate: []
};
const transactionStatusModalStore = createStore({
	context: initialContext$5,
	on: {
		open: (context, event) => ({
			...context,
			isOpen: true,
			hash: event.hash,
			orderId: event.orderId,
			price: event.price,
			collectionAddress: event.collectionAddress,
			chainId: event.chainId,
			collectibleId: event.collectibleId,
			transactionType: event.transactionType,
			callbacks: event.callbacks,
			queriesToInvalidate: event.queriesToInvalidate,
			status: "PENDING"
		}),
		close: () => ({ ...initialContext$5 }),
		updateStatus: (context, event) => ({
			...context,
			status: event.status
		})
	}
});
const useIsOpen$4 = () => useSelector(transactionStatusModalStore, (state) => state.context.isOpen);
const useTransactionModalState = () => useSelector(transactionStatusModalStore, (state) => state.context);
const useTransactionType = () => useSelector(transactionStatusModalStore, (state) => state.context.transactionType);

//#endregion
//#region src/react/ui/modals/_internal/components/transactionPreview/consts.ts
const TRANSACTION_TITLES = {
	SELL: {
		confirming: "Selling",
		confirmed: "Sold",
		failed: "Sale failed"
	},
	LISTING: {
		confirming: "Creating listing",
		confirmed: "Listed",
		failed: "Listing failed"
	},
	OFFER: {
		confirming: "Creating offer",
		confirmed: "Offer created",
		failed: "Offer failed"
	},
	BUY: {
		confirming: "Buying",
		confirmed: "Bought",
		failed: "Purchase failed"
	},
	TRANSFER: {
		confirming: "Transferring",
		confirmed: "Transferred",
		failed: "Transfer failed"
	},
	CANCEL: {
		confirming: "Cancelling",
		confirmed: "Cancelled",
		failed: "Cancellation failed"
	}
};

//#endregion
//#region src/react/ui/modals/_internal/components/transactionPreview/useTransactionPreviewTitle.tsx
function useTransactionPreviewTitle(orderId, status, type) {
	if (!type) return "";
	const { isConfirming, isConfirmed, isFailed } = status;
	const titles = TRANSACTION_TITLES[type];
	if (isConfirmed || orderId) return titles.confirmed;
	if (isConfirming) return titles.confirming;
	if (isFailed) return titles.failed;
	return "";
}

//#endregion
//#region src/react/ui/modals/_internal/components/transactionPreview/index.tsx
const TransactionPreview = ({ orderId, price, collectionAddress, chainId, collectible, collectibleLoading, currencyImageUrl, isConfirming, isConfirmed, isFailed, isTimeout }) => {
	const transactionType = useTransactionType();
	const title = useTransactionPreviewTitle(orderId, {
		isConfirmed,
		isConfirming,
		isFailed,
		isTimeout
	}, transactionType);
	const { data: collection, isLoading: collectionLoading } = useCollectionMetadata({
		collectionAddress,
		chainId
	});
	const collectibleImage = collectible?.image;
	const collectibleName = collectible?.name;
	const collectionName = collection?.name;
	const priceFormatted = price ? formatUnits(BigInt(price?.amountRaw), price?.currency.decimals) : void 0;
	if (collectibleLoading || collectionLoading) return /* @__PURE__ */ jsx("div", {
		className: "w-full rounded-xl",
		style: { height: 83 },
		children: /* @__PURE__ */ jsx(Skeleton, { style: {
			width: "100%",
			height: "100%"
		} })
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl bg-background-secondary p-3",
		"data-testid": "transaction-preview",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center",
			children: [
				/* @__PURE__ */ jsx(Text, {
					className: "mr-1 font-body text-xs",
					color: "text80",
					fontWeight: "medium",
					"data-testid": "transaction-preview-title",
					children: title
				}),
				/* @__PURE__ */ jsx(NetworkImage, {
					chainId: Number(chainId),
					size: "xs"
				}),
				isConfirming && /* @__PURE__ */ jsx(TimeAgo, { date: /* @__PURE__ */ new Date() })
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "mt-2 flex items-center",
			children: [
				/* @__PURE__ */ jsx(Image, {
					className: "mr-3 h-9 w-9 rounded-sm",
					src: collectibleImage || chess_tile_default,
					alt: collectibleName,
					style: { objectFit: "cover" },
					"data-testid": "transaction-preview-image"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-start gap-0.5",
					children: [/* @__PURE__ */ jsx(Text, {
						className: "font-body text-xs",
						color: "text80",
						fontWeight: "medium",
						"data-testid": "transaction-preview-collection-name",
						children: collectionName
					}), /* @__PURE__ */ jsx(Text, {
						className: "font-body text-xs",
						color: "text100",
						fontWeight: "bold",
						"data-testid": "transaction-preview-collectible-name",
						children: collectibleName
					})]
				}),
				price && /* @__PURE__ */ jsxs("div", {
					className: "flex grow items-center justify-end gap-1",
					"data-testid": "transaction-preview-price",
					children: [/* @__PURE__ */ jsx(Image, {
						className: "h-3 w-3",
						src: currencyImageUrl
					}), /* @__PURE__ */ jsxs(Text, {
						className: "font-body text-xs",
						color: "text100",
						fontWeight: "bold",
						children: [
							priceFormatted,
							" ",
							price?.currency.symbol
						]
					})]
				})
			]
		})]
	});
};
var transactionPreview_default = TransactionPreview;

//#endregion
//#region src/react/hooks/config/useConnectorMetadata.tsx
const useConnectorMetadata = () => {
	const { connector } = useAccount();
	const isWaaS = connector?.id.endsWith("waas") ?? false;
	const isSequence = connector?.id.includes("sequence");
	return {
		isWaaS,
		isSequence,
		walletKind: isSequence ? WalletKind.sequence : WalletKind.unknown
	};
};

//#endregion
//#region src/react/ui/modals/_internal/components/transactionStatusModal/hooks/useTransactionStatus.ts
const useTransactionStatus = (hash, chainId, callbacks) => {
	const sdkConfig = useConfig();
	const [status, setStatus] = useState(hash ? "PENDING" : "SUCCESS");
	const { data: confirmationResult, error } = useQuery({
		queryKey: [
			"transaction-confirmation",
			hash,
			chainId
		],
		queryFn: hash ? async () => await waitForTransactionReceipt({
			txHash: hash,
			chainId,
			sdkConfig
		}) : skipToken
	});
	useEffect(() => {
		if (!hash) {
			setStatus("SUCCESS");
			return;
		}
		if (error) {
			setStatus(error instanceof WaitForTransactionReceiptTimeoutError ? "TIMEOUT" : "FAILED");
			callbacks?.onError?.(error);
			return;
		}
		if (!confirmationResult) {
			setStatus("PENDING");
			return;
		}
		if (confirmationResult.txnStatus === TransactionStatus.SUCCESSFUL) {
			setStatus("SUCCESS");
			callbacks?.onSuccess?.({ hash: hash || "0x0" });
			return;
		}
		setStatus("FAILED");
		callbacks?.onError?.(/* @__PURE__ */ new Error("Transaction failed"));
	}, [
		confirmationResult,
		error,
		hash
	]);
	return status;
};
var useTransactionStatus_default = useTransactionStatus;

//#endregion
//#region src/react/ui/modals/_internal/components/transactionStatusModal/util/getFormattedType.ts
function getFormattedType(transactionType, verb = false) {
	switch (transactionType) {
		case TransactionType.TRANSFER: return verb ? "transferred" : "transfer";
		case TransactionType.LISTING: return verb ? "listed" : "listing";
		case TransactionType.BUY: return verb ? "purchased" : "purchase";
		case TransactionType.SELL: return verb ? "sold" : "sale";
		case TransactionType.CANCEL: return verb ? "cancelled" : "cancellation";
		case TransactionType.OFFER: return verb ? "offered" : "offer";
		default: return "transaction";
	}
}

//#endregion
//#region src/react/ui/modals/_internal/components/transactionStatusModal/util/getMessage.ts
function getTransactionStatusModalMessage({ transactionStatus, transactionType, collectibleName, orderId, price }) {
	const hideCollectibleName = transactionType === "CANCEL";
	const formattedPrice = price ? formatUnits(BigInt(price.amountRaw), price.currency.decimals) : "";
	if (orderId) return `You just ${getFormattedType(transactionType, true)}${!hideCollectibleName ? ` ${collectibleName}` : ""}. It's been confirmed on the blockchain!`;
	if (transactionType === TransactionType.OFFER) return `You just offered ${formattedPrice} ${price?.currency.symbol} for ${collectibleName}. It's been confirmed on the blockchain!`;
	switch (transactionStatus) {
		case "PENDING": return `You just ${getFormattedType(transactionType, true)}${!hideCollectibleName ? ` ${collectibleName}` : ""}. It should be confirmed on the blockchain shortly.`;
		case "SUCCESS": return `You just ${getFormattedType(transactionType, true)}${!hideCollectibleName ? ` ${collectibleName}` : ""}. It's been confirmed on the blockchain!`;
		case "FAILED": return `Your ${getFormattedType(transactionType)} has failed.`;
		case "TIMEOUT": return `Your ${getFormattedType(transactionType)} takes too long. Click the link below to track it on the explorer.`;
		default: return "Your transaction is processing";
	}
}

//#endregion
//#region src/react/ui/modals/_internal/components/transactionStatusModal/util/getTitle.ts
function getTransactionStatusModalTitle({ transactionStatus, transactionType, orderId }) {
	if (transactionType === void 0) return "";
	if (orderId) return `Your ${getFormattedType(transactionType)} has processed`;
	switch (transactionStatus) {
		case "PENDING": return `Your ${getFormattedType(transactionType)} is processing`;
		case "SUCCESS": return `Your ${getFormattedType(transactionType)} has processed`;
		case "FAILED": return `Your ${getFormattedType(transactionType)} has failed`;
		case "TIMEOUT": return `Your ${getFormattedType(transactionType)} takes too long`;
		default: return "Your transaction is processing";
	}
}

//#endregion
//#region src/react/ui/modals/_internal/components/transactionStatusModal/index.tsx
const invalidateQueries = async (queriesToInvalidate) => {
	const queryClient = getQueryClient();
	if (!queriesToInvalidate) {
		queryClient.invalidateQueries({ predicate: (query) => !query.meta?.persistent });
		return;
	}
	for (const queryKey of queriesToInvalidate) await queryClient.invalidateQueries({ queryKey });
};
const useTransactionStatusModal = () => {
	return {
		show: (args) => {
			const { type: transactionType,...rest } = args;
			transactionStatusModalStore.send({
				type: "open",
				transactionType,
				...rest
			});
		},
		close: () => {
			transactionStatusModalStore.send({ type: "close" });
		}
	};
};
const TransactionStatusModal = () => {
	return useIsOpen$4() ? /* @__PURE__ */ jsx(TransactionStatusModalContent, {}) : null;
};
function TransactionStatusModalContent() {
	const { transactionType: type, hash, orderId, price, collectionAddress, chainId, collectibleId, callbacks, queriesToInvalidate } = useTransactionModalState();
	const { data: collectible, isLoading: collectibleLoading } = useCollectibleMetadata({
		collectionAddress,
		chainId,
		collectibleId
	});
	const transactionStatus = useTransactionStatus_default(hash, chainId, callbacks);
	const title = getTransactionStatusModalTitle({
		transactionStatus,
		transactionType: type,
		orderId
	});
	const message = type ? getTransactionStatusModalMessage({
		transactionStatus,
		transactionType: type,
		collectibleName: collectible?.name || "",
		orderId,
		price
	}) : "";
	const handleClose = () => {
		invalidateQueries(queriesToInvalidate);
		if (selectWaasFeeOptionsStore.getSnapshot().context.isVisible) selectWaasFeeOptionsStore.send({ type: "hide" });
		transactionStatusModalStore.send({ type: "close" });
	};
	return /* @__PURE__ */ jsx(Modal, {
		isDismissible: true,
		onClose: handleClose,
		size: "sm",
		overlayProps: MODAL_OVERLAY_PROPS,
		"data-testid": "transaction-status-modal",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid flex-col gap-6 p-7",
			children: [
				title ? /* @__PURE__ */ jsx(Text, {
					className: "font-body text-xl",
					fontWeight: "bold",
					color: "text100",
					"data-testid": "transaction-status-title",
					children: title
				}) : /* @__PURE__ */ jsx(Skeleton, {
					className: "h-6 w-16",
					"data-testid": "transaction-modal-title-skeleton"
				}),
				message ? /* @__PURE__ */ jsx(Text, {
					className: "font-body text-sm",
					color: "text80",
					"data-testid": "transaction-status-message",
					children: message
				}) : /* @__PURE__ */ jsx(Skeleton, {
					className: "h-4 w-20",
					"data-testid": "transaction-modal-content-skeleton"
				}),
				/* @__PURE__ */ jsx(transactionPreview_default, {
					orderId,
					price,
					collectionAddress,
					chainId,
					collectible,
					collectibleLoading,
					currencyImageUrl: price?.currency.imageUrl,
					isConfirming: transactionStatus === "PENDING",
					isConfirmed: transactionStatus === "SUCCESS",
					isFailed: transactionStatus === "FAILED",
					isTimeout: transactionStatus === "TIMEOUT"
				}),
				/* @__PURE__ */ jsx(TransactionFooter, {
					transactionHash: hash,
					orderId,
					isConfirming: transactionStatus === "PENDING",
					isConfirmed: transactionStatus === "SUCCESS",
					isFailed: transactionStatus === "FAILED",
					isTimeout: transactionStatus === "TIMEOUT",
					chainId
				})
			]
		})
	});
}
var transactionStatusModal_default = TransactionStatusModal;

//#endregion
//#region src/react/ui/modals/SellModal/internal/store.ts
const initialContext$4 = {
	isOpen: false,
	collectionAddress: "",
	chainId: 0,
	tokenId: "",
	order: null,
	callbacks: void 0
};
const sellModalStore = createStore({
	context: { ...initialContext$4 },
	on: {
		open: (context, event) => ({
			...context,
			isOpen: true,
			...event
		}),
		close: () => ({ ...initialContext$4 })
	}
});
const useSellModal = () => {
	return {
		...useSelector(sellModalStore, (state) => state.context),
		show: (args) => sellModalStore.send({
			type: "open",
			...args
		}),
		close: () => sellModalStore.send({ type: "close" })
	};
};
const useSellModalState = () => {
	const { isOpen, tokenId, collectionAddress, chainId, order, callbacks } = useSelector(sellModalStore, (state) => state.context);
	const closeModal = () => sellModalStore.send({ type: "close" });
	return {
		isOpen,
		tokenId,
		collectionAddress,
		chainId,
		order,
		callbacks,
		closeModal,
		currencyAddress: order?.priceCurrencyAddress
	};
};

//#endregion
//#region src/react/ui/modals/SellModal/internal/sell-mutations.ts
const useSellMutations = (tx) => {
	const sdkConfig = useConfig();
	const { show: showTxModal } = useTransactionStatusModal();
	const analytics = useAnalytics();
	const state = useSellModalState();
	const { processStep } = useProcessStep();
	const { address } = useAccount();
	const { data: currency } = useCurrency({
		chainId: state.chainId,
		currencyAddress: state.currencyAddress
	});
	async function executeStepAndWait(step) {
		const res = await processStep(step, state.chainId);
		if (res.type === "transaction" && res.hash) await waitForTransactionReceipt({
			txHash: res.hash,
			chainId: state.chainId,
			sdkConfig
		});
		return res;
	}
	return {
		approve: useMutation({
			mutationFn: async () => {
				if (!tx?.approveStep) throw new Error("No approval step available");
				return await executeStepAndWait(tx.approveStep);
			},
			onError: (e) => state.callbacks?.onError?.(e)
		}),
		sell: useMutation({
			mutationFn: async () => {
				if (!tx?.sellStep) throw new Error("No sell step available");
				const res = await executeStepAndWait(tx.sellStep);
				if (currency && state.order?.priceAmount) {
					const dec = currency.decimals ?? 0;
					const raw = state.order.priceAmount;
					const currencyValueDecimal = Number(formatUnits(BigInt(raw), dec));
					analytics.trackSellItems({
						props: {
							marketplaceKind: state.order.marketplace,
							userId: address || "",
							collectionAddress: state.collectionAddress,
							currencyAddress: currency.contractAddress,
							currencySymbol: currency.symbol || "",
							requestId: state.order.orderId,
							tokenId: state.tokenId,
							chainId: String(state.chainId),
							txnHash: res.type === "transaction" ? res.hash : ""
						},
						nums: {
							currencyValueDecimal,
							currencyValueRaw: Number(raw)
						}
					});
				}
				return res;
			},
			onSuccess: (res) => {
				state.closeModal();
				showTxModal({
					type: TransactionType.SELL,
					chainId: state.chainId,
					hash: res?.type === "transaction" ? res.hash : void 0,
					orderId: res?.type === "signature" ? res.orderId : void 0,
					callbacks: state.callbacks,
					queriesToInvalidate: [["balances"]],
					collectionAddress: state.collectionAddress,
					collectibleId: state.tokenId
				});
				state.callbacks?.onSuccess?.({
					hash: res?.type === "transaction" ? res.hash : void 0,
					orderId: res?.type === "signature" ? res.orderId : void 0
				});
			},
			onError: (e) => state.callbacks?.onError?.(e)
		})
	};
};

//#endregion
//#region src/react/ui/modals/BuyModal/hooks/useMarketPlatformFee.ts
const useMarketPlatformFee = (params) => {
	const defaultFee = 2.5;
	const defaultPlatformFeeRecipient = "0x858dB1cbF6D09D447C96A11603189b49B2D1C219";
	const avalancheAndOptimismPlatformFeeRecipient = "0x400cdab4676c17aec07e8ec748a5fc3b674bca41";
	const { data: marketplaceConfig } = useMarketplaceConfig();
	if (params === skipToken) return {
		amount: "0",
		receiver: defaultPlatformFeeRecipient
	};
	const { chainId, collectionAddress } = params;
	const marketCollection = marketplaceConfig?.market?.collections?.find((col) => compareAddress(col.itemsAddress, collectionAddress) && String(col.chainId) === String(chainId));
	const receiver = chainId === avalanche.id || chainId === optimism.id ? avalancheAndOptimismPlatformFeeRecipient : defaultPlatformFeeRecipient;
	const percentageToBPS = (percentage) => Number(percentage) * 1e4 / 100;
	return {
		amount: percentageToBPS(marketCollection?.feePercentage ?? defaultFee).toString(),
		receiver
	};
};

//#endregion
//#region src/react/ui/modals/SellModal/internal/use-generate-sell-transaction.ts
const generateSellTransaction$1 = async (args, config) => {
	const marketplaceClient = getMarketplaceClient(config);
	const argsWithStringChainId = {
		...args,
		chainId: String(args.chainId)
	};
	const steps$2 = await marketplaceClient.generateSellTransaction(argsWithStringChainId).then((data) => data.steps);
	if (steps$2.length === 0) throw new Error("No steps generated");
	return {
		sellStep: steps$2.find((step) => step.id === StepType.sell),
		approveStep: steps$2.find((step) => step.id === StepType.tokenApproval)
	};
};
const useGenerateSellTransaction$1 = (params) => {
	const config = useConfig();
	const { chainId, collectionAddress, seller, marketplace, ordersData } = params;
	const enabled = !!chainId && !!collectionAddress && !!seller && !!marketplace && !!ordersData;
	const additionalFees = params.additionalFees ? params.additionalFees : [];
	const platformFee = useMarketPlatformFee(enabled ? {
		chainId,
		collectionAddress
	} : skipToken);
	return useQuery({
		queryKey: ["generateSellTransaction", params],
		queryFn: enabled ? () => generateSellTransaction$1({
			...params,
			chainId,
			marketplace,
			seller,
			collectionAddress,
			ordersData,
			additionalFees: [platformFee, ...additionalFees]
		}, config) : skipToken
	});
};

//#endregion
//#region src/react/ui/modals/SellModal/internal/context.ts
function useSellModalContext() {
	const state = useSellModalState();
	const { address } = useAccount();
	const collectionQuery = useCollectionMetadata({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		query: { enabled: !!state.isOpen }
	});
	const currencyQuery = useCurrency({
		chainId: state.chainId,
		currencyAddress: state.currencyAddress,
		query: { enabled: !!state.isOpen }
	});
	const { walletKind, isWaaS } = useConnectorMetadata();
	const sellSteps = useGenerateSellTransaction$1({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		seller: address,
		marketplace: state.order?.marketplace,
		walletType: walletKind,
		ordersData: state.order ? [{
			orderId: state.order.orderId,
			quantity: state.order.quantityRemaining,
			tokenId: state.tokenId
		}] : void 0
	});
	const { approve, sell } = useSellMutations(sellSteps.data);
	const waas = useSelectWaasFeeOptionsStore();
	const [pendingFee] = useWaasFeeOptions();
	const isSponsored = (pendingFee?.options?.length ?? -1) === 0;
	const steps$2 = [];
	if (isWaaS) {
		const feeSelected = isSponsored || !!waas.selectedFeeOption;
		steps$2.push({
			id: "waasFee",
			label: "Select Fee",
			status: feeSelected ? "success" : "idle",
			isPending: false,
			isSuccess: feeSelected,
			isError: false,
			run: () => selectWaasFeeOptionsStore.send({ type: "show" })
		});
	}
	if (sellSteps.data?.approveStep && !approve.isSuccess) steps$2.push({
		id: "approve",
		label: "Approve Token",
		status: approve.status,
		isPending: approve.isPending,
		isSuccess: approve.isSuccess,
		isError: !!approve.error,
		run: () => approve.mutate()
	});
	steps$2.push({
		id: "sell",
		label: "Accept Offer",
		status: sell.status,
		isPending: sell.isPending,
		isSuccess: sell.isSuccess,
		isError: !!sell.error,
		run: () => sell.mutate()
	});
	const nextStep = steps$2.find((step) => step.status === "idle");
	const isPending = approve.isPending || sell.isPending || sellSteps.isLoading;
	const hasError = !!(approve.error || sell.error || sellSteps.error || collectionQuery.error || currencyQuery.error);
	const totalSteps = steps$2.length;
	const completedSteps = steps$2.filter((s) => s.isSuccess).length;
	const progress = totalSteps > 0 ? completedSteps / totalSteps * 100 : 0;
	const flowStatus = isPending ? "pending" : hasError ? "error" : completedSteps === totalSteps ? "success" : "idle";
	const feeSelection = waas.isVisible ? {
		isSponsored,
		isSelecting: waas.isVisible,
		selectedOption: waas.selectedFeeOption,
		balance: waas.selectedFeeOption && "balanceFormatted" in waas.selectedFeeOption ? { formattedValue: waas.selectedFeeOption.balanceFormatted } : void 0,
		cancel: () => selectWaasFeeOptionsStore.send({ type: "hide" })
	} : void 0;
	const error = approve.error || sell.error || sellSteps.error || collectionQuery.error || currencyQuery.error;
	return {
		isOpen: state.isOpen,
		close: state.closeModal,
		tokenId: state.tokenId,
		collectionAddress: state.collectionAddress,
		chainId: state.chainId,
		collection: collectionQuery.data,
		offer: {
			order: state.order,
			currency: currencyQuery.data,
			priceAmount: state.order?.priceAmount
		},
		flow: {
			steps: steps$2,
			nextStep,
			status: flowStatus,
			isPending,
			totalSteps,
			completedSteps,
			progress
		},
		loading: {
			collection: collectionQuery.isLoading,
			currency: currencyQuery.isLoading,
			steps: sellSteps.isLoading
		},
		transactions: {
			approve: approve.data?.type === "transaction" ? approve.data.hash : void 0,
			sell: sell.data?.type === "transaction" ? sell.data.hash : void 0
		},
		feeSelection,
		error,
		queries: {
			collection: collectionQuery,
			currency: currencyQuery
		}
	};
}

//#endregion
//#region src/react/ui/modals/_internal/components/baseModal/BaseModal.tsx
/**
* BaseModal - Simplified modal foundation without complex state management
*
* This component provides the basic modal structure without:
* - isOpen prop (controlled by parent component conditional rendering)
* - CTA system (handled by ActionModal or custom implementations)
* - Error handling (can be composed separately)
*
* Use this when you need a simple modal shell with full control over content.
*/
const BaseModal = ({ onClose, title, children, disableAnimation }) => {
	return /* @__PURE__ */ jsx(Modal, {
		isDismissible: true,
		onClose,
		overlayProps: MODAL_OVERLAY_PROPS,
		contentProps: MODAL_CONTENT_PROPS,
		disableAnimation,
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative flex grow flex-col items-center gap-4 p-6",
			children: [/* @__PURE__ */ jsx(Text, {
				className: "w-full text-center font-body font-bold text-large text-text-100",
				children: title
			}), children]
		})
	});
};

//#endregion
//#region src/react/ui/modals/_internal/components/baseModal/errors/ModalInitializationError.tsx
const ModalInitializationError = ({ onTryAgain, onClose, error }) => {
	const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-[400px] flex-col items-center justify-center p-4 text-white",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500",
				children: /* @__PURE__ */ jsx(WarningIcon, { className: "h-8 w-8 text-white" })
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mb-4 text-center font-semibold text-xl",
				children: "Failed to Load"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mb-8 max-w-md text-center text-gray-300 text-sm leading-relaxed",
				children: "Something went wrong while loading this item. Please try again later or refresh the page."
			}),
			error.stack && /* @__PURE__ */ jsxs("button", {
				onClick: () => setShowTechnicalDetails(!showTechnicalDetails),
				className: "mb-4 flex items-center text-gray-400 text-sm transition-colors hover:text-gray-300",
				children: [/* @__PURE__ */ jsx("svg", {
					className: `mr-2 h-4 w-4 transition-transform ${showTechnicalDetails ? "rotate-180" : ""}`,
					fill: "none",
					stroke: "currentColor",
					viewBox: "0 0 24 24",
					children: /* @__PURE__ */ jsx("path", {
						strokeLinecap: "round",
						strokeLinejoin: "round",
						strokeWidth: 2,
						d: "M19 9l-7 7-7-7"
					})
				}), "Show technical details"]
			}),
			showTechnicalDetails && error.stack && /* @__PURE__ */ jsx("div", {
				className: "mb-8 max-h-64 w-full max-w-md overflow-y-auto rounded-lg border border-red-900 bg-[#2b0000] p-4",
				children: /* @__PURE__ */ jsx("pre", {
					className: "whitespace-pre-wrap break-words text-red-100 text-xs",
					children: error.stack
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex w-full max-w-xs flex-col space-y-3",
				children: [onTryAgain && /* @__PURE__ */ jsx(Button, {
					onClick: onTryAgain,
					variant: "primary",
					size: "md",
					className: "flex justify-center",
					shape: "square",
					children: "Try Again"
				}), onClose && /* @__PURE__ */ jsx(Button, {
					onClick: onClose,
					variant: "secondary",
					size: "md",
					className: "flex justify-center",
					shape: "square",
					children: "Close"
				})]
			})
		]
	});
};

//#endregion
//#region src/utils/errors.ts
/**
* SDK-specific error classes with name-based discrimination
* Following wagmi/viem pattern for error handling
*/
var SequenceMarketplaceError = class SequenceMarketplaceError extends Error {
	constructor(message) {
		super(message);
		this.name = "SequenceMarketplaceError";
		Object.setPrototypeOf(this, SequenceMarketplaceError.prototype);
	}
};
const isMarketplaceError = (error) => {
	return error instanceof SequenceMarketplaceError;
};

//#endregion
//#region src/utils/getWagmiErrorMessage.ts
const WAGMI_ERROR = {
	USER_REJECTED_REQUEST: UserRejectedRequestError.name,
	HTTP_REQUEST: HttpRequestError.name,
	LIMIT_EXCEEDED_RPC: LimitExceededRpcError.name,
	TIMEOUT: TimeoutError.name,
	INSUFFICIENT_FUNDS: InsufficientFundsError.name,
	TRANSACTION_EXECUTION: TransactionExecutionError.name,
	CONTRACT_FUNCTION_EXECUTION: ContractFunctionExecutionError.name,
	TRANSACTION_RECEIPT_NOT_FOUND: TransactionReceiptNotFoundError.name,
	CHAIN_MISMATCH: ChainMismatchError.name,
	CONNECTOR_CHAIN_MISMATCH: ConnectorChainMismatchError.name,
	CHAIN_NOT_FOUND: ChainNotFoundError.name,
	SWITCH_CHAIN_ERROR: SwitchChainError.name,
	FEE_CAP_TOO_LOW: FeeCapTooLowError.name,
	FEE_CAP_TOO_HIGH: FeeCapTooHighError.name,
	INTRINSIC_GAS_TOO_HIGH: IntrinsicGasTooHighError.name,
	CHAIN_NOT_CONFIGURED: ChainNotConfiguredError.name,
	SWITCH_CHAIN_NOT_SUPPORTED: SwitchChainNotSupportedError.name,
	CONNECTOR_ACCOUNT_NOT_FOUND: ConnectorAccountNotFoundError.name,
	CONNECTOR_ALREADY_CONNECTED: ConnectorAlreadyConnectedError.name,
	PROVIDER_NOT_FOUND: ProviderNotFoundError.name,
	CONNECTOR_UNAVAILABLE_RECONNECTING: ConnectorUnavailableReconnectingError.name,
	INTRINSIC_GAS_TOO_LOW: IntrinsicGasTooLowError.name,
	CONTRACT_FUNCTION_REVERTED: ContractFunctionRevertedError.name,
	CONTRACT_FUNCTION_ZERO_DATA: ContractFunctionZeroDataError.name,
	INVALID_ADDRESS: InvalidAddressError.name,
	INVALID_HEX_VALUE: InvalidHexValueError.name,
	WAGMI_PROVIDER_NOT_FOUND: WagmiProviderNotFoundError.name,
	CONNECTOR_NOT_FOUND: ConnectorNotFoundError.name,
	NONCE_TOO_LOW: NonceTooLowError.name
};
const wagmiErrorClasses = [
	UserRejectedRequestError,
	HttpRequestError,
	LimitExceededRpcError,
	TimeoutError,
	InsufficientFundsError,
	TransactionExecutionError,
	ContractFunctionExecutionError,
	TransactionReceiptNotFoundError,
	ChainMismatchError,
	ConnectorChainMismatchError,
	ChainNotFoundError,
	SwitchChainError,
	FeeCapTooLowError,
	FeeCapTooHighError,
	IntrinsicGasTooHighError,
	ChainNotConfiguredError,
	SwitchChainNotSupportedError,
	ConnectorAccountNotFoundError,
	ConnectorAlreadyConnectedError,
	ProviderNotFoundError,
	ConnectorUnavailableReconnectingError,
	IntrinsicGasTooLowError,
	ContractFunctionRevertedError,
	ContractFunctionZeroDataError,
	InvalidAddressError,
	InvalidHexValueError,
	WagmiProviderNotFoundError,
	ConnectorNotFoundError,
	NonceTooLowError
];
const isWagmiError = (error) => {
	return wagmiErrorClasses.some((ErrorClass) => error instanceof ErrorClass);
};
const getWagmiErrorMessage = (error) => {
	switch (error.name) {
		case WAGMI_ERROR.USER_REJECTED_REQUEST: return "Transaction was cancelled. You can try again when ready.";
		case WAGMI_ERROR.HTTP_REQUEST: {
			const httpError = error;
			if (httpError.status === 429) return "Rate limit exceeded. Please wait a moment before trying again.";
			if (httpError.status >= 500) return "Server error. Please try again in a few moments.";
			return "Network connection issue. Please check your connection and try again.";
		}
		case WAGMI_ERROR.LIMIT_EXCEEDED_RPC: return "Rate limit exceeded. Please wait before trying again.";
		case WAGMI_ERROR.TIMEOUT: return "Request timed out. Please try again.";
		case WAGMI_ERROR.INSUFFICIENT_FUNDS: return "Insufficient balance to complete this transaction.";
		case WAGMI_ERROR.TRANSACTION_EXECUTION: return "Transaction execution failed. This usually means the transaction would fail on-chain. Please check your transaction parameters.";
		case WAGMI_ERROR.CONTRACT_FUNCTION_EXECUTION: return "Smart contract function failed. Please verify the contract parameters and try again.";
		case WAGMI_ERROR.TRANSACTION_RECEIPT_NOT_FOUND: return "Transaction not found. It may still be processing or may have failed.";
		case WAGMI_ERROR.CHAIN_MISMATCH:
		case WAGMI_ERROR.CONNECTOR_CHAIN_MISMATCH: return "Wrong network selected. Please switch to the correct network.";
		case WAGMI_ERROR.CHAIN_NOT_FOUND: return "Network not found. Please check your network configuration.";
		case WAGMI_ERROR.CHAIN_NOT_CONFIGURED: return "This network is not supported. Please switch to a supported network.";
		case WAGMI_ERROR.SWITCH_CHAIN_ERROR: return "Failed to switch networks. Please try switching manually in your wallet.";
		case WAGMI_ERROR.SWITCH_CHAIN_NOT_SUPPORTED: return "Network switching is not supported by your wallet. Please manually switch networks.";
		case WAGMI_ERROR.CONNECTOR_ACCOUNT_NOT_FOUND: return "No wallet account found. Please make sure your wallet is properly connected.";
		case WAGMI_ERROR.CONNECTOR_ALREADY_CONNECTED: return "Wallet is already connected. Please refresh the page if you're having issues.";
		case WAGMI_ERROR.CONNECTOR_NOT_FOUND:
		case WAGMI_ERROR.PROVIDER_NOT_FOUND: return "Wallet not found or unavailable. Please make sure your wallet is installed and unlocked.";
		case WAGMI_ERROR.CONNECTOR_UNAVAILABLE_RECONNECTING: return "Wallet is reconnecting. Please wait a moment and try again.";
		case WAGMI_ERROR.FEE_CAP_TOO_LOW: return "Gas fee too low. Please increase the gas fee and try again.";
		case WAGMI_ERROR.FEE_CAP_TOO_HIGH: return "Gas fee too high. Please reduce the gas fee and try again.";
		case WAGMI_ERROR.INTRINSIC_GAS_TOO_LOW: return "Gas limit too low. Please increase the gas limit and try again.";
		case WAGMI_ERROR.INTRINSIC_GAS_TOO_HIGH: return "Gas limit too high. Please reduce the gas limit and try again.";
		case WAGMI_ERROR.NONCE_TOO_LOW: return "Transaction nonce too low. Please try again.";
		case WAGMI_ERROR.CONTRACT_FUNCTION_REVERTED: return "Transaction was reverted by the smart contract. Please check your transaction parameters.";
		case WAGMI_ERROR.CONTRACT_FUNCTION_ZERO_DATA: return "Invalid contract function call. Please verify the function parameters.";
		case WAGMI_ERROR.INVALID_ADDRESS: return "Invalid wallet address format. Please check the address and try again.";
		case WAGMI_ERROR.INVALID_HEX_VALUE: return "Invalid data format. Please check your input and try again.";
		case WAGMI_ERROR.WAGMI_PROVIDER_NOT_FOUND: return "Wallet connection error. Please refresh the page and try again.";
		default: {
			const message = error.message?.toLowerCase() || "";
			if (message.includes("insufficient funds") || message.includes("insufficient balance")) return "Insufficient balance to complete this transaction.";
			if (message.includes("user rejected") || message.includes("user denied")) return "Transaction was cancelled. You can try again when ready.";
			if (message.includes("network") || message.includes("connection")) return "Network connection issue. Please check your connection and try again.";
			if (message.includes("gas") || message.includes("fee")) return "Gas estimation failed. Please try adjusting the gas settings.";
			return error.message || "Transaction error occurred. Please try again.";
		}
	}
};

//#endregion
//#region src/utils/getWebRPCErrorMessage.ts
const getWebRPCErrorMessage = (error) => {
	switch (error.code) {
		case -1: return "Connection failed. Please check your internet and try again.";
		case -2: return "Invalid request. Please try again.";
		case -3: return "Unsupported operation. Please contact support.";
		case -4: return "Invalid request format. Please try again.";
		case -5: return "Server response error. Please try again.";
		case -6: return "Server error. Please try again in a moment.";
		case -7: return "Server internal error. Please try again.";
		case -8: return "Connection lost. Please refresh and try again.";
		case -9: return "Connection interrupted. Please try again.";
		case -10: return "Operation completed. Please refresh if needed.";
		case 1e3: return "Please sign in to continue.";
		case 1001: return "You do not have permission for this action.";
		case 1002: return "Session expired. Please sign in again.";
		case 1003: return "Operation not available. Please contact support.";
		case 2e3: return "Request timed out. Please try again.";
		case 2001: return "Invalid input. Please check your information.";
		case 3e3: return "Item not found or no longer available.";
		case 3001: return "User not found. Please check the account.";
		case 3002: return "Project not found. Please verify the project.";
		case 3003: return "Invalid tier. Please contact support.";
		case 3005: return "Project limit reached. Please upgrade your account.";
		case 9999: return "Feature not yet available. Please try again later.";
		default: return "Something went wrong. Please try again.";
	}
};

//#endregion
//#region src/utils/getErrorMessage.ts
const getErrorMessage = (error) => {
	if (isMarketplaceError(error)) return error.message;
	if ("code" in error && typeof error.code === "number") return getWebRPCErrorMessage(error);
	if (isWagmiError(error)) return getWagmiErrorMessage(error);
	return error?.message || "An unexpected error occurred. Please try again.";
};

//#endregion
//#region src/react/ui/components/_internals/ErrorDisplay.tsx
const ErrorDisplay = ({ title, message, error, onHide }) => {
	const [showFullError, setShowFullError] = useState(false);
	const toggleFullError = () => {
		setShowFullError(!showFullError);
	};
	const hideErrorDisplay = () => {
		onHide?.();
	};
	return /* @__PURE__ */ jsx("div", {
		className: "relative max-h-64 w-full overflow-y-auto rounded-lg border border-red-900 bg-[#2b0000] p-3",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-start gap-3",
			children: [
				/* @__PURE__ */ jsx(WarningIcon, {
					className: "absolute mt-0.5 flex-shrink-0 text-red-500",
					size: "sm"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative ml-10 flex flex-col",
						children: [/* @__PURE__ */ jsx(Text, {
							className: "font-bold text-red-400 text-sm",
							children: title
						}), /* @__PURE__ */ jsx(Text, {
							className: "mt-1 text-red-300 text-xs",
							children: message
						})]
					}), error && /* @__PURE__ */ jsxs("div", {
						className: "mt-2",
						children: [
							/* @__PURE__ */ jsxs("button", {
								onClick: toggleFullError,
								className: "flex cursor-pointer items-center gap-1 text-red-400 text-xs transition-colors hover:text-red-300",
								type: "button",
								children: [showFullError ? "Hide full error" : "Show full error", showFullError ? /* @__PURE__ */ jsx(ChevronUpIcon, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(ChevronDownIcon, { className: "h-3 w-3" })]
							}),
							showFullError && /* @__PURE__ */ jsx("div", { className: "mt-2 h-px bg-red-900" }),
							showFullError && /* @__PURE__ */ jsx("div", {
								className: "mt-2 overflow-auto rounded-md bg-red-950 p-2",
								children: /* @__PURE__ */ jsx(Text, {
									className: "whitespace-pre-wrap break-words font-mono text-red-100 text-xs",
									children: JSON.stringify(error, null, 2)
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ jsx("button", {
					onClick: hideErrorDisplay,
					className: "absolute right-4 flex-shrink-0 cursor-pointer text-red-400 transition-colors hover:text-red-300",
					type: "button",
					"aria-label": "Dismiss error",
					children: /* @__PURE__ */ jsx(CloseIcon, { className: "h-3 w-3" })
				})
			]
		})
	});
};

//#endregion
//#region src/react/ui/modals/_internal/components/baseModal/SmartErrorHandler.tsx
const SmartErrorHandler = ({ error, onHide, customComponent }) => {
	if (customComponent) return /* @__PURE__ */ jsx(Fragment, { children: customComponent(error) });
	return /* @__PURE__ */ jsx(ErrorDisplay, {
		title: error.name || "Transaction Error",
		message: getErrorMessage(error),
		error,
		onHide
	});
};

//#endregion
//#region src/react/ui/modals/_internal/components/baseModal/ActionModal.tsx
function MultiQueryWrapper({ queries, children, type }) {
	const isLoading = Object.values(queries).some((q) => q.isLoading);
	const errors = Object.values(queries).filter((q) => q.isError).map((q) => q.error);
	const firstError = errors[0];
	const hasErrors = errors.length > 0;
	const hasAllData = Object.values(queries).every((q) => q.data !== void 0);
	const failedQueries = Object.entries(queries).filter(([, query]) => query.isError).map(([key, query]) => ({
		key,
		query
	}));
	const refetchFailedQueries = async () => {
		const refetchPromises = failedQueries.map(({ query }) => query.refetch());
		await Promise.all(refetchPromises);
	};
	if (isLoading && !hasErrors) {
		const loadingText = type === "listing" ? "Preparing listing data..." : type === "offer" ? "Preparing offer data..." : type === "sell" ? "Preparing sell data..." : "Preparing purchase data...";
		return /* @__PURE__ */ jsxs("div", {
			className: "flex h-64 w-full flex-col items-center justify-center gap-8",
			"data-testid": "error-loading-wrapper",
			children: [/* @__PURE__ */ jsx("div", {
				"data-testid": "spinner",
				style: { scale: 1.5 },
				children: /* @__PURE__ */ jsx(Spinner, { size: "lg" })
			}), /* @__PURE__ */ jsx(Text, {
				fontWeight: "medium",
				className: "animate-pulse text-sm",
				color: "white",
				children: loadingText
			})]
		});
	}
	if (hasErrors || !hasAllData && !isLoading) return /* @__PURE__ */ jsx(Fragment, { children: children(Object.entries(queries).reduce((acc, [key, query]) => {
		if (query.data !== void 0) acc[key] = query.data;
		return acc;
	}, {}), firstError, refetchFailedQueries) });
	return /* @__PURE__ */ jsx(Fragment, { children: children(Object.entries(queries).reduce((acc, [key, query]) => {
		acc[key] = query.data;
		return acc;
	}, {}), firstError, refetchFailedQueries) });
}
/**
* AnimatedHeightWrapper - Provides smooth height transitions for modal content
*/
function AnimatedHeightWrapper({ children }) {
	const contentRef = useRef(null);
	const [height, setHeight] = useState(void 0);
	useEffect(() => {
		if (!contentRef.current) return;
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const newHeight = entry.contentRect.height;
				setHeight(newHeight);
			}
		});
		resizeObserver.observe(contentRef.current);
		setHeight(contentRef.current.scrollHeight);
		return () => {
			resizeObserver.disconnect();
		};
	}, []);
	return /* @__PURE__ */ jsx("div", {
		className: "w-full overflow-hidden",
		style: {
			height: height ? `${height}px` : "auto",
			transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
		},
		children: /* @__PURE__ */ jsx("div", {
			ref: contentRef,
			className: "flex w-full flex-col gap-4",
			children
		})
	});
}
function ActionModal({ children, chainId, type, primaryAction, secondaryAction, additionalActions = [], queries, externalError, onErrorDismiss, onErrorAction, errorComponent,...baseProps }) {
	const ctas = [
		...primaryAction ? [primaryAction] : [],
		...secondaryAction ? [secondaryAction] : [],
		...additionalActions
	].filter((cta) => !cta.hidden);
	const [actionError, setActionError] = useState(void 0);
	return /* @__PURE__ */ jsx(BaseModal, {
		...baseProps,
		chainId,
		children: /* @__PURE__ */ jsx(AnimatedHeightWrapper, { children: /* @__PURE__ */ jsx(MultiQueryWrapper, {
			queries,
			type,
			children: (data, error, refetchFailedQueries) => {
				const modalInitializationError = externalError || error;
				return /* @__PURE__ */ jsxs(Fragment, { children: [
					!modalInitializationError && children(data, error, refetchFailedQueries),
					(modalInitializationError || actionError) && (() => {
						const error$1 = modalInitializationError ?? actionError;
						if (!error$1) return null;
						return /* @__PURE__ */ jsx(SmartErrorHandler, {
							error: error$1,
							onHide: () => {
								setActionError(void 0);
							},
							onAction: onErrorAction,
							customComponent: modalInitializationError ? (error$2) => /* @__PURE__ */ jsx(ModalInitializationError, {
								error: error$2,
								onTryAgain: refetchFailedQueries,
								onClose: () => {
									onErrorDismiss?.();
								}
							}) : errorComponent
						});
					})(),
					!modalInitializationError && ctas.length > 0 && /* @__PURE__ */ jsx(CtaActions, {
						ctas,
						chainId,
						onActionError: setActionError
					})
				] });
			}
		}) })
	});
}
function CtaActions({ ctas, chainId, onActionError }) {
	const { ensureCorrectChain } = useEnsureCorrectChain();
	const ctaInProgress = ctas.filter((cta) => cta.loading)[0];
	return /* @__PURE__ */ jsxs("div", {
		className: "flex w-full flex-col gap-2",
		children: [ctas.map((cta, index) => /* @__PURE__ */ jsx(Button, {
			className: "flex w-full items-center justify-center rounded-[12px] [&>div]:justify-center",
			onClick: () => ensureCorrectChain(Number(chainId), { onSuccess: async () => {
				try {
					const result = cta.onClick();
					if (result instanceof Promise) await result;
					onActionError(void 0);
				} catch (error) {
					onActionError(error);
				}
			} }),
			variant: cta.variant || (index === 0 ? "primary" : "ghost"),
			disabled: cta.disabled || cta.loading,
			size: "lg",
			"data-testid": cta.testid,
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-center gap-2",
				children: [cta.loading && /* @__PURE__ */ jsx("div", {
					"data-testid": `${cta.testid}-spinner`,
					children: /* @__PURE__ */ jsx(Spinner, {
						className: "flex items-center justify-center text-white",
						size: "sm"
					})
				}), cta.label]
			})
		}, `cta-${index}-${cta.onClick.toString()}`)), ctaInProgress?.actionName && /* @__PURE__ */ jsx("div", {
			className: "flex w-full items-center justify-center",
			children: /* @__PURE__ */ jsxs(Text, {
				className: "text-sm text-text-50",
				children: [
					"Complete the ",
					ctaInProgress?.actionName,
					" in your wallet"
				]
			})
		})]
	});
}

//#endregion
//#region src/react/ui/modals/_internal/components/waasFeeOptionsSelect/WaasFeeOptionsSelect.tsx
const WaasFeeOptionsSelect = ({ options, selectedFeeOption, onSelectedFeeOptionChange }) => {
	options = options.map((option) => ({
		...option,
		token: {
			...option.token,
			contractAddress: option.token.contractAddress || zeroAddress
		}
	}));
	const feeOptions = options.map((option) => {
		return FeeOptionSelectItem({
			value: option.token.contractAddress ?? "",
			option
		});
	});
	useEffect(() => {
		if (options.length > 0 && !selectedFeeOption) onSelectedFeeOptionChange(options[0]);
	}, [
		options,
		selectedFeeOption,
		onSelectedFeeOptionChange
	]);
	if (options.length === 0 || !selectedFeeOption?.token) return null;
	return /* @__PURE__ */ jsx(Select, {
		name: "fee-option",
		options: feeOptions.map((option) => ({
			label: option.content,
			value: option.value
		})),
		onValueChange: (value) => {
			onSelectedFeeOptionChange(options.find((option) => option.token.contractAddress === value));
		},
		defaultValue: options[0].token.contractAddress ?? void 0
	});
};
function FeeOptionSelectItem({ value, option }) {
	const formattedFee = formatUnits(BigInt(option.value), option.token.decimals || 0);
	const isTruncated = formattedFee.length > 11;
	const truncatedFee = isTruncated ? `${formattedFee.slice(0, 11)}...` : formattedFee;
	const feeDisplay = isTruncated ? /* @__PURE__ */ jsx(Tooltip, {
		message: formattedFee,
		children: /* @__PURE__ */ jsx(Text, {
			className: "font-body text-sm",
			children: truncatedFee
		})
	}) : /* @__PURE__ */ jsx(Text, {
		className: "font-body text-sm",
		children: truncatedFee
	});
	return {
		value,
		content: /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ jsx(Image, {
					className: "h-3 w-3",
					src: option.token.logoURL,
					alt: option.token.symbol
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex gap-1",
					children: [
						/* @__PURE__ */ jsx(Text, {
							className: "font-body text-sm",
							color: "text100",
							children: "Fee"
						}),
						/* @__PURE__ */ jsxs(Text, {
							className: "font-body text-sm",
							color: "text50",
							fontWeight: "semibold",
							children: [
								"(in ",
								option.token.symbol,
								")"
							]
						}),
						/* @__PURE__ */ jsx(Text, {
							className: "font-body text-sm",
							color: "text100",
							children: ":"
						})
					]
				}),
				feeDisplay
			]
		})
	};
}
var WaasFeeOptionsSelect_default = WaasFeeOptionsSelect;

//#endregion
//#region src/react/ui/modals/_internal/components/selectWaasFeeOptions/_components/ActionButtons.tsx
const ButtonContent = ({ confirmed, tokenSymbol }) => {
	if (confirmed) return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ jsx(Spinner, { size: "sm" }), "Confirming"]
	});
	if (!tokenSymbol) return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-2",
		children: ["Continue with", /* @__PURE__ */ jsx(Skeleton, { className: "h-[20px] w-6 animate-shimmer" })]
	});
	return `Continue with ${tokenSymbol}`;
};
const ActionButtons = ({ onCancel, onConfirm, disabled, loading, confirmed, tokenSymbol }) => /* @__PURE__ */ jsxs("div", {
	className: "mt-4 flex w-full items-center justify-end gap-2",
	children: [/* @__PURE__ */ jsx(Button, {
		disabled: loading,
		onClick: onCancel,
		variant: "ghost",
		shape: "square",
		size: "md",
		children: /* @__PURE__ */ jsx("div", {
			className: "flex items-center gap-2",
			children: "Cancel"
		})
	}), /* @__PURE__ */ jsx(Button, {
		disabled: disabled || loading || confirmed,
		onClick: onConfirm,
		variant: "primary",
		shape: "square",
		size: "md",
		children: /* @__PURE__ */ jsx("div", {
			className: "flex items-center gap-2",
			children: /* @__PURE__ */ jsx(ButtonContent, {
				confirmed,
				tokenSymbol
			})
		})
	})]
});
var ActionButtons_default = ActionButtons;

//#endregion
//#region src/react/ui/modals/_internal/components/selectWaasFeeOptions/_components/BalanceIndicator.tsx
const BalanceIndicator = ({ insufficientBalance, currencyBalance, selectedFeeOption }) => /* @__PURE__ */ jsxs("div", {
	className: "flex items-center gap-2",
	children: [insufficientBalance ? /* @__PURE__ */ jsx(WarningIcon, {
		className: "text-negative",
		size: "xs"
	}) : /* @__PURE__ */ jsx(CheckmarkIcon, {
		className: "text-positive",
		size: "xs"
	}), /* @__PURE__ */ jsxs(Text, {
		className: "font-body font-medium text-xs",
		color: insufficientBalance ? "negative" : "text100",
		children: [
			"You have ",
			currencyBalance?.formatted || "0",
			" ",
			selectedFeeOption?.token.symbol
		]
	})]
});
var BalanceIndicator_default = BalanceIndicator;

//#endregion
//#region src/react/ui/modals/_internal/components/selectWaasFeeOptions/useWaasFeeOptionManager.tsx
const useWaasFeeOptionManager = (chainId) => {
	const { address: userAddress } = useAccount();
	const { selectedFeeOption, setSelectedFeeOption, pendingFeeOptionConfirmation: storedPendingFeeOptionConfirmation, setPendingFeeOptionConfirmation } = useSelectWaasFeeOptionsStore();
	const [pendingFeeOptionConfirmationFromHook, confirmPendingFeeOption] = useWaasFeeOptions();
	const [feeOptionsConfirmed, setFeeOptionsConfirmed] = useState(false);
	useEffect(() => {
		setPendingFeeOptionConfirmation(pendingFeeOptionConfirmationFromHook);
	}, [pendingFeeOptionConfirmationFromHook, setPendingFeeOptionConfirmation]);
	const { data: currencyBalance, isLoading: currencyBalanceLoading } = useTokenCurrencyBalance({
		chainId,
		currencyAddress: selectedFeeOption?.token.contractAddress || zeroAddress,
		userAddress
	});
	useEffect(() => {
		if (!selectedFeeOption && storedPendingFeeOptionConfirmation) {
			if (storedPendingFeeOptionConfirmation.options.length > 0) setSelectedFeeOption(storedPendingFeeOptionConfirmation.options[0]);
		}
	}, [
		storedPendingFeeOptionConfirmation,
		selectedFeeOption,
		setSelectedFeeOption
	]);
	const insufficientBalance = (() => {
		if (!selectedFeeOption?.value || !selectedFeeOption.token.decimals) return false;
		if (!currencyBalance?.value && currencyBalance?.value !== 0n) return true;
		try {
			const feeValue = BigInt(selectedFeeOption.value);
			return currencyBalance.value === 0n || currencyBalance.value < feeValue;
		} catch {
			return true;
		}
	})();
	const handleConfirmFeeOption = () => {
		if (!selectedFeeOption?.token || !storedPendingFeeOptionConfirmation?.id) return;
		confirmPendingFeeOption(storedPendingFeeOptionConfirmation?.id, selectedFeeOption.token.contractAddress || zeroAddress);
		setFeeOptionsConfirmed(true);
	};
	return {
		selectedFeeOption,
		pendingFeeOptionConfirmation: storedPendingFeeOptionConfirmation,
		currencyBalance,
		currencyBalanceLoading,
		insufficientBalance,
		feeOptionsConfirmed,
		handleConfirmFeeOption
	};
};
var useWaasFeeOptionManager_default = useWaasFeeOptionManager;

//#endregion
//#region src/react/ui/modals/_internal/components/selectWaasFeeOptions/index.tsx
const SelectWaasFeeOptions = ({ chainId, onCancel, titleOnConfirm, className }) => {
	const { isVisible, hide, setSelectedFeeOption } = useSelectWaasFeeOptionsStore();
	const { selectedFeeOption, pendingFeeOptionConfirmation, currencyBalance, currencyBalanceLoading, insufficientBalance, feeOptionsConfirmed, handleConfirmFeeOption } = useWaasFeeOptionManager_default(chainId);
	console.log("pendingFeeOptionConfirmation", pendingFeeOptionConfirmation);
	const handleCancelFeeOption = () => {
		hide();
		onCancel?.();
	};
	const isSponsored = pendingFeeOptionConfirmation?.options?.length === 0;
	if (!isVisible || isSponsored || !selectedFeeOption) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: cn$1("flex w-full flex-col gap-2 rounded-2xl bg-button-emphasis p-0 backdrop-blur-md", className),
		children: [
			/* @__PURE__ */ jsx(Separator, { className: "mt-0 mb-4" }),
			/* @__PURE__ */ jsx(Text, {
				className: "mb-2 font-body font-bold text-large text-text-100",
				children: feeOptionsConfirmed ? titleOnConfirm : "Select a fee option"
			}),
			!feeOptionsConfirmed && !pendingFeeOptionConfirmation && /* @__PURE__ */ jsx(Skeleton, { className: "h-[52px] w-full animate-shimmer rounded-xl" }),
			(feeOptionsConfirmed || pendingFeeOptionConfirmation) && /* @__PURE__ */ jsx("div", {
				className: cn$1("[&>label>button>span]:overflow-hidden [&>label>button]:w-full [&>label>button]:text-xs [&>label>div]:w-full [&>label]:flex [&>label]:w-full", feeOptionsConfirmed && "pointer-events-none opacity-70"),
				children: /* @__PURE__ */ jsx(WaasFeeOptionsSelect_default, {
					options: pendingFeeOptionConfirmation?.options || [selectedFeeOption],
					selectedFeeOption,
					onSelectedFeeOptionChange: setSelectedFeeOption
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex w-full items-start justify-between",
				children: [!feeOptionsConfirmed && (!pendingFeeOptionConfirmation || currencyBalanceLoading) && /* @__PURE__ */ jsx(Skeleton, { className: "h-[20px] w-2/3 animate-shimmer rounded-xl" }), (feeOptionsConfirmed || pendingFeeOptionConfirmation && !currencyBalanceLoading) && /* @__PURE__ */ jsx(BalanceIndicator_default, {
					insufficientBalance,
					currencyBalance,
					selectedFeeOption
				})]
			}),
			/* @__PURE__ */ jsx(ActionButtons_default, {
				onCancel: handleCancelFeeOption,
				onConfirm: handleConfirmFeeOption,
				disabled: !selectedFeeOption?.token || insufficientBalance || currencyBalanceLoading,
				loading: currencyBalanceLoading,
				confirmed: feeOptionsConfirmed,
				tokenSymbol: selectedFeeOption?.token.symbol
			})
		]
	});
};
var selectWaasFeeOptions_default = SelectWaasFeeOptions;

//#endregion
//#region src/react/ui/modals/_internal/components/tokenPreview/index.tsx
function TokenPreview({ collectionName, collectionAddress, collectibleId, chainId }) {
	const { data: collectable, isLoading: collectibleLoading } = useCollectibleMetadata({
		chainId,
		collectionAddress,
		collectibleId
	});
	if (collectibleLoading) return /* @__PURE__ */ jsxs("div", {
		className: "flex w-full items-center gap-3",
		children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-9 w-9 rounded-sm" }), /* @__PURE__ */ jsxs("div", {
			className: "flex grow flex-col gap-1",
			children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-1/3" }), /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-1/2" })]
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "flex w-full items-center",
		children: [/* @__PURE__ */ jsx(Image, {
			className: "h-9 w-9 rounded-sm",
			src: collectable?.image || chess_tile_default,
			alt: collectable?.name,
			style: { objectFit: "cover" }
		}), /* @__PURE__ */ jsxs("div", {
			className: "ml-3 flex flex-col",
			children: [/* @__PURE__ */ jsx(Text, {
				className: "font-body font-medium text-xs",
				color: "text80",
				children: collectionName
			}), /* @__PURE__ */ jsx(Text, {
				className: "font-body font-bold text-xs",
				fontWeight: "bold",
				color: "text100",
				children: collectable?.name
			})]
		})]
	});
}

//#endregion
//#region src/react/ui/modals/_internal/components/transactionDetails/index.tsx
function TransactionDetails({ collectibleId, collectionAddress, chainId, includeMarketplaceFee, price, showPlaceholderPrice, currencyImageUrl }) {
	const { data, isLoading: marketplaceConfigLoading } = useMarketplaceConfig();
	const marketplaceFeePercentage = includeMarketplaceFee ? data?.market.collections.find((collection) => collection.itemsAddress === collectionAddress)?.feePercentage || DEFAULT_MARKETPLACE_FEE_PERCENTAGE : 0;
	const { data: royalty, isLoading: royaltyLoading } = useRoyalty({
		chainId,
		collectionAddress,
		collectibleId
	});
	const [overflow, setOverflow] = useState({
		status: false,
		amount: "0"
	});
	const priceLoading = !price || marketplaceConfigLoading || royaltyLoading;
	const [formattedAmount, setFormattedAmount] = useState("0");
	useEffect(() => {
		if (!price || royaltyLoading || marketplaceConfigLoading) return;
		const fees = [];
		if (royalty?.percentage && royalty?.percentage > 0) fees.push(Number(royalty.percentage));
		if (marketplaceFeePercentage > 0) fees.push(marketplaceFeePercentage);
		setFormattedAmount(calculateEarningsAfterFees(BigInt(price.amountRaw), price.currency.decimals, fees));
	}, [
		price,
		royalty,
		marketplaceFeePercentage,
		royaltyLoading,
		marketplaceConfigLoading
	]);
	useEffect(() => {
		if (formattedAmount.length > 15) setOverflow((prev) => prev.status ? prev : {
			status: true,
			amount: formattedAmount.slice(0, 15)
		});
		else setOverflow({
			status: false,
			amount: formattedAmount
		});
	}, [formattedAmount]);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex w-full items-center justify-between",
		children: [/* @__PURE__ */ jsx(Text, {
			className: "font-body font-medium text-xs",
			color: "text50",
			children: "Total earnings"
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2",
			children: [currencyImageUrl ? /* @__PURE__ */ jsx(Image, {
				className: "h-3 w-3",
				src: currencyImageUrl
			}) : /* @__PURE__ */ jsx("div", { className: "h-3 w-3 rounded-full bg-background-secondary" }), priceLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-12 animate-shimmer" }) : /* @__PURE__ */ jsx(Text, {
				className: "font-body font-medium text-xs",
				color: "text100",
				children: showPlaceholderPrice ? /* @__PURE__ */ jsxs(Text, {
					className: "font-body font-medium text-xs",
					color: "text100",
					children: ["0 ", price.currency.symbol]
				}) : overflow.status ? /* @__PURE__ */ jsx(Tooltip, {
					message: `${formattedAmount} ${price.currency.symbol}`,
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center",
						children: [/* @__PURE__ */ jsx(ChevronRightIcon, { className: "h-3 w-3 text-text-100" }), /* @__PURE__ */ jsxs(Text, {
							className: "font-body font-medium text-xs",
							color: "text100",
							children: [
								overflow.amount,
								" ",
								price.currency.symbol
							]
						})]
					})
				}) : /* @__PURE__ */ jsxs(Text, {
					className: "font-body font-medium text-xs",
					color: "text100",
					children: [
						formattedAmount,
						" ",
						price.currency.symbol
					]
				})
			})]
		})]
	});
}

//#endregion
//#region src/react/ui/modals/_internal/components/transactionHeader/index.tsx
function TransactionHeader({ title, currencyImageUrl, date }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex w-full items-center",
		children: [
			/* @__PURE__ */ jsx(Text, {
				className: "mr-1 font-body text-sm",
				fontWeight: "medium",
				color: "text80",
				children: title
			}),
			/* @__PURE__ */ jsx(Image, {
				className: "mr-1 h-3 w-3",
				src: currencyImageUrl
			}),
			date && /* @__PURE__ */ jsxs(Text, {
				className: "grow text-right font-body text-xs",
				fontWeight: "medium",
				color: "text50",
				children: [formatDistanceToNow(date), " ago"]
			}) || /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-8" })
		]
	});
}

//#endregion
//#region src/react/ui/modals/SellModal/Modal.tsx
function SellModal() {
	const { tokenId, collectionAddress, chainId, offer, flow, feeSelection, error, close, isOpen, queries } = useSellModalContext();
	if (!isOpen) return null;
	const approvalStep = flow.steps.find((s) => s.id === "approve");
	const sellStep = flow.steps.find((s) => s.id === "sell");
	const showApprovalButton = approvalStep && approvalStep.status === "idle";
	const approvalAction = showApprovalButton ? {
		label: approvalStep.label,
		actionName: approvalStep.label,
		onClick: approvalStep.run,
		loading: approvalStep.isPending,
		disabled: !flow.nextStep || !!error || flow.isPending,
		variant: "secondary",
		testid: "sell-modal-approve-button"
	} : void 0;
	return /* @__PURE__ */ jsx(ActionModal, {
		chainId,
		onClose: () => {
			close();
			selectWaasFeeOptionsStore.send({ type: "hide" });
		},
		title: "You have an offer",
		type: "sell",
		primaryAction: {
			label: sellStep.label,
			actionName: sellStep.label,
			onClick: sellStep.run,
			loading: sellStep.isPending && !showApprovalButton,
			disabled: !flow.nextStep || !!error || showApprovalButton && flow.isPending,
			testid: "sell-modal-accept-button"
		},
		secondaryAction: approvalAction,
		queries,
		externalError: error,
		children: ({ collection, currency }) => /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(TransactionHeader, {
				title: "Offer received",
				currencyImageUrl: currency?.imageUrl,
				date: offer.order ? new Date(offer.order.createdAt) : void 0
			}),
			/* @__PURE__ */ jsx(TokenPreview, {
				collectionName: collection.name,
				collectionAddress,
				collectibleId: tokenId,
				chainId
			}),
			/* @__PURE__ */ jsx(TransactionDetails, {
				collectibleId: tokenId,
				collectionAddress,
				chainId,
				includeMarketplaceFee: true,
				price: offer.priceAmount ? {
					amountRaw: offer.priceAmount,
					currency
				} : void 0,
				currencyImageUrl: currency.imageUrl
			}),
			feeSelection?.isSelecting && /* @__PURE__ */ jsx(selectWaasFeeOptions_default, {
				chainId,
				onCancel: feeSelection.cancel,
				titleOnConfirm: "Accepting offer..."
			})
		] })
	});
}

//#endregion
//#region src/react/hooks/ui/card-data/market-card-data.tsx
function useMarketCardData({ collectionAddress, chainId, orderbookKind, collectionType, filterOptions, searchText, showListedOnly = false, priceFilters, onCollectibleClick, onCannotPerformAction, prioritizeOwnerActions, assetSrcPrefixUrl, hideQuantitySelector }) {
	const { address: accountAddress } = useAccount();
	const { show: showSellModal } = useSellModal();
	const { data: collectiblesList, isLoading: collectiblesListIsLoading, fetchNextPage, hasNextPage, isFetchingNextPage, error: collectiblesListError } = useCollectibleMarketList({
		collectionAddress,
		chainId,
		side: OrderSide.listing,
		filter: {
			includeEmpty: !showListedOnly,
			searchText,
			properties: filterOptions,
			prices: priceFilters
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
	return {
		collectibleCards: useMemo(() => {
			return allCollectibles.map((collectible) => {
				const balance = collectionBalance?.balances.find((balance$1) => balance$1.tokenID === collectible.metadata.tokenId)?.balance;
				return {
					tokenId: collectible.metadata.tokenId,
					chainId,
					collectionAddress,
					collectionType,
					cardLoading: collectiblesListIsLoading || balanceLoading,
					cardType: "market",
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
								order
							});
							return;
						}
					}
				};
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
		]),
		isLoading: collectiblesListIsLoading || balanceLoading,
		error: collectiblesListError,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
		allCollectibles
	};
}

//#endregion
//#region src/react/hooks/ui/card-data/primary-sale-721-card-data.tsx
function usePrimarySale721CardData({ primarySaleItemsWithMetadata, chainId, contractAddress, salesContractAddress, enabled = true }) {
	const [allTokenSuppliesFetched, setAllTokenSuppliesFetched] = useState(false);
	const { showListedOnly: showAvailableSales } = useFilterState();
	const { abi, isLoading: versionLoading } = useSalesContractABI({
		contractAddress: salesContractAddress,
		contractType: ContractType.ERC721,
		chainId,
		enabled
	});
	const config = useConfig();
	const tokenSuppliesEnabled = Boolean(chainId && contractAddress && config && (enabled ?? true));
	const { data: tokenSuppliesData, fetchNextPage: fetchNextTokenSuppliesPage, hasNextPage: hasNextSuppliesPage, isFetchingNextPage: isFetchingNextSuppliesPage, isLoading: tokenSuppliesLoading } = useInfiniteQuery({ ...tokenSuppliesQueryOptions({
		chainId,
		collectionAddress: contractAddress,
		includeMetadata: true,
		config,
		query: { enabled: tokenSuppliesEnabled }
	}) });
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
		tokenSuppliesEnabled
	]);
	const allTokenSupplies = tokenSuppliesData?.pages.flatMap((page) => page.tokenIDs);
	const matchingTokenSupplies = allTokenSupplies?.filter((item) => primarySaleItemsWithMetadata.some((primarySaleItem) => primarySaleItem.metadata.tokenId === item.tokenID));
	const { data: saleDetails, isLoading: saleDetailsLoading, error: saleDetailsError } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: abi || [],
		functionName: "saleDetails",
		query: { enabled: enabled && !versionLoading && !!abi }
	});
	const primarySaleItemsCollectibleCards = primarySaleItemsWithMetadata.filter((item) => !matchingTokenSupplies?.some((supply) => supply.tokenID === item.metadata.tokenId)).map((item) => {
		const { metadata, primarySaleItem } = item;
		const salePrice = {
			amount: primarySaleItem.priceAmount?.toString(),
			currencyAddress: primarySaleItem.currencyAddress
		};
		const quantityInitial = primarySaleItem.supply?.toString();
		const quantityRemaining = "1";
		const saleStartsAt = primarySaleItem.startDate.toString();
		const saleEndsAt = primarySaleItem.endDate.toString();
		return {
			tokenId: metadata.tokenId,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType.ERC721,
			tokenMetadata: metadata,
			cardLoading: saleDetailsLoading,
			salesContractAddress,
			salePrice,
			quantityInitial,
			quantityRemaining,
			quantityDecimals: 0,
			saleStartsAt,
			saleEndsAt,
			cardType: "shop"
		};
	});
	const mintedTokensCollectibleCards = allTokenSupplies?.map((item) => {
		return {
			tokenId: item.tokenID,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType.ERC721,
			tokenMetadata: item.tokenMetadata,
			cardLoading: saleDetailsLoading,
			salesContractAddress,
			salePrice: {
				amount: "0",
				currencyAddress: "0x0000000000000000000000000000000000000000"
			},
			quantityInitial: void 0,
			quantityRemaining: void 0,
			quantityDecimals: 0,
			saleStartsAt: void 0,
			saleEndsAt: void 0,
			cardType: "shop"
		};
	});
	const collectibleCards = showAvailableSales ? primarySaleItemsCollectibleCards : [...mintedTokensCollectibleCards ?? [], ...primarySaleItemsCollectibleCards];
	return {
		salePrice: collectibleCards[0]?.salePrice,
		collectibleCards,
		saleDetailsError,
		saleDetails,
		isLoading: enabled && (saleDetailsLoading || tokenSuppliesLoading || !allTokenSuppliesFetched),
		tokenSuppliesData
	};
}

//#endregion
//#region src/react/hooks/ui/card-data/primary-sale-1155-card-data.tsx
function usePrimarySale1155CardData({ primarySaleItemsWithMetadata, chainId, contractAddress, salesContractAddress, enabled = true }) {
	const { abi, isLoading: versionLoading } = useSalesContractABI({
		contractAddress: salesContractAddress,
		contractType: ContractType.ERC1155,
		chainId,
		enabled
	});
	const { data: collection, isLoading: collectionLoading } = useCollectionMetadata({
		chainId,
		collectionAddress: contractAddress,
		query: { enabled }
	});
	const { data: paymentToken, isLoading: paymentTokenLoading } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: abi || [],
		functionName: "paymentToken",
		query: { enabled: enabled && !versionLoading && !!abi }
	});
	const isLoading = versionLoading || collectionLoading || paymentTokenLoading;
	return {
		collectibleCards: primarySaleItemsWithMetadata.map((item) => {
			const { metadata, primarySaleItem: saleData } = item;
			const salePrice = {
				amount: saleData?.priceAmount?.toString() || "",
				currencyAddress: saleData?.currencyAddress || paymentToken || "0x"
			};
			const supply = saleData?.supply?.toString();
			const unlimitedSupply = saleData?.unlimitedSupply;
			return {
				tokenId: metadata.tokenId,
				chainId,
				collectionAddress: contractAddress,
				collectionType: ContractType.ERC1155,
				tokenMetadata: metadata,
				cardLoading: isLoading,
				salesContractAddress,
				salePrice,
				quantityInitial: supply,
				quantityDecimals: collection?.decimals || 0,
				quantityRemaining: supply,
				unlimitedSupply,
				saleStartsAt: saleData?.startDate?.toString(),
				saleEndsAt: saleData?.endDate?.toString(),
				cardType: "shop"
			};
		}),
		tokenMetadataError: null,
		tokenSaleDetailsError: null,
		isLoading: enabled && isLoading
	};
}

//#endregion
//#region src/react/hooks/ui/useFilters.tsx
/**
* Hook to fetch metadata filters for a collection
*
* Retrieves property filters for a collection from the metadata service,
* with support for marketplace-specific filter configuration including
* exclusion rules and custom ordering.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address to fetch filters for
* @param params.showAllFilters - Whether to show all filters or apply marketplace filtering
* @param params.excludePropertyValues - Whether to exclude property values from the response
* @param params.query - Optional React Query configuration
*
* @returns Query result containing property filters for the collection
*
* @example
* Basic usage:
* ```typescript
* const { data: filters, isLoading } = useFilters({
*   chainId: 137,
*   collectionAddress: '0x1234...'
* })
*
* if (data) {
*   console.log(`Found ${data.length} filters`);
*   data.forEach(filter => {
*     console.log(`${filter.name}: ${filter.values?.join(', ')}`);
*   });
* }
* ```
*
* @example
* With marketplace filtering disabled:
* ```typescript
* const { data: allFilters } = useFilters({
*   chainId: 1,
*   collectionAddress: '0x5678...',
*   showAllFilters: true, // Bypass marketplace filter rules
*   query: {
*     enabled: Boolean(selectedCollection),
*     staleTime: 300000 // Cache for 5 minutes
*   }
* })
* ```
*
* @example
* Exclude property values for faster loading:
* ```typescript
* const { data: filterNames } = useFilters({
*   chainId: 137,
*   collectionAddress: collectionAddress,
*   excludePropertyValues: true, // Only get filter names, not values
*   query: {
*     enabled: Boolean(collectionAddress)
*   }
* })
* ```
*/
function useFilters(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	return useQuery({ ...filtersQueryOptions({
		config,
		...rest
	}) });
}
/**
* Hook to progressively load collection filters
*
* First loads filter names only for fast initial display, then loads full filter
* data with values. Uses placeholder data to provide immediate feedback while
* full data loads in the background.
*
* @param params - Configuration parameters (same as useFilters)
*
* @returns Query result with additional loading states
* @returns result.isLoadingNames - Whether filter names are still loading
* @returns result.isFetchingValues - Whether filter values are being fetched
*
* @example
* Progressive filter loading:
* ```typescript
* const {
*   data: filters,
*   isLoadingNames,
*   isFetchingValues,
*   isLoading
* } = useFiltersProgressive({
*   chainId: 137,
*   collectionAddress: '0x1234...'
* })
*
* if (isLoadingNames) {
*   return <div>Loading filters...</div>;
* }
*
* return (
*   <div>
*     {filters?.map(filter => (
*       <FilterComponent
*         key={filter.name}
*         filter={filter}
*         isLoadingValues={isFetchingValues}
*       />
*     ))}
*   </div>
* );
* ```
*/
function useFiltersProgressive(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const namesQuery = useQuery(filtersQueryOptions({
		config,
		...rest,
		excludePropertyValues: true
	}));
	const fullQuery = useQuery({
		...filtersQueryOptions({
			config,
			...rest
		}),
		placeholderData: namesQuery.data
	});
	const isLoadingNames = namesQuery.isLoading;
	const isFetchingValues = fullQuery.isPlaceholderData && fullQuery.isFetching;
	return {
		...fullQuery,
		isFetchingValues,
		isLoadingNames
	};
}

//#endregion
//#region src/react/hooks/ui/useOpenConnectModal.tsx
const useOpenConnectModal$1 = () => {
	return { openConnectModal: useConfig().openConnectModal };
};

//#endregion
//#region src/react/hooks/utils/useAutoSelectFeeOption.tsx
var AutoSelectFeeOptionError = /* @__PURE__ */ function(AutoSelectFeeOptionError$1) {
	AutoSelectFeeOptionError$1["UserNotConnected"] = "User not connected";
	AutoSelectFeeOptionError$1["NoOptionsProvided"] = "No options provided";
	AutoSelectFeeOptionError$1["FailedToCheckBalances"] = "Failed to check balances";
	AutoSelectFeeOptionError$1["InsufficientBalanceForAnyFeeOption"] = "Insufficient balance for any fee option";
	return AutoSelectFeeOptionError$1;
}(AutoSelectFeeOptionError || {});
/**
* A React hook that automatically selects the first fee option for which the user has sufficient balance.
*
* @param {Object} params.pendingFeeOptionConfirmation - Configuration for fee option selection
*
* @returns {Promise<{
*   selectedOption: FeeOption | null,
*   error: AutoSelectFeeOptionError | null,
*   isLoading?: boolean
* }>} A promise that resolves to an object containing:
*   - selectedOption: The first fee option with sufficient balance, or null if none found
*   - error: Error message if selection fails, null otherwise
*   - isLoading: True while checking balances
*
* @throws {AutoSelectFeeOptionError} Possible errors:
*   - UserNotConnected: When no wallet is connected
*   - NoOptionsProvided: When fee options array is undefined
*   - FailedToCheckBalances: When balance checking fails
*   - InsufficientBalanceForAnyFeeOption: When user has insufficient balance for all options
*
* @example
* ```tsx
* function MyComponent() {
*   const [pendingFeeOptionConfirmation, confirmPendingFeeOption] = useWaasFeeOptions();
*
*   const autoSelectOptionPromise = useAutoSelectFeeOption({
*     pendingFeeOptionConfirmation: pendingFeeOptionConfirmation
*       ? {
*           id: pendingFeeOptionConfirmation.id,
*           options: pendingFeeOptionConfirmation.options,
*           chainId: 1
*         }
*       : {
*           id: '',
*           options: undefined,
*           chainId: 1
*         }
*   });
*
*   useEffect(() => {
*     autoSelectOptionPromise.then((result) => {
*       if (result.isLoading) {
*         console.log('Checking balances...');
*         return;
*       }
*
*       if (result.error) {
*         console.error('Failed to select fee option:', result.error);
*         return;
*       }
*
*       if (pendingFeeOptionConfirmation?.id && result.selectedOption) {
*         confirmPendingFeeOption(
*           pendingFeeOptionConfirmation.id,
*           result.selectedOption.token.contractAddress
*         );
*       }
*     });
*   }, [autoSelectOptionPromise, confirmPendingFeeOption, pendingFeeOptionConfirmation]);
*
*   return <div>...</div>;
* }
* ```
*/
function useAutoSelectFeeOption({ pendingFeeOptionConfirmation, enabled }) {
	const { address: userAddress } = useAccount();
	const contractWhitelist = pendingFeeOptionConfirmation.options?.map((option) => option.token.contractAddress === null ? zeroAddress : option.token.contractAddress);
	const { data: balanceDetails, isLoading: isBalanceDetailsLoading, isError: isBalanceDetailsError } = useCollectionBalanceDetails({
		chainId: pendingFeeOptionConfirmation.chainId,
		filter: {
			accountAddresses: userAddress ? [userAddress] : [],
			contractWhitelist,
			omitNativeBalances: false
		},
		query: { enabled: !!pendingFeeOptionConfirmation.options && !!userAddress && enabled }
	});
	const chain = useChain(pendingFeeOptionConfirmation.chainId);
	const combinedBalances = balanceDetails && [...balanceDetails.nativeBalances.map((b) => ({
		chainId: pendingFeeOptionConfirmation.chainId,
		balance: b.balance,
		symbol: chain?.nativeCurrency.symbol,
		contractAddress: zeroAddress
	})), ...balanceDetails.balances.map((b) => ({
		chainId: b.chainId,
		balance: b.balance,
		symbol: b.contractInfo?.symbol,
		contractAddress: b.contractAddress
	}))];
	useEffect(() => {
		if (combinedBalances) console.debug("currency balances", combinedBalances);
	}, [combinedBalances]);
	return useCallback(async () => {
		if (!userAddress) return {
			selectedOption: null,
			error: AutoSelectFeeOptionError.UserNotConnected
		};
		if (!pendingFeeOptionConfirmation.options) return {
			selectedOption: null,
			error: AutoSelectFeeOptionError.NoOptionsProvided
		};
		if (isBalanceDetailsLoading) return {
			selectedOption: null,
			error: null,
			isLoading: true
		};
		if (isBalanceDetailsError || !combinedBalances) return {
			selectedOption: null,
			error: AutoSelectFeeOptionError.FailedToCheckBalances
		};
		const selectedOption = pendingFeeOptionConfirmation.options.find((option) => {
			const tokenBalance = combinedBalances.find((balance) => balance.contractAddress.toLowerCase() === (option.token.contractAddress === null ? zeroAddress : option.token.contractAddress).toLowerCase());
			if (!tokenBalance) return false;
			return BigInt(tokenBalance.balance) >= BigInt(option.value);
		});
		if (!selectedOption) return {
			selectedOption: null,
			error: AutoSelectFeeOptionError.InsufficientBalanceForAnyFeeOption
		};
		console.debug("auto selected option", selectedOption);
		return {
			selectedOption,
			error: null
		};
	}, [
		userAddress,
		pendingFeeOptionConfirmation.options,
		isBalanceDetailsLoading,
		isBalanceDetailsError,
		combinedBalances
	])();
}

//#endregion
//#region src/react/hooks/util/optimisticCancelUpdates.ts
const SECOND = 1e3;
const updateQueriesOnCancel = ({ orderId, queryClient }) => {
	queryClient.setQueriesData({
		queryKey: ["collectible", "market-count-offers"],
		exact: false
	}, (oldData) => {
		if (!oldData) return 0;
		return Math.max(0, oldData.count - 1);
	});
	queryClient.setQueriesData({
		queryKey: ["collectible", "market-list-offers"],
		exact: false
	}, (oldData) => {
		if (!oldData || !oldData.offers) return oldData;
		return {
			...oldData,
			offers: oldData.offers.filter((offer) => offer.orderId !== orderId)
		};
	});
	setTimeout(() => {
		queryClient.invalidateQueries({
			queryKey: ["collectible", "market-highest-offer"],
			exact: false,
			predicate: (query) => !query.meta?.persistent
		});
	}, 2 * SECOND);
	queryClient.setQueriesData({
		queryKey: ["collectible", "market-count-listings"],
		exact: false
	}, (oldData) => {
		if (!oldData) return 0;
		return Math.max(0, oldData.count - 1);
	});
	queryClient.setQueriesData({
		queryKey: ["collectible", "market-list-listings"],
		exact: false
	}, (oldData) => {
		if (!oldData || !oldData.listings) return oldData;
		return {
			...oldData,
			listings: oldData.listings.filter((listing) => listing.orderId !== orderId)
		};
	});
	setTimeout(() => {
		queryClient.invalidateQueries({
			queryKey: ["collectible", "market-lowest-listing"],
			exact: false
		});
	}, 2 * SECOND);
};
const invalidateQueriesOnCancel = ({ queryClient }) => {
	queryClient.invalidateQueries({
		queryKey: ["collectible", "market-list-offers"],
		exact: false
	});
	queryClient.invalidateQueries({
		queryKey: ["collectible", "market-count-offers"],
		exact: false
	});
	queryClient.invalidateQueries({
		queryKey: ["collectible", "market-list-listings"],
		exact: false
	});
	queryClient.invalidateQueries({
		queryKey: ["collectible", "market-count-listings"],
		exact: false
	});
	queryClient.invalidateQueries({
		queryKey: ["collectible", "market-highest-offer"],
		exact: false
	});
	queryClient.invalidateQueries({
		queryKey: ["collectible", "market-lowest-listing"],
		exact: false
	});
};

//#endregion
//#region src/react/ui/modals/_internal/components/alertMessage/index.tsx
function AlertMessage({ message, type }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `flex items-center justify-between gap-3 rounded-xl p-4 ${type === "warning" ? "bg-[hsla(39,71%,40%,0.3)]" : "bg-[hsla(247,100%,75%,0.3)]"}`,
		children: [
			/* @__PURE__ */ jsx(Text, {
				className: "font-body text-sm",
				color: "white",
				fontWeight: "medium",
				children: message
			}),
			type === "warning" && /* @__PURE__ */ jsx(WarningIcon, {
				size: "sm",
				color: "white"
			}),
			type === "info" && /* @__PURE__ */ jsx(InfoIcon, {
				size: "sm",
				color: "white"
			})
		]
	});
}

//#endregion
//#region src/react/ui/modals/_internal/components/switchChainErrorModal/store.ts
const initialContext$3 = {
	isOpen: false,
	chainIdToSwitchTo: void 0,
	isSwitching: false
};
const switchChainErrorModalStore = createStore({
	context: initialContext$3,
	on: {
		open: (context, event) => ({
			...context,
			isOpen: true,
			chainIdToSwitchTo: event.chainIdToSwitchTo
		}),
		close: (context) => ({
			...context,
			isOpen: false,
			chainIdToSwitchTo: void 0,
			isSwitching: false
		})
	}
});
const useIsOpen$3 = () => useSelector(switchChainErrorModalStore, (state) => state.context.isOpen);
const useChainIdToSwitchTo = () => useSelector(switchChainErrorModalStore, (state) => state.context.chainIdToSwitchTo);

//#endregion
//#region src/react/ui/modals/_internal/components/switchChainErrorModal/index.tsx
const useSwitchChainErrorModal = () => {
	return {
		show: (args) => switchChainErrorModalStore.send({
			type: "open",
			...args
		}),
		close: () => switchChainErrorModalStore.send({ type: "close" })
	};
};
const SwitchChainErrorModal = () => {
	const { chainId: currentChainId } = useAccount();
	const isOpen = useIsOpen$3();
	const chainIdToSwitchTo = useChainIdToSwitchTo();
	const chainName = chainIdToSwitchTo ? getPresentableChainName(chainIdToSwitchTo) : "";
	const handleClose = () => {
		switchChainErrorModalStore.send({ type: "close" });
	};
	if (!isOpen || !chainIdToSwitchTo || currentChainId === chainIdToSwitchTo) return null;
	return /* @__PURE__ */ jsx(Modal, {
		isDismissible: true,
		onClose: handleClose,
		disableAnimation: true,
		size: "sm",
		overlayProps: MODAL_OVERLAY_PROPS,
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid flex-col gap-6 p-7",
			children: [/* @__PURE__ */ jsx(Text, {
				className: "text-xl",
				fontWeight: "bold",
				color: "text100",
				children: "Switching network failed"
			}), /* @__PURE__ */ jsx(AlertMessage, {
				type: "warning",
				message: `There was an error switching to ${chainName}. Please try changing the network in your wallet manually.`
			})]
		})
	});
};
var switchChainErrorModal_default = SwitchChainErrorModal;

//#endregion
//#region src/react/hooks/utils/useEnsureCorrectChain.ts
const useEnsureCorrectChain = () => {
	const { chainId: currentChainId } = useAccount();
	const { switchChain, switchChainAsync } = useSwitchChain();
	const { show: showSwitchChainErrorModal, close: closeSwitchChainErrorModal } = useSwitchChainErrorModal();
	const chainIdToSwitchTo = useChainIdToSwitchTo();
	const { isWaaS } = useConnectorMetadata();
	useEffect(() => {
		if (currentChainId && chainIdToSwitchTo && currentChainId === chainIdToSwitchTo) closeSwitchChainErrorModal();
	}, [
		currentChainId,
		chainIdToSwitchTo,
		closeSwitchChainErrorModal
	]);
	const ensureCorrectChainAsync = useCallback(async (targetChainId) => {
		if (currentChainId === targetChainId) return Promise.resolve();
		return switchChainAsync({ chainId: targetChainId }).catch(() => {
			showSwitchChainErrorModal({ chainIdToSwitchTo: targetChainId });
		});
	}, [
		currentChainId,
		isWaaS,
		switchChainAsync,
		showSwitchChainErrorModal
	]);
	return {
		ensureCorrectChain: useCallback((targetChainId, callbacks) => {
			if (currentChainId === targetChainId) {
				callbacks?.onSuccess?.();
				return;
			}
			switchChain({ chainId: targetChainId }, {
				onSuccess: callbacks?.onSuccess,
				onError: () => showSwitchChainErrorModal({ chainIdToSwitchTo: targetChainId })
			});
		}, [
			currentChainId,
			isWaaS,
			switchChain,
			showSwitchChainErrorModal
		]),
		ensureCorrectChainAsync,
		currentChainId
	};
};

//#endregion
//#region src/react/hooks/transactions/useGenerateCancelTransaction.tsx
const generateCancelTransaction = async (args, config) => {
	return getMarketplaceClient(config).generateCancelTransaction({
		...args,
		chainId: String(args.chainId)
	}).then((data) => data.steps);
};
const useGenerateCancelTransaction = (params) => {
	const config = useConfig();
	const { mutate, mutateAsync,...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args) => generateCancelTransaction(args, config)
	});
	return {
		...result,
		generateCancelTransaction: mutate,
		generateCancelTransactionAsync: mutateAsync
	};
};

//#endregion
//#region src/react/_internal/utils.ts
function isSignatureStep(step) {
	return step.id === StepType.signEIP191 || step.id === StepType.signEIP712;
}
function isTransactionStep(step) {
	return [
		StepType.tokenApproval,
		StepType.buy,
		StepType.sell,
		StepType.cancel,
		StepType.createOffer,
		StepType.createListing
	].includes(step.id);
}
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

//#endregion
//#region src/react/hooks/transactions/useProcessStep.ts
const useProcessStep = () => {
	const { sendTransactionAsync } = useSendTransaction();
	const { signMessageAsync } = useSignMessage();
	const { signTypedDataAsync } = useSignTypedData();
	const marketplaceClient = getMarketplaceClient(useConfig());
	const processStep = async (step, chainId) => {
		if (isTransactionStep(step)) return {
			type: "transaction",
			hash: await sendTransactionAsync({
				chainId,
				to: step.to,
				data: step.data,
				value: hexToBigInt(step.value || "0x0"),
				...step.maxFeePerGas && { maxFeePerGas: hexToBigInt(step.maxFeePerGas) },
				...step.maxPriorityFeePerGas && { maxPriorityFeePerGas: hexToBigInt(step.maxPriorityFeePerGas) },
				...step.gas && { gas: hexToBigInt(step.gas) }
			})
		};
		if (isSignatureStep(step)) {
			let signature;
			if (step.id === StepType.signEIP191) signature = await signMessageAsync({ message: isHex(step.data) ? { raw: step.data } : step.data });
			else if (step.id === StepType.signEIP712) {
				if (!step.signature) throw new Error("EIP712 step missing signature data");
				signature = await signTypedDataAsync({
					domain: step.signature.domain,
					types: step.signature.types,
					primaryType: step.signature.primaryType,
					message: step.signature.value
				});
			}
			if (!signature) throw new Error("Failed to sign message");
			if (step.post) return {
				type: "signature",
				orderId: (await marketplaceClient.execute({ params: {
					chainId: String(chainId),
					signature,
					method: step.post.method,
					endpoint: step.post.endpoint,
					body: step.post.body,
					executeType: ExecuteType.order
				} })).orderId
			};
			return {
				type: "signature",
				signature
			};
		}
		throw new Error(`Unsupported step type: ${step.id}`);
	};
	return { processStep };
};

//#endregion
//#region src/react/hooks/transactions/useCancelTransactionSteps.tsx
const useCancelTransactionSteps = ({ collectionAddress, chainId, callbacks, setSteps, onSuccess, onError }) => {
	const { address } = useAccount();
	const { ensureCorrectChainAsync } = useEnsureCorrectChain();
	const sdkConfig = useConfig();
	const { generateCancelTransactionAsync } = useGenerateCancelTransaction({ chainId });
	const { processStep } = useProcessStep();
	const getCancelSteps = async ({ orderId, marketplace }) => {
		try {
			if (!address) throw new NoWalletConnectedError();
			if (!address) throw new Error("Wallet address not found");
			return await generateCancelTransactionAsync({
				chainId,
				collectionAddress,
				maker: address,
				marketplace,
				orderId
			});
		} catch (error) {
			if (callbacks?.onError) callbacks.onError(error);
			else console.debug("onError callback not provided:", error);
		}
	};
	const cancelOrder = async ({ orderId, marketplace }) => {
		const queryClient = getQueryClient();
		if (!address) throw new NoWalletConnectedError();
		try {
			await ensureCorrectChainAsync(Number(chainId));
			setSteps((prev) => ({
				...prev,
				isExecuting: true
			}));
			const cancelSteps = await getCancelSteps({
				orderId,
				marketplace
			});
			const transactionStep = cancelSteps?.find((step) => step.id === StepType.cancel);
			const signatureStep = cancelSteps?.find((step) => step.id === StepType.signEIP712);
			console.debug("transactionStep", transactionStep);
			console.debug("signatureStep", signatureStep);
			if (!transactionStep && !signatureStep) throw new Error("No transaction or signature step found");
			let hash;
			let reservoirOrderId;
			if (transactionStep) {
				const result = await processStep(transactionStep, chainId);
				if (result.type === "transaction") {
					hash = result.hash;
					await waitForTransactionReceipt({
						txHash: hash,
						chainId,
						sdkConfig
					});
					if (onSuccess && typeof onSuccess === "function") {
						onSuccess({ hash });
						updateQueriesOnCancel({
							orderId,
							queryClient
						});
					}
					setSteps((prev) => ({
						...prev,
						isExecuting: false
					}));
				}
			}
			if (signatureStep) {
				const result = await processStep(signatureStep, chainId);
				if (result.type === "signature") {
					reservoirOrderId = result.orderId;
					if (onSuccess && typeof onSuccess === "function" && reservoirOrderId) {
						onSuccess({ orderId: reservoirOrderId });
						updateQueriesOnCancel({
							orderId: reservoirOrderId,
							queryClient
						});
					}
					setSteps((prev) => ({
						...prev,
						isExecuting: false
					}));
				}
			}
		} catch (error) {
			invalidateQueriesOnCancel({ queryClient });
			setSteps((prev) => ({
				...prev,
				isExecuting: false
			}));
			if (onError && typeof onError === "function") onError(error);
		}
	};
	return { cancelOrder };
};

//#endregion
//#region src/react/hooks/transactions/useCancelOrder.tsx
const useCancelOrder = ({ collectionAddress, chainId, onSuccess, onError }) => {
	const [steps$2, setSteps] = useState({
		exist: false,
		isExecuting: false,
		execute: () => Promise.resolve()
	});
	const [cancellingOrderId, setCancellingOrderId] = useState(null);
	const [pendingFeeOptionConfirmation, confirmPendingFeeOption] = useWaasFeeOptions();
	const autoSelectOptionPromise = useAutoSelectFeeOption({
		pendingFeeOptionConfirmation: pendingFeeOptionConfirmation ? {
			id: pendingFeeOptionConfirmation.id,
			options: pendingFeeOptionConfirmation.options?.map((opt) => ({
				...opt,
				token: {
					...opt.token,
					contractAddress: opt.token.contractAddress || null,
					decimals: opt.token.decimals || 0,
					tokenID: opt.token.tokenID || null
				}
			})),
			chainId
		} : {
			id: "",
			options: void 0,
			chainId
		},
		enabled: !!pendingFeeOptionConfirmation && !!cancellingOrderId
	});
	useEffect(() => {
		autoSelectOptionPromise.then((res) => {
			if (pendingFeeOptionConfirmation?.id && res.selectedOption) confirmPendingFeeOption(pendingFeeOptionConfirmation.id, res.selectedOption.token.contractAddress);
		});
	}, [
		autoSelectOptionPromise,
		confirmPendingFeeOption,
		pendingFeeOptionConfirmation
	]);
	const { cancelOrder: cancelOrderBase } = useCancelTransactionSteps({
		collectionAddress,
		chainId,
		onSuccess: (result) => {
			setCancellingOrderId(null);
			onSuccess?.(result);
		},
		onError: (error) => {
			setCancellingOrderId(null);
			onError?.(error);
		},
		setSteps
	});
	const cancelOrder = async (params) => {
		setCancellingOrderId(params.orderId);
		return cancelOrderBase(params);
	};
	return {
		cancelOrder,
		isExecuting: steps$2.isExecuting,
		cancellingOrderId
	};
};

//#endregion
//#region src/utils/date.ts
const dateToUnixTime = (date) => Math.floor(date.getTime() / 1e3).toString();

//#endregion
//#region src/react/hooks/transactions/useGenerateListingTransaction.tsx
const generateListingTransaction = async (params, config) => {
	const args = {
		...params,
		chainId: String(params.chainId),
		listing: {
			...params.listing,
			expiry: dateToUnixTime(params.listing.expiry)
		}
	};
	return (await getMarketplaceClient(config).generateListingTransaction(args)).steps;
};
const useGenerateListingTransaction = (params) => {
	const config = useConfig();
	const { mutate, mutateAsync,...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args) => generateListingTransaction({
			...args,
			chainId: params.chainId
		}, config)
	});
	return {
		...result,
		generateListingTransaction: mutate,
		generateListingTransactionAsync: mutateAsync
	};
};

//#endregion
//#region src/react/hooks/transactions/useGenerateOfferTransaction.tsx
const generateOfferTransaction = async (params, config, walletKind) => {
	const args = {
		...params,
		chainId: String(params.chainId),
		offer: {
			...params.offer,
			expiry: dateToUnixTime(params.offer.expiry)
		},
		walletType: walletKind
	};
	return (await getMarketplaceClient(config).generateOfferTransaction(args)).steps;
};
const useGenerateOfferTransaction = (params) => {
	const config = useConfig();
	const { walletKind } = useConnectorMetadata();
	const { mutate, mutateAsync,...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args) => generateOfferTransaction({
			...args,
			chainId: params.chainId
		}, config, walletKind)
	});
	return {
		...result,
		generateOfferTransaction: mutate,
		generateOfferTransactionAsync: mutateAsync
	};
};

//#endregion
//#region src/react/hooks/transactions/useGenerateSellTransaction.tsx
const generateSellTransaction = async (args, config) => {
	const marketplaceClient = getMarketplaceClient(config);
	const argsWithStringChainId = {
		...args,
		chainId: String(args.chainId)
	};
	return marketplaceClient.generateSellTransaction(argsWithStringChainId).then((data) => data.steps);
};
const useGenerateSellTransaction = (params) => {
	const config = useConfig();
	const { mutate, mutateAsync,...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args) => generateSellTransaction({
			...args,
			chainId: params.chainId
		}, config)
	});
	return {
		...result,
		generateSellTransaction: mutate,
		generateSellTransactionAsync: mutateAsync
	};
};

//#endregion
//#region src/react/_internal/logger.ts
var TransactionLogger = class {
	constructor(context, enabled = true) {
		this.context = context;
		this.enabled = enabled;
	}
	formatData(data) {
		if (data instanceof Error) return {
			name: data.name,
			message: data.message,
			cause: data.cause instanceof Error ? this.formatData(data.cause) : data.cause,
			stack: data.stack?.split("\n").slice(0, 3)
		};
		if (Array.isArray(data)) return data.map((item) => this.formatData(item));
		if (typeof data === "object" && data !== null) return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, this.formatData(value)]));
		return data;
	}
	log(level, message, data) {
		if (!this.enabled) return;
		console[level](`[${this.context}] ${message}`, data ? this.formatData(data) : "");
	}
	debug(message, data) {
		this.log("debug", message, data);
	}
	error(message, error) {
		this.log("error", message, error);
	}
	info(message, data) {
		this.log("info", message, data);
	}
	state(from, to) {
		this.info(`State transition: ${from} -> ${to}`);
	}
};
const createLogger = (context, enabled = true) => new TransactionLogger(context, enabled);

//#endregion
//#region src/react/hooks/transactions/useOrderSteps.tsx
const useTransactionOperations = () => {
	const { sendTransactionAsync } = useSendTransaction();
	const { signMessageAsync } = useSignMessage();
	const { signTypedDataAsync } = useSignTypedData();
	const { switchChainAsync } = useSwitchChain();
	const logger = createLogger("TransactionOperations");
	const switchChain = async (chainId) => {
		logger.debug("Switching chain", { targetChainId: chainId });
		try {
			await switchChainAsync({ chainId });
			logger.info("Chain switch successful", { chainId });
		} catch (e) {
			const error = e;
			logger.error("Chain switch failed", error);
			if (error.name === "UserRejectedRequestError") throw new UserRejectedRequestError$1();
			throw new ChainSwitchError(0, chainId);
		}
	};
	const signMessage = async (stepItem) => {
		try {
			if (stepItem.id === StepType.signEIP191) {
				logger.debug("Signing with EIP-191", { data: stepItem.data });
				return await signMessageAsync({ message: isHex(stepItem.data) ? { raw: stepItem.data } : stepItem.data });
			}
			if (stepItem.id === StepType.signEIP712) {
				logger.debug("Signing with EIP-712", {
					domain: stepItem.domain,
					types: stepItem.signature?.types
				});
				return await signTypedDataAsync({
					domain: stepItem.signature.domain,
					types: stepItem.signature.types,
					primaryType: stepItem.signature.primaryType,
					message: stepItem.signature.value
				});
			}
		} catch (e) {
			const error = e;
			logger.error("Signature failed", error);
			if (error.cause instanceof BaseError) {
				if (error.cause instanceof UserRejectedRequestError) throw new UserRejectedRequestError$1();
			}
			throw new TransactionSignatureError(stepItem.id, error);
		}
	};
	const sendTransaction = async (chainId, stepItem) => {
		logger.debug("Sending transaction", {
			chainId,
			to: stepItem.to,
			value: stepItem.value
		});
		try {
			return await sendTransactionAsync({
				chainId,
				to: stepItem.to,
				data: stepItem.data,
				value: hexToBigInt(stepItem.value || "0x0"),
				...stepItem.maxFeePerGas && { maxFeePerGas: hexToBigInt(stepItem.maxFeePerGas) },
				...stepItem.maxPriorityFeePerGas && { maxPriorityFeePerGas: hexToBigInt(stepItem.maxPriorityFeePerGas) },
				...stepItem.gas && { gas: hexToBigInt(stepItem.gas) }
			});
		} catch (e) {
			const error = e;
			logger.error("Transaction failed", error);
			if (error.cause instanceof BaseError) {
				if (error.cause instanceof UserRejectedRequestError) throw new UserRejectedRequestError$1();
			}
			throw new TransactionExecutionError$1(stepItem.id || "unknown", error);
		}
	};
	return {
		switchChain,
		signMessage,
		sendTransaction
	};
};
const useOrderSteps = () => {
	const { switchChain, signMessage, sendTransaction } = useTransactionOperations();
	const currentChainId = useChainId();
	const executeStep = async ({ step, chainId }) => {
		if (chainId !== currentChainId) await switchChain(chainId);
		let result;
		switch (step.id) {
			case StepType.signEIP191:
				result = await signMessage(step);
				break;
			case StepType.signEIP712:
				result = await signMessage(step);
				break;
			case StepType.buy:
			case StepType.sell:
			case StepType.tokenApproval:
			case StepType.createListing:
			case StepType.createOffer:
			case StepType.cancel:
				result = await sendTransaction(chainId, step);
				break;
			case StepType.unknown: throw new Error("Unknown step type");
			default: {
				const _exhaustiveCheck = step.id;
				console.error(_exhaustiveCheck);
			}
		}
		return result;
	};
	return { executeStep };
};

//#endregion
//#region src/react/hooks/transactions/useTransferTokens.tsx
const prepareTransferConfig = (params, accountAddress) => {
	if (params.contractType === "ERC721") return {
		abi: erc721Abi,
		address: params.collectionAddress,
		functionName: "safeTransferFrom",
		args: [
			accountAddress,
			params.receiverAddress,
			BigInt(params.tokenId)
		]
	};
	return {
		abi: ERC1155_ABI,
		address: params.collectionAddress,
		functionName: "safeTransferFrom",
		args: [
			accountAddress,
			params.receiverAddress,
			BigInt(params.tokenId),
			params.quantity,
			"0x"
		]
	};
};
const useTransferTokens = () => {
	const { address: accountAddress } = useAccount();
	const { writeContractAsync, data: hash, isPending, isError, isSuccess } = useWriteContract();
	const transferTokensAsync = async (params) => {
		if (!accountAddress) throw new NoWalletConnectedError();
		return await writeContractAsync(prepareTransferConfig(params, accountAddress));
	};
	return {
		transferTokensAsync,
		hash,
		transferring: isPending,
		transferFailed: isError,
		transferSuccess: isSuccess
	};
};

//#endregion
//#region src/react/hooks/utils/useGetReceiptFromHash.tsx
/**
* Hook to get transaction receipt from hash
*
* Provides a function to wait for a transaction receipt using a transaction hash.
* This is a wagmi-based hook for direct blockchain interaction.
*
* @returns Object containing waitForReceipt function
*
* @example
* Basic usage:
* ```typescript
* const { waitForReceipt } = useGetReceiptFromHash();
*
* // Wait for transaction receipt
* const receipt = await waitForReceipt('0x123...');
* console.log('Transaction status:', receipt.status);
* ```
*
* @example
* In transaction flow:
* ```typescript
* const { waitForReceipt } = useGetReceiptFromHash();
*
* const handleTransaction = async () => {
*   try {
*     const hash = await writeContract({ ... });
*     const receipt = await waitForReceipt(hash);
*     if (receipt.status === 'success') {
*       console.log('Transaction confirmed!');
*     }
*   } catch (error) {
*     console.error('Transaction failed:', error);
*   }
* };
* ```
*/
const useGetReceiptFromHash = () => {
	const publicClient = usePublicClient();
	return { waitForReceipt: useCallback(async (transactionHash) => {
		if (!publicClient) throw new Error("Public client not found");
		return await publicClient.waitForTransactionReceipt({ hash: transactionHash });
	}, [publicClient]) };
};

//#endregion
//#region src/react/hooks/utils/useRoyalty.tsx
/**
* Fetches royalty information for a collectible using EIP-2981 standard
*/
async function fetchRoyalty(params) {
	const { collectionAddress, collectibleId, publicClient } = params;
	if (!publicClient) throw new Error("Public client is required");
	const [recipient, percentage] = await readContract(publicClient, {
		abi: EIP2981_ABI,
		address: collectionAddress,
		functionName: "royaltyInfo",
		args: [BigInt(collectibleId), BigInt(100)]
	});
	if (recipient && percentage) return {
		percentage,
		recipient
	};
	return null;
}
function getRoyaltyQueryKey(params) {
	return ["royalty-percentage", {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		collectibleId: params.collectibleId
	}];
}
function royaltyQueryOptions(params, query) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.collectibleId && params.publicClient && (query?.enabled ?? true));
	return queryOptions({
		queryKey: getRoyaltyQueryKey(params),
		queryFn: () => fetchRoyalty(params),
		enabled,
		...query
	});
}
/**
* Hook to fetch royalty information for a collectible
*
* Reads royalty information from the blockchain using the EIP-2981 standard.
* This hook uses TanStack Query to manage the blockchain call and caching,
* similar to other data fetching hooks in the SDK.
*
* @param args - Configuration parameters
* @param args.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param args.collectionAddress - The collection contract address
* @param args.collectibleId - The token ID within the collection
* @param args.query - Optional TanStack Query configuration
*
* @returns Query result containing royalty information (percentage and recipient) or null
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useRoyalty({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '1'
* })
*
* if (data) {
*   console.log('Royalty:', data.percentage, 'Recipient:', data.recipient)
* }
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data, isLoading } = useRoyalty({
*   chainId: 1,
*   collectionAddress: '0x...',
*   collectibleId: '42',
*   query: {
*     refetchInterval: 60000,
*     enabled: hasTokenId
*   }
* })
* ```
*/
function useRoyalty(args) {
	const { chainId, collectionAddress, collectibleId, query } = args;
	return useQuery(royaltyQueryOptions({
		chainId,
		collectionAddress,
		collectibleId,
		publicClient: usePublicClient({ chainId })
	}, query));
}

//#endregion
//#region src/react/_internal/databeat/utils.ts
function flattenAnalyticsArgs(args) {
	const analyticsProps = {};
	const analyticsNums = {};
	function recurse(obj, prefix = "") {
		for (const [key, value] of Object.entries(obj)) {
			const path = prefix ? `${prefix}.${key}` : key;
			if (typeof value === "string" || typeof value === "boolean") analyticsProps[path] = value.toString();
			else if (typeof value === "number") analyticsNums[path] = value;
			else if (isPojo(value)) recurse(value, path);
		}
	}
	recurse(args);
	return {
		analyticsProps,
		analyticsNums
	};
}
function isPojo(val) {
	return typeof val === "object" && val !== null && !Array.isArray(val);
}

//#endregion
//#region src/react/ui/modals/BuyModal/store.ts
function isShopProps(props) {
	return props.cardType === "shop";
}
function isMarketProps(props) {
	return !props.cardType || props.cardType === "market";
}
const initialContext$2 = {
	isOpen: false,
	props: null,
	buyAnalyticsId: "",
	onError: (() => {}),
	onSuccess: (() => {}),
	quantity: null,
	modalState: "idle",
	paymentModalState: "idle",
	checkoutModalState: "idle"
};
const buyModalStore = createStore({
	context: { ...initialContext$2 },
	on: {
		open: (context, event) => {
			if (context.modalState !== "idle") return context;
			const buyAnalyticsId = crypto.randomUUID();
			const { analyticsProps, analyticsNums } = flattenAnalyticsArgs(event.props);
			event.analyticsFn.trackBuyModalOpened({
				props: {
					buyAnalyticsId,
					collectionAddress: event.props.collectionAddress,
					...analyticsProps
				},
				nums: {
					chainId: event.props.chainId,
					...analyticsNums
				}
			});
			return {
				...context,
				props: event.props,
				buyAnalyticsId,
				onError: event.onError ?? context.onError,
				onSuccess: event.onSuccess ?? context.onSuccess,
				isOpen: true,
				modalState: "opening"
			};
		},
		modalOpened: (context) => ({
			...context,
			modalState: "open"
		}),
		close: (context) => ({
			...context,
			isOpen: false,
			quantity: null,
			modalState: "idle",
			paymentModalState: "idle",
			checkoutModalState: "idle"
		}),
		setQuantity: (context, event) => ({
			...context,
			quantity: event.quantity
		}),
		openPaymentModal: (context) => {
			if (context.paymentModalState !== "idle") return context;
			return {
				...context,
				paymentModalState: "opening"
			};
		},
		paymentModalOpened: (context) => ({
			...context,
			paymentModalState: "open"
		}),
		paymentModalClosed: (context) => ({
			...context,
			paymentModalState: "closed"
		}),
		openCheckoutModal: (context) => {
			if (context.checkoutModalState !== "idle") return context;
			return {
				...context,
				checkoutModalState: "opening"
			};
		},
		checkoutModalOpened: (context) => ({
			...context,
			checkoutModalState: "open"
		}),
		checkoutModalClosed: (context) => ({
			...context,
			checkoutModalState: "closed"
		})
	}
});
const useIsOpen$2 = () => useSelector(buyModalStore, (state) => state.context.isOpen);
const useBuyModalProps = () => {
	const props = useSelector(buyModalStore, (state) => state.context.props);
	if (!props) throw new Error("BuyModal props not initialized. Make sure to call show() first.");
	return props;
};
const useOnError = () => useSelector(buyModalStore, (state) => state.context.onError);
const useOnSuccess = () => useSelector(buyModalStore, (state) => state.context.onSuccess);
const useQuantity = () => useSelector(buyModalStore, (state) => state.context.quantity);
const usePaymentModalState = () => useSelector(buyModalStore, (state) => state.context.paymentModalState);
const useCheckoutModalState = () => useSelector(buyModalStore, (state) => state.context.checkoutModalState);
const useBuyAnalyticsId = () => useSelector(buyModalStore, (state) => state.context.buyAnalyticsId);

//#endregion
//#region src/react/ui/modals/_internal/components/baseModal/ErrorBoundary.tsx
var ErrorBoundary = class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null
		};
	}
	resetErrorBoundary = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null
		});
	};
	static getDerivedStateFromError(error) {
		return {
			hasError: true,
			error
		};
	}
	componentDidCatch(error, errorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
		this.setState({ errorInfo });
		this.props.onError?.(error, errorInfo);
	}
	render() {
		if (this.state.hasError && this.state.error) {
			if (this.props.fallback) {
				if (this.state.errorInfo) return this.props.fallback(this.state.error, this.state.errorInfo);
				return null;
			}
			return /* @__PURE__ */ jsx("div", {
				className: this.props.className,
				"data-testid": "error-boundary",
				children: /* @__PURE__ */ jsx(SmartErrorHandler, {
					error: this.state.error,
					onAction: this.props.onAction
				})
			});
		}
		return this.props.children;
	}
};

//#endregion
//#region src/react/ui/modals/_internal/components/baseModal/ErrorModal.tsx
/**
* ErrorModal - Specialized modal for error states
*
* Improvements over the original wrapper:
* - Built on BaseModal foundation
* - Smart error handling integration
* - Optional retry functionality
* - Fallback to simple message display
*/
const ErrorModal = ({ onClose, title, chainId, error, message, onRetry, onErrorAction }) => /* @__PURE__ */ jsx(BaseModal, {
	onClose,
	title,
	chainId,
	children: /* @__PURE__ */ jsx("div", {
		className: "flex items-center justify-center p-4",
		"data-testid": "error-modal",
		children: error ? /* @__PURE__ */ jsx(SmartErrorHandler, {
			error,
			onAction: onErrorAction || (onRetry ? () => onRetry() : void 0)
		}) : /* @__PURE__ */ jsx(Text, {
			className: "font-body",
			color: "text80",
			children: message || "Error loading item details"
		})
	})
});

//#endregion
//#region src/react/ui/modals/_internal/components/baseModal/LoadingModal.tsx
const LoadingModal = ({ onClose, title, chainId, disableAnimation = true, message }) => /* @__PURE__ */ jsx(BaseModal, {
	onClose,
	title,
	chainId,
	disableAnimation,
	children: /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col items-center justify-center gap-4 p-4",
		"data-testid": "loading-modal",
		children: [/* @__PURE__ */ jsx(Spinner, { size: "lg" }), message && /* @__PURE__ */ jsx("p", {
			className: "text-center text-sm text-text-80",
			children: message
		})]
	})
});

//#endregion
//#region src/react/ui/modals/BuyModal/hooks/useCheckoutOptions.ts
const useCheckoutOptions = (input) => {
	const config = useConfig();
	const { address } = useAccount();
	const fees = useMarketPlatformFee(input !== skipToken ? {
		chainId: input.chainId,
		collectionAddress: input.collectionAddress
	} : skipToken);
	return useQuery({
		queryKey: input !== skipToken ? [
			"checkoutOptions",
			input.chainId,
			input.collectionAddress,
			input.orderId,
			input.marketplace
		] : ["checkoutOptions", "skip"],
		queryFn: address && input !== skipToken ? async () => {
			const marketplaceClient = getMarketplaceClient(config);
			const response = await marketplaceClient.checkoutOptionsMarketplace({
				chainId: String(input.chainId),
				wallet: address,
				orders: [{
					contractAddress: input.collectionAddress,
					orderId: input.orderId,
					marketplace: input.marketplace
				}],
				additionalFee: Number(fees.amount)
			});
			const order = (await marketplaceClient.getOrders({
				chainId: String(input.chainId),
				input: [{
					contractAddress: input.collectionAddress,
					orderId: input.orderId,
					marketplace: input.marketplace
				}]
			})).orders[0];
			return {
				...response.options,
				order
			};
		} : skipToken,
		enabled: !!address && input !== skipToken
	});
};

//#endregion
//#region src/react/ui/modals/BuyModal/hooks/useLoadData.ts
const useLoadData = () => {
	const props = useBuyModalProps();
	const { chainId, collectionAddress } = props;
	const isMarket = isMarketProps(props);
	const isShop = isShopProps(props);
	const collectibleId = isMarket ? props.collectibleId : void 0;
	const { address, isConnecting, isReconnecting } = useAccount();
	const walletIsLoading = isConnecting || isReconnecting;
	const { data: collection, isLoading: collectionLoading, isError: collectionError } = useCollectionMetadata({
		chainId,
		collectionAddress
	});
	const { data: collectable, isLoading: collectableLoading, isError: collectableError } = useCollectibleMetadata({
		chainId,
		collectionAddress,
		collectibleId,
		query: { enabled: !!collectibleId }
	});
	const { data: currency, isLoading: currencyLoading, isError: currencyError } = useCurrency({
		chainId,
		currencyAddress: isShop ? props.salePrice?.currencyAddress : void 0,
		query: { enabled: isShop }
	});
	const { data: marketplaceCheckoutOptions, isLoading: marketplaceCheckoutOptionsLoading, isError: isMarketplaceCheckoutOptionsError, error: marketplaceCheckoutOptionsError } = useCheckoutOptions(isMarket ? {
		chainId,
		collectionAddress,
		orderId: props.orderId,
		marketplace: props.marketplace
	} : skipToken);
	const { data: salesContractCheckoutOptions, isLoading: salesContractCheckoutOptionsLoading, isError: isSalesContractCheckoutOptionsError, error: salesContractCheckoutOptionsError } = usePrimarySaleCheckoutOptions(isShop ? {
		chainId,
		contractAddress: props.salesContractAddress,
		collectionAddress,
		items: props.items.map((item) => ({
			tokenId: item.tokenId ?? "0",
			quantity: item.quantity ?? "1"
		}))
	} : skipToken);
	const shopData = isShop ? {
		salesContractAddress: props.salesContractAddress,
		items: props.items,
		salePrice: props.salePrice,
		checkoutOptions: salesContractCheckoutOptions?.options
	} : void 0;
	return {
		collection,
		collectable,
		currency,
		order: marketplaceCheckoutOptions?.order,
		checkoutOptions: marketplaceCheckoutOptions,
		address,
		shopData,
		isLoading: collectionLoading || collectableLoading || isMarket && marketplaceCheckoutOptionsLoading || isShop && (currencyLoading || salesContractCheckoutOptionsLoading) || walletIsLoading,
		isError: collectionError || collectableError || currencyError || isMarketplaceCheckoutOptionsError || isSalesContractCheckoutOptionsError,
		error: collectionError || collectableError || currencyError || marketplaceCheckoutOptionsError || salesContractCheckoutOptionsError
	};
};

//#endregion
//#region src/utils/decode/erc20.ts
function decodeERC20Approval(calldata) {
	const decoded = decodeFunctionData({
		abi: erc20Abi,
		data: calldata
	});
	if (decoded.functionName !== "approve") throw new Error("Not an ERC20 approval transaction");
	const [spender, value] = decoded.args;
	return {
		spender,
		value
	};
}

//#endregion
//#region src/react/ui/modals/BuyModal/hooks/usePaymentModalParams.ts
const getBuyCollectableParams = async ({ chainId, collectionAddress, collectibleId, callbacks, priceCurrencyAddress, customCreditCardProviderCallback, config, address, marketplace, orderId, quantity, collectable, checkoutOptions, fee, skipNativeBalanceCheck, nativeTokenAddress, buyAnalyticsId, onRampProvider }) => {
	const { steps: steps$2 } = await getMarketplaceClient(config).generateBuyTransaction({
		chainId: String(chainId),
		collectionAddress,
		buyer: address,
		marketplace,
		ordersData: [{
			orderId,
			quantity: quantity.toString(),
			tokenId: collectibleId
		}],
		additionalFees: [fee],
		walletType: WalletKind.unknown
	});
	const buyStep = steps$2.find((step) => step.id === StepType.buy);
	const approveStep = steps$2.find((step) => step.id === StepType.tokenApproval);
	const approvedSpenderAddress = approveStep ? decodeERC20Approval(approveStep.data).spender : void 0;
	if (!buyStep) throw new Error("Buy step not found");
	const creditCardProviders = customCreditCardProviderCallback ? ["custom"] : checkoutOptions.nftCheckout || [];
	const isTransakSupported = creditCardProviders.includes("transak");
	let transakContractId;
	if (isTransakSupported) {
		const transakContractIdResponse = await getSequenceApiClient(config).checkoutOptionsGetTransakContractID({
			chainId,
			contractAddress: buyStep.to
		});
		if (transakContractIdResponse.contractId !== "") transakContractId = transakContractIdResponse.contractId;
	}
	return {
		chain: chainId,
		collectibles: [{
			tokenId: collectibleId,
			quantity: quantity.toString(),
			decimals: collectable.decimals
		}],
		currencyAddress: priceCurrencyAddress,
		price: buyStep.price,
		targetContractAddress: buyStep.to,
		approvedSpenderAddress,
		txData: buyStep.data,
		collectionAddress,
		recipientAddress: address,
		creditCardProviders,
		onSuccess: (txHash) => {
			if (txHash) callbacks?.onSuccess?.({ hash: txHash });
		},
		supplementaryAnalyticsInfo: {
			requestId: orderId,
			marketplaceKind: marketplace,
			buyAnalyticsId,
			marketplaceType: "market"
		},
		onError: callbacks?.onError,
		onClose: () => {
			getQueryClient().invalidateQueries({ predicate: (query) => !query.meta?.persistent });
			buyModalStore.send({ type: "close" });
		},
		skipNativeBalanceCheck,
		nativeTokenAddress,
		...customCreditCardProviderCallback && { customProviderCallback: () => {
			customCreditCardProviderCallback(buyStep);
			buyModalStore.send({ type: "close" });
		} },
		...transakContractId && { transakConfig: { contractId: transakContractId } },
		onRampProvider,
		successActionButtons: callbacks?.successActionButtons
	};
};
const usePaymentModalParams = (args) => {
	const { address, marketplace, collectable, checkoutOptions, priceCurrencyAddress, quantity, enabled } = args;
	const buyModalProps = useBuyModalProps();
	const { chainId, collectionAddress, skipNativeBalanceCheck, nativeTokenAddress, onRampProvider } = buyModalProps;
	const collectibleId = isMarketProps(buyModalProps) ? buyModalProps.collectibleId : "";
	const orderId = isMarketProps(buyModalProps) ? buyModalProps.orderId : "";
	const customCreditCardProviderCallback = isMarketProps(buyModalProps) ? buyModalProps.customCreditCardProviderCallback : void 0;
	const config = useConfig();
	const fee = useMarketPlatformFee(isMarketProps(buyModalProps) ? {
		chainId,
		collectionAddress
	} : skipToken);
	const onSuccess = useOnSuccess();
	const onError = useOnError();
	const buyAnalyticsId = useBuyAnalyticsId();
	return useQuery({
		queryKey: [
			"buyCollectableParams",
			buyModalProps,
			args,
			fee
		],
		queryFn: !!address && !!marketplace && !!collectable && !!checkoutOptions && !!priceCurrencyAddress && !!quantity && enabled ? () => getBuyCollectableParams({
			chainId,
			config,
			address,
			collectionAddress,
			collectibleId,
			marketplace,
			orderId,
			quantity,
			collectable,
			checkoutOptions,
			fee,
			priceCurrencyAddress,
			callbacks: {
				onSuccess,
				onError,
				successActionButtons: buyModalProps.successActionButtons
			},
			customCreditCardProviderCallback,
			skipNativeBalanceCheck,
			nativeTokenAddress,
			buyAnalyticsId,
			onRampProvider
		}) : skipToken,
		retry: false
	});
};

//#endregion
//#region src/react/ui/modals/BuyModal/components/ERC721BuyModal.tsx
const ERC721BuyModal = ({ collectable, order, address, checkoutOptions }) => {
	const quantity = useQuantity();
	useEffect(() => {
		if (!quantity) buyModalStore.send({
			type: "setQuantity",
			quantity: 1
		});
	}, [quantity]);
	const { data: paymentModalParams, isLoading: isPaymentModalParamsLoading, isError: isPaymentModalParamsError, failureReason } = usePaymentModalParams({
		address,
		quantity: quantity ?? void 0,
		marketplace: order?.marketplace,
		collectable,
		checkoutOptions,
		priceCurrencyAddress: order?.priceCurrencyAddress,
		enabled: true
	});
	if (failureReason) return /* @__PURE__ */ jsx(ErrorModal, {
		chainId: order.chainId,
		onClose: () => {
			buyModalStore.send({ type: "close" });
		},
		title: "An error occurred while purchasing",
		error: failureReason,
		message: failureReason.message,
		onRetry: () => {
			buyModalStore.send({ type: "openPaymentModal" });
		},
		onErrorAction: (error, action) => {
			console.error(error, action);
		}
	});
	if (isPaymentModalParamsLoading || !paymentModalParams) return null;
	if (isPaymentModalParamsError) throw new Error("Failed to load payment parameters for ERC721 marketplace purchase");
	return /* @__PURE__ */ jsx(PaymentModalOpener$2, { paymentModalParams });
};
const PaymentModalOpener$2 = ({ paymentModalParams }) => {
	const { openSelectPaymentModal } = useSelectPaymentModal();
	const paymentModalState = usePaymentModalState();
	useEffect(() => {
		if (paymentModalState === "idle") {
			buyModalStore.send({ type: "openPaymentModal" });
			openSelectPaymentModal(paymentModalParams);
			buyModalStore.send({ type: "paymentModalOpened" });
		}
	}, [
		paymentModalState,
		paymentModalParams,
		openSelectPaymentModal
	]);
	return null;
};

//#endregion
//#region src/types/buyModalErrors.ts
var BuyModalErrorFactory = class {
	static priceOverflow(maxSafeValue, attemptedValue, operation) {
		return {
			type: "PRICE_OVERFLOW",
			maxSafeValue,
			attemptedValue,
			operation,
			timestamp: Date.now()
		};
	}
	static priceCalculation(operation, inputs, originalError) {
		return {
			type: "PRICE_CALCULATION_ERROR",
			operation,
			inputs,
			originalError,
			timestamp: Date.now()
		};
	}
	static invalidPriceFormat(providedPrice, expectedFormat, suggestions) {
		return {
			type: "INVALID_PRICE_FORMAT",
			providedPrice,
			expectedFormat,
			suggestions,
			timestamp: Date.now()
		};
	}
	static invalidQuantity(provided, min, max, available) {
		return {
			type: "INVALID_QUANTITY",
			provided,
			min,
			max,
			available,
			timestamp: Date.now()
		};
	}
	static networkError(message, retryable, chainId, endpoint) {
		return {
			type: "NETWORK_ERROR",
			message,
			retryable,
			chainId,
			endpoint,
			timestamp: Date.now()
		};
	}
	static contractError(contractAddress, message, method, chainId, blockNumber) {
		return {
			type: "CONTRACT_ERROR",
			contractAddress,
			message,
			method,
			chainId,
			blockNumber,
			timestamp: Date.now()
		};
	}
	static checkoutError(provider, message, code, retryable = false) {
		return {
			type: "CHECKOUT_ERROR",
			provider,
			message,
			code,
			retryable,
			timestamp: Date.now()
		};
	}
	static validationError(field, message, value, constraints) {
		return {
			type: "VALIDATION_ERROR",
			field,
			message,
			value,
			constraints,
			timestamp: Date.now()
		};
	}
	static stateError(currentState, attemptedAction, message) {
		return {
			type: "STATE_ERROR",
			currentState,
			attemptedAction,
			message,
			timestamp: Date.now()
		};
	}
};

//#endregion
//#region src/react/ui/modals/BuyModal/hooks/useERC721SalePaymentParams.ts
const DEFAULT_PROOF = [toHex(0, { size: 32 })];
const encodeERC721MintData = ({ to, amount, paymentToken, price, proof = DEFAULT_PROOF }) => {
	return encodeFunctionData({
		abi: ERC721_SALE_ABI_V0,
		functionName: "mint",
		args: [
			to,
			amount,
			paymentToken,
			price * amount,
			proof
		]
	});
};
const getERC721SalePaymentParams = async ({ chainId, address, salesContractAddress, collectionAddress, price, currencyAddress, callbacks, customCreditCardProviderCallback, skipNativeBalanceCheck, nativeTokenAddress, checkoutProvider, quantity, successActionButtons, onRampProvider }) => {
	try {
		const purchaseTransactionData = encodeERC721MintData({
			to: address,
			amount: BigInt(quantity),
			paymentToken: currencyAddress,
			price,
			proof: DEFAULT_PROOF
		});
		const creditCardProviders = customCreditCardProviderCallback ? ["custom"] : checkoutProvider ? [checkoutProvider] : [];
		return {
			chain: chainId,
			collectibles: [{
				quantity: quantity.toString(),
				decimals: 0
			}],
			currencyAddress,
			price: price.toString(),
			targetContractAddress: salesContractAddress,
			txData: purchaseTransactionData,
			collectionAddress,
			recipientAddress: address,
			creditCardProviders,
			onSuccess: (txHash) => {
				if (txHash) callbacks?.onSuccess?.({ hash: txHash });
			},
			onError: callbacks?.onError,
			onClose: () => {
				getQueryClient().invalidateQueries({ predicate: (query) => !query.meta?.persistent });
				buyModalStore.send({ type: "close" });
			},
			skipNativeBalanceCheck,
			supplementaryAnalyticsInfo: { marketplaceType: "shop" },
			nativeTokenAddress,
			...customCreditCardProviderCallback && { customProviderCallback: () => {
				customCreditCardProviderCallback(price.toString());
				buyModalStore.send({ type: "close" });
			} },
			successActionButtons,
			onRampProvider
		};
	} catch (error) {
		throw BuyModalErrorFactory.priceCalculation("ERC721 payment params calculation", [price.toString(), quantity.toString()], error instanceof Error ? error.message : "Unknown error");
	}
};
const useERC721SalePaymentParams = (args) => {
	const { salesContractAddress, collectionAddress, price, currencyAddress, enabled, checkoutProvider, chainId, quantity } = args;
	const { address } = useAccount();
	const onSuccess = useOnSuccess();
	const onError = useOnError();
	const buyModalProps = useBuyModalProps();
	return useQuery({
		queryKey: ["erc721SalePaymentParams", args],
		queryFn: enabled && !!address && !!salesContractAddress && !!collectionAddress && !!price && !!currencyAddress ? () => getERC721SalePaymentParams({
			chainId,
			address,
			salesContractAddress,
			collectionAddress,
			price: BigInt(price),
			currencyAddress,
			callbacks: {
				onSuccess,
				onError
			},
			customCreditCardProviderCallback: void 0,
			skipNativeBalanceCheck: false,
			nativeTokenAddress: void 0,
			checkoutProvider,
			quantity,
			successActionButtons: buyModalProps.successActionButtons,
			onRampProvider: buyModalProps.onRampProvider
		}) : skipToken
	});
};

//#endregion
//#region src/react/ui/modals/BuyModal/components/ERC721ShopModal.tsx
const ERC721ShopModal = ({ collection, shopData, chainId }) => {
	const quantity = Number(shopData.items[0]?.quantity ?? 1);
	const { data: erc721SalePaymentParams, isLoading: isErc721PaymentParamsLoading, isError: isErc721PaymentParamsError } = useERC721SalePaymentParams({
		salesContractAddress: shopData.salesContractAddress,
		collectionAddress: collection.address,
		price: shopData.salePrice?.amount || "0",
		currencyAddress: shopData.salePrice?.currencyAddress || "",
		enabled: true,
		chainId,
		quantity
	});
	if (isErc721PaymentParamsLoading || !erc721SalePaymentParams) return null;
	if (isErc721PaymentParamsError) throw BuyModalErrorFactory.contractError(shopData.salesContractAddress, "Failed to load ERC721 sale parameters");
	return /* @__PURE__ */ jsx(PaymentModalOpener$1, { paymentModalParams: erc721SalePaymentParams });
};
const PaymentModalOpener$1 = ({ paymentModalParams }) => {
	const { openSelectPaymentModal } = useSelectPaymentModal();
	const paymentModalState = usePaymentModalState();
	const totalPrice = BigInt(paymentModalParams.price) * BigInt(paymentModalParams.collectibles[0].quantity);
	useEffect(() => {
		if (paymentModalState === "idle") {
			buyModalStore.send({ type: "openPaymentModal" });
			openSelectPaymentModal({
				...paymentModalParams,
				price: String(totalPrice)
			});
			buyModalStore.send({ type: "paymentModalOpened" });
		}
	}, [
		paymentModalState,
		paymentModalParams,
		openSelectPaymentModal,
		totalPrice
	]);
	return null;
};

//#endregion
//#region src/react/ui/modals/_internal/components/quantityInput/index.tsx
function QuantityInput({ quantity, invalidQuantity, onQuantityChange, onInvalidQuantityChange, decimals, maxQuantity, className, disabled }) {
	const dnMaxQuantity = dn.from(maxQuantity, decimals);
	const minIncrement = decimals > 0 ? `0.${"1".padStart(decimals, "0")}` : "1";
	const dnIncrement = dn.from(minIncrement, decimals);
	const min = decimals > 0 ? minIncrement : "0";
	const dnMin = dn.from(min, decimals);
	const [dnQuantity, setDnQuantity] = useState(dn.from(quantity, decimals));
	const [localQuantity, setLocalQuantity] = useState(quantity);
	useEffect(() => {
		const dnInitialQuantity = dn.from(quantity, decimals);
		const dnMaxQuantity$1 = dn.from(maxQuantity, decimals);
		if (dn.greaterThan(dnInitialQuantity, dnMaxQuantity$1)) {
			const validQuantity = dn.toString(dnMaxQuantity$1, decimals);
			setLocalQuantity(validQuantity);
			setDnQuantity(dnMaxQuantity$1);
			onQuantityChange(validQuantity);
			onInvalidQuantityChange(false);
		} else {
			setLocalQuantity(quantity);
			setDnQuantity(dnInitialQuantity);
		}
	}, [
		quantity,
		decimals,
		maxQuantity,
		onQuantityChange,
		onInvalidQuantityChange
	]);
	const setQuantity = ({ value, isValid }) => {
		setLocalQuantity(value);
		if (isValid) {
			onQuantityChange(value);
			setDnQuantity(dn.from(value, decimals));
			onInvalidQuantityChange(false);
		} else onInvalidQuantityChange(true);
	};
	function handleChangeQuantity(value) {
		if (!value || Number.isNaN(Number(value)) || value.endsWith(".")) {
			setQuantity({
				value,
				isValid: false
			});
			return;
		}
		const dnValue = dn.from(value, decimals);
		const isBiggerThanMax = dn.greaterThan(dnValue, dnMaxQuantity);
		if (dn.lessThan(dnValue, dnMin)) {
			setQuantity({
				value,
				isValid: false
			});
			return;
		}
		if (isBiggerThanMax) {
			setQuantity({
				value: maxQuantity,
				isValid: true
			});
			return;
		}
		setQuantity({
			value: dn.toString(dnValue, decimals),
			isValid: true
		});
	}
	function handleIncrement() {
		const newValue = dn.add(dnQuantity, dnIncrement);
		if (dn.greaterThanOrEqual(newValue, dnMaxQuantity)) setQuantity({
			value: dn.toString(dnMaxQuantity, decimals),
			isValid: true
		});
		else setQuantity({
			value: dn.toString(newValue, decimals),
			isValid: true
		});
	}
	function handleDecrement() {
		const newValue = dn.subtract(dnQuantity, dnIncrement);
		if (dn.lessThanOrEqual(newValue, dnMin)) setQuantity({
			value: dn.toString(dnMin, decimals),
			isValid: true
		});
		else setQuantity({
			value: dn.toString(newValue, decimals),
			isValid: true
		});
	}
	return /* @__PURE__ */ jsxs("div", {
		className: cn$1("flex w-full flex-col", className, disabled && "pointer-events-none opacity-50"),
		children: [/* @__PURE__ */ jsxs(Field, { children: [/* @__PURE__ */ jsx(FieldLabel, {
			htmlFor: "quantity",
			className: "text-xs",
			children: "Enter quantity"
		}), /* @__PURE__ */ jsx(NumericInput, {
			"aria-label": "Enter quantity",
			className: "h-9 w-full rounded pr-0 [&>div]:pr-2 [&>input]:text-xs",
			name: "quantity",
			decimals: decimals || 0,
			controls: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ jsx(IconButton, {
					disabled: dn.lessThanOrEqual(dnQuantity, dnMin),
					onClick: handleDecrement,
					size: "xs",
					icon: SubtractIcon
				}), /* @__PURE__ */ jsx(IconButton, {
					disabled: dn.greaterThanOrEqual(dnQuantity, dnMaxQuantity),
					onClick: handleIncrement,
					size: "xs",
					icon: AddIcon
				})]
			}),
			value: localQuantity,
			onChange: (e) => handleChangeQuantity(e.target.value),
			width: "full"
		})] }), invalidQuantity && /* @__PURE__ */ jsx("div", {
			className: "mt-1.5 font-medium text-amber-500 text-xs",
			children: "Invalid quantity"
		})]
	});
}

//#endregion
//#region src/react/ui/modals/BuyModal/components/ERC1155QuantityModal.tsx
const INFINITY_STRING = maxUint256.toString();
const ERC1155QuantityModal = ({ order, quantityDecimals, quantityRemaining, unlimitedSupply, salePrice, chainId, cardType }) => {
	const [localQuantity, setLocalQuantity] = useState(quantityDecimals > 0 ? `0.${"1".padStart(quantityDecimals, "0")}` : "1");
	const [invalidQuantity, setInvalidQuantity] = useState(false);
	const maxQuantity = unlimitedSupply ? INFINITY_STRING : quantityDecimals > 0 ? (Number(quantityRemaining) / 10 ** quantityDecimals).toString() : quantityRemaining;
	const currencyQuery = useCurrency({
		chainId,
		currencyAddress: order ? order.priceCurrencyAddress : salePrice?.currencyAddress
	});
	const marketplaceConfigQuery = useMarketplaceConfig();
	const handleBuyNow = () => {
		const quantityWithDecimals = parseUnits(localQuantity, quantityDecimals).toString();
		buyModalStore.send({
			type: "setQuantity",
			quantity: Number(quantityWithDecimals)
		});
	};
	return /* @__PURE__ */ jsx(ActionModal, {
		type: "buy",
		chainId,
		onClose: () => buyModalStore.send({ type: "close" }),
		title: "Select Quantity",
		disableAnimation: true,
		primaryAction: {
			label: "Buy now",
			onClick: handleBuyNow,
			disabled: invalidQuantity
		},
		queries: {
			currency: currencyQuery,
			marketplaceConfig: marketplaceConfigQuery
		},
		children: ({ currency, marketplaceConfig }) => /* @__PURE__ */ jsxs("div", {
			className: "flex w-full flex-col gap-4",
			children: [/* @__PURE__ */ jsx(QuantityInput, {
				quantity: localQuantity,
				invalidQuantity,
				onQuantityChange: setLocalQuantity,
				onInvalidQuantityChange: setInvalidQuantity,
				decimals: quantityDecimals,
				maxQuantity
			}), /* @__PURE__ */ jsx(TotalPrice, {
				order,
				quantityStr: localQuantity,
				salePrice,
				chainId,
				cardType,
				quantityDecimals,
				currency,
				marketplaceConfig
			})]
		})
	});
};
const TotalPrice = ({ order, quantityStr, salePrice, chainId, cardType, quantityDecimals, currency, marketplaceConfig }) => {
	const isShop = cardType === "shop";
	const isMarket = cardType === "market";
	let error = null;
	let formattedPrice = "0";
	const quantityForCalculation = parseUnits(quantityStr, quantityDecimals);
	if (isMarket && currency && order) try {
		const marketplaceFeePercentage = (marketplaceConfig?.market?.collections?.find((col) => col.itemsAddress.toLowerCase() === order.collectionContractAddress.toLowerCase() && col.chainId === chainId))?.feePercentage ?? DEFAULT_MARKETPLACE_FEE_PERCENTAGE;
		formattedPrice = formatPriceWithFee(BigInt(order ? order.priceAmount : "0") * quantityForCalculation, currency.decimals, marketplaceFeePercentage);
	} catch (e) {
		console.error("Error formatting price", e);
		error = "Unable to calculate total price";
	}
	if (isShop && salePrice && currency) formattedPrice = formatPriceWithFee(BigInt(salePrice.amount) * quantityForCalculation, currency.decimals, 0);
	return error ? /* @__PURE__ */ jsx(Text, {
		className: "font-body font-medium text-xs",
		color: "text50",
		children: error
	}) : /* @__PURE__ */ jsxs("div", {
		className: "flex justify-between",
		children: [/* @__PURE__ */ jsx(Text, {
			className: "font-body font-medium text-xs",
			color: "text50",
			children: "Total Price"
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-0.5",
			children: [
				currency?.imageUrl && /* @__PURE__ */ jsx(TokenImage, {
					src: currency.imageUrl,
					size: "xs"
				}),
				/* @__PURE__ */ jsx(Text, {
					className: "font-body font-bold text-text-100 text-xs",
					children: formattedPrice
				}),
				/* @__PURE__ */ jsx(Text, {
					className: "font-body font-bold text-text-80 text-xs",
					children: currency?.symbol
				})
			]
		})]
	});
};

//#endregion
//#region src/react/ui/modals/BuyModal/components/ERC1155BuyModal.tsx
const ERC1155BuyModal = ({ collectable, order, address, checkoutOptions, chainId }) => {
	const quantity = useQuantity();
	const modalProps = useBuyModalProps();
	const cardType = modalProps.cardType || "market";
	const isShop = isShopProps(modalProps);
	const quantityDecimals = isShop ? modalProps.quantityDecimals : collectable.decimals || 0;
	const quantityRemaining = isShop ? modalProps.quantityRemaining?.toString() : order?.quantityRemaining;
	const unlimitedSupply = isShop ? modalProps.unlimitedSupply : false;
	useEffect(() => {
		if (modalProps.hideQuantitySelector && !quantity) {
			const minQuantity = quantityDecimals > 0 ? 10 ** quantityDecimals : 1;
			const autoQuantity = unlimitedSupply ? minQuantity : Math.min(Number(quantityRemaining), minQuantity);
			buyModalStore.send({
				type: "setQuantity",
				quantity: autoQuantity
			});
		}
	}, [
		modalProps.hideQuantitySelector,
		quantity,
		quantityDecimals,
		unlimitedSupply,
		quantityRemaining
	]);
	if (!quantity && !modalProps.hideQuantitySelector) return /* @__PURE__ */ jsx(ERC1155QuantityModal, {
		order,
		cardType,
		quantityDecimals,
		quantityRemaining,
		unlimitedSupply,
		chainId
	});
	if (!checkoutOptions || !quantity) return null;
	return /* @__PURE__ */ jsx(Modal$3, {
		address,
		quantity,
		order,
		collectable,
		checkoutOptions
	});
};
const Modal$3 = ({ address, quantity, order, collectable, checkoutOptions }) => {
	const { data: paymentModalParams, isLoading: isPaymentModalParamsLoading, isError: isPaymentModalParamsError, failureReason } = usePaymentModalParams({
		address,
		quantity,
		marketplace: order?.marketplace,
		collectable,
		checkoutOptions,
		priceCurrencyAddress: order?.priceCurrencyAddress,
		enabled: true
	});
	if (failureReason) return /* @__PURE__ */ jsx(ErrorModal, {
		chainId: order.chainId,
		onClose: () => buyModalStore.send({ type: "close" }),
		title: "An error occurred while purchasing",
		error: failureReason,
		message: failureReason.message,
		onRetry: () => {
			buyModalStore.send({ type: "openPaymentModal" });
		},
		onErrorAction: (error, action) => {
			console.error(error, action);
		}
	});
	if (isPaymentModalParamsLoading || !paymentModalParams) return /* @__PURE__ */ jsx(LoadingModal, {
		chainId: order.chainId,
		onClose: () => buyModalStore.send({ type: "close" }),
		title: "Loading checkout",
		message: "Loading checkout"
	});
	if (isPaymentModalParamsError) throw new Error("Failed to load payment parameters for ERC1155 marketplace purchase");
	return /* @__PURE__ */ jsx(PaymentModalOpener, { paymentModalParams });
};
const PaymentModalOpener = ({ paymentModalParams }) => {
	const { openSelectPaymentModal } = useSelectPaymentModal();
	const paymentModalState = usePaymentModalState();
	useEffect(() => {
		if (paymentModalState === "idle") {
			buyModalStore.send({ type: "openPaymentModal" });
			openSelectPaymentModal(paymentModalParams);
			buyModalStore.send({ type: "paymentModalOpened" });
		}
	}, [
		paymentModalState,
		paymentModalParams,
		openSelectPaymentModal
	]);
	return null;
};

//#endregion
//#region src/react/ui/modals/BuyModal/hooks/useERC1155Checkout.ts
const useERC1155Checkout = ({ chainId, salesContractAddress, collectionAddress, items, checkoutOptions, customProviderCallback, enabled = true }) => {
	const { address: accountAddress } = useAccount();
	const quantity = useQuantity();
	const onSuccess = useOnSuccess();
	const onError = useOnError();
	const saleAnalyticsId = useBuyAnalyticsId();
	const buyModalProps = useBuyModalProps();
	return {
		...useERC1155SaleContractCheckout({
			chain: chainId,
			contractAddress: salesContractAddress,
			collectionAddress,
			items: [{
				...items[0],
				quantity: quantity?.toString() || "1"
			}],
			wallet: accountAddress ?? "",
			...checkoutOptions && { checkoutOptions },
			onSuccess: (txHash) => {
				if (txHash) onSuccess({ hash: txHash });
			},
			onError: (error) => {
				onError(error);
			},
			onClose: () => {
				const queryClient = getQueryClient();
				queryClient.invalidateQueries({ queryKey: ["inventory", "inventory"] });
				queryClient.invalidateQueries({
					queryKey: ["token", "balances"],
					refetchType: "inactive"
				});
				queryClient.invalidateQueries({ queryKey: ["collectible", "primary-sale-list"] });
				buyModalStore.send({ type: "close" });
			},
			customProviderCallback,
			supplementaryAnalyticsInfo: {
				marketplaceType: "shop",
				saleAnalyticsId
			},
			successActionButtons: buyModalProps.successActionButtons,
			...buyModalProps.onRampProvider && { onRampProvider: buyModalProps.onRampProvider }
		}),
		isEnabled: Boolean(enabled && accountAddress)
	};
};

//#endregion
//#region src/react/ui/modals/BuyModal/components/ERC1155ShopModal.tsx
const ERC1155ShopModal = ({ collection, shopData, chainId }) => {
	const quantity = useQuantity();
	const modalProps = useBuyModalProps();
	const isShop = isShopProps(modalProps);
	const quantityDecimals = isShop && modalProps.quantityDecimals ? modalProps.quantityDecimals : 0;
	const quantityRemaining = isShop && modalProps.quantityRemaining ? modalProps.quantityRemaining.toString() : "0";
	const unlimitedSupply = isShop && modalProps.unlimitedSupply ? modalProps.unlimitedSupply : false;
	if (!quantity) return /* @__PURE__ */ jsx(ERC1155QuantityModal, {
		salePrice: {
			amount: shopData.salePrice?.amount ?? "0",
			currencyAddress: shopData.salePrice?.currencyAddress ?? zeroAddress
		},
		cardType: "shop",
		quantityDecimals,
		quantityRemaining,
		unlimitedSupply,
		chainId
	});
	return /* @__PURE__ */ jsx(ERC1155SaleContractCheckoutModalOpener, {
		chainId,
		salesContractAddress: shopData.salesContractAddress,
		collectionAddress: collection.address,
		items: shopData.items.map((item) => ({
			...item,
			tokenId: item.tokenId ?? "0",
			quantity: quantity.toString() ?? "1"
		})),
		checkoutOptions: shopData.checkoutOptions,
		enabled: !!shopData.salesContractAddress && !!shopData.items
	});
};
const ERC1155SaleContractCheckoutModalOpener = ({ chainId, salesContractAddress, collectionAddress, items, checkoutOptions, enabled, customProviderCallback }) => {
	const checkoutModalState = useCheckoutModalState();
	const { openCheckoutModal, isLoading, isError, isEnabled } = useERC1155Checkout({
		chainId,
		salesContractAddress,
		collectionAddress,
		items,
		checkoutOptions,
		customProviderCallback,
		enabled
	});
	useEffect(() => {
		if (checkoutModalState === "idle" && isEnabled && !isLoading && !isError) {
			buyModalStore.send({ type: "openCheckoutModal" });
			openCheckoutModal();
			buyModalStore.send({ type: "checkoutModalOpened" });
		}
	}, [
		checkoutModalState,
		isLoading,
		isError,
		isEnabled,
		openCheckoutModal
	]);
	if (isLoading) return /* @__PURE__ */ jsx(LoadingModal, {
		chainId,
		onClose: () => buyModalStore.send({ type: "close" }),
		title: "Loading payment options",
		message: "Please wait while we prepare your checkout"
	});
	return null;
};

//#endregion
//#region src/react/ui/modals/BuyModal/components/BuyModalRouter.tsx
const BuyModalRouter = () => {
	const modalProps = useBuyModalProps();
	const chainId = modalProps.chainId;
	const isShop = isShopProps(modalProps);
	const onError = useOnError();
	const { collection, collectable, address, isLoading, order, checkoutOptions, currency, shopData, isError, error } = useLoadData();
	if (isError && error instanceof Error) return /* @__PURE__ */ jsx(ErrorModal, {
		chainId,
		onClose: () => buyModalStore.send({ type: "close" }),
		title: "Loading Error",
		error,
		message: error.message,
		onRetry: () => {
			buyModalStore.send({ type: "close" });
		},
		onErrorAction: (error$1, action) => {
			console.error(error$1, action);
		}
	});
	if (isLoading || !collection) return /* @__PURE__ */ jsx(LoadingModal, {
		chainId,
		onClose: () => buyModalStore.send({ type: "close" }),
		title: "Loading payment options",
		message: "Please wait while we load the available payment methods"
	});
	if (isShop) {
		if (collection.type === "ERC721") {
			if (!shopData || !currency) return /* @__PURE__ */ jsx(LoadingModal, {
				chainId,
				onClose: () => buyModalStore.send({ type: "close" }),
				title: "Loading payment options",
				message: "Please wait while we load the available payment methods"
			});
			return /* @__PURE__ */ jsx(ERC721ShopModal, {
				collection,
				shopData,
				chainId
			});
		}
		if (collection.type === "ERC1155") {
			if (!shopData || !currency) return /* @__PURE__ */ jsx(LoadingModal, {
				chainId,
				onClose: () => buyModalStore.send({ type: "close" }),
				title: "Loading payment options",
				message: "Please wait while we load the available payment methods"
			});
			return /* @__PURE__ */ jsx(ERC1155ShopModal, {
				collection,
				shopData,
				chainId
			});
		}
	} else {
		if (collection.type === "ERC721") {
			if (!collectable || !order || !address || !checkoutOptions) return /* @__PURE__ */ jsx(LoadingModal, {
				chainId,
				onClose: () => buyModalStore.send({ type: "close" }),
				title: "Loading payment options",
				message: "Please wait while we load the available payment methods"
			});
			return /* @__PURE__ */ jsx(ERC721BuyModal, {
				collection,
				collectable,
				order,
				address,
				checkoutOptions,
				chainId
			});
		}
		if (collection.type === "ERC1155") {
			if (!collectable || !order || !address || !checkoutOptions) return /* @__PURE__ */ jsx(LoadingModal, {
				chainId,
				onClose: () => buyModalStore.send({ type: "close" }),
				title: "Loading payment options",
				message: "Please wait while we load the available payment methods"
			});
			return /* @__PURE__ */ jsx(ERC1155BuyModal, {
				collection,
				collectable,
				order,
				address,
				checkoutOptions,
				chainId
			});
		}
	}
	onError(/* @__PURE__ */ new Error(`Unsupported configuration: ${collection.type} in ${isShop ? "shop" : "market"} mode`));
	return /* @__PURE__ */ jsx(ErrorModal, {
		chainId,
		onClose: () => buyModalStore.send({ type: "close" }),
		title: "Unsupported Configuration",
		error: /* @__PURE__ */ new Error("Unsupported configuration"),
		message: "Unsupported configuration",
		onRetry: () => {
			buyModalStore.send({ type: "close" });
		},
		onErrorAction: (error$1, action) => {
			console.error(error$1, action);
		}
	});
};

//#endregion
//#region src/react/ui/modals/BuyModal/components/Modal.tsx
const BuyModal = () => {
	if (!useIsOpen$2()) return null;
	return /* @__PURE__ */ jsx(BuyModalRouter, {});
};

//#endregion
//#region src/react/ui/modals/_internal/components/calendar/index.tsx
function Calendar({ ...props }) {
	const { selectedDate, setSelectedDate } = props;
	return /* @__PURE__ */ jsx(DayPicker, {
		disabled: { before: /* @__PURE__ */ new Date() },
		selected: selectedDate,
		onDayClick: setSelectedDate,
		defaultMonth: selectedDate,
		modifiersStyles: { selected: {
			color: "hsl(var(--foreground))",
			background: "hsl(var(--primary))",
			border: "none"
		} },
		styles: {
			root: {
				width: "max-content",
				margin: 0,
				color: "hsl(var(--foreground))",
				background: "hsl(var(--background))",
				border: "1px solid hsl(var(--border))",
				borderRadius: "var(--radius)",
				padding: "0.5rem",
				position: "relative"
			},
			day: {
				margin: 0,
				width: "1rem",
				height: "1rem"
			},
			day_button: {
				margin: 0,
				width: "1.8rem",
				height: "1.5rem",
				padding: 0,
				border: "none"
			}
		},
		...props
	});
}
Calendar.displayName = "Calendar";
var calendar_default = Calendar;

//#endregion
//#region src/react/ui/modals/_internal/components/calendarDropdown/TimeSelector.tsx
function TimeSelector({ selectedDate, onTimeChange }) {
	const minutesRef = useRef(null);
	const [draft, setDraft] = useState(null);
	const currentHours = getHours(selectedDate);
	const currentMinutes = getMinutes(selectedDate);
	const commitChange = () => {
		if (!draft) return;
		const now = /* @__PURE__ */ new Date();
		const parse = (val, fallback) => {
			const n = Number.parseInt(val, 10);
			return Number.isNaN(n) ? fallback : n;
		};
		let h = clamp(parse(draft.hours, currentHours), 0, 23);
		let m = clamp(parse(draft.minutes, currentMinutes), 0, 59);
		if (setMinutes(setHours(selectedDate, h), m) < now) {
			h = getHours(now);
			m = getMinutes(now);
		}
		onTimeChange(h, m);
		setDraft(null);
	};
	const handleKeyDown = (e, field) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (field === "hours") minutesRef.current?.focus();
			else commitChange();
		} else if (e.key === "Escape") {
			e.preventDefault();
			setDraft(null);
			e.currentTarget.blur();
		}
	};
	const hours = draft?.hours ?? currentHours.toString().padStart(2, "0");
	const minutes = draft?.minutes ?? currentMinutes.toString().padStart(2, "0");
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-3 flex items-center gap-6 border-border-base border-t pt-3",
		children: [/* @__PURE__ */ jsx(TimeIcon, {
			color: "white",
			size: "xs"
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-1 items-center justify-between gap-2",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "w-16 [&>label]:w-16",
					children: /* @__PURE__ */ jsx(NumericInput, {
						className: "h-9 [&>input]:text-xs",
						name: "hours",
						value: hours,
						onChange: (e) => setDraft({
							hours: e.target.value,
							minutes
						}),
						onBlur: commitChange,
						onKeyDown: (e) => handleKeyDown(e, "hours"),
						min: 0,
						max: 23,
						tabIndex: 0
					})
				}),
				/* @__PURE__ */ jsx(Text, {
					className: "font-medium text-sm text-text-80",
					children: ":"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "w-16 [&>label]:w-16",
					children: /* @__PURE__ */ jsx(NumericInput, {
						ref: minutesRef,
						className: "h-9 [&>input]:text-xs",
						name: "minutes",
						value: minutes,
						onChange: (e) => setDraft({
							hours,
							minutes: e.target.value
						}),
						onBlur: commitChange,
						onKeyDown: (e) => handleKeyDown(e, "minutes"),
						min: 0,
						max: 59,
						tabIndex: 0
					})
				})
			]
		})]
	});
}

//#endregion
//#region src/react/ui/modals/_internal/components/calendarDropdown/index.tsx
/**
* Determines if the selected date matches a preset range
*/
function getMatchingPreset(selectedDate) {
	const today = startOfDay(/* @__PURE__ */ new Date());
	const selectedDay = startOfDay(selectedDate);
	const daysDifference = differenceInDays(selectedDay, today);
	if (isSameDay(selectedDay, today)) return PRESET_RANGES.TODAY.value;
	if (daysDifference === 1) return PRESET_RANGES.TOMORROW.value;
	if (daysDifference === 3) return PRESET_RANGES.IN_3_DAYS.value;
	if (daysDifference === 7) return PRESET_RANGES.ONE_WEEK.value;
	if (daysDifference === 30) return PRESET_RANGES.ONE_MONTH.value;
	return null;
}
function CalendarDropdown({ selectedDate, setSelectedDate, onSelectPreset, isOpen, setIsOpen }) {
	const matchingPreset = getMatchingPreset(selectedDate);
	const handleTimeChange = (hours, minutes) => {
		const newDate = new Date(selectedDate);
		newDate.setHours(hours, minutes, 0, 0);
		setSelectedDate(newDate);
	};
	return /* @__PURE__ */ jsxs(DropdownMenu, {
		open: isOpen,
		onOpenChange: setIsOpen,
		children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsxs(Button, {
				className: "h-9 flex-1 rounded-sm p-2 font-medium text-xs",
				variant: "outline",
				shape: "square",
				onClick: () => setIsOpen(!isOpen),
				children: [/* @__PURE__ */ jsx(CalendarIcon, { size: "xs" }), format(selectedDate, "yyyy/MM/dd HH:mm")]
			})
		}), /* @__PURE__ */ jsx(DropdownMenuPortal, { children: /* @__PURE__ */ jsx(DropdownMenuContent, {
			className: "pointer-events-auto z-20 w-full rounded-xl border border-border-base bg-surface-neutral p-3",
			sideOffset: 5,
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex gap-8",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex flex-col",
					children: Object.values(PRESET_RANGES).map((preset) => {
						return /* @__PURE__ */ jsx(Button, {
							onClick: () => {
								onSelectPreset(preset.value);
								setIsOpen(false);
							},
							variant: "text",
							className: `w-full justify-start py-1.5 font-bold text-xs transition-colors ${matchingPreset === preset.value ? "text-text-100" : "text-text-50 hover:text-text-80"}`,
							tabIndex: 0,
							children: preset.label
						}, preset.value);
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col",
					children: [/* @__PURE__ */ jsx(calendar_default, {
						selectedDate,
						setSelectedDate: (date) => {
							const newDate = new Date(date);
							const today = startOfDay(/* @__PURE__ */ new Date());
							if (isSameDay(startOfDay(newDate), today)) setSelectedDate(endOfDay(newDate));
							else {
								newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
								setSelectedDate(newDate);
							}
						},
						mode: "single"
					}), /* @__PURE__ */ jsx(TimeSelector, {
						selectedDate,
						onTimeChange: handleTimeChange
					})]
				})]
			})
		}) })]
	});
}

//#endregion
//#region src/react/ui/modals/_internal/components/expirationDateSelect/index.tsx
const PRESET_RANGES = {
	TODAY: {
		label: "Today",
		value: "today",
		offset: 0
	},
	TOMORROW: {
		label: "Tomorrow",
		value: "tomorrow",
		offset: 1
	},
	IN_3_DAYS: {
		label: "In 3 days",
		value: "3_days",
		offset: 3
	},
	ONE_WEEK: {
		label: "1 week",
		value: "1_week",
		offset: 7
	},
	ONE_MONTH: {
		label: "1 month",
		value: "1_month",
		offset: 30
	}
};
const ExpirationDateSelect = function ExpirationDateSelect$1({ className, date, onDateChange, disabled }) {
	const [calendarDropdownOpen, setCalendarDropdownOpen] = useState(false);
	function handleSelectPresetRange(range) {
		const presetRange = Object.values(PRESET_RANGES).find((preset) => preset.value === range);
		if (!presetRange) return;
		const baseDate = /* @__PURE__ */ new Date();
		const targetDate = presetRange.value === "today" ? baseDate : addDays(baseDate, presetRange.offset);
		onDateChange(presetRange.value === "today" ? endOfDay(targetDate) : (() => {
			const preservedTimeDate = new Date(targetDate);
			preservedTimeDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
			return preservedTimeDate;
		})());
	}
	function handleDateValueChange(date$1) {
		onDateChange(date$1);
	}
	if (!date) return /* @__PURE__ */ jsx(Skeleton, { className: "mr-3 h-7 w-20 rounded-2xl" });
	return /* @__PURE__ */ jsxs("div", {
		className: cn$1("relative w-full", disabled && "pointer-events-none opacity-50"),
		children: [/* @__PURE__ */ jsx(Text, {
			className: "w-full text-left font-body font-medium text-xs",
			fontWeight: "medium",
			color: "text100",
			children: "Set expiry"
		}), /* @__PURE__ */ jsx("div", {
			className: `${className} flex w-full items-center gap-2 rounded-sm bg-zinc-950`,
			children: /* @__PURE__ */ jsx(CalendarDropdown, {
				selectedDate: date,
				setSelectedDate: handleDateValueChange,
				onSelectPreset: handleSelectPresetRange,
				isOpen: calendarDropdownOpen,
				setIsOpen: setCalendarDropdownOpen
			})
		})]
	});
};
var expirationDateSelect_default = ExpirationDateSelect;

//#endregion
//#region src/react/ui/modals/_internal/components/floorPriceText/index.tsx
function FloorPriceText({ chainId, collectionAddress, tokenId, price, onBuyNow }) {
	const { data: listing, isLoading: listingLoading } = useCollectibleMarketLowestListing({
		tokenId,
		chainId,
		collectionAddress,
		filter: { currencies: [price.currency.contractAddress] }
	});
	const floorPriceRaw = listing?.priceAmount;
	const floorPriceFormatted = listing?.priceAmountFormatted;
	const { data: priceComparison, isLoading: comparisonLoading } = useCurrencyComparePrices({
		chainId,
		priceAmountRaw: price.amountRaw || "0",
		priceCurrencyAddress: price.currency.contractAddress,
		compareToPriceAmountRaw: floorPriceRaw || "0",
		compareToPriceCurrencyAddress: listing?.priceCurrencyAddress || price.currency.contractAddress,
		query: { enabled: !!floorPriceRaw && !listingLoading && price.amountRaw !== "0" }
	});
	if (!floorPriceRaw || listingLoading || price.amountRaw === "0" || comparisonLoading) return null;
	let floorPriceDifferenceText = "Same as floor price";
	let showBuyNowButton = false;
	if (priceComparison) if (priceComparison.status === "same") {
		floorPriceDifferenceText = "Same as floor price";
		showBuyNowButton = true;
	} else if (priceComparison.status === "below") floorPriceDifferenceText = `${priceComparison.percentageDifferenceFormatted}% below floor price`;
	else {
		floorPriceDifferenceText = `${priceComparison.percentageDifferenceFormatted}% above floor price`;
		showBuyNowButton = true;
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "flex w-full items-center justify-between gap-2",
		children: [/* @__PURE__ */ jsx(Text, {
			className: "text-left font-body font-medium text-muted text-xs",
			children: floorPriceDifferenceText
		}), showBuyNowButton && onBuyNow && /* @__PURE__ */ jsxs(Button, {
			size: "xs",
			variant: "text",
			className: "text-indigo-400 text-xs",
			onClick: onBuyNow,
			children: [
				"Buy for ",
				floorPriceFormatted,
				" ",
				price.currency.symbol
			]
		})]
	});
}

//#endregion
//#region src/react/ui/modals/_internal/components/currencyImage/index.tsx
function CurrencyImage({ price }) {
	const [imageLoadErrorCurrencyAddresses, setImageLoadErrorCurrencyAddresses] = useState(null);
	if (!price?.currency) return /* @__PURE__ */ jsx("div", { className: "h-3 w-3 rounded-full bg-background-secondary" });
	if (imageLoadErrorCurrencyAddresses?.includes(price.currency.contractAddress)) return /* @__PURE__ */ jsx("div", { className: "h-3 w-3 rounded-full bg-background-secondary" });
	return /* @__PURE__ */ jsx(TokenImage, {
		src: price.currency.imageUrl,
		onError: () => {
			if (price) setImageLoadErrorCurrencyAddresses((prev) => {
				if (!prev) return [price.currency.contractAddress];
				if (!prev.includes(price.currency.contractAddress)) return [...prev, price.currency.contractAddress];
				return prev;
			});
		},
		size: "xs"
	});
}
var currencyImage_default = CurrencyImage;

//#endregion
//#region src/react/ui/components/_internals/custom-select/CustomSelect.tsx
const CustomSelect = ({ items, onValueChange, defaultValue, placeholder = "Select an option", disabled = false, className, testId = "custom-select" }) => {
	const [selectedItem, setSelectedItem] = useState(defaultValue);
	const handleValueChange = (item) => {
		setSelectedItem(item);
		onValueChange?.(item.value);
	};
	return /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
		asChild: true,
		disabled,
		children: /* @__PURE__ */ jsx(Button, {
			size: "xs",
			shape: "circle",
			className: `py-1.5 pl-3 hover:bg-overlay-light ${className || ""}`,
			"data-testid": `${testId}-trigger`,
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-center gap-1 truncate pr-3",
				children: [/* @__PURE__ */ jsx(Text, {
					variant: "xsmall",
					color: "text100",
					fontWeight: "bold",
					children: selectedItem ? selectedItem.content : placeholder
				}), /* @__PURE__ */ jsx(ChevronDownIcon, { size: "xs" })]
			})
		})
	}), /* @__PURE__ */ jsx(DropdownMenuPortal, { children: /* @__PURE__ */ jsx(DropdownMenuContent, {
		align: "end",
		side: "bottom",
		sideOffset: 8,
		className: "z-[1000] overflow-hidden rounded-xl border border-border-base bg-color-overlay-glass shadow-lg backdrop-blur-md",
		"data-testid": `${testId}-content`,
		children: /* @__PURE__ */ jsx("div", {
			className: "max-h-[240px] overflow-auto",
			children: items.map((item) => /* @__PURE__ */ jsx(DropdownMenuCheckboxItem, {
				checked: selectedItem?.value === item.value,
				onCheckedChange: () => handleValueChange(item),
				disabled: item.disabled,
				className: "group relative flex cursor-pointer select-none items-center rounded-lg px-2 py-1.5 outline-none transition-colors hover:bg-background-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>span[data-state='checked']]:hidden",
				"data-testid": `${testId}-option-${item.value}`,
				children: /* @__PURE__ */ jsx("div", {
					className: "flex w-full items-center justify-between",
					children: /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-2 truncate",
						children: typeof item.content === "string" ? /* @__PURE__ */ jsx(Text, {
							variant: "small",
							color: selectedItem?.value === item.value ? "text100" : "text80",
							className: `truncate ${selectedItem?.value === item.value ? "font-bold" : ""}`,
							"data-testid": `${testId}-option-text-${item.value}`,
							children: item.content
						}) : /* @__PURE__ */ jsx("div", {
							className: "truncate",
							"data-testid": `${testId}-option-content-${item.value}`,
							children: item.content
						})
					})
				})
			}, item.value))
		})
	}) })] });
};

//#endregion
//#region src/react/ui/modals/_internal/constants/opensea-currencies.ts
const OPENSEA_CHAIN_CURRENCIES = {
	"1": {
		chainId: 1,
		openseaId: "ethereum",
		name: "Ethereum",
		nativeCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" },
		offerCurrency: {
			symbol: "WETH",
			address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
		},
		listingCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		}
	},
	"10": {
		chainId: 10,
		openseaId: "optimism",
		name: "Optimism",
		nativeCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0x4200000000000000000000000000000000000006" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x4200000000000000000000000000000000000006"
		},
		listingCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		}
	},
	"137": {
		chainId: 137,
		openseaId: "matic",
		name: "Polygon",
		nativeCurrency: {
			symbol: "POL",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"
		},
		listingCurrency: {
			symbol: "WETH",
			address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"
		}
	},
	"360": {
		chainId: 360,
		openseaId: "shape",
		name: "Shape",
		nativeCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0x4200000000000000000000000000000000000006" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x4200000000000000000000000000000000000006"
		},
		listingCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		}
	},
	"998": {
		chainId: 998,
		openseaId: "hyperevm",
		name: "HyperEVM",
		nativeCurrency: {
			symbol: "HYPE",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0x5555555555555555555555555555555555555555" },
		offerCurrency: {
			symbol: "WHYPE",
			address: "0x5555555555555555555555555555555555555555"
		},
		listingCurrency: {
			symbol: "HYPE",
			address: "0x0000000000000000000000000000000000000000"
		}
	},
	"130": {
		chainId: 130,
		openseaId: "unichain",
		name: "Unichain",
		nativeCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0x4200000000000000000000000000000000000006" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x4200000000000000000000000000000000000006"
		},
		listingCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		}
	},
	"1329": {
		chainId: 1329,
		openseaId: "sei",
		name: "Sei",
		nativeCurrency: {
			symbol: "SEI",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7" },
		offerCurrency: {
			symbol: "WSEI",
			address: "0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7"
		},
		listingCurrency: {
			symbol: "SEI",
			address: "0x0000000000000000000000000000000000000000"
		}
	},
	"1868": {
		chainId: 1868,
		openseaId: "soneium",
		name: "Soneium",
		nativeCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0x4200000000000000000000000000000000000006" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x4200000000000000000000000000000000000006"
		},
		listingCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		}
	},
	"2020": {
		chainId: 2020,
		openseaId: "ronin",
		name: "Ronin",
		nativeCurrency: {
			symbol: "RON",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0xe514d9deb7966c8be0ca922de8a064264ea6bcd4" },
		offerCurrency: {
			symbol: "WRON",
			address: "0xe514d9deb7966c8be0ca922de8a064264ea6bcd4"
		},
		listingCurrency: {
			symbol: "RON",
			address: "0x0000000000000000000000000000000000000000"
		}
	},
	"2741": {
		chainId: 2741,
		openseaId: "abstract",
		name: "Abstract",
		nativeCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0x3439153eb7af838ad19d56e1571fbd09333c2809" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x3439153eb7af838ad19d56e1571fbd09333c2809"
		},
		listingCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		}
	},
	"8333": {
		chainId: 8333,
		openseaId: "b3",
		name: "B3",
		nativeCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0x4200000000000000000000000000000000000006" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x4200000000000000000000000000000000000006"
		},
		listingCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		}
	},
	"8453": {
		chainId: 8453,
		openseaId: "base",
		name: "Base",
		nativeCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0x4200000000000000000000000000000000000006" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x4200000000000000000000000000000000000006"
		},
		listingCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		}
	},
	"33139": {
		chainId: 33139,
		openseaId: "ape_chain",
		name: "ApeChain",
		nativeCurrency: {
			symbol: "APE",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0x48b62137edfa95a428d35c09e44256a739f6b557" },
		offerCurrency: {
			symbol: "WAPE",
			address: "0x48b62137edfa95a428d35c09e44256a739f6b557"
		},
		listingCurrency: {
			symbol: "APE",
			address: "0x0000000000000000000000000000000000000000"
		}
	},
	"42161": {
		chainId: 42161,
		openseaId: "arbitrum",
		name: "Arbitrum",
		nativeCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1"
		},
		listingCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		}
	},
	"42170": {
		chainId: 42170,
		openseaId: "arbitrum_nova",
		name: "Arbitrum Nova",
		nativeCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0x722e8bdd2ce80a4422e880164f2079488e115365" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x722e8bdd2ce80a4422e880164f2079488e115365"
		},
		listingCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		}
	},
	"43114": {
		chainId: 43114,
		openseaId: "avalanche",
		name: "Avalanche",
		nativeCurrency: {
			symbol: "AVAX",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7" },
		offerCurrency: {
			symbol: "WAVAX",
			address: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"
		},
		listingCurrency: {
			symbol: "AVAX",
			address: "0x0000000000000000000000000000000000000000"
		}
	},
	"43419": {
		chainId: 43419,
		openseaId: "gunzilla",
		name: "GUNZ",
		nativeCurrency: {
			symbol: "GUN",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0x5aad7bba61d95c2c4e525a35f4062040264611f1" },
		offerCurrency: {
			symbol: "WGUN",
			address: "0x5aad7bba61d95c2c4e525a35f4062040264611f1"
		},
		listingCurrency: {
			symbol: "GUN",
			address: "0x0000000000000000000000000000000000000000"
		}
	},
	"50311": {
		chainId: 50311,
		openseaId: "somnia",
		name: "Somnia",
		nativeCurrency: {
			symbol: "SOMI",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0x046ede9564a72571df6f5e44d0405360c0f4dcab" },
		offerCurrency: {
			symbol: "WSOMI",
			address: "0x046ede9564a72571df6f5e44d0405360c0f4dcab"
		},
		listingCurrency: {
			symbol: "SOMI",
			address: "0x0000000000000000000000000000000000000000"
		}
	},
	"80094": {
		chainId: 80094,
		openseaId: "bera_chain",
		name: "Berachain",
		nativeCurrency: {
			symbol: "BERA",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0x6969696969696969696969696969696969696969" },
		offerCurrency: {
			symbol: "WBERA",
			address: "0x6969696969696969696969696969696969696969"
		},
		listingCurrency: {
			symbol: "BERA",
			address: "0x0000000000000000000000000000000000000000"
		}
	},
	"81457": {
		chainId: 81457,
		openseaId: "blast",
		name: "Blast",
		nativeCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0x4300000000000000000000000000000000000004" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x4300000000000000000000000000000000000004"
		},
		listingCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		}
	},
	"7777777": {
		chainId: 7777777,
		openseaId: "zora",
		name: "Zora",
		nativeCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		},
		wrappedNativeCurrency: { address: "0x4200000000000000000000000000000000000006" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x4200000000000000000000000000000000000006"
		},
		listingCurrency: {
			symbol: "ETH",
			address: "0x0000000000000000000000000000000000000000"
		}
	}
};
function getOpenseaCurrencyForChain(chainId, modalType) {
	const config = OPENSEA_CHAIN_CURRENCIES[chainId.toString()];
	if (!config) return;
	return modalType === "listing" ? config.listingCurrency : config.offerCurrency;
}

//#endregion
//#region src/react/ui/modals/_internal/components/currencyOptionsSelect/index.tsx
function CurrencyOptionsSelect({ chainId, collectionAddress, secondCurrencyAsDefault, selectedCurrency, onCurrencyChange, includeNativeCurrency, orderbookKind, modalType }) {
	const { data: currencies, isLoading: currenciesLoading } = useCurrencyList({
		chainId,
		collectionAddress,
		includeNativeCurrency
	});
	let filteredCurrencies = currencies;
	if (currencies && orderbookKind === OrderbookKind.opensea && modalType) {
		const openseaCurrency = getOpenseaCurrencyForChain(chainId, modalType);
		if (openseaCurrency) filteredCurrencies = currencies.filter((currency) => compareAddress(currency.contractAddress, openseaCurrency.address));
	}
	useEffect(() => {
		if (filteredCurrencies && filteredCurrencies.length > 0 && !selectedCurrency?.contractAddress) if (secondCurrencyAsDefault && filteredCurrencies.length > 1) onCurrencyChange(filteredCurrencies[1]);
		else onCurrencyChange(filteredCurrencies[0]);
	}, [
		filteredCurrencies,
		selectedCurrency?.contractAddress,
		secondCurrencyAsDefault,
		onCurrencyChange
	]);
	if (!filteredCurrencies || currenciesLoading || !selectedCurrency?.symbol) return /* @__PURE__ */ jsx(Skeleton, { className: "mr-0 h-6 w-20 rounded-2xl" });
	const options = filteredCurrencies.map((currency) => ({
		label: currency.symbol,
		value: currency.contractAddress,
		content: currency.symbol
	}));
	const onChange = (value) => {
		const selectedCurrency$1 = filteredCurrencies.find((currency) => currency.contractAddress === value);
		if (selectedCurrency$1) onCurrencyChange(selectedCurrency$1);
	};
	return /* @__PURE__ */ jsx(CustomSelect, {
		items: options,
		onValueChange: onChange,
		defaultValue: {
			value: selectedCurrency.contractAddress,
			content: selectedCurrency.symbol
		},
		testId: "currency-select"
	});
}
var currencyOptionsSelect_default = CurrencyOptionsSelect;

//#endregion
//#region src/react/ui/modals/_internal/components/priceInput/index.tsx
function PriceInput({ chainId, collectionAddress, price, onPriceChange, onCurrencyChange, checkBalance, secondCurrencyAsDefault, includeNativeCurrency, disabled, orderbookKind, setOpenseaLowestPriceCriteriaMet, modalType, feeData }) {
	const { address: accountAddress } = useAccount();
	const inputRef = useRef(null);
	const currency = price?.currency;
	const currencyDecimals = price?.currency?.decimals;
	const currencyAddress = price?.currency?.contractAddress;
	const priceAmountRaw = price?.amountRaw;
	const handleCurrencyChange = (newCurrency) => {
		if (price && onCurrencyChange) onCurrencyChange(newCurrency);
	};
	const { data: conversion, isLoading: isConversionLoading } = useCurrencyConvertToUSD({
		chainId,
		currencyAddress,
		amountRaw: priceAmountRaw,
		query: { enabled: orderbookKind === OrderbookKind.opensea && !!currencyAddress && !!priceAmountRaw && !!setOpenseaLowestPriceCriteriaMet }
	});
	useEffect(() => {
		if (inputRef.current) inputRef.current.focus();
	}, []);
	const { data: balance, isSuccess: isBalanceSuccess } = useTokenCurrencyBalance({
		currencyAddress,
		chainId,
		userAddress: accountAddress
	});
	const getTotalRequiredBalance = () => {
		if (!priceAmountRaw || !currencyDecimals) return BigInt(0);
		const offerAmountRaw = BigInt(priceAmountRaw);
		if (modalType === "offer" && feeData) return calculateTotalOfferCost(offerAmountRaw, currencyDecimals, feeData.royaltyPercentage || 0);
		return offerAmountRaw;
	};
	const balanceError = !!checkBalance?.enabled && !!isBalanceSuccess && !!priceAmountRaw && !!currencyDecimals && getTotalRequiredBalance() > BigInt(balance?.value || 0n);
	const hasEnoughForBaseOffer = !!isBalanceSuccess && !!priceAmountRaw && BigInt(priceAmountRaw) <= BigInt(balance?.value || 0n);
	const getRoyaltyFeeAmount = () => {
		if (!priceAmountRaw || !currencyDecimals || !feeData?.royaltyPercentage) return null;
		return formatUnits(BigInt(priceAmountRaw) * BigInt(Math.round(feeData.royaltyPercentage * 100)) / BigInt(1e4), currencyDecimals);
	};
	const royaltyFeeFormatted = getRoyaltyFeeAmount();
	const RoyaltyFeeTooltip = ({ children }) => /* @__PURE__ */ jsx(Tooltip, {
		message: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col gap-1",
			children: [
				/* @__PURE__ */ jsx(Text, {
					className: "font-body font-medium text-xs",
					children: "A royalty fee is a percentage of each resale"
				}),
				/* @__PURE__ */ jsx(Text, {
					className: "font-body font-medium text-xs",
					children: "price that automatically compensates the original"
				}),
				/* @__PURE__ */ jsx(Text, {
					className: "font-body font-medium text-xs",
					children: "creator every time their collectible changes hands."
				})
			]
		}),
		children
	});
	const openseaLowestPriceCriteriaMet = orderbookKind === OrderbookKind.opensea && !!conversion?.usdAmount && conversion.usdAmount >= .01;
	if (checkBalance?.enabled) checkBalance.callback(balanceError);
	if (setOpenseaLowestPriceCriteriaMet) setOpenseaLowestPriceCriteriaMet(openseaLowestPriceCriteriaMet);
	const [value, setValue] = useState("0");
	const prevCurrencyDecimals = useRef(currencyDecimals);
	const [openseaDecimalError, setOpenseaDecimalError] = useState(null);
	useEffect(() => {
		if (prevCurrencyDecimals.current !== currencyDecimals && value !== "0" && price && onPriceChange) try {
			const parsedAmount = parseUnits(value, Number(currencyDecimals));
			onPriceChange({
				...price,
				amountRaw: parsedAmount.toString()
			});
		} catch {
			onPriceChange({
				...price,
				amountRaw: "0"
			});
		}
		prevCurrencyDecimals.current = currencyDecimals;
	}, [
		currencyDecimals,
		price,
		value,
		onPriceChange
	]);
	const handleChange = (event) => {
		const newValue = event.target.value;
		setValue(newValue);
		if (!price || !onPriceChange) return;
		if (orderbookKind === OrderbookKind.opensea && modalType === "offer") {
			const validation = validateOpenseaOfferDecimals(newValue);
			if (!validation.isValid) {
				setOpenseaDecimalError(validation.errorMessage || null);
				try {
					const parsedAmount = parseUnits(newValue, Number(currencyDecimals));
					onPriceChange({
						...price,
						amountRaw: parsedAmount.toString()
					});
				} catch {
					onPriceChange({
						...price,
						amountRaw: "0"
					});
				}
				return;
			}
			setOpenseaDecimalError(null);
		}
		try {
			const parsedAmount = parseUnits(newValue, Number(currencyDecimals));
			onPriceChange({
				...price,
				amountRaw: parsedAmount.toString()
			});
		} catch {
			onPriceChange({
				...price,
				amountRaw: "0"
			});
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: cn$1("price-input relative flex w-full flex-col", disabled && "pointer-events-none opacity-50"),
		children: [
			/* @__PURE__ */ jsxs(Field, {
				className: "[&>div>div]:pr-0",
				children: [/* @__PURE__ */ jsx(FieldLabel, {
					htmlFor: "price-input",
					className: "text-xs",
					children: "Enter price"
				}), /* @__PURE__ */ jsx(NumericInput, {
					"aria-label": "Enter price",
					ref: inputRef,
					className: "h-9 w-full rounded-sm px-2 pl-3 [&>input]:text-xs",
					name: "price-input",
					decimals: currencyDecimals,
					controls: /* @__PURE__ */ jsx(currencyOptionsSelect_default, {
						selectedCurrency: currency,
						onCurrencyChange: handleCurrencyChange,
						collectionAddress,
						chainId,
						secondCurrencyAsDefault,
						includeNativeCurrency,
						orderbookKind,
						modalType
					}),
					value,
					onChange: handleChange
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute top-8 left-2 flex items-center",
				children: /* @__PURE__ */ jsx(currencyImage_default, { price })
			}),
			balanceError && /* @__PURE__ */ jsx(Text, {
				className: "mt-1.5 font-body font-medium text-amber-500 text-xs",
				children: modalType === "offer" && hasEnoughForBaseOffer && royaltyFeeFormatted && Number(royaltyFeeFormatted) > 0 ? /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ jsx(RoyaltyFeeTooltip, { children: /* @__PURE__ */ jsx(InfoIcon, { className: "h-4 w-4 text-negative" }) }), /* @__PURE__ */ jsxs(Text, {
						className: "font-body font-medium text-xs",
						color: "negative",
						children: [
							"You need ",
							royaltyFeeFormatted,
							" ",
							currency?.symbol,
							" for royalty fees"
						]
					})]
				}) : "Insufficient balance"
			}),
			!balanceError && modalType === "offer" && royaltyFeeFormatted && Number(royaltyFeeFormatted) > 0 && /* @__PURE__ */ jsx("div", {
				className: "mt-2",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ jsx(RoyaltyFeeTooltip, { children: /* @__PURE__ */ jsx(InfoIcon, { className: "h-4 w-4 text-text-50" }) }), /* @__PURE__ */ jsxs(Text, {
						className: "font-body font-medium text-xs",
						color: "text50",
						children: [
							"Total:",
							" ",
							(Number(value) + Number(royaltyFeeFormatted)).toFixed(6).replace(/\.?0+$/, ""),
							" ",
							currency?.symbol,
							" (includes ",
							royaltyFeeFormatted,
							" ",
							currency?.symbol,
							" royalty fee)"
						]
					})]
				})
			}),
			!balanceError && priceAmountRaw !== "0" && !openseaLowestPriceCriteriaMet && orderbookKind === OrderbookKind.opensea && !isConversionLoading && modalType === "offer" && !openseaDecimalError && /* @__PURE__ */ jsx(Text, {
				className: "-bottom-5 absolute font-body font-medium text-xs",
				color: "negative",
				children: "Lowest price must be at least $0.01"
			}),
			!balanceError && openseaDecimalError && orderbookKind === OrderbookKind.opensea && modalType === "offer" && /* @__PURE__ */ jsx(Text, {
				className: "font-body font-medium text-xs",
				color: "negative",
				children: openseaDecimalError
			})
		]
	});
}

//#endregion
//#region src/react/ui/modals/_internal/hooks/useSelectWaasFeeOptions.ts
const useSelectWaasFeeOptions = ({ isProcessing, feeOptionsVisible, selectedFeeOption }) => {
	const { isWaaS } = useConnectorMetadata();
	const isProcessingWithWaaS = isProcessing && isWaaS;
	const shouldHideActionButton = isProcessingWithWaaS && feeOptionsVisible === true && !!selectedFeeOption;
	const waasFeeOptionsShown = isWaaS && isProcessing && feeOptionsVisible;
	const getActionLabel = (defaultLabel, loadingLabel = "Loading fee options") => {
		if (isProcessing) return isWaaS ? loadingLabel : defaultLabel;
		return defaultLabel;
	};
	return {
		isWaaS,
		feeOptionsVisible,
		shouldHideActionButton,
		waasFeeOptionsShown,
		isProcessingWithWaaS,
		getActionLabel
	};
};

//#endregion
//#region src/react/ui/modals/CreateListingModal/hooks/useGetTokenApproval.ts
const ONE_DAY_IN_SECONDS$1 = 3600 * 24;
const useGetTokenApprovalData$1 = (params) => {
	const config = useConfig();
	const { walletKind } = useConnectorMetadata();
	const { address } = useAccount();
	const marketplaceClient = getMarketplaceClient(config);
	const listing = {
		tokenId: params.tokenId,
		quantity: "1",
		currencyAddress: params.currencyAddress,
		pricePerToken: "100000",
		expiry: String(Number(dateToUnixTime(/* @__PURE__ */ new Date())) + ONE_DAY_IN_SECONDS$1)
	};
	const isEnabled = address && (params.query?.enabled ?? true) && !!params.currencyAddress;
	const { data, isLoading, isSuccess, isError, error } = useQuery({
		queryKey: [
			"token-approval-data",
			params,
			address
		],
		queryFn: isEnabled ? async () => {
			const args = {
				chainId: String(params.chainId),
				collectionAddress: params.collectionAddress,
				owner: address,
				walletType: walletKind,
				contractType: params.contractType,
				orderbook: params.orderbook,
				listing,
				additionalFees: []
			};
			const tokenApprovalStep = (await marketplaceClient.generateListingTransaction(args).then((resp) => resp.steps)).find((step) => step.id === StepType.tokenApproval);
			if (!tokenApprovalStep) return { step: null };
			return { step: tokenApprovalStep };
		} : skipToken
	});
	return {
		data,
		isLoading,
		isSuccess,
		isError,
		error
	};
};

//#endregion
//#region src/utils/getSequenceMarketRequestId.ts
const getSequenceMarketplaceRequestId = async (hash, publicClient, walletAddress) => {
	try {
		const receipt = await publicClient.getTransactionReceipt({ hash });
		return parseEventLogs({
			abi: SequenceMarketplaceV1_ABI,
			eventName: "RequestCreated",
			args: { creator: walletAddress },
			logs: receipt.logs
		})[0].args.requestId.toString();
	} catch (error) {
		console.error(error);
	}
};

//#endregion
//#region src/react/ui/modals/CreateListingModal/hooks/useTransactionSteps.tsx
const useTransactionSteps$1 = ({ listingInput, chainId, collectionAddress, orderbookKind, callbacks, closeMainModal, steps$ }) => {
	const { address } = useAccount();
	const publicClient = usePublicClient();
	const { walletKind } = useConnectorMetadata();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const { data: currencies } = useCurrencyList({ chainId });
	const currency = currencies?.find((c) => c.contractAddress === listingInput.listing.currencyAddress);
	const analytics = useAnalytics();
	const { processStep } = useProcessStep();
	const { generateListingTransactionAsync, isPending: generatingSteps } = useGenerateListingTransaction({
		chainId,
		onSuccess: (steps$2) => {
			if (!steps$2) return;
		}
	});
	const getListingSteps = async () => {
		if (!address) return;
		try {
			return await generateListingTransactionAsync({
				collectionAddress,
				owner: address,
				walletType: walletKind,
				contractType: listingInput.contractType,
				orderbook: orderbookKind,
				listing: {
					...listingInput.listing,
					expiry: /* @__PURE__ */ new Date(Number(listingInput.listing.expiry) * 1e3)
				},
				additionalFees: []
			});
		} catch (error) {
			if (callbacks?.onError) callbacks.onError(error);
			else console.debug("onError callback not provided:", error);
		}
	};
	const executeApproval = async () => {
		if (!address) return;
		try {
			steps$.approval.isExecuting.set(true);
			const approvalStep = await getListingSteps().then((steps$2) => steps$2?.find((step) => step.id === StepType.tokenApproval));
			if (!approvalStep) throw new Error("No approval step found");
			const result = await processStep(approvalStep, chainId);
			if (result.type === "transaction") {
				await waitForTransactionReceipt({
					txHash: result.hash,
					chainId,
					sdkConfig
				});
				steps$.approval.isExecuting.set(false);
				steps$.approval.exist.set(false);
			}
		} catch (_error) {
			steps$.approval.isExecuting.set(false);
		}
	};
	const createListing = async ({ isTransactionExecuting }) => {
		if (!address) return;
		try {
			steps$.transaction.isExecuting.set(isTransactionExecuting);
			const steps$2 = await getListingSteps();
			if (!steps$2) throw new Error("No steps found");
			let hash;
			let orderId;
			if (steps$2) for (const step of steps$2) {
				const result = await processStep(step, chainId);
				if (result.type === "transaction") hash = result.hash;
				else if (result.type === "signature") orderId = result.orderId;
			}
			closeMainModal();
			showTransactionStatusModal({
				type: TransactionType.LISTING,
				collectionAddress,
				chainId,
				collectibleId: listingInput.listing.tokenId,
				hash,
				orderId,
				callbacks,
				price: {
					amountRaw: listingInput.listing.pricePerToken,
					currency
				},
				queriesToInvalidate: [
					["collectible", "market-lowest-listing"],
					["collectible", "market-list-listings"],
					["collectible", "market-count-listings"],
					["token", "balances"]
				]
			});
			if (hash) {
				await waitForTransactionReceipt({
					txHash: hash,
					chainId,
					sdkConfig
				});
				steps$.transaction.isExecuting.set(false);
				steps$.transaction.exist.set(false);
			}
			if (orderId) {
				steps$.transaction.isExecuting.set(false);
				steps$.transaction.exist.set(false);
			}
			if (hash || orderId) {
				const currencyDecimal = currencies?.find((c) => c.contractAddress === listingInput.listing.currencyAddress)?.decimals || 0;
				const currencyValueRaw = Number(listingInput.listing.pricePerToken);
				const currencyValueDecimal = Number(formatUnits(BigInt(currencyValueRaw), currencyDecimal));
				let requestId = orderId;
				if (hash && (orderbookKind === OrderbookKind.sequence_marketplace_v1 || orderbookKind === OrderbookKind.sequence_marketplace_v2)) requestId = await getSequenceMarketplaceRequestId(hash, publicClient, address);
				analytics.trackCreateListing({
					props: {
						orderbookKind,
						collectionAddress,
						currencyAddress: listingInput.listing.currencyAddress,
						currencySymbol: currency?.symbol || "",
						tokenId: listingInput.listing.tokenId,
						requestId: requestId || "",
						chainId: chainId.toString(),
						txnHash: hash || ""
					},
					nums: {
						currencyValueDecimal,
						currencyValueRaw
					}
				});
			}
		} catch (error) {
			steps$.transaction.isExecuting.set(false);
			steps$.transaction.exist.set(false);
			if (callbacks?.onError && typeof callbacks.onError === "function") callbacks.onError(error);
		}
	};
	return {
		generatingSteps,
		executeApproval,
		createListing
	};
};

//#endregion
//#region src/react/ui/modals/CreateListingModal/hooks/useCreateListing.tsx
const useCreateListing = ({ listingInput, chainId, collectionAddress, orderbookKind, steps$, callbacks, closeMainModal }) => {
	const { data: marketplaceConfig, isLoading: marketplaceIsLoading } = useMarketplaceConfig();
	const collectionConfig = marketplaceConfig?.market.collections.find((c) => compareAddress(c.itemsAddress, collectionAddress));
	orderbookKind = orderbookKind ?? collectionConfig?.destinationMarketplace ?? OrderbookKind.sequence_marketplace_v2;
	const { data: tokenApproval, isLoading: tokenApprovalIsLoading, isError, error } = useGetTokenApprovalData$1({
		chainId,
		tokenId: listingInput.listing.tokenId,
		collectionAddress,
		currencyAddress: listingInput.listing.currencyAddress,
		contractType: listingInput.contractType,
		orderbook: orderbookKind,
		query: { enabled: !marketplaceIsLoading }
	});
	useEffect(() => {
		if (tokenApproval?.step && !tokenApprovalIsLoading) steps$.approval.exist.set(true);
	}, [tokenApproval?.step, tokenApprovalIsLoading]);
	const { generatingSteps, executeApproval, createListing } = useTransactionSteps$1({
		listingInput,
		chainId,
		collectionAddress,
		orderbookKind,
		callbacks,
		closeMainModal,
		steps$
	});
	return {
		isLoading: generatingSteps,
		executeApproval,
		createListing,
		tokenApprovalStepExists: tokenApproval?.step !== null,
		tokenApprovalIsLoading,
		isError,
		error
	};
};

//#endregion
//#region src/react/ui/modals/CreateListingModal/store.ts
const listingPrice = {
	amountRaw: "0",
	currency: {}
};
const approval$1 = {
	exist: false,
	isExecuting: false,
	execute: () => Promise.resolve()
};
const transaction$1 = {
	exist: false,
	isExecuting: false,
	execute: () => Promise.resolve()
};
const steps$1 = {
	approval: { ...approval$1 },
	transaction: { ...transaction$1 }
};
const initialState$1 = {
	isOpen: false,
	collectionAddress: "",
	chainId: 0,
	collectibleId: "",
	orderbookKind: OrderbookKind.sequence_marketplace_v2,
	collectionName: "",
	collectionType: void 0,
	listingPrice: { ...listingPrice },
	quantity: "1",
	invalidQuantity: false,
	expiry: new Date(addDays$1(/* @__PURE__ */ new Date(), 7).toJSON()),
	callbacks: void 0,
	steps: { ...steps$1 },
	listingIsBeingProcessed: false
};
const actions$1 = {
	open: (args) => {
		createListingModal$.collectionAddress.set(args.collectionAddress);
		createListingModal$.chainId.set(args.chainId);
		createListingModal$.collectibleId.set(args.collectibleId);
		createListingModal$.orderbookKind.set(args.orderbookKind);
		createListingModal$.callbacks.set(args.callbacks);
		createListingModal$.isOpen.set(true);
	},
	close: () => {
		createListingModal$.isOpen.set(false);
		createListingModal$.set({
			...initialState$1,
			...actions$1
		});
		createListingModal$.listingPrice.set({ ...listingPrice });
		createListingModal$.steps.set({ ...steps$1 });
		createListingModal$.listingIsBeingProcessed.set(false);
		createListingModal$.steps.approval.isExecuting.set(false);
		createListingModal$.steps.transaction.isExecuting.set(false);
	}
};
const createListingModal$ = observable({
	...initialState$1,
	...actions$1
});

//#endregion
//#region src/react/ui/modals/CreateListingModal/Modal.tsx
const CreateListingModal = () => {
	return /* @__PURE__ */ jsx(Show, {
		if: createListingModal$.isOpen,
		children: () => /* @__PURE__ */ jsx(Modal$2, {})
	});
};
const Modal$2 = observer(() => {
	const state = createListingModal$.get();
	const { address } = useAccount();
	const { collectionAddress, chainId, listingPrice: listingPrice$1, collectibleId, orderbookKind: orderbookKindProp, callbacks, listingIsBeingProcessed } = state;
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const collectionConfig = marketplaceConfig?.market.collections.find((c) => c.itemsAddress === collectionAddress);
	const orderbookKind = orderbookKindProp ?? collectionConfig?.destinationMarketplace;
	const steps$ = createListingModal$.steps;
	const { isWaaS } = useConnectorMetadata();
	const { isVisible: feeOptionsVisible, selectedFeeOption } = useSelectWaasFeeOptionsStore();
	const { shouldHideActionButton: shouldHideListButton, waasFeeOptionsShown, getActionLabel } = useSelectWaasFeeOptions({
		isProcessing: listingIsBeingProcessed,
		feeOptionsVisible,
		selectedFeeOption
	});
	const collectibleQuery = useCollectibleMetadata({
		chainId,
		collectionAddress,
		collectibleId
	});
	const currenciesQuery = useCurrencyList({
		chainId,
		collectionAddress,
		includeNativeCurrency: true
	});
	const collectionQuery = useCollectionMetadata({
		chainId,
		collectionAddress
	});
	const collectibleBalanceQuery = useCollectibleBalance({
		chainId,
		collectionAddress,
		collectableId: collectibleId,
		userAddress: address ?? void 0
	});
	const modalLoading = collectibleQuery.isLoading || collectionQuery.isLoading || currenciesQuery.isLoading;
	const balanceWithDecimals = collectibleBalanceQuery.data?.balance ? dn.toNumber(dn.from([BigInt(collectibleBalanceQuery.data?.balance ?? 0), collectibleQuery.data?.decimals || 0])) : 0;
	const { isLoading, executeApproval, createListing, tokenApprovalIsLoading, error: createListingError } = useCreateListing({
		listingInput: {
			contractType: collectionQuery.data?.type,
			listing: {
				tokenId: collectibleId,
				quantity: parseUnits(createListingModal$.quantity.get(), collectibleQuery.data?.decimals || 0).toString(),
				expiry: dateToUnixTime(createListingModal$.expiry.get()),
				currencyAddress: listingPrice$1.currency.contractAddress,
				pricePerToken: listingPrice$1.amountRaw
			}
		},
		chainId,
		collectionAddress,
		orderbookKind,
		callbacks,
		closeMainModal: () => createListingModal$.close(),
		steps$
	});
	const erc20NotConfiguredError = !modalLoading && (!currenciesQuery.data || currenciesQuery.data.length === 0) ? /* @__PURE__ */ new Error("No ERC-20s are configured for the marketplace, contact the marketplace owners") : void 0;
	const handleCreateListing = async () => {
		createListingModal$.listingIsBeingProcessed.set(true);
		try {
			if (isWaaS) selectWaasFeeOptionsStore.send({ type: "show" });
			await createListing({ isTransactionExecuting: !!isWaaS });
		} catch (error) {
			console.error("Create listing failed:", error);
			throw error;
		} finally {
			createListingModal$.listingIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		}
	};
	const handleApproveToken = async () => {
		await executeApproval().catch((error) => {
			console.error("Approve TOKEN failed:", error);
			throw error;
		});
	};
	const primaryAction = {
		label: getActionLabel("List item for sale"),
		actionName: "listing",
		onClick: handleCreateListing,
		loading: steps$?.transaction.isExecuting.get() || createListingModal$.listingIsBeingProcessed.get(),
		testid: "create-listing-submit-button",
		disabled: steps$.approval.exist.get() || tokenApprovalIsLoading || listingPrice$1.amountRaw === "0" || createListingModal$.invalidQuantity.get() || isLoading || listingIsBeingProcessed
	};
	const secondaryAction = {
		label: "Approve TOKEN",
		actionName: "collectible spending approval",
		onClick: handleApproveToken,
		hidden: !steps$.approval.exist.get(),
		loading: steps$?.approval.isExecuting.get(),
		variant: "secondary",
		disabled: createListingModal$.invalidQuantity.get() || listingPrice$1.amountRaw === "0" || steps$?.approval.isExecuting.get() || tokenApprovalIsLoading || isLoading
	};
	const queries = {
		collectible: collectibleQuery,
		collection: collectionQuery,
		collectibleBalance: collectibleBalanceQuery
	};
	return /* @__PURE__ */ jsx(ActionModal, {
		chainId: Number(chainId),
		type: "listing",
		onClose: () => {
			createListingModal$.close();
			selectWaasFeeOptionsStore.send({ type: "hide" });
		},
		title: "List item for sale",
		primaryAction: shouldHideListButton ? void 0 : primaryAction,
		secondaryAction: shouldHideListButton ? void 0 : secondaryAction,
		queries,
		externalError: createListingError || erc20NotConfiguredError,
		children: ({ collectible, collection, collectibleBalance }) => /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(TokenPreview, {
				collectionName: collection?.name,
				collectionAddress,
				collectibleId,
				chainId
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex w-full flex-col gap-1",
				children: [/* @__PURE__ */ jsx(PriceInput, {
					chainId,
					collectionAddress,
					price: listingPrice$1,
					onPriceChange: (newPrice) => {
						createListingModal$.listingPrice.set(newPrice);
					},
					onCurrencyChange: (newCurrency) => {
						createListingModal$.listingPrice.currency.set(newCurrency);
					},
					disabled: shouldHideListButton,
					orderbookKind,
					modalType: "listing"
				}), listingPrice$1.amountRaw !== "0" && /* @__PURE__ */ jsx(FloorPriceText, {
					tokenId: collectibleId,
					chainId,
					collectionAddress,
					price: listingPrice$1
				})]
			}),
			collection?.type === "ERC1155" && collectibleBalance.balance && /* @__PURE__ */ jsx(QuantityInput, {
				quantity: use$(createListingModal$.quantity),
				invalidQuantity: use$(createListingModal$.invalidQuantity),
				onQuantityChange: (quantity) => createListingModal$.quantity.set(quantity),
				onInvalidQuantityChange: (invalid) => createListingModal$.invalidQuantity.set(invalid),
				decimals: collectible?.decimals || 0,
				maxQuantity: balanceWithDecimals.toString(),
				disabled: shouldHideListButton
			}),
			/* @__PURE__ */ jsx(expirationDateSelect_default, {
				date: createListingModal$.expiry.get(),
				onDateChange: (date) => createListingModal$.expiry.set(date),
				disabled: shouldHideListButton
			}),
			/* @__PURE__ */ jsx(TransactionDetails, {
				collectibleId,
				collectionAddress,
				chainId,
				price: createListingModal$.listingPrice.get(),
				currencyImageUrl: listingPrice$1.currency.imageUrl,
				includeMarketplaceFee: false
			}),
			waasFeeOptionsShown && /* @__PURE__ */ jsx(selectWaasFeeOptions_default, {
				chainId: Number(chainId),
				onCancel: () => {
					createListingModal$.listingIsBeingProcessed.set(false);
					steps$.transaction.isExecuting.set(false);
				},
				titleOnConfirm: "Processing listing..."
			})
		] })
	});
});

//#endregion
//#region src/react/ui/modals/BuyModal/index.tsx
const useBuyModal = (callbacks) => {
	const analyticsFn = useAnalytics();
	return {
		show: (args) => buyModalStore.send({
			type: "open",
			props: args,
			...callbacks,
			analyticsFn
		}),
		close: () => buyModalStore.send({ type: "close" })
	};
};

//#endregion
//#region src/react/ui/modals/MakeOfferModal/hooks/useGetTokenApproval.tsx
const ONE_DAY_IN_SECONDS = 3600 * 24;
const useGetTokenApprovalData = (params) => {
	const config = useConfig();
	const { address } = useAccount();
	const { walletKind } = useConnectorMetadata();
	const marketplaceClient = getMarketplaceClient(config);
	const offer = {
		tokenId: params.tokenId,
		quantity: "1",
		currencyAddress: params.currencyAddress,
		pricePerToken: "1",
		expiry: String(Number(dateToUnixTime(/* @__PURE__ */ new Date())) + ONE_DAY_IN_SECONDS)
	};
	const isEnabled = address && params.query?.enabled !== false;
	const { data, isLoading, isSuccess, isError, error } = useQuery({
		queryKey: ["token-approval-data", params.currencyAddress],
		queryFn: isEnabled ? async () => {
			const args = {
				chainId: String(params.chainId),
				collectionAddress: params.collectionAddress,
				maker: address,
				walletType: walletKind,
				contractType: params.contractType,
				orderbook: params.orderbook,
				offer,
				offerType: OfferType.item,
				additionalFees: []
			};
			const tokenApprovalStep = (await marketplaceClient.generateOfferTransaction(args).then((resp) => resp.steps)).find((step) => step.id === StepType.tokenApproval);
			if (!tokenApprovalStep) return { step: null };
			return { step: tokenApprovalStep };
		} : skipToken,
		enabled: !!address && !!params.collectionAddress && !!params.currencyAddress
	});
	return {
		data,
		isLoading,
		isSuccess,
		isError,
		error
	};
};

//#endregion
//#region src/react/ui/modals/MakeOfferModal/hooks/useTransactionSteps.tsx
const useTransactionSteps = ({ offerInput, chainId, collectionAddress, orderbookKind = OrderbookKind.sequence_marketplace_v2, callbacks, closeMainModal, steps$ }) => {
	const { address } = useAccount();
	const publicClient = usePublicClient({ chainId });
	const { walletKind } = useConnectorMetadata();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const analytics = useAnalytics();
	const { processStep } = useProcessStep();
	const { generateOfferTransactionAsync, isPending: generatingSteps } = useGenerateOfferTransaction({
		chainId,
		onSuccess: (steps$2) => {
			if (!steps$2) return;
		}
	});
	const { data: currency } = useCurrency({
		chainId,
		currencyAddress: offerInput.offer.currencyAddress
	});
	const getOfferSteps = async () => {
		if (!address) return;
		try {
			return await generateOfferTransactionAsync({
				collectionAddress,
				maker: address,
				walletType: walletKind,
				contractType: offerInput.contractType,
				orderbook: orderbookKind,
				offer: {
					...offerInput.offer,
					expiry: /* @__PURE__ */ new Date(Number(offerInput.offer.expiry) * 1e3)
				},
				offerType: OfferType.item,
				additionalFees: []
			});
		} catch (error) {
			if (callbacks?.onError) callbacks.onError(error);
			else console.debug("onError callback not provided:", error);
		}
	};
	const executeApproval = async () => {
		try {
			steps$.approval.isExecuting.set(true);
			const approvalStep = await getOfferSteps().then((steps$2) => steps$2?.find((step) => step.id === StepType.tokenApproval));
			if (!approvalStep) throw new Error("No approval step found");
			const result = await processStep(approvalStep, chainId);
			if (result.type === "transaction") {
				await waitForTransactionReceipt({
					txHash: result.hash,
					chainId,
					sdkConfig
				});
				steps$.approval.isExecuting.set(false);
				steps$.approval.exist.set(false);
			}
		} catch (_error) {
			steps$.approval.isExecuting.set(false);
		}
	};
	const makeOffer = async ({ isTransactionExecuting }) => {
		try {
			steps$.transaction.isExecuting.set(isTransactionExecuting);
			const steps$2 = await getOfferSteps();
			if (!steps$2) throw new Error("No transaction or signature step found");
			let hash;
			let orderId;
			if (steps$2) for (const step of steps$2) {
				const result = await processStep(step, chainId);
				if (result.type === "transaction") hash = result.hash;
			}
			closeMainModal();
			showTransactionStatusModal({
				type: TransactionType.OFFER,
				collectionAddress,
				chainId,
				collectibleId: offerInput.offer.tokenId,
				hash,
				orderId,
				callbacks,
				queriesToInvalidate: [
					["collectible", "market-highest-offer"],
					["collectible", "market-list-offers"],
					["collectible", "market-count-offers"],
					["token", "balances"]
				],
				price: {
					amountRaw: offerInput.offer.pricePerToken,
					currency
				}
			});
			if (hash) {
				await waitForTransactionReceipt({
					txHash: hash,
					chainId,
					sdkConfig
				});
				steps$.transaction.isExecuting.set(false);
				steps$.transaction.exist.set(false);
			}
			if (hash || orderId) {
				const currencyDecimal = currency?.decimals || 0;
				const currencyValueRaw = Number(offerInput.offer.pricePerToken);
				const currencyValueDecimal = Number(formatUnits(BigInt(currencyValueRaw), currencyDecimal));
				let requestId = orderId;
				if (hash && publicClient && address && (orderbookKind === OrderbookKind.sequence_marketplace_v1 || orderbookKind === OrderbookKind.sequence_marketplace_v2)) requestId = await getSequenceMarketplaceRequestId(hash, publicClient, address);
				analytics.trackCreateOffer({
					props: {
						orderbookKind,
						collectionAddress,
						currencyAddress: offerInput.offer.currencyAddress,
						currencySymbol: currency?.symbol || "",
						chainId: chainId.toString(),
						requestId: requestId || "",
						txnHash: hash || ""
					},
					nums: {
						currencyValueDecimal,
						currencyValueRaw
					}
				});
			}
		} catch (error) {
			steps$.transaction.isExecuting.set(false);
			steps$.transaction.exist.set(false);
			if (callbacks?.onError && typeof callbacks.onError === "function") callbacks.onError(error);
		}
	};
	return {
		generatingSteps,
		executeApproval,
		makeOffer
	};
};

//#endregion
//#region src/react/ui/modals/MakeOfferModal/hooks/useMakeOffer.tsx
const useMakeOffer = ({ offerInput, chainId, collectionAddress, orderbookKind, callbacks, closeMainModal, steps$ }) => {
	const { data: tokenApproval, isLoading: tokenApprovalIsLoading, isError, error } = useGetTokenApprovalData({
		chainId,
		tokenId: offerInput.offer.tokenId,
		collectionAddress,
		currencyAddress: offerInput.offer.currencyAddress,
		contractType: offerInput.contractType,
		orderbook: orderbookKind || OrderbookKind.sequence_marketplace_v2
	});
	useEffect(() => {
		if (!tokenApprovalIsLoading) steps$.approval.exist.set(!!tokenApproval?.step);
	}, [tokenApproval?.step, tokenApprovalIsLoading]);
	const { generatingSteps, executeApproval, makeOffer } = useTransactionSteps({
		offerInput,
		chainId,
		collectionAddress,
		orderbookKind,
		callbacks,
		closeMainModal,
		steps$
	});
	return {
		isLoading: generatingSteps,
		executeApproval,
		makeOffer,
		tokenApprovalStepExists: tokenApproval?.step !== null,
		tokenApprovalIsLoading,
		isError,
		error
	};
};

//#endregion
//#region src/react/ui/modals/MakeOfferModal/store.ts
const offerPrice = {
	amountRaw: "0",
	currency: {}
};
const approval = {
	exist: false,
	isExecuting: false,
	execute: () => Promise.resolve()
};
const transaction = {
	exist: false,
	isExecuting: false,
	execute: () => Promise.resolve()
};
const steps = {
	approval: { ...approval },
	transaction: { ...transaction }
};
const initialState = {
	isOpen: false,
	collectionAddress: "",
	chainId: 0,
	collectibleId: "",
	orderbookKind: void 0,
	callbacks: void 0,
	offerPrice: { ...offerPrice },
	offerPriceChanged: false,
	quantity: "1",
	invalidQuantity: false,
	expiry: new Date(addDays$1(/* @__PURE__ */ new Date(), 7).toJSON()),
	collectionType: void 0,
	steps: { ...steps },
	offerIsBeingProcessed: false
};
const actions = {
	open: (args) => {
		makeOfferModal$.collectionAddress.set(args.collectionAddress);
		makeOfferModal$.chainId.set(args.chainId);
		makeOfferModal$.collectibleId.set(args.collectibleId);
		makeOfferModal$.orderbookKind.set(args.orderbookKind);
		makeOfferModal$.callbacks.set(args.callbacks);
		makeOfferModal$.isOpen.set(true);
	},
	close: () => {
		makeOfferModal$.isOpen.set(false);
		makeOfferModal$.set({
			...initialState,
			...actions
		});
		makeOfferModal$.steps.set({ ...steps });
		makeOfferModal$.offerPrice.set({ ...offerPrice });
		makeOfferModal$.offerIsBeingProcessed.set(false);
	}
};
const makeOfferModal$ = observable({
	...initialState,
	...actions
});

//#endregion
//#region src/react/ui/modals/MakeOfferModal/Modal.tsx
const MakeOfferModal = () => {
	return /* @__PURE__ */ jsx(Show, {
		if: makeOfferModal$.isOpen,
		children: () => /* @__PURE__ */ jsx(Modal$1, {})
	});
};
const Modal$1 = observer(() => {
	const { collectionAddress, chainId, offerPrice: offerPrice$1, offerPriceChanged, invalidQuantity, collectibleId, orderbookKind: orderbookKindProp, callbacks } = makeOfferModal$.get();
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const collectionConfig = marketplaceConfig?.market.collections.find((c) => c.itemsAddress === collectionAddress);
	const orderbookKind = orderbookKindProp ?? collectionConfig?.destinationMarketplace;
	const steps$ = makeOfferModal$.steps;
	const [insufficientBalance, setInsufficientBalance] = useState(false);
	const [openseaLowestPriceCriteriaMet, setOpenseaLowestPriceCriteriaMet] = useState(true);
	const collectibleQuery = useCollectibleMetadata({
		chainId,
		collectionAddress,
		collectibleId
	});
	const { isWaaS } = useConnectorMetadata();
	const isProcessing = makeOfferModal$.offerIsBeingProcessed.get();
	const { isVisible: feeOptionsVisible, selectedFeeOption } = useSelectWaasFeeOptionsStore();
	const { shouldHideActionButton: shouldHideOfferButton, waasFeeOptionsShown, getActionLabel } = useSelectWaasFeeOptions({
		isProcessing,
		feeOptionsVisible,
		selectedFeeOption
	});
	const collectionQuery = useCollectionMetadata({
		chainId,
		collectionAddress
	});
	const marketCurrenciesQuery = useCurrencyList({
		chainId,
		collectionAddress,
		includeNativeCurrency: false
	});
	const royaltyQuery = useRoyalty({
		chainId,
		collectionAddress,
		collectibleId
	});
	const modalLoading = collectibleQuery.isLoading || collectionQuery.isLoading || marketCurrenciesQuery.isLoading || royaltyQuery.isLoading;
	const { executeApproval, makeOffer, error: makeOfferError } = useMakeOffer({
		offerInput: {
			contractType: collectionQuery.data?.type,
			offer: {
				tokenId: collectibleId,
				quantity: parseUnits(makeOfferModal$.quantity.get(), collectibleQuery.data?.decimals || 0).toString(),
				expiry: dateToUnixTime(makeOfferModal$.expiry.get()),
				currencyAddress: offerPrice$1.currency.contractAddress,
				pricePerToken: offerPrice$1.amountRaw
			}
		},
		chainId,
		collectionAddress,
		callbacks,
		orderbookKind,
		closeMainModal: () => makeOfferModal$.close(),
		steps$
	});
	const erc20NotConfiguredError = !modalLoading && (!marketCurrenciesQuery.data || marketCurrenciesQuery.data.length === 0) ? /* @__PURE__ */ new Error("No ERC-20s are configured for the marketplace, contact the marketplace owners") : void 0;
	const buyModal = useBuyModal(callbacks);
	const lowestListingQuery = useCollectibleMarketLowestListing({
		tokenId: collectibleId,
		chainId,
		collectionAddress,
		filter: { currencies: [offerPrice$1.currency.contractAddress] }
	});
	const handleMakeOffer = async () => {
		makeOfferModal$.offerIsBeingProcessed.set(true);
		try {
			if (isWaaS) selectWaasFeeOptionsStore.send({ type: "show" });
			await makeOffer({ isTransactionExecuting: isWaaS ? getNetwork(Number(chainId)).type !== NetworkType.TESTNET : false });
		} catch (error) {
			throw error;
		} finally {
			makeOfferModal$.offerIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		}
	};
	const handleApproveToken = async () => {
		await executeApproval().catch((error) => {
			console.error("Approve TOKEN failed:", error);
			throw error;
		});
	};
	const primaryAction = {
		label: getActionLabel("Make offer"),
		actionName: "offer",
		onClick: () => handleMakeOffer(),
		loading: steps$?.transaction.isExecuting.get() || makeOfferModal$.offerIsBeingProcessed.get(),
		disabled: steps$.approval.isExecuting.get() || steps$.approval.exist.get() || offerPrice$1.amountRaw === "0" || invalidQuantity || insufficientBalance || orderbookKind === OrderbookKind.opensea && !openseaLowestPriceCriteriaMet || makeOfferModal$.offerIsBeingProcessed.get()
	};
	const secondaryAction = {
		label: "Approve TOKEN",
		actionName: "currency spending approval",
		onClick: handleApproveToken,
		hidden: !steps$.approval.exist.get(),
		loading: steps$.approval.isExecuting.get(),
		variant: "secondary",
		disabled: makeOfferModal$.offerIsBeingProcessed.get()
	};
	const queries = {
		collection: collectionQuery,
		collectible: collectibleQuery,
		royalty: royaltyQuery,
		lowestListing: lowestListingQuery
	};
	return /* @__PURE__ */ jsx(ActionModal, {
		chainId: Number(chainId),
		onClose: () => {
			makeOfferModal$.close();
			selectWaasFeeOptionsStore.send({ type: "hide" });
			steps$.transaction.isExecuting.set(false);
		},
		type: "offer",
		title: "Make an offer",
		primaryAction,
		secondaryAction,
		queries,
		onErrorDismiss: () => {
			makeOfferModal$.close();
			selectWaasFeeOptionsStore.send({ type: "hide" });
			steps$.transaction.isExecuting.set(false);
		},
		externalError: makeOfferError || erc20NotConfiguredError,
		children: ({ collection, collectible, royalty, lowestListing }) => /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(TokenPreview, {
				collectionName: collection?.name,
				collectionAddress,
				collectibleId,
				chainId
			}),
			/* @__PURE__ */ jsx(PriceInput, {
				chainId,
				collectionAddress,
				price: offerPrice$1,
				onPriceChange: (newPrice) => {
					makeOfferModal$.offerPrice.set(newPrice);
					makeOfferModal$.offerPriceChanged.set(true);
				},
				onCurrencyChange: (newCurrency) => {
					makeOfferModal$.offerPrice.currency.set(newCurrency);
				},
				includeNativeCurrency: false,
				checkBalance: {
					enabled: true,
					callback: (state) => setInsufficientBalance(state)
				},
				setOpenseaLowestPriceCriteriaMet: (state) => setOpenseaLowestPriceCriteriaMet(state),
				orderbookKind,
				modalType: "offer",
				disabled: shouldHideOfferButton,
				feeData: { royaltyPercentage: royalty ? Number(royalty.percentage) : 0 }
			}),
			collection?.type === ContractType.ERC1155 && /* @__PURE__ */ jsx(QuantityInput, {
				quantity: use$(makeOfferModal$.quantity),
				invalidQuantity: use$(makeOfferModal$.invalidQuantity),
				onQuantityChange: (quantity) => makeOfferModal$.quantity.set(quantity),
				onInvalidQuantityChange: (invalid) => makeOfferModal$.invalidQuantity.set(invalid),
				decimals: collectible?.decimals || 0,
				maxQuantity: String(Number.MAX_SAFE_INTEGER),
				disabled: shouldHideOfferButton
			}),
			offerPrice$1.amountRaw !== "0" && offerPriceChanged && !insufficientBalance && /* @__PURE__ */ jsx(FloorPriceText, {
				tokenId: collectibleId,
				chainId,
				collectionAddress,
				price: offerPrice$1,
				onBuyNow: () => {
					makeOfferModal$.close();
					if (lowestListing) buyModal.show({
						chainId,
						collectionAddress,
						collectibleId,
						orderId: lowestListing.orderId,
						marketplace: lowestListing.marketplace
					});
				}
			}),
			/* @__PURE__ */ jsx(expirationDateSelect_default, {
				date: makeOfferModal$.expiry.get(),
				onDateChange: (date) => makeOfferModal$.expiry.set(date),
				disabled: shouldHideOfferButton
			}),
			waasFeeOptionsShown && /* @__PURE__ */ jsx(selectWaasFeeOptions_default, {
				chainId: Number(chainId),
				onCancel: () => {
					makeOfferModal$.offerIsBeingProcessed.set(false);
					steps$.transaction.isExecuting.set(false);
				},
				titleOnConfirm: "Processing offer..."
			})
		] })
	});
});

//#endregion
//#region src/react/ui/modals/SuccessfulPurchaseModal/store.ts
const initialContext$1 = {
	isOpen: false,
	state: {
		collectibles: [],
		totalPrice: "0",
		explorerName: "",
		explorerUrl: "",
		ctaOptions: void 0
	},
	callbacks: void 0
};
const successfulPurchaseModalStore = createStore({
	context: initialContext$1,
	on: {
		open: (context, event) => ({
			...context,
			isOpen: true,
			state: {
				collectibles: event.collectibles,
				totalPrice: event.totalPrice,
				explorerName: event.explorerName,
				explorerUrl: event.explorerUrl,
				ctaOptions: event.ctaOptions
			},
			callbacks: event.callbacks || event.defaultCallbacks
		}),
		close: () => ({ ...initialContext$1 })
	}
});
const useIsOpen$1 = () => useSelector(successfulPurchaseModalStore, (state) => state.context.isOpen);
const useModalState$1 = () => useSelector(successfulPurchaseModalStore, (state) => state.context.state);

//#endregion
//#region src/react/ui/modals/SuccessfulPurchaseModal/index.tsx
const useSuccessfulPurchaseModal = (callbacks) => {
	return {
		show: (args) => successfulPurchaseModalStore.send({
			type: "open",
			...args,
			defaultCallbacks: callbacks
		}),
		close: () => successfulPurchaseModalStore.send({ type: "close" })
	};
};
const SuccessfulPurchaseModal = () => {
	const isOpen = useIsOpen$1();
	const modalState = useModalState$1();
	const handleClose = () => {
		successfulPurchaseModalStore.send({ type: "close" });
	};
	if (!isOpen) return null;
	return /* @__PURE__ */ jsx(Modal, {
		isDismissible: true,
		onClose: handleClose,
		size: "sm",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex w-full flex-col gap-4 p-6",
			children: [
				/* @__PURE__ */ jsx(Text, {
					className: "text-center text-large",
					fontWeight: "bold",
					color: "text100",
					children: "Successful purchase!"
				}),
				/* @__PURE__ */ jsx(CollectiblesGrid, { collectibles: modalState.collectibles }),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ jsx(Text, {
							className: "text-base",
							fontWeight: "medium",
							color: "text80",
							children: "You bought"
						}),
						/* @__PURE__ */ jsx(Text, {
							className: "text-base",
							fontWeight: "medium",
							color: "text100",
							children: modalState.collectibles.length
						}),
						/* @__PURE__ */ jsx(Text, {
							className: "text-base",
							fontWeight: "medium",
							color: "text80",
							children: "items for"
						}),
						/* @__PURE__ */ jsx(Text, {
							className: "text-base",
							fontWeight: "medium",
							color: "text100",
							children: modalState.totalPrice
						})
					]
				}),
				/* @__PURE__ */ jsx(SuccessfulPurchaseActions, { modalState })
			]
		})
	});
};
function SuccessfulPurchaseActions({ modalState }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-2",
		children: [modalState.ctaOptions && /* @__PURE__ */ jsxs(Button, {
			className: "w-full",
			shape: "square",
			onClick: modalState.ctaOptions.ctaOnClick || void 0,
			children: [modalState.ctaOptions.ctaIcon && /* @__PURE__ */ jsx(modalState.ctaOptions.ctaIcon, {}), modalState.ctaOptions.ctaLabel]
		}), /* @__PURE__ */ jsx("a", {
			href: modalState.explorerUrl,
			target: "_blank",
			rel: "noopener noreferrer",
			className: "w-full",
			children: /* @__PURE__ */ jsxs(Button, {
				shape: "square",
				children: [
					/* @__PURE__ */ jsx(ExternalLinkIcon, {}),
					"View on ",
					modalState.explorerName
				]
			})
		})]
	});
}
function CollectiblesGrid({ collectibles }) {
	const total = collectibles.length;
	return /* @__PURE__ */ jsx("div", {
		className: "grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2 [&:has(div:nth-child(4))>div]:col-[unset] [&>div:nth-child(1):only-child]:h-[312px] [&>div:nth-child(1):only-child]:w-[312px] [&>div:nth-child(3)]:col-[1/-1] [&>div:nth-child(3)]:justify-self-center",
		children: (total > 4 ? collectibles.slice(0, 4) : collectibles).map((collectible) => {
			const showPlus = total > 4 && collectibles.indexOf(collectible) === 3;
			return /* @__PURE__ */ jsxs("div", {
				className: "relative h-[150px] w-[150px]",
				children: [/* @__PURE__ */ jsx(Image, {
					className: `aspect-square h-full w-full rounded-lg bg-background-secondary object-contain ${showPlus ? "opacity-[0.4_!important]" : ""}`,
					src: collectible.image,
					alt: collectible.name
				}), showPlus && /* @__PURE__ */ jsx("div", {
					className: "absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-background-overlay backdrop-blur-md",
					children: /* @__PURE__ */ jsxs(Text, {
						className: "rounded-lg bg-background-secondary px-2 py-1.5 text-sm backdrop-blur-md",
						fontWeight: "medium",
						color: "text80",
						children: [total, " TOTAL"]
					})
				})]
			}, collectible.tokenId);
		})
	});
}
var SuccessfulPurchaseModal_default = SuccessfulPurchaseModal;

//#endregion
//#region src/react/ui/modals/TransferModal/messages.ts
const baseMessages = {
	enterReceiverAddress: "Items sent to the wrong wallet address can't be recovered!",
	followWalletInstructions: "Follow your wallet's instructions to submit a transaction to transfer your assets."
};
function getMessage(key) {
	return baseMessages[key];
}

//#endregion
//#region src/react/ui/modals/TransferModal/store.ts
const initialContext = {
	isOpen: false,
	chainId: 0,
	collectionAddress: "0x",
	collectibleId: "",
	quantity: "1",
	receiverAddress: "",
	transferIsProcessing: false,
	view: "enterReceiverAddress",
	hash: void 0,
	onSuccess: void 0,
	onError: void 0
};
const transferModalStore = createStore({
	context: initialContext,
	on: {
		open: (_context, event) => ({
			...initialContext,
			isOpen: true,
			chainId: event.chainId,
			collectionAddress: event.collectionAddress,
			collectibleId: event.collectibleId,
			view: "enterReceiverAddress",
			onSuccess: event.callbacks?.onSuccess,
			onError: event.callbacks?.onError
		}),
		updateTransferDetails: (context, event) => ({
			...context,
			...event.receiverAddress !== void 0 && { receiverAddress: event.receiverAddress },
			...event.quantity !== void 0 && { quantity: event.quantity }
		}),
		startTransfer: (context) => ({
			...context,
			transferIsProcessing: true,
			view: "followWalletInstructions"
		}),
		completeTransfer: (context, event) => {
			if (context.onSuccess) context.onSuccess({ hash: event.hash });
			return {
				...context,
				hash: event.hash,
				transferIsProcessing: false
			};
		},
		failTransfer: (context, event) => {
			if (context.onError) context.onError(event.error);
			return {
				...context,
				transferIsProcessing: false,
				view: "enterReceiverAddress"
			};
		},
		close: () => initialContext
	}
});
const useIsOpen = () => useSelector(transferModalStore, (state) => state.context.isOpen);
const useModalState = () => useSelector(transferModalStore, (state) => state.context);
const useView = () => useSelector(transferModalStore, (state) => state.context.view);
const transferDetailsSelector = transferModalStore.select((state) => ({
	receiverAddress: state.receiverAddress,
	quantity: state.quantity
}));
const transferConfigSelector = transferModalStore.select((state) => ({
	chainId: state.chainId,
	collectionAddress: state.collectionAddress,
	collectibleId: state.collectibleId
}));

//#endregion
//#region src/react/ui/modals/TransferModal/_views/enterWalletAddress/_components/TokenQuantityInput.tsx
const TokenQuantityInput = ({ balanceAmount, collection, isProcessingWithWaaS }) => {
	const modalState = useModalState();
	const [invalidQuantity, setInvalidQuantity] = useState(false);
	let insufficientBalance = true;
	if (balanceAmount !== void 0 && modalState.quantity) try {
		insufficientBalance = BigInt(modalState.quantity) > balanceAmount;
	} catch (_e) {
		insufficientBalance = true;
	}
	return /* @__PURE__ */ jsxs("div", {
		className: cn("flex flex-col gap-3", isProcessingWithWaaS && "pointer-events-none opacity-50"),
		children: [/* @__PURE__ */ jsx(QuantityInput, {
			quantity: modalState.quantity,
			invalidQuantity,
			onQuantityChange: (quantity) => transferModalStore.send({
				type: "updateTransferDetails",
				quantity
			}),
			onInvalidQuantityChange: setInvalidQuantity,
			decimals: collection?.decimals || 0,
			maxQuantity: balanceAmount ? String(balanceAmount) : "0",
			className: "[&>label>div>div>div>input]:text-sm [&>label>div>div>div]:h-13 [&>label>div>div>div]:rounded-xl [&>label>div>div>span]:text-sm [&>label>div>div>span]:text-text-80 [&>label]:gap-1"
		}), /* @__PURE__ */ jsx(Text, {
			className: "font-body text-xs",
			color: insufficientBalance ? "negative" : "text50",
			fontWeight: "medium",
			children: `You have ${balanceAmount?.toString() || "0"} of this item`
		})]
	});
};
var TokenQuantityInput_default = TokenQuantityInput;

//#endregion
//#region src/react/ui/modals/TransferModal/_views/enterWalletAddress/_components/TransferButton.tsx
const TransferButton = ({ onClick, isDisabled }) => {
	const { isWaaS } = useConnectorMetadata();
	const { transferIsProcessing } = useModalState();
	const [pendingFeeOptionConfirmation] = useWaasFeeOptions();
	const getLabel = () => {
		if (!transferIsProcessing) return "Transfer";
		if (isWaaS) {
			if (!pendingFeeOptionConfirmation || pendingFeeOptionConfirmation.options.length === 0) return /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-center gap-2",
				children: [/* @__PURE__ */ jsx(Spinner, {
					size: "sm",
					className: "text-white"
				}), /* @__PURE__ */ jsx("span", { children: "Sending transaction" })]
			});
			return /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-center gap-2",
				children: [/* @__PURE__ */ jsx(Spinner, {
					size: "sm",
					className: "text-white"
				}), /* @__PURE__ */ jsx("span", { children: "Loading fee options" })]
			});
		}
		return /* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-center gap-2",
			children: [/* @__PURE__ */ jsx(Spinner, {
				size: "sm",
				className: "text-white"
			}), /* @__PURE__ */ jsx("span", { children: "Transferring" })]
		});
	};
	return /* @__PURE__ */ jsx(Button, {
		className: "flex justify-self-end px-10",
		onClick,
		disabled: !!isDisabled,
		title: "Transfer",
		variant: "primary",
		shape: "square",
		size: "sm",
		children: getLabel()
	});
};
var TransferButton_default = TransferButton;

//#endregion
//#region src/react/ui/modals/TransferModal/_views/enterWalletAddress/_components/WalletAddressInput.tsx
const MAX_WALLET_ADDRESS_LENGTH = 42;
const WalletAddressInput = () => {
	const { address: connectedAddress } = useAccount();
	const { receiverAddress, transferIsProcessing } = useModalState();
	const isSelfTransfer = isAddress(receiverAddress) && connectedAddress && receiverAddress.toLowerCase() === connectedAddress.toLowerCase();
	const handleChangeWalletAddress = (event) => {
		transferModalStore.send({
			type: "updateTransferDetails",
			receiverAddress: event.target.value
		});
	};
	return /* @__PURE__ */ jsxs(Field, { children: [
		/* @__PURE__ */ jsx(FieldLabel, {
			className: "text-text-80 text-xs",
			children: "Wallet address"
		}),
		/* @__PURE__ */ jsx(TextInput, {
			autoFocus: true,
			value: receiverAddress,
			maxLength: MAX_WALLET_ADDRESS_LENGTH,
			onChange: handleChangeWalletAddress,
			name: "walletAddress",
			placeholder: "Enter wallet address",
			disabled: transferIsProcessing
		}),
		isSelfTransfer && /* @__PURE__ */ jsx("div", {
			className: "mt-1 text-amber-500 text-xs",
			children: "You cannot transfer to your own address"
		})
	] });
};
var WalletAddressInput_default = WalletAddressInput;

//#endregion
//#region src/react/ui/modals/TransferModal/_views/enterWalletAddress/useHandleTransfer.tsx
const useHandleTransfer = () => {
	const { receiverAddress, collectionAddress, collectibleId, quantity, chainId } = useModalState();
	const { transferTokensAsync } = useTransferTokens();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const { isWaaS } = useConnectorMetadata();
	const [pendingFeeOptionConfirmation] = useWaasFeeOptions();
	const { data: collection } = useCollectionMetadata({
		collectionAddress,
		chainId
	});
	const collectionType = collection?.type;
	const getHash = async () => {
		const baseParams = {
			receiverAddress,
			collectionAddress,
			tokenId: collectibleId,
			chainId
		};
		if (collectionType === ContractType.ERC721) return await transferTokensAsync({
			...baseParams,
			contractType: ContractType.ERC721
		});
		return await transferTokensAsync({
			...baseParams,
			contractType: ContractType.ERC1155,
			quantity: String(quantity)
		});
	};
	const transfer = async () => {
		if (collectionType !== ContractType.ERC721 && collectionType !== ContractType.ERC1155) throw new InvalidContractTypeError(collectionType);
		if (isWaaS && pendingFeeOptionConfirmation) return;
		try {
			const hash = await getHash();
			transferModalStore.send({
				type: "completeTransfer",
				hash
			});
			transferModalStore.send({ type: "close" });
			showTransactionStatusModal({
				hash,
				collectionAddress,
				chainId,
				collectibleId,
				type: TransactionType.TRANSFER,
				queriesToInvalidate: [["token", "balances"], ["collection", "balance-details"]]
			});
		} catch (error) {
			transferModalStore.send({
				type: "failTransfer",
				error
			});
		}
	};
	return { transfer };
};
var useHandleTransfer_default = useHandleTransfer;

//#endregion
//#region src/react/ui/modals/TransferModal/_views/enterWalletAddress/index.tsx
const EnterWalletAddressView = () => {
	const { address: connectedAddress } = useAccount();
	const { collectionAddress, collectibleId, chainId, quantity, receiverAddress, transferIsProcessing } = useModalState();
	const isWalletAddressValid = isAddress(receiverAddress);
	const { isVisible: feeOptionsVisible, selectedFeeOption } = useSelectWaasFeeOptionsStore();
	const { isWaaS, isProcessingWithWaaS, shouldHideActionButton: shouldHideTransferButton } = useSelectWaasFeeOptions({
		isProcessing: transferIsProcessing,
		feeOptionsVisible,
		selectedFeeOption
	});
	const isSelfTransfer = isWalletAddressValid && connectedAddress && compareAddress(receiverAddress, connectedAddress);
	const { data: tokenBalance } = useTokenBalances({
		chainId,
		contractAddress: collectionAddress,
		tokenId: collectibleId,
		accountAddress: connectedAddress,
		query: { enabled: !!connectedAddress }
	});
	const balanceAmount = tokenBalance?.pages[0].balances[0].balance;
	let insufficientBalance = true;
	if (balanceAmount !== void 0 && quantity) try {
		insufficientBalance = BigInt(quantity) > BigInt(balanceAmount);
	} catch (_e) {
		insufficientBalance = true;
	}
	const { data: collection } = useCollectionMetadata({
		collectionAddress,
		chainId
	});
	const { transfer } = useHandleTransfer_default();
	const onTransferClick = async () => {
		transferModalStore.send({ type: "startTransfer" });
		try {
			if (isWaaS) selectWaasFeeOptionsStore.send({ type: "show" });
			await transfer();
		} catch (error) {
			console.error("Transfer failed:", error);
		}
	};
	const showQuantityInput = collection?.type === ContractType.ERC1155 && !!balanceAmount;
	const isTransferDisabled = transferIsProcessing || !isWalletAddressValid || insufficientBalance || !quantity || Number(quantity) === 0 || isSelfTransfer;
	return /* @__PURE__ */ jsxs("div", {
		className: "grid grow gap-6",
		children: [
			/* @__PURE__ */ jsx(Text, {
				className: "font-body text-xl",
				color: "white",
				fontWeight: "bold",
				children: "Transfer your item"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ jsx(AlertMessage, {
						message: getMessage("enterReceiverAddress"),
						type: "warning"
					}),
					/* @__PURE__ */ jsx(WalletAddressInput_default, {}),
					showQuantityInput && /* @__PURE__ */ jsx(TokenQuantityInput_default, {
						balanceAmount: balanceAmount ? BigInt(balanceAmount) : void 0,
						collection,
						isProcessingWithWaaS: isProcessingWithWaaS ?? false
					})
				]
			}),
			!shouldHideTransferButton && /* @__PURE__ */ jsx(TransferButton_default, {
				onClick: onTransferClick,
				isDisabled: isTransferDisabled
			})
		]
	});
};
var enterWalletAddress_default = EnterWalletAddressView;

//#endregion
//#region src/react/ui/modals/TransferModal/_views/followWalletInstructions/index.tsx
const FollowWalletInstructionsView = observer(() => {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid grow gap-6",
		children: [
			/* @__PURE__ */ jsx(Text, {
				className: "font-body text-xl",
				color: "white",
				fontWeight: "bold",
				children: "Transfer your item"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex flex-col gap-3",
				children: /* @__PURE__ */ jsx(AlertMessage, {
					message: getMessage("followWalletInstructions"),
					type: "info"
				})
			}),
			/* @__PURE__ */ jsx(Button, {
				className: "flex justify-self-end px-10",
				disabled: true,
				title: "Transfer",
				variant: "primary",
				shape: "square",
				size: "sm",
				children: "Transfer"
			})
		]
	});
});
var followWalletInstructions_default = FollowWalletInstructionsView;

//#endregion
//#region src/react/ui/modals/TransferModal/index.tsx
const useTransferModal = () => {
	const { ensureCorrectChain } = useEnsureCorrectChain();
	const openModal = (args) => {
		transferModalStore.send({
			type: "open",
			...args
		});
	};
	const handleShowModal = (args) => {
		ensureCorrectChain(Number(args.chainId), { onSuccess: () => openModal(args) });
	};
	return {
		show: handleShowModal,
		close: () => transferModalStore.send({ type: "close" })
	};
};
const TransactionModalView = () => {
	const view = useView();
	const { isWaaS } = useConnectorMetadata();
	switch (view) {
		case "enterReceiverAddress": return /* @__PURE__ */ jsx(enterWalletAddress_default, {});
		case "followWalletInstructions":
			if (isWaaS) return /* @__PURE__ */ jsx(enterWalletAddress_default, {});
			return /* @__PURE__ */ jsx(followWalletInstructions_default, {});
		default: return null;
	}
};
const TransferModal = () => {
	const isOpen = useIsOpen();
	const modalState = useModalState();
	const { isVisible: feeOptionsVisible, selectedFeeOption } = useSelectWaasFeeOptionsStore();
	const { waasFeeOptionsShown } = useSelectWaasFeeOptions({
		isProcessing: modalState.transferIsProcessing,
		feeOptionsVisible,
		selectedFeeOption
	});
	if (!isOpen) return null;
	return /* @__PURE__ */ jsxs(Modal, {
		isDismissible: true,
		onClose: () => {
			transferModalStore.send({ type: "close" });
			selectWaasFeeOptionsStore.send({ type: "hide" });
		},
		size: "sm",
		overlayProps: MODAL_OVERLAY_PROPS,
		contentProps: { style: {
			height: "auto",
			overflow: "auto"
		} },
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex w-full flex-col p-7",
			children: /* @__PURE__ */ jsx(TransactionModalView, {})
		}), waasFeeOptionsShown && /* @__PURE__ */ jsx(selectWaasFeeOptions_default, {
			chainId: Number(modalState.chainId),
			onCancel: () => {
				transferModalStore.send({
					type: "failTransfer",
					error: /* @__PURE__ */ new Error("Transfer cancelled")
				});
			},
			titleOnConfirm: "Processing transfer...",
			className: "p-7 pt-0"
		})]
	});
};

//#endregion
//#region src/styles/styles.ts
const styles = String.raw`/* Modified Tailwind CSS, to avoid issues with shadow DOM, see Marketplace SDK - compile-tailwind.js and postcss.config.mjs */
:root, :host {
  --tw-animation-delay: 0s;
  --tw-animation-direction: normal;
  --tw-animation-fill-mode: none;
  --tw-animation-iteration-count: 1;
  --tw-enter-blur: 0;
  --tw-enter-opacity: 1;
  --tw-enter-rotate: 0;
  --tw-enter-scale: 1;
  --tw-enter-translate-x: 0;
  --tw-enter-translate-y: 0;
  --tw-exit-blur: 0;
  --tw-exit-opacity: 1;
  --tw-exit-rotate: 0;
  --tw-exit-scale: 1;
  --tw-exit-translate-x: 0;
  --tw-exit-translate-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-translate-z: 0;
  --tw-space-y-reverse: 0;
  --tw-border-style: solid;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-alpha: 100%;
  --tw-inset-shadow: 0 0 #0000;
  --tw-inset-shadow-alpha: 100%;
  --tw-ring-shadow: 0 0 #0000;
  --tw-inset-ring-shadow: 0 0 #0000;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-outline-style: solid;
  --tw-drop-shadow-alpha: 100%;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-scale-z: 1;
  --tw-content: "";
  --tw-gradient-from: #0000;
  --tw-gradient-via: #0000;
  --tw-gradient-to: #0000;
  --tw-gradient-from-position: 0%;
  --tw-gradient-via-position: 50%;
  --tw-gradient-to-position: 100%;
}
/*! tailwindcss v4.1.16 | MIT License | https://tailwindcss.com */
@layer properties;
@layer theme, base, components, utilities;
@layer theme {
  :root, :host {
    --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --color-red-100: oklch(93.6% 0.032 17.717);
    --color-red-300: oklch(80.8% 0.114 19.571);
    --color-red-400: oklch(70.4% 0.191 22.216);
    --color-red-500: oklch(63.7% 0.237 25.331);
    --color-red-600: oklch(57.7% 0.245 27.325);
    --color-red-900: oklch(39.6% 0.141 25.723);
    --color-red-950: oklch(25.8% 0.092 26.042);
    --color-orange-300: oklch(83.7% 0.128 66.29);
    --color-orange-400: oklch(75% 0.183 55.934);
    --color-orange-500: oklch(70.5% 0.213 47.604);
    --color-orange-900: oklch(40.8% 0.123 38.172);
    --color-amber-500: oklch(76.9% 0.188 70.08);
    --color-yellow-300: oklch(90.5% 0.182 98.111);
    --color-yellow-400: oklch(85.2% 0.199 91.936);
    --color-yellow-500: oklch(79.5% 0.184 86.047);
    --color-yellow-600: oklch(68.1% 0.162 75.834);
    --color-yellow-900: oklch(42.1% 0.095 57.708);
    --color-green-500: oklch(72.3% 0.219 149.579);
    --color-green-600: oklch(62.7% 0.194 149.214);
    --color-blue-300: oklch(80.9% 0.105 251.813);
    --color-blue-400: oklch(70.7% 0.165 254.624);
    --color-blue-500: oklch(62.3% 0.214 259.815);
    --color-blue-600: oklch(54.6% 0.245 262.881);
    --color-blue-900: oklch(37.9% 0.146 265.522);
    --color-indigo-400: oklch(67.3% 0.182 276.935);
    --color-violet-400: oklch(70.2% 0.183 293.541);
    --color-violet-500: oklch(60.6% 0.25 292.717);
    --color-violet-600: oklch(54.1% 0.281 293.009);
    --color-violet-700: oklch(49.1% 0.27 292.581);
    --color-slate-50: oklch(98.4% 0.003 247.858);
    --color-slate-100: oklch(96.8% 0.007 247.896);
    --color-slate-200: oklch(92.9% 0.013 255.508);
    --color-slate-300: oklch(86.9% 0.022 252.894);
    --color-slate-400: oklch(70.4% 0.04 256.788);
    --color-slate-500: oklch(55.4% 0.046 257.417);
    --color-slate-800: oklch(27.9% 0.041 260.031);
    --color-slate-950: oklch(12.9% 0.042 264.695);
    --color-gray-50: oklch(98.5% 0.002 247.839);
    --color-gray-300: oklch(87.2% 0.01 258.338);
    --color-gray-400: oklch(70.7% 0.022 261.325);
    --color-gray-500: oklch(55.1% 0.027 264.364);
    --color-gray-600: oklch(44.6% 0.03 256.802);
    --color-gray-800: oklch(27.8% 0.033 256.848);
    --color-zinc-500: oklch(55.2% 0.016 285.938);
    --color-zinc-600: oklch(44.2% 0.017 285.786);
    --color-zinc-700: oklch(37% 0.013 285.805);
    --color-zinc-800: oklch(27.4% 0.006 286.033);
    --color-zinc-900: oklch(21% 0.006 285.885);
    --color-zinc-950: oklch(14.1% 0.005 285.823);
    --color-black: #000;
    --color-white: #fff;
    --spacing: 0.25rem;
    --container-xs: 20rem;
    --container-sm: 24rem;
    --container-md: 28rem;
    --container-lg: 32rem;
    --text-xs: 0.75rem;
    --text-xs--line-height: 1rem;
    --text-sm: 0.875rem;
    --text-sm--line-height: 1.25rem;
    --text-base: 1rem;
    --text-base--line-height: 1.5rem;
    --text-lg: 1.125rem;
    --text-lg--line-height: 1.75rem;
    --text-xl: 1.25rem;
    --text-xl--line-height: calc(1.75 / 1.25);
    --text-2xl: 1.5rem;
    --text-2xl--line-height: calc(2 / 1.5);
    --text-4xl: 2.25rem;
    --text-4xl--line-height: calc(2.5 / 2.25);
    --text-6xl: 3.75rem;
    --text-6xl--line-height: 1;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --tracking-normal: 0em;
    --tracking-wide: 0.025em;
    --tracking-widest: 0.1em;
    --leading-snug: 1.375;
    --leading-relaxed: 1.625;
    --radius-xs: 0.125rem;
    --radius-sm: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
    --animate-spin: spin 1s linear infinite;
    --animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    --blur-xs: 4px;
    --blur-md: 12px;
    --aspect-video: 16 / 9;
    --default-transition-duration: 150ms;
    --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    --default-font-family: var(--font-sans);
    --default-mono-font-family: "Roboto", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    --font-body: "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --color-border-hover: hsla(247, 100%, 75%, 0.8);
    --color-border-focus: hsla(247, 100%, 75%, 1);
    --color-border-base: hsla(0, 0%, 31%, 1);
    --color-overlay-light: hsla(0, 0%, 100%, 0.1);
    --color-overlay-glass: hsla(0, 0%, 100%, 0.05);
    --color-surface-neutral: hsla(0, 0%, 15%, 1);
    --color-text-50: hsla(0, 0%, 100%, 0.5);
    --color-text-80: hsla(0, 0%, 100%, 0.8);
    --color-text-100: hsla(0, 0%, 100%, 1);
    --spacing-card-width: clamp(175px, 100%, 280px);
    --scale-hover: 1.165;
    --animate-shimmer: shimmer 1.5s infinite;
    --animate-bell-ring: bellRing 0.4s ease-in-out;
  }
}
@layer base {
  *, ::after, ::before, ::backdrop, ::file-selector-button {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0 solid;
  }
  html, :host {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");
    font-feature-settings: var(--default-font-feature-settings, normal);
    font-variation-settings: var(--default-font-variation-settings, normal);
    -webkit-tap-highlight-color: transparent;
  }
  hr {
    height: 0;
    color: inherit;
    border-top-width: 1px;
  }
  abbr:where([title]) {
    -webkit-text-decoration: underline dotted;
    text-decoration: underline dotted;
  }
  h1, h2, h3, h4, h5, h6 {
    font-size: inherit;
    font-weight: inherit;
  }
  a {
    color: inherit;
    -webkit-text-decoration: inherit;
    text-decoration: inherit;
  }
  b, strong {
    font-weight: bolder;
  }
  code, kbd, samp, pre {
    font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);
    font-feature-settings: var(--default-mono-font-feature-settings, normal);
    font-variation-settings: var(--default-mono-font-variation-settings, normal);
    font-size: 1em;
  }
  small {
    font-size: 80%;
  }
  sub, sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  sub {
    bottom: -0.25em;
  }
  sup {
    top: -0.5em;
  }
  table {
    text-indent: 0;
    border-color: inherit;
    border-collapse: collapse;
  }
  :-moz-focusring {
    outline: auto;
  }
  progress {
    vertical-align: baseline;
  }
  summary {
    display: list-item;
  }
  ol, ul, menu {
    list-style: none;
  }
  img, svg, video, canvas, audio, iframe, embed, object {
    display: block;
    vertical-align: middle;
  }
  img, video {
    max-width: 100%;
    height: auto;
  }
  button, input, select, optgroup, textarea, ::file-selector-button {
    font: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    letter-spacing: inherit;
    color: inherit;
    border-radius: 0;
    background-color: transparent;
    opacity: 1;
  }
  :where(select:is([multiple], [size])) optgroup {
    font-weight: bolder;
  }
  :where(select:is([multiple], [size])) optgroup option {
    padding-inline-start: 20px;
  }
  ::file-selector-button {
    margin-inline-end: 4px;
  }
  ::placeholder {
    opacity: 1;
  }
  @supports (not (-webkit-appearance: -apple-pay-button))  or (contain-intrinsic-size: 1px) {
    ::placeholder {
      color: currentcolor;
      @supports (color: color-mix(in lab, red, red)) {
        color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }
  }
  textarea {
    resize: vertical;
  }
  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  ::-webkit-date-and-time-value {
    min-height: 1lh;
    text-align: inherit;
  }
  ::-webkit-datetime-edit {
    display: inline-flex;
  }
  ::-webkit-datetime-edit-fields-wrapper {
    padding: 0;
  }
  ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month-field, ::-webkit-datetime-edit-day-field, ::-webkit-datetime-edit-hour-field, ::-webkit-datetime-edit-minute-field, ::-webkit-datetime-edit-second-field, ::-webkit-datetime-edit-millisecond-field, ::-webkit-datetime-edit-meridiem-field {
    padding-block: 0;
  }
  ::-webkit-calendar-picker-indicator {
    line-height: 1;
  }
  :-moz-ui-invalid {
    box-shadow: none;
  }
  button, input:where([type="button"], [type="reset"], [type="submit"]), ::file-selector-button {
    appearance: button;
  }
  ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
    height: auto;
  }
  [hidden]:where(:not([hidden="until-found"])) {
    display: none !important;
  }
}
@layer utilities {
  .\@container\/field-group {
    container-type: inline-size;
    container-name: field-group;
  }
  .\@container {
    container-type: inline-size;
  }
  .pointer-events-auto {
    pointer-events: auto;
  }
  .pointer-events-none {
    pointer-events: none;
  }
  .invisible {
    visibility: hidden;
  }
  .visible {
    visibility: visible;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border-width: 0;
  }
  .absolute {
    position: absolute;
  }
  .fixed {
    position: fixed;
  }
  .relative {
    position: relative;
  }
  .static {
    position: static;
  }
  .sticky {
    position: sticky;
  }
  .inset-0 {
    inset: calc(var(--spacing) * 0);
  }
  .inset-2 {
    inset: calc(var(--spacing) * 2);
  }
  .inset-x-0 {
    inset-inline: calc(var(--spacing) * 0);
  }
  .inset-y-0 {
    inset-block: calc(var(--spacing) * 0);
  }
  .top-0 {
    top: calc(var(--spacing) * 0);
  }
  .top-1 {
    top: calc(var(--spacing) * 1);
  }
  .top-1\/2 {
    top: calc(1/2 * 100%);
  }
  .top-4 {
    top: calc(var(--spacing) * 4);
  }
  .top-8 {
    top: calc(var(--spacing) * 8);
  }
  .top-\[50\%\] {
    top: 50%;
  }
  .right-0 {
    right: calc(var(--spacing) * 0);
  }
  .right-4 {
    right: calc(var(--spacing) * 4);
  }
  .-bottom-5 {
    bottom: calc(var(--spacing) * -5);
  }
  .-bottom-16 {
    bottom: calc(var(--spacing) * -16);
  }
  .bottom-0 {
    bottom: calc(var(--spacing) * 0);
  }
  .left-0 {
    left: calc(var(--spacing) * 0);
  }
  .left-2 {
    left: calc(var(--spacing) * 2);
  }
  .left-4 {
    left: calc(var(--spacing) * 4);
  }
  .left-\[50\%\] {
    left: 50%;
  }
  .z-1 {
    z-index: 1;
  }
  .z-2 {
    z-index: 2;
  }
  .z-10 {
    z-index: 10;
  }
  .z-20 {
    z-index: 20;
  }
  .z-30 {
    z-index: 30;
  }
  .z-50 {
    z-index: 50;
  }
  .z-1000 {
    z-index: 1000;
  }
  .z-\[1000\] {
    z-index: 1000;
  }
  .order-123 {
    order: 123;
  }
  .order-456 {
    order: 456;
  }
  .order-first {
    order: -9999;
  }
  .order-last {
    order: 9999;
  }
  .container {
    width: 100%;
    @media (width >= 40rem) {
      max-width: 40rem;
    }
    @media (width >= 48rem) {
      max-width: 48rem;
    }
    @media (width >= 64rem) {
      max-width: 64rem;
    }
    @media (width >= 80rem) {
      max-width: 80rem;
    }
    @media (width >= 96rem) {
      max-width: 96rem;
    }
  }
  .-m-\[1px\] {
    margin: calc(1px * -1);
  }
  .m-4 {
    margin: calc(var(--spacing) * 4);
  }
  .-mx-1 {
    margin-inline: calc(var(--spacing) * -1);
  }
  .mx-0 {
    margin-inline: calc(var(--spacing) * 0);
  }
  .mx-auto {
    margin-inline: auto;
  }
  .-my-2 {
    margin-block: calc(var(--spacing) * -2);
  }
  .my-0 {
    margin-block: calc(var(--spacing) * 0);
  }
  .my-1 {
    margin-block: calc(var(--spacing) * 1);
  }
  .my-2 {
    margin-block: calc(var(--spacing) * 2);
  }
  .my-3 {
    margin-block: calc(var(--spacing) * 3);
  }
  .my-4 {
    margin-block: calc(var(--spacing) * 4);
  }
  .mt-0 {
    margin-top: calc(var(--spacing) * 0);
  }
  .mt-0\.5 {
    margin-top: calc(var(--spacing) * 0.5);
  }
  .mt-1 {
    margin-top: calc(var(--spacing) * 1);
  }
  .mt-1\.5 {
    margin-top: calc(var(--spacing) * 1.5);
  }
  .mt-2 {
    margin-top: calc(var(--spacing) * 2);
  }
  .mt-3 {
    margin-top: calc(var(--spacing) * 3);
  }
  .mt-4 {
    margin-top: calc(var(--spacing) * 4);
  }
  .mt-5 {
    margin-top: calc(var(--spacing) * 5);
  }
  .mt-6 {
    margin-top: calc(var(--spacing) * 6);
  }
  .mt-10 {
    margin-top: calc(var(--spacing) * 10);
  }
  .mt-auto {
    margin-top: auto;
  }
  .mr-0 {
    margin-right: calc(var(--spacing) * 0);
  }
  .mr-1 {
    margin-right: calc(var(--spacing) * 1);
  }
  .mr-2 {
    margin-right: calc(var(--spacing) * 2);
  }
  .mr-3 {
    margin-right: calc(var(--spacing) * 3);
  }
  .mr-4 {
    margin-right: calc(var(--spacing) * 4);
  }
  .-mb-\[2px\] {
    margin-bottom: calc(2px * -1);
  }
  .mb-1 {
    margin-bottom: calc(var(--spacing) * 1);
  }
  .mb-2 {
    margin-bottom: calc(var(--spacing) * 2);
  }
  .mb-3 {
    margin-bottom: calc(var(--spacing) * 3);
  }
  .mb-4 {
    margin-bottom: calc(var(--spacing) * 4);
  }
  .mb-5 {
    margin-bottom: calc(var(--spacing) * 5);
  }
  .mb-6 {
    margin-bottom: calc(var(--spacing) * 6);
  }
  .mb-8 {
    margin-bottom: calc(var(--spacing) * 8);
  }
  .mb-10 {
    margin-bottom: calc(var(--spacing) * 10);
  }
  .ml-1 {
    margin-left: calc(var(--spacing) * 1);
  }
  .ml-2 {
    margin-left: calc(var(--spacing) * 2);
  }
  .ml-3 {
    margin-left: calc(var(--spacing) * 3);
  }
  .ml-4 {
    margin-left: calc(var(--spacing) * 4);
  }
  .ml-5 {
    margin-left: calc(var(--spacing) * 5);
  }
  .ml-10 {
    margin-left: calc(var(--spacing) * 10);
  }
  .block {
    display: block;
  }
  .flex {
    display: flex;
  }
  .grid {
    display: grid;
  }
  .hidden {
    display: none;
  }
  .inline {
    display: inline;
  }
  .inline-block {
    display: inline-block;
  }
  .inline-flex {
    display: inline-flex;
  }
  .table {
    display: table;
  }
  .field-sizing-content {
    field-sizing: content;
  }
  .aspect-square {
    aspect-ratio: 1 / 1;
  }
  .aspect-video {
    aspect-ratio: var(--aspect-video);
  }
  .size-3 {
    width: calc(var(--spacing) * 3);
    height: calc(var(--spacing) * 3);
  }
  .size-4 {
    width: calc(var(--spacing) * 4);
    height: calc(var(--spacing) * 4);
  }
  .size-5 {
    width: calc(var(--spacing) * 5);
    height: calc(var(--spacing) * 5);
  }
  .size-6 {
    width: calc(var(--spacing) * 6);
    height: calc(var(--spacing) * 6);
  }
  .size-7 {
    width: calc(var(--spacing) * 7);
    height: calc(var(--spacing) * 7);
  }
  .size-8 {
    width: calc(var(--spacing) * 8);
    height: calc(var(--spacing) * 8);
  }
  .size-9 {
    width: calc(var(--spacing) * 9);
    height: calc(var(--spacing) * 9);
  }
  .size-10 {
    width: calc(var(--spacing) * 10);
    height: calc(var(--spacing) * 10);
  }
  .size-11 {
    width: calc(var(--spacing) * 11);
    height: calc(var(--spacing) * 11);
  }
  .size-13 {
    width: calc(var(--spacing) * 13);
    height: calc(var(--spacing) * 13);
  }
  .size-16 {
    width: calc(var(--spacing) * 16);
    height: calc(var(--spacing) * 16);
  }
  .h-1 {
    height: calc(var(--spacing) * 1);
  }
  .h-2 {
    height: calc(var(--spacing) * 2);
  }
  .h-3 {
    height: calc(var(--spacing) * 3);
  }
  .h-4 {
    height: calc(var(--spacing) * 4);
  }
  .h-5 {
    height: calc(var(--spacing) * 5);
  }
  .h-6 {
    height: calc(var(--spacing) * 6);
  }
  .h-7 {
    height: calc(var(--spacing) * 7);
  }
  .h-8 {
    height: calc(var(--spacing) * 8);
  }
  .h-9 {
    height: calc(var(--spacing) * 9);
  }
  .h-10 {
    height: calc(var(--spacing) * 10);
  }
  .h-11 {
    height: calc(var(--spacing) * 11);
  }
  .h-12 {
    height: calc(var(--spacing) * 12);
  }
  .h-13 {
    height: calc(var(--spacing) * 13);
  }
  .h-14 {
    height: calc(var(--spacing) * 14);
  }
  .h-16 {
    height: calc(var(--spacing) * 16);
  }
  .h-17 {
    height: calc(var(--spacing) * 17);
  }
  .h-20 {
    height: calc(var(--spacing) * 20);
  }
  .h-24 {
    height: calc(var(--spacing) * 24);
  }
  .h-64 {
    height: calc(var(--spacing) * 64);
  }
  .h-\[1px\] {
    height: 1px;
  }
  .h-\[20px\] {
    height: 20px;
  }
  .h-\[22px\] {
    height: 22px;
  }
  .h-\[52px\] {
    height: 52px;
  }
  .h-\[60px\] {
    height: 60px;
  }
  .h-\[64px\] {
    height: 64px;
  }
  .h-\[150px\] {
    height: 150px;
  }
  .h-\[calc\(100dvh-70px\)\] {
    height: calc(100dvh - 70px);
  }
  .h-auto {
    height: auto;
  }
  .h-fit {
    height: fit-content;
  }
  .h-full {
    height: 100%;
  }
  .h-min {
    height: min-content;
  }
  .h-px {
    height: 1px;
  }
  .max-h-\(--radix-dropdown-menu-content-available-height\) {
    max-height: var(--radix-dropdown-menu-content-available-height);
  }
  .max-h-64 {
    max-height: calc(var(--spacing) * 64);
  }
  .max-h-96 {
    max-height: calc(var(--spacing) * 96);
  }
  .max-h-\[240px\] {
    max-height: 240px;
  }
  .max-h-\[360px\] {
    max-height: 360px;
  }
  .max-h-\[calc\(100dvh-80px\)\] {
    max-height: calc(100dvh - 80px);
  }
  .max-h-full {
    max-height: 100%;
  }
  .min-h-16 {
    min-height: calc(var(--spacing) * 16);
  }
  .min-h-\[64px\] {
    min-height: 64px;
  }
  .min-h-\[100px\] {
    min-height: 100px;
  }
  .min-h-\[400px\] {
    min-height: 400px;
  }
  .min-h-full {
    min-height: 100%;
  }
  .w-1 {
    width: calc(var(--spacing) * 1);
  }
  .w-1\/2 {
    width: calc(1/2 * 100%);
  }
  .w-1\/3 {
    width: calc(1/3 * 100%);
  }
  .w-2 {
    width: calc(var(--spacing) * 2);
  }
  .w-2\/3 {
    width: calc(2/3 * 100%);
  }
  .w-3 {
    width: calc(var(--spacing) * 3);
  }
  .w-3\/4 {
    width: calc(3/4 * 100%);
  }
  .w-4 {
    width: calc(var(--spacing) * 4);
  }
  .w-5 {
    width: calc(var(--spacing) * 5);
  }
  .w-6 {
    width: calc(var(--spacing) * 6);
  }
  .w-7 {
    width: calc(var(--spacing) * 7);
  }
  .w-8 {
    width: calc(var(--spacing) * 8);
  }
  .w-9 {
    width: calc(var(--spacing) * 9);
  }
  .w-10 {
    width: calc(var(--spacing) * 10);
  }
  .w-11 {
    width: calc(var(--spacing) * 11);
  }
  .w-12 {
    width: calc(var(--spacing) * 12);
  }
  .w-13 {
    width: calc(var(--spacing) * 13);
  }
  .w-16 {
    width: calc(var(--spacing) * 16);
  }
  .w-17 {
    width: calc(var(--spacing) * 17);
  }
  .w-20 {
    width: calc(var(--spacing) * 20);
  }
  .w-24 {
    width: calc(var(--spacing) * 24);
  }
  .w-40 {
    width: calc(var(--spacing) * 40);
  }
  .w-72 {
    width: calc(var(--spacing) * 72);
  }
  .w-\[1px\] {
    width: 1px;
  }
  .w-\[22px\] {
    width: 22px;
  }
  .w-\[32px\] {
    width: 32px;
  }
  .w-\[46px\] {
    width: 46px;
  }
  .w-\[100px\] {
    width: 100px;
  }
  .w-\[124px\] {
    width: 124px;
  }
  .w-\[148px\] {
    width: 148px;
  }
  .w-\[150px\] {
    width: 150px;
  }
  .w-auto {
    width: auto;
  }
  .w-card-width {
    width: var(--spacing-card-width);
  }
  .w-fit {
    width: fit-content;
  }
  .w-full {
    width: 100%;
  }
  .w-max {
    width: max-content;
  }
  .w-min {
    width: min-content;
  }
  .w-screen {
    width: 100vw;
  }
  .max-w-\[532px\] {
    max-width: 532px;
  }
  .max-w-\[calc\(100\%-2rem\)\] {
    max-width: calc(100% - 2rem);
  }
  .max-w-full {
    max-width: 100%;
  }
  .max-w-md {
    max-width: var(--container-md);
  }
  .max-w-xs {
    max-width: var(--container-xs);
  }
  .min-w-0 {
    min-width: calc(var(--spacing) * 0);
  }
  .min-w-4 {
    min-width: calc(var(--spacing) * 4);
  }
  .min-w-5 {
    min-width: calc(var(--spacing) * 5);
  }
  .min-w-6 {
    min-width: calc(var(--spacing) * 6);
  }
  .min-w-7 {
    min-width: calc(var(--spacing) * 7);
  }
  .min-w-9 {
    min-width: calc(var(--spacing) * 9);
  }
  .min-w-11 {
    min-width: calc(var(--spacing) * 11);
  }
  .min-w-13 {
    min-width: calc(var(--spacing) * 13);
  }
  .min-w-\[8rem\] {
    min-width: 8rem;
  }
  .min-w-\[var\(--radix-select-trigger-width\)\] {
    min-width: var(--radix-select-trigger-width);
  }
  .min-w-full {
    min-width: 100%;
  }
  .flex-1 {
    flex: 1;
  }
  .flex-shrink {
    flex-shrink: 1;
  }
  .flex-shrink-0 {
    flex-shrink: 0;
  }
  .shrink-0 {
    flex-shrink: 0;
  }
  .flex-grow {
    flex-grow: 1;
  }
  .grow {
    flex-grow: 1;
  }
  .grow-0 {
    flex-grow: 0;
  }
  .border-collapse {
    border-collapse: collapse;
  }
  .origin-\(--radix-dropdown-menu-content-transform-origin\) {
    transform-origin: var(--radix-dropdown-menu-content-transform-origin);
  }
  .origin-\(--radix-popover-content-transform-origin\) {
    transform-origin: var(--radix-popover-content-transform-origin);
  }
  .origin-\(--radix-tooltip-content-transform-origin\) {
    transform-origin: var(--radix-tooltip-content-transform-origin);
  }
  .origin-bottom {
    transform-origin: bottom;
  }
  .origin-top {
    transform-origin: top;
  }
  .-translate-x-1 {
    --tw-translate-x: calc(var(--spacing) * -1);
    translate: var(--tw-translate-x) var(--tw-translate-y);
  }
  .translate-x-0 {
    --tw-translate-x: calc(var(--spacing) * 0);
    translate: var(--tw-translate-x) var(--tw-translate-y);
  }
  .translate-x-\[-50\%\] {
    --tw-translate-x: -50%;
    translate: var(--tw-translate-x) var(--tw-translate-y);
  }
  .-translate-y-1 {
    --tw-translate-y: calc(var(--spacing) * -1);
    translate: var(--tw-translate-x) var(--tw-translate-y);
  }
  .translate-y-\[-50\%\] {
    --tw-translate-y: -50%;
    translate: var(--tw-translate-x) var(--tw-translate-y);
  }
  .rotate-180 {
    rotate: 180deg;
  }
  .transform {
    transform: var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,);
  }
  .animate-in {
    animation: enter var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none);
  }
  .animate-pulse {
    animation: var(--animate-pulse);
  }
  .animate-shimmer {
    animation: var(--animate-shimmer);
  }
  .animate-skeleton {
    animation: skeleton 3s ease infinite;
  }
  .animate-spin {
    animation: var(--animate-spin);
  }
  .cursor-default {
    cursor: default;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .cursor-text {
    cursor: text;
  }
  .resize {
    resize: both;
  }
  .resize-none {
    resize: none;
  }
  .resize-y {
    resize: vertical;
  }
  .list-disc {
    list-style-type: disc;
  }
  .list-none {
    list-style-type: none;
  }
  .appearance-none {
    appearance: none;
  }
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .grid-cols-5 {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  .grid-cols-\[repeat\(auto-fill\,minmax\(150px\,1fr\)\)\] {
    grid-template-columns: repeat(auto-fill,minmax(150px,1fr));
  }
  .flex-col {
    flex-direction: column;
  }
  .flex-col-reverse {
    flex-direction: column-reverse;
  }
  .flex-row {
    flex-direction: row;
  }
  .flex-wrap {
    flex-wrap: wrap;
  }
  .place-content-center {
    place-content: center;
  }
  .place-items-center {
    place-items: center;
  }
  .items-center {
    align-items: center;
  }
  .items-end {
    align-items: flex-end;
  }
  .items-start {
    align-items: flex-start;
  }
  .items-stretch {
    align-items: stretch;
  }
  .justify-between {
    justify-content: space-between;
  }
  .justify-center {
    justify-content: center;
  }
  .justify-end {
    justify-content: flex-end;
  }
  .justify-start {
    justify-content: flex-start;
  }
  .gap-0 {
    gap: calc(var(--spacing) * 0);
  }
  .gap-0\.5 {
    gap: calc(var(--spacing) * 0.5);
  }
  .gap-1 {
    gap: calc(var(--spacing) * 1);
  }
  .gap-1\.5 {
    gap: calc(var(--spacing) * 1.5);
  }
  .gap-2 {
    gap: calc(var(--spacing) * 2);
  }
  .gap-3 {
    gap: calc(var(--spacing) * 3);
  }
  .gap-4 {
    gap: calc(var(--spacing) * 4);
  }
  .gap-5 {
    gap: calc(var(--spacing) * 5);
  }
  .gap-6 {
    gap: calc(var(--spacing) * 6);
  }
  .gap-8 {
    gap: calc(var(--spacing) * 8);
  }
  .gap-10 {
    gap: calc(var(--spacing) * 10);
  }
  .space-y-2 {
    :where(& > :not(:last-child)) {
      --tw-space-y-reverse: 0;
      margin-block-start: calc(calc(var(--spacing) * 2) * var(--tw-space-y-reverse));
      margin-block-end: calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-y-reverse)));
    }
  }
  .space-y-3 {
    :where(& > :not(:last-child)) {
      --tw-space-y-reverse: 0;
      margin-block-start: calc(calc(var(--spacing) * 3) * var(--tw-space-y-reverse));
      margin-block-end: calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-y-reverse)));
    }
  }
  .space-y-4 {
    :where(& > :not(:last-child)) {
      --tw-space-y-reverse: 0;
      margin-block-start: calc(calc(var(--spacing) * 4) * var(--tw-space-y-reverse));
      margin-block-end: calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-y-reverse)));
    }
  }
  .self-center {
    align-self: center;
  }
  .justify-self-center {
    justify-self: center;
  }
  .justify-self-end {
    justify-self: flex-end;
  }
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .overflow-auto {
    overflow: auto;
  }
  .overflow-hidden {
    overflow: hidden;
  }
  .overflow-scroll {
    overflow: scroll;
  }
  .overflow-visible {
    overflow: visible;
  }
  .overflow-x-auto {
    overflow-x: auto;
  }
  .overflow-x-hidden {
    overflow-x: hidden;
  }
  .overflow-x-scroll {
    overflow-x: scroll;
  }
  .overflow-y-auto {
    overflow-y: auto;
  }
  .overscroll-x-contain {
    overscroll-behavior-x: contain;
  }
  .overscroll-y-contain {
    overscroll-behavior-y: contain;
  }
  .rounded {
    border-radius: 0.25rem;
  }
  .rounded-2xl {
    border-radius: var(--radius-2xl);
  }
  .rounded-\[12px\] {
    border-radius: 12px;
  }
  .rounded-full {
    border-radius: calc(infinity * 1px);
  }
  .rounded-lg {
    border-radius: var(--radius-lg);
  }
  .rounded-md {
    border-radius: var(--radius-md);
  }
  .rounded-none {
    border-radius: 0;
  }
  .rounded-sm {
    border-radius: var(--radius-sm);
  }
  .rounded-xl {
    border-radius: var(--radius-xl);
  }
  .rounded-xs {
    border-radius: var(--radius-xs);
  }
  .rounded-t-2xl {
    border-top-left-radius: var(--radius-2xl);
    border-top-right-radius: var(--radius-2xl);
  }
  .rounded-t-sm {
    border-top-left-radius: var(--radius-sm);
    border-top-right-radius: var(--radius-sm);
  }
  .rounded-b-none {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
  .border {
    border-style: var(--tw-border-style);
    border-width: 1px;
  }
  .border-0 {
    border-style: var(--tw-border-style);
    border-width: 0px;
  }
  .border-1 {
    border-style: var(--tw-border-style);
    border-width: 1px;
  }
  .border-2 {
    border-style: var(--tw-border-style);
    border-width: 2px;
  }
  .border-t {
    border-top-style: var(--tw-border-style);
    border-top-width: 1px;
  }
  .border-t-1 {
    border-top-style: var(--tw-border-style);
    border-top-width: 1px;
  }
  .border-r {
    border-right-style: var(--tw-border-style);
    border-right-width: 1px;
  }
  .border-b {
    border-bottom-style: var(--tw-border-style);
    border-bottom-width: 1px;
  }
  .border-b-1 {
    border-bottom-style: var(--tw-border-style);
    border-bottom-width: 1px;
  }
  .border-b-2 {
    border-bottom-style: var(--tw-border-style);
    border-bottom-width: 2px;
  }
  .border-l {
    border-left-style: var(--tw-border-style);
    border-left-width: 1px;
  }
  .border-dashed {
    --tw-border-style: dashed;
    border-style: dashed;
  }
  .border-none {
    --tw-border-style: none;
    border-style: none;
  }
  .border-solid {
    --tw-border-style: solid;
    border-style: solid;
  }
  .border-background-primary {
    border-color: var(--seq-color-background-primary);
  }
  .border-blue-900 {
    border-color: var(--color-blue-900);
  }
  .border-border-base {
    border-color: var(--color-border-base);
  }
  .border-border-button {
    border-color: var(--seq-color-border-button);
  }
  .border-border-card {
    border-color: var(--seq-color-border-card);
  }
  .border-border-focus {
    border-color: var(--color-border-focus);
  }
  .border-border-normal {
    border-color: var(--seq-color-border-normal);
  }
  .border-orange-900 {
    border-color: var(--color-orange-900);
  }
  .border-red-900 {
    border-color: var(--color-red-900);
  }
  .border-transparent {
    border-color: transparent;
  }
  .border-violet-600 {
    border-color: var(--color-violet-600);
  }
  .border-yellow-900 {
    border-color: var(--color-yellow-900);
  }
  .border-b-primary {
    border-bottom-color: var(--seq-color-primary);
  }
  .border-b-transparent {
    border-bottom-color: transparent;
  }
  .bg-\[\#2b0000\] {
    background-color: #2b0000;
  }
  .bg-\[\#35a554\] {
    background-color: #35a554;
  }
  .bg-\[hsla\(39\,71\%\,40\%\,0\.3\)\] {
    background-color: hsla(39,71%,40%,0.3);
  }
  .bg-\[hsla\(247\,100\%\,75\%\,0\.3\)\] {
    background-color: hsla(247,100%,75%,0.3);
  }
  .bg-background-active {
    background-color: var(--seq-color-background-active);
  }
  .bg-background-input {
    background-color: var(--seq-color-background-input);
  }
  .bg-background-inverse {
    background-color: var(--seq-color-background-inverse);
  }
  .bg-background-muted {
    background-color: var(--seq-color-background-muted);
  }
  .bg-background-overlay {
    background-color: var(--seq-color-background-overlay);
  }
  .bg-background-primary {
    background-color: var(--seq-color-background-primary);
  }
  .bg-background-primary\/70 {
    background-color: var(--seq-color-background-primary);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--seq-color-background-primary) 70%, transparent);
    }
  }
  .bg-background-raised {
    background-color: var(--seq-color-background-raised);
  }
  .bg-background-secondary {
    background-color: var(--seq-color-background-secondary);
  }
  .bg-blue-500 {
    background-color: var(--color-blue-500);
  }
  .bg-border-normal {
    background-color: var(--seq-color-border-normal);
  }
  .bg-destructive {
    background-color: var(--seq-color-destructive);
  }
  .bg-gray-50 {
    background-color: var(--color-gray-50);
  }
  .bg-green-500 {
    background-color: var(--color-green-500);
  }
  .bg-info {
    background-color: var(--seq-color-info);
  }
  .bg-negative {
    background-color: var(--seq-color-negative);
  }
  .bg-overlay-light {
    background-color: var(--color-overlay-light);
  }
  .bg-positive {
    background-color: var(--seq-color-positive);
  }
  .bg-primary {
    background-color: var(--seq-color-primary);
  }
  .bg-primary\/20 {
    background-color: var(--seq-color-primary);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--seq-color-primary) 20%, transparent);
    }
  }
  .bg-primary\/50 {
    background-color: var(--seq-color-primary);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--seq-color-primary) 50%, transparent);
    }
  }
  .bg-red-500 {
    background-color: var(--color-red-500);
  }
  .bg-red-900 {
    background-color: var(--color-red-900);
  }
  .bg-red-950 {
    background-color: var(--color-red-950);
  }
  .bg-surface-neutral {
    background-color: var(--color-surface-neutral);
  }
  .bg-transparent {
    background-color: transparent;
  }
  .bg-warning {
    background-color: var(--seq-color-warning);
  }
  .bg-white {
    background-color: var(--color-white);
  }
  .bg-zinc-950 {
    background-color: var(--color-zinc-950);
  }
  .bg-gradient-primary {
    background-image: var(--seq-color-gradient-primary);
  }
  .bg-gradient-secondary {
    background-image: var(--seq-color-gradient-secondary);
  }
  .bg-gradient-skeleton {
    background-image: var(--seq-color-gradient-skeleton);
  }
  .bg-none {
    background-image: none;
  }
  .\[mask-image\:radial-gradient\(circle_at_82\%_82\%\,transparent_22\%\,black_0\)\] {
    mask-image: radial-gradient(circle at 82% 82%,transparent 22%,black 0);
  }
  .bg-\[length\:400\%_400\%\] {
    background-size: 400% 400%;
  }
  .bg-no-repeat {
    background-repeat: no-repeat;
  }
  .bg-origin-border {
    background-origin: border-box;
  }
  .fill-background-raised {
    fill: var(--seq-color-background-raised);
  }
  .fill-primary {
    fill: var(--seq-color-primary);
  }
  .object-contain {
    object-fit: contain;
  }
  .object-cover {
    object-fit: cover;
  }
  .p-0 {
    padding: calc(var(--spacing) * 0);
  }
  .p-0\.75 {
    padding: calc(var(--spacing) * 0.75);
  }
  .p-1 {
    padding: calc(var(--spacing) * 1);
  }
  .p-2 {
    padding: calc(var(--spacing) * 2);
  }
  .p-3 {
    padding: calc(var(--spacing) * 3);
  }
  .p-4 {
    padding: calc(var(--spacing) * 4);
  }
  .p-5 {
    padding: calc(var(--spacing) * 5);
  }
  .p-6 {
    padding: calc(var(--spacing) * 6);
  }
  .p-7 {
    padding: calc(var(--spacing) * 7);
  }
  .p-8 {
    padding: calc(var(--spacing) * 8);
  }
  .p-\[10px\] {
    padding: 10px;
  }
  .px-0 {
    padding-inline: calc(var(--spacing) * 0);
  }
  .px-1 {
    padding-inline: calc(var(--spacing) * 1);
  }
  .px-2 {
    padding-inline: calc(var(--spacing) * 2);
  }
  .px-3 {
    padding-inline: calc(var(--spacing) * 3);
  }
  .px-4 {
    padding-inline: calc(var(--spacing) * 4);
  }
  .px-5 {
    padding-inline: calc(var(--spacing) * 5);
  }
  .px-6 {
    padding-inline: calc(var(--spacing) * 6);
  }
  .px-10 {
    padding-inline: calc(var(--spacing) * 10);
  }
  .py-1 {
    padding-block: calc(var(--spacing) * 1);
  }
  .py-1\.5 {
    padding-block: calc(var(--spacing) * 1.5);
  }
  .py-2 {
    padding-block: calc(var(--spacing) * 2);
  }
  .py-3 {
    padding-block: calc(var(--spacing) * 3);
  }
  .py-4 {
    padding-block: calc(var(--spacing) * 4);
  }
  .py-6 {
    padding-block: calc(var(--spacing) * 6);
  }
  .pt-0 {
    padding-top: calc(var(--spacing) * 0);
  }
  .pt-1 {
    padding-top: calc(var(--spacing) * 1);
  }
  .pt-2 {
    padding-top: calc(var(--spacing) * 2);
  }
  .pt-3 {
    padding-top: calc(var(--spacing) * 3);
  }
  .pt-4 {
    padding-top: calc(var(--spacing) * 4);
  }
  .pt-5 {
    padding-top: calc(var(--spacing) * 5);
  }
  .pt-\[60px\] {
    padding-top: 60px;
  }
  .pr-0 {
    padding-right: calc(var(--spacing) * 0);
  }
  .pr-2 {
    padding-right: calc(var(--spacing) * 2);
  }
  .pr-3 {
    padding-right: calc(var(--spacing) * 3);
  }
  .pr-4 {
    padding-right: calc(var(--spacing) * 4);
  }
  .pb-0 {
    padding-bottom: calc(var(--spacing) * 0);
  }
  .pb-2 {
    padding-bottom: calc(var(--spacing) * 2);
  }
  .pb-3 {
    padding-bottom: calc(var(--spacing) * 3);
  }
  .pb-4 {
    padding-bottom: calc(var(--spacing) * 4);
  }
  .pb-5 {
    padding-bottom: calc(var(--spacing) * 5);
  }
  .pb-6 {
    padding-bottom: calc(var(--spacing) * 6);
  }
  .pb-\[calc\(env\(safe-area-inset-bottom\)\)\] {
    padding-bottom: calc(env(safe-area-inset-bottom));
  }
  .pl-1 {
    padding-left: calc(var(--spacing) * 1);
  }
  .pl-2 {
    padding-left: calc(var(--spacing) * 2);
  }
  .pl-3 {
    padding-left: calc(var(--spacing) * 3);
  }
  .pl-4 {
    padding-left: calc(var(--spacing) * 4);
  }
  .pl-6 {
    padding-left: calc(var(--spacing) * 6);
  }
  .text-center {
    text-align: center;
  }
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .type-normal {
    font-family: "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    font-size: var(--text-sm);
    line-height: var(--tw-leading, var(--text-sm--line-height));
    --tw-leading: calc(var(--spacing) * 5);
    line-height: calc(var(--spacing) * 5);
    --tw-font-weight: var(--font-weight-medium);
    font-weight: var(--font-weight-medium);
    --tw-tracking: var(--tracking-wide);
    letter-spacing: var(--tracking-wide);
  }
  .type-small {
    font-family: "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    font-size: var(--text-xs);
    line-height: var(--tw-leading, var(--text-xs--line-height));
    --tw-leading: calc(var(--spacing) * 4);
    line-height: calc(var(--spacing) * 4);
    --tw-font-weight: var(--font-weight-medium);
    font-weight: var(--font-weight-medium);
    --tw-tracking: var(--tracking-wide);
    letter-spacing: var(--tracking-wide);
  }
  .font-body {
    font-family: "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  }
  .font-mono {
    font-family: "Roboto", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }
  .text-2xl {
    font-size: var(--text-2xl);
    line-height: var(--tw-leading, var(--text-2xl--line-height));
  }
  .text-4xl {
    font-size: var(--text-4xl);
    line-height: var(--tw-leading, var(--text-4xl--line-height));
  }
  .text-6xl {
    font-size: var(--text-6xl);
    line-height: var(--tw-leading, var(--text-6xl--line-height));
  }
  .text-base {
    font-size: var(--text-base);
    line-height: var(--tw-leading, var(--text-base--line-height));
  }
  .text-lg {
    font-size: var(--text-lg);
    line-height: var(--tw-leading, var(--text-lg--line-height));
  }
  .text-sm {
    font-size: var(--text-sm);
    line-height: var(--tw-leading, var(--text-sm--line-height));
  }
  .text-xl {
    font-size: var(--text-xl);
    line-height: var(--tw-leading, var(--text-xl--line-height));
  }
  .text-xs {
    font-size: var(--text-xs);
    line-height: var(--tw-leading, var(--text-xs--line-height));
  }
  .text-\[0\.625rem\] {
    font-size: 0.625rem;
  }
  .text-\[4px\] {
    font-size: 4px;
  }
  .text-\[6px\] {
    font-size: 6px;
  }
  .text-\[9px\] {
    font-size: 9px;
  }
  .text-\[11px\] {
    font-size: 11px;
  }
  .text-\[16px\] {
    font-size: 16px;
  }
  .leading-0 {
    --tw-leading: calc(var(--spacing) * 0);
    line-height: calc(var(--spacing) * 0);
  }
  .leading-4 {
    --tw-leading: calc(var(--spacing) * 4);
    line-height: calc(var(--spacing) * 4);
  }
  .leading-5 {
    --tw-leading: calc(var(--spacing) * 5);
    line-height: calc(var(--spacing) * 5);
  }
  .leading-6 {
    --tw-leading: calc(var(--spacing) * 6);
    line-height: calc(var(--spacing) * 6);
  }
  .leading-7 {
    --tw-leading: calc(var(--spacing) * 7);
    line-height: calc(var(--spacing) * 7);
  }
  .leading-8 {
    --tw-leading: calc(var(--spacing) * 8);
    line-height: calc(var(--spacing) * 8);
  }
  .leading-10 {
    --tw-leading: calc(var(--spacing) * 10);
    line-height: calc(var(--spacing) * 10);
  }
  .leading-15 {
    --tw-leading: calc(var(--spacing) * 15);
    line-height: calc(var(--spacing) * 15);
  }
  .leading-relaxed {
    --tw-leading: var(--leading-relaxed);
    line-height: var(--leading-relaxed);
  }
  .leading-snug {
    --tw-leading: var(--leading-snug);
    line-height: var(--leading-snug);
  }
  .font-bold {
    --tw-font-weight: var(--font-weight-bold);
    font-weight: var(--font-weight-bold);
  }
  .font-medium {
    --tw-font-weight: var(--font-weight-medium);
    font-weight: var(--font-weight-medium);
  }
  .font-normal {
    --tw-font-weight: var(--font-weight-normal);
    font-weight: var(--font-weight-normal);
  }
  .font-semibold {
    --tw-font-weight: var(--font-weight-semibold);
    font-weight: var(--font-weight-semibold);
  }
  .tracking-normal {
    --tw-tracking: var(--tracking-normal);
    letter-spacing: var(--tracking-normal);
  }
  .tracking-wide {
    --tw-tracking: var(--tracking-wide);
    letter-spacing: var(--tracking-wide);
  }
  .tracking-widest {
    --tw-tracking: var(--tracking-widest);
    letter-spacing: var(--tracking-widest);
  }
  .text-wrap {
    text-wrap: wrap;
  }
  .break-words {
    overflow-wrap: break-word;
  }
  .text-ellipsis {
    text-overflow: ellipsis;
  }
  .whitespace-nowrap {
    white-space: nowrap;
  }
  .whitespace-pre-wrap {
    white-space: pre-wrap;
  }
  .text-amber-500 {
    color: var(--color-amber-500);
  }
  .text-background-primary {
    color: var(--seq-color-background-primary);
  }
  .text-background-raised {
    color: var(--seq-color-background-raised);
  }
  .text-background-secondary {
    color: var(--seq-color-background-secondary);
  }
  .text-black {
    color: var(--color-black);
  }
  .text-blue-300 {
    color: var(--color-blue-300);
  }
  .text-blue-400 {
    color: var(--color-blue-400);
  }
  .text-blue-500 {
    color: var(--color-blue-500);
  }
  .text-current {
    color: currentcolor;
  }
  .text-destructive {
    color: var(--seq-color-destructive);
  }
  .text-gray-300 {
    color: var(--color-gray-300);
  }
  .text-gray-400 {
    color: var(--color-gray-400);
  }
  .text-gray-500 {
    color: var(--color-gray-500);
  }
  .text-gray-600 {
    color: var(--color-gray-600);
  }
  .text-indigo-400 {
    color: var(--color-indigo-400);
  }
  .text-info {
    color: var(--seq-color-info);
  }
  .text-inherit {
    color: inherit;
  }
  .text-inverse {
    color: var(--seq-color-inverse);
  }
  .text-muted {
    color: var(--seq-color-muted);
  }
  .text-negative {
    color: var(--seq-color-negative);
  }
  .text-orange-300 {
    color: var(--color-orange-300);
  }
  .text-orange-400 {
    color: var(--color-orange-400);
  }
  .text-orange-500 {
    color: var(--color-orange-500);
  }
  .text-positive {
    color: var(--seq-color-positive);
  }
  .text-primary {
    color: var(--seq-color-primary);
  }
  .text-red-100 {
    color: var(--color-red-100);
  }
  .text-red-300 {
    color: var(--color-red-300);
  }
  .text-red-400 {
    color: var(--color-red-400);
  }
  .text-red-500 {
    color: var(--color-red-500);
  }
  .text-secondary {
    color: var(--seq-color-secondary);
  }
  .text-text-50 {
    color: var(--color-text-50);
  }
  .text-text-80 {
    color: var(--color-text-80);
  }
  .text-text-100 {
    color: var(--color-text-100);
  }
  .text-violet-400 {
    color: var(--color-violet-400);
  }
  .text-warning {
    color: var(--seq-color-warning);
  }
  .text-white {
    color: var(--color-white);
  }
  .text-yellow-300 {
    color: var(--color-yellow-300);
  }
  .text-yellow-400 {
    color: var(--color-yellow-400);
  }
  .text-yellow-500 {
    color: var(--color-yellow-500);
  }
  .capitalize {
    text-transform: capitalize;
  }
  .uppercase {
    text-transform: uppercase;
  }
  .italic {
    font-style: italic;
  }
  .no-underline {
    text-decoration-line: none;
  }
  .underline {
    text-decoration-line: underline;
  }
  .placeholder-muted {
    &::placeholder {
      color: var(--seq-color-muted);
    }
  }
  .caret-transparent {
    caret-color: transparent;
  }
  .opacity-0 {
    opacity: 0%;
  }
  .opacity-50 {
    opacity: 50%;
  }
  .opacity-70 {
    opacity: 70%;
  }
  .opacity-75 {
    opacity: 75%;
  }
  .opacity-100 {
    opacity: 100%;
  }
  .opacity-\[0\.4_\!important\] {
    opacity: 0.4 !important;
  }
  .shadow {
    --tw-shadow: 0 1px 3px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .shadow-lg {
    --tw-shadow: 0 10px 15px -3px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 4px 6px -4px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .shadow-primary {
    --tw-shadow: 0 0 16px 0 var(--tw-shadow-color, var(--seq-color-drop-shadow));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .shadow-sm {
    --tw-shadow: 0 1px 3px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .ring-1 {
    --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .ring-2 {
    --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .ring-border-focus {
    --tw-ring-color: var(--color-border-focus);
  }
  .ring-border-normal {
    --tw-ring-color: var(--seq-color-border-normal);
  }
  .ring-white {
    --tw-ring-color: var(--color-white);
  }
  .outline-hidden {
    --tw-outline-style: none;
    outline-style: none;
    @media (forced-colors: active) {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }
  }
  .outline {
    outline-style: var(--tw-outline-style);
    outline-width: 1px;
  }
  .outline-offset-1 {
    outline-offset: 1px;
  }
  .outline-offset-\[-2px\] {
    outline-offset: -2px;
  }
  .blur {
    --tw-blur: blur(8px);
    filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,);
  }
  .blur-xs {
    --tw-blur: blur(var(--blur-xs));
    filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,);
  }
  .filter {
    filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,);
  }
  .backdrop-blur {
    --tw-backdrop-blur: blur(8px);
    -webkit-backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
    backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
  }
  .backdrop-blur-md {
    --tw-backdrop-blur: blur(var(--blur-md));
    -webkit-backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
    backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
  }
  .backdrop-blur-xs {
    --tw-backdrop-blur: blur(var(--blur-xs));
    -webkit-backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
    backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
  }
  .backdrop-filter {
    -webkit-backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
    backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
  }
  .transition {
    transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter, display, content-visibility, overlay, pointer-events;
    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
    transition-duration: var(--tw-duration, var(--default-transition-duration));
  }
  .transition-all {
    transition-property: all;
    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
    transition-duration: var(--tw-duration, var(--default-transition-duration));
  }
  .transition-colors {
    transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to;
    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
    transition-duration: var(--tw-duration, var(--default-transition-duration));
  }
  .transition-opacity {
    transition-property: opacity;
    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
    transition-duration: var(--tw-duration, var(--default-transition-duration));
  }
  .transition-shadow {
    transition-property: box-shadow;
    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
    transition-duration: var(--tw-duration, var(--default-transition-duration));
  }
  .transition-transform {
    transition-property: transform, translate, scale, rotate;
    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
    transition-duration: var(--tw-duration, var(--default-transition-duration));
  }
  .transition-none {
    transition-property: none;
  }
  .duration-100 {
    --tw-duration: 100ms;
    transition-duration: 100ms;
  }
  .duration-200 {
    --tw-duration: 200ms;
    transition-duration: 200ms;
  }
  .ease-in-out {
    --tw-ease: var(--ease-in-out);
    transition-timing-function: var(--ease-in-out);
  }
  .ease-out {
    --tw-ease: var(--ease-out);
    transition-timing-function: var(--ease-out);
  }
  .will-change-transform {
    will-change: transform;
  }
  .fade-in-0 {
    --tw-enter-opacity: calc(0/100);
    --tw-enter-opacity: 0;
  }
  .outline-none {
    --tw-outline-style: none;
    outline-style: none;
  }
  .select-none {
    -webkit-user-select: none;
    user-select: none;
  }
  .zoom-in-95 {
    --tw-enter-scale: calc(95*1%);
    --tw-enter-scale: .95;
  }
  .paused {
    animation-play-state: paused;
  }
  .ring-inset {
    --tw-ring-inset: inset;
  }
  .running {
    animation-play-state: running;
  }
  .group-focus-within\/input-group\:opacity-0 {
    &:is(:where(.group\/input-group):focus-within *) {
      opacity: 0%;
    }
  }
  .group-hover\:translate-y-\[-64px\] {
    &:is(:where(.group):hover *) {
      @media (hover: hover) {
        --tw-translate-y: -64px;
        translate: var(--tw-translate-x) var(--tw-translate-y);
      }
    }
  }
  .group-hover\:scale-hover {
    &:is(:where(.group):hover *) {
      @media (hover: hover) {
        --tw-scale-x: var(--scale-hover);
        --tw-scale-y: var(--scale-hover);
        --tw-scale-z: var(--scale-hover);
        scale: var(--tw-scale-x) var(--tw-scale-y);
      }
    }
  }
  .group-has-\[\[data-orientation\=horizontal\]\]\/field\:text-balance {
    &:is(:where(.group\/field):has(*:is([data-orientation=horizontal])) *) {
      text-wrap: balance;
    }
  }
  .group-has-\[\>input\]\/input-group\:pt-2\.5 {
    &:is(:where(.group\/input-group):has(>input) *) {
      padding-top: calc(var(--spacing) * 2.5);
    }
  }
  .group-has-\[\>input\]\/input-group\:pb-2\.5 {
    &:is(:where(.group\/input-group):has(>input) *) {
      padding-bottom: calc(var(--spacing) * 2.5);
    }
  }
  .group-data-\[disabled\=true\]\:pointer-events-none {
    &:is(:where(.group)[data-disabled="true"] *) {
      pointer-events: none;
    }
  }
  .group-data-\[disabled\=true\]\:opacity-50 {
    &:is(:where(.group)[data-disabled="true"] *) {
      opacity: 50%;
    }
  }
  .group-data-\[disabled\=true\]\/field\:opacity-50 {
    &:is(:where(.group\/field)[data-disabled="true"] *) {
      opacity: 50%;
    }
  }
  .group-data-\[disabled\=true\]\/input-group\:opacity-50 {
    &:is(:where(.group\/input-group)[data-disabled="true"] *) {
      opacity: 50%;
    }
  }
  .group-data-\[variant\=outline\]\/field-group\:-mb-2 {
    &:is(:where(.group\/field-group)[data-variant="outline"] *) {
      margin-bottom: calc(var(--spacing) * -2);
    }
  }
  .peer-disabled\:cursor-not-allowed {
    &:is(:where(.peer):disabled ~ *) {
      cursor: not-allowed;
    }
  }
  .peer-disabled\:opacity-50 {
    &:is(:where(.peer):disabled ~ *) {
      opacity: 50%;
    }
  }
  .selection\:bg-transparent {
    & *::selection {
      background-color: transparent;
    }
    &::selection {
      background-color: transparent;
    }
  }
  .file\:inline-flex {
    &::file-selector-button {
      display: inline-flex;
    }
  }
  .file\:h-13 {
    &::file-selector-button {
      height: calc(var(--spacing) * 13);
    }
  }
  .file\:border-0 {
    &::file-selector-button {
      border-style: var(--tw-border-style);
      border-width: 0px;
    }
  }
  .file\:bg-transparent {
    &::file-selector-button {
      background-color: transparent;
    }
  }
  .file\:text-sm {
    &::file-selector-button {
      font-size: var(--text-sm);
      line-height: var(--tw-leading, var(--text-sm--line-height));
    }
  }
  .file\:font-medium {
    &::file-selector-button {
      --tw-font-weight: var(--font-weight-medium);
      font-weight: var(--font-weight-medium);
    }
  }
  .file\:text-primary {
    &::file-selector-button {
      color: var(--seq-color-primary);
    }
  }
  .placeholder\:text-muted {
    &::placeholder {
      color: var(--seq-color-muted);
    }
  }
  .before\:pointer-events-none {
    &::before {
      content: var(--tw-content);
      pointer-events: none;
    }
  }
  .before\:absolute {
    &::before {
      content: var(--tw-content);
      position: absolute;
    }
  }
  .before\:-top-4 {
    &::before {
      content: var(--tw-content);
      top: calc(var(--spacing) * -4);
    }
  }
  .before\:top-0 {
    &::before {
      content: var(--tw-content);
      top: calc(var(--spacing) * 0);
    }
  }
  .before\:-bottom-4 {
    &::before {
      content: var(--tw-content);
      bottom: calc(var(--spacing) * -4);
    }
  }
  .before\:left-0 {
    &::before {
      content: var(--tw-content);
      left: calc(var(--spacing) * 0);
    }
  }
  .before\:z-10 {
    &::before {
      content: var(--tw-content);
      z-index: 10;
    }
  }
  .before\:z-\[11\] {
    &::before {
      content: var(--tw-content);
      z-index: 11;
    }
  }
  .before\:hidden {
    &::before {
      content: var(--tw-content);
      display: none;
    }
  }
  .before\:h-4 {
    &::before {
      content: var(--tw-content);
      height: calc(var(--spacing) * 4);
    }
  }
  .before\:h-full {
    &::before {
      content: var(--tw-content);
      height: 100%;
    }
  }
  .before\:w-4 {
    &::before {
      content: var(--tw-content);
      width: calc(var(--spacing) * 4);
    }
  }
  .before\:w-full {
    &::before {
      content: var(--tw-content);
      width: 100%;
    }
  }
  .before\:bg-linear-to-l {
    &::before {
      content: var(--tw-content);
      --tw-gradient-position: to left;
      @supports (background-image: linear-gradient(in lab, red, red)) {
        --tw-gradient-position: to left in oklab;
      }
      background-image: linear-gradient(var(--tw-gradient-stops));
    }
  }
  .before\:bg-linear-to-t {
    &::before {
      content: var(--tw-content);
      --tw-gradient-position: to top;
      @supports (background-image: linear-gradient(in lab, red, red)) {
        --tw-gradient-position: to top in oklab;
      }
      background-image: linear-gradient(var(--tw-gradient-stops));
    }
  }
  .before\:bg-gradient-to-b {
    &::before {
      content: var(--tw-content);
      --tw-gradient-position: to bottom in oklab;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }
  }
  .before\:bg-gradient-to-t {
    &::before {
      content: var(--tw-content);
      --tw-gradient-position: to top in oklab;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }
  }
  .before\:from-transparent {
    &::before {
      content: var(--tw-content);
      --tw-gradient-from: transparent;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }
  }
  .before\:to-background-primary {
    &::before {
      content: var(--tw-content);
      --tw-gradient-to: var(--seq-color-background-primary);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }
  }
  .before\:to-background-primary\/70 {
    &::before {
      content: var(--tw-content);
      --tw-gradient-to: var(--seq-color-background-primary);
      @supports (color: color-mix(in lab, red, red)) {
        --tw-gradient-to: color-mix(in oklab, var(--seq-color-background-primary) 70%, transparent);
      }
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }
  }
  .after\:pointer-events-none {
    &::after {
      content: var(--tw-content);
      pointer-events: none;
    }
  }
  .after\:absolute {
    &::after {
      content: var(--tw-content);
      position: absolute;
    }
  }
  .after\:top-0 {
    &::after {
      content: var(--tw-content);
      top: calc(var(--spacing) * 0);
    }
  }
  .after\:right-0 {
    &::after {
      content: var(--tw-content);
      right: calc(var(--spacing) * 0);
    }
  }
  .after\:bottom-0 {
    &::after {
      content: var(--tw-content);
      bottom: calc(var(--spacing) * 0);
    }
  }
  .after\:left-0 {
    &::after {
      content: var(--tw-content);
      left: calc(var(--spacing) * 0);
    }
  }
  .after\:z-10 {
    &::after {
      content: var(--tw-content);
      z-index: 10;
    }
  }
  .after\:hidden {
    &::after {
      content: var(--tw-content);
      display: none;
    }
  }
  .after\:h-4 {
    &::after {
      content: var(--tw-content);
      height: calc(var(--spacing) * 4);
    }
  }
  .after\:h-full {
    &::after {
      content: var(--tw-content);
      height: 100%;
    }
  }
  .after\:w-4 {
    &::after {
      content: var(--tw-content);
      width: calc(var(--spacing) * 4);
    }
  }
  .after\:w-full {
    &::after {
      content: var(--tw-content);
      width: 100%;
    }
  }
  .after\:bg-linear-to-b {
    &::after {
      content: var(--tw-content);
      --tw-gradient-position: to bottom;
      @supports (background-image: linear-gradient(in lab, red, red)) {
        --tw-gradient-position: to bottom in oklab;
      }
      background-image: linear-gradient(var(--tw-gradient-stops));
    }
  }
  .after\:bg-linear-to-r {
    &::after {
      content: var(--tw-content);
      --tw-gradient-position: to right;
      @supports (background-image: linear-gradient(in lab, red, red)) {
        --tw-gradient-position: to right in oklab;
      }
      background-image: linear-gradient(var(--tw-gradient-stops));
    }
  }
  .after\:from-transparent {
    &::after {
      content: var(--tw-content);
      --tw-gradient-from: transparent;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }
  }
  .after\:to-background-primary {
    &::after {
      content: var(--tw-content);
      --tw-gradient-to: var(--seq-color-background-primary);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }
  }
  .last\:mt-0 {
    &:last-child {
      margin-top: calc(var(--spacing) * 0);
    }
  }
  .hover\:animate-bell-ring {
    &:hover {
      @media (hover: hover) {
        animation: var(--animate-bell-ring);
      }
    }
  }
  .hover\:animate-none {
    &:hover {
      @media (hover: hover) {
        animation: none;
      }
    }
  }
  .hover\:border-border-card {
    &:hover {
      @media (hover: hover) {
        border-color: var(--seq-color-border-card);
      }
    }
  }
  .hover\:border-border-hover {
    &:hover {
      @media (hover: hover) {
        border-color: var(--color-border-hover);
      }
    }
  }
  .hover\:bg-background-hover {
    &:hover {
      @media (hover: hover) {
        background-color: var(--seq-color-background-hover);
      }
    }
  }
  .hover\:bg-destructive\/80 {
    &:hover {
      @media (hover: hover) {
        background-color: var(--seq-color-destructive);
        @supports (color: color-mix(in lab, red, red)) {
          background-color: color-mix(in oklab, var(--seq-color-destructive) 80%, transparent);
        }
      }
    }
  }
  .hover\:bg-overlay-light {
    &:hover {
      @media (hover: hover) {
        background-color: var(--color-overlay-light);
      }
    }
  }
  .hover\:bg-primary\/15 {
    &:hover {
      @media (hover: hover) {
        background-color: var(--seq-color-primary);
        @supports (color: color-mix(in lab, red, red)) {
          background-color: color-mix(in oklab, var(--seq-color-primary) 15%, transparent);
        }
      }
    }
  }
  .hover\:bg-primary\/80 {
    &:hover {
      @media (hover: hover) {
        background-color: var(--seq-color-primary);
        @supports (color: color-mix(in lab, red, red)) {
          background-color: color-mix(in oklab, var(--seq-color-primary) 80%, transparent);
        }
      }
    }
  }
  .hover\:text-gray-300 {
    &:hover {
      @media (hover: hover) {
        color: var(--color-gray-300);
      }
    }
  }
  .hover\:text-primary\/80 {
    &:hover {
      @media (hover: hover) {
        color: var(--seq-color-primary);
        @supports (color: color-mix(in lab, red, red)) {
          color: color-mix(in oklab, var(--seq-color-primary) 80%, transparent);
        }
      }
    }
  }
  .hover\:text-red-300 {
    &:hover {
      @media (hover: hover) {
        color: var(--color-red-300);
      }
    }
  }
  .hover\:text-text-80 {
    &:hover {
      @media (hover: hover) {
        color: var(--color-text-80);
      }
    }
  }
  .hover\:opacity-50 {
    &:hover {
      @media (hover: hover) {
        opacity: 50%;
      }
    }
  }
  .hover\:opacity-80 {
    &:hover {
      @media (hover: hover) {
        opacity: 80%;
      }
    }
  }
  .hover\:shadow-lg {
    &:hover {
      @media (hover: hover) {
        --tw-shadow: 0 10px 15px -3px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 4px 6px -4px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
        box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
      }
    }
  }
  .hover\:not-disabled\:not-\[\[aria-invalid\=true\]\]\:not-has-\[\[aria-invalid\=true\]\]\:border-border-hover {
    &:hover {
      @media (hover: hover) {
        &:not(*:disabled) {
          &:not(*:is([aria-invalid=true])) {
            &:not(*:has(*:is([aria-invalid=true]))) {
              border-color: var(--color-border-hover);
            }
          }
        }
      }
    }
  }
  .hover\:not-\[\[data-state\=active\]\]\:opacity-80 {
    &:hover {
      @media (hover: hover) {
        &:not(*:is([data-state=active])) {
          opacity: 80%;
        }
      }
    }
  }
  .focus\:outline-hidden {
    &:focus {
      --tw-outline-style: none;
      outline-style: none;
      @media (forced-colors: active) {
        outline: 2px solid transparent;
        outline-offset: 2px;
      }
    }
  }
  .focus-visible\:border-border-focus {
    &:focus-visible {
      border-color: var(--color-border-focus);
    }
  }
  .focus-visible\:shadow-focus-ring {
    &:focus-visible {
      --tw-shadow: 0px 0px 0px 2px var(--tw-shadow-color, hsla(247, 100%, 75%, 1));
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }
  }
  .focus-visible\:shadow-none {
    &:focus-visible {
      --tw-shadow: 0 0 #0000;
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }
  }
  .focus-visible\:outline-2 {
    &:focus-visible {
      outline-style: var(--tw-outline-style);
      outline-width: 2px;
    }
  }
  .focus-visible\:outline-offset-1 {
    &:focus-visible {
      outline-offset: 1px;
    }
  }
  .focus-visible\:outline-border-focus {
    &:focus-visible {
      outline-color: var(--color-border-focus);
    }
  }
  .active\:border-border-focus {
    &:active {
      border-color: var(--color-border-focus);
    }
  }
  .active\:shadow-active-ring {
    &:active {
      --tw-shadow: 0px 0px 0px 1px var(--tw-shadow-color, hsla(247, 100%, 75%, 1));
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }
  }
  .active\:shadow-none {
    &:active {
      --tw-shadow: 0 0 #0000;
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }
  }
  .disabled\:pointer-events-none {
    &:disabled {
      pointer-events: none;
    }
  }
  .disabled\:cursor-default {
    &:disabled {
      cursor: default;
    }
  }
  .disabled\:cursor-not-allowed {
    &:disabled {
      cursor: not-allowed;
    }
  }
  .disabled\:opacity-50 {
    &:disabled {
      opacity: 50%;
    }
  }
  .disabled\:opacity-100 {
    &:disabled {
      opacity: 100%;
    }
  }
  .inert\:opacity-0 {
    &:is([inert], [inert] *) {
      opacity: 0%;
    }
  }
  .has-data-\[state\=checked\]\:border-primary {
    &:has(*[data-state="checked"]) {
      border-color: var(--seq-color-primary);
    }
  }
  .has-data-\[state\=checked\]\:bg-primary\/5 {
    &:has(*[data-state="checked"]) {
      background-color: var(--seq-color-primary);
      @supports (color: color-mix(in lab, red, red)) {
        background-color: color-mix(in oklab, var(--seq-color-primary) 5%, transparent);
      }
    }
  }
  .has-\[\:focus-visible\]\:outline-2 {
    &:has(*:is(:focus-visible)) {
      outline-style: var(--tw-outline-style);
      outline-width: 2px;
    }
  }
  .has-\[\:focus-visible\]\:outline-border-focus {
    &:has(*:is(:focus-visible)) {
      outline-color: var(--color-border-focus);
    }
  }
  .has-\[\[aria-invalid\=true\]\]\:border-destructive {
    &:has(*:is([aria-invalid=true])) {
      border-color: var(--seq-color-destructive);
    }
  }
  .has-\[\[aria-invalid\=true\]\]\:outline-destructive {
    &:has(*:is([aria-invalid=true])) {
      outline-color: var(--seq-color-destructive);
    }
  }
  .has-\[\[data-slot\=input-group-control\]\:disabled\]\:pointer-events-none {
    &:has(*:is([data-slot=input-group-control]:disabled)) {
      pointer-events: none;
    }
  }
  .has-\[\[data-slot\=input-group-control\]\:disabled\]\:cursor-not-allowed {
    &:has(*:is([data-slot=input-group-control]:disabled)) {
      cursor: not-allowed;
    }
  }
  .has-\[\[data-slot\=input-group-control\]\:disabled\]\:opacity-50 {
    &:has(*:is([data-slot=input-group-control]:disabled)) {
      opacity: 50%;
    }
  }
  .has-\[\[data-slot\=input-group-control\]\:focus-visible\]\:ring-\[3px\] {
    &:has(*:is([data-slot=input-group-control]:focus-visible)) {
      --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }
  }
  .has-\[\[data-slot\]\[aria-invalid\=true\]\]\:border-destructive {
    &:has(*:is([data-slot][aria-invalid=true])) {
      border-color: var(--seq-color-destructive);
    }
  }
  .has-\[\[data-slot\]\[aria-invalid\=true\]\]\:outline-destructive {
    &:has(*:is([data-slot][aria-invalid=true])) {
      outline-color: var(--seq-color-destructive);
    }
  }
  .has-\[\>\[data-align\=block-end\]\]\:h-auto {
    &:has(>[data-align=block-end]) {
      height: auto;
    }
  }
  .has-\[\>\[data-align\=block-end\]\]\:flex-col {
    &:has(>[data-align=block-end]) {
      flex-direction: column;
    }
  }
  .has-\[\>\[data-align\=block-start\]\]\:h-auto {
    &:has(>[data-align=block-start]) {
      height: auto;
    }
  }
  .has-\[\>\[data-align\=block-start\]\]\:flex-col {
    &:has(>[data-align=block-start]) {
      flex-direction: column;
    }
  }
  .has-\[\>\[data-slot\=checkbox-group\]\]\:gap-3 {
    &:has(>[data-slot=checkbox-group]) {
      gap: calc(var(--spacing) * 3);
    }
  }
  .has-\[\>\[data-slot\=field-content\]\]\:items-start {
    &:has(>[data-slot=field-content]) {
      align-items: flex-start;
    }
  }
  .has-\[\>\[data-slot\=field\]\]\:w-full {
    &:has(>[data-slot=field]) {
      width: 100%;
    }
  }
  .has-\[\>\[data-slot\=field\]\]\:flex-col {
    &:has(>[data-slot=field]) {
      flex-direction: column;
    }
  }
  .has-\[\>\[data-slot\=field\]\]\:rounded-md {
    &:has(>[data-slot=field]) {
      border-radius: var(--radius-md);
    }
  }
  .has-\[\>\[data-slot\=field\]\]\:border {
    &:has(>[data-slot=field]) {
      border-style: var(--tw-border-style);
      border-width: 1px;
    }
  }
  .has-\[\>\[data-slot\=radio-group\]\]\:gap-3 {
    &:has(>[data-slot=radio-group]) {
      gap: calc(var(--spacing) * 3);
    }
  }
  .has-\[\>textarea\]\:h-auto {
    &:has(>textarea) {
      height: auto;
    }
  }
  .aria-invalid\:border-destructive {
    &[aria-invalid="true"] {
      border-color: var(--seq-color-destructive);
    }
  }
  .aria-invalid\:outline-destructive {
    &[aria-invalid="true"] {
      outline-color: var(--seq-color-destructive);
    }
  }
  .data-disabled\:pointer-events-none {
    &[data-disabled] {
      pointer-events: none;
    }
  }
  .data-disabled\:cursor-default {
    &[data-disabled] {
      cursor: default;
    }
  }
  .data-disabled\:text-muted {
    &[data-disabled] {
      color: var(--seq-color-muted);
    }
  }
  .data-disabled\:opacity-50 {
    &[data-disabled] {
      opacity: 50%;
    }
  }
  .data-disabled\:opacity-80 {
    &[data-disabled] {
      opacity: 80%;
    }
  }
  .data-highlighted\:bg-background-active\/33 {
    &[data-highlighted] {
      background-color: var(--seq-color-background-active);
      @supports (color: color-mix(in lab, red, red)) {
        background-color: color-mix(in oklab, var(--seq-color-background-active) 33%, transparent);
      }
    }
  }
  .data-highlighted\:bg-background-hover {
    &[data-highlighted] {
      background-color: var(--seq-color-background-hover);
    }
  }
  .data-\[disabled\]\:pointer-events-none {
    &[data-disabled] {
      pointer-events: none;
    }
  }
  .data-\[disabled\]\:opacity-50 {
    &[data-disabled] {
      opacity: 50%;
    }
  }
  .data-\[invalid\=true\]\:text-destructive {
    &[data-invalid="true"] {
      color: var(--seq-color-destructive);
    }
  }
  .data-\[orientation\=horizontal\]\:h-px {
    &[data-orientation="horizontal"] {
      height: 1px;
    }
  }
  .data-\[orientation\=horizontal\]\:w-full {
    &[data-orientation="horizontal"] {
      width: 100%;
    }
  }
  .data-\[orientation\=vertical\]\:h-full {
    &[data-orientation="vertical"] {
      height: 100%;
    }
  }
  .data-\[orientation\=vertical\]\:w-px {
    &[data-orientation="vertical"] {
      width: 1px;
    }
  }
  .data-\[side\=bottom\]\:slide-in-from-top-2 {
    &[data-side="bottom"] {
      --tw-enter-translate-y: calc(2*var(--spacing)*-1);
    }
  }
  .data-\[side\=left\]\:slide-in-from-right-2 {
    &[data-side="left"] {
      --tw-enter-translate-x: calc(2*var(--spacing));
    }
  }
  .data-\[side\=right\]\:slide-in-from-left-2 {
    &[data-side="right"] {
      --tw-enter-translate-x: calc(2*var(--spacing)*-1);
    }
  }
  .data-\[side\=top\]\:slide-in-from-bottom-2 {
    &[data-side="top"] {
      --tw-enter-translate-y: calc(2*var(--spacing));
    }
  }
  .data-\[slot\=checkbox-group\]\:gap-3 {
    &[data-slot="checkbox-group"] {
      gap: calc(var(--spacing) * 3);
    }
  }
  .data-\[state\=active\]\:border-border-focus {
    &[data-state="active"] {
      border-color: var(--color-border-focus);
    }
  }
  .data-\[state\=active\]\:text-border-focus {
    &[data-state="active"] {
      color: var(--color-border-focus);
    }
  }
  .data-\[state\=active\]\:text-primary {
    &[data-state="active"] {
      color: var(--seq-color-primary);
    }
  }
  .data-\[state\=checked\]\:translate-x-full {
    &[data-state="checked"] {
      --tw-translate-x: 100%;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }
  }
  .data-\[state\=checked\]\:border-transparent\! {
    &[data-state="checked"] {
      border-color: transparent !important;
    }
  }
  .data-\[state\=checked\]\:bg-background-active {
    &[data-state="checked"] {
      background-color: var(--seq-color-background-active);
    }
  }
  .data-\[state\=checked\]\:bg-white {
    &[data-state="checked"] {
      background-color: var(--color-white);
    }
  }
  .data-\[state\=checked\]\:bg-gradient-primary {
    &[data-state="checked"] {
      background-image: var(--seq-color-gradient-primary);
    }
  }
  .data-\[state\=closed\]\:animate-out {
    &[data-state="closed"] {
      animation: exit var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none);
    }
  }
  .data-\[state\=closed\]\:duration-300 {
    &[data-state="closed"] {
      --tw-duration: 300ms;
      transition-duration: 300ms;
    }
  }
  .data-\[state\=closed\]\:fade-out-0 {
    &[data-state="closed"] {
      --tw-exit-opacity: calc(0/100);
      --tw-exit-opacity: 0;
    }
  }
  .data-\[state\=closed\]\:zoom-out-95 {
    &[data-state="closed"] {
      --tw-exit-scale: calc(95*1%);
      --tw-exit-scale: .95;
    }
  }
  .data-\[state\=closed\]\:slide-out-to-bottom {
    &[data-state="closed"] {
      --tw-exit-translate-y: 100%;
    }
  }
  .data-\[state\=closed\]\:slide-out-to-left {
    &[data-state="closed"] {
      --tw-exit-translate-x: -100%;
    }
  }
  .data-\[state\=closed\]\:slide-out-to-right {
    &[data-state="closed"] {
      --tw-exit-translate-x: 100%;
    }
  }
  .data-\[state\=closed\]\:slide-out-to-top {
    &[data-state="closed"] {
      --tw-exit-translate-y: -100%;
    }
  }
  .data-\[state\=open\]\:animate-in {
    &[data-state="open"] {
      animation: enter var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none);
    }
  }
  .data-\[state\=open\]\:duration-500 {
    &[data-state="open"] {
      --tw-duration: 500ms;
      transition-duration: 500ms;
    }
  }
  .data-\[state\=open\]\:fade-in-0 {
    &[data-state="open"] {
      --tw-enter-opacity: calc(0/100);
      --tw-enter-opacity: 0;
    }
  }
  .data-\[state\=open\]\:zoom-in-95 {
    &[data-state="open"] {
      --tw-enter-scale: calc(95*1%);
      --tw-enter-scale: .95;
    }
  }
  .data-\[state\=open\]\:slide-in-from-bottom {
    &[data-state="open"] {
      --tw-enter-translate-y: 100%;
    }
  }
  .data-\[state\=open\]\:slide-in-from-left {
    &[data-state="open"] {
      --tw-enter-translate-x: -100%;
    }
  }
  .data-\[state\=open\]\:slide-in-from-right {
    &[data-state="open"] {
      --tw-enter-translate-x: 100%;
    }
  }
  .data-\[state\=open\]\:slide-in-from-top {
    &[data-state="open"] {
      --tw-enter-translate-y: -100%;
    }
  }
  .data-\[swipe\=cancel\]\:translate-x-0 {
    &[data-swipe="cancel"] {
      --tw-translate-x: calc(var(--spacing) * 0);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }
  }
  .data-\[swipe\=cancel\]\:transition-transform {
    &[data-swipe="cancel"] {
      transition-property: transform, translate, scale, rotate;
      transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
      transition-duration: var(--tw-duration, var(--default-transition-duration));
    }
  }
  .data-\[swipe\=cancel\]\:duration-200 {
    &[data-swipe="cancel"] {
      --tw-duration: 200ms;
      transition-duration: 200ms;
    }
  }
  .data-\[swipe\=cancel\]\:ease-out {
    &[data-swipe="cancel"] {
      --tw-ease: var(--ease-out);
      transition-timing-function: var(--ease-out);
    }
  }
  .data-\[swipe\=end\]\:animate-swipe-out {
    &[data-swipe="end"] {
      animation: swipe-out 200ms ease-out;
    }
  }
  .data-\[swipe\=move\]\:translate-x-\[var\(--radix-toast-swipe-move-x\)\] {
    &[data-swipe="move"] {
      --tw-translate-x: var(--radix-toast-swipe-move-x);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }
  }
  .nth-last-2\:-mt-1 {
    &:nth-last-child(2) {
      margin-top: calc(var(--spacing) * -1);
    }
  }
  .sm\:inline-flex {
    @media (width >= 40rem) {
      display: inline-flex;
    }
  }
  .sm\:max-w-lg {
    @media (width >= 40rem) {
      max-width: var(--container-lg);
    }
  }
  .sm\:max-w-sm {
    @media (width >= 40rem) {
      max-width: var(--container-sm);
    }
  }
  .sm\:flex-row {
    @media (width >= 40rem) {
      flex-direction: row;
    }
  }
  .sm\:justify-end {
    @media (width >= 40rem) {
      justify-content: flex-end;
    }
  }
  .sm\:text-left {
    @media (width >= 40rem) {
      text-align: left;
    }
  }
  .md\:bottom-auto {
    @media (width >= 48rem) {
      bottom: auto;
    }
  }
  .md\:h-\[800px\] {
    @media (width >= 48rem) {
      height: 800px;
    }
  }
  .md\:max-h-\[min\(800px\,calc\(100dvh-80px\)\)\] {
    @media (width >= 48rem) {
      max-height: min(800px, calc(100dvh - 80px));
    }
  }
  .md\:w-\[540px\] {
    @media (width >= 48rem) {
      width: 540px;
    }
  }
  .md\:w-\[720px\] {
    @media (width >= 48rem) {
      width: 720px;
    }
  }
  .md\:rounded-b-2xl {
    @media (width >= 48rem) {
      border-bottom-right-radius: var(--radius-2xl);
      border-bottom-left-radius: var(--radius-2xl);
    }
  }
  .lg\:h-auto\! {
    @media (width >= 64rem) {
      height: auto !important;
    }
  }
  .\@md\/field-group\:flex-row {
    @container field-group (width >= 28rem) {
      flex-direction: row;
    }
  }
  .\@md\/field-group\:items-center {
    @container field-group (width >= 28rem) {
      align-items: center;
    }
  }
  .\@md\/field-group\:has-\[\>\[data-slot\=field-content\]\]\:items-start {
    @container field-group (width >= 28rem) {
      &:has(>[data-slot=field-content]) {
        align-items: flex-start;
      }
    }
  }
  .\[\&_span\]\:size-\[12px\] {
    & span {
      width: 12px;
      height: 12px;
    }
  }
  .\[\&_span\]\:size-\[18px\] {
    & span {
      width: 18px;
      height: 18px;
    }
  }
  .\[\&_svg\]\:pointer-events-none {
    & svg {
      pointer-events: none;
    }
  }
  .\[\&_svg\:not\(\[class\*\=\"size-\"\]\)\]\:size-4 {
    & svg:not([class*="size-"]) {
      width: calc(var(--spacing) * 4);
      height: calc(var(--spacing) * 4);
    }
  }
  .\[\&_svg\:not\(\[class\*\=\"size-\"\]\)\]\:size-5 {
    & svg:not([class*="size-"]) {
      width: calc(var(--spacing) * 5);
      height: calc(var(--spacing) * 5);
    }
  }
  .\[\&\:has\(\:disabled\)\]\:cursor-default {
    &:has(:disabled) {
      cursor: default;
    }
  }
  .\[\&\:has\(\:disabled\)\]\:opacity-50 {
    &:has(:disabled) {
      opacity: 50%;
    }
  }
  .\[\&\:has\(div\:nth-child\(4\)\)\>div\]\:col-\[unset\] {
    &:has(div:nth-child(4))>div {
      grid-column: unset;
    }
  }
  .\[\.border-b\]\:pb-3 {
    &:is(.border-b) {
      padding-bottom: calc(var(--spacing) * 3);
    }
  }
  .\[\.border-t\]\:pt-3 {
    &:is(.border-t) {
      padding-top: calc(var(--spacing) * 3);
    }
  }
  .\[\&\>\*\]\:w-full {
    &>* {
      width: 100%;
    }
  }
  .\[\&\>\*\]\:data-\[slot\=field\]\:p-4 {
    &>* {
      &[data-slot="field"] {
        padding: calc(var(--spacing) * 4);
      }
    }
  }
  .\@md\/field-group\:\[\&\>\*\]\:w-auto {
    @container field-group (width >= 28rem) {
      &>* {
        width: auto;
      }
    }
  }
  .\[\&\>\.sr-only\]\:w-auto {
    &>.sr-only {
      width: auto;
    }
  }
  .\[\&\>\[data-slot\=field-group\]\]\:gap-4 {
    &>[data-slot=field-group] {
      gap: calc(var(--spacing) * 4);
    }
  }
  .\[\&\>\[data-slot\=field-label\]\]\:flex-auto {
    &>[data-slot=field-label] {
      flex: auto;
    }
  }
  .\@md\/field-group\:\[\&\>\[data-slot\=field-label\]\]\:flex-auto {
    @container field-group (width >= 28rem) {
      &>[data-slot=field-label] {
        flex: auto;
      }
    }
  }
  .has-\[\>\[data-slot\=field-content\]\]\:\[\&\>\[role\=checkbox\]\,\[role\=radio\]\]\:mt-px {
    &:has(>[data-slot=field-content]) {
      &>[role=checkbox],[role=radio] {
        margin-top: 1px;
      }
    }
  }
  .\@md\/field-group\:has-\[\>\[data-slot\=field-content\]\]\:\[\&\>\[role\=checkbox\]\,\[role\=radio\]\]\:mt-px {
    @container field-group (width >= 28rem) {
      &:has(>[data-slot=field-content]) {
        &>[role=checkbox],[role=radio] {
          margin-top: 1px;
        }
      }
    }
  }
  .\[\&\>a\]\:underline {
    &>a {
      text-decoration-line: underline;
    }
  }
  .\[\&\>a\]\:underline-offset-4 {
    &>a {
      text-underline-offset: 4px;
    }
  }
  .\[\&\>a\:hover\]\:text-primary {
    &>a:hover {
      color: var(--seq-color-primary);
    }
  }
  .\[\&\>div\]\:justify-center {
    &>div {
      justify-content: center;
    }
  }
  .\[\&\>div\]\:pr-2 {
    &>div {
      padding-right: calc(var(--spacing) * 2);
    }
  }
  .\[\&\>div\:nth-child\(1\)\:only-child\]\:h-\[312px\] {
    &>div:nth-child(1):only-child {
      height: 312px;
    }
  }
  .\[\&\>div\:nth-child\(1\)\:only-child\]\:w-\[312px\] {
    &>div:nth-child(1):only-child {
      width: 312px;
    }
  }
  .\[\&\>div\:nth-child\(3\)\]\:col-\[1\/-1\] {
    &>div:nth-child(3) {
      grid-column: 1/-1;
    }
  }
  .\[\&\>div\:nth-child\(3\)\]\:justify-self-center {
    &>div:nth-child(3) {
      justify-self: center;
    }
  }
  .\[\&\>div\>div\]\:pr-0 {
    &>div>div {
      padding-right: calc(var(--spacing) * 0);
    }
  }
  .\[\&\>input\]\:text-xs {
    &>input {
      font-size: var(--text-xs);
      line-height: var(--tw-leading, var(--text-xs--line-height));
    }
  }
  .has-\[\>\[data-align\=block-end\]\]\:\[\&\>input\]\:pt-3 {
    &:has(>[data-align=block-end]) {
      &>input {
        padding-top: calc(var(--spacing) * 3);
      }
    }
  }
  .has-\[\>\[data-align\=block-start\]\]\:\[\&\>input\]\:pb-3 {
    &:has(>[data-align=block-start]) {
      &>input {
        padding-bottom: calc(var(--spacing) * 3);
      }
    }
  }
  .has-\[\>\[data-align\=inline-end\]\]\:\[\&\>input\]\:pr-2 {
    &:has(>[data-align=inline-end]) {
      &>input {
        padding-right: calc(var(--spacing) * 2);
      }
    }
  }
  .has-\[\>\[data-align\=inline-start\]\]\:\[\&\>input\]\:pl-2 {
    &:has(>[data-align=inline-start]) {
      &>input {
        padding-left: calc(var(--spacing) * 2);
      }
    }
  }
  .\[\&\>label\]\:flex {
    &>label {
      display: flex;
    }
  }
  .\[\&\>label\]\:w-16 {
    &>label {
      width: calc(var(--spacing) * 16);
    }
  }
  .\[\&\>label\]\:w-full {
    &>label {
      width: 100%;
    }
  }
  .\[\&\>label\]\:gap-1 {
    &>label {
      gap: calc(var(--spacing) * 1);
    }
  }
  .\[\&\>label\>button\]\:w-full {
    &>label>button {
      width: 100%;
    }
  }
  .\[\&\>label\>button\]\:text-xs {
    &>label>button {
      font-size: var(--text-xs);
      line-height: var(--tw-leading, var(--text-xs--line-height));
    }
  }
  .\[\&\>label\>button\>span\]\:overflow-hidden {
    &>label>button>span {
      overflow: hidden;
    }
  }
  .\[\&\>label\>div\]\:w-full {
    &>label>div {
      width: 100%;
    }
  }
  .\[\&\>label\>div\>div\>div\]\:h-13 {
    &>label>div>div>div {
      height: calc(var(--spacing) * 13);
    }
  }
  .\[\&\>label\>div\>div\>div\]\:rounded-xl {
    &>label>div>div>div {
      border-radius: var(--radius-xl);
    }
  }
  .\[\&\>label\>div\>div\>div\>input\]\:text-sm {
    &>label>div>div>div>input {
      font-size: var(--text-sm);
      line-height: var(--tw-leading, var(--text-sm--line-height));
    }
  }
  .\[\&\>label\>div\>div\>span\]\:text-sm {
    &>label>div>div>span {
      font-size: var(--text-sm);
      line-height: var(--tw-leading, var(--text-sm--line-height));
    }
  }
  .\[\&\>label\>div\>div\>span\]\:text-text-80 {
    &>label>div>div>span {
      color: var(--color-text-80);
    }
  }
  .\[\&\>span\[data-state\=\'checked\'\]\]\:hidden {
    &>span[data-state='checked'] {
      display: none;
    }
  }
  .\[\&\>svg\]\:stroke-2 {
    &>svg {
      stroke-width: 2;
    }
  }
  .\[\&\>svg\]\:stroke-\[calc\(24\/16\*2px\)\] {
    &>svg {
      stroke-width: calc(24 / 16 * 2px);
    }
  }
  .\[\&\>svg\]\:stroke-\[calc\(24\/32\*2px\)\] {
    &>svg {
      stroke-width: calc(24 / 32 * 2px);
    }
  }
  .\[\[data-variant\=legend\]\+\&\]\:-mt-1\.5 {
    [data-variant=legend]+& {
      margin-top: calc(var(--spacing) * -1.5);
    }
  }
}
@property --tw-animation-duration {
  syntax: "*";
  inherits: false;
}
:root, [data-theme=dark] {
  --seq-color-positive: var(--color-green-500);
  --seq-color-negative: var(--color-red-500);
  --seq-color-info: var(--color-blue-500);
  --seq-color-warning: var(--color-yellow-500);
  --seq-color-destructive: var(--color-red-500);
  --seq-color-primary: white;
  --seq-color-secondary: white;
  --seq-color-muted: var(--color-zinc-500);
  --seq-color-inverse: black;
  --seq-color-background-primary: black;
  --seq-color-background-secondary: var(--color-zinc-900);
  --seq-color-background-muted: var(--color-zinc-950);
  --seq-color-background-inverse: white;
  --seq-color-background-overlay: color-mix( in oklab, oklch(37% 0.013 285.805) 90%, transparent );
  @supports (color: color-mix(in lab, red, red)) {
    --seq-color-background-overlay: color-mix( in oklab, var(--color-zinc-700) 90%, transparent );
  }
  --seq-color-background-raised: var(--color-zinc-800);
  --seq-color-background-input: var(--color-zinc-950);
  --seq-color-background-hover: var(--color-zinc-900);
  --seq-color-background-active: var(--color-zinc-700);
  --seq-color-border-normal: var(--color-zinc-700);
  --seq-color-border-hover: var(--color-zinc-600);
  --seq-color-border-focus: var(--color-violet-500);
  --seq-color-border-card: var(--color-zinc-800);
  --seq-color-border-button: var(--color-zinc-700);
  --seq-color-drop-shadow: color-mix( in oklab, oklch(14.1% 0.005 285.823) 40%, transparent );
  @supports (color: color-mix(in lab, red, red)) {
    --seq-color-drop-shadow: color-mix( in oklab, var(--color-zinc-950) 40%, transparent );
  }
  --seq-color-gradient-backdrop: linear-gradient(
      
      243.18deg,
      rgba(86, 52, 189, 0.85) 0%,
      rgba(49, 41, 223, 0.85) 63.54%,
      rgba(7, 98, 149, 0.85) 100% );
  --seq-color-gradient-primary: linear-gradient(
      
      89.69deg,
      #4411e1 0.27%,
      #7537f9 99.73% );
  --seq-color-gradient-secondary: linear-gradient(
      
      32.51deg,
      #951990 -15.23%,
      #3a35b1 48.55%,
      #20a8b0 100% );
  --seq-color-gradient-skeleton: linear-gradient(
      
      -45deg,
      transparent,
      var(--color-zinc-700),
      transparent );
}
[data-theme=light] {
  --seq-color-positive: var(--color-green-600);
  --seq-color-negative: var(--color-red-600);
  --seq-color-info: var(--color-blue-600);
  --seq-color-warning: var(--color-yellow-600);
  --seq-color-destructive: var(--color-red-600);
  --seq-color-primary: var(--color-slate-800);
  --seq-color-secondary: var(--color-slate-800);
  --seq-color-muted: var(--color-slate-500);
  --seq-color-inverse: var(--color-slate-50);
  --seq-color-background-primary: var(--color-slate-50);
  --seq-color-background-secondary: white;
  --seq-color-background-muted: var(--color-slate-100);
  --seq-color-background-inverse: black;
  --seq-color-background-overlay: color-mix( in oklab, oklch(86.9% 0.022 252.894) 80%, transparent );
  @supports (color: color-mix(in lab, red, red)) {
    --seq-color-background-overlay: color-mix( in oklab, var(--color-slate-300) 80%, transparent );
  }
  --seq-color-background-raised: white;
  --seq-color-background-input: var(--color-slate-50);
  --seq-color-background-hover: var(--color-slate-100);
  --seq-color-background-active: var(--color-slate-200);
  --seq-color-border-normal: var(--color-slate-300);
  --seq-color-border-hover: var(--color-slate-400);
  --seq-color-border-focus: var(--color-violet-600);
  --seq-color-border-card: var(--color-slate-200);
  --seq-color-border-button: var(--color-slate-300);
  --seq-color-drop-shadow: color-mix( in oklab, oklch(12.9% 0.042 264.695) 15%, transparent );
  @supports (color: color-mix(in lab, red, red)) {
    --seq-color-drop-shadow: color-mix( in oklab, var(--color-slate-950) 15%, transparent );
  }
  --seq-color-gradient-backdrop: linear-gradient(
      
      243.18deg,
      rgba(86, 52, 189, 0.85) 0%,
      rgba(49, 41, 223, 0.85) 63.54%,
      rgba(7, 98, 149, 0.85) 100% );
  --seq-color-gradient-primary: linear-gradient(
      
      89.69deg,
      #4411e1 0.27%,
      #7537f9 99.73% );
  --seq-color-gradient-secondary: linear-gradient(
      
      32.51deg,
      #951990 -15.23%,
      #3a35b1 48.55%,
      #20a8b0 100% );
  --seq-color-gradient-skeleton: linear-gradient(
      
      -45deg,
      transparent,
      var(--color-slate-300),
      transparent );
}
:root {
  --base-unit: 16;
}
.rdp-root {
  --rdp-accent-color: blue;
  --rdp-accent-background-color: #f0f0ff;
  --rdp-day-height: 44px;
  --rdp-day-width: 44px;
  --rdp-day_button-border-radius: 100%;
  --rdp-day_button-border: 2px solid transparent;
  --rdp-day_button-height: 42px;
  --rdp-day_button-width: 42px;
  --rdp-selected-border: 2px solid var(--rdp-accent-color);
  --rdp-disabled-opacity: 0.5;
  --rdp-outside-opacity: 0.75;
  --rdp-today-color: var(--rdp-accent-color);
  --rdp-dropdown-gap: 0.5rem;
  --rdp-months-gap: 2rem;
  --rdp-nav_button-disabled-opacity: 0.5;
  --rdp-nav_button-height: 2.25rem;
  --rdp-nav_button-width: 2.25rem;
  --rdp-nav-height: 2.75rem;
  --rdp-range_middle-background-color: var(--rdp-accent-background-color);
  --rdp-range_middle-color: inherit;
  --rdp-range_start-color: white;
  --rdp-range_start-background: linear-gradient(
    var(--rdp-gradient-direction),
    transparent 50%,
    var(--rdp-range_middle-background-color) 50%
  );
  --rdp-range_start-date-background-color: var(--rdp-accent-color);
  --rdp-range_end-background: linear-gradient(
    var(--rdp-gradient-direction),
    var(--rdp-range_middle-background-color) 50%,
    transparent 50%
  );
  --rdp-range_end-color: white;
  --rdp-range_end-date-background-color: var(--rdp-accent-color);
  --rdp-week_number-border-radius: 100%;
  --rdp-week_number-border: 2px solid transparent;
  --rdp-week_number-height: var(--rdp-day-height);
  --rdp-week_number-opacity: 0.75;
  --rdp-week_number-width: var(--rdp-day-width);
  --rdp-weeknumber-text-align: center;
  --rdp-weekday-opacity: 0.75;
  --rdp-weekday-padding: 0.5rem 0rem;
  --rdp-weekday-text-align: center;
  --rdp-gradient-direction: 90deg;
  --rdp-animation_duration: 0.3s;
  --rdp-animation_timing: cubic-bezier(0.4, 0, 0.2, 1);
}
.rdp-root[dir="rtl"] {
  --rdp-gradient-direction: -90deg;
}
.rdp-root[data-broadcast-calendar="true"] {
  --rdp-outside-opacity: unset;
}
.rdp-root {
  position: relative;
  box-sizing: border-box;
}
.rdp-root * {
  box-sizing: border-box;
}
.rdp-day {
  width: var(--rdp-day-width);
  height: var(--rdp-day-height);
  text-align: center;
}
.rdp-day_button {
  background: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  font: inherit;
  color: inherit;
  justify-content: center;
  align-items: center;
  display: flex;
  width: var(--rdp-day_button-width);
  height: var(--rdp-day_button-height);
  border: var(--rdp-day_button-border);
  border-radius: var(--rdp-day_button-border-radius);
}
.rdp-day_button:disabled {
  cursor: revert;
}
.rdp-caption_label {
  z-index: 1;
  position: relative;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  border: 0;
}
.rdp-dropdown:focus-visible ~ .rdp-caption_label {
  outline: 5px auto Highlight;
  outline: 5px auto -webkit-focus-ring-color;
}
.rdp-button_next, .rdp-button_previous {
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  font: inherit;
  color: inherit;
  -moz-appearance: none;
  -webkit-appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  appearance: none;
  width: var(--rdp-nav_button-width);
  height: var(--rdp-nav_button-height);
}
.rdp-button_next:disabled, .rdp-button_next[aria-disabled="true"], .rdp-button_previous:disabled, .rdp-button_previous[aria-disabled="true"] {
  cursor: revert;
  opacity: var(--rdp-nav_button-disabled-opacity);
}
.rdp-chevron {
  display: inline-block;
  fill: var(--rdp-accent-color);
}
.rdp-root[dir="rtl"] .rdp-nav .rdp-chevron {
  transform: rotate(180deg);
  transform-origin: 50%;
}
.rdp-dropdowns {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--rdp-dropdown-gap);
}
.rdp-dropdown {
  z-index: 2;
  opacity: 0;
  appearance: none;
  position: absolute;
  inset-block-start: 0;
  inset-block-end: 0;
  inset-inline-start: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  cursor: inherit;
  border: none;
  line-height: inherit;
}
.rdp-dropdown_root {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.rdp-dropdown_root[data-disabled="true"] .rdp-chevron {
  opacity: var(--rdp-disabled-opacity);
}
.rdp-month_caption {
  display: flex;
  align-content: center;
  height: var(--rdp-nav-height);
  font-weight: bold;
  font-size: large;
}
.rdp-root[data-nav-layout="around"] .rdp-month, .rdp-root[data-nav-layout="after"] .rdp-month {
  position: relative;
}
.rdp-root[data-nav-layout="around"] .rdp-month_caption {
  justify-content: center;
  margin-inline-start: var(--rdp-nav_button-width);
  margin-inline-end: var(--rdp-nav_button-width);
  position: relative;
}
.rdp-root[data-nav-layout="around"] .rdp-button_previous {
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  height: var(--rdp-nav-height);
  display: inline-flex;
}
.rdp-root[data-nav-layout="around"] .rdp-button_next {
  position: absolute;
  inset-inline-end: 0;
  top: 0;
  height: var(--rdp-nav-height);
  display: inline-flex;
  justify-content: center;
}
.rdp-months {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: var(--rdp-months-gap);
  max-width: fit-content;
}
.rdp-month_grid {
  border-collapse: collapse;
}
.rdp-nav {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
  display: flex;
  align-items: center;
  height: var(--rdp-nav-height);
}
.rdp-weekday {
  opacity: var(--rdp-weekday-opacity);
  padding: var(--rdp-weekday-padding);
  font-weight: 500;
  font-size: smaller;
  text-align: var(--rdp-weekday-text-align);
  text-transform: var(--rdp-weekday-text-transform);
}
.rdp-week_number {
  opacity: var(--rdp-week_number-opacity);
  font-weight: 400;
  font-size: small;
  height: var(--rdp-week_number-height);
  width: var(--rdp-week_number-width);
  border: var(--rdp-week_number-border);
  border-radius: var(--rdp-week_number-border-radius);
  text-align: var(--rdp-weeknumber-text-align);
}
.rdp-today:not(.rdp-outside) {
  color: var(--rdp-today-color);
}
.rdp-selected {
  font-weight: bold;
  font-size: large;
}
.rdp-selected .rdp-day_button {
  border: var(--rdp-selected-border);
}
.rdp-outside {
  opacity: var(--rdp-outside-opacity);
}
.rdp-disabled {
  opacity: var(--rdp-disabled-opacity);
}
.rdp-hidden {
  visibility: hidden;
  color: var(--rdp-range_start-color);
}
.rdp-range_start {
  background: var(--rdp-range_start-background);
}
.rdp-range_start .rdp-day_button {
  background-color: var(--rdp-range_start-date-background-color);
  color: var(--rdp-range_start-color);
}
.rdp-range_middle {
  background-color: var(--rdp-range_middle-background-color);
}
.rdp-range_middle .rdp-day_button {
  border: unset;
  border-radius: unset;
  color: var(--rdp-range_middle-color);
}
.rdp-range_end {
  background: var(--rdp-range_end-background);
  color: var(--rdp-range_end-color);
}
.rdp-range_end .rdp-day_button {
  color: var(--rdp-range_start-color);
  background-color: var(--rdp-range_end-date-background-color);
}
.rdp-range_start.rdp-range_end {
  background: revert;
}
.rdp-focusable {
  cursor: pointer;
}
@keyframes rdp-slide_in_left {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes rdp-slide_in_right {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes rdp-slide_out_left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
@keyframes rdp-slide_out_right {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}
.rdp-weeks_before_enter {
  animation: rdp-slide_in_left var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-weeks_before_exit {
  animation: rdp-slide_out_left var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-weeks_after_enter {
  animation: rdp-slide_in_right var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-weeks_after_exit {
  animation: rdp-slide_out_right var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-root[dir="rtl"] .rdp-weeks_after_enter {
  animation: rdp-slide_in_left var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-root[dir="rtl"] .rdp-weeks_before_exit {
  animation: rdp-slide_out_right var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-root[dir="rtl"] .rdp-weeks_before_enter {
  animation: rdp-slide_in_right var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-root[dir="rtl"] .rdp-weeks_after_exit {
  animation: rdp-slide_out_left var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
@keyframes rdp-fade_in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes rdp-fade_out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.rdp-caption_after_enter {
  animation: rdp-fade_in var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-caption_after_exit {
  animation: rdp-fade_out var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-caption_before_enter {
  animation: rdp-fade_in var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-caption_before_exit {
  animation: rdp-fade_out var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-root {
  width: 100% !important;
  padding: 0 !important;
  user-select: none;
}
.rdp-nav {
  position: absolute;
  width: 100%;
  height: fit-content !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.rdp-caption_label {
  color: var(--color-text-100) !important;
}
.rdp-months {
  width: 100%;
  max-width: unset !important;
}
.rdp-month_caption {
  text-align: center;
  width: 100%;
  height: 36px !important;
  display: block !important;
  font-size: 14px !important;
}
.rdp-month_grid {
  width: 100%;
}
.rdp-month {
  width: 100%;
}
.rdp-button_previous {
  background-color: var(--color-overlay-light) !important;
  border-radius: 50%;
}
.rdp-button_previous:hover {
  background-color: var(--color-overlay-glass) !important;
}
.rdp-button_previous > svg {
  fill: var(--color-text-100) !important;
  width: 16px !important;
  height: 16px !important;
}
.rdp-button_next {
  background-color: var(--color-overlay-light) !important;
  border-radius: 50%;
}
.rdp-button_next:hover {
  background-color: var(--color-overlay-glass) !important;
}
.rdp-button_next > svg {
  fill: var(--color-text-100) !important;
  width: 16px !important;
  height: 16px !important;
}
.rdp-weekdays {
  display: flex;
  justify-content: space-between;
}
.rdp-weekday {
  padding: 16px 0 !important;
  font-size: 14px !important;
  font-weight: var(--font-weight-medium) !important;
  color: var(--color-text-80) !important;
}
.rdp-weeks {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.rdp-week {
  display: flex;
  justify-content: space-between;
}
.rdp-day {
  width: 24px !important;
  height: 24px !important;
}
.rdp-day_button {
  width: 24px !important;
  height: 24px !important;
  font-size: var(--text-xs) !important;
  color: var(--color-text-80) !important;
}
.rdp-day_button:disabled {
  color: var(--color-text-50) !important;
}
.rdp-day.rdp-today {
  outline: 1px solid var(--color-violet-700) !important;
  border-radius: 50% !important;
}
.rdp-day.rdp-selected {
  background: var(--seq-color-gradient-primary) !important;
  border-radius: 50% !important;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes slideUp {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes shimmer {
  0% {
    background-position: -200% -200%;
  }
  100% {
    background-position: 200% 200%;
  }
}
@keyframes bellRing {
  0%,
	100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(10deg);
  }
  75% {
    transform: rotate(-10deg);
  }
}
video::-webkit-media-controls {
  display: none !important;
}
@property --tw-rotate-x {
  syntax: "*";
  inherits: false;
}
@property --tw-rotate-y {
  syntax: "*";
  inherits: false;
}
@property --tw-rotate-z {
  syntax: "*";
  inherits: false;
}
@property --tw-skew-x {
  syntax: "*";
  inherits: false;
}
@property --tw-skew-y {
  syntax: "*";
  inherits: false;
}
@property --tw-leading {
  syntax: "*";
  inherits: false;
}
@property --tw-font-weight {
  syntax: "*";
  inherits: false;
}
@property --tw-tracking {
  syntax: "*";
  inherits: false;
}
@property --tw-shadow-color {
  syntax: "*";
  inherits: false;
}
@property --tw-inset-shadow-color {
  syntax: "*";
  inherits: false;
}
@property --tw-ring-color {
  syntax: "*";
  inherits: false;
}
@property --tw-inset-ring-color {
  syntax: "*";
  inherits: false;
}
@property --tw-ring-inset {
  syntax: "*";
  inherits: false;
}
@property --tw-blur {
  syntax: "*";
  inherits: false;
}
@property --tw-brightness {
  syntax: "*";
  inherits: false;
}
@property --tw-contrast {
  syntax: "*";
  inherits: false;
}
@property --tw-grayscale {
  syntax: "*";
  inherits: false;
}
@property --tw-hue-rotate {
  syntax: "*";
  inherits: false;
}
@property --tw-invert {
  syntax: "*";
  inherits: false;
}
@property --tw-opacity {
  syntax: "*";
  inherits: false;
}
@property --tw-saturate {
  syntax: "*";
  inherits: false;
}
@property --tw-sepia {
  syntax: "*";
  inherits: false;
}
@property --tw-drop-shadow {
  syntax: "*";
  inherits: false;
}
@property --tw-drop-shadow-color {
  syntax: "*";
  inherits: false;
}
@property --tw-drop-shadow-size {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-blur {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-brightness {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-contrast {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-grayscale {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-hue-rotate {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-invert {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-opacity {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-saturate {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-sepia {
  syntax: "*";
  inherits: false;
}
@property --tw-duration {
  syntax: "*";
  inherits: false;
}
@property --tw-ease {
  syntax: "*";
  inherits: false;
}
@property --tw-gradient-position {
  syntax: "*";
  inherits: false;
}
@property --tw-gradient-stops {
  syntax: "*";
  inherits: false;
}
@property --tw-gradient-via-stops {
  syntax: "*";
  inherits: false;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}
@keyframes enter {
  from {
    opacity: var(--tw-enter-opacity,1);
    transform: translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0)scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1))rotate(var(--tw-enter-rotate,0));
    filter: blur(var(--tw-enter-blur,0));
  }
}
@keyframes exit {
  to {
    opacity: var(--tw-exit-opacity,1);
    transform: translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0)scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1))rotate(var(--tw-exit-rotate,0));
    filter: blur(var(--tw-exit-blur,0));
  }
}
@keyframes skeleton {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes swipe-out {
  from {
    transform: translateX(var(--radix-toast-swipe-end-x));
  }
  to {
    transform: translateX(100%);
  }
}
@layer properties {
  @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b)))) {
    *, ::before, ::after, ::backdrop {
      --tw-translate-x: 0;
      --tw-translate-y: 0;
      --tw-translate-z: 0;
      --tw-rotate-x: initial;
      --tw-rotate-y: initial;
      --tw-rotate-z: initial;
      --tw-skew-x: initial;
      --tw-skew-y: initial;
      --tw-space-y-reverse: 0;
      --tw-border-style: solid;
      --tw-leading: initial;
      --tw-font-weight: initial;
      --tw-tracking: initial;
      --tw-shadow: 0 0 #0000;
      --tw-shadow-color: initial;
      --tw-shadow-alpha: 100%;
      --tw-inset-shadow: 0 0 #0000;
      --tw-inset-shadow-color: initial;
      --tw-inset-shadow-alpha: 100%;
      --tw-ring-color: initial;
      --tw-ring-shadow: 0 0 #0000;
      --tw-inset-ring-color: initial;
      --tw-inset-ring-shadow: 0 0 #0000;
      --tw-ring-inset: initial;
      --tw-ring-offset-width: 0px;
      --tw-ring-offset-color: #fff;
      --tw-ring-offset-shadow: 0 0 #0000;
      --tw-outline-style: solid;
      --tw-blur: initial;
      --tw-brightness: initial;
      --tw-contrast: initial;
      --tw-grayscale: initial;
      --tw-hue-rotate: initial;
      --tw-invert: initial;
      --tw-opacity: initial;
      --tw-saturate: initial;
      --tw-sepia: initial;
      --tw-drop-shadow: initial;
      --tw-drop-shadow-color: initial;
      --tw-drop-shadow-alpha: 100%;
      --tw-drop-shadow-size: initial;
      --tw-backdrop-blur: initial;
      --tw-backdrop-brightness: initial;
      --tw-backdrop-contrast: initial;
      --tw-backdrop-grayscale: initial;
      --tw-backdrop-hue-rotate: initial;
      --tw-backdrop-invert: initial;
      --tw-backdrop-opacity: initial;
      --tw-backdrop-saturate: initial;
      --tw-backdrop-sepia: initial;
      --tw-duration: initial;
      --tw-ease: initial;
      --tw-scale-x: 1;
      --tw-scale-y: 1;
      --tw-scale-z: 1;
      --tw-content: "";
      --tw-gradient-position: initial;
      --tw-gradient-from: #0000;
      --tw-gradient-via: #0000;
      --tw-gradient-to: #0000;
      --tw-gradient-stops: initial;
      --tw-gradient-via-stops: initial;
      --tw-gradient-from-position: 0%;
      --tw-gradient-via-position: 50%;
      --tw-gradient-to-position: 100%;
      --tw-animation-delay: 0s;
      --tw-animation-direction: normal;
      --tw-animation-duration: initial;
      --tw-animation-fill-mode: none;
      --tw-animation-iteration-count: 1;
      --tw-enter-blur: 0;
      --tw-enter-opacity: 1;
      --tw-enter-rotate: 0;
      --tw-enter-scale: 1;
      --tw-enter-translate-x: 0;
      --tw-enter-translate-y: 0;
      --tw-exit-blur: 0;
      --tw-exit-opacity: 1;
      --tw-exit-rotate: 0;
      --tw-exit-scale: 1;
      --tw-exit-translate-x: 0;
      --tw-exit-translate-y: 0;
    }
  }
}
`;

//#endregion
//#region src/react/providers/shadow-root.tsx
let sheet;
const getCSSStyleSheet = (customCSS) => {
	if (!sheet) {
		sheet = new CSSStyleSheet();
		sheet.replaceSync(styles + (customCSS ? `\n\n${customCSS}` : ""));
	}
	return sheet;
};
const ShadowRoot = (props) => {
	const { theme, children, customCSS, enabled } = props;
	const hostRef = useRef(null);
	const [container, setContainer] = useState(null);
	const [windowDocument, setWindowDocument] = useState(null);
	useEffect(() => {
		setWindowDocument(document);
	}, []);
	useEffect(() => {
		if (hostRef.current && !hostRef.current.shadowRoot) {
			const shadowRoot = hostRef.current.attachShadow({ mode: "open" });
			shadowRoot.adoptedStyleSheets = [getCSSStyleSheet(customCSS)];
			const container$1 = document.createElement("div");
			container$1.id = "marketplace-sdk-shadow-root";
			shadowRoot.appendChild(container$1);
			setContainer(container$1);
		}
	}, [windowDocument]);
	if (!enabled) return children;
	return windowDocument ? createPortal(/* @__PURE__ */ jsx("div", {
		"data-shadow-host": true,
		ref: hostRef,
		children: container && /* @__PURE__ */ jsx(ThemeProvider, {
			theme,
			root: container,
			children
		})
	}), document.body) : null;
};

//#endregion
//#region src/react/providers/modal-provider.tsx
const ModalProvider = observer(({ children }) => {
	const sdkConfig = useConfig();
	const { shadowDom, experimentalShadowDomCssOverride } = sdkConfig;
	const overrides = sdkConfig._internal?.overrides?.api?.marketplace;
	return /* @__PURE__ */ jsxs(Fragment, { children: [children, /* @__PURE__ */ jsx(SequenceCheckoutProvider, {
		config: { env: { marketplaceApiUrl: overrides?.url || marketplaceApiURL(overrides?.env || "production") } },
		children: /* @__PURE__ */ jsxs(ShadowRoot, {
			enabled: shadowDom ?? true,
			customCSS: experimentalShadowDomCssOverride,
			children: [
				/* @__PURE__ */ jsx(CreateListingModal, {}),
				/* @__PURE__ */ jsx(MakeOfferModal, {}),
				/* @__PURE__ */ jsx(TransferModal, {}),
				/* @__PURE__ */ jsx(SellModal, {}),
				/* @__PURE__ */ jsx(BuyModal, {}),
				/* @__PURE__ */ jsx(SuccessfulPurchaseModal_default, {}),
				/* @__PURE__ */ jsx(switchChainErrorModal_default, {}),
				/* @__PURE__ */ jsx(transactionStatusModal_default, {})
			]
		})
	})] });
});

//#endregion
//#region src/react/ui/modals/MakeOfferModal/index.tsx
const useMakeOfferModal = (callbacks) => ({
	show: (args) => makeOfferModal$.open({
		...args,
		callbacks
	}),
	close: () => makeOfferModal$.close()
});

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/ActionButton/store.ts
const actionButtonStore = createStore({
	context: { pendingAction: null },
	on: {
		setPendingAction: (context, event) => ({
			...context,
			pendingAction: {
				type: event.action,
				callback: event.onPendingActionExecuted,
				timestamp: Date.now(),
				collectibleId: event.tokenId
			}
		}),
		clearPendingAction: (context) => ({
			...context,
			pendingAction: null
		})
	}
});
const useActionButtonStore = () => {
	const pendingAction = useSelector(actionButtonStore, (state) => state.context.pendingAction);
	return {
		pendingAction,
		setPendingAction: (action, onPendingActionExecuted, tokenId) => {
			actionButtonStore.send({
				type: "setPendingAction",
				action,
				onPendingActionExecuted,
				tokenId
			});
		},
		clearPendingAction: () => {
			actionButtonStore.send({ type: "clearPendingAction" });
		},
		executePendingAction: () => {
			if (!pendingAction) return;
			const { timestamp, callback } = pendingAction;
			if (timestamp && callback) {
				if (Date.now() - timestamp < 300 * 1e3 && typeof callback === "function") callback();
			}
		}
	};
};

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/ActionButton/components/ActionButtonBody.tsx
function ActionButtonBody({ tokenId, label, onClick, icon, action, className }) {
	const { openConnectModal } = useOpenConnectModal$1();
	const { setPendingAction } = useActionButtonStore();
	const { address } = useAccount();
	const handleClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (!address && action) {
			setPendingAction(action, onClick, tokenId);
			openConnectModal();
		} else onClick();
	};
	return /* @__PURE__ */ jsxs(Button, {
		className: cn$1("flex w-full items-center justify-center", className ?? ""),
		variant: "primary",
		onClick: handleClick,
		size: "xs",
		shape: "square",
		children: [icon && icon, label]
	});
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/ActionButton/components/NonOwnerActions.tsx
function NonOwnerActions(props) {
	const { action, tokenId, collectionAddress, chainId, quantityDecimals, quantityRemaining, unlimitedSupply, cardType, hideQuantitySelector, labelOverride, className } = props;
	const { show: showBuyModal } = useBuyModal();
	const { show: showMakeOfferModal } = useMakeOfferModal();
	if (cardType === "shop") {
		const { salesContractAddress, salePrice } = props;
		return /* @__PURE__ */ jsx(ActionButtonBody, {
			action: CollectibleCardAction.BUY,
			tokenId,
			label: labelOverride?.buy ?? "Buy now",
			onClick: () => showBuyModal({
				chainId,
				collectionAddress,
				salesContractAddress,
				items: [{
					tokenId,
					quantity: "1"
				}],
				cardType: "shop",
				salePrice: {
					amount: salePrice.amount,
					currencyAddress: salePrice.currencyAddress
				},
				quantityDecimals: quantityDecimals ?? 0,
				quantityRemaining: quantityRemaining ?? 0,
				unlimitedSupply,
				hideQuantitySelector
			}),
			icon: /* @__PURE__ */ jsx(CartIcon, {}),
			className
		});
	}
	if (action === CollectibleCardAction.BUY) {
		const { lowestListing } = props;
		if (!lowestListing) throw new Error("lowestListing is required for BUY action and MARKET card type");
		return /* @__PURE__ */ jsx(ActionButtonBody, {
			action: CollectibleCardAction.BUY,
			tokenId,
			label: labelOverride?.buy ?? "Buy now",
			onClick: () => showBuyModal({
				collectionAddress,
				chainId,
				collectibleId: tokenId,
				orderId: lowestListing.orderId,
				marketplace: lowestListing.marketplace,
				cardType: "market",
				hideQuantitySelector
			}),
			icon: /* @__PURE__ */ jsx(CartIcon, {}),
			className
		});
	}
	if (action === CollectibleCardAction.OFFER) {
		const { orderbookKind } = props;
		return /* @__PURE__ */ jsx(ActionButtonBody, {
			action: CollectibleCardAction.OFFER,
			tokenId,
			label: labelOverride?.offer ?? "Make an offer",
			onClick: () => showMakeOfferModal({
				collectionAddress,
				chainId,
				collectibleId: tokenId,
				orderbookKind
			}),
			className
		});
	}
	return null;
}

//#endregion
//#region src/react/ui/modals/CreateListingModal/index.tsx
const useCreateListingModal = (callbacks) => {
	return {
		show: (args) => createListingModal$.open({
			...args,
			callbacks
		}),
		close: () => createListingModal$.close()
	};
};

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/ActionButton/components/OwnerActions.tsx
function OwnerActions({ action, tokenId, collectionAddress, chainId, orderbookKind, highestOffer, labelOverride, className }) {
	const { show: showCreateListingModal } = useCreateListingModal();
	const { show: showSellModal } = useSellModal();
	const { show: showTransferModal } = useTransferModal();
	if (action === CollectibleCardAction.LIST) return /* @__PURE__ */ jsx(ActionButtonBody, {
		label: labelOverride?.listing ?? "Create listing",
		tokenId,
		onClick: () => showCreateListingModal({
			collectionAddress,
			chainId,
			collectibleId: tokenId,
			orderbookKind
		}),
		className
	});
	if (action === CollectibleCardAction.SELL && highestOffer) return /* @__PURE__ */ jsx(ActionButtonBody, {
		tokenId,
		label: labelOverride?.sell ?? "Sell",
		onClick: () => showSellModal({
			collectionAddress,
			chainId,
			tokenId,
			order: highestOffer
		}),
		className
	});
	if (action === CollectibleCardAction.TRANSFER) return /* @__PURE__ */ jsx(ActionButtonBody, {
		label: labelOverride?.transfer ?? "Transfer",
		tokenId,
		onClick: () => showTransferModal({
			collectionAddress,
			chainId,
			collectibleId: tokenId
		}),
		className
	});
	return null;
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/ActionButton/hooks/useActionButtonLogic.ts
const useActionButtonLogic = ({ tokenId, owned, action, onCannotPerformAction }) => {
	const { address } = useAccount();
	const actionsThatOwnersCannotPerform = [CollectibleCardAction.BUY, CollectibleCardAction.OFFER];
	const { pendingAction, clearPendingAction, executePendingAction } = useActionButtonStore();
	const pendingActionType = pendingAction?.type;
	useEffect(() => {
		if (owned && pendingAction && address && actionsThatOwnersCannotPerform.includes(action) && pendingAction?.collectibleId === tokenId) {
			onCannotPerformAction?.(pendingActionType);
			clearPendingAction();
		}
	}, [
		owned,
		pendingAction,
		address,
		action,
		tokenId,
		onCannotPerformAction,
		pendingActionType,
		clearPendingAction
	]);
	useEffect(() => {
		if (address && !owned && pendingAction && pendingAction?.collectibleId === tokenId) {
			executePendingAction();
			clearPendingAction();
		}
	}, [
		address,
		owned,
		tokenId,
		pendingAction,
		executePendingAction,
		clearPendingAction
	]);
	return {
		address,
		shouldShowAction: !address ? [CollectibleCardAction.BUY, CollectibleCardAction.OFFER].includes(action) : true,
		isOwnerAction: address && owned && [
			CollectibleCardAction.LIST,
			CollectibleCardAction.TRANSFER,
			CollectibleCardAction.SELL
		].includes(action)
	};
};

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/ActionButton/ActionButton.tsx
function ActionButton({ collectionAddress, chainId, tokenId, orderbookKind, action, owned, highestOffer, lowestListing, onCannotPerformAction, cardType, salesContractAddress, prioritizeOwnerActions, salePrice, quantityDecimals, quantityRemaining, unlimitedSupply, hideQuantitySelector, labelOverride, className }) {
	const { shouldShowAction, isOwnerAction } = useActionButtonLogic({
		tokenId,
		owned,
		action,
		onCannotPerformAction
	});
	if (!shouldShowAction) return null;
	if (isOwnerAction || prioritizeOwnerActions) return /* @__PURE__ */ jsx(OwnerActions, {
		action,
		tokenId,
		collectionAddress,
		chainId,
		orderbookKind,
		highestOffer,
		labelOverride,
		className
	});
	return /* @__PURE__ */ jsx(NonOwnerActions, {
		...cardType === "shop" && salesContractAddress && salePrice ? {
			cardType: "shop",
			salesContractAddress,
			salePrice,
			action,
			tokenId,
			collectionAddress,
			chainId,
			quantityDecimals,
			quantityRemaining,
			unlimitedSupply,
			hideQuantitySelector,
			labelOverride
		} : {
			cardType: "market",
			orderbookKind,
			lowestListing,
			action,
			tokenId,
			collectionAddress,
			chainId,
			quantityDecimals,
			quantityRemaining,
			hideQuantitySelector,
			labelOverride
		},
		className
	});
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/variants/MarketCardPresentation.tsx
/**
* MarketCardPresentation - Pure presentation component for market cards
*
* This is a "dumb" component that receives all data as props and handles no data fetching.
* Use this when you want full control over data fetching, or for SSR/SSG scenarios.
*
* For a convenient "smart" component with built-in data fetching, use MarketCard instead.
*
* @example
* ```tsx
* // With pre-fetched data
* <MarketCardPresentation
*   tokenId="123"
*   chainId={1}
*   collectibleMetadata={metadata}
*   currency={currency}
*   lowestListing={listing}
* />
* ```
*/
function MarketCardPresentation({ tokenId, chainId, collectionAddress, collectionType, collectibleMetadata, currency, lowestListing, highestOffer, balance, assetSrcPrefixUrl, onCollectibleClick, onOfferClick, orderbookKind, action, showActionButton = true, onCannotPerformAction, prioritizeOwnerActions, hideQuantitySelector, classNames }) {
	const handleClick = onCollectibleClick ? () => onCollectibleClick(tokenId) : void 0;
	const handleKeyDown = onCollectibleClick ? (e) => {
		if (e.key === "Enter" || e.key === " ") onCollectibleClick(tokenId);
	} : void 0;
	console.log("classNames", classNames);
	return /* @__PURE__ */ jsxs(Card, {
		onClick: handleClick,
		onKeyDown: handleKeyDown,
		className: classNames?.cardRoot,
		children: [
			/* @__PURE__ */ jsx(Card.Media, {
				metadata: collectibleMetadata,
				assetSrcPrefixUrl,
				className: classNames?.cardMedia
			}),
			/* @__PURE__ */ jsxs(Card.Content, {
				className: classNames?.cardContent,
				children: [
					/* @__PURE__ */ jsx(Card.Title, {
						highestOffer,
						onOfferClick: (e) => onOfferClick?.({
							order: highestOffer,
							e
						}),
						balance,
						maxLength: highestOffer ? CARD_TITLE_MAX_LENGTH_WITH_OFFER : CARD_TITLE_MAX_LENGTH_DEFAULT,
						className: classNames?.cardTitle,
						children: collectibleMetadata.name || "Untitled"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-1",
						children: /* @__PURE__ */ jsx(Card.Price, {
							amount: lowestListing?.priceAmount,
							currency,
							className: classNames?.cardPrice
						})
					}),
					/* @__PURE__ */ jsx(Card.Badge, {
						type: collectionType,
						balance,
						decimals: collectibleMetadata.decimals,
						className: classNames?.cardBadge
					})
				]
			}),
			/* @__PURE__ */ jsx(Card.Footer, {
				show: showActionButton,
				className: classNames?.cardFooter,
				children: /* @__PURE__ */ jsx(ActionButton, {
					chainId,
					collectionAddress,
					tokenId,
					orderbookKind,
					action,
					highestOffer,
					lowestListing,
					owned: !!balance,
					onCannotPerformAction,
					cardType: "market",
					prioritizeOwnerActions,
					hideQuantitySelector,
					className: classNames?.cardActionButton
				})
			})
		]
	});
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/variants/MarketCard.tsx
/**
* MarketCard - Smart component with built-in data fetching
*
* This component handles currency fetching and action determination automatically.
* Use this for convenient plug-and-play integration.
*
* For full control over data fetching (e.g., SSR/SSG), use MarketCardPresentation instead.
*
* @example
* ```tsx
* <MarketCard
*   tokenId="123"
*   chainId={1}
*   collectionAddress="0x..."
*   collectible={collectible}
* />
* ```
*/
function MarketCard({ tokenId, chainId, collectionAddress, collectionType, assetSrcPrefixUrl, cardLoading, orderbookKind, collectible, onCollectibleClick, onOfferClick, balance, balanceIsLoading = false, onCannotPerformAction, prioritizeOwnerActions, hideQuantitySelector, classNames }) {
	const collectibleMetadata = collectible?.metadata;
	const highestOffer = collectible?.offer;
	const lowestListing = collectible?.listing;
	const { data: currency } = useCurrency({
		chainId,
		currencyAddress: lowestListing?.priceCurrencyAddress,
		query: { enabled: !!lowestListing?.priceCurrencyAddress }
	});
	if (!collectibleMetadata) {
		console.error("Collectible metadata is undefined");
		return null;
	}
	const skeleton = renderSkeletonIfLoading({
		cardLoading,
		balanceIsLoading,
		collectionType,
		isShop: false
	});
	if (skeleton) return skeleton;
	const showActionButton = !!highestOffer || !!collectible;
	const action = determineCardAction({
		hasBalance: !!balance,
		hasOffer: !!highestOffer,
		hasListing: !!lowestListing
	});
	console.log("classNames", classNames);
	return /* @__PURE__ */ jsx(MarketCardPresentation, {
		tokenId,
		chainId,
		collectionAddress,
		collectionType,
		collectibleMetadata,
		currency,
		lowestListing,
		highestOffer,
		balance,
		assetSrcPrefixUrl,
		onCollectibleClick,
		onOfferClick,
		orderbookKind,
		action,
		showActionButton,
		onCannotPerformAction,
		prioritizeOwnerActions,
		hideQuantitySelector,
		classNames
	});
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/variants/NonTradableInventoryCard.tsx
const NonTradableInventoryCard = forwardRef(({ collectionType, assetSrcPrefixUrl, cardLoading, balance, balanceIsLoading, collectibleMetadata, classNames }, ref) => {
	const skeleton = renderSkeletonIfLoading({
		cardLoading,
		balanceIsLoading,
		collectionType,
		isShop: false
	});
	if (skeleton) return skeleton;
	return /* @__PURE__ */ jsxs(Card, {
		ref,
		className: classNames?.cardRoot,
		children: [/* @__PURE__ */ jsx(Card.Media, {
			metadata: collectibleMetadata,
			assetSrcPrefixUrl,
			className: classNames?.cardMedia
		}), /* @__PURE__ */ jsxs(Card.Content, {
			className: classNames?.cardContent,
			children: [
				/* @__PURE__ */ jsx(Card.Title, {
					className: classNames?.cardTitle,
					children: collectibleMetadata.name || "Untitled"
				}),
				/* @__PURE__ */ jsx(Card.Price, { className: classNames?.cardPrice }),
				/* @__PURE__ */ jsx(Card.Badge, {
					type: collectionType,
					balance,
					decimals: collectibleMetadata.decimals,
					className: classNames?.cardBadge
				})
			]
		})]
	});
});
NonTradableInventoryCard.displayName = "NonTradableInventoryCard";

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/variants/ShopCardPresentation.tsx
/**
* ShopCardPresentation - Pure presentation component for shop/primary sale cards
*
* This is a "dumb" component that receives all data as props and handles no data fetching.
* Use this when you want full control over data fetching, or for SSR/SSG scenarios.
*
* For a convenient "smart" component with built-in data fetching, use ShopCard instead.
*
* @example
* ```tsx
* // With pre-fetched data
* <ShopCardPresentation
*   tokenId="123"
*   chainId={1}
*   tokenMetadata={metadata}
*   saleCurrency={currency}
*   shopState={shopState}
* />
* ```
*/
function ShopCardPresentation({ tokenId, chainId, collectionAddress, collectionType, tokenMetadata, saleCurrency, salePrice, assetSrcPrefixUrl, shopState, cardType, salesContractAddress, quantityDecimals, quantityRemaining, unlimitedSupply, hideQuantitySelector, classNames }) {
	return /* @__PURE__ */ jsxs(Card, {
		className: classNames?.cardRoot,
		children: [
			/* @__PURE__ */ jsx(Card.Media, {
				metadata: tokenMetadata,
				assetSrcPrefixUrl,
				className: cn$1(shopState.mediaClassName, classNames?.cardMedia)
			}),
			/* @__PURE__ */ jsxs(Card.Content, {
				className: classNames?.cardContent,
				children: [
					/* @__PURE__ */ jsx(Card.Title, {
						className: cn$1(shopState.titleClassName, classNames?.cardTitle),
						maxLength: CARD_TITLE_MAX_LENGTH_DEFAULT,
						children: tokenMetadata.name || "Untitled"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-1",
						children: collectionType === ContractType.ERC1155 && salePrice?.amount && saleCurrency && /* @__PURE__ */ jsx(Card.Price, {
							amount: salePrice.amount,
							currency: saleCurrency,
							className: classNames?.cardPrice
						})
					}),
					/* @__PURE__ */ jsx(Card.SaleDetails, {
						quantityRemaining: quantityRemaining !== void 0 ? String(quantityRemaining) : void 0,
						type: collectionType,
						unlimitedSupply,
						className: classNames?.cardSaleDetails
					}),
					!salePrice?.amount && /* @__PURE__ */ jsx("div", { className: "h-5 w-full" })
				]
			}),
			/* @__PURE__ */ jsx(Card.Footer, {
				show: shopState.showActionButton,
				className: classNames?.cardFooter,
				children: /* @__PURE__ */ jsx(ActionButton, {
					chainId,
					collectionAddress,
					tokenId,
					action: CollectibleCardAction.BUY,
					owned: false,
					cardType,
					salesContractAddress,
					salePrice,
					quantityDecimals,
					quantityRemaining,
					unlimitedSupply,
					hideQuantitySelector,
					className: classNames?.cardActionButton
				})
			})
		]
	});
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/variants/ShopCard.tsx
/**
* ShopCard - Smart component with built-in data fetching
*
* This component handles currency fetching and shop state calculation automatically.
* Use this for convenient plug-and-play integration.
*
* For full control over data fetching (e.g., SSR/SSG), use ShopCardPresentation instead.
*
* @example
* ```tsx
* <ShopCard
*   tokenId="123"
*   chainId={1}
*   collectionAddress="0x..."
*   tokenMetadata={metadata}
*   salePrice={salePrice}
* />
* ```
*/
function ShopCard({ tokenId, chainId, collectionAddress, collectionType, assetSrcPrefixUrl, cardLoading, cardType, salesContractAddress, tokenMetadata, salePrice, quantityDecimals, quantityInitial, quantityRemaining, unlimitedSupply, hideQuantitySelector, classNames }) {
	const { data: saleCurrency, isLoading: saleCurrencyLoading } = useCurrency({
		chainId,
		currencyAddress: salePrice?.currencyAddress,
		query: { enabled: !!salePrice?.currencyAddress && !!salesContractAddress && collectionType === ContractType.ERC1155 }
	});
	if (!tokenMetadata || !salePrice) {
		console.error("Token metadata or sale price is undefined", {
			tokenMetadata,
			salePrice
		});
		return null;
	}
	const skeleton = renderSkeletonIfLoading({
		cardLoading,
		balanceIsLoading: saleCurrencyLoading,
		collectionType,
		isShop: true
	});
	if (skeleton) return skeleton;
	return /* @__PURE__ */ jsx(ShopCardPresentation, {
		tokenId,
		chainId,
		collectionAddress,
		collectionType,
		tokenMetadata,
		saleCurrency,
		salePrice,
		assetSrcPrefixUrl,
		shopState: getShopCardState({
			quantityRemaining,
			quantityInitial,
			unlimitedSupply,
			collectionType,
			salesContractAddress
		}),
		cardType,
		salesContractAddress,
		quantityDecimals,
		quantityRemaining: quantityRemaining !== void 0 ? Number(quantityRemaining) : void 0,
		unlimitedSupply,
		hideQuantitySelector,
		classNames
	});
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/CollectibleCard.tsx
function CollectibleCard(props) {
	switch (props.cardType) {
		case "shop": return /* @__PURE__ */ jsx(ShopCard, { ...props });
		case "market": return /* @__PURE__ */ jsx(MarketCard, { ...props });
		case "inventory-non-tradable": return /* @__PURE__ */ jsx(NonTradableInventoryCard, { ...props });
	}
}

//#endregion
export { useCurrencyConvertToUSD as $, useProcessStep as A, useMarketCheckoutOptions as At, useMarketCardData as B, useGenerateSellTransaction as C, useCollectibleMarketList as Ct, useGenerateListingTransaction as D, useErc721SaleDetails as Dt, generateListingTransaction as E, useCollectibleMarketActivities as Et, useOpenConnectModal$1 as F, DatabeatAnalytics as Ft, useTokenRanges as G, BaseModal as H, useFilters as I, useAnalytics as It, useTokenCurrencyBalance as J, useTokenMetadataSearch as K, useFiltersProgressive as L, useGenerateCancelTransaction as M, MarketplaceProvider as Mt, useEnsureCorrectChain as N, MarketplaceQueryClientProvider as Nt, useCancelOrder as O, useCollectibleBalance as Ot, useAutoSelectFeeOption as P, MarketplaceSdkContext as Pt, useCurrency as Q, usePrimarySale1155CardData as R, generateSellTransaction as S, useCollectibleMarketListPaginated as St, useGenerateOfferTransaction as T, useCollectibleMarketCount as Tt, useSellModal as U, ActionModal as V, useConnectorMetadata as W, useInventory as X, useTokenBalances as Y, useCurrencyList as Z, royaltyQueryOptions as _, useCollectibleMarketOffersCount as _t, MarketCard as a, useCollectionMarketFloor as at, useTransferTokens as b, useCollectibleMarketListingsCount as bt, useCreateListingModal as c, useCollectionMarketDetailPolling as ct, useTransferModal as d, useMarketplaceConfig as dt, useCurrencyComparePrices as et, useSuccessfulPurchaseModal as f, useCollectionBalanceDetails as ft, ErrorBoundary as g, useCollectibleMetadata as gt, ErrorModal as h, usePrimarySaleItems as ht, NonTradableInventoryCard as i, useCollectionMarketItems as it, generateCancelTransaction as j, useConfig as jt, useCancelTransactionSteps as k, usePrimarySaleCheckoutOptions as kt, useMakeOfferModal as l, useCollectionMarketActivities as lt, LoadingModal as m, usePrimarySaleItemsCount as mt, ShopCard as n, useCollectionMarketItemsPaginated as nt, MarketCardPresentation as o, useCollectionMarketFilteredCount as ot, useBuyModal as p, useCollectibleTokenBalances as pt, useTokenMetadata as q, ShopCardPresentation as r, useCollectionMarketItemsCount as rt, ActionButton as s, collectionMarketDetailPollingOptions as st, CollectibleCard as t, useCollectionMetadata as tt, ModalProvider as u, useCollectionList as ut, useRoyalty as v, useCollectibleMarketOffers as vt, generateOfferTransaction as w, useCollectibleMarketHighestOffer as wt, useOrderSteps as x, useCollectibleMarketListings as xt, useGetReceiptFromHash as y, useCollectibleMarketLowestListing as yt, usePrimarySale721CardData as z };
//# sourceMappingURL=react-Cgl7oDkM.js.map