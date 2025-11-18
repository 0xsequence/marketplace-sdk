'use client';
import { t as DEFAULT_MARKETPLACE_FEE_PERCENTAGE } from "./src.js";
import { a as TransactionExecutionError, c as BaseError$1, i as NoWalletConnectedError, n as InvalidContractTypeError, o as TransactionSignatureError, s as UserRejectedRequestError$1, t as ChainSwitchError } from "./transaction.js";
import { _ as getQueryClient, c as balanceQueries, n as getIndexerClient, r as getMarketplaceClient, u as collectableKeys } from "./api.js";
import { A as PropertyType, P as StepType, S as OrderbookKind, U as WalletKind, b as OrderSide, l as ExecuteType, m as MarketplaceKind, o as CollectionStatus, s as ContractType, y as OfferType } from "./marketplace.gen.js";
import { n as getPresentableChainName, t as getNetwork } from "./network.js";
import { n as PROVIDER_ID, t as TransactionType } from "./_internal.js";
import { r as TransactionType$1, t as CollectibleCardAction } from "./types.js";
import { n as SequenceMarketplaceV1_ABI, r as EIP2981_ABI } from "./marketplace.js";
import { i as ERC721_SALE_ABI_V0, r as ERC721_SALE_ABI_V1 } from "./primary-sale.js";
import { i as ERC20_ABI, n as ERC1155_ABI, r as ERC721_ABI } from "./token.js";
import { c as cn$1, d as truncateMiddle, i as formatPrice, l as compareAddress, o as validateOpenseaOfferDecimals, r as calculateTotalOfferCost, t as calculateEarningsAfterFees } from "./utils.js";
import { n as marketplaceConfigOptions } from "./marketplaceConfig.js";
import { n as useSalesContractABI, t as SalesContractVersion } from "./contracts.js";
import { g as balanceOfCollectibleOptions, l as listCollectibleActivitiesQueryOptions, o as listCollectiblesQueryOptions, p as collectibleQueryOptions, r as listCollectiblesPaginatedQueryOptions, u as countOfCollectablesQueryOptions } from "./collectibles.js";
import { _ as collectionActiveListingsCurrenciesQueryOptions, b as collectionQueryOptions, c as collectionDetailsQueryOptions, d as collectionBalanceDetailsQueryOptions, i as listCollectionsQueryOptions, m as collectionActiveOffersCurrenciesQueryOptions, s as listCollectionActivitiesQueryOptions } from "./collections.js";
import { i as checkoutOptionsSalesContractQueryOptions, n as filtersQueryOptions, u as currencyQueryOptions } from "./market.js";
import { r as marketCurrenciesQueryOptions } from "./marketCurrencies.js";
import { A as countItemsOrdersForCollectionQueryOptions, D as countListingsForCollectibleQueryOptions, S as floorOrderQueryOptions, _ as highestOfferQueryOptions, b as getCountOfFilteredOrdersQueryOptions, d as listItemsOrdersForCollectionPaginatedQueryOptions, l as listListingsForCollectibleQueryOptions, m as listItemsOrdersForCollectionQueryOptions, o as listOffersForCollectibleQueryOptions, r as lowestListingQueryOptions, w as countOffersForCollectibleQueryOptions } from "./lowestListing.js";
import { n as inventoryOptions } from "./inventory.js";
import { n as ordersQueryOptions } from "./queries.js";
import { l as primarySaleItemQueryOptions, o as listPrimarySaleItemsQueryOptions, r as primarySaleItemsCountQueryOptions, u as countOfPrimarySaleItemsOptions } from "./primary-sales.js";
import { f as listBalancesOptions, h as getTokenRangesQueryOptions, l as listTokenMetadataQueryOptions, o as searchTokenMetadataQueryOptions, r as tokenSuppliesQueryOptions } from "./tokens.js";
import { i as convertPriceToUSDQueryOptions, t as comparePricesQueryOptions } from "./utils2.js";
import { t as waitForTransactionReceipt } from "./waitForTransactionReceipt.js";
import { n as CalendarIcon_default, r as InfoIcon_default, t as CartIcon_default } from "./CartIcon.js";
import { a as FooterName, n as SaleDetailsPill, r as PriceDisplay, t as TokenTypeBalancePill } from "./components.js";
import { NetworkType, networks } from "@0xsequence/network";
import { useAccount, useBalance, useChainId, useConnections, usePublicClient, useReadContract, useReadContracts, useSendTransaction, useSignMessage, useSignTypedData, useSwitchChain, useWalletClient, useWriteContract } from "wagmi";
import { sendTransactions, useChain, useOpenConnectModal, useWaasFeeOptions } from "@0xsequence/connect";
import { Suspense, createContext, lazy, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { QueryClientProvider, queryOptions, skipToken, useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { ContractVerificationStatus, TransactionStatus } from "@0xsequence/indexer";
import { AddIcon, Button, CheckmarkIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, CloseIcon, Divider, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger, ExternalLinkIcon, IconButton, Image, InfoIcon, Modal, NetworkImage, NumericInput, Select, Skeleton, Spinner, SubtractIcon, Text, TextInput, ThemeProvider, TimeIcon, TokenImage, Tooltip, WarningIcon, cn } from "@0xsequence/design-system";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import * as dn from "dnum";
import { BaseError, UserRejectedRequestError, WaitForTransactionReceiptTimeoutError, encodeFunctionData, erc20Abi, erc721Abi, formatUnits, hexToBigInt, isAddress, isHex, parseEventLogs, parseUnits, zeroAddress } from "viem";
import { Databeat } from "@databeat/tracker";
import { observable } from "@legendapp/state";
import { avalanche, optimism } from "viem/chains";
import { createStore } from "@xstate/store";
import { useSelector } from "@xstate/store/react";
import { createSerializer, parseAsBoolean, parseAsJson, parseAsString, useQueryState } from "nuqs";
import { Show, observer, use$ } from "@legendapp/state/react";
import { addDays, differenceInDays, endOfDay, format, formatDistanceToNow, getHours, getMinutes, isSameDay, setHours, setMinutes, startOfDay } from "date-fns";
import { useSupportedChains } from "xtrails";
import { TrailsWidget } from "xtrails/widget";
import { DayPicker } from "react-day-picker";
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
//#region src/react/hooks/config/useMarketplaceConfig.tsx
const useMarketplaceConfig = () => {
	return useQuery(marketplaceConfigOptions(useConfig()));
};

//#endregion
//#region src/react/hooks/data/collectibles/useBalanceOfCollectible.tsx
/**
* Hook to fetch the balance of a specific collectible for a user
*
* @param args - The arguments for fetching the balance
* @returns Query result containing the balance data
*
* @example
* ```tsx
* const { data, isLoading, error } = useBalanceOfCollectible({
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
function useBalanceOfCollectible(args) {
	const config = useConfig();
	return useQuery(balanceOfCollectibleOptions({ ...args }, config));
}

//#endregion
//#region src/react/hooks/data/collectibles/useCollectible.tsx
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
* const { data: collectible, isLoading } = useCollectible({
*   chainId: 137,
*   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
*   collectibleId: '12345'
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data } = useCollectible({
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
function useCollectible(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...collectibleQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/collectibles/useCountOfCollectables.tsx
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
* const { data: totalCount, isLoading } = useCountOfCollectables({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
* ```
*
* @example
* With filters (count filtered collectibles):
* ```typescript
* const { data: filteredCount } = useCountOfCollectables({
*   chainId: 137,
*   collectionAddress: '0x...',
*   filter: { priceRange: { min: '1000000000000000000' } },
*   side: OrderSide.SELL
* })
* ```
*/
function useCountOfCollectables(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...countOfCollectablesQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/collectibles/useListCollectibleActivities.tsx
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
* const { data, isLoading } = useListCollectibleActivities({
*   chainId: 137,
*   collectionAddress: '0x...',
*   tokenId: '123'
* })
* ```
*
* @example
* With pagination:
* ```typescript
* const { data } = useListCollectibleActivities({
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
* const { data } = useListCollectibleActivities({
*   chainId: 137,
*   collectionAddress: '0x...',
*   tokenId: '789',
*   sort: 'timestamp_desc',
*   pageSize: 50
* })
* ```
*/
function useListCollectibleActivities(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...listCollectibleActivitiesQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/collectibles/useListCollectibles.tsx
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
* const { data, isLoading, fetchNextPage, hasNextPage } = useListCollectibles({
*   chainId: 137,
*   collectionAddress: '0x...',
*   side: OrderSide.listing
* })
* ```
*
* @example
* With filtering:
* ```typescript
* const { data, fetchNextPage } = useListCollectibles({
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
function useListCollectibles(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useInfiniteQuery({ ...listCollectiblesQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/collectibles/useListCollectiblesPaginated.tsx
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
* const { data, isLoading } = useListCollectiblesPaginated({
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
* const { data } = useListCollectiblesPaginated({
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
* const { data, isLoading } = useListCollectiblesPaginated({
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
function useListCollectiblesPaginated(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...listCollectiblesPaginatedQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/collections/useCollection.tsx
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
* const { data, isLoading } = useCollection({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data, isLoading } = useCollection({
*   chainId: 1,
*   collectionAddress: '0x...',
*   query: {
*     refetchInterval: 30000,
*     enabled: userWantsToFetch
*   }
* })
* ```
*/
function useCollection(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...collectionQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/collections/useCollectionActiveListingsCurrencies.tsx
/**
* Hook to fetch the active listings currencies for a collection
*
* Retrieves all currencies that are currently being used in active listings
* for a specific collection from the marketplace.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the array of currencies used in active listings
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useCollectionActiveListingsCurrencies({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data, isLoading } = useCollectionActiveListingsCurrencies({
*   chainId: 1,
*   collectionAddress: '0x...',
*   query: {
*     refetchInterval: 30000,
*     enabled: hasCollectionAddress
*   }
* })
* ```
*/
function useCollectionActiveListingsCurrencies(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...collectionActiveListingsCurrenciesQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/collections/useCollectionActiveOffersCurrencies.tsx
/**
* Hook to fetch the active offers currencies for a collection
*
* Retrieves all currencies that are currently being used in active offers
* for a specific collection from the marketplace.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the array of currencies used in active offers
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useCollectionActiveOffersCurrencies({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data, isLoading } = useCollectionActiveOffersCurrencies({
*   chainId: 1,
*   collectionAddress: '0x...',
*   query: {
*     refetchInterval: 30000,
*     enabled: hasCollectionAddress
*   }
* })
* ```
*/
function useCollectionActiveOffersCurrencies(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...collectionActiveOffersCurrenciesQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/collections/useCollectionBalanceDetails.tsx
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
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...collectionBalanceDetailsQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/collections/useCollectionDetails.ts
/**
* Hook to fetch detailed information about a collection
*
* This hook retrieves comprehensive metadata and details for an NFT collection,
* including collection name, description, banner, avatar, social links, stats, etc.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the collection details
*
* @example
* Basic usage:
* ```typescript
* const { data: collection, isLoading } = useCollectionDetails({
*   chainId: 137,
*   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e'
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data } = useCollectionDetails({
*   chainId: 137,
*   collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
*   query: {
*     enabled: Boolean(collectionAddress),
*     staleTime: 60_000
*   }
* })
* ```
*/
function useCollectionDetails(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...collectionDetailsQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/collections/useCollectionDetailsPolling.tsx
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
const collectionDetailsPollingOptions = (args, config) => {
	return queryOptions({
		...collectionDetailsQueryOptions({
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
const useCollectionDetailsPolling = (args) => {
	return useQuery(collectionDetailsPollingOptions(args, useConfig()));
};

//#endregion
//#region src/react/hooks/data/collections/useListCollectionActivities.tsx
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
* const { data, isLoading } = useListCollectionActivities({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
* ```
*
* @example
* With pagination:
* ```typescript
* const { data } = useListCollectionActivities({
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
* const { data } = useListCollectionActivities({
*   chainId: 137,
*   collectionAddress: '0x...',
*   sort: [{ column: 'createdAt', order: SortOrder.DESC }],
*   pageSize: 50
* })
* ```
*/
function useListCollectionActivities(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...listCollectionActivitiesQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/collections/useListCollections.tsx
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
* const { data: marketCollections } = useListCollections({
*   marketplaceType: 'market'
* });
* ```
*/
function useListCollections(params = {}) {
	const defaultConfig = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const { config = defaultConfig, marketplaceConfig: paramMarketplaceConfig, ...rest } = params;
	return useQuery({ ...listCollectionsQueryOptions({
		config,
		marketplaceConfig: paramMarketplaceConfig || marketplaceConfig,
		...rest
	}) });
}

//#endregion
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
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...currencyQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/ui/modals/SellModal/store.ts
const initialState$2 = {
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
const sellModal$ = observable(initialState$2);

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
function useListMarketCardData({ collectionAddress, chainId, orderbookKind, collectionType, filterOptions, searchText, showListedOnly = false, priceFilters, onCollectibleClick, onCannotPerformAction, prioritizeOwnerActions, assetSrcPrefixUrl, hideQuantitySelector }) {
	const { address: accountAddress } = useAccount();
	const { show: showSellModal } = useSellModal();
	const { data: collectiblesList, isLoading: collectiblesListIsLoading, fetchNextPage, hasNextPage, isFetchingNextPage, error: collectiblesListError } = useListCollectibles({
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
					collectibleId: collectible.metadata.tokenId,
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
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...marketCurrenciesQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/orders/useCountItemsOrdersForCollection.tsx
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
* const { data: orderCount, isLoading } = useCountItemsOrdersForCollection({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
* ```
*
* @example
* With filter:
* ```typescript
* const { data: filteredCount } = useCountItemsOrdersForCollection({
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
* const { data: totalCount } = useCountItemsOrdersForCollection({
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
function useCountItemsOrdersForCollection(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...countItemsOrdersForCollectionQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/orders/useCountListingsForCollectible.tsx
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
* const { data: listingCount, isLoading } = useCountListingsForCollectible({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '123'
* })
* ```
*
* @example
* With filter:
* ```typescript
* const { data: filteredCount } = useCountListingsForCollectible({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '123',
*   filter: { priceRange: { min: '1000000000000000000' } }
* })
* ```
*/
function useCountListingsForCollectible(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...countListingsForCollectibleQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/orders/useCountOffersForCollectible.tsx
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
* const { data: offerCount, isLoading } = useCountOffersForCollectible({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '123'
* })
* ```
*
* @example
* With filter:
* ```typescript
* const { data: filteredCount } = useCountOffersForCollectible({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '123',
*   filter: { priceRange: { min: '1000000000000000000' } }
* })
* ```
*/
function useCountOffersForCollectible(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...countOffersForCollectibleQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/orders/useFloorOrder.tsx
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
* const { data, isLoading } = useFloorOrder({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
* ```
*
* @example
* With filters and custom query options:
* ```typescript
* const { data, isLoading } = useFloorOrder({
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
function useFloorOrder(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...floorOrderQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/orders/useGetCountOfFilteredOrders.tsx
function useGetCountOfFilteredOrders(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...getCountOfFilteredOrdersQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/orders/useHighestOffer.tsx
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
* const { data, isLoading } = useHighestOffer({
*   chainId: 137,
*   collectionAddress: '0x...',
*   tokenId: '1'
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data, isLoading } = useHighestOffer({
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
function useHighestOffer(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...highestOfferQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/orders/useListItemsOrdersForCollection.tsx
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
* const { data, isLoading, fetchNextPage, hasNextPage } = useListItemsOrdersForCollection({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
* ```
*
* @example
* With filtering:
* ```typescript
* const { data, fetchNextPage } = useListItemsOrdersForCollection({
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
* const { data } = useListItemsOrdersForCollection({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
*
* const allListings = data?.pages.flatMap(page => page.listings) ?? []
* ```
*/
function useListItemsOrdersForCollection(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useInfiniteQuery({ ...listItemsOrdersForCollectionQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/orders/useListItemsOrdersForCollectionPaginated.tsx
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
* const { data, isLoading } = useListItemsOrdersForCollectionPaginated({
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
* const { data } = useListItemsOrdersForCollectionPaginated({
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
* const { data, isLoading } = useListItemsOrdersForCollectionPaginated({
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
function useListItemsOrdersForCollectionPaginated(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...listItemsOrdersForCollectionPaginatedQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/orders/useListListingsForCollectible.tsx
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
* const { data, isLoading } = useListListingsForCollectible({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '123'
* })
* ```
*
* @example
* With pagination:
* ```typescript
* const { data } = useListListingsForCollectible({
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
* const { data } = useListListingsForCollectible({
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
function useListListingsForCollectible(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...listListingsForCollectibleQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/orders/useListOffersForCollectible.tsx
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
* const { data, isLoading } = useListOffersForCollectible({
*   chainId: 137,
*   collectionAddress: '0x...',
*   collectibleId: '1'
* })
* ```
*
* @example
* With filtering:
* ```typescript
* const { data } = useListOffersForCollectible({
*   chainId: 1,
*   collectionAddress: '0x...',
*   collectibleId: '1',
*   filter: {
*     marketplace: [MarketplaceKind.sequence_marketplace_v2]
*   }
* })
* ```
*/
function useListOffersForCollectible(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...listOffersForCollectibleQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/orders/useLowestListing.tsx
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
* const { data, isLoading } = useLowestListing({
*   chainId: 137,
*   collectionAddress: '0x...',
*   tokenId: '1'
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data, isLoading } = useLowestListing({
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
function useLowestListing(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...lowestListingQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/primary-sales/useCountOfPrimarySaleItems.tsx
function useCountOfPrimarySaleItems(args) {
	return useQuery(countOfPrimarySaleItemsOptions(args, useConfig()));
}

//#endregion
//#region src/react/hooks/data/primary-sales/useErc721SalesData.tsx
function useErc721SaleDetails({ chainId, salesContractAddress, itemsContractAddress, enabled }) {
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
//#region src/react/hooks/data/primary-sales/useGetCountOfPrimarySaleItems.tsx
/**
* Hook to get the total count of primary sale items
*
* Retrieves the total count of primary sale items for a specific contract address
* from the marketplace.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.primarySaleContractAddress - The primary sale contract address
* @param params.filter - Optional filter parameters for the query
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the count of primary sale items
*
* @example
* ```typescript
* const { data: count, isLoading } = useGetCountOfPrimarySaleItems({
*   chainId: 137,
*   primarySaleContractAddress: '0x...',
* })
* ```
*/
function useGetCountOfPrimarySaleItems(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery(primarySaleItemsCountQueryOptions({
		config,
		...rest
	}));
}

//#endregion
//#region src/react/hooks/data/tokens/useGetTokenRanges.tsx
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
* const { data: tokenRanges, isLoading } = useGetTokenRanges({
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
* const { data: tokenRanges } = useGetTokenRanges({
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
function useGetTokenRanges(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...getTokenRangesQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/tokens/useListBalances.tsx
/**
* Hook to fetch a list of token balances with pagination support
*
* @param args - The arguments for fetching the balances
* @returns Infinite query result containing the balances data
*
* @example
* ```tsx
* const { data, isLoading, error, fetchNextPage } = useListBalances({
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
function useListBalances(args) {
	const config = useConfig();
	return useInfiniteQuery(listBalancesOptions({ ...args }, config));
}

//#endregion
//#region src/react/hooks/data/tokens/useListTokenMetadata.tsx
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
* const { data: metadata, isLoading } = useListTokenMetadata({
*   chainId: 137,
*   contractAddress: '0x...',
*   tokenIds: ['1', '2', '3']
* })
* ```
*
* @example
* With query options:
* ```typescript
* const { data: metadata } = useListTokenMetadata({
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
function useListTokenMetadata(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...listTokenMetadataQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/tokens/useTokenSupplies.ts
/**
* Hook to fetch token supplies from the indexer
*
* Retrieves supply information for tokens from a specific collection.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.includeMetadata - Whether to include token metadata
* @param params.page - Pagination options
* @param params.query - Optional React Query configuration
*
* @returns Query result containing token supplies
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useTokenSupplies({
*   chainId: 137,
*   collectionAddress: '0x...'
* })
* ```
*
* @example
* With conditional fetching:
* ```typescript
* const { data, isLoading } = useTokenSupplies({
*   chainId: 1,
*   collectionAddress: selectedCollection,
*   query: {
*     enabled: !!selectedCollection
*   }
* })
* ```
*/
function useTokenSupplies(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useInfiniteQuery({ ...tokenSuppliesQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/tokens/useSearchTokenMetadata.tsx
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
* const { data, isLoading, fetchNextPage, hasNextPage } = useSearchTokenMetadata({
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
* const { data, fetchNextPage } = useSearchTokenMetadata({
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
* const { data, fetchNextPage } = useSearchTokenMetadata({
*   chainId: 1,
*   collectionAddress: '0x...',
*   onlyMinted: true,
*   filter: {
*     text: 'dragon'
*   }
* })
* ```
*/
function useSearchTokenMetadata(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, onlyMinted, ...rest } = params;
	const { data: suppliesData, hasNextPage: hasNextSuppliesPage, isFetching: isSuppliesFetching, isLoading: isSuppliesLoading, error: suppliesError, fetchNextPage: fetchNextSuppliesPage } = useTokenSupplies({
		chainId: params.chainId,
		collectionAddress: params.collectionAddress,
		includeMetadata: true,
		query: { enabled: onlyMinted && !!params.collectionAddress && (params.query?.enabled ?? true) }
	});
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
//#region src/react/hooks/data/primary-sales/useList721ShopCardData.tsx
function useList721ShopCardData({ primarySaleItemsWithMetadata, chainId, contractAddress, salesContractAddress, enabled = true }) {
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
			collectibleId: metadata.tokenId,
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
			collectibleId: item.tokenID,
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
//#region src/react/hooks/data/primary-sales/useList1155ShopCardData.tsx
function useList1155ShopCardData({ primarySaleItemsWithMetadata, chainId, contractAddress, salesContractAddress, enabled = true }) {
	const { abi, isLoading: versionLoading } = useSalesContractABI({
		contractAddress: salesContractAddress,
		contractType: ContractType.ERC1155,
		chainId,
		enabled
	});
	const { data: collection, isLoading: collectionLoading } = useCollection({
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
				collectibleId: metadata.tokenId,
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
//#region src/react/hooks/data/primary-sales/useListPrimarySaleItems.tsx
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
* const { data, isLoading } = useListPrimarySaleItems({
*   chainId: 137,
*   primarySaleContractAddress: '0x...',
* })
* ```
*
* @example
* With filters and pagination:
* ```typescript
* const { data, isLoading } = useListPrimarySaleItems({
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
function useListPrimarySaleItems(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useInfiniteQuery(listPrimarySaleItemsQueryOptions({
		config,
		...rest
	}));
}

//#endregion
//#region src/react/hooks/data/primary-sales/usePrimarySaleItem.tsx
/**
* Hook to fetch a single primary sale item
*
* Retrieves details for a specific primary sale item from a primary sale contract.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.primarySaleContractAddress - The primary sale contract address
* @param params.tokenId - The token ID of the primary sale item
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the primary sale item data
*
* @example
* Basic usage:
* ```typescript
* const { data: item, isLoading } = usePrimarySaleItem({
*   chainId: 137,
*   primarySaleContractAddress: '0x...',
*   tokenId: '1',
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data } = usePrimarySaleItem({
*   chainId: 1,
*   primarySaleContractAddress: '0x...',
*   tokenId: '42',
*   query: {
*     enabled: Boolean(primarySaleContractAddress && tokenId),
*     staleTime: 30_000
*   }
* })
* ```
*/
function usePrimarySaleItem(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...primarySaleItemQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/data/inventory/useInventory.tsx
function useInventory(args) {
	const config = useConfig();
	return useQuery(inventoryOptions({ ...args }, config));
}

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
const initialContext$5 = {
	isOpen: false,
	props: null,
	buyAnalyticsId: "",
	onError: (() => {}),
	onSuccess: (() => {})
};
const buyModalStore = createStore({
	context: { ...initialContext$5 },
	on: {
		open: (context, event) => {
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
				isOpen: true
			};
		},
		close: (context) => ({
			...context,
			isOpen: false
		})
	}
});
const useIsOpen$2 = () => useSelector(buyModalStore, (state) => state.context.isOpen);
const useBuyModalProps = () => {
	const props = useSelector(buyModalStore, (state) => state.context.props);
	if (!props) throw new Error("BuyModal props not initialized. Make sure to call show() first.");
	return props;
};
const useOnSuccess = () => useSelector(buyModalStore, (state) => state.context.onSuccess);

//#endregion
//#region src/react/hooks/transactions/useMarketTransactionSteps.ts
/**
* Hook to generate transaction steps for market transactions (secondary sales)
* This directly calls the marketplace API without using generators
*/
function useMarketTransactionSteps({ chainId, collectionAddress, buyer, marketplace, orderId, collectibleId, quantity, additionalFees = [], enabled = true }) {
	const config = useConfig();
	const marketplaceClient = useMemo(() => getMarketplaceClient(config), [config]);
	return useQuery({
		queryKey: ["market-transaction-steps", {
			chainId,
			collectionAddress,
			buyer,
			orderId,
			collectibleId,
			quantity
		}],
		queryFn: async () => {
			return (await marketplaceClient.generateBuyTransaction({
				chainId: chainId.toString(),
				collectionAddress,
				buyer,
				marketplace,
				ordersData: [{
					orderId,
					quantity,
					tokenId: collectibleId
				}],
				additionalFees,
				walletType: WalletKind.unknown
			})).steps;
		},
		enabled: enabled && !!buyer
	});
}

//#endregion
//#region src/react/hooks/transactions/usePrimarySaleTransactionSteps.ts
/**
* Hook to generate transaction steps for primary sale transactions (minting/shop)
* This directly creates steps without using generators
*/
function usePrimarySaleTransactionSteps({ chainId, buyer, recipient, salesContractAddress, tokenIds, amounts, maxTotal, paymentToken, merkleProof = [], contractType, enabled = true }) {
	const { abi, version, isLoading: abiLoading } = useSalesContractABI({
		contractAddress: salesContractAddress,
		contractType,
		chainId,
		enabled
	});
	const { data: allowance, isLoading: allowanceLoading } = useReadContract({
		address: paymentToken,
		abi: ERC20_ABI,
		functionName: "allowance",
		args: [buyer, salesContractAddress],
		chainId,
		query: { enabled: enabled && !!buyer && paymentToken !== zeroAddress }
	});
	return useQuery({
		queryKey: ["primary-sale-steps", {
			chainId,
			salesContractAddress,
			tokenIds,
			amounts,
			buyer,
			maxTotal,
			paymentToken
		}],
		queryFn: async () => {
			if (!abi) throw new Error("Unable to determine sales contract ABI");
			const steps$2 = [];
			if (paymentToken !== zeroAddress && allowance !== void 0 && allowance < BigInt(maxTotal)) {
				const approvalCalldata = encodeFunctionData({
					abi: ERC20_ABI,
					functionName: "approve",
					args: [salesContractAddress, BigInt(maxTotal)]
				});
				steps$2.push({
					id: StepType.tokenApproval,
					data: approvalCalldata,
					to: paymentToken,
					value: "0x0",
					price: "0"
				});
			}
			const mintCalldata = encodeFunctionData({
				abi,
				functionName: "mint",
				args: formatMintArgs({
					recipient: recipient || buyer,
					tokenIds,
					amounts,
					paymentToken,
					maxTotal,
					merkleProof,
					version
				})
			});
			steps$2.push({
				id: StepType.buy,
				data: mintCalldata,
				to: salesContractAddress,
				value: paymentToken === zeroAddress ? `0x${BigInt(maxTotal).toString(16)}` : "0x0",
				price: maxTotal
			});
			return steps$2;
		},
		enabled: enabled && !!buyer && !!abi && !abiLoading && !allowanceLoading
	});
}
/**
* Format mint arguments based on contract version
*/
function formatMintArgs({ recipient, tokenIds, amounts, paymentToken, maxTotal, merkleProof, version }) {
	const tokenIdsBigInt = tokenIds.map((id) => BigInt(id));
	const amountsBigInt = amounts.map((amount) => BigInt(amount));
	if (version === SalesContractVersion.V1) return [
		recipient,
		tokenIdsBigInt,
		amountsBigInt,
		"0x",
		paymentToken,
		BigInt(maxTotal),
		merkleProof
	];
	return [
		recipient,
		tokenIdsBigInt,
		amountsBigInt,
		paymentToken,
		BigInt(maxTotal),
		"0x"
	];
}

//#endregion
//#region src/react/hooks/transactions/useTransactionType.ts
/**
* Hook to detect transaction type from modal props
* Returns TransactionType.PRIMARY_SALE for shop transactions,
* otherwise returns TransactionType.MARKET_BUY
*/
function useTransactionType$1(modalProps) {
	return useMemo(() => {
		if (modalProps.cardType === "shop") return TransactionType$1.PRIMARY_SALE;
		return TransactionType$1.MARKET_BUY;
	}, [modalProps.cardType]);
}

//#endregion
//#region src/react/hooks/transactions/useBuyTransaction.ts
/**
* Unified hook that handles both market and primary sale transactions
* Automatically selects the appropriate transaction type based on modal props
*/
function useBuyTransaction(modalProps) {
	const { address: buyer } = useAccount();
	const transactionType = useTransactionType$1(modalProps);
	const marketPlatformFee = useMarketPlatformFee({
		chainId: modalProps.chainId,
		collectionAddress: modalProps.collectionAddress
	});
	const marketQuery = useMarketTransactionSteps({
		chainId: modalProps.chainId,
		collectionAddress: modalProps.collectionAddress,
		buyer,
		marketplace: isMarketProps(modalProps) ? modalProps.marketplace : MarketplaceKind.sequence_marketplace_v2,
		orderId: isMarketProps(modalProps) ? modalProps.orderId : "",
		collectibleId: isMarketProps(modalProps) ? modalProps.collectibleId : "",
		quantity: "1",
		additionalFees: [marketPlatformFee],
		enabled: transactionType === TransactionType$1.MARKET_BUY && !!buyer
	});
	const primaryQuery = usePrimarySaleTransactionSteps({
		chainId: modalProps.chainId,
		buyer,
		salesContractAddress: isShopProps(modalProps) ? modalProps.salesContractAddress : zeroAddress,
		tokenIds: isShopProps(modalProps) ? modalProps.items.map((item) => item.tokenId || "0") : [],
		amounts: isShopProps(modalProps) ? modalProps.items.map((item) => Number(item.quantity) || 1) : [],
		maxTotal: isShopProps(modalProps) ? modalProps.salePrice.amount : "0",
		paymentToken: isShopProps(modalProps) ? modalProps.salePrice.currencyAddress : zeroAddress,
		contractType: ContractType.ERC1155,
		enabled: transactionType === TransactionType$1.PRIMARY_SALE && !!buyer
	});
	if (transactionType === TransactionType$1.MARKET_BUY) return {
		data: marketQuery.data,
		isLoading: marketQuery.isLoading,
		error: marketQuery.error,
		isError: marketQuery.isError,
		refetch: marketQuery.refetch
	};
	return {
		data: primaryQuery.data,
		isLoading: primaryQuery.isLoading,
		error: primaryQuery.error,
		isError: primaryQuery.isError,
		refetch: primaryQuery.refetch
	};
}

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
		queryKey: collectableKeys.offersCount,
		exact: false
	}, (oldData) => {
		if (!oldData) return 0;
		return Math.max(0, oldData.count - 1);
	});
	queryClient.setQueriesData({
		queryKey: collectableKeys.offers,
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
			queryKey: collectableKeys.highestOffers,
			exact: false,
			predicate: (query) => !query.meta?.persistent
		});
	}, 2 * SECOND);
	queryClient.setQueriesData({
		queryKey: collectableKeys.listingsCount,
		exact: false
	}, (oldData) => {
		if (!oldData) return 0;
		return Math.max(0, oldData.count - 1);
	});
	queryClient.setQueriesData({
		queryKey: collectableKeys.listings,
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
			queryKey: collectableKeys.lowestListings,
			exact: false
		});
	}, 2 * SECOND);
};
const invalidateQueriesOnCancel = ({ queryClient }) => {
	queryClient.invalidateQueries({
		queryKey: collectableKeys.offers,
		exact: false
	});
	queryClient.invalidateQueries({
		queryKey: collectableKeys.offersCount,
		exact: false
	});
	queryClient.invalidateQueries({
		queryKey: collectableKeys.listings,
		exact: false
	});
	queryClient.invalidateQueries({
		queryKey: collectableKeys.listingsCount,
		exact: false
	});
	queryClient.invalidateQueries({
		queryKey: collectableKeys.highestOffers,
		exact: false
	});
	queryClient.invalidateQueries({
		queryKey: collectableKeys.lowestListings,
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
			type === "info" && /* @__PURE__ */ jsx(InfoIcon_default, {
				size: "sm",
				color: "white"
			})
		]
	});
}

//#endregion
//#region src/react/ui/modals/_internal/components/consts.ts
const MODAL_WIDTH = "360px";
const MODAL_OVERLAY_PROPS = { style: { background: "hsla(0, 0%, 15%, 0.9)" } };
const MODAL_CONTENT_PROPS = { style: {
	width: MODAL_WIDTH,
	height: "auto"
} };

//#endregion
//#region src/react/ui/modals/_internal/components/switchChainErrorModal/store.ts
const initialContext$4 = {
	isOpen: false,
	chainIdToSwitchTo: void 0,
	isSwitching: false
};
const switchChainErrorModalStore = createStore({
	context: initialContext$4,
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
const useIsOpen$4 = () => useSelector(switchChainErrorModalStore, (state) => state.context.isOpen);
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
	const isOpen = useIsOpen$4();
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
	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: (data) => {
			if (params.onSuccess) params.onSuccess(data);
		},
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
	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: (data) => {
			if (params.onSuccess) params.onSuccess(data);
		},
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
	const { mutate, mutateAsync, ...result } = useMutation({
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
	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: (data) => {
			if (params.onSuccess) params.onSuccess(data);
		},
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
			throw new TransactionExecutionError(stepItem.id || "unknown", error);
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
//#region src/react/hooks/transactions/useTransactionExecution.ts
function useTransactionExecution() {
	const { processStep } = useProcessStep();
	const executeSteps = async (steps$2, chainId) => {
		const results = [];
		for (const step of steps$2) try {
			const result = await processStep(step, chainId);
			results.push(result);
			if (result.type === "transaction" && step.id === "tokenApproval") {}
		} catch (error) {
			throw new Error(`Failed to execute step ${step.id}: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
		return results;
	};
	return { executeSteps };
}

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
//#region src/react/hooks/ui/useFilterState.tsx
const validateFilters = (value) => {
	if (!Array.isArray(value)) return [];
	return value.filter((f) => typeof f === "object" && typeof f.name === "string" && Object.values(PropertyType).includes(f.type));
};
const validatePriceFilters = (value) => {
	if (!Array.isArray(value)) return [];
	return value.filter((f) => typeof f === "object" && typeof f.contractAddress === "string" && (f.min === void 0 || typeof f.min === "string") && (f.max === void 0 || typeof f.max === "string"));
};
const filtersParser = parseAsJson(validateFilters).withDefault([]);
const searchParser = parseAsString.withDefault("");
const listedOnlyParser = parseAsBoolean.withDefault(false);
const priceFilterParser = parseAsBoolean.withDefault(false);
const priceFiltersParser = parseAsJson(validatePriceFilters).withDefault([]);
const serialize = createSerializer({
	filters: filtersParser,
	search: searchParser,
	listedOnly: listedOnlyParser,
	priceFilter: priceFilterParser,
	priceFilters: priceFiltersParser
}, { urlKeys: {
	filters: "f",
	search: "q",
	listedOnly: "l",
	priceFilter: "p",
	priceFilters: "pf"
} });
function useFilterState() {
	const [filterOptions, setFilterOptions] = useQueryState("filters", filtersParser);
	const [searchText, setSearchText] = useQueryState("search", searchParser);
	const [showListedOnly, setShowListedOnly] = useQueryState("listedOnly", listedOnlyParser);
	const [showPriceFilter, setShowPriceFilter] = useQueryState("priceFilter", priceFilterParser);
	const [priceFilters, setPriceFilters] = useQueryState("priceFilters", priceFiltersParser);
	return {
		filterOptions,
		searchText,
		showListedOnly,
		showPriceFilter,
		priceFilters,
		setFilterOptions,
		setSearchText,
		setShowListedOnly,
		setShowPriceFilter,
		setPriceFilters,
		...useMemo(() => ({
			getFilter: (name) => {
				return filterOptions?.find((f) => f.name === name);
			},
			getFilterValues: (name) => {
				const filter = filterOptions?.find((f) => f.name === name);
				if (!filter) return void 0;
				if (filter.type === PropertyType.INT) return {
					type: PropertyType.INT,
					min: filter.min ?? 0,
					max: filter.max ?? 0
				};
				return {
					type: PropertyType.STRING,
					values: filter.values ?? []
				};
			},
			isFilterActive: (name) => {
				return !!filterOptions?.find((f) => f.name === name);
			},
			isStringValueSelected: (name, value) => {
				const filter = filterOptions?.find((f) => f.name === name);
				if (!filter || filter.type !== PropertyType.STRING) return false;
				return filter.values?.includes(value) ?? false;
			},
			isIntFilterActive: (name) => {
				const filter = filterOptions?.find((f) => f.name === name);
				return !!filter && filter.type === PropertyType.INT;
			},
			getIntFilterRange: (name) => {
				const filter = filterOptions?.find((f) => f.name === name);
				if (!filter || filter.type !== PropertyType.INT) return void 0;
				return [filter.min ?? 0, filter.max ?? 0];
			},
			deleteFilter: (name) => {
				setFilterOptions(filterOptions?.filter((f) => !(f.name === name)) ?? []);
			},
			toggleStringFilterValue: (name, value) => {
				const otherFilters = filterOptions?.filter((f) => !(f.name === name)) ?? [];
				const filter = filterOptions?.find((f) => f.name === name);
				const existingValues = filter?.type === PropertyType.STRING ? filter.values ?? [] : [];
				if (existingValues.includes(value)) {
					const newValues = existingValues.filter((v) => v !== value);
					if (newValues.length === 0) {
						setFilterOptions(otherFilters);
						return;
					}
					setFilterOptions([...otherFilters, {
						name,
						type: PropertyType.STRING,
						values: newValues
					}]);
				} else setFilterOptions([...otherFilters, {
					name,
					type: PropertyType.STRING,
					values: [...existingValues, value]
				}]);
			},
			setIntFilterValue: (name, min, max) => {
				if (min === max && min === 0) {
					setFilterOptions(filterOptions?.filter((f) => !(f.name === name)) ?? []);
					return;
				}
				setFilterOptions([...filterOptions?.filter((f) => !(f.name === name)) ?? [], {
					name,
					type: PropertyType.INT,
					min,
					max
				}]);
			},
			setPriceFilter: (contractAddress, min, max) => {
				const otherPriceFilters = priceFilters?.filter((f) => f.contractAddress !== contractAddress) ?? [];
				if (!min && !max) {
					setPriceFilters(otherPriceFilters);
					return;
				}
				const newPriceFilter = {
					contractAddress,
					...min && { min },
					...max && { max }
				};
				setPriceFilters([...otherPriceFilters, newPriceFilter]);
			},
			getPriceFilter: (contractAddress) => {
				return priceFilters?.find((f) => f.contractAddress === contractAddress);
			},
			clearPriceFilters: () => {
				setPriceFilters([]);
			},
			clearAllFilters: () => {
				setShowListedOnly(false);
				setShowPriceFilter(false);
				setFilterOptions([]);
				setSearchText("");
				setPriceFilters([]);
			}
		}), [
			filterOptions,
			setFilterOptions,
			setShowListedOnly,
			setSearchText,
			setShowPriceFilter,
			priceFilters,
			setPriceFilters
		]),
		serialize
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
	const { config = defaultConfig, ...rest } = params;
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
	const { config = defaultConfig, ...rest } = params;
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
//#region src/react/hooks/utils/useCheckoutOptionsSalesContract.tsx
/**
* Hook to fetch checkout options for sales contract items
*
* Retrieves checkout options including available payment methods, fees, and transaction details
* for items from a sales contract. Requires a connected wallet to calculate wallet-specific options.
*
* @param params - Configuration parameters or skipToken to skip the query
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.contractAddress - The sales contract address
* @param params.collectionAddress - The collection contract address
* @param params.items - Array of items to purchase with tokenId and quantity
* @param params.query - Optional React Query configuration
*
* @returns Query result containing checkout options with payment methods and fees
*
* @example
* Basic usage:
* ```typescript
* const { data: checkoutOptions, isLoading } = useCheckoutOptionsSalesContract({
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
* const { data: checkoutOptions } = useCheckoutOptionsSalesContract(
*   items.length > 0 ? {
*     chainId: 1,
*     contractAddress: contractAddress,
*     collectionAddress: collectionAddress,
*     items: items
*   } : skipToken
* )
* ```
*/
function useCheckoutOptionsSalesContract(params) {
	const { address } = useAccount();
	const defaultConfig = useConfig();
	return useQuery({ ...checkoutOptionsSalesContractQueryOptions(params === skipToken ? {
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
//#region src/react/hooks/utils/useComparePrices.tsx
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
* const { data: comparison, isLoading } = useComparePrices({
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
* const { data: comparison } = useComparePrices({
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
function useComparePrices(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...comparePricesQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/utils/useConvertPriceToUSD.tsx
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
* const { data: conversion, isLoading } = useConvertPriceToUSD({
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
* const { data: conversion } = useConvertPriceToUSD({
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
function useConvertPriceToUSD(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...convertPriceToUSDQueryOptions({
		config,
		...rest
	}) });
}

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
* Hook to fetch royalty information for a collectible
*
* Reads royalty information from the blockchain using the EIP-2981 standard.
* This hook queries the contract directly to get royalty percentage and recipient
* address for a specific token.
*
* @param args - Configuration parameters
* @param args.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param args.collectionAddress - The collection contract address
* @param args.collectibleId - The token ID within the collection
* @param args.query - Optional React Query configuration
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
	const contractResult = useReadContract({
		scopeKey: `${collectableKeys.royaltyPercentage.join(".")}-${chainId}-${collectionAddress}-${collectibleId}`,
		abi: EIP2981_ABI,
		address: collectionAddress,
		functionName: "royaltyInfo",
		args: [BigInt(collectibleId), BigInt(100)],
		chainId,
		query
	});
	const [recipient, percentage] = contractResult.data ?? [];
	const formattedData = recipient && percentage ? {
		percentage,
		recipient
	} : null;
	return {
		...contractResult,
		data: formattedData
	};
}

//#endregion
//#region src/react/ui/modals/_internal/components/selectWaasFeeOptions/store.ts
const selectWaasFeeOptionsStore = createStore({
	context: {
		id: void 0,
		selectedFeeOption: void 0,
		isVisible: false
	},
	on: {
		show: (context) => ({
			...context,
			isVisible: true
		}),
		hide: () => ({
			id: void 0,
			selectedFeeOption: void 0,
			isVisible: false
		}),
		setSelectedFeeOption: (context, event) => ({
			...context,
			selectedFeeOption: event.feeOption
		})
	}
});
const useSelectWaasFeeOptionsStore = () => {
	return {
		isVisible: useSelector(selectWaasFeeOptionsStore, (state) => state.context.isVisible),
		id: useSelector(selectWaasFeeOptionsStore, (state) => state.context.id),
		selectedFeeOption: useSelector(selectWaasFeeOptionsStore, (state) => state.context.selectedFeeOption),
		show: () => selectWaasFeeOptionsStore.send({ type: "show" }),
		hide: () => selectWaasFeeOptionsStore.send({ type: "hide" }),
		setSelectedFeeOption: (feeOption) => selectWaasFeeOptionsStore.send({
			type: "setSelectedFeeOption",
			feeOption
		})
	};
};

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
//#region src/react/ui/images/chess-tile.png
var chess_tile_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK8AAACuCAYAAABAzl3QAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAInSURBVHgB7dyxbUMxEAXBs6FEjagv91/AD+keeNFCMw1csmBEvJ/P53Nm4Xme2Xi/37Ph/nfeP+f8/Q5EiZcs8ZIlXrLES5Z4yRIvWeIlS7xkiZcs8ZIlXrLES5Z4yRIvWS//Ud2v3vfykiVessRLlnjJEi9Z4iVLvGSJlyzxkiVessRLlnjJEi9Z4iVLvGS9/Ed1v3j/nOPlpUu8ZImXLPGSJV6yxEuWeMkSL1niJUu8ZImXLPGSJV6yxEuWeMmyz+v+bNjnhQviJUu8ZImXLPGSJV6yxEuWeMkSL1niJUu8ZImXLPGSJV6yxEuWfV73Z8M+L1wQL1niJUu8ZImXLPGSJV6yxEuWeMkSL1niJUu8ZImXLPGSJV6y7PO6Pxv2eeGCeMkSL1niJUu8ZImXLPGSJV6yxEuWeMkSL1niJUu8ZImXLPGSZZ/X/dmwzwsXxEuWeMkSL1niJUu8ZImXLPGSJV6yxEuWeMkSL1niJUu8ZImXLPu87s+GfV64IF6yxEuWeMkSL1niJUu8ZImXLPGSJV6yxEuWeMkSL1niJUu8ZNnndX827PPCBfGSJV6yxEuWeMkSL1niJUu8ZImXLPGSJV6yxEuWeMkSL1niJcs+r/uzYZ8XLoiXLPGSJV6yxEuWeMkSL1niJUu8ZImXLPGSJV6yxEuWeMkSL1n2ed2fDfu8cEG8ZImXLPGSJV6yxEuWeMkSL1niJUu8ZImXLPGSJV6y/gF97MkwfJRH7QAAAABJRU5ErkJggg==";

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
const initialContext$3 = {
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
	context: initialContext$3,
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
		close: () => ({ ...initialContext$3 }),
		updateStatus: (context, event) => ({
			...context,
			status: event.status
		})
	}
});
const useIsOpen$3 = () => useSelector(transactionStatusModalStore, (state) => state.context.isOpen);
const useTransactionStatusModalState = () => useSelector(transactionStatusModalStore, (state) => state.context);
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
	const { data: collection, isLoading: collectionLoading } = useCollection({
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
			const { type: transactionType, ...rest } = args;
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
	return useIsOpen$3() ? /* @__PURE__ */ jsx(TransactionStatusModalContent, {}) : null;
};
function TransactionStatusModalContent() {
	const { transactionType: type, hash, orderId, price, collectionAddress, chainId, collectibleId, callbacks, queriesToInvalidate } = useTransactionStatusModalState();
	const { data: collectible, isLoading: collectibleLoading } = useCollectible({
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
//#region src/react/hooks/utils/waasFeeOptionsStore.ts
var Deferred = class {
	_resolve = () => {};
	_reject = () => {};
	_promise = new Promise((resolve, reject) => {
		this._reject = reject;
		this._resolve = resolve;
	});
	get promise() {
		return this._promise;
	}
	resolve(value) {
		this._resolve(value);
	}
	reject(value) {
		this._reject(value);
	}
};
const initialContext$2 = {
	pendingConfirmation: void 0,
	deferred: void 0
};
const waasFeeOptionsStore = createStore({
	context: initialContext$2,
	on: {
		setPendingConfirmation: (context, event) => ({
			...context,
			pendingConfirmation: event.confirmation
		}),
		setDeferred: (context, event) => ({
			...context,
			deferred: event.deferred
		}),
		confirmFeeOption: (context, event) => {
			if (context.deferred && context.pendingConfirmation?.id === event.id) {
				context.deferred.resolve({
					id: event.id,
					feeTokenAddress: event.feeTokenAddress,
					confirmed: true
				});
				return {
					...context,
					deferred: void 0,
					pendingConfirmation: void 0
				};
			}
			return context;
		},
		rejectFeeOption: (context, event) => {
			if (context.deferred && context.pendingConfirmation?.id === event.id) {
				context.deferred.resolve({
					id: event.id,
					feeTokenAddress: void 0,
					confirmed: false
				});
				return {
					...context,
					deferred: void 0,
					pendingConfirmation: void 0
				};
			}
			return context;
		},
		clear: () => initialContext$2
	}
});
const usePendingConfirmation = () => useSelector(waasFeeOptionsStore, (state) => state.context.pendingConfirmation);

//#endregion
//#region src/react/hooks/utils/useWaasFeeOptions.tsx
/**
* Hook for handling WaaS (Wallet as a Service) fee options for unsponsored transactions
*
* This hook provides functionality to:
* - Get available fee options for a transaction in Native Token and ERC20's
* - Provide user wallet balances for each fee option
* - Confirm or reject fee selections
*
* @param options - Configuration options for the hook {@link WaasFeeOptionsConfig}
* @returns Array containing the confirmation state and control functions {@link UseWaasFeeOptionsReturnType}
*
* @example
* ```tsx
*   // Use the hook with default balance checking, this will fetch the user's wallet balances for each fee option and provide them in the UseWaasFeeOptionsReturn
*   const [
*     pendingFeeOptionConfirmation,
*     confirmPendingFeeOption,
*     rejectPendingFeeOption
*   ] = useWaasFeeOptions();
*
*   // Or skip balance checking if needed
*   // const [pendingFeeOptionConfirmation, confirmPendingFeeOption, rejectPendingFeeOption] =
*   //   useWaasFeeOptions({ skipFeeBalanceCheck: true });
*
*   const [selectedFeeOptionTokenName, setSelectedFeeOptionTokenName] = useState<string>();
*   const [feeOptionAlert, setFeeOptionAlert] = useState<AlertProps>();
*
*   // Initialize with first option when fee options become available
*   useEffect(() => {
*     if (pendingFeeOptionConfirmation) {
*       console.log('Pending fee options: ', pendingFeeOptionConfirmation.options)
*     }
*   }, [pendingFeeOptionConfirmation]);
*
* ```
*/
function useWaasFeeOptions$1(chainId, config, options) {
	const { skipFeeBalanceCheck = false } = options || {};
	const connections = useConnections();
	const waasConnector = connections.find((c) => c.connector.id.includes("waas"))?.connector;
	const indexerClient = getIndexerClient(chainId, config);
	const pendingFeeOptionConfirmation = usePendingConfirmation();
	/**
	* Confirms the selected fee option
	* @param id - The fee confirmation ID
	* @param feeTokenAddress - The address of the token to use for fee payment (null for native token)
	*/
	function confirmPendingFeeOption(id, feeTokenAddress) {
		waasFeeOptionsStore.send({
			type: "confirmFeeOption",
			id,
			feeTokenAddress
		});
	}
	/**
	* Rejects the current fee option confirmation
	* @param id - The fee confirmation ID to reject
	*/
	function rejectPendingFeeOption(id) {
		waasFeeOptionsStore.send({
			type: "rejectFeeOption",
			id
		});
	}
	useEffect(() => {
		if (!waasConnector) return;
		const waasProvider = waasConnector.sequenceWaasProvider;
		if (!waasProvider) return;
		const originalHandler = waasProvider.feeConfirmationHandler;
		waasProvider.feeConfirmationHandler = { async confirmFeeOption(id, options$1, chainId$1) {
			const pending = new Deferred();
			waasFeeOptionsStore.send({
				type: "setDeferred",
				deferred: pending
			});
			waasFeeOptionsStore.send({
				type: "setPendingConfirmation",
				confirmation: void 0
			});
			const accountAddress = connections[0]?.accounts[0];
			if (!accountAddress) throw new Error("No account address available");
			if (!skipFeeBalanceCheck) {
				const confirmation = {
					id,
					options: await Promise.all(options$1.map(async (option) => {
						if (option.token.contractAddress) {
							const tokenBalances = await indexerClient.getTokenBalancesByContract({
								filter: {
									accountAddresses: [accountAddress],
									contractStatus: ContractVerificationStatus.ALL,
									contractAddresses: [option.token.contractAddress]
								},
								omitMetadata: true
							});
							const tokenBalance = tokenBalances.balances[0]?.balance;
							return {
								...option,
								balanceFormatted: option.token.decimals ? formatUnits(BigInt(tokenBalances.balances[0]?.balance ?? "0"), option.token.decimals) : tokenBalances.balances[0]?.balance ?? "0",
								balance: tokenBalances.balances[0]?.balance ?? "0",
								hasEnoughBalanceForFee: tokenBalance ? BigInt(option.value) <= BigInt(tokenBalance) : false
							};
						}
						const nativeBalance = await indexerClient.getNativeTokenBalance({ accountAddress });
						return {
							...option,
							balanceFormatted: formatUnits(BigInt(nativeBalance.balance.balance), 18),
							balance: nativeBalance.balance.balance,
							hasEnoughBalanceForFee: BigInt(option.value) <= BigInt(nativeBalance.balance.balance)
						};
					})),
					chainId: chainId$1
				};
				waasFeeOptionsStore.send({
					type: "setPendingConfirmation",
					confirmation
				});
			} else {
				const confirmation = {
					id,
					options: options$1,
					chainId: chainId$1
				};
				waasFeeOptionsStore.send({
					type: "setPendingConfirmation",
					confirmation
				});
			}
			return pending.promise;
		} };
		return () => {
			waasProvider.feeConfirmationHandler = originalHandler;
		};
	}, [waasConnector, indexerClient]);
	return {
		pendingFeeOptionConfirmation,
		confirmPendingFeeOption,
		rejectPendingFeeOption
	};
}

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
//#region src/react/hooks/data/orders/useOrders.tsx
/**
* Hook to fetch orders from the marketplace
*
* Retrieves orders based on the provided parameters from the marketplace.
*
* @param params - Configuration parameters
* @param params.chainId - Optional chain ID to filter orders
* @param params.contractAddress - Optional contract address to filter orders
* @param params.tokenId - Optional token ID to filter orders
* @param params.maker - Optional maker address to filter orders
* @param params.taker - Optional taker address to filter orders
* @param params.status - Optional status to filter orders
* @param params.side - Optional side to filter orders
* @param params.pagination - Optional pagination parameters
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the orders data
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useOrders({
*   chainId: '137',
*   contractAddress: '0x...'
* })
* ```
*
* @example
* With pagination:
* ```typescript
* const { data, isLoading } = useOrders({
*   chainId: '1',
*   pagination: {
*     limit: 20,
*     offset: 0
*   },
*   query: {
*     refetchInterval: 15000
*   }
* })
* ```
*/
function useOrders(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...ordersQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/ui/modals/BuyModal/hooks/useBuyModalData.ts
const useBuyModalData = () => {
	const buyModalProps = useBuyModalProps();
	const chainId = buyModalProps.chainId;
	const collectionAddress = buyModalProps.collectionAddress;
	const isMarket = isMarketProps(buyModalProps);
	const isShop = isShopProps(buyModalProps);
	const orderId = isMarket ? buyModalProps.orderId : void 0;
	const marketplace = isMarket ? buyModalProps.marketplace : void 0;
	const collectibleId = isMarket ? buyModalProps.collectibleId : buyModalProps.items?.[0]?.tokenId;
	const { address, isConnecting, isReconnecting } = useAccount();
	const walletIsLoading = isConnecting || isReconnecting;
	const { data: collectible, isLoading: collectableLoading, isError: collectableError } = useCollectible({
		chainId,
		collectionAddress,
		collectibleId
	});
	const { data: collection, isLoading: collectionLoading, isError: collectionError } = useCollection({
		chainId,
		collectionAddress
	});
	const { data: orders, isLoading: ordersLoading, isError: ordersError } = useOrders({
		chainId,
		input: [{
			contractAddress: collectionAddress,
			orderId,
			marketplace
		}],
		query: { enabled: !!orderId && !!marketplace }
	});
	const currencyAddress = isMarket ? orders?.orders[0]?.priceCurrencyAddress : buyModalProps.salePrice.currencyAddress;
	const { data: currency, isLoading: currencyLoading, isError: currencyError } = useCurrency({
		chainId,
		currencyAddress
	});
	const salePrice = isShop ? buyModalProps.salePrice : void 0;
	const marketPriceAmount = isMarket ? orders?.orders[0]?.priceAmount ?? "0" : void 0;
	return {
		collectible,
		currencyAddress,
		collectionAddress,
		currency,
		order: orders?.orders[0] ?? void 0,
		salePrice,
		marketPriceAmount,
		address,
		isMarket,
		isShop,
		collection,
		isLoading: collectableLoading || isMarket && ordersLoading || walletIsLoading || collectionLoading || currencyLoading,
		isError: collectableError || ordersError || currencyError || collectionError
	};
};

//#endregion
//#region src/react/ui/components/_internals/ErrorLogBox.tsx
const ErrorLogBox = ({ title, message, error, onDismiss }) => {
	const [showFullError, setShowFullError] = useState(false);
	const toggleFullError = () => {
		setShowFullError(!showFullError);
	};
	return /* @__PURE__ */ jsx("div", {
		className: "relative max-h-96 overflow-y-auto rounded-lg border border-red-900 bg-[#2b0000] p-3",
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
								className: "flex items-center gap-1 text-red-400 text-xs transition-colors hover:text-red-300",
								type: "button",
								children: [showFullError ? "Hide full error" : "Show full error", showFullError ? /* @__PURE__ */ jsx(ChevronUpIcon, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(ChevronDownIcon, { className: "h-3 w-3" })]
							}),
							showFullError && /* @__PURE__ */ jsx("div", { className: "mt-2 h-px bg-red-900" }),
							showFullError && /* @__PURE__ */ jsx("div", {
								className: "mt-2 overflow-auto rounded-md bg-red-950 p-2",
								children: /* @__PURE__ */ jsxs(Text, {
									className: "whitespace-pre-wrap break-words font-mono text-red-100 text-xs",
									children: [
										error.message,
										error.stack && /* @__PURE__ */ jsxs(Fragment, { children: ["\n\nStack trace:\n", error.stack] }),
										JSON.stringify(error, null, 2)
									]
								})
							})
						]
					})]
				}),
				onDismiss && /* @__PURE__ */ jsx("button", {
					onClick: onDismiss,
					className: "absolute right-4 flex-shrink-0 text-red-400 transition-colors hover:text-red-300",
					type: "button",
					"aria-label": "Dismiss error",
					children: /* @__PURE__ */ jsx(CloseIcon, { className: "h-3 w-3" })
				})
			]
		})
	});
};

//#endregion
//#region src/utils/fetchContentType.ts
/**
* Fetches the Content-Type header of a given URL and returns the primary type if it's supported.
* @param url The URL to send the request to.
* @returns A Promise that resolves with 'image', 'video', 'html', or null.
*/
function fetchContentType(url) {
	return new Promise((resolve, reject) => {
		if (typeof XMLHttpRequest === "undefined") {
			reject(/* @__PURE__ */ new Error("XMLHttpRequest is not supported in this environment."));
			return;
		}
		if (!url) return;
		const client = new XMLHttpRequest();
		let settled = false;
		const settle = (value) => {
			if (!settled) {
				settled = true;
				resolve(value);
				client.abort();
			}
		};
		const fail = (error) => {
			if (!settled) {
				settled = true;
				reject(error);
			}
		};
		client.open("HEAD", url, true);
		client.onreadystatechange = () => {
			if (settled || client.readyState < XMLHttpRequest.HEADERS_RECEIVED) return;
			if (client.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
				const status = client.status;
				if (status < 200 || status >= 300) {
					settle(null);
					return;
				}
				const contentType = client.getResponseHeader("Content-Type");
				if (!contentType) {
					settle(null);
					return;
				}
				const primaryType = contentType.split("/")[0].toLowerCase();
				let result = null;
				switch (primaryType) {
					case "image":
						result = "image";
						break;
					case "video":
						result = "video";
						break;
					case "text":
						if (contentType.toLowerCase().includes("html")) result = "html";
						break;
					case "model":
						result = "3d-model";
						break;
				}
				settle(result);
				return;
			}
		};
		client.onerror = (errorEvent) => {
			fail(new Error(`XMLHttpRequest network error for URL: ${url}`, { cause: errorEvent }));
		};
		client.onabort = () => {
			if (!settled) settle(null);
		};
		try {
			client.send();
		} catch (error) {
			fail(new Error(`Error sending XMLHttpRequest for URL: ${url}`, { cause: error }));
		}
	});
}

//#endregion
//#region src/react/ui/components/ModelViewer.tsx
const ModelViewerComponent = lazy(() => import("@google/model-viewer").then(() => ({ default: ({ posterSrc, src, onLoad, onError }) => /* @__PURE__ */ jsx("div", {
	className: "h-full w-full bg-background-raised",
	children: /* @__PURE__ */ jsx("model-viewer", {
		alt: "3d model",
		"auto-rotate": true,
		autoplay: true,
		"camera-controls": true,
		class: "h-full w-full",
		error: onError,
		load: onLoad,
		loading: "eager",
		poster: posterSrc,
		reveal: "auto",
		"shadow-intensity": "1",
		src,
		"touch-action": "pan-y"
	})
}) })));
const ModelViewerLoading = () => /* @__PURE__ */ jsx(Skeleton, { className: "h-full w-full" });
const ModelViewer = (props) => {
	return /* @__PURE__ */ jsx(Suspense, {
		fallback: /* @__PURE__ */ jsx(ModelViewerLoading, {}),
		children: /* @__PURE__ */ jsx(ModelViewerComponent, { ...props })
	});
};
var ModelViewer_default = ModelViewer;

//#endregion
//#region src/react/ui/components/media/MediaSkeleton.tsx
function MediaSkeleton() {
	return /* @__PURE__ */ jsx(Skeleton, {
		"data-testid": "media",
		size: "lg",
		className: "absolute inset-0 h-full w-full animate-shimmer",
		style: { borderRadius: 0 }
	});
}

//#endregion
//#region src/react/ui/components/media/utils.ts
const isImage = (fileName) => {
	return /.*\.(png|jpg|jpeg|gif|svg|webp)$/.test(fileName?.toLowerCase() || "");
};
const isHtml = (fileName) => {
	return /.*\.(html\?.+|html)$/.test(fileName?.toLowerCase() || "");
};
const isVideo = (fileName) => {
	return /.*\.(mp4|ogg|webm)$/.test(fileName?.toLowerCase() || "");
};
const is3dModel = (fileName) => {
	return /.*\.(gltf|glb|obj|fbx|stl|usdz)$/.test(fileName?.toLowerCase() || "");
};
const getContentType = (url) => {
	return new Promise((resolve, reject) => {
		const type = isHtml(url) ? "html" : isVideo(url) ? "video" : isImage(url) ? "image" : is3dModel(url) ? "3d-model" : null;
		if (type) resolve(type);
		else reject(/* @__PURE__ */ new Error("Unsupported file type"));
	});
};

//#endregion
//#region src/react/ui/components/media/Media.tsx
/**
* @description This component is used to display a collectible asset.
* It will display the first valid asset from the assets array.
* If no valid asset is found, it will display the fallback content or the default placeholder image.
*
* @example
* <Media
*  name="Collectible"
*  assets={[undefined, "some-image-url", undefined]} // undefined assets will be ignored, "some-image-url" will be rendered
*  assetSrcPrefixUrl="https://example.com/"
*  className="w-full h-full"
*  fallbackContent={<YourCustomFallbackComponent />} // Optional custom fallback content
* />
*/
function Media({ name, assets, assetSrcPrefixUrl, className = "", containerClassName = "", mediaClassname = "", isLoading, fallbackContent, shouldListenForLoad = true }) {
	const [assetLoadFailed, setAssetLoadFailed] = useState(false);
	const [assetLoading, setAssetLoading] = useState(shouldListenForLoad);
	const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
	const [isSafari, setIsSafari] = useState(false);
	const [contentType, setContentType] = useState({
		type: null,
		loading: true,
		failed: false
	});
	const videoRef = useRef(null);
	useEffect(() => {
		setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
	}, []);
	const assetUrl = assets.filter((asset) => !!asset)[currentAssetIndex];
	const proxiedAssetUrl = assetUrl ? assetSrcPrefixUrl ? `${assetSrcPrefixUrl}${assetUrl}` : assetUrl : "";
	const containerClassNames = cn$1("relative aspect-square overflow-hidden bg-background-secondary", containerClassName || className);
	useEffect(() => {
		if (!assetUrl) {
			setContentType({
				type: null,
				loading: false,
				failed: true
			});
			return;
		}
		const determineContentType = async () => {
			try {
				setContentType({
					type: await getContentType(proxiedAssetUrl),
					loading: false,
					failed: false
				});
			} catch {
				try {
					setContentType({
						type: await fetchContentType(proxiedAssetUrl),
						loading: false,
						failed: false
					});
				} catch {
					handleAssetError();
					setContentType({
						type: null,
						loading: false,
						failed: true
					});
				}
			}
		};
		determineContentType();
	}, [proxiedAssetUrl, assetUrl]);
	const handleAssetError = () => {
		const nextIndex = currentAssetIndex + 1;
		if (nextIndex < assets.length) {
			setCurrentAssetIndex(nextIndex);
			setAssetLoading(true);
			setAssetLoadFailed(false);
		} else setAssetLoadFailed(true);
	};
	const handleAssetLoad = () => {
		setAssetLoading(false);
	};
	const renderFallback = () => {
		if (fallbackContent) return /* @__PURE__ */ jsx("div", {
			className: cn$1("flex h-full w-full items-center justify-center", containerClassNames),
			children: fallbackContent
		});
		return /* @__PURE__ */ jsx("div", {
			className: cn$1("h-full w-full", containerClassNames),
			children: /* @__PURE__ */ jsx("img", {
				src: chess_tile_default,
				alt: name || "Collectible",
				className: "h-full w-full object-cover",
				onError: (e) => {
					console.error("Failed to load placeholder image");
					e.currentTarget.style.display = "none";
				}
			})
		});
	};
	if (assetLoadFailed || !isLoading && contentType.failed || !assetUrl) return renderFallback();
	if (contentType.type === "html" && !assetLoadFailed) return /* @__PURE__ */ jsxs("div", {
		className: cn$1("flex w-full items-center justify-center rounded-lg", containerClassNames),
		children: [(assetLoading || contentType.loading || isLoading) && /* @__PURE__ */ jsx(MediaSkeleton, {}), /* @__PURE__ */ jsx("iframe", {
			title: name || "Collectible",
			className: cn$1("aspect-square w-full", mediaClassname),
			src: proxiedAssetUrl,
			allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
			sandbox: "allow-scripts",
			style: { border: "0px" },
			onError: shouldListenForLoad ? handleAssetError : void 0,
			onLoad: shouldListenForLoad ? handleAssetLoad : void 0
		})]
	});
	if (contentType.type === "3d-model" && !assetLoadFailed) return /* @__PURE__ */ jsx("div", {
		className: cn$1("h-full w-full", containerClassNames),
		children: /* @__PURE__ */ jsx(ModelViewer_default, {
			src: proxiedAssetUrl,
			posterSrc: chess_tile_default,
			onLoad: shouldListenForLoad ? handleAssetLoad : void 0,
			onError: shouldListenForLoad ? handleAssetError : void 0
		})
	});
	if (contentType.type === "video" && !assetLoadFailed) {
		const videoClassNames = cn$1("absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-hover", assetLoading || isLoading ? "invisible" : "visible", isSafari && "pointer-events-none", mediaClassname);
		return /* @__PURE__ */ jsxs("div", {
			className: containerClassNames,
			children: [(assetLoading || contentType.loading || isLoading) && /* @__PURE__ */ jsx(MediaSkeleton, {}), /* @__PURE__ */ jsx("video", {
				ref: videoRef,
				className: videoClassNames,
				autoPlay: true,
				loop: true,
				controls: true,
				playsInline: true,
				muted: true,
				controlsList: "nodownload noremoteplayback nofullscreen",
				onError: shouldListenForLoad ? handleAssetError : void 0,
				onLoadedMetadata: shouldListenForLoad ? handleAssetLoad : void 0,
				"data-testid": "collectible-asset-video",
				children: /* @__PURE__ */ jsx("source", { src: proxiedAssetUrl })
			})]
		});
	}
	const imgSrc = assetLoadFailed || contentType.failed ? chess_tile_default : proxiedAssetUrl;
	const imgClassNames = cn$1("absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-hover", assetLoading || contentType.loading || isLoading ? "invisible" : "visible", mediaClassname);
	return /* @__PURE__ */ jsxs("div", {
		className: containerClassNames,
		children: [(assetLoading || contentType.loading || isLoading) && /* @__PURE__ */ jsx(MediaSkeleton, {}), /* @__PURE__ */ jsx("img", {
			src: imgSrc,
			alt: name || "Collectible",
			className: imgClassNames,
			onError: shouldListenForLoad ? handleAssetError : void 0,
			onLoad: shouldListenForLoad ? handleAssetLoad : void 0
		})]
	});
}

//#endregion
//#region src/react/ui/modals/BuyModal/hooks/useHasSufficientBalance.ts
const useHasSufficientBalance = ({ chainId, value, tokenAddress }) => {
	const { address } = useAccount();
	const publicClient = usePublicClient({ chainId });
	const nativeToken = tokenAddress === zeroAddress;
	return useQuery({
		queryKey: [
			"sufficientBalance",
			address,
			chainId,
			tokenAddress,
			value
		],
		queryFn: async () => {
			if (!address || !publicClient) return;
			const balance = nativeToken ? await publicClient.getBalance({ address }) : await publicClient.readContract({
				address: tokenAddress,
				abi: erc20Abi,
				functionName: "balanceOf",
				args: [address]
			});
			return {
				hasSufficientBalance: balance >= value || value === 0n,
				balance
			};
		},
		enabled: !!address && !!publicClient && !!tokenAddress && (!!value || value === 0n)
	});
};

//#endregion
//#region src/react/ui/modals/BuyModal/components/FallbackPurchaseUISkeleton.tsx
const FallbackPurchaseUISkeleton = ({ networkMismatch }) => {
	return /* @__PURE__ */ jsx("div", {
		className: "flex w-full flex-col",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col gap-4 p-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-4",
					children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-[84px] w-[84px] rounded-lg" }), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-1 flex-col",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-32" }), /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-12" })]
							}),
							/* @__PURE__ */ jsx(Skeleton, { className: "mt-1 h-3 w-24" }),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-2 flex flex-col",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-4 rounded-full" }), /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-28" })]
								}), /* @__PURE__ */ jsx(Skeleton, { className: "mt-1 h-3 w-16" })]
							})
						]
					})]
				}),
				networkMismatch && /* @__PURE__ */ jsx(Skeleton, { className: "h-[98px] w-full rounded-lg" }),
				networkMismatch && /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full rounded-full" }),
				/* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full rounded-full" })
			]
		})
	});
};

//#endregion
//#region src/react/ui/modals/BuyModal/components/hook/useExecuteBundledTransactions.ts
var FeeOptionInsufficientFundsError = class extends Error {
	feeOptions;
	constructor(message, feeOptions) {
		super(message);
		this.name = "FeeOptionInsufficientFundsError";
		this.feeOptions = feeOptions;
	}
};
const useExecuteBundledTransactions = ({ chainId, approvalStep, priceAmount }) => {
	const config = useConfig();
	const [isExecuting, setIsExecuting] = useState(false);
	const { address, connector } = useAccount();
	const publicClient = usePublicClient();
	const { data: walletClient } = useWalletClient({ chainId });
	const indexerClient = getIndexerClient(chainId, config);
	const { collection, currency } = useBuyModalData();
	const executeBundledTransactions = async ({ step, onBalanceInsufficientForFeeOption, onTransactionFailed }) => {
		setIsExecuting(true);
		if (!address) throw new Error("Address not found");
		if (!publicClient) throw new Error("Public client not found");
		if (!walletClient) throw new Error("Wallet client not found");
		if (!indexerClient) throw new Error("Indexer client not found");
		if (!connector) throw new Error("Connector not found");
		if (!collection?.address) throw new Error("Collection address not found");
		if (!priceAmount) throw new Error("Price amount not found");
		const approvalData = approvalStep ? {
			to: approvalStep.to,
			data: approvalStep.data,
			chainId
		} : void 0;
		const transactionData = {
			to: step.to,
			data: step.data,
			chainId,
			...currency?.nativeCurrency ? { value: BigInt(priceAmount) } : {}
		};
		const txHash = await sendTransactions({
			chainId,
			senderAddress: address,
			publicClient,
			walletClient,
			indexerClient,
			connector,
			transactions: [...approvalData ? [approvalData] : [], transactionData],
			transactionConfirmations: 1,
			waitConfirmationForLastTransaction: false
		}).catch((error) => {
			setIsExecuting(false);
			if (error instanceof FeeOptionInsufficientFundsError) {
				if (onBalanceInsufficientForFeeOption) onBalanceInsufficientForFeeOption(error);
				throw error;
			}
			if (onTransactionFailed) onTransactionFailed(error);
			throw error;
		});
		setIsExecuting(false);
		return txHash;
	};
	return {
		executeBundledTransactions,
		isExecuting
	};
};

//#endregion
//#region src/react/ui/modals/BuyModal/components/FallbackPurchaseUI.tsx
const FallbackPurchaseUI = ({ chainId, steps: steps$2, onSuccess }) => {
	const [isExecuting, setIsExecuting] = useState(false);
	const [isApproving, setIsApproving] = useState(false);
	const [isSwitchingChain, setIsSwitchingChain] = useState(false);
	const [error, setError] = useState(null);
	const { isSequence: isSequenceConnector } = useConnectorMetadata();
	const buyStep = steps$2.find((step) => step.id === StepType.buy);
	if (!buyStep) throw new Error("Buy step not found");
	const { collectible, currencyAddress, currency, order, salePrice, isMarket, isShop, collection, isLoading: isLoadingBuyModalData } = useBuyModalData();
	const sdkConfig = useConfig();
	const { ensureCorrectChainAsync, currentChainId } = useEnsureCorrectChain();
	const isOnCorrectChain = currentChainId === chainId;
	const requiredChainName = getPresentableChainName(chainId);
	const currentChainName = currentChainId ? getPresentableChainName(currentChainId) : "Unknown";
	const priceAmount = isMarket ? order?.priceAmount : salePrice?.amount;
	const priceCurrencyAddress = isMarket ? currencyAddress : salePrice?.currencyAddress;
	const isAnyTransactionPending = isApproving || isExecuting || isSwitchingChain;
	const { data, isLoading: isLoadingBalance } = useHasSufficientBalance({
		chainId,
		value: BigInt(priceAmount || 0),
		tokenAddress: priceCurrencyAddress
	});
	const hasSufficientBalance = data?.hasSufficientBalance;
	const { sendTransactionAsync } = useSendTransaction();
	const [approvalStep, setApprovalStep] = useState(steps$2.find((step) => step.id === StepType.tokenApproval));
	const { executeBundledTransactions, isExecuting: isExecutingBundledTransactions } = useExecuteBundledTransactions({
		chainId,
		approvalStep,
		priceAmount
	});
	const executeTransaction = async (step) => {
		const data$1 = step.data;
		const to = step.to;
		const value = BigInt(step.value);
		if (!data$1 || !to) {
			const errorDetails = /* @__PURE__ */ new Error(`Invalid step: 'data' and 'to' are required:
				data: ${data$1}
				to: ${to}

				${JSON.stringify(step)}`);
			setError({
				title: "Invalid step",
				message: "`data` and `to` are required",
				details: errorDetails
			});
			throw errorDetails;
		}
		await ensureCorrectChainAsync(chainId);
		const hash = await sendTransactionAsync({
			to,
			data: data$1,
			value
		});
		await waitForTransactionReceipt({
			txHash: hash,
			chainId,
			sdkConfig
		});
		return hash;
	};
	const executeApproval = async () => {
		if (!approvalStep) throw new Error("Approval step not found");
		setError(null);
		setIsApproving(true);
		try {
			await executeTransaction(approvalStep);
			setApprovalStep(void 0);
		} catch (error$1) {
			console.error("Approval transaction failed:", error$1);
		} finally {
			setIsApproving(false);
		}
	};
	const executeBuy = async () => {
		setError(null);
		setIsExecuting(true);
		try {
			onSuccess(isShop && approvalStep ? await executeBundledTransactions({
				step: buyStep,
				onBalanceInsufficientForFeeOption: handleBalanceInsufficientForWaasFeeOption,
				onTransactionFailed: handleTransactionFailed
			}) : await executeTransaction(buyStep));
		} catch (error$1) {
			console.error("Buy transaction failed:", error$1);
		} finally {
			setIsExecuting(false);
		}
	};
	const handleSwitchChain = async () => {
		setIsSwitchingChain(true);
		try {
			await ensureCorrectChainAsync(chainId);
		} catch (error$1) {
			console.error("Chain switch failed:", error$1);
		} finally {
			setIsSwitchingChain(false);
		}
	};
	const handleBalanceInsufficientForWaasFeeOption = (error$1) => {
		setError({
			title: "Insufficient balance for fee option",
			message: "You do not have enough balance to purchase this item.",
			details: error$1
		});
		console.error("Balance insufficient for fee option:", error$1);
	};
	const handleTransactionFailed = (error$1) => {
		setError({
			title: "Transaction failed",
			message: error$1.message,
			details: error$1
		});
		console.error("Transaction failed:", error$1);
	};
	const renderPriceUSD = () => {
		const priceUSD = order?.priceUSDFormatted || order?.priceUSD;
		if (!priceUSD) return "";
		if ((typeof priceUSD === "string" ? Number.parseFloat(priceUSD) : priceUSD) < 1e-4) return /* @__PURE__ */ jsxs("div", {
			className: "flex items-center",
			children: [
				/* @__PURE__ */ jsx(ChevronLeftIcon, { className: "w-3" }),
				" ",
				/* @__PURE__ */ jsx(Text, { children: "$0.0001" })
			]
		});
		return `~$${priceUSD}`;
	};
	const formattedPrice = formatPrice(BigInt(priceAmount || 0), currency?.decimals || 0);
	const isFree = formattedPrice === "0";
	const renderCurrencyPrice = () => {
		if (isFree) return "Free";
		if (Number.parseFloat(formattedPrice) < 1e-4) return /* @__PURE__ */ jsxs("div", {
			className: "flex items-center",
			children: [/* @__PURE__ */ jsx(ChevronLeftIcon, { className: "w-4" }), /* @__PURE__ */ jsxs(Text, { children: ["0.0001 ", currency?.symbol] })]
		});
		return `${formattedPrice} ${currency?.symbol}`;
	};
	const canApprove = hasSufficientBalance && !isLoadingBalance && !isLoadingBuyModalData && isOnCorrectChain;
	const canBuy = hasSufficientBalance && !isLoadingBalance && !isLoadingBuyModalData && isOnCorrectChain && (isSequenceConnector ? true : !approvalStep);
	const approvalButtonLabel = isApproving ? /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ jsx(Spinner, { size: "sm" }), " Approving Token..."]
	}) : "Approve Token";
	const buyButtonLabel = isExecuting || isExecutingBundledTransactions ? /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ jsx(Spinner, { size: "sm" }), " Confirming Purchase..."]
	}) : "Buy now";
	if (isLoadingBuyModalData || isLoadingBalance) return /* @__PURE__ */ jsx(FallbackPurchaseUISkeleton, { networkMismatch: !isOnCorrectChain && currentChainId !== void 0 });
	return /* @__PURE__ */ jsx("div", {
		className: "flex w-full flex-col",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col gap-4 p-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-4",
					children: [/* @__PURE__ */ jsx(Media, {
						assets: [collectible?.image],
						name: collectible?.name,
						containerClassName: "h-[84px] w-[84px] rounded-lg object-cover"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Text, {
									className: "font-bold text-sm text-text-80",
									children: collectible?.name
								}), /* @__PURE__ */ jsxs(Text, {
									className: "font-bold text-text-50 text-xs",
									children: ["#", collectible?.tokenId]
								})]
							}),
							/* @__PURE__ */ jsxs(Text, {
								className: "font-bold text-text-50 text-xs",
								children: [" ", collection?.name]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-2 flex flex-col",
								children: [/* @__PURE__ */ jsx(Tooltip, {
									message: `${formattedPrice} ${currency?.symbol}`,
									side: "right",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1",
										children: [currency?.imageUrl ? /* @__PURE__ */ jsx("img", {
											src: currency.imageUrl,
											alt: currency.symbol,
											className: "h-5 w-5 rounded-full"
										}) : /* @__PURE__ */ jsx(NetworkImage, {
											chainId,
											size: "sm"
										}), /* @__PURE__ */ jsx(Text, {
											className: "font-bold text-md",
											children: renderCurrencyPrice()
										})]
									})
								}), isMarket && /* @__PURE__ */ jsx(Text, {
									className: "font-bold text-text-50 text-xs",
									children: renderPriceUSD()
								})]
							})
						]
					})]
				}),
				!isLoadingBalance && !isLoadingBuyModalData && !hasSufficientBalance && isOnCorrectChain && /* @__PURE__ */ jsxs(Text, {
					className: "text-sm text-warning",
					children: [
						"You do not have enough",
						" ",
						/* @__PURE__ */ jsx(Text, {
							className: "font-bold",
							children: currency?.name
						}),
						" to purchase this item"
					]
				}),
				!isOnCorrectChain && currentChainId && /* @__PURE__ */ jsx("div", {
					className: "rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3",
					children: /* @__PURE__ */ jsxs(Text, {
						className: "text-amber-300 text-xs",
						children: [
							"Wrong network detected. You're currently on",
							" ",
							/* @__PURE__ */ jsx(Text, {
								className: "font-bold",
								children: currentChainName
							}),
							", but this transaction requires",
							" ",
							/* @__PURE__ */ jsx(Text, {
								className: "font-bold",
								children: requiredChainName
							}),
							"."
						]
					})
				}),
				!isOnCorrectChain && /* @__PURE__ */ jsx(Button, {
					onClick: handleSwitchChain,
					pending: isSwitchingChain,
					disabled: isAnyTransactionPending,
					variant: "primary",
					size: "lg",
					label: isSwitchingChain ? "Switching Network..." : `Switch to ${requiredChainName}`,
					className: "w-full"
				}),
				approvalStep && !isSequenceConnector && /* @__PURE__ */ jsx(Button, {
					onClick: executeApproval,
					pending: isApproving,
					disabled: !canApprove || isAnyTransactionPending,
					variant: "primary",
					size: "lg",
					label: approvalButtonLabel,
					className: "w-full"
				}),
				canBuy && /* @__PURE__ */ jsx(Button, {
					onClick: () => {
						setError(null);
						return executeBuy();
					},
					pending: isExecuting || isExecutingBundledTransactions,
					disabled: !canBuy || isAnyTransactionPending,
					variant: "primary",
					size: "lg",
					label: buyButtonLabel,
					className: "w-full"
				}),
				error && /* @__PURE__ */ jsx(ErrorLogBox, {
					title: error.title,
					message: error.message,
					error: error.details,
					onDismiss: () => setError(null)
				})
			]
		})
	});
};

//#endregion
//#region src/react/ui/modals/BuyModal/components/TrailsCss.ts
const TRAILS_CUSTOM_CSS = `
:host,
*,
[data-theme="dark"],
[data-theme=dark] {
  --trails-bg-primary: #000 !important;
  --trails-bg-secondary: #181818 !important;
  --trails-bg-tertiary: #ffffff0d !important;
  --trails-bg-card: #363636b3 !important;
  --trails-bg-overlay: #000000b3 !important;
  
  --trails-text-primary: #fff !important;
  --trails-text-secondary: #fffc !important;
  --trails-text-tertiary: #ffffff80 !important;
  --trails-text-muted: #ffffff80 !important;
  --trails-text-inverse: #000 !important;
  
  --trails-border-primary: #ffffff40 !important;
  --trails-border-secondary: #ffffff80 !important;
  --trails-border-tertiary: #ffffff1a !important;
  
  --trails-hover-bg: #ffffff40 !important;
  --trails-hover-text: #fff !important;
  
  --trails-input-bg: #ffffff1a !important;
  --trails-input-border: #ffffff40 !important;
  --trails-input-text: #fff !important;
  --trails-input-placeholder: #ffffff80 !important;
  --trails-input-focus-border: #ffffff80 !important;
  
  --trails-dropdown-bg: #363636b3 !important;
  --trails-dropdown-border: #ffffff40 !important;
  --trails-dropdown-text: #fff !important;
  --trails-dropdown-hover-bg: #ffffff40 !important;
  --trails-dropdown-selected-bg: #ffffff26 !important;
  --trails-dropdown-selected-text: #fff !important;
  --trails-dropdown-focus-border: #ffffff80 !important;
  
  --trails-modal-button-bg: #ffffff26 !important;
  --trails-modal-button-hover-bg: #ffffff40 !important;
  --trails-modal-button-text: #fff !important;
  --trails-modal-button-shadow: 0 1px 2px 0 #0000001a !important;
  
  --trails-list-bg: #ffffff1a !important;
  --trails-list-border: #ffffff40 !important;
  --trails-list-hover-bg: #ffffff40 !important;
  
  --trails-widget-border: none !important;
  --trails-border-radius-widget: 32px !important;
  --trails-border-radius-button: 32px !important;
  --trails-border-radius-input: 32px !important;
  --trails-border-radius-dropdown: 32px !important;
  --trails-border-radius-container: 8px !important;
  --trails-border-radius-list: 8px !important;
  --trails-border-radius-list-button: 12px !important;
  --trails-border-radius-large-button: 16px !important;
  
  --trails-success-bg: #1fc26633 !important;
  --trails-success-text: #1fc266 !important;
  --trails-success-border: #1fc2664d !important;
  
  --trails-warning-bg: #f4b03e33 !important;
  --trails-warning-text: #f4b03e !important;
  --trails-warning-border: #f4b03e4d !important;
  
  --trails-error-bg: #c2501f33 !important;
  --trails-error-text: #c2501f !important;
  --trails-error-border: #c2501f4d !important;
  
  --trails-shadow: 0 1px 3px 0 #0000004d, 0 1px 2px -1px #0000004d !important;
  
  --trails-gradient-primary: linear-gradient(89.69deg, #4411e1 .27%, #7537f9 99.73%) !important;
  --trails-gradient-secondary: linear-gradient(32.51deg, #951990 -15.23%, #3a35b1 48.55%, #20a8b0 100%) !important;
  --trails-gradient-backdrop: linear-gradient(243.18deg, #5634bdd9 0%, #3129dfd9 63.54%, #076295d9 100%) !important;
}`;

//#endregion
//#region src/react/ui/modals/BuyModal/components/BuyModalContent.tsx
const BuyModalContent = () => {
	const config = useConfig();
	const modalProps = useBuyModalProps();
	const { close } = useBuyModal();
	const onSuccess = useOnSuccess();
	const transactionStatusModal = useTransactionStatusModal();
	const { supportedChains, isLoadingChains } = useSupportedChains();
	const { data: steps$2, isLoading: isLoadingSteps } = useBuyTransaction(modalProps);
	const { collectible, currencyAddress, currency, order, collectionAddress, salePrice, marketPriceAmount, isLoading: isBuyModalDataLoading, isMarket } = useBuyModalData();
	const { pendingFeeOptionConfirmation, rejectPendingFeeOption } = useWaasFeeOptions$1(modalProps.chainId, config);
	const isChainSupported = supportedChains.some((chain) => chain.id === modalProps.chainId);
	const isLoading = isLoadingSteps || isLoadingChains || isBuyModalDataLoading;
	const buyStep = steps$2?.find((step) => step.id === "buy");
	const useTrailsModal = isChainSupported && buyStep && !isLoading;
	const useFallbackPurchaseUI = !useTrailsModal && steps$2 && !isLoading;
	const formattedAmount = currency?.decimals ? formatUnits(BigInt(buyStep?.price || "0"), currency.decimals) : "0";
	const handleTransactionSuccess = (hash) => {
		if (!collectible) throw new Error("Collectible not found");
		if (isMarket && !order) throw new Error("Order not found");
		if (!currency) throw new Error("Currency not found");
		close();
		onSuccess({ hash });
		transactionStatusModal.show({
			hash,
			orderId: isMarket ? order?.orderId : void 0,
			price: {
				amountRaw: (isMarket ? marketPriceAmount : salePrice?.amount) ?? "0",
				currency
			},
			collectionAddress,
			chainId: modalProps.chainId,
			collectibleId: collectible.tokenId,
			type: TransactionType.BUY
		});
	};
	const handleTrailsSuccess = (data) => {
		handleTransactionSuccess(data.txHash);
	};
	const handleClose = () => {
		if (pendingFeeOptionConfirmation?.id) {
			console.log("rejecting pending fee option", pendingFeeOptionConfirmation?.id);
			rejectPendingFeeOption(pendingFeeOptionConfirmation?.id);
		}
		close();
	};
	return /* @__PURE__ */ jsx(Modal, {
		isDismissible: true,
		onClose: handleClose,
		overlayProps: MODAL_OVERLAY_PROPS,
		contentProps: {
			style: {
				width: "450px",
				height: "auto"
			},
			className: "overflow-y-auto"
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative flex grow flex-col items-center gap-4 p-6",
			children: [
				/* @__PURE__ */ jsx(Text, {
					className: "w-full text-center font-body font-bold text-large text-text-100",
					children: "Complete Your Purchase"
				}),
				isLoading && /* @__PURE__ */ jsx("div", {
					className: "flex w-full items-center justify-center py-8",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col items-center gap-4",
						children: [/* @__PURE__ */ jsx(Spinner, { size: "lg" }), /* @__PURE__ */ jsx(Text, {
							className: "text-text-80",
							children: "Loading payment options..."
						})]
					})
				}),
				useTrailsModal && /* @__PURE__ */ jsx("div", {
					className: "w-full",
					children: /* @__PURE__ */ jsx(TrailsWidget, {
						apiKey: config.projectAccessKey,
						toChainId: modalProps.chainId,
						toAddress: buyStep.to,
						toToken: currencyAddress,
						toCalldata: buyStep.data,
						toAmount: formattedAmount,
						renderInline: true,
						theme: "dark",
						mode: "pay",
						customCss: TRAILS_CUSTOM_CSS,
						onDestinationConfirmation: handleTrailsSuccess,
						payMessage: "{TO_TOKEN_IMAGE}{TO_AMOUNT}{TO_TOKEN_SYMBOL} {TO_AMOUNT_USD}"
					})
				}),
				useFallbackPurchaseUI && /* @__PURE__ */ jsx(FallbackPurchaseUI, {
					chainId: modalProps.chainId,
					steps: steps$2,
					onSuccess: handleTransactionSuccess
				})
			]
		})
	});
};

//#endregion
//#region src/react/ui/modals/BuyModal/components/Modal.tsx
const BuyModal = () => {
	if (!useIsOpen$2()) return null;
	return /* @__PURE__ */ jsx(BuyModalContent, {});
};

//#endregion
//#region src/react/ui/modals/_internal/components/actionModal/ActionModal.tsx
const ActionModal = ({ isOpen, onClose, title, children, ctas, chainId, disableAnimation, modalLoading, spinnerContainerClassname, hideCtas }) => {
	const { status } = useAccount();
	const { ensureCorrectChain } = useEnsureCorrectChain();
	if (!isOpen) return null;
	return /* @__PURE__ */ jsx(Modal, {
		isDismissible: true,
		onClose,
		overlayProps: MODAL_OVERLAY_PROPS,
		contentProps: MODAL_CONTENT_PROPS,
		disableAnimation,
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative flex grow flex-col items-center gap-4 p-6",
			children: [
				/* @__PURE__ */ jsx(Text, {
					className: "w-full text-center font-body font-bold text-large text-text-100",
					children: title
				}),
				modalLoading || status !== "connected" ? /* @__PURE__ */ jsx("div", {
					className: `flex ${spinnerContainerClassname} w-full items-center justify-center`,
					"data-testid": "error-loading-wrapper",
					children: /* @__PURE__ */ jsx("div", {
						"data-testid": "spinner",
						children: /* @__PURE__ */ jsx(Spinner, { size: "lg" })
					})
				}) : children,
				!hideCtas && status === "connected" && /* @__PURE__ */ jsx("div", {
					className: "flex w-full flex-col gap-2",
					children: ctas.map((cta) => !cta.hidden && /* @__PURE__ */ jsx(Button, {
						className: "w-full rounded-[12px] [&>div]:justify-center",
						onClick: () => ensureCorrectChain(Number(chainId), { onSuccess: cta.onClick }),
						variant: cta.variant || "primary",
						pending: cta.pending,
						disabled: cta.disabled,
						size: "lg",
						"data-testid": cta.testid,
						label: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-center gap-2",
							children: [cta.pending && /* @__PURE__ */ jsx("div", {
								"data-testid": `${cta.testid}-spinner`,
								children: /* @__PURE__ */ jsx(Spinner, { size: "sm" })
							}), cta.label]
						})
					}, cta.onClick.toString()))
				})
			]
		})
	});
};

//#endregion
//#region src/react/ui/modals/_internal/components/actionModal/ErrorModal.tsx
const ErrorModal = ({ isOpen, chainId, onClose, title, message }) => /* @__PURE__ */ jsx(ActionModal, {
	isOpen,
	chainId,
	onClose,
	title,
	ctas: [],
	children: /* @__PURE__ */ jsx("div", {
		className: "flex items-center justify-center p-4",
		"data-testid": "error-modal",
		children: /* @__PURE__ */ jsx(Text, {
			className: "font-body",
			color: "text80",
			children: message || "Error loading item details"
		})
	})
});

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
		children: [/* @__PURE__ */ jsx(TimeIcon, { color: "white" }), /* @__PURE__ */ jsxs("div", {
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
	return /* @__PURE__ */ jsxs(DropdownMenuRoot, {
		open: isOpen,
		onOpenChange: setIsOpen,
		children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsx(Button, {
				leftIcon: CalendarIcon_default,
				className: "h-9 flex-1 rounded-sm p-2 font-medium text-xs",
				variant: "base",
				label: format(selectedDate, "yyyy/MM/dd HH:mm"),
				shape: "square",
				onClick: () => setIsOpen(!isOpen)
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
			className: `${className} mt-0.5 flex w-full items-center gap-2 rounded-sm border border-border-base`,
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
	const { data: listing, isLoading: listingLoading } = useLowestListing({
		tokenId,
		chainId,
		collectionAddress,
		filter: { currencies: [price.currency.contractAddress] }
	});
	const floorPriceRaw = listing?.priceAmount;
	const floorPriceFormatted = listing?.priceAmountFormatted;
	const { data: priceComparison, isLoading: comparisonLoading } = useComparePrices({
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
		className: "flex w-full flex-wrap items-center justify-between gap-2",
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
//#region src/react/hooks/data/tokens/useCurrencyBalance.tsx
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
* const { data: ethBalance, isLoading } = useCurrencyBalance({
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
* const { data: usdcBalance } = useCurrencyBalance({
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
function useCurrencyBalance(args) {
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
	return /* @__PURE__ */ jsxs(DropdownMenuRoot, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
		asChild: true,
		disabled,
		children: /* @__PURE__ */ jsx(Button, {
			size: "xs",
			label: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-center gap-1 truncate pr-3",
				children: [/* @__PURE__ */ jsx(Text, {
					variant: "xsmall",
					color: "text100",
					fontWeight: "bold",
					children: selectedItem ? selectedItem.content : placeholder
				}), /* @__PURE__ */ jsx(ChevronDownIcon, { size: "xs" })]
			}),
			shape: "circle",
			className: `bg-overlay-light py-1.5 pl-3 ${className || ""}`,
			"data-testid": `${testId}-trigger`
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
//#region src/react/ui/modals/_internal/components/currencyOptionsSelect/index.tsx
function CurrencyOptionsSelect({ chainId, collectionAddress, secondCurrencyAsDefault, selectedCurrency, onCurrencyChange, includeNativeCurrency, orderbookKind, modalType }) {
	const { data: currencies, isLoading: currenciesLoading } = useMarketCurrencies({
		chainId,
		collectionAddress,
		includeNativeCurrency
	});
	let filteredCurrencies = currencies;
	if (currencies && orderbookKind === OrderbookKind.opensea && modalType) filteredCurrencies = currencies.filter((currency) => {
		if (modalType === "listing") return currency.openseaListing;
		if (modalType === "offer") return currency.openseaOffer;
		return false;
	});
	useEffect(() => {
		if (filteredCurrencies && filteredCurrencies.length > 0 && !selectedCurrency?.contractAddress) if (secondCurrencyAsDefault && filteredCurrencies.length > 1) onCurrencyChange(filteredCurrencies[1]);
		else onCurrencyChange(filteredCurrencies[0]);
	}, [
		filteredCurrencies,
		selectedCurrency?.contractAddress,
		secondCurrencyAsDefault,
		onCurrencyChange
	]);
	if (!filteredCurrencies || currenciesLoading || !selectedCurrency?.symbol) return /* @__PURE__ */ jsx(Skeleton, { className: "mr-3 h-7 w-20 rounded-2xl" });
	const options = filteredCurrencies.map((currency) => ({
		label: currency.symbol,
		value: currency.contractAddress,
		content: currency.symbol
	}));
	const onChange = (value) => {
		const selectedCurrency$1 = filteredCurrencies.find((currency) => currency.contractAddress === value);
		if (selectedCurrency$1) onCurrencyChange(selectedCurrency$1);
	};
	const isDropdownDisabled = orderbookKind === OrderbookKind.opensea;
	return /* @__PURE__ */ jsx(CustomSelect, {
		items: options,
		onValueChange: onChange,
		defaultValue: {
			value: selectedCurrency.contractAddress,
			content: selectedCurrency.symbol
		},
		disabled: isDropdownDisabled,
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
	const { data: conversion, isLoading: isConversionLoading } = useConvertPriceToUSD({
		chainId,
		currencyAddress,
		amountRaw: priceAmountRaw,
		query: { enabled: orderbookKind === OrderbookKind.opensea && !!currencyAddress && !!priceAmountRaw && !!setOpenseaLowestPriceCriteriaMet }
	});
	useEffect(() => {
		if (inputRef.current) inputRef.current.focus();
	}, []);
	const { data: balance, isSuccess: isBalanceSuccess } = useCurrencyBalance({
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
			/* @__PURE__ */ jsx("div", {
				className: "absolute top-8 left-2 flex items-center",
				children: /* @__PURE__ */ jsx(currencyImage_default, { price })
			}),
			/* @__PURE__ */ jsx("div", {
				className: "[&>label]:gap-1",
				children: /* @__PURE__ */ jsx(NumericInput, {
					ref: inputRef,
					className: "h-9 w-full rounded-sm px-2 [&>input]:pl-5 [&>input]:text-xs",
					name: "price-input",
					decimals: currencyDecimals,
					label: "Enter price",
					labelLocation: "top",
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
				})
			}),
			balanceError && /* @__PURE__ */ jsx("div", {
				className: "mt-2",
				children: /* @__PURE__ */ jsx(Text, {
					className: "font-body font-medium text-xs",
					color: "negative",
					children: modalType === "offer" && hasEnoughForBaseOffer && royaltyFeeFormatted && Number(royaltyFeeFormatted) > 0 ? /* @__PURE__ */ jsx(RoyaltyFeeTooltip, { children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ jsx(InfoIcon, { className: "h-4 w-4 text-negative" }), /* @__PURE__ */ jsxs(Text, {
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
					}) }) : "Insufficient balance"
				})
			}),
			!balanceError && modalType === "offer" && royaltyFeeFormatted && Number(royaltyFeeFormatted) > 0 && /* @__PURE__ */ jsx("div", {
				className: "mt-2",
				children: /* @__PURE__ */ jsx(RoyaltyFeeTooltip, { children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ jsx(InfoIcon, { className: "h-4 w-4 text-text-50" }), /* @__PURE__ */ jsxs(Text, {
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
				}) })
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
		className: cn$1("flex w-full flex-col [&>label>div>div>div:has(:disabled):hover]:opacity-100 [&>label>div>div>div:has(:disabled)]:opacity-100 [&>label>div>div>div>input]:text-xs [&>label>div>div>div]:h-9 [&>label>div>div>div]:rounded [&>label>div>div>div]:pr-0 [&>label>div>div>div]:pl-3 [&>label>div>div>div]:text-xs [&>label]:gap-[2px]", className, disabled && "pointer-events-none opacity-50"),
		children: [/* @__PURE__ */ jsx(NumericInput, {
			className: "w-full pl-1",
			name: "quantity",
			decimals: decimals || 0,
			label: "Enter quantity",
			labelLocation: "top",
			controls: /* @__PURE__ */ jsxs("div", {
				className: "mr-2 flex items-center gap-1",
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
		}), invalidQuantity && /* @__PURE__ */ jsx("div", {
			className: "text-negative text-sm",
			children: "Invalid quantity"
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
const ActionButtons = ({ onCancel, onConfirm, disabled, loading, confirmed, tokenSymbol }) => /* @__PURE__ */ jsxs("div", {
	className: "mt-4 flex w-full items-center justify-end gap-2",
	children: [/* @__PURE__ */ jsx(Button, {
		pending: loading,
		onClick: onCancel,
		label: /* @__PURE__ */ jsx("div", {
			className: "flex items-center gap-2",
			children: "Cancel"
		}),
		variant: "ghost",
		shape: "square",
		size: "md"
	}), /* @__PURE__ */ jsx(Button, {
		disabled,
		pending: loading || confirmed,
		onClick: onConfirm,
		label: /* @__PURE__ */ jsx("div", {
			className: "flex items-center gap-2",
			children: !confirmed ? tokenSymbol ? `Continue with ${tokenSymbol}` : /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: ["Continue with", /* @__PURE__ */ jsx(Skeleton, { className: "h-[20px] w-6 animate-shimmer" })]
			}) : /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(Spinner, { size: "sm" }), "Confirming"]
			})
		}),
		variant: "primary",
		shape: "square",
		size: "md"
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
	const config = useConfig();
	const { address: userAddress } = useAccount();
	const { selectedFeeOption, setSelectedFeeOption } = useSelectWaasFeeOptionsStore();
	const { pendingFeeOptionConfirmation, confirmPendingFeeOption, rejectPendingFeeOption } = useWaasFeeOptions$1(chainId, config);
	const [feeOptionsConfirmed, setFeeOptionsConfirmed] = useState(false);
	const { data: currencyBalance, isLoading: currencyBalanceLoading } = useCurrencyBalance({
		chainId,
		currencyAddress: selectedFeeOption?.token.contractAddress || zeroAddress,
		userAddress
	});
	useEffect(() => {
		if (!selectedFeeOption && pendingFeeOptionConfirmation) {
			if (pendingFeeOptionConfirmation.options.length > 0) setSelectedFeeOption(pendingFeeOptionConfirmation.options[0]);
		}
	}, [
		pendingFeeOptionConfirmation,
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
		if (!selectedFeeOption?.token || !pendingFeeOptionConfirmation?.id) return;
		confirmPendingFeeOption(pendingFeeOptionConfirmation?.id, selectedFeeOption.token.contractAddress || zeroAddress);
		rejectPendingFeeOption(pendingFeeOptionConfirmation?.id);
		setFeeOptionsConfirmed(true);
	};
	const handleRejectFeeOption = (id) => {
		rejectPendingFeeOption(id);
		setSelectedFeeOption(void 0);
	};
	return {
		selectedFeeOption,
		pendingFeeOptionConfirmation,
		currencyBalance,
		currencyBalanceLoading,
		insufficientBalance,
		feeOptionsConfirmed,
		handleConfirmFeeOption,
		rejectPendingFeeOption: handleRejectFeeOption
	};
};
var useWaasFeeOptionManager_default = useWaasFeeOptionManager;

//#endregion
//#region src/react/ui/modals/_internal/components/selectWaasFeeOptions/index.tsx
const SelectWaasFeeOptions = ({ chainId, onCancel, titleOnConfirm, className }) => {
	const { isVisible, hide, setSelectedFeeOption } = useSelectWaasFeeOptionsStore();
	const { selectedFeeOption, pendingFeeOptionConfirmation, currencyBalance, currencyBalanceLoading, insufficientBalance, feeOptionsConfirmed, handleConfirmFeeOption, rejectPendingFeeOption } = useWaasFeeOptionManager_default(chainId);
	const handleCancelFeeOption = () => {
		if (pendingFeeOptionConfirmation?.id) rejectPendingFeeOption(pendingFeeOptionConfirmation?.id);
		hide();
		onCancel?.();
	};
	const isSponsored = pendingFeeOptionConfirmation?.options?.length === 0;
	if (!isVisible || isSponsored || !selectedFeeOption) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: cn$1("flex w-full flex-col gap-2 rounded-2xl bg-button-emphasis p-0 backdrop-blur-md", className),
		children: [
			/* @__PURE__ */ jsx(Divider, { className: "mt-0 mb-4" }),
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
	const { data: collectable, isLoading: collectibleLoading } = useCollectible({
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
		if (royalty !== null) fees.push(Number(royalty.percentage));
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
			children: [/* @__PURE__ */ jsx(Image, {
				className: "h-3 w-3",
				src: currencyImageUrl
			}), priceLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24 animate-shimmer" }) : /* @__PURE__ */ jsx(Text, {
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
//#region src/react/ui/modals/_internal/hooks/useSelectWaasFeeOptions.tsx
const useSelectWaasFeeOptions = ({ isProcessing, feeOptionsVisible, selectedFeeOption }) => {
	const { isWaaS } = useConnectorMetadata();
	const isProcessingWithWaaS = isProcessing && isWaaS;
	const shouldHideActionButton = isProcessingWithWaaS && feeOptionsVisible === true && !!selectedFeeOption;
	const waasFeeOptionsShown = isWaaS && isProcessing && feeOptionsVisible;
	const getActionLabel = (defaultLabel) => {
		const loadingLabelNode = /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ jsx(Spinner, { size: "sm" }), " Loading fee options..."]
		});
		if (isProcessing) return isWaaS ? loadingLabelNode : defaultLabel;
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
const useGetTokenApprovalData$2 = (params) => {
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
const useTransactionSteps$2 = ({ listingInput, chainId, collectionAddress, orderbookKind, callbacks, closeMainModal, steps$ }) => {
	const { address } = useAccount();
	const publicClient = usePublicClient();
	const { walletKind } = useConnectorMetadata();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const { data: currencies } = useMarketCurrencies({ chainId });
	const currency = currencies?.find((currency$1) => currency$1.contractAddress === listingInput.listing.currencyAddress);
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
					balanceQueries.all,
					collectableKeys.lowestListings,
					collectableKeys.listings,
					collectableKeys.listingsCount,
					collectableKeys.userBalances
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
				const currencyDecimal = currencies?.find((currency$1) => currency$1.contractAddress === listingInput.listing.currencyAddress)?.decimals || 0;
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
	const { data: tokenApproval, isLoading: tokenApprovalIsLoading, isError, error } = useGetTokenApprovalData$2({
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
	const { generatingSteps, executeApproval, createListing } = useTransactionSteps$2({
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
		children: () => /* @__PURE__ */ jsx(Modal$3, {})
	});
};
const Modal$3 = observer(() => {
	const { collectionAddress, chainId, listingPrice: listingPrice$1, collectibleId, orderbookKind: orderbookKindProp, callbacks, listingIsBeingProcessed } = createListingModal$.get();
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const [error, setError] = useState(void 0);
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
	const { data: collectible, isLoading: collectableIsLoading, isError: collectableIsError } = useCollectible({
		chainId,
		collectionAddress,
		collectibleId
	});
	const { data: currencies, isLoading: currenciesLoading, isError: currenciesIsError } = useMarketCurrencies({
		chainId,
		collectionAddress,
		includeNativeCurrency: true
	});
	const { data: collection, isLoading: collectionIsLoading, isError: collectionIsError } = useCollection({
		chainId,
		collectionAddress
	});
	const modalLoading = collectableIsLoading || collectionIsLoading || currenciesLoading;
	const { address } = useAccount();
	const { data: balance } = useBalanceOfCollectible({
		chainId,
		collectionAddress,
		collectableId: collectibleId,
		userAddress: address ?? void 0
	});
	const balanceWithDecimals = balance?.balance ? dn.toNumber(dn.from([BigInt(balance.balance), collectible?.decimals || 0])) : 0;
	const { isLoading, executeApproval, createListing, tokenApprovalIsLoading, isError: tokenApprovalIsError } = useCreateListing({
		listingInput: {
			contractType: collection?.type,
			listing: {
				tokenId: collectibleId,
				quantity: parseUnits(createListingModal$.quantity.get(), collectible?.decimals || 0).toString(),
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
	if (collectableIsError || collectionIsError || currenciesIsError || tokenApprovalIsError) return /* @__PURE__ */ jsx(ErrorModal, {
		isOpen: createListingModal$.isOpen.get(),
		chainId: Number(chainId),
		onClose: createListingModal$.close,
		title: "List item for sale"
	});
	if (!modalLoading && (!currencies || currencies.length === 0)) return /* @__PURE__ */ jsx(ErrorModal, {
		isOpen: createListingModal$.isOpen.get(),
		chainId: Number(chainId),
		onClose: createListingModal$.close,
		title: "List item for sale",
		message: "No currencies are configured for the marketplace, contact the marketplace owners"
	});
	const handleCreateListing = async () => {
		createListingModal$.listingIsBeingProcessed.set(true);
		try {
			if (isWaaS) selectWaasFeeOptionsStore.send({ type: "show" });
			await createListing({ isTransactionExecuting: !!isWaaS });
		} catch (error$1) {
			console.error("Create listing failed:", error$1);
			setError(error$1);
		} finally {
			createListingModal$.listingIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		}
	};
	const handleApproveToken = async () => {
		await executeApproval().catch((error$1) => {
			console.error("Approve TOKEN failed:", error$1);
			setError(error$1);
		});
	};
	const listCtaLabel = getActionLabel("List item for sale");
	const ctas = [{
		label: "Approve TOKEN",
		onClick: handleApproveToken,
		hidden: !steps$.approval.exist.get(),
		pending: steps$?.approval.isExecuting.get(),
		variant: "glass",
		disabled: createListingModal$.invalidQuantity.get() || listingPrice$1.amountRaw === "0" || steps$?.approval.isExecuting.get() || tokenApprovalIsLoading || isLoading
	}, {
		label: listCtaLabel,
		onClick: handleCreateListing,
		pending: steps$?.transaction.isExecuting.get() || createListingModal$.listingIsBeingProcessed.get(),
		testid: "create-listing-submit-button",
		disabled: steps$.approval.exist.get() || tokenApprovalIsLoading || listingPrice$1.amountRaw === "0" || createListingModal$.invalidQuantity.get() || isLoading || listingIsBeingProcessed
	}];
	return /* @__PURE__ */ jsxs(ActionModal, {
		isOpen: createListingModal$.isOpen.get(),
		chainId: Number(chainId),
		onClose: () => {
			createListingModal$.close();
			selectWaasFeeOptionsStore.send({ type: "hide" });
		},
		title: "List item for sale",
		ctas,
		modalLoading,
		spinnerContainerClassname: "h-[220px]",
		hideCtas: shouldHideListButton,
		children: [
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
			collection?.type === "ERC1155" && balance && /* @__PURE__ */ jsx(QuantityInput, {
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
			}),
			error && /* @__PURE__ */ jsx(ErrorLogBox, {
				title: "An error occurred while listing",
				message: "Please try again",
				error
			})
		]
	});
});

//#endregion
//#region src/react/ui/modals/MakeOfferModal/hooks/useGetTokenApproval.tsx
const ONE_DAY_IN_SECONDS = 3600 * 24;
const useGetTokenApprovalData$1 = (params) => {
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
				additionalFees: [],
				offerType: OfferType.item
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
const useTransactionSteps$1 = ({ offerInput, chainId, collectionAddress, orderbookKind = OrderbookKind.sequence_marketplace_v2, callbacks, closeMainModal, steps$ }) => {
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
				additionalFees: [],
				offerType: OfferType.item
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
					balanceQueries.all,
					collectableKeys.highestOffers,
					collectableKeys.offers,
					collectableKeys.offersCount,
					collectableKeys.userBalances
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
	const { data: tokenApproval, isLoading: tokenApprovalIsLoading, isError, error } = useGetTokenApprovalData$1({
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
	const { generatingSteps, executeApproval, makeOffer } = useTransactionSteps$1({
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
		children: () => /* @__PURE__ */ jsx(Modal$2, {})
	});
};
const Modal$2 = observer(() => {
	const { collectionAddress, chainId, offerPrice: offerPrice$1, offerPriceChanged, invalidQuantity, collectibleId, orderbookKind: orderbookKindProp, callbacks } = makeOfferModal$.get();
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const [error, setError] = useState(void 0);
	const collectionConfig = marketplaceConfig?.market.collections.find((c) => c.itemsAddress === collectionAddress);
	const orderbookKind = orderbookKindProp ?? collectionConfig?.destinationMarketplace;
	const steps$ = makeOfferModal$.steps;
	const [insufficientBalance, setInsufficientBalance] = useState(false);
	const [openseaLowestPriceCriteriaMet, setOpenseaLowestPriceCriteriaMet] = useState(true);
	const { data: collectible, isLoading: collectableIsLoading, isError: collectableIsError } = useCollectible({
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
	const { data: collection, isLoading: collectionIsLoading, isError: collectionIsError } = useCollection({
		chainId,
		collectionAddress
	});
	const { data: currencies, isLoading: currenciesLoading, isError: currenciesIsError } = useMarketCurrencies({
		chainId,
		collectionAddress,
		includeNativeCurrency: false
	});
	const { data: royalty, isLoading: royaltyLoading } = useRoyalty({
		chainId,
		collectionAddress,
		collectibleId
	});
	const modalLoading = collectableIsLoading || collectionIsLoading || currenciesLoading || royaltyLoading;
	const { isLoading, executeApproval, makeOffer, isError: approvalIsError } = useMakeOffer({
		offerInput: {
			contractType: collection?.type,
			offer: {
				tokenId: collectibleId,
				quantity: parseUnits(makeOfferModal$.quantity.get(), collectible?.decimals || 0).toString(),
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
	const buyModal = useBuyModal(callbacks);
	const { data: lowestListing } = useLowestListing({
		tokenId: collectibleId,
		chainId,
		collectionAddress,
		filter: { currencies: [offerPrice$1.currency.contractAddress] }
	});
	if (collectableIsError || collectionIsError || currenciesIsError || approvalIsError) return /* @__PURE__ */ jsx(ErrorModal, {
		isOpen: makeOfferModal$.isOpen.get(),
		chainId: Number(chainId),
		onClose: makeOfferModal$.close,
		title: "Make an offer"
	});
	if (!currenciesLoading && !currenciesIsError && (!currencies || currencies.length === 0)) return /* @__PURE__ */ jsx(ErrorModal, {
		isOpen: makeOfferModal$.isOpen.get(),
		chainId: Number(chainId),
		onClose: makeOfferModal$.close,
		title: "Make an offer",
		message: "No ERC-20s are configured for the marketplace, contact the marketplace owners"
	});
	const handleMakeOffer = async () => {
		makeOfferModal$.offerIsBeingProcessed.set(true);
		try {
			if (isWaaS) selectWaasFeeOptionsStore.send({ type: "show" });
			await makeOffer({ isTransactionExecuting: isWaaS ? getNetwork(Number(chainId)).type !== NetworkType.TESTNET : false });
		} catch (error$1) {
			console.error("Make offer failed:", error$1);
			setError(error$1);
		} finally {
			makeOfferModal$.offerIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		}
	};
	const handleApproveToken = async () => {
		await executeApproval().catch((error$1) => {
			console.error("Approve TOKEN failed:", error$1);
			setError(error$1);
		});
	};
	const offerCtaLabel = getActionLabel("Make offer");
	const ctas = [{
		label: "Approve TOKEN",
		onClick: handleApproveToken,
		hidden: !steps$.approval.exist.get(),
		pending: steps$.approval.isExecuting.get(),
		variant: "glass",
		disabled: invalidQuantity || isLoading || insufficientBalance || offerPrice$1.amountRaw === "0" || !offerPriceChanged || orderbookKind === OrderbookKind.opensea && !openseaLowestPriceCriteriaMet
	}, {
		label: offerCtaLabel,
		onClick: () => handleMakeOffer(),
		pending: steps$?.transaction.isExecuting.get() || makeOfferModal$.offerIsBeingProcessed.get(),
		disabled: steps$.approval.isExecuting.get() || steps$.approval.exist.get() || offerPrice$1.amountRaw === "0" || insufficientBalance || isLoading || invalidQuantity || orderbookKind === OrderbookKind.opensea && !openseaLowestPriceCriteriaMet
	}];
	return /* @__PURE__ */ jsxs(ActionModal, {
		isOpen: makeOfferModal$.isOpen.get(),
		chainId: Number(chainId),
		onClose: () => {
			makeOfferModal$.close();
			selectWaasFeeOptionsStore.send({ type: "hide" });
			steps$.transaction.isExecuting.set(false);
		},
		title: "Make an offer",
		ctas,
		modalLoading,
		spinnerContainerClassname: "h-[188px]",
		hideCtas: shouldHideOfferButton,
		children: [
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
			}),
			error && /* @__PURE__ */ jsx(ErrorLogBox, {
				title: "An error occurred while making an offer",
				message: "Please try again",
				error
			})
		]
	});
});

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
//#region src/react/ui/modals/SellModal/hooks/useGetTokenApproval.tsx
const useGetTokenApprovalData = (params) => {
	const config = useConfig();
	const { address } = useAccount();
	const { walletKind } = useConnectorMetadata();
	const marketplaceClient = getMarketplaceClient(config);
	const { amount, receiver } = useMarketPlatformFee({
		chainId: Number(params.chainId),
		collectionAddress: params.collectionAddress
	});
	const { data, isLoading, isSuccess, isError, error } = useQuery({
		queryKey: ["token-approval-data", params.ordersData],
		queryFn: address ? async () => {
			const args = {
				chainId: String(params.chainId),
				collectionAddress: params.collectionAddress,
				walletType: walletKind,
				seller: address,
				marketplace: params.marketplace,
				ordersData: params.ordersData,
				additionalFees: [{
					amount,
					receiver
				}]
			};
			const tokenApprovalStep = (await marketplaceClient.generateSellTransaction(args).then((resp) => resp.steps)).find((step) => step.id === StepType.tokenApproval);
			if (!tokenApprovalStep) return { step: null };
			return { step: tokenApprovalStep };
		} : skipToken,
		enabled: !!address && !!params.collectionAddress
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
//#region src/react/ui/modals/SellModal/hooks/useTransactionSteps.tsx
const useTransactionSteps = ({ collectibleId, chainId, collectionAddress, marketplace, ordersData, callbacks, closeMainModal, steps$ }) => {
	const { address } = useAccount();
	const { walletKind } = useConnectorMetadata();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const analytics = useAnalytics();
	const { processStep } = useProcessStep();
	const { amount, receiver } = useMarketPlatformFee({
		chainId,
		collectionAddress
	});
	const { data: currencies } = useMarketCurrencies({ chainId });
	const { generateSellTransactionAsync, isPending: generatingSteps } = useGenerateSellTransaction({
		chainId,
		onSuccess: (steps$2) => {
			if (!steps$2) return;
		}
	});
	const getSellSteps = async () => {
		if (!address) return;
		try {
			return await generateSellTransactionAsync({
				collectionAddress,
				walletType: walletKind,
				marketplace,
				ordersData,
				additionalFees: [{
					amount,
					receiver
				}],
				seller: address
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
			const approvalStep = await getSellSteps().then((steps$2) => steps$2?.find((step) => step.id === StepType.tokenApproval));
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
	const sell = async ({ isTransactionExecuting }) => {
		if (!address) return;
		try {
			steps$.transaction.isExecuting.set(isTransactionExecuting);
			const steps$2 = await getSellSteps();
			const transactionStep = steps$2?.find((step) => step.id === StepType.sell);
			const signatureStep = steps$2?.find((step) => step.id === StepType.signEIP712);
			console.debug("transactionStep", transactionStep);
			console.debug("signatureStep", signatureStep);
			if (!transactionStep && !signatureStep) throw new Error("No transaction or signature step found");
			let hash;
			let orderId;
			if (transactionStep) {
				const result = await processStep(transactionStep, chainId);
				if (result.type === "transaction") hash = result.hash;
			}
			if (signatureStep) {
				const result = await processStep(signatureStep, chainId);
				if (result.type === "signature") orderId = result.orderId;
			}
			closeMainModal();
			showTransactionStatusModal({
				type: TransactionType.SELL,
				collectionAddress,
				chainId,
				collectibleId,
				hash,
				orderId,
				callbacks,
				queriesToInvalidate: [balanceQueries.all, collectableKeys.userBalances]
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
				const currency = currencies?.find((currency$1) => currency$1.contractAddress === ordersData[0].currencyAddress);
				const currencyDecimal = currency?.decimals || 0;
				const currencySymbol = currency?.symbol || "";
				const currencyValueRaw = Number(ordersData[0].pricePerToken);
				const currencyValueDecimal = Number(formatUnits(BigInt(currencyValueRaw), currencyDecimal));
				analytics.trackSellItems({
					props: {
						marketplaceKind: marketplace,
						userId: address,
						collectionAddress,
						currencyAddress: ordersData[0].currencyAddress,
						currencySymbol,
						requestId: ordersData[0].orderId,
						tokenId: collectibleId,
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
		sell
	};
};

//#endregion
//#region src/react/ui/modals/SellModal/hooks/useSell.tsx
const useSell = ({ collectibleId, chainId, collectionAddress, marketplace, ordersData, callbacks, closeMainModal, steps$ }) => {
	const { data: tokenApproval, isLoading: tokenApprovalIsLoading, isError, error } = useGetTokenApprovalData({
		chainId,
		collectionAddress,
		ordersData,
		marketplace
	});
	useEffect(() => {
		if (tokenApproval?.step && !tokenApprovalIsLoading) steps$.approval.exist.set(true);
	}, [tokenApproval?.step, tokenApprovalIsLoading]);
	const { generatingSteps, executeApproval, sell } = useTransactionSteps({
		collectibleId,
		chainId,
		collectionAddress,
		marketplace,
		ordersData,
		callbacks,
		closeMainModal,
		steps$
	});
	return {
		isLoading: generatingSteps,
		executeApproval,
		sell,
		tokenApprovalStepExists: tokenApproval?.step !== null,
		tokenApprovalIsLoading,
		isError,
		error
	};
};

//#endregion
//#region src/react/ui/modals/SellModal/Modal.tsx
const SellModal = () => {
	return /* @__PURE__ */ jsx(Show, {
		if: sellModal$.isOpen,
		children: () => /* @__PURE__ */ jsx(Modal$1, {})
	});
};
const Modal$1 = observer(() => {
	const { tokenId, collectionAddress, chainId, order, callbacks } = sellModal$.get();
	const steps$ = sellModal$.steps;
	const { data: collectible } = useCollection({
		chainId,
		collectionAddress
	});
	const [error, setError] = useState(void 0);
	const { data: collection, isLoading: collectionLoading, isError: collectionError } = useCollection({
		chainId,
		collectionAddress
	});
	const { data: currency, isLoading: currencyLoading, isError: currencyError } = useCurrency({
		chainId,
		currencyAddress: order?.priceCurrencyAddress
	});
	const { isWaaS } = useConnectorMetadata();
	const { isVisible: feeOptionsVisible, selectedFeeOption } = useSelectWaasFeeOptionsStore();
	const isTestnet = getNetwork(Number(chainId)).type === NetworkType.TESTNET;
	const isProcessing = sellModal$.sellIsBeingProcessed.get();
	const { shouldHideActionButton: shouldHideSellButton } = useSelectWaasFeeOptions({
		isProcessing,
		feeOptionsVisible,
		selectedFeeOption
	});
	const { isLoading, executeApproval, sell, isError } = useSell({
		collectionAddress,
		chainId,
		collectibleId: tokenId,
		marketplace: order?.marketplace,
		ordersData: [{
			orderId: order?.orderId ?? "",
			quantity: order?.quantityRemaining ? parseUnits(order.quantityRemaining, collectible?.decimals || 0).toString() : "1",
			pricePerToken: order?.priceAmount ?? "",
			currencyAddress: order?.priceCurrencyAddress ?? ""
		}],
		callbacks,
		closeMainModal: () => sellModal$.close(),
		steps$
	});
	const modalLoading = collectionLoading || currencyLoading;
	if ((collectionError || order === void 0 || currencyError || isError) && !modalLoading) return /* @__PURE__ */ jsx(ErrorModal, {
		isOpen: sellModal$.isOpen.get(),
		chainId: Number(chainId),
		onClose: sellModal$.close,
		title: "You have an offer"
	});
	const handleSell = async () => {
		sellModal$.sellIsBeingProcessed.set(true);
		try {
			if (isWaaS) selectWaasFeeOptionsStore.send({ type: "show" });
			await sell({ isTransactionExecuting: isWaaS ? !isTestnet : false });
		} catch (error$1) {
			console.error("Sell failed:", error$1);
		} finally {
			sellModal$.sellIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		}
	};
	const handleApproveToken = async () => {
		await executeApproval().catch((error$1) => {
			console.error("Approve TOKEN failed:", error$1);
			setError(error$1);
		});
	};
	const sellCtaLabel = isProcessing ? isWaaS && !isTestnet ? "Loading fee options" : "Accept" : "Accept";
	const ctas = [{
		label: "Approve TOKEN",
		onClick: handleApproveToken,
		hidden: !steps$.approval.exist.get(),
		pending: steps$.approval.isExecuting.get(),
		variant: "glass",
		disabled: isLoading || order?.quantityRemaining === "0"
	}, {
		label: sellCtaLabel,
		onClick: () => handleSell(),
		pending: steps$?.transaction.isExecuting.get() || sellModal$.sellIsBeingProcessed.get(),
		disabled: isLoading || steps$.approval.isExecuting.get() || steps$.approval.exist.get() || order?.quantityRemaining === "0"
	}];
	const showWaasFeeOptions = isWaaS && sellModal$.sellIsBeingProcessed.get() && feeOptionsVisible;
	return /* @__PURE__ */ jsxs(ActionModal, {
		isOpen: sellModal$.isOpen.get(),
		chainId: Number(chainId),
		onClose: () => {
			sellModal$.close();
			selectWaasFeeOptionsStore.send({ type: "hide" });
			steps$.transaction.isExecuting.set(false);
		},
		title: "You have an offer",
		ctas,
		modalLoading,
		spinnerContainerClassname: "h-[104px]",
		hideCtas: shouldHideSellButton,
		children: [
			/* @__PURE__ */ jsx(TransactionHeader, {
				title: "Offer received",
				currencyImageUrl: currency?.imageUrl,
				date: order && new Date(order.createdAt)
			}),
			/* @__PURE__ */ jsx(TokenPreview, {
				collectionName: collection?.name,
				collectionAddress,
				collectibleId: tokenId,
				chainId
			}),
			/* @__PURE__ */ jsx(TransactionDetails, {
				collectibleId: tokenId,
				collectionAddress,
				chainId,
				includeMarketplaceFee: true,
				price: currency ? {
					amountRaw: order?.priceAmount,
					currency
				} : void 0,
				currencyImageUrl: currency?.imageUrl
			}),
			showWaasFeeOptions && /* @__PURE__ */ jsx(selectWaasFeeOptions_default, {
				chainId: Number(chainId),
				onCancel: () => {
					sellModal$.sellIsBeingProcessed.set(false);
					steps$.transaction.isExecuting.set(false);
				},
				titleOnConfirm: "Accepting offer..."
			}),
			error && /* @__PURE__ */ jsx(ErrorLogBox, {
				title: "An error occurred while selling",
				message: error.message,
				error
			})
		]
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
		backdropColor: "backgroundBackdrop",
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
		children: [modalState.ctaOptions && /* @__PURE__ */ jsx(Button, {
			className: "w-full",
			shape: "square",
			leftIcon: modalState.ctaOptions.ctaIcon || void 0,
			label: modalState.ctaOptions.ctaLabel,
			onClick: modalState.ctaOptions.ctaOnClick || void 0
		}), /* @__PURE__ */ jsx("a", {
			href: modalState.explorerUrl,
			target: "_blank",
			rel: "noopener noreferrer",
			className: "w-full",
			children: /* @__PURE__ */ jsx(Button, {
				shape: "square",
				leftIcon: ExternalLinkIcon,
				label: `View on ${modalState.explorerName}`
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
		label: getLabel(),
		variant: "primary",
		shape: "square",
		size: "sm"
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
	return /* @__PURE__ */ jsxs("div", {
		className: "[&>label>div>span]:text-sm [&>label>div>span]:text-text-80 [&>label]:gap-1",
		children: [/* @__PURE__ */ jsx(TextInput, {
			label: "Wallet address",
			labelLocation: "top",
			autoFocus: true,
			value: receiverAddress,
			maxLength: MAX_WALLET_ADDRESS_LENGTH,
			onChange: handleChangeWalletAddress,
			name: "walletAddress",
			placeholder: "Enter wallet address",
			disabled: transferIsProcessing
		}), isSelfTransfer && /* @__PURE__ */ jsx("div", {
			className: "mt-1 text-negative text-sm",
			children: "You cannot transfer to your own address"
		})]
	});
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
	const { data: collection } = useCollection({
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
				queriesToInvalidate: [
					balanceQueries.all,
					balanceQueries.collectionBalanceDetails,
					collectableKeys.userBalances
				]
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
	const { data: tokenBalance } = useListBalances({
		chainId,
		contractAddress: collectionAddress,
		tokenId: collectibleId,
		accountAddress: connectedAddress,
		query: { enabled: !!connectedAddress }
	});
	const balanceAmount = tokenBalance?.pages[0]?.balances[0]?.balance;
	let insufficientBalance = true;
	if (balanceAmount !== void 0 && quantity) try {
		insufficientBalance = BigInt(quantity) > BigInt(balanceAmount);
	} catch (_e) {
		insufficientBalance = true;
	}
	const { data: collection } = useCollection({
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
				label: "Transfer",
				variant: "primary",
				shape: "square",
				size: "sm"
			})
		]
	});
});
var followWalletInstructions_default = FollowWalletInstructionsView;

//#endregion
//#region src/react/ui/modals/TransferModal/index.tsx
const useTransferModal = (args) => {
	const { ensureCorrectChain } = useEnsureCorrectChain();
	const { address: accountAddress } = useAccount();
	useListBalances({
		chainId: args?.prefetch?.chainId,
		contractAddress: args?.prefetch?.collectionAddress,
		tokenId: args?.prefetch?.collectibleId,
		accountAddress,
		query: { enabled: !!accountAddress && !!args?.prefetch }
	});
	const openModal = (args$1) => {
		transferModalStore.send({
			type: "open",
			...args$1
		});
	};
	const handleShowModal = (args$1) => {
		ensureCorrectChain(Number(args$1.chainId), { onSuccess: () => openModal(args$1) });
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
/*! tailwindcss v4.1.17 | MIT License | https://tailwindcss.com */
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
    --color-red-900: oklch(39.6% 0.141 25.723);
    --color-red-950: oklch(25.8% 0.092 26.042);
    --color-orange-50: oklch(98% 0.016 73.684);
    --color-orange-200: oklch(90.1% 0.076 70.697);
    --color-orange-400: oklch(75% 0.183 55.934);
    --color-orange-800: oklch(47% 0.157 37.304);
    --color-orange-950: oklch(26.6% 0.079 36.259);
    --color-amber-300: oklch(87.9% 0.169 91.605);
    --color-amber-500: oklch(76.9% 0.188 70.08);
    --color-green-500: oklch(72.3% 0.219 149.579);
    --color-blue-500: oklch(62.3% 0.214 259.815);
    --color-indigo-400: oklch(67.3% 0.182 276.935);
    --color-violet-400: oklch(70.2% 0.183 293.541);
    --color-violet-600: oklch(54.1% 0.281 293.009);
    --color-violet-700: oklch(49.1% 0.27 292.581);
    --color-gray-500: oklch(55.1% 0.027 264.364);
    --color-black: #000;
    --color-white: #fff;
    --spacing: 0.25rem;
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
    --radius-xs: 0.125rem;
    --radius-sm: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
    --animate-spin: spin 1s linear infinite;
    --blur-xs: 4px;
    --blur-md: 12px;
    --aspect-video: 16 / 9;
    --default-transition-duration: 150ms;
    --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    --default-font-family: var(--font-sans);
    --default-mono-font-family: "Roboto", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    --font-body: "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
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
  .top-0 {
    top: calc(var(--spacing) * 0);
  }
  .top-4 {
    top: calc(var(--spacing) * 4);
  }
  .top-8 {
    top: calc(var(--spacing) * 8);
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
  .mx-0 {
    margin-inline: calc(var(--spacing) * 0);
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
  .aspect-square {
    aspect-ratio: 1 / 1;
  }
  .aspect-video {
    aspect-ratio: var(--aspect-video);
  }
  .h-1 {
    height: calc(var(--spacing) * 1);
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
  .h-\[84px\] {
    height: 84px;
  }
  .h-\[98px\] {
    height: 98px;
  }
  .h-\[104px\] {
    height: 104px;
  }
  .h-\[150px\] {
    height: 150px;
  }
  .h-\[188px\] {
    height: 188px;
  }
  .h-\[220px\] {
    height: 220px;
  }
  .h-\[calc\(100dvh-70px\)\] {
    height: calc(100dvh - 70px);
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
  .min-h-\[64px\] {
    min-height: 64px;
  }
  .min-h-\[100px\] {
    min-height: 100px;
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
  .w-28 {
    width: calc(var(--spacing) * 28);
  }
  .w-32 {
    width: calc(var(--spacing) * 32);
  }
  .w-40 {
    width: calc(var(--spacing) * 40);
  }
  .w-\[1px\] {
    width: 1px;
  }
  .w-\[22px\] {
    width: 22px;
  }
  .w-\[52px\] {
    width: 52px;
  }
  .w-\[84px\] {
    width: 84px;
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
  .w-\[200px\] {
    width: 200px;
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
  .max-w-full {
    max-width: 100%;
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
  .border-collapse {
    border-collapse: collapse;
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
  .-translate-y-1 {
    --tw-translate-y: calc(var(--spacing) * -1);
    translate: var(--tw-translate-x) var(--tw-translate-y);
  }
  .transform {
    transform: var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,);
  }
  .animate-shimmer {
    animation: var(--animate-shimmer);
  }
  .animate-skeleton {
    animation: skeleton 1s ease infinite;
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
  .grid-cols-\[1fr_2fr\] {
    grid-template-columns: 1fr 2fr;
  }
  .grid-cols-\[2fr_1fr\] {
    grid-template-columns: 2fr 1fr;
  }
  .grid-cols-\[repeat\(auto-fill\,minmax\(150px\,1fr\)\)\] {
    grid-template-columns: repeat(auto-fill,minmax(150px,1fr));
  }
  .flex-col {
    flex-direction: column;
  }
  .flex-row {
    flex-direction: row;
  }
  .flex-wrap {
    flex-wrap: wrap;
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
  .border-b-2 {
    border-bottom-style: var(--tw-border-style);
    border-bottom-width: 2px;
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
  .border-amber-500 {
    border-color: var(--color-amber-500);
  }
  .border-amber-500\/30 {
    border-color: color-mix(in srgb, oklch(76.9% 0.188 70.08) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-amber-500) 30%, transparent);
    }
  }
  .border-background-primary {
    border-color: var(--seq-color-background-primary);
  }
  .border-border-base {
    border-color: var(--color-border-base);
  }
  .border-border-error {
    border-color: var(--seq-color-border-error);
  }
  .border-border-focus {
    border-color: var(--color-border-focus);
  }
  .border-border-normal {
    border-color: var(--seq-color-border-normal);
  }
  .border-orange-200 {
    border-color: var(--color-orange-200);
  }
  .border-orange-400 {
    border-color: var(--color-orange-400);
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
  .bg-amber-500 {
    background-color: var(--color-amber-500);
  }
  .bg-amber-500\/10 {
    background-color: color-mix(in srgb, oklch(76.9% 0.188 70.08) 10%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-amber-500) 10%, transparent);
    }
  }
  .bg-background-backdrop {
    background-color: var(--seq-color-background-backdrop);
  }
  .bg-background-control {
    background-color: var(--seq-color-background-control);
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
  .bg-background-primary\/25 {
    background-color: var(--seq-color-background-primary);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--seq-color-background-primary) 25%, transparent);
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
  .bg-button-emphasis {
    background-color: var(--seq-color-button-emphasis);
  }
  .bg-button-glass {
    background-color: var(--seq-color-button-glass);
  }
  .bg-button-inverse {
    background-color: var(--seq-color-button-inverse);
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
  .bg-orange-50 {
    background-color: var(--color-orange-50);
  }
  .bg-orange-950 {
    background-color: var(--color-orange-950);
  }
  .bg-overlay-light {
    background-color: var(--color-overlay-light);
  }
  .bg-positive {
    background-color: var(--seq-color-positive);
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
  .fill-background-raised {
    fill: var(--seq-color-background-raised);
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
  .py-8 {
    padding-block: calc(var(--spacing) * 8);
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
  .tracking-\[0\.8px\] {
    --tw-tracking: 0.8px;
    letter-spacing: 0.8px;
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
  .text-amber-300 {
    color: var(--color-amber-300);
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
  .text-gray-500 {
    color: var(--color-gray-500);
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
  .text-orange-400 {
    color: var(--color-orange-400);
  }
  .text-orange-800 {
    color: var(--color-orange-800);
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
  .shadow-\[0_0_10px_0_rgba\(0\,0\,0\,0\.5\)\] {
    --tw-shadow: 0 0 10px 0 var(--tw-shadow-color, rgba(0,0,0,0.5));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .shadow-lg {
    --tw-shadow: 0 10px 15px -3px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 4px 6px -4px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
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
  .ring-border-error {
    --tw-ring-color: var(--seq-color-border-error);
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
  .ring-white\/10 {
    --tw-ring-color: color-mix(in srgb, #fff 10%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-ring-color: color-mix(in oklab, var(--color-white) 10%, transparent);
    }
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
  .outline-none {
    --tw-outline-style: none;
    outline-style: none;
  }
  .select-none {
    -webkit-user-select: none;
    user-select: none;
  }
  .ring-inset {
    --tw-ring-inset: inset;
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
  .selection\:bg-transparent {
    & *::selection {
      background-color: transparent;
    }
    &::selection {
      background-color: transparent;
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
  .before\:to-background-overlay {
    &::before {
      content: var(--tw-content);
      --tw-gradient-to: var(--seq-color-background-overlay);
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
  .after\:block {
    &::after {
      content: var(--tw-content);
      display: block;
    }
  }
  .after\:hidden {
    &::after {
      content: var(--tw-content);
      display: none;
    }
  }
  .after\:h-3 {
    &::after {
      content: var(--tw-content);
      height: calc(var(--spacing) * 3);
    }
  }
  .after\:h-4 {
    &::after {
      content: var(--tw-content);
      height: calc(var(--spacing) * 4);
    }
  }
  .after\:h-\[18px\] {
    &::after {
      content: var(--tw-content);
      height: 18px;
    }
  }
  .after\:h-full {
    &::after {
      content: var(--tw-content);
      height: 100%;
    }
  }
  .after\:w-3 {
    &::after {
      content: var(--tw-content);
      width: calc(var(--spacing) * 3);
    }
  }
  .after\:w-4 {
    &::after {
      content: var(--tw-content);
      width: calc(var(--spacing) * 4);
    }
  }
  .after\:w-\[18px\] {
    &::after {
      content: var(--tw-content);
      width: 18px;
    }
  }
  .after\:w-full {
    &::after {
      content: var(--tw-content);
      width: 100%;
    }
  }
  .after\:rounded-full {
    &::after {
      content: var(--tw-content);
      border-radius: calc(infinity * 1px);
    }
  }
  .after\:bg-current {
    &::after {
      content: var(--tw-content);
      background-color: currentcolor;
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
  .after\:content-\[\"\"\] {
    &::after {
      --tw-content: "";
      content: var(--tw-content);
    }
  }
  .focus-within\:border-transparent {
    &:focus-within {
      border-color: transparent;
    }
  }
  .focus-within\:opacity-100 {
    &:focus-within {
      opacity: 100%;
    }
  }
  .focus-within\:ring-2 {
    &:focus-within {
      --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }
  }
  .focus-within\:ring-border-error {
    &:focus-within {
      --tw-ring-color: var(--seq-color-border-error);
    }
  }
  .focus-within\:ring-border-focus {
    &:focus-within {
      --tw-ring-color: var(--color-border-focus);
    }
  }
  .focus-within\:ring-inset {
    &:focus-within {
      --tw-ring-inset: inset;
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
  .hover\:bg-button-glass {
    &:hover {
      @media (hover: hover) {
        background-color: var(--seq-color-button-glass);
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
  .hover\:opacity-100 {
    &:hover {
      @media (hover: hover) {
        opacity: 100%;
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
  .hover\:ring-border-focus {
    &:hover {
      @media (hover: hover) {
        --tw-ring-color: var(--color-border-focus);
      }
    }
  }
  .focus\:opacity-100 {
    &:focus {
      opacity: 100%;
    }
  }
  .focus\:ring-0 {
    &:focus {
      --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }
  }
  .focus\:ring-2 {
    &:focus {
      --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }
  }
  .focus\:ring-border-error {
    &:focus {
      --tw-ring-color: var(--seq-color-border-error);
    }
  }
  .focus\:ring-border-focus {
    &:focus {
      --tw-ring-color: var(--color-border-focus);
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
  .focus\:outline-none {
    &:focus {
      --tw-outline-style: none;
      outline-style: none;
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
  .focus-visible\:ring-2 {
    &:focus-visible {
      --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }
  }
  .focus-visible\:ring-border-focus {
    &:focus-visible {
      --tw-ring-color: var(--color-border-focus);
    }
  }
  .focus-visible\:outline-hidden {
    &:focus-visible {
      --tw-outline-style: none;
      outline-style: none;
      @media (forced-colors: active) {
        outline: 2px solid transparent;
        outline-offset: 2px;
      }
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
  .disabled\:cursor-default {
    &:disabled {
      cursor: default;
    }
  }
  .disabled\:opacity-50 {
    &:disabled {
      opacity: 50%;
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
  .data-highlighted\:bg-background-contrast {
    &[data-highlighted] {
      background-color: var(--seq-color-background-contrast);
    }
  }
  .data-highlighted\:bg-background-secondary {
    &[data-highlighted] {
      background-color: var(--seq-color-background-secondary);
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
  .data-\[state\=active\]\:text-primary {
    &[data-state="active"] {
      color: var(--seq-color-primary);
    }
  }
  .data-\[state\=checked\]\:translate-x-5 {
    &[data-state="checked"] {
      --tw-translate-x: calc(var(--spacing) * 5);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }
  }
  .data-\[state\=checked\]\:bg-background-control {
    &[data-state="checked"] {
      background-color: var(--seq-color-background-control);
    }
  }
  .data-\[state\=checked\]\:bg-gradient-primary {
    &[data-state="checked"] {
      background-image: var(--seq-color-gradient-primary);
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
  .\[\&\:focus\]\:rounded-\[10px\] {
    &:focus {
      border-radius: 10px;
    }
  }
  .\[\&\:focus\]\:outline-\[3px\] {
    &:focus {
      outline-style: var(--tw-outline-style);
      outline-width: 3px;
    }
  }
  .\[\&\:focus\]\:outline-offset-\[-3px\] {
    &:focus {
      outline-offset: -3px;
    }
  }
  .\[\&\:focus\]\:outline-black {
    &:focus {
      outline-color: var(--color-black);
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
  .\[\&\:has\(\:disabled\)\:hover\]\:cursor-default {
    &:has(:disabled):hover {
      cursor: default;
    }
  }
  .\[\&\:has\(\:disabled\)\:hover\]\:opacity-50 {
    &:has(:disabled):hover {
      opacity: 50%;
    }
  }
  .focus-within\:\[\&\:has\(\:focus-visible\)\]\:ring-2 {
    &:focus-within {
      &:has(:focus-visible) {
        --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
        box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
      }
    }
  }
  .focus-within\:\[\&\:has\(\:focus-visible\)\]\:ring-border-focus {
    &:focus-within {
      &:has(:focus-visible) {
        --tw-ring-color: var(--color-border-focus);
      }
    }
  }
  .\[\&\:has\(div\:nth-child\(4\)\)\>div\]\:col-\[unset\] {
    &:has(div:nth-child(4))>div {
      grid-column: unset;
    }
  }
  .\[\&\>div\]\:justify-center {
    &>div {
      justify-content: center;
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
  .\[\&\>input\]\:pl-5 {
    &>input {
      padding-left: calc(var(--spacing) * 5);
    }
  }
  .\[\&\>input\]\:text-xs {
    &>input {
      font-size: var(--text-xs);
      line-height: var(--tw-leading, var(--text-xs--line-height));
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
  .\[\&\>label\]\:gap-\[2px\] {
    &>label {
      gap: 2px;
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
  .\[\&\>label\>div\>div\>div\]\:h-9 {
    &>label>div>div>div {
      height: calc(var(--spacing) * 9);
    }
  }
  .\[\&\>label\>div\>div\>div\]\:h-13 {
    &>label>div>div>div {
      height: calc(var(--spacing) * 13);
    }
  }
  .\[\&\>label\>div\>div\>div\]\:rounded {
    &>label>div>div>div {
      border-radius: 0.25rem;
    }
  }
  .\[\&\>label\>div\>div\>div\]\:rounded-xl {
    &>label>div>div>div {
      border-radius: var(--radius-xl);
    }
  }
  .\[\&\>label\>div\>div\>div\]\:pr-0 {
    &>label>div>div>div {
      padding-right: calc(var(--spacing) * 0);
    }
  }
  .\[\&\>label\>div\>div\>div\]\:pl-3 {
    &>label>div>div>div {
      padding-left: calc(var(--spacing) * 3);
    }
  }
  .\[\&\>label\>div\>div\>div\]\:text-xs {
    &>label>div>div>div {
      font-size: var(--text-xs);
      line-height: var(--tw-leading, var(--text-xs--line-height));
    }
  }
  .\[\&\>label\>div\>div\>div\:has\(\:disabled\)\]\:opacity-100 {
    &>label>div>div>div:has(:disabled) {
      opacity: 100%;
    }
  }
  .\[\&\>label\>div\>div\>div\:has\(\:disabled\)\:hover\]\:opacity-100 {
    &>label>div>div>div:has(:disabled):hover {
      opacity: 100%;
    }
  }
  .\[\&\>label\>div\>div\>div\>input\]\:text-sm {
    &>label>div>div>div>input {
      font-size: var(--text-sm);
      line-height: var(--tw-leading, var(--text-sm--line-height));
    }
  }
  .\[\&\>label\>div\>div\>div\>input\]\:text-xs {
    &>label>div>div>div>input {
      font-size: var(--text-xs);
      line-height: var(--tw-leading, var(--text-xs--line-height));
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
  .\[\&\>label\>div\>span\]\:text-sm {
    &>label>div>span {
      font-size: var(--text-sm);
      line-height: var(--tw-leading, var(--text-sm--line-height));
    }
  }
  .\[\&\>label\>div\>span\]\:text-text-80 {
    &>label>div>span {
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
}
:root, [data-theme=dark] {
  --seq-color-positive: #1fc266;
  --seq-color-negative: #c2501f;
  --seq-color-info: #0076cc;
  --seq-color-warning: #f4b03e;
  --seq-color-primary: rgba(255, 255, 255, 1);
  --seq-color-secondary: rgba(255, 255, 255, 0.8);
  --seq-color-muted: rgba(255, 255, 255, 0.5);
  --seq-color-inverse: rgba(0, 0, 0, 1);
  --seq-color-background-primary: rgba(0, 0, 0, 1);
  --seq-color-background-secondary: rgba(255, 255, 255, 0.1);
  --seq-color-background-contrast: rgba(0, 0, 0, 0.5);
  --seq-color-background-muted: rgba(255, 255, 255, 0.05);
  --seq-color-background-control: rgba(255, 255, 255, 0.25);
  --seq-color-background-inverse: rgba(255, 255, 255, 1);
  --seq-color-background-backdrop: rgba(34, 34, 34, 0.9);
  --seq-color-background-overlay: rgba(0, 0, 0, 0.7);
  --seq-color-background-raised: rgba(54, 54, 54, 0.7);
  --seq-color-border-normal: rgba(255, 255, 255, 0.25);
  --seq-color-border-focus: rgba(255, 255, 255, 0.5);
  --seq-color-border-error: rgba(255, 69, 0, 1);
  --seq-color-button-glass: rgba(255, 255, 255, 0.15);
  --seq-color-button-emphasis: rgba(0, 0, 0, 0.5);
  --seq-color-button-inverse: rgba(255, 255, 255, 0.8);
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
      var(--seq-color-background-secondary),
      transparent );
}
[data-theme=light] {
  --seq-color-positive: #1fc266;
  --seq-color-negative: #c2501f;
  --seq-color-info: #0076cc;
  --seq-color-warning: #f4b03e;
  --seq-color-primary: rgba(0, 0, 0, 1);
  --seq-color-secondary: rgba(0, 0, 0, 0.8);
  --seq-color-muted: rgba(0, 0, 0, 0.5);
  --seq-color-inverse: rgba(255, 255, 255, 1);
  --seq-color-background-primary: rgba(244, 244, 244, 1);
  --seq-color-background-secondary: rgba(0, 0, 0, 0.1);
  --seq-color-background-contrast: rgba(244, 244, 244, 0.5);
  --seq-color-background-muted: rgba(0, 0, 0, 0.05);
  --seq-color-background-control: rgba(0, 0, 0, 0.25);
  --seq-color-background-inverse: rgba(0, 0, 0, 1);
  --seq-color-background-backdrop: rgba(221, 221, 221, 0.9);
  --seq-color-background-overlay: rgba(244, 244, 244, 0.7);
  --seq-color-background-raised: rgba(192, 192, 192, 0.7);
  --seq-color-border-normal: rgba(0, 0, 0, 0.25);
  --seq-color-border-focus: rgba(0, 0, 0, 0.5);
  --seq-color-border-error: rgba(255, 69, 0, 1);
  --seq-color-button-glass: rgba(0, 0, 0, 0.15);
  --seq-color-button-emphasis: rgba(255, 255, 255, 0.5);
  --seq-color-button-inverse: rgba(0, 0, 0, 0.8);
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
      var(--seq-color-background-secondary),
      transparent );
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
	const { shadowDom, experimentalShadowDomCssOverride } = useConfig();
	return /* @__PURE__ */ jsxs(Fragment, { children: [children, /* @__PURE__ */ jsxs(ShadowRoot, {
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
//#region src/react/ui/components/_internals/action-button/store.ts
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
//#region src/react/ui/components/_internals/action-button/components/ActionButtonBody.tsx
function ActionButtonBody({ tokenId, label, onClick, icon, action }) {
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
	return /* @__PURE__ */ jsx(Button, {
		className: "flex w-full items-center justify-center",
		variant: "primary",
		label,
		onClick: handleClick,
		leftIcon: icon,
		size: "xs",
		shape: "square"
	});
}

//#endregion
//#region src/react/ui/components/_internals/action-button/components/NonOwnerActions.tsx
function NonOwnerActions(props) {
	const { action, tokenId, collectionAddress, chainId, quantityDecimals, quantityRemaining, unlimitedSupply, cardType, hideQuantitySelector } = props;
	const { show: showBuyModal } = useBuyModal();
	const { show: showMakeOfferModal } = useMakeOfferModal();
	if (cardType === "shop") {
		const { salesContractAddress, salePrice } = props;
		return /* @__PURE__ */ jsx(ActionButtonBody, {
			action: CollectibleCardAction.BUY,
			tokenId,
			label: "Buy now",
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
			icon: CartIcon_default
		});
	}
	if (action === CollectibleCardAction.BUY) {
		const { lowestListing } = props;
		if (!lowestListing) throw new Error("lowestListing is required for BUY action and MARKET card type");
		return /* @__PURE__ */ jsx(ActionButtonBody, {
			action: CollectibleCardAction.BUY,
			tokenId,
			label: "Buy now",
			onClick: () => showBuyModal({
				collectionAddress,
				chainId,
				collectibleId: tokenId,
				orderId: lowestListing.orderId,
				marketplace: lowestListing.marketplace,
				cardType: "market",
				hideQuantitySelector
			}),
			icon: CartIcon_default
		});
	}
	if (action === CollectibleCardAction.OFFER) {
		const { orderbookKind } = props;
		return /* @__PURE__ */ jsx(ActionButtonBody, {
			action: CollectibleCardAction.OFFER,
			tokenId,
			label: "Make an offer",
			onClick: () => showMakeOfferModal({
				collectionAddress,
				chainId,
				collectibleId: tokenId,
				orderbookKind
			})
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
//#region src/react/ui/components/_internals/action-button/components/OwnerActions.tsx
function OwnerActions({ action, tokenId, collectionAddress, chainId, orderbookKind, highestOffer }) {
	const { show: showCreateListingModal } = useCreateListingModal();
	const { show: showSellModal } = useSellModal();
	const { show: showTransferModal } = useTransferModal();
	if (action === CollectibleCardAction.LIST) return /* @__PURE__ */ jsx(ActionButtonBody, {
		label: "Create listing",
		tokenId,
		onClick: () => showCreateListingModal({
			collectionAddress,
			chainId,
			collectibleId: tokenId,
			orderbookKind
		})
	});
	if (action === CollectibleCardAction.SELL && highestOffer) return /* @__PURE__ */ jsx(ActionButtonBody, {
		tokenId,
		label: "Sell",
		onClick: () => showSellModal({
			collectionAddress,
			chainId,
			tokenId,
			order: highestOffer
		})
	});
	if (action === CollectibleCardAction.TRANSFER) return /* @__PURE__ */ jsx(ActionButtonBody, {
		label: "Transfer",
		tokenId,
		onClick: () => showTransferModal({
			collectionAddress,
			chainId,
			collectibleId: tokenId
		})
	});
	return null;
}

//#endregion
//#region src/react/ui/components/_internals/action-button/hooks/useActionButtonLogic.ts
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
//#region src/react/ui/components/_internals/action-button/ActionButton.tsx
function ActionButton({ collectionAddress, chainId, tokenId, orderbookKind, action, owned, highestOffer, lowestListing, onCannotPerformAction, cardType, salesContractAddress, prioritizeOwnerActions, salePrice, quantityDecimals, quantityRemaining, unlimitedSupply, hideQuantitySelector }) {
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
		highestOffer
	});
	return /* @__PURE__ */ jsx(NonOwnerActions, { ...cardType === "shop" && salesContractAddress && salePrice ? {
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
		hideQuantitySelector
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
		hideQuantitySelector
	} });
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/components/ActionButtonWrapper.tsx
function ActionButtonWrapper({ show, chainId, collectionAddress, tokenId, orderbookKind, action, highestOffer, lowestListing, owned, onCannotPerformAction, cardType, salesContractAddress, prioritizeOwnerActions, salePrice, quantityDecimals, quantityRemaining, unlimitedSupply, hideQuantitySelector }) {
	if (!show) return null;
	return /* @__PURE__ */ jsx("div", {
		className: "-bottom-16 absolute flex w-full origin-bottom items-center justify-center bg-overlay-light p-2 backdrop-blur transition-transform duration-200 ease-in-out group-hover:translate-y-[-64px]",
		children: /* @__PURE__ */ jsx(ActionButton, {
			chainId,
			collectionAddress,
			tokenId,
			orderbookKind,
			action,
			highestOffer,
			lowestListing,
			owned,
			onCannotPerformAction,
			cardType,
			salesContractAddress,
			prioritizeOwnerActions,
			salePrice,
			quantityDecimals,
			quantityRemaining,
			unlimitedSupply,
			hideQuantitySelector
		})
	});
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/CollectibleCardSkeleton.tsx
function MarketplaceCollectibleCardSkeleton({ contractType, isShop }) {
	return /* @__PURE__ */ jsxs("div", {
		"data-testid": "collectible-card-skeleton",
		className: "w-card-width overflow-hidden rounded-xl border border-border-base focus-visible:border-border-focus focus-visible:shadow-none focus-visible:outline-focus active:border-border-focus active:shadow-none",
		children: [/* @__PURE__ */ jsx("div", {
			className: "relative aspect-square overflow-hidden bg-background-secondary",
			children: /* @__PURE__ */ jsx(Skeleton, {
				size: "lg",
				className: "absolute inset-0 h-full w-full animate-shimmer",
				style: { borderRadius: 0 }
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "mt-2 flex flex-col gap-2 px-4 pb-4",
			children: [
				/* @__PURE__ */ jsx(Skeleton, {
					size: "lg",
					className: "animate-shimmer"
				}),
				/* @__PURE__ */ jsx(Skeleton, {
					size: "sm",
					className: "h-5 w-16 animate-shimmer"
				}),
				isShop && contractType === ContractType.ERC1155 && /* @__PURE__ */ jsx(Skeleton, {
					size: "lg",
					className: "h-6 w-20 animate-shimmer"
				})
			]
		})]
	});
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/components/BaseCard.tsx
function BaseCard({ name, image, video, animationUrl, onClick, onKeyDown, assetSrcPrefixUrl, children, mediaClassName, cardLoading, contractType, isShop }) {
	if (cardLoading) return /* @__PURE__ */ jsx(MarketplaceCollectibleCardSkeleton, {
		contractType,
		isShop
	});
	return /* @__PURE__ */ jsx("div", {
		"data-testid": "collectible-card",
		className: "w-card-width min-w-card-min-width overflow-hidden rounded-xl border border-border-base bg-background-primary focus-visible:border-border-focus focus-visible:shadow-focus-ring focus-visible:outline-focus active:border-border-focus active:shadow-active-ring",
		onClick,
		onKeyDown,
		role: onClick ? "button" : void 0,
		tabIndex: onClick ? 0 : void 0,
		children: /* @__PURE__ */ jsx("div", {
			className: "group relative z-10 flex h-full w-full cursor-pointer flex-col items-start overflow-hidden rounded-xl border-none bg-none p-0 focus:outline-none [&:focus]:rounded-[10px] [&:focus]:outline-[3px] [&:focus]:outline-black [&:focus]:outline-offset-[-3px]",
			children: /* @__PURE__ */ jsxs("article", {
				className: "w-full rounded-xl",
				children: [/* @__PURE__ */ jsx(Media, {
					name: name || "",
					assets: [
						image,
						video,
						animationUrl
					],
					assetSrcPrefixUrl,
					mediaClassname: cn("object-contain", mediaClassName)
				}), children]
			})
		})
	});
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/components/footer/Footer.tsx
const Footer = ({ chainId, name, type, decimals, onOfferClick, highestOffer, lowestListing, balance, quantityInitial, quantityRemaining, unlimitedSupply, cardType, salePriceAmount, salePriceCurrency }) => {
	const isShop = cardType === "shop";
	const isMarket = cardType === "market";
	const isInventoryNonTradable = cardType === "inventory-non-tradable";
	const { data: currency, isLoading: isCurrencyLoading } = useCurrency({
		chainId,
		currencyAddress: lowestListing?.priceCurrencyAddress,
		query: { enabled: isMarket && !!lowestListing?.priceCurrencyAddress }
	});
	const listed = !!lowestListing?.priceAmount && !!lowestListing?.priceCurrencyAddress;
	const isPriceLoading = isMarket && !!lowestListing?.priceCurrencyAddress && isCurrencyLoading;
	return /* @__PURE__ */ jsxs("div", {
		className: "relative flex flex-col items-start gap-2 whitespace-nowrap bg-background-primary p-4",
		children: [
			/* @__PURE__ */ jsx(FooterName, {
				name,
				isShop,
				highestOffer,
				onOfferClick,
				quantityInitial,
				quantityRemaining,
				balance
			}),
			/* @__PURE__ */ jsxs("div", {
				className: cn$1("flex items-center gap-1", isShop && type === ContractType.ERC721 && "hidden"),
				children: [
					isPriceLoading && /* @__PURE__ */ jsx(Skeleton, {
						size: "sm",
						className: "h-5 w-20 animate-shimmer"
					}),
					!isPriceLoading && listed && isMarket && lowestListing && currency && /* @__PURE__ */ jsx(PriceDisplay, {
						amount: lowestListing.priceAmount,
						currency,
						className: "text-text-100"
					}),
					!isPriceLoading && !listed && isMarket && /* @__PURE__ */ jsx(Text, {
						className: "text-left font-body font-bold text-sm text-text-50",
						children: "Not listed yet"
					}),
					isShop && salePriceAmount && salePriceCurrency && type === ContractType.ERC1155 && /* @__PURE__ */ jsx(PriceDisplay, {
						amount: salePriceAmount,
						currency: salePriceCurrency,
						className: "text-text-100"
					})
				]
			}),
			isShop && /* @__PURE__ */ jsx(SaleDetailsPill, {
				quantityRemaining,
				collectionType: type,
				unlimitedSupply
			}),
			isShop && !salePriceAmount && /* @__PURE__ */ jsx("div", { className: "h-5 w-full" }),
			(isMarket || isInventoryNonTradable) && /* @__PURE__ */ jsx(TokenTypeBalancePill, {
				balance,
				type,
				decimals
			})
		]
	});
};
const NonTradableInventoryFooter = ({ name, balance, decimals, type }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: "relative flex flex-col items-start gap-2 whitespace-nowrap bg-background-primary p-4",
		children: [
			/* @__PURE__ */ jsx(FooterName, { name }),
			/* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-1",
				children: /* @__PURE__ */ jsx(Text, {
					className: "text-left font-body font-bold text-sm text-text-50",
					children: "Not listed yet"
				})
			}),
			/* @__PURE__ */ jsx(TokenTypeBalancePill, {
				balance,
				type,
				decimals
			})
		]
	});
};

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/variants/MarketCard.tsx
function MarketCard({ collectibleId, chainId, collectionAddress, collectionType, assetSrcPrefixUrl, cardLoading, orderbookKind, collectible, onCollectibleClick, onOfferClick, balance, balanceIsLoading = false, onCannotPerformAction, prioritizeOwnerActions, hideQuantitySelector }) {
	const collectibleMetadata = collectible?.metadata;
	const highestOffer = collectible?.offer;
	const lowestListing = collectible?.listing;
	if (!collectibleMetadata) {
		console.error("Collectible metadata is undefined");
		return null;
	}
	const showActionButton = !balanceIsLoading && (!!highestOffer || !!collectible);
	const action = balance ? highestOffer && CollectibleCardAction.SELL || !collectible?.listing && CollectibleCardAction.LIST || CollectibleCardAction.TRANSFER : collectible?.listing && CollectibleCardAction.BUY || CollectibleCardAction.OFFER;
	const handleKeyDown = (e) => {
		if (e.key === "Enter" || e.key === " ") onCollectibleClick?.(collectibleId);
	};
	return /* @__PURE__ */ jsxs(BaseCard, {
		collectibleId,
		chainId,
		collectionAddress,
		collectionType,
		assetSrcPrefixUrl,
		cardLoading,
		cardType: "market",
		name: collectibleMetadata.name || "",
		image: collectibleMetadata.image,
		video: collectibleMetadata.video,
		animationUrl: collectibleMetadata.animation_url,
		contractType: collectionType,
		isShop: false,
		onClick: () => onCollectibleClick?.(collectibleId),
		onKeyDown: handleKeyDown,
		hideQuantitySelector,
		children: [/* @__PURE__ */ jsx(Footer, {
			chainId,
			name: collectibleMetadata.name || "",
			type: collectionType,
			onOfferClick: (e) => onOfferClick?.({
				order: highestOffer,
				e
			}),
			highestOffer,
			lowestListing,
			balance,
			decimals: collectibleMetadata.decimals,
			quantityInitial: highestOffer?.quantityInitial !== void 0 ? highestOffer.quantityInitial : collectible?.listing?.quantityInitial !== void 0 ? collectible.listing.quantityInitial : void 0,
			quantityRemaining: highestOffer?.quantityRemaining !== void 0 ? highestOffer.quantityRemaining : collectible?.listing?.quantityRemaining !== void 0 ? collectible.listing.quantityRemaining : void 0,
			cardType: "market"
		}), /* @__PURE__ */ jsx(ActionButtonWrapper, {
			show: showActionButton ?? false,
			chainId,
			collectionAddress,
			tokenId: collectibleId,
			orderbookKind,
			action,
			highestOffer,
			lowestListing: collectible?.listing,
			owned: !!balance,
			onCannotPerformAction,
			cardType: "market",
			prioritizeOwnerActions,
			hideQuantitySelector
		})]
	});
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/variants/NonTradableInventoryCard.tsx
function NonTradableInventoryCard({ collectibleId, chainId, collectionAddress, collectionType, assetSrcPrefixUrl, cardLoading, balance, balanceIsLoading, collectibleMetadata }) {
	return /* @__PURE__ */ jsx(BaseCard, {
		collectibleId,
		image: collectibleMetadata.image,
		video: collectibleMetadata.video,
		animationUrl: collectibleMetadata.animation_url,
		chainId,
		collectionAddress,
		collectionType,
		assetSrcPrefixUrl,
		cardLoading: cardLoading || balanceIsLoading,
		contractType: collectionType,
		isShop: false,
		name: collectibleMetadata.name,
		children: /* @__PURE__ */ jsx(NonTradableInventoryFooter, {
			name: collectibleMetadata.name || "",
			type: collectionType,
			balance,
			decimals: collectibleMetadata.decimals
		})
	});
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/variants/ShopCard.tsx
function ShopCard({ collectibleId, chainId, collectionAddress, collectionType, assetSrcPrefixUrl, cardLoading, cardType, salesContractAddress, tokenMetadata, salePrice, quantityDecimals, quantityInitial, quantityRemaining, unlimitedSupply, hideQuantitySelector }) {
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
	const showActionButton = salesContractAddress && collectionType === ContractType.ERC1155 && (unlimitedSupply || quantityRemaining !== void 0 && Number(quantityRemaining) > 0);
	const action = CollectibleCardAction.BUY;
	const mediaClassName = unlimitedSupply ? "opacity-100" : quantityRemaining === "0" || quantityRemaining === void 0 ? "opacity-50" : "opacity-100";
	return /* @__PURE__ */ jsxs(BaseCard, {
		collectibleId,
		chainId,
		collectionAddress,
		collectionType,
		assetSrcPrefixUrl,
		cardLoading: cardLoading || saleCurrencyLoading,
		cardType,
		name: tokenMetadata.name || "",
		image: tokenMetadata.image,
		video: tokenMetadata.video,
		animationUrl: tokenMetadata.animation_url,
		mediaClassName,
		contractType: collectionType,
		isShop: true,
		hideQuantitySelector,
		children: [/* @__PURE__ */ jsx(Footer, {
			chainId,
			name: tokenMetadata.name || "",
			type: collectionType,
			decimals: tokenMetadata.decimals,
			quantityInitial,
			quantityRemaining,
			unlimitedSupply,
			cardType,
			salePriceAmount: salePrice?.amount,
			salePriceCurrency: saleCurrency
		}), /* @__PURE__ */ jsx(ActionButtonWrapper, {
			show: showActionButton,
			chainId,
			collectionAddress,
			tokenId: collectibleId,
			action,
			owned: false,
			cardType,
			salesContractAddress,
			salePrice,
			quantityDecimals,
			quantityRemaining: quantityRemaining !== void 0 ? Number(quantityRemaining) : void 0,
			unlimitedSupply
		})]
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
export { useCountOfPrimarySaleItems as $, useCancelOrder as A, useMarketplaceConfig as At, useMarketTransactionSteps as B, useOrderSteps as C, useCollection as Ct, useGenerateOfferTransaction as D, useCountOfCollectables as Dt, generateOfferTransaction as E, useListCollectibleActivities as Et, useEnsureCorrectChain as F, MarketplaceSdkContext as Ft, useList721ShopCardData as G, usePrimarySaleItem as H, useAutoSelectFeeOption as I, DatabeatAnalytics as It, useListTokenMetadata as J, useSearchTokenMetadata as K, useBuyTransaction as L, useAnalytics as Lt, useProcessStep as M, useConfig as Mt, generateCancelTransaction as N, MarketplaceProvider as Nt, generateListingTransaction as O, useCollectible as Ot, useGenerateCancelTransaction as P, MarketplaceQueryClientProvider as Pt, useErc721SaleDetails as Q, useTransactionType$1 as R, useTransactionExecution as S, useCollectionActiveListingsCurrencies as St, useGenerateSellTransaction as T, useListCollectibles as Tt, useListPrimarySaleItems as U, useInventory as V, useList1155ShopCardData as W, useGetTokenRanges as X, useListBalances as Y, useGetCountOfPrimarySaleItems as Z, useOpenConnectModal$1 as _, collectionDetailsPollingOptions as _t, useMakeOfferModal as a, useHighestOffer as at, useFilterState as b, useCollectionBalanceDetails as bt, useSuccessfulPurchaseModal as c, useCountOffersForCollectible as ct, useBuyModal as d, useMarketCurrencies as dt, useLowestListing as et, useRoyalty as f, useListMarketCardData as ft, useCheckoutOptionsSalesContract as g, useListCollectionActivities as gt, useComparePrices as h, useListCollections as ht, useCreateListingModal as i, useListItemsOrdersForCollection as it, useCancelTransactionSteps as j, useConnectorMetadata as jt, useGenerateListingTransaction as k, useBalanceOfCollectible as kt, ActionModal as l, useCountListingsForCollectible as lt, useConvertPriceToUSD as m, useCurrency as mt, Footer as n, useListListingsForCollectible as nt, ModalProvider as o, useGetCountOfFilteredOrders as ot, useGetReceiptFromHash as p, useSellModal as pt, useTokenSupplies as q, NonTradableInventoryFooter as r, useListItemsOrdersForCollectionPaginated as rt, useTransferModal as s, useFloorOrder as st, CollectibleCard as t, useListOffersForCollectible as tt, Media as u, useCountItemsOrdersForCollection as ut, useFilters as v, useCollectionDetailsPolling as vt, generateSellTransaction as w, useListCollectiblesPaginated as wt, useTransferTokens as x, useCollectionActiveOffersCurrencies as xt, useFiltersProgressive as y, useCollectionDetails as yt, usePrimarySaleTransactionSteps as z };
//# sourceMappingURL=react.js.map