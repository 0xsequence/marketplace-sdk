'use client'

import { n as SEQUENCE_MARKET_V1_ADDRESS, r as SEQUENCE_MARKET_V2_ADDRESS, t as DEFAULT_MARKETPLACE_FEE_PERCENTAGE } from "./consts.js";
import { S as WalletKind, c as CollectionStatus, d as MarketplaceKind, f as MetadataStatus, g as OrderbookKind, m as OrderSide, p as OfferType, s as isTransactionStep, t as ContractType$1, u as ExecuteType, y as StepType } from "./dist.js";
import { a as TransactionSignatureError, i as TransactionExecutionError$1, o as UserRejectedRequestError$1, r as NoWalletConnectedError, s as BaseError$1, t as ChainSwitchError } from "./transaction.js";
import { i as TransactionType$2, t as CollectibleCardAction } from "./types.js";
import { n as SequenceMarketplaceV1_ABI, r as EIP2981_ABI } from "./marketplace.js";
import { i as ERC721_SALE_ABI_V0, r as ERC721_SALE_ABI_V1 } from "./primary-sale.js";
import { i as ERC20_ABI, n as ERC1155_ABI, r as ERC721_ABI } from "./token.js";
import { a as formatPriceWithFee, c as findMarketCollection, i as formatPrice, l as cn$1, o as validateOpenseaOfferDecimals, r as calculateTotalOfferCost, t as calculateEarningsAfterFees, u as compareAddress } from "./utils.js";
import { n as getPresentableChainName } from "./network.js";
import { c as getSequenceNodeGatewayUrl, g as getQueryClient, l as getTrailsApiUrl, n as getIndexerClient, o as getSequenceApiUrl, r as getMarketplaceClient, s as getSequenceIndexerUrl } from "./api.js";
import { a as PROVIDER_ID, r as buildQueryOptions, t as TransactionType$1 } from "./_internal.js";
import { r as primarySaleCheckoutOptionsQueryOptions } from "./checkout.js";
import { r as tokenBalancesOptions } from "./token-balances.js";
import { A as listCollectiblesPaginatedQueryOptions, D as listListingsForCollectibleQueryOptions, L as highestOfferQueryOptions, N as listCollectiblesQueryOptions, P as normalizePriceFilters, R as countOfCollectablesQueryOptions, S as countListingsForCollectibleQueryOptions, V as balanceOfCollectibleOptions, l as primarySaleItemQueryOptions, o as primarySaleItemsQueryOptions, p as countOffersForCollectibleQueryOptions, r as primarySaleItemsCountQueryOptions, u as collectibleQueryOptions, v as listOffersForCollectibleQueryOptions, x as lowestListingQueryOptions } from "./collectible.js";
import { n as SalesContractVersion, r as useSalesContractABI } from "./contracts.js";
import { n as marketplaceConfigOptions } from "./config.js";
import { E as collectionBalanceDetailsQueryOptions, T as listCollectionsQueryOptions, f as listItemsOrdersForCollectionQueryOptions, k as createCollectionQueryKey, m as floorOrderQueryOptions, o as listItemsOrdersForCollectionPaginatedQueryOptions, s as countItemsOrdersForCollectionQueryOptions, t as collectionQueryOptions, v as getCountOfFilteredOrdersQueryOptions, y as collectionMarketDetailQueryOptions } from "./collection.js";
import { f as marketCurrenciesQueryOptions, i as comparePricesQueryOptions, s as convertPriceToUSDQueryOptions, t as currencyQueryOptions } from "./currency.js";
import { r as inventoryOptions } from "./inventory.js";
import { f as listTokenMetadataQueryOptions, h as listBalancesOptions, l as searchTokenMetadataQueryOptions, o as tokenSuppliesQueryOptions, r as getTokenRangesQueryOptions } from "./token2.js";
import { t as waitForTransactionReceipt } from "./utils2.js";
import { a as MODAL_OVERLAY_PROPS, i as MODAL_CONTENT_PROPS, n as useSwitchChainErrorModal, r as useChainIdToSwitchTo, t as switchChainErrorModal_default } from "./switchChainErrorModal.js";
import { n as TransactionFooter } from "./transaction-footer.js";
import { f as determineCardAction, h as chess_tile_default, n as CARD_TITLE_MAX_LENGTH_DEFAULT, o as getShopCardState, p as Media, r as CARD_TITLE_MAX_LENGTH_WITH_OFFER, s as renderSkeletonIfLoading, t as Card } from "./Card.js";
import { t as TimeAgo } from "./timeAgo.js";
import { t as useCollectibleApproval } from "./hooks.js";
import { t as TransactionHeader } from "./transactionHeader.js";
import { t as useFilterState } from "./url-state.js";
import { n as filtersQueryOptions } from "./marketplace2.js";
import { t as QuantityInput } from "./quantityInput.js";
import { n as expirationDateSelect_default } from "./expirationDateSelect.js";
import { t as currencyImage_default } from "./currencyImage.js";
import { t as useERC20Allowance } from "./hooks2.js";
import { ContractVerificationStatus } from "@0xsequence/indexer";
import { ChainNotConfiguredError, ConnectorAccountNotFoundError, ConnectorAlreadyConnectedError, ConnectorChainMismatchError, ConnectorNotFoundError, ConnectorUnavailableReconnectingError, ProviderNotFoundError, SwitchChainNotSupportedError, WagmiProviderNotFoundError, useAccount, useBalance, useChainId, useConnections, usePublicClient, useReadContract, useReadContracts, useSendTransaction, useSignMessage, useSignTypedData, useSwitchChain, useWalletClient, useWriteContract } from "wagmi";
import { sendTransactions, useChain, useOpenConnectModal, useWaasFeeOptions } from "@0xsequence/connect";
import { Component, createContext, forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button, CartIcon, CheckmarkIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, CloseIcon, Dialog, DialogContent, DialogOverlay, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuPortal, DropdownMenuTrigger, Field, FieldLabel, Image, InfoIcon, Modal, NetworkImage, NumericInput, Select, Separator, Skeleton, Spinner, Text, TextInput, ThemeProvider, TokenImage, Tooltip, WarningIcon, cn } from "@0xsequence/design-system";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { greaterThan, toNumber } from "dnum";
import { BaseError, ChainMismatchError, ChainNotFoundError, ContractFunctionExecutionError, ContractFunctionRevertedError, ContractFunctionZeroDataError, FeeCapTooHighError, FeeCapTooLowError, HttpRequestError, InsufficientFundsError, IntrinsicGasTooHighError, IntrinsicGasTooLowError, InvalidAddressError, InvalidHexValueError, LimitExceededRpcError, NonceTooLowError, SwitchChainError, TimeoutError, TransactionExecutionError, TransactionReceiptNotFoundError, UserRejectedRequestError, WaitForTransactionReceiptTimeoutError, decodeFunctionData, encodeFunctionData, erc20Abi, erc721Abi, formatUnits, isAddress, isHex, maxUint256, parseEventLogs, parseUnits, zeroAddress } from "viem";
import { QueryClientProvider, queryOptions, skipToken, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Databeat } from "@databeat/tracker";
import { createStore } from "@xstate/store";
import { useSelector } from "@xstate/store/react";
import { avalanche, optimism } from "viem/chains";
import { readContract } from "viem/actions";
import { SequenceCheckoutProvider, useSelectPaymentModal } from "@0xsequence/checkout";
import { TrailsWidget } from "0xtrails/widget";
import { useSupportedChains } from "0xtrails";
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
	const context = useContext(MarketplaceSdkContext);
	if (!context) throw new Error("useAnalytics must be used within MarketplaceProvider");
	return context.analytics;
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
		defaultTheme: theme,
		root,
		children
	});
	return children;
};

//#endregion
//#region src/react/providers/index.tsx
const MarketplaceSdkContext = createContext(void 0);
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
	return useQuery({ ...primarySaleCheckoutOptionsQueryOptions(params === skipToken || !address ? {
		config: defaultConfig,
		walletAddress: address ?? zeroAddress,
		chainId: 0,
		contractAddress: zeroAddress,
		collectionAddress: zeroAddress,
		items: [],
		query: { enabled: false }
	} : {
		...params,
		config: params.config ?? defaultConfig,
		walletAddress: address
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
*   tokenId: 1n,
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
	return useQuery(balanceOfCollectibleOptions({
		...args,
		config
	}));
}

//#endregion
//#region src/react/hooks/collectible/erc721-sale-details.tsx
function useErc721SaleDetails({ chainId, salesContractAddress, itemsContractAddress, enabled = true }) {
	const { version, isLoading: versionLoading, error: versionError } = useSalesContractABI({
		contractAddress: salesContractAddress,
		contractType: ContractType$1.ERC721,
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
	const { config = defaultConfig, ...rest } = params;
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
	const { config = defaultConfig, ...rest } = params;
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
	const { config = defaultConfig, ...rest } = params;
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
	const { config = defaultConfig, ...rest } = params;
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
* @param params.tokenId - The specific token ID to fetch listings for
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
*   tokenId: 123n
* })
* ```
*
* @example
* With pagination:
* ```typescript
* const { data } = useCollectibleMarketListings({
*   chainId: 1,
*   collectionAddress: '0x...',
*   tokenId: 456n,
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
*   tokenId: 789n,
*   filter: {
*     marketplace: [MarketplaceKind.sequence_marketplace_v2],
*     currencies: ['0x...'] // Specific currency addresses
*   }
* })
* ```
*/
function useCollectibleMarketListings(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
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
* @param params.tokenId - The specific collectible/token ID
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
*   tokenId: '123'
* })
* ```
*
* @example
* With filter:
* ```typescript
* const { data: filteredCount } = useCollectibleMarketListingsCount({
*   chainId: 137,
*   collectionAddress: '0x...',
*   tokenId: '123',
*   filter: { priceRange: { min: '1000000000000000000' } }
* })
* ```
*/
function useCollectibleMarketListingsCount(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
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
	const { config = defaultConfig, ...rest } = params;
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
* @param params.tokenId - The specific token ID to fetch offers for
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
*   tokenId: 1n
* })
* ```
*
* @example
* With filtering:
* ```typescript
* const { data } = useCollectibleMarketOffers({
*   chainId: 1,
*   collectionAddress: '0x...',
*   tokenId: 1n,
*   filter: {
*     marketplace: [MarketplaceKind.sequence_marketplace_v2]
*   }
* })
* ```
*/
function useCollectibleMarketOffers(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
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
* @param params.tokenId - The specific collectible/token ID
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
*   tokenId: '123'
* })
* ```
*
* @example
* With filter:
* ```typescript
* const { data: filteredCount } = useCollectibleMarketOffersCount({
*   chainId: 137,
*   collectionAddress: '0x...',
*   tokenId: '123',
*   filter: { priceRange: { min: '1000000000000000000' } }
* })
* ```
*/
function useCollectibleMarketOffersCount(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
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
* @param params.contractAddress - The collection contract address
* @param params.tokenId - The token ID of the collectible
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the collectible metadata
*
* @example
* Basic usage:
* ```typescript
* const { data: collectible, isLoading } = useCollectibleMetadata({
*   chainId: 137,
*   contractAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
*   tokenId: '12345'
* })
* ```
*
* @example
* With custom query options:
* ```typescript
* const { data } = useCollectibleMetadata({
*   chainId: 137,
*   contractAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
*   tokenId: '12345',
*   query: {
*     enabled: Boolean(contractAddress && tokenId),
*     staleTime: 30_000
*   }
* })
* ```
*/
function useCollectibleMetadata(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...collectibleQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/collectible/primary-sale-item.tsx
/**
* Hook to fetch a single primary sale item
*
* Retrieves details for a specific primary sale item from a primary sale contract.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (number)
* @param params.primarySaleContractAddress - The primary sale contract address
* @param params.tokenId - The token ID of the primary sale item (string or bigint)
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
	const { config = defaultConfig, ...rest } = params;
	return useInfiniteQuery(primarySaleItemsQueryOptions({
		config,
		...rest
	}));
}

//#endregion
//#region src/react/hooks/collectible/primary-sale-items-count.tsx
function usePrimarySaleItemsCount(args) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = args;
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
	return useQuery(tokenBalancesOptions({
		...args,
		config
	}));
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
	const { config = defaultConfig, ...rest } = params;
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
	const { config = defaultConfig, marketplaceConfig: paramMarketplaceConfig, ...rest } = params;
	return useQuery({ ...listCollectionsQueryOptions({
		config,
		marketplaceConfig: paramMarketplaceConfig || marketplaceConfig,
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
	const { config = defaultConfig, ...rest } = params;
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
	const { config = defaultConfig, ...rest } = params;
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
	const { config = defaultConfig, ...rest } = params;
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
	const { config = defaultConfig, ...rest } = params;
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
	const { config = defaultConfig, ...rest } = params;
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
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...collectionQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/queries/collection/activeListingsCurrencies.ts
/**
* Fetches the active listings currencies for a collection from the marketplace API
*/
async function fetchCollectionActiveListingsCurrencies(params) {
	const { collectionAddress, chainId, config } = params;
	return (await getMarketplaceClient(config).getCollectionActiveListingsCurrencies({
		contractAddress: collectionAddress,
		chainId: String(chainId)
	})).currencies;
}
function getCollectionActiveListingsCurrenciesQueryKey(params) {
	return createCollectionQueryKey("active-listings-currencies", {
		chainId: params.chainId,
		contractAddress: params.collectionAddress
	});
}
function collectionActiveListingsCurrenciesQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getCollectionActiveListingsCurrenciesQueryKey,
		requiredParams: [
			"chainId",
			"collectionAddress",
			"config"
		],
		fetcher: fetchCollectionActiveListingsCurrencies,
		customValidation: (p) => !!p.collectionAddress && isAddress(p.collectionAddress)
	}, params);
}

//#endregion
//#region src/react/hooks/collection/useCollectionActiveListingsCurrencies.tsx
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
//#region src/react/queries/collection/activeOffersCurrencies.ts
/**
* Fetches the active offers currencies for a collection from the marketplace API
*/
async function fetchCollectionActiveOffersCurrencies(params) {
	const { collectionAddress, chainId, config } = params;
	return (await getMarketplaceClient(config).getCollectionActiveOffersCurrencies({
		contractAddress: collectionAddress,
		chainId: String(chainId)
	})).currencies;
}
function getCollectionActiveOffersCurrenciesQueryKey(params) {
	return createCollectionQueryKey("active-offers-currencies", {
		chainId: params.chainId,
		contractAddress: params.collectionAddress
	});
}
function collectionActiveOffersCurrenciesQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getCollectionActiveOffersCurrenciesQueryKey,
		requiredParams: [
			"chainId",
			"collectionAddress",
			"config"
		],
		fetcher: fetchCollectionActiveOffersCurrencies,
		customValidation: (p) => !!p.collectionAddress && isAddress(p.collectionAddress)
	}, params);
}

//#endregion
//#region src/react/hooks/collection/useCollectionActiveOffersCurrencies.tsx
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
	const { config = defaultConfig, ...rest } = params;
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
	const { config = defaultConfig, ...rest } = params;
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
	const { config = defaultConfig, ...rest } = params;
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
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...marketCurrenciesQueryOptions({
		config,
		...rest
	}) });
}

//#endregion
//#region src/react/hooks/inventory/inventory.tsx
function useInventory(args) {
	const config = useConfig();
	return useQuery(inventoryOptions({
		...args,
		config
	}));
}

//#endregion
//#region src/react/hooks/token/balances.tsx
/**
* Hook to fetch a list of token balances with pagination support
*
* Fetches token balances for a specific account with support for filtering by
* contract and token ID, metadata inclusion, and infinite pagination.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.accountAddress - The account address to fetch balances for (required)
* @param params.contractAddress - The contract address to filter balances (optional)
* @param params.tokenId - Optional token ID to filter balances
* @param params.includeMetadata - Whether to include token metadata
* @param params.query - Optional React Query configuration
*
* @returns Infinite query result containing the balances data
*
* @example
* Basic usage without contract filter:
* ```tsx
* const { data, isLoading, error, fetchNextPage } = useTokenBalances({
*   chainId: 1,
*   accountAddress: '0x123...'
* });
* ```
*
* @example
* With contract filter and metadata:
* ```tsx
* const { data, isLoading, fetchNextPage } = useTokenBalances({
*   chainId: 137,
*   accountAddress: '0x123...',
*   contractAddress: '0x456...',
*   includeMetadata: true,
*   query: {
*     enabled: true,
*     refetchInterval: 10000,
*   }
* });
* ```
*/
function useTokenBalances(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;
	return useInfiniteQuery(listBalancesOptions({
		config,
		...rest
	}));
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
	const { config = defaultConfig, ...rest } = params;
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
	const { config = defaultConfig, onlyMinted, ...rest } = params;
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
	const mintedTokenIds = new Set(suppliesData?.pages.flatMap((page) => page.supplies)?.filter((supply) => supply.supply > 0n).map((supply) => supply.tokenId) ?? []);
	const filteredTokenMetadata = result.data?.pages.flatMap((page) => page.tokenMetadata).filter((metadata) => mintedTokenIds.has(BigInt(metadata.tokenId)));
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
*   console.log(`Token ranges: ${JSON.stringify(data.ranges)}`);
*   data.ranges?.forEach(range => {
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
	const { config = defaultConfig, ...rest } = params;
	return useQuery({ ...getTokenRangesQueryOptions({
		config,
		...rest
	}) });
}

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
const initialContext$6 = {
	pendingConfirmation: void 0,
	deferred: void 0
};
const waasFeeOptionsStore = createStore({
	context: initialContext$6,
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
		clear: () => initialContext$6
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
	const pendingFeeOptionConfirmation = usePendingConfirmation();
	const indexerClient = chainId > 0 ? getIndexerClient(chainId, config) : null;
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
		if (!waasConnector || !indexerClient) return;
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
//#region src/react/ui/modals/_internal/types/steps.ts
function isTransactionStep$1(step) {
	return typeof step === "object" && step !== null && "execute" in step && "result" in step;
}
function isApprovalStep(step) {
	return isTransactionStep$1(step) && "reset" in step && typeof step.reset === "function";
}
function isFeeStep(step) {
	return typeof step === "object" && step !== null && "isSponsored" in step && "show" in step && "cancel" in step;
}
function isFormStep(step) {
	return typeof step === "object" && step !== null && "isValid" in step && "errors" in step;
}

//#endregion
//#region src/react/ui/modals/_internal/helpers/flow-state.ts
function getStepEntries(steps) {
	const entries = [];
	if (steps.form) entries.push({
		name: "form",
		step: steps.form
	});
	if (steps.fee) entries.push({
		name: "fee",
		step: steps.fee
	});
	if (steps.approval) entries.push({
		name: "approval",
		step: steps.approval
	});
	const finalStepKey = Object.keys(steps).find((key) => key !== "form" && key !== "fee" && key !== "approval");
	if (finalStepKey) {
		const finalStep = steps[finalStepKey];
		if (finalStep) entries.push({
			name: finalStepKey,
			step: finalStep
		});
	}
	return entries;
}
function getStepStatus(step) {
	if (isFormStep(step)) return step.status === "success" ? "success" : "idle";
	if (isFeeStep(step)) {
		if (step.status === "success") return "success";
		if (step.status === "selecting") return "pending";
		return "idle";
	}
	if (isTransactionStep$1(step)) return step.status;
	return "idle";
}
function isStepComplete(step) {
	if (isFormStep(step)) return step.status === "success" && step.isValid;
	if (isFeeStep(step)) return step.status === "success";
	if (isTransactionStep$1(step)) return step.isSuccess;
	return false;
}
function isStepDisabled(step) {
	if (isFormStep(step)) return false;
	if (isFeeStep(step)) return false;
	if (isTransactionStep$1(step)) return step.isDisabled;
	return false;
}
function isStepPending(step) {
	if (isFormStep(step)) return false;
	if (isFeeStep(step)) return step.status === "selecting";
	if (isTransactionStep$1(step)) return step.isPending;
	return false;
}
function computeFlowState(steps) {
	const stepEntries = getStepEntries(steps);
	const totalSteps = stepEntries.length;
	const completedSteps = stepEntries.filter(({ step }) => isStepComplete(step)).length;
	const currentStep = stepEntries.find(({ step }) => !isStepComplete(step) && !isStepDisabled(step))?.name || stepEntries[0]?.name || "form";
	const nextStep = stepEntries.find(({ step }) => {
		return getStepStatus(step) === "idle" && !isStepDisabled(step);
	})?.name || null;
	const isPending = stepEntries.some(({ step }) => isStepPending(step));
	const isSuccess = completedSteps === totalSteps && totalSteps > 0;
	const hasError = stepEntries.some(({ step }) => {
		if (isTransactionStep$1(step)) return step.status === "error" || step.error !== null;
		return false;
	});
	let status = "idle";
	if (isPending) status = "pending";
	else if (hasError) status = "error";
	else if (isSuccess) status = "success";
	const hasInvalidatedSteps = stepEntries.some(({ step }) => {
		if (isApprovalStep(step)) return step.invalidated === true;
		return false;
	});
	const progressPercent = totalSteps > 0 ? Math.round(completedSteps / totalSteps * 100) : 0;
	const allSteps = stepEntries.map(({ name, step }) => ({
		name,
		status: getStepStatus(step)
	}));
	return {
		status,
		isPending,
		isSuccess,
		currentStep,
		nextStep,
		progress: {
			current: completedSteps,
			total: totalSteps,
			percent: progressPercent
		},
		allSteps,
		hasInvalidatedSteps
	};
}

//#endregion
//#region src/react/ui/modals/_internal/helpers/step-guards.ts
function createBaseGuard(params) {
	return () => {
		const { isFormValid: isFormValid$2, txReady, walletConnected } = params;
		if (!walletConnected) return {
			canProceed: false,
			error: /* @__PURE__ */ new Error("Please connect your wallet"),
			suggestedAction: "connect-wallet"
		};
		if (!isFormValid$2) return {
			canProceed: false,
			error: /* @__PURE__ */ new Error("Please fix form validation errors"),
			suggestedAction: "fix-form"
		};
		if (!txReady) return {
			canProceed: false,
			error: /* @__PURE__ */ new Error("Transaction not ready"),
			suggestedAction: "wait-for-tx"
		};
		return { canProceed: true };
	};
}
function createApprovalGuard(params) {
	return createBaseGuard(params);
}
function createFinalTransactionGuard(params) {
	return () => {
		const { isFormValid: isFormValid$2, txReady, walletConnected, requiresApproval, approvalComplete } = params;
		if (!walletConnected) return {
			canProceed: false,
			error: /* @__PURE__ */ new Error("Please connect your wallet"),
			suggestedAction: "connect-wallet"
		};
		if (!isFormValid$2) return {
			canProceed: false,
			error: /* @__PURE__ */ new Error("Please fix form validation errors"),
			suggestedAction: "fix-form"
		};
		if (requiresApproval && !approvalComplete) return {
			canProceed: false,
			error: /* @__PURE__ */ new Error("Please approve token first"),
			suggestedAction: "complete-approval"
		};
		if (!txReady) return {
			canProceed: false,
			error: /* @__PURE__ */ new Error("Transaction not ready"),
			suggestedAction: "wait-for-tx"
		};
		return { canProceed: true };
	};
}
function createFeeGuard(params) {
	return () => {
		const { feeSelectionVisible } = params;
		if (feeSelectionVisible) return {
			canProceed: false,
			error: /* @__PURE__ */ new Error("Please select a fee option"),
			suggestedAction: "select-fee"
		};
		return { canProceed: true };
	};
}

//#endregion
//#region src/utils/getConduitAddressForOrderbook.ts
/**
* OpenSea Conduit address
* https://etherscan.io/address/0x1e0049783f008a0085193e00003d00cd54003c71
*/
const OPENSEA_SEAPORT_CONDUIT_ADDRESS = "0x1E0049783F008A0085193E00003D00cd54003c71";
/**
* Magic Eden Conduit address
* https://etherscan.io/address/0x2052f8A2Ff46283B30084e5d84c89A2fdBE7f74b
*/
const MAGICEDEN_CONDUIT_ADDRESS = "0x2052f8A2Ff46283B30084e5d84c89A2fdBE7f74b";
function getConduitAddressForOrderbook(orderbookKind) {
	switch (orderbookKind) {
		case OrderbookKind.sequence_marketplace_v1: return SEQUENCE_MARKET_V1_ADDRESS;
		case OrderbookKind.sequence_marketplace_v2: return SEQUENCE_MARKET_V2_ADDRESS;
		case OrderbookKind.opensea: return OPENSEA_SEAPORT_CONDUIT_ADDRESS;
		case OrderbookKind.magic_eden: return MAGICEDEN_CONDUIT_ADDRESS;
		default: return SEQUENCE_MARKET_V2_ADDRESS;
	}
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
	collectionAddress: zeroAddress,
	chainId: 0,
	tokenId: 0n,
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
			tokenId: event.tokenId,
			transactionType: event.transactionType,
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
const useIsOpen$1 = () => useSelector(transactionStatusModalStore, (state) => state.context.isOpen);
const useTransactionStatusModalState = () => useSelector(transactionStatusModalStore, (state) => state.context);
const useTransactionType$1 = () => useSelector(transactionStatusModalStore, (state) => state.context.transactionType);

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
	const transactionType = useTransactionType$1();
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
const useTransactionStatus = (hash, chainId) => {
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
			return;
		}
		if (!confirmationResult) {
			setStatus("PENDING");
			return;
		}
		setStatus("SUCCESS");
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
		case TransactionType$1.TRANSFER: return verb ? "transferred" : "transfer";
		case TransactionType$1.LISTING: return verb ? "listed" : "listing";
		case TransactionType$1.BUY: return verb ? "purchased" : "purchase";
		case TransactionType$1.SELL: return verb ? "sold" : "sale";
		case TransactionType$1.CANCEL: return verb ? "cancelled" : "cancellation";
		case TransactionType$1.OFFER: return verb ? "offered" : "offer";
		default: return "transaction";
	}
}

//#endregion
//#region src/react/ui/modals/_internal/components/transactionStatusModal/util/getMessage.ts
function getTransactionStatusModalMessage({ transactionStatus, transactionType, collectibleName, orderId, price }) {
	const hideCollectibleName = transactionType === "CANCEL";
	const formattedPrice = price ? formatUnits(BigInt(price.amountRaw), price.currency.decimals) : "";
	if (orderId) return `You just ${getFormattedType(transactionType, true)}${!hideCollectibleName ? ` ${collectibleName}` : ""}. It's been confirmed on the blockchain!`;
	if (transactionType === TransactionType$1.OFFER) return `You just offered ${formattedPrice} ${price?.currency.symbol} for ${collectibleName}. It's been confirmed on the blockchain!`;
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
	return useIsOpen$1() ? /* @__PURE__ */ jsx(TransactionStatusModalContent, {}) : null;
};
function TransactionStatusModalContent() {
	const { transactionType: type, hash, orderId, price, collectionAddress, chainId, tokenId, queriesToInvalidate } = useTransactionStatusModalState();
	const { data: collectible, isLoading: collectibleLoading } = useCollectibleMetadata({
		collectionAddress,
		chainId,
		tokenId
	});
	const transactionStatus = useTransactionStatus_default(hash, chainId);
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
	collectionAddress: zeroAddress,
	chainId: 0,
	tokenId: 0n,
	order: null
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
	const { isOpen, tokenId, collectionAddress, chainId, order } = useSelector(sellModalStore, (state) => state.context);
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const orderbookKind = findMarketCollection(marketplaceConfig?.market.collections ?? [], collectionAddress, chainId)?.destinationMarketplace;
	const closeModal = () => sellModalStore.send({ type: "close" });
	return {
		isOpen,
		tokenId,
		collectionAddress,
		chainId,
		order,
		orderbookKind,
		closeModal,
		currencyAddress: order?.priceCurrencyAddress
	};
};

//#endregion
//#region src/react/ui/modals/SellModal/internal/sell-mutations.ts
const useSellMutations = ({ tx, collectionAddress, chainId, contractType, orderbookKind, nftApprovalEnabled }) => {
	const sdkConfig = useConfig();
	const { show: showTxModal } = useTransactionStatusModal();
	const analytics = useAnalytics();
	const state = useSellModalState();
	const { isSequence } = useConnectorMetadata();
	const canBeBundled = isSequence && orderbookKind === OrderbookKind.sequence_marketplace_v2;
	const { processStep } = useProcessStep();
	const { address: ownerAddress } = useAccount();
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
	const spenderAddress = getConduitAddressForOrderbook(orderbookKind);
	const collectibleApprovalQuery = useCollectibleApproval({
		collectionAddress,
		spenderAddress,
		chainId,
		contractType,
		enabled: nftApprovalEnabled && !canBeBundled && !!ownerAddress && !!contractType && !!orderbookKind && !!spenderAddress
	});
	const needsApproval = useMemo(() => {
		if (canBeBundled) return false;
		if (collectibleApprovalQuery.isApproved === void 0) return true;
		return !collectibleApprovalQuery.isApproved;
	}, [collectibleApprovalQuery.isApproved, canBeBundled]);
	return {
		approve: useMutation({ mutationFn: async () => {
			if (!tx?.approveStep) throw new Error("No approval step available");
			return await executeStepAndWait(tx.approveStep);
		} }),
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
							userId: ownerAddress || "",
							collectionAddress: state.collectionAddress,
							currencyAddress: currency.contractAddress,
							currencySymbol: currency.symbol || "",
							requestId: state.order.orderId,
							tokenId: state.tokenId.toString(),
							chainId: state.chainId.toString(),
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
					type: TransactionType$1.SELL,
					chainId: state.chainId,
					hash: res?.type === "transaction" ? res.hash : void 0,
					orderId: res?.type === "signature" ? res.orderId : void 0,
					queriesToInvalidate: [
						["collectible", "market-highest-offer"],
						["collectible", "market-offers"],
						["collectible", "market-offers-count"],
						["token", "balances"],
						["collection", "balance-details"]
					],
					collectionAddress: state.collectionAddress,
					tokenId: state.tokenId
				});
			}
		}),
		needsApproval,
		collectibleApprovalQuery
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
		amount: 0n,
		receiver: defaultPlatformFeeRecipient
	};
	const { chainId, collectionAddress } = params;
	const marketCollection = findMarketCollection(marketplaceConfig?.market?.collections ?? [], collectionAddress, chainId);
	const receiver = chainId === avalanche.id || chainId === optimism.id ? avalancheAndOptimismPlatformFeeRecipient : defaultPlatformFeeRecipient;
	const percentageToBPS = (percentage) => Number(percentage) * 1e4 / 100;
	const feePercentage = marketCollection?.feePercentage ?? defaultFee;
	return {
		amount: BigInt(Math.round(percentageToBPS(feePercentage))),
		receiver
	};
};

//#endregion
//#region src/react/ui/modals/SellModal/internal/use-generate-sell-transaction.ts
const generateSellTransaction$1 = async (args, config) => {
	const marketplaceClient = getMarketplaceClient(config);
	const argsWithStringChainId = {
		...args,
		chainId: args.chainId
	};
	const steps = await marketplaceClient.generateSellTransaction(argsWithStringChainId).then((data) => data.steps);
	if (steps.length === 0) throw new Error("No steps generated");
	return {
		sellStep: steps.find((step) => step.id === StepType.sell),
		approveStep: steps.find((step) => step.id === StepType.tokenApproval)
	};
};
const useGenerateSellTransaction$1 = (params) => {
	const client = useConfig();
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
			additionalFees: [platformFee, ...additionalFees],
			useWithTrails: false
		}, client) : void 0,
		enabled
	});
};

//#endregion
//#region src/react/ui/modals/SellModal/internal/context.ts
function useSellModalContext() {
	const state = useSellModalState();
	const { address } = useAccount();
	const config = useConfig();
	const collectibleQuery = useCollectibleMetadata({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		tokenId: state.tokenId
	});
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
	const { walletKind, isWaaS, isSequence } = useConnectorMetadata();
	const canBeBundled = isSequence && state.orderbookKind === OrderbookKind.sequence_marketplace_v2;
	const transactionData = useGenerateSellTransaction$1({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		seller: address,
		marketplace: state.order?.marketplace,
		walletType: walletKind,
		ordersData: state.order ? [{
			orderId: state.order.orderId,
			quantity: state.order.quantityRemaining,
			tokenId: BigInt(state.tokenId)
		}] : void 0,
		useWithTrails: false
	});
	const { approve, sell, needsApproval, collectibleApprovalQuery } = useSellMutations({
		tx: transactionData.data,
		collectionAddress: state.collectionAddress,
		chainId: state.chainId,
		contractType: collectionQuery.data?.type,
		orderbookKind: state.orderbookKind,
		nftApprovalEnabled: !!address && !!collectionQuery.data?.type && !!state.orderbookKind && state.isOpen && !canBeBundled
	});
	const waas = useSelectWaasFeeOptionsStore();
	const { pendingFeeOptionConfirmation, rejectPendingFeeOption } = useWaasFeeOptions$1(state.chainId, config);
	const isSponsored = pendingFeeOptionConfirmation?.options?.length === 0;
	const isFeeSelectionVisible = waas.isVisible || !isSponsored && !!pendingFeeOptionConfirmation?.options;
	const steps = {};
	if (isWaaS) steps.fee = {
		label: "Select Fee",
		status: isSponsored || !!waas.selectedFeeOption ? "success" : isFeeSelectionVisible ? "selecting" : "idle",
		isSponsored,
		isSelecting: isFeeSelectionVisible,
		selectedOption: waas.selectedFeeOption,
		show: () => waas.show(),
		cancel: () => waas.hide()
	};
	const approveResult = approve.data && "type" in approve.data && approve.data.type === "transaction" ? {
		type: "transaction",
		hash: approve.data.hash
	} : null;
	if (!approve.isSuccess && needsApproval) {
		const guardResult = createApprovalGuard({
			isFormValid: true,
			txReady: !!transactionData.data?.approveStep,
			walletConnected: !!address
		})();
		steps.approval = {
			label: "Approve",
			status: approve.isSuccess ? "success" : approve.isPending ? "pending" : approve.error ? "error" : "idle",
			isPending: approve.isPending,
			isSuccess: approve.isSuccess,
			isDisabled: !guardResult.canProceed,
			disabledReason: guardResult.error?.message || null,
			error: approve.error,
			canExecute: guardResult.canProceed,
			result: approveResult,
			execute: async () => {
				await approve.mutateAsync();
			},
			reset: () => approve.reset()
		};
	}
	const sellGuardResult = createFinalTransactionGuard({
		isFormValid: true,
		txReady: !!transactionData.data?.sellStep,
		walletConnected: !!address,
		requiresApproval: needsApproval && !approve.isSuccess,
		approvalComplete: approve.isSuccess || !needsApproval
	})();
	const sellResult = sell.data && "type" in sell.data ? sell.data.type === "transaction" ? {
		type: "transaction",
		hash: sell.data.hash
	} : sell.data.type === "signature" ? sell.data.orderId ? {
		type: "signature",
		orderId: sell.data.orderId
	} : null : null : null;
	steps.sell = {
		label: "Accept Offer",
		status: sell.isSuccess ? "success" : sell.isPending ? "pending" : sell.error ? "error" : "idle",
		isPending: sell.isPending,
		isSuccess: sell.isSuccess,
		isDisabled: !sellGuardResult.canProceed,
		disabledReason: sellGuardResult.error?.message || null,
		error: sell.error,
		canExecute: sellGuardResult.canProceed,
		result: sellResult,
		execute: async () => {
			await sell.mutateAsync();
		}
	};
	const flow = computeFlowState(steps);
	const error = transactionData.error || collectibleQuery.error || collectionQuery.error || currencyQuery.error || collectibleApprovalQuery.error;
	const handleClose = () => {
		if (pendingFeeOptionConfirmation?.id) rejectPendingFeeOption(pendingFeeOptionConfirmation.id);
		waas.hide();
		state.closeModal();
	};
	return {
		isOpen: state.isOpen,
		close: handleClose,
		item: {
			tokenId: state.tokenId,
			collectionAddress: state.collectionAddress,
			chainId: state.chainId
		},
		collection: collectionQuery.data,
		offer: {
			order: state.order,
			currency: currencyQuery.data,
			priceAmount: state.order?.priceAmount
		},
		steps,
		flow,
		loading: {
			collectible: collectibleQuery.isLoading,
			collection: collectionQuery.isLoading,
			currency: currencyQuery.isLoading,
			steps: transactionData.isLoading,
			collectibleApproval: collectibleApprovalQuery.isLoading
		},
		transactions: {
			approve: approveResult?.type === "transaction" ? approveResult.hash : void 0,
			sell: sellResult?.type === "transaction" ? sellResult.hash : void 0
		},
		error,
		queries: {
			collectible: collectibleQuery,
			collection: collectionQuery,
			currency: currencyQuery
		},
		get actions() {
			return {
				approve: this.steps.approval && this.steps.approval.status !== "success" && !canBeBundled ? {
					label: this.steps.approval?.label,
					onClick: this.steps.approval?.execute || (() => {}),
					loading: this.steps.approval?.isPending,
					disabled: this.steps.approval?.isDisabled,
					testid: "sell-modal-approve-button"
				} : void 0,
				sell: {
					label: this.steps.sell.label,
					onClick: this.steps.sell.execute,
					loading: this.steps.sell.isPending,
					disabled: this.steps.sell.isDisabled,
					testid: "sell-modal-accept-button"
				}
			};
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
const BaseModal = ({ onClose, title, children, disableAnimation, transactionType }) => {
	return /* @__PURE__ */ jsx(Modal, {
		isDismissible: true,
		onClose,
		overlayProps: MODAL_OVERLAY_PROPS,
		contentProps: MODAL_CONTENT_PROPS(transactionType),
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
		className: "flex min-h-[400px] flex-col items-center justify-center p-6 text-white",
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
			error.cause && /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => setShowTechnicalDetails(!showTechnicalDetails),
				className: "mb-4 flex items-center text-gray-400 text-sm transition-colors hover:text-gray-300",
				children: [/* @__PURE__ */ jsxs("svg", {
					className: `mr-2 h-4 w-4 transition-transform ${showTechnicalDetails ? "rotate-180" : ""}`,
					fill: "none",
					stroke: "currentColor",
					viewBox: "0 0 24 24",
					"aria-label": "Toggle technical details",
					children: [/* @__PURE__ */ jsx("title", { children: "Toggle technical details" }), /* @__PURE__ */ jsx("path", {
						strokeLinecap: "round",
						strokeLinejoin: "round",
						strokeWidth: 2,
						d: "M19 9l-7 7-7-7"
					})]
				}), showTechnicalDetails ? "Hide technical details" : "Show technical details"]
			}),
			showTechnicalDetails && error.cause && /* @__PURE__ */ jsx("div", {
				className: "mb-8 max-h-64 w-full max-w-md overflow-y-auto rounded-lg border border-red-900 bg-[#2b0000] p-4",
				children: /* @__PURE__ */ jsx("pre", {
					className: "whitespace-pre-wrap break-words text-red-100 text-xs",
					children: error.cause
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex w-full flex-col space-y-3",
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
			if (httpError.status && httpError.status >= 500) return "Server error. Please try again in a few moments.";
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
/**
* Type guard to check if an error is a WebRPC error
*/
function isWebrpcError(error) {
	return typeof error === "object" && error !== null && "code" in error && typeof error.code === "number";
}
const getErrorMessage = (error) => {
	if (isMarketplaceError(error)) return error.message;
	if (isWebrpcError(error)) return getWebRPCErrorMessage(error);
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
		const loadingText = type === "listing" ? "Preparing listing data..." : type === "offer" ? "Preparing offer data..." : type === "sell" ? "Preparing sale data..." : type === "transfer" ? "Preparing transfer data..." : "Preparing checkout data...";
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
		if (query.data !== void 0) acc[key] = query.data;
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
function ActionModal({ children, chainId, type, primaryAction, secondaryAction, additionalActions = [], queries, externalError, onErrorDismiss, onErrorAction, errorComponent, ...baseProps }) {
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
			variant: cta.variant || (index === 0 ? "primary" : "secondary"),
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
const WaasFeeOptionsSelect = ({ options, selectedFeeOption, onSelectedFeeOptionChange, currencyBalance }) => {
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
			option,
			canAfford: (() => {
				const extendedOption = option;
				if ("hasEnoughBalanceForFee" in extendedOption) return extendedOption.hasEnoughBalanceForFee;
				if (!currencyBalance || !option.value || !option.token.decimals) return false;
				try {
					const feeValue = BigInt(option.value);
					return currencyBalance.value >= feeValue;
				} catch {
					return false;
				}
			})()
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
	return /* @__PURE__ */ jsx(Select.Helper, {
		id: "fee-option",
		name: "fee-option",
		options: feeOptions.map((option) => ({
			label: option.content,
			value: option.value
		})),
		className: "w-full",
		onValueChange: (value) => {
			onSelectedFeeOptionChange(options.find((option) => option.token.contractAddress === value));
		},
		defaultValue: options[0].token.contractAddress ?? void 0
	});
};
function FeeOptionSelectItem({ value, option, canAfford }) {
	const formattedFee = formatUnits(BigInt(option.value), option.token.decimals || 0);
	const isTruncated = formattedFee.length > 11;
	const truncatedFee = isTruncated ? `${formattedFee.slice(0, 11)}...` : formattedFee;
	const feeDisplay = isTruncated ? /* @__PURE__ */ jsx(Tooltip, {
		message: formattedFee,
		children: /* @__PURE__ */ jsx(Text, {
			className: cn("font-body text-sm", canAfford ? "text-positive" : "text-text-50"),
			children: truncatedFee
		})
	}) : /* @__PURE__ */ jsx(Text, {
		className: cn("font-body text-sm", canAfford ? "text-positive" : "text-text-50"),
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
					alt: option.token.symbol,
					style: { opacity: canAfford ? 1 : .5 }
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex gap-1",
					children: [
						/* @__PURE__ */ jsx(Text, {
							className: cn("font-body text-sm", canAfford ? "opacity-100" : "opacity-50"),
							color: "text100",
							children: "Fee"
						}),
						/* @__PURE__ */ jsxs(Text, {
							className: cn("font-body text-sm", canAfford ? "opacity-100" : "opacity-50"),
							color: "text50",
							fontWeight: "semibold",
							children: [
								"(in ",
								option.token.symbol,
								")"
							]
						}),
						/* @__PURE__ */ jsx(Text, {
							className: cn("font-body text-sm", canAfford ? "opacity-100" : "opacity-50"),
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
	if (!(!(pendingFeeOptionConfirmation?.options?.length === 0) && (isVisible || !!pendingFeeOptionConfirmation?.options?.length)) || !selectedFeeOption) return null;
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
					onSelectedFeeOptionChange: setSelectedFeeOption,
					currencyBalance
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex w-full items-start justify-between",
				children: [!feeOptionsConfirmed && (!pendingFeeOptionConfirmation || currencyBalanceLoading) && /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-2/3 animate-shimmer rounded-xl" }), (feeOptionsConfirmed || pendingFeeOptionConfirmation && !currencyBalanceLoading) && /* @__PURE__ */ jsx(BalanceIndicator_default, {
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
function TokenPreview({ collectionName, collectionAddress, tokenId, chainId }) {
	const { data: collectable, isLoading: collectibleLoading } = useCollectibleMetadata({
		chainId,
		collectionAddress,
		tokenId
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
function TransactionDetails({ tokenId, collectionAddress, chainId, includeMarketplaceFee, price, showPlaceholderPrice, currencyImageUrl }) {
	const { data, isLoading: marketplaceConfigLoading } = useMarketplaceConfig();
	const marketplaceFeePercentage = includeMarketplaceFee ? findMarketCollection(data?.market.collections ?? [], collectionAddress, chainId)?.feePercentage || DEFAULT_MARKETPLACE_FEE_PERCENTAGE : 0;
	const { data: royalty, isLoading: royaltyLoading } = useRoyalty({
		chainId,
		collectionAddress,
		tokenId
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
//#region src/react/ui/modals/SellModal/Modal.tsx
const SellModal = () => {
	return useSelector(sellModalStore, (state) => state.context.isOpen) ? /* @__PURE__ */ jsx(Modal$4, {}) : null;
};
const Modal$4 = () => {
	const ctx = useSellModalContext();
	if (!ctx.isOpen) return null;
	const primaryAction = ctx.steps.fee?.isSelecting ? void 0 : ctx.actions.approve ?? ctx.actions.sell;
	const secondaryAction = ctx.steps.fee?.isSelecting ? void 0 : ctx.actions.approve ? ctx.actions.sell : void 0;
	return /* @__PURE__ */ jsx(ActionModal, {
		chainId: ctx.item.chainId,
		onClose: ctx.close,
		title: "You have an offer",
		type: "sell",
		primaryAction,
		secondaryAction,
		queries: {
			collectible: ctx.queries.collectible,
			collection: ctx.queries.collection,
			currency: ctx.queries.currency
		},
		externalError: ctx.error,
		children: ({ collection, currency }) => /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(TokenPreview, {
				collectionName: collection?.name,
				collectionAddress: ctx.item.collectionAddress,
				tokenId: ctx.item.tokenId,
				chainId: ctx.item.chainId
			}),
			/* @__PURE__ */ jsx(TransactionHeader, {
				title: "Offer received",
				currencyImageUrl: currency?.imageUrl,
				date: ctx.offer.order ? new Date(ctx.offer.order.createdAt) : void 0
			}),
			currency && /* @__PURE__ */ jsx(TransactionDetails, {
				tokenId: ctx.item.tokenId,
				collectionAddress: ctx.item.collectionAddress,
				chainId: ctx.item.chainId,
				includeMarketplaceFee: true,
				price: ctx.offer.priceAmount ? {
					amountRaw: ctx.offer.priceAmount,
					currency
				} : void 0,
				currencyImageUrl: currency?.imageUrl
			}),
			ctx.steps.fee?.isSelecting && /* @__PURE__ */ jsx(selectWaasFeeOptions_default, {
				chainId: ctx.item.chainId,
				onCancel: ctx.steps.fee.cancel,
				titleOnConfirm: "Accepting offer..."
			})
		] })
	});
};

//#endregion
//#region src/react/hooks/ui/card-data/market-card-data.tsx
function useMarketCardData({ collectionAddress, chainId, collectionType, filterOptions, searchText, showListedOnly = false, priceFilters, onCollectibleClick, onCannotPerformAction, prioritizeOwnerActions, assetSrcPrefixUrl, hideQuantitySelector, enabled }) {
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
			prices: normalizePriceFilters(priceFilters)
		},
		query: { enabled: enabled !== void 0 ? enabled : !!collectionAddress && !!chainId }
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
				const balance = (collectionBalance?.balances.find((b) => b.tokenId === BigInt(collectible.metadata.tokenId)))?.balance?.toString();
				return {
					tokenId: BigInt(collectible.metadata.tokenId),
					chainId,
					collectionAddress,
					collectionType,
					cardLoading: collectiblesListIsLoading || balanceLoading,
					cardType: "market",
					collectible: {
						...collectible,
						metadata: {
							...collectible.metadata,
							tokenId: BigInt(collectible.metadata.tokenId)
						}
					},
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
//#region src/react/hooks/ui/card-data/market-card-data-paged.tsx
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
function useMarketCardDataPaged({ collectionAddress, chainId, collectionType, filterOptions, searchText, showListedOnly = false, inAccounts, priceFilters, onCollectibleClick, onCannotPerformAction, prioritizeOwnerActions, assetSrcPrefixUrl, hideQuantitySelector, page, pageSize, enabled }) {
	const { address: accountAddress } = useAccount();
	const { show: showSellModal } = useSellModal();
	const { data: collectiblesListResponse, isLoading: collectiblesListIsLoading, error: collectiblesListError } = useCollectibleMarketListPaginated({
		collectionAddress,
		chainId,
		side: OrderSide.listing,
		filter: {
			includeEmpty: !showListedOnly,
			searchText,
			properties: filterOptions,
			prices: normalizePriceFilters(priceFilters),
			inAccounts: inAccounts ?? []
		},
		query: { enabled: !!collectionAddress && !!chainId && enabled },
		page,
		pageSize
	});
	const { data: collectionBalance, isLoading: balanceLoading } = useCollectionBalanceDetails({
		chainId,
		filter: {
			accountAddresses: accountAddress ? [accountAddress] : [],
			omitNativeBalances: true,
			contractWhitelist: [collectionAddress]
		},
		query: { enabled: !!accountAddress && enabled }
	});
	return {
		collectibleCards: (collectiblesListResponse?.collectibles ?? []).map((collectible) => {
			const balanceAmount = collectionBalance?.balances.find((b) => b.tokenId === collectible.metadata.tokenId)?.balance;
			return {
				tokenId: collectible.metadata.tokenId,
				chainId,
				collectionAddress,
				collectionType,
				cardLoading: collectiblesListIsLoading || balanceLoading,
				cardType: "market",
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
							order
						});
						return;
					}
				}
			};
		}),
		isLoading: collectiblesListIsLoading || balanceLoading,
		error: collectiblesListError,
		hasMore: collectiblesListResponse?.page?.more ?? false
	};
}

//#endregion
//#region src/react/hooks/ui/card-data/primary-sale-721-card-data.tsx
function normalizeTokenMetadata(metadata, tokenId) {
	return {
		tokenId,
		name: metadata?.name ?? "",
		attributes: metadata?.attributes ?? [],
		status: metadata?.status ?? MetadataStatus.AVAILABLE,
		description: metadata?.description,
		image: metadata?.image,
		video: metadata?.video,
		audio: metadata?.audio,
		properties: metadata?.properties,
		image_data: metadata?.image_data,
		external_url: metadata?.external_url,
		background_color: metadata?.background_color,
		animation_url: metadata?.animation_url,
		decimals: metadata?.decimals,
		updatedAt: metadata?.updatedAt
	};
}
function usePrimarySale721CardData({ primarySaleItemsWithMetadata, chainId, contractAddress, salesContractAddress, enabled = true }) {
	const [allTokenSuppliesFetched, setAllTokenSuppliesFetched] = useState(false);
	const { showListedOnly: showAvailableSales } = useFilterState();
	const { abi, isLoading: versionLoading } = useSalesContractABI({
		contractAddress: salesContractAddress,
		contractType: ContractType$1.ERC721,
		chainId,
		enabled
	});
	const { data: tokenSuppliesData, fetchNextPage: fetchNextTokenSuppliesPage, hasNextPage: hasNextSuppliesPage, isFetchingNextPage: isFetchingNextSuppliesPage, isLoading: tokenSuppliesLoading } = useInfiniteQuery({ ...tokenSuppliesQueryOptions({
		chainId,
		collectionAddress: contractAddress,
		includeMetadata: true,
		config: useConfig()
	}) });
	useEffect(() => {
		async function fetchAllPages() {
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
		fetchNextTokenSuppliesPage
	]);
	const allTokenSupplies = tokenSuppliesData?.pages.flatMap((page) => page.supplies);
	const matchingTokenSupplies = allTokenSupplies?.filter((supply) => primarySaleItemsWithMetadata.some((primarySaleItem) => BigInt(primarySaleItem.metadata.tokenId) === supply.tokenId));
	const { data: saleDetails, isLoading: saleDetailsLoading, error: saleDetailsError } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: abi || [],
		functionName: "saleDetails",
		query: { enabled: enabled && !versionLoading && !!abi }
	});
	const primarySaleItemsCollectibleCards = primarySaleItemsWithMetadata.filter((item) => !matchingTokenSupplies?.some((supply) => supply.tokenId === BigInt(item.metadata.tokenId))).map((item) => {
		const { metadata, primarySaleItem } = item;
		const salePrice = {
			amount: primarySaleItem.priceAmount || 0n,
			currencyAddress: primarySaleItem.currencyAddress
		};
		const quantityInitial = primarySaleItem.supply;
		const quantityRemaining = 1n;
		const saleStartsAt = primarySaleItem.startDate.toString();
		const saleEndsAt = primarySaleItem.endDate.toString();
		return {
			tokenId: BigInt(metadata.tokenId),
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType$1.ERC721,
			tokenMetadata: { ...metadata },
			cardLoading: saleDetailsLoading,
			salesContractAddress,
			salePrice,
			quantityInitial,
			quantityRemaining,
			saleStartsAt,
			saleEndsAt,
			cardType: "shop"
		};
	});
	const mintedTokensCollectibleCards = allTokenSupplies?.map((item) => {
		return {
			tokenId: item.tokenId,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType$1.ERC721,
			tokenMetadata: normalizeTokenMetadata(item.tokenMetadata, item.tokenId),
			cardLoading: saleDetailsLoading,
			salesContractAddress,
			salePrice: {
				amount: 0n,
				currencyAddress: zeroAddress
			},
			quantityInitial: void 0,
			quantityRemaining: void 0,
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
		contractType: ContractType$1.ERC1155,
		chainId,
		enabled
	});
	const { data: paymentToken, isLoading: paymentTokenLoading } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: abi || [],
		functionName: "paymentToken",
		query: { enabled: enabled && !versionLoading && !!abi }
	});
	const isLoading = versionLoading || paymentTokenLoading;
	return {
		collectibleCards: primarySaleItemsWithMetadata.map((item) => {
			const { metadata, primarySaleItem: saleData } = item;
			const salePrice = {
				amount: saleData?.priceAmount || 0n,
				currencyAddress: saleData?.currencyAddress || paymentToken || zeroAddress
			};
			const supply = saleData?.supply;
			const unlimitedSupply = saleData?.unlimitedSupply;
			return {
				tokenId: metadata.tokenId,
				chainId,
				collectionAddress: contractAddress,
				collectionType: ContractType$1.ERC1155,
				tokenMetadata: metadata,
				cardLoading: isLoading,
				salesContractAddress,
				salePrice,
				quantityInitial: supply,
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
const initialContext$3 = {
	isOpen: false,
	props: null,
	buyAnalyticsId: "",
	paymentModalState: "idle",
	quantity: 1
};
const buyModalStore = createStore({
	context: { ...initialContext$3 },
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
				isOpen: true
			};
		},
		close: (context) => ({
			...context,
			isOpen: false,
			paymentModalState: "idle",
			quantity: 1
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
		closePaymentModal: (context) => ({
			...context,
			paymentModalState: "closed"
		})
	}
});
const useIsOpen = () => useSelector(buyModalStore, (state) => state.context.isOpen);
const useBuyModalProps = () => {
	const props = useSelector(buyModalStore, (state) => state.context.props);
	if (!props) throw new Error("BuyModal props not initialized. Make sure to call show() first.");
	return props;
};
const useBuyAnalyticsId = () => useSelector(buyModalStore, (state) => state.context.buyAnalyticsId);
const usePaymentModalState = () => useSelector(buyModalStore, (state) => state.context.paymentModalState);
const useQuantity = () => useSelector(buyModalStore, (state) => state.context.quantity);

//#endregion
//#region src/react/hooks/transactions/useMarketTransactionSteps.tsx
/**
* Hook to generate transaction steps for market transactions (secondary sales)
* This directly calls the marketplace API without using generators
*/
function useMarketTransactionSteps({ chainId, collectionAddress, buyer, marketplace, orderId, tokenId, quantity, additionalFees = [], enabled = true }) {
	const config = useConfig();
	const queryClient = useQueryClient();
	const marketplaceClient = useMemo(() => getMarketplaceClient(config), [config]);
	const useWithTrails = config.checkoutMode === "trails" || config.checkoutMode === void 0;
	const queryKey = ["market-transaction-steps", {
		chainId,
		collectionAddress,
		buyer,
		orderId,
		tokenId,
		quantity,
		useWithTrails
	}];
	const query = useQuery({
		queryKey,
		queryFn: async () => {
			const response = await marketplaceClient.generateBuyTransaction({
				chainId,
				collectionAddress,
				buyer,
				marketplace,
				ordersData: [{
					orderId,
					quantity,
					tokenId
				}],
				additionalFees,
				walletType: WalletKind.unknown,
				useWithTrails
			});
			return {
				steps: response.steps,
				canBeUsedWithTrails: response.resp?.canBeUsedWithTrails ?? false
			};
		},
		enabled: enabled && !!buyer,
		retry: false
	});
	useEffect(() => {
		if (!query.data && enabled && buyer && query.fetchStatus === "fetching" && !query.isError) {
			const intervalId = setInterval(() => {
				queryClient.cancelQueries({ queryKey });
				query.refetch();
			}, 3e3);
			return () => {
				clearInterval(intervalId);
			};
		}
	}, [
		query.data,
		enabled,
		buyer,
		query.fetchStatus,
		query.isError,
		query,
		queryClient,
		queryKey
	]);
	return query;
}

//#endregion
//#region src/react/hooks/transactions/usePrimarySaleTransactionSteps.ts
/**
* Hook to generate transaction steps for primary sale transactions (minting/shop)
* This directly creates steps without using generators
*/
function usePrimarySaleTransactionSteps({ chainId, buyer, recipient, salesContractAddress, tokenIds, amounts, maxTotal, paymentToken, merkleProof = [], contractType, enabled = true }) {
	const queryEnabled = enabled && !!buyer && !!salesContractAddress && tokenIds.length > 0 && amounts.length > 0 && maxTotal !== void 0 && contractType !== void 0 && paymentToken !== void 0;
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
			const steps = [];
			if (paymentToken !== zeroAddress && allowance !== void 0 && allowance < maxTotal) {
				const approvalCalldata = encodeFunctionData({
					abi: ERC20_ABI,
					functionName: "approve",
					args: [salesContractAddress, maxUint256]
				});
				steps.push({
					id: StepType.tokenApproval,
					data: approvalCalldata,
					to: paymentToken,
					value: 0n,
					price: 0n
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
			steps.push({
				id: StepType.buy,
				data: mintCalldata,
				to: salesContractAddress,
				value: paymentToken === zeroAddress ? maxTotal : 0n,
				price: maxTotal
			});
			return {
				steps,
				canBeUsedWithTrails: true
			};
		},
		enabled: queryEnabled && !!abi && !abiLoading && !allowanceLoading
	});
}
/**
* Format mint arguments based on contract version
*/
function formatMintArgs({ recipient, tokenIds, amounts, paymentToken, maxTotal, merkleProof, version }) {
	if (version === SalesContractVersion.V1) return [
		recipient,
		tokenIds,
		amounts,
		"0x",
		paymentToken,
		maxTotal,
		merkleProof
	];
	return [
		recipient,
		tokenIds,
		amounts,
		paymentToken,
		maxTotal,
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
function useTransactionType(modalProps) {
	return useMemo(() => {
		if (modalProps.cardType === "shop") return TransactionType$2.PRIMARY_SALE;
		return TransactionType$2.MARKET_BUY;
	}, [modalProps.cardType]);
}

//#endregion
//#region src/react/hooks/transactions/useBuyTransaction.tsx
/**
* Unified hook that handles both market and primary sale transactions
* Automatically selects the appropriate transaction type based on modal props
*/
function useBuyTransaction(options) {
	const { modalProps, primarySalePrice, contractType } = options;
	const { collectionAddress, chainId } = modalProps;
	const { address: buyer } = useAccount();
	const quantity = useQuantity();
	const transactionType = useTransactionType(modalProps);
	const marketPlatformFee = useMarketPlatformFee({
		chainId,
		collectionAddress
	});
	const normalizedQuantity = quantity && quantity > 0 ? quantity : 1;
	const marketQuery = useMarketTransactionSteps({
		chainId,
		collectionAddress,
		buyer: buyer ?? zeroAddress,
		marketplace: isMarketProps(modalProps) ? modalProps.marketplace : MarketplaceKind.sequence_marketplace_v2,
		orderId: isMarketProps(modalProps) ? modalProps.orderId : "",
		tokenId: isMarketProps(modalProps) ? modalProps.tokenId : 0n,
		quantity: 1n,
		additionalFees: [marketPlatformFee],
		enabled: transactionType === TransactionType$2.MARKET_BUY && !!buyer
	});
	const primaryQuery = usePrimarySaleTransactionSteps({
		chainId: modalProps.chainId,
		buyer: buyer ?? zeroAddress,
		salesContractAddress: isShopProps(modalProps) ? modalProps.salesContractAddress : zeroAddress,
		tokenIds: isShopProps(modalProps) ? [modalProps.item.tokenId] : [],
		amounts: isShopProps(modalProps) ? [normalizedQuantity] : [],
		maxTotal: primarySalePrice?.amount ?? 0n,
		paymentToken: primarySalePrice?.currencyAddress ?? zeroAddress,
		contractType,
		enabled: transactionType === TransactionType$2.PRIMARY_SALE && !!buyer && primarySalePrice?.amount !== void 0 && primarySalePrice?.amount !== null && !!primarySalePrice?.currencyAddress
	});
	if (transactionType === TransactionType$2.MARKET_BUY) return {
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
/**
* Normalizes WaaS fee option token address to viem Address type
* - null represents native token (converted to zeroAddress)
* - string addresses from WaaS are validated and guaranteed to be hex addresses
*/
function normalizeWaasFeeTokenAddress(contractAddress) {
	if (contractAddress === null) return zeroAddress;
	if (!contractAddress.startsWith("0x")) throw new Error(`Invalid address from WaaS: ${contractAddress}`);
	return contractAddress;
}
function useAutoSelectFeeOption({ pendingFeeOptionConfirmation, enabled }) {
	const { address: userAddress } = useAccount();
	const isEnabled = enabled ?? true;
	const contractWhitelist = pendingFeeOptionConfirmation.options?.map((option) => normalizeWaasFeeTokenAddress(option.token.contractAddress));
	const { data: balanceDetails, isLoading: isBalanceDetailsLoading, isError: isBalanceDetailsError } = useCollectionBalanceDetails({
		chainId: pendingFeeOptionConfirmation.chainId,
		filter: {
			accountAddresses: userAddress ? [userAddress] : [],
			contractWhitelist,
			omitNativeBalances: false
		},
		query: { enabled: !!pendingFeeOptionConfirmation.options && !!userAddress && isEnabled }
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
			const normalizedAddress = normalizeWaasFeeTokenAddress(option.token.contractAddress);
			const tokenBalance = combinedBalances.find((balance) => balance.contractAddress.toLowerCase() === normalizedAddress.toLowerCase());
			if (!tokenBalance) return false;
			return BigInt(tokenBalance.balance) >= BigInt(option.value);
		});
		if (!selectedOption) return {
			selectedOption: null,
			error: AutoSelectFeeOptionError.InsufficientBalanceForAnyFeeOption
		};
		return {
			selectedOption,
			error: null
		};
	}, [
		userAddress,
		pendingFeeOptionConfirmation.options,
		isBalanceDetailsLoading,
		isBalanceDetailsError,
		combinedBalances,
		isEnabled
	])();
}

//#endregion
//#region src/react/hooks/util/optimisticCancelUpdates.ts
const SECOND = 1e3;
const updateQueriesOnCancel = ({ orderId, queryClient }) => {
	queryClient.setQueriesData({
		queryKey: ["collectible", "market-offers-count"],
		exact: false
	}, (oldData) => {
		if (!oldData) return 0;
		return Math.max(0, oldData.count - 1);
	});
	queryClient.setQueriesData({
		queryKey: ["collectible", "market-offers"],
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
		queryKey: ["collectible", "market-listings-count"],
		exact: false
	}, (oldData) => {
		if (!oldData) return 0;
		return Math.max(0, oldData.count - 1);
	});
	queryClient.setQueriesData({
		queryKey: ["collectible", "market-listings"],
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
		queryKey: ["collectible", "market-offers"],
		exact: false
	});
	queryClient.invalidateQueries({
		queryKey: ["collectible", "market-offers-count"],
		exact: false
	});
	queryClient.invalidateQueries({
		queryKey: ["collectible", "market-listings"],
		exact: false
	});
	queryClient.invalidateQueries({
		queryKey: ["collectible", "market-listings-count"],
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
	return getMarketplaceClient(config).generateCancelTransaction(args).then((data) => data.steps);
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
				value: step.value
			})
		};
		if (step.id === StepType.signEIP191) {
			const data = step.data;
			const signature = await signMessageAsync({ message: isHex(data) ? { raw: data } : data });
			return {
				type: "signature",
				orderId: (await marketplaceClient.execute({ params: {
					chainId: chainId.toString(),
					signature,
					method: step.post.method,
					endpoint: step.post.endpoint,
					body: step.post.body,
					executeType: ExecuteType.order
				} })).orderId
			};
		}
		if (step.id === StepType.signEIP712) {
			if (!step.signature) throw new Error("EIP-712 step missing signature data");
			const signature = await signTypedDataAsync({
				domain: step.signature.domain,
				types: step.signature.types,
				primaryType: step.signature.primaryType,
				message: step.signature.value
			});
			return {
				type: "signature",
				orderId: (await marketplaceClient.execute({ params: {
					chainId: chainId.toString(),
					signature,
					method: step.post.method,
					endpoint: step.post.endpoint,
					body: step.post.body,
					executeType: ExecuteType.order
				} })).orderId
			};
		}
		throw new Error(`Unsupported step type: ${step.id}`);
	};
	return { processStep };
};

//#endregion
//#region src/react/hooks/transactions/useCancelTransactionSteps.tsx
const useCancelTransactionSteps = ({ collectionAddress, chainId, setSteps, onSuccess, onError }) => {
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
			console.debug("onError callback not provided:", error);
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
const useCancelOrder = ({ collectionAddress, chainId }) => {
	const [steps, setSteps] = useState({
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
		onSuccess: () => {
			setCancellingOrderId(null);
		},
		onError: () => {
			setCancellingOrderId(null);
		},
		setSteps
	});
	const cancelOrder = async (params) => {
		setCancellingOrderId(params.orderId);
		return cancelOrderBase(params);
	};
	return {
		cancelOrder,
		isExecuting: steps.isExecuting,
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
		chainId: params.chainId,
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
		chainId: params.chainId,
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
	return getMarketplaceClient(config).generateSellTransaction(args).then((data) => data.steps);
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
				if (!stepItem.signature) throw new Error("EIP-712 step missing signature data");
				logger.debug("Signing with EIP-712", {
					domain: stepItem.signature.domain,
					types: stepItem.signature.types
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
				value: stepItem.value || 0n
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
			default: throw new Error(`Cannot execute step type: ${step.id}`);
		}
		return result;
	};
	return { executeStep };
};

//#endregion
//#region src/react/hooks/transactions/useTransactionExecution.ts
function useTransactionExecution() {
	const { processStep } = useProcessStep();
	const executeSteps = async (steps, chainId) => {
		const results = [];
		for (const step of steps) try {
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
	const { writeContractAsync, data: hash, isPending, isError, isSuccess, error } = useWriteContract();
	const transferTokensAsync = async (params) => {
		if (!accountAddress) throw new NoWalletConnectedError();
		return await writeContractAsync(prepareTransferConfig(params, accountAddress));
	};
	return {
		transferTokensAsync,
		hash,
		transferring: isPending,
		transferFailed: isError,
		transferSuccess: isSuccess,
		error
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
	const { collectionAddress, tokenId, publicClient } = params;
	if (!publicClient) throw new Error("Public client is required");
	const [recipient, percentage] = await readContract(publicClient, {
		abi: EIP2981_ABI,
		address: collectionAddress,
		functionName: "royaltyInfo",
		args: [BigInt(tokenId), BigInt(100)]
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
		tokenId: params.tokenId
	}];
}
function royaltyQueryOptions(params, query) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.tokenId && params.publicClient && (query?.enabled ?? true));
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
* @param args.tokenId - The token ID within the collection
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
*   tokenId: '1'
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
*   tokenId: '42',
*   query: {
*     refetchInterval: 60000,
*     enabled: hasTokenId
*   }
* })
* ```
*/
function useRoyalty(args) {
	const { chainId, collectionAddress, tokenId, query } = args;
	return useQuery(royaltyQueryOptions({
		chainId,
		collectionAddress,
		tokenId,
		publicClient: usePublicClient({ chainId })
	}, query));
}

//#endregion
//#region src/react/ui/modals/BuyModal/index.tsx
const useBuyModal = () => {
	const analyticsFn = useAnalytics();
	return {
		show: (args) => buyModalStore.send({
			type: "open",
			props: args,
			analyticsFn
		}),
		close: () => buyModalStore.send({ type: "close" })
	};
};

//#endregion
//#region src/react/queries/orders.ts
/**
* Fetches orders from the marketplace API
*/
async function fetchOrders(params) {
	const { config, ...apiParams } = params;
	return getMarketplaceClient(config).getOrders({
		chainId: apiParams.chainId,
		input: apiParams.input,
		page: apiParams.page
	});
}
function ordersQueryOptions(params) {
	const { chainId, input, config } = params;
	const enabled = Boolean(config && chainId && input && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: ["orders", params],
		queryFn: () => {
			if (!chainId || !input || !config) throw new Error("Missing required parameters for orders query");
			return fetchOrders({
				chainId,
				input,
				page: params.page,
				config
			});
		},
		...params.query,
		enabled
	});
}

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
	const tokenId = isMarket ? buyModalProps.tokenId : buyModalProps.item?.tokenId;
	const { isConnecting, isReconnecting } = useAccount();
	const walletIsLoading = isConnecting || isReconnecting;
	const { data: collectible, isLoading: collectableLoading, isError: isCollectibleError, error: collectibleError, refetch: refetchCollectible } = useCollectibleMetadata({
		chainId,
		collectionAddress,
		tokenId
	});
	const { data: collection, isLoading: collectionLoading, isError: isCollectionError, error: collectionError, refetch: refetchCollection } = useCollectionMetadata({
		chainId,
		collectionAddress
	});
	const { data: orders, isLoading: ordersLoading, isError: isOrdersError, error: ordersError, refetch: refetchOrders } = useOrders({
		chainId,
		input: orderId && marketplace ? [{
			contractAddress: collectionAddress,
			orderId,
			marketplace
		}] : [],
		query: { enabled: !!orderId && !!marketplace }
	});
	const marketOrder = orders?.orders[0];
	console.log(marketOrder);
	const { data: primarySaleItemData, isLoading: primarySaleItemLoading, isError: isPrimarySaleItemError, error: primarySaleItemError, refetch: refetchPrimarySaleItem } = usePrimarySaleItem({
		chainId,
		primarySaleContractAddress: isShop ? buyModalProps.salesContractAddress : void 0,
		tokenId: isShop ? buyModalProps.item.tokenId : void 0,
		query: { enabled: isShop }
	});
	const primarySaleItem = primarySaleItemData?.item?.primarySaleItem;
	const { data: currency, isLoading: currencyLoading, isError: isCurrencyError, error: currencyError, refetch: refetchCurrency } = useCurrency({
		chainId,
		currencyAddress: isMarket ? orders?.orders[0]?.priceCurrencyAddress : primarySaleItem?.currencyAddress
	});
	const refetchQueries = async () => {
		const promises = [
			isCollectibleError ? refetchCollectible() : Promise.resolve(),
			collectionError ? refetchCollection() : Promise.resolve(),
			isOrdersError && isMarket ? refetchOrders() : Promise.resolve(),
			isPrimarySaleItemError && isShop ? refetchPrimarySaleItem() : Promise.resolve(),
			currencyError ? refetchCurrency() : Promise.resolve()
		];
		await Promise.all(promises);
	};
	return {
		collectible,
		collectionAddress,
		currency,
		marketOrder,
		isMarket,
		isShop,
		collection,
		primarySaleItem,
		isLoading: collectableLoading || isMarket && ordersLoading || isShop && primarySaleItemLoading || walletIsLoading || collectionLoading || currencyLoading,
		isError: isCollectibleError || isCollectionError || isOrdersError || isPrimarySaleItemError || isCurrencyError,
		error: collectibleError || collectionError || ordersError || primarySaleItemError || currencyError,
		refetchQueries
	};
};

//#endregion
//#region src/react/ui/modals/BuyModal/internal/determineCheckoutMode.ts
function determineCheckoutMode({ checkoutModeConfig, isChainSupported, canBeUsedWithTrails }) {
	if (checkoutModeConfig === "trails" && isChainSupported && canBeUsedWithTrails) return "trails";
	if (checkoutModeConfig === "trails" && isChainSupported && !canBeUsedWithTrails) return "crypto";
	if (checkoutModeConfig === "trails" && !isChainSupported) return "crypto";
	if (typeof checkoutModeConfig === "object" && checkoutModeConfig.mode === "sequence-checkout") return {
		mode: "sequence-checkout",
		options: checkoutModeConfig.options
	};
	if (checkoutModeConfig === "crypto") return "crypto";
}

//#endregion
//#region src/react/ui/modals/BuyModal/internal/buyModalContext.ts
function useBuyModalContext() {
	const config = useConfig();
	const modalProps = useBuyModalProps();
	const checkoutModeConfig = config.checkoutMode ?? "trails";
	const { close } = useBuyModal();
	const transactionStatusModal = useTransactionStatusModal();
	const { supportedChains, isLoadingChains } = useSupportedChains();
	const { collectible, collection, currency, marketOrder, collectionAddress, primarySaleItem, isLoading: isBuyModalDataLoading, isMarket, isShop, error, refetchQueries } = useBuyModalData();
	const transactionData = useBuyTransaction({
		modalProps,
		primarySalePrice: {
			amount: primarySaleItem?.priceAmount,
			currencyAddress: primarySaleItem?.currencyAddress
		},
		contractType: collection?.type === ContractType$1.ERC1155 ? ContractType$1.ERC1155 : ContractType$1.ERC721
	});
	const steps = transactionData.data?.steps;
	const canBeUsedWithTrails = transactionData.data?.canBeUsedWithTrails ?? false;
	const isLoadingSteps = transactionData.isLoading;
	const { pendingFeeOptionConfirmation, rejectPendingFeeOption } = useWaasFeeOptions$1(modalProps.chainId, config);
	const isChainSupported = supportedChains.some((chain) => chain.id === modalProps.chainId);
	const isLoading = isLoadingSteps || isLoadingChains || isBuyModalDataLoading;
	const buyStep = steps?.find((step) => step.id === "buy");
	const checkoutMode = determineCheckoutMode({
		checkoutModeConfig,
		isChainSupported,
		canBeUsedWithTrails
	});
	const formattedAmount = currency?.decimals && buyStep?.price ? formatUnits(BigInt(buyStep.price), currency.decimals) : void 0;
	const handleTransactionSuccess = (hash) => {
		if (!collectible) throw new Error("Collectible not found");
		if (isMarket && !marketOrder) throw new Error("Order not found");
		if (!currency) throw new Error("Currency not found");
		const amountRaw = isMarket ? marketOrder?.priceAmount : primarySaleItem?.priceAmount;
		if (amountRaw == null) throw new Error("Price amount not found");
		close();
		transactionStatusModal.show({
			hash,
			orderId: isMarket ? marketOrder?.orderId : void 0,
			price: {
				amountRaw,
				currency
			},
			collectionAddress,
			chainId: modalProps.chainId,
			tokenId: collectible.tokenId,
			type: TransactionType$1.BUY
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
	const refetchAll = async () => {
		await refetchQueries();
		await transactionData.refetch();
	};
	return {
		config,
		modalProps,
		close: handleClose,
		steps,
		collectible,
		collection,
		primarySaleItem,
		marketOrder,
		isShop,
		buyStep,
		isLoading,
		checkoutMode,
		formattedAmount,
		handleTransactionSuccess,
		handleTrailsSuccess,
		error: error || transactionData.error,
		refetchAll
	};
}

//#endregion
//#region src/react/ui/modals/BuyModal/components/CollectibleMetadataSummary.tsx
const CollectibleMetadataSummary = ({ checkoutMode, collectible, collection, chainId, currency, formattedPrice, renderCurrencyPrice, renderPriceUSD, isMarket }) => {
	if (!collectible) return null;
	const isTrails = checkoutMode === "trails";
	const isCryptoPayment = checkoutMode === "crypto";
	const imageSize = isTrails ? "h-12 w-12" : "h-[84px] w-[84px]";
	return /* @__PURE__ */ jsxs("div", {
		className: isTrails ? "flex w-full items-start gap-4 p-6 pb-0" : "flex items-start gap-4",
		children: [/* @__PURE__ */ jsx(Media, {
			assets: [
				collectible.video,
				collectible.animation_url,
				collectible.image
			],
			name: collectible.name,
			containerClassName: `${imageSize} shrink-0 rounded-lg overflow-hidden object-cover`
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex min-w-0 flex-1 flex-col gap-2",
			children: [isTrails ? /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-1",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Text, {
						className: "truncate font-semibold text-sm text-text-100",
						children: collectible.name || "Unnamed"
					}), collectible.tokenId !== void 0 && /* @__PURE__ */ jsxs(Text, {
						className: "shrink-0 font-bold text-text-50 text-xs",
						children: ["#", collectible.tokenId.toString()]
					})]
				}), collection && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [collection.logoURI && /* @__PURE__ */ jsx("img", {
						src: collection.logoURI,
						alt: collection.name,
						className: "h-4 w-4 shrink-0 rounded-full"
					}), /* @__PURE__ */ jsx(Text, {
						className: "truncate font-bold text-text-50 text-xs",
						children: collection.name
					})]
				})]
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(Text, {
					className: "truncate font-semibold text-sm text-text-100",
					children: collectible.name
				}), collectible.tokenId !== void 0 && /* @__PURE__ */ jsxs(Text, {
					className: "shrink-0 font-bold text-text-50 text-xs",
					children: ["#", collectible.tokenId.toString()]
				})]
			}), collection && /* @__PURE__ */ jsx(Text, {
				className: "truncate font-bold text-text-50 text-xs",
				children: collection.name
			})] }), isCryptoPayment && renderCurrencyPrice && /* @__PURE__ */ jsxs("div", {
				className: "mt-2 flex flex-col",
				children: [/* @__PURE__ */ jsx(Tooltip, {
					message: `${formattedPrice || ""} ${currency?.symbol || ""}`,
					side: "right",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1",
						children: [currency?.imageUrl ? /* @__PURE__ */ jsx("img", {
							src: currency.imageUrl,
							alt: currency.symbol,
							className: "h-5 w-5 rounded-full"
						}) : chainId ? /* @__PURE__ */ jsx(NetworkImage, {
							chainId,
							size: "sm"
						}) : null, /* @__PURE__ */ jsx(Text, {
							className: "font-bold text-md",
							children: renderCurrencyPrice()
						})]
					})
				}), isMarket && renderPriceUSD && renderPriceUSD() && /* @__PURE__ */ jsx(Text, {
					className: "font-bold text-text-50 text-xs",
					children: renderPriceUSD()
				})]
			})]
		})]
	});
};

//#endregion
//#region src/react/ui/components/_internals/ErrorLogBox.tsx
const ErrorLogBox = ({ title, message, error, onDismiss }) => {
	const [showFullError, setShowFullError] = useState(false);
	const toggleFullError = () => {
		setShowFullError(!showFullError);
	};
	return /* @__PURE__ */ jsx("div", {
		className: "wrap-anywhere relative max-h-96 overflow-y-auto rounded-lg border border-red-900 bg-[#2b0000] p-3",
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
//#region src/react/ui/modals/BuyModal/hooks/useExecuteBundledTransactions.ts
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
	const { data: walletClient } = useWalletClient();
	const indexerClient = getIndexerClient(chainId, config);
	const { collection, currency } = useBuyModalData();
	const isReady = !!address && !!publicClient && !!walletClient && !!indexerClient && !!connector && !!collection?.address && priceAmount != null;
	const executeBundledTransactions = async ({ step, onBalanceInsufficientForFeeOption, onTransactionFailed }) => {
		setIsExecuting(true);
		try {
			if (!address) throw new Error("Address not found");
			if (!publicClient) throw new Error("Public client not found");
			if (!walletClient) throw new Error("Wallet client not found");
			if (!indexerClient) throw new Error("Indexer client not found");
			if (!connector) throw new Error("Connector not found");
			if (!collection?.address) throw new Error("Collection address not found");
			if (priceAmount == null) throw new Error("Price amount not found");
			const approvalData = approvalStep ? {
				to: approvalStep.to,
				data: approvalStep.data,
				chainId
			} : void 0;
			const transactionData = {
				to: step.to,
				data: step.data,
				chainId,
				...currency?.nativeCurrency ? { value: priceAmount } : {}
			};
			const sendTransactionFns = await sendTransactions({
				chainId,
				senderAddress: address,
				publicClient,
				walletClient,
				indexerClient,
				connector,
				transactions: [...approvalData ? [approvalData] : [], transactionData],
				transactionConfirmations: 1,
				waitConfirmationForLastTransaction: false
			});
			if (!sendTransactionFns.length) throw new Error("No transactions returned");
			let txHash;
			for (const sendTransaction of sendTransactionFns) txHash = await sendTransaction();
			if (!txHash) throw new Error("Transaction hash not found");
			return txHash;
		} catch (error) {
			if (error instanceof FeeOptionInsufficientFundsError) {
				if (onBalanceInsufficientForFeeOption) onBalanceInsufficientForFeeOption(error);
				throw error;
			}
			if (onTransactionFailed) onTransactionFailed(error);
			throw error;
		} finally {
			setIsExecuting(false);
		}
	};
	return {
		executeBundledTransactions,
		isExecuting,
		isReady
	};
};

//#endregion
//#region src/react/ui/modals/BuyModal/hooks/useHasSufficientBalance.ts
const useHasSufficientBalance = ({ chainId, value, tokenAddress }) => {
	const { address } = useAccount();
	const { data: balanceData, isLoading } = useTokenCurrencyBalance({
		currencyAddress: tokenAddress,
		chainId,
		userAddress: address
	});
	const balance = balanceData?.value ?? 0n;
	return {
		data: {
			hasSufficientBalance: balance >= value || value === 0n,
			balance
		},
		isLoading
	};
};

//#endregion
//#region src/react/ui/modals/BuyModal/internal/cryptoPaymentModalContext.tsx
function useCryptoPaymentModalContext({ chainId, steps, onSuccess }) {
	const [isExecuting, setIsExecuting] = useState(false);
	const [isApproving, setIsApproving] = useState(false);
	const [error, setError] = useState(null);
	const { isSequence: isSequenceConnector, isWaaS } = useConnectorMetadata();
	const buyStep = steps.find((step) => step.id === StepType.buy);
	if (!buyStep) throw new Error("Buy step not found");
	const { collectible, currency, marketOrder, primarySaleItem, isMarket, isShop, collection, isLoading: isLoadingBuyModalData } = useBuyModalData();
	const sdkConfig = useConfig();
	const { ensureCorrectChainAsync, currentChainId } = useEnsureCorrectChain();
	const isOnCorrectChain = currentChainId === chainId;
	const priceAmount = isMarket ? marketOrder?.priceAmount : primarySaleItem?.priceAmount;
	const priceCurrencyAddress = isMarket ? marketOrder?.priceCurrencyAddress : primarySaleItem?.currencyAddress;
	const isAnyTransactionPending = isApproving || isExecuting;
	const { data, isLoading: isLoadingBalance } = useHasSufficientBalance({
		chainId,
		value: BigInt(priceAmount || 0),
		tokenAddress: priceCurrencyAddress
	});
	const hasSufficientBalance = data?.hasSufficientBalance ?? false;
	const { sendTransactionAsync } = useSendTransaction();
	const [approvalStep, setApprovalStep] = useState(steps.find((step) => step.id === StepType.tokenApproval));
	const { executeBundledTransactions, isExecuting: isExecutingBundledTransactions, isReady: isBundledTransactionsReady } = useExecuteBundledTransactions({
		chainId,
		approvalStep,
		priceAmount: BigInt(priceAmount || 0)
	});
	const waas = useSelectWaasFeeOptionsStore();
	const { pendingFeeOptionConfirmation, rejectPendingFeeOption } = useWaasFeeOptions$1(chainId, sdkConfig);
	const isSponsored = pendingFeeOptionConfirmation?.options?.length === 0;
	const isFeeSelectionVisible = waas.isVisible || !isSponsored && !!pendingFeeOptionConfirmation?.options;
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
			const errorObj = error$1 instanceof Error ? error$1 : new Error(String(error$1));
			setError({
				title: "Approval failed",
				message: errorObj.message || "Failed to approve token. Please try again.",
				details: errorObj
			});
			console.error("Approval transaction failed:", error$1);
		} finally {
			setIsApproving(false);
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
	const executeBuy = async () => {
		setError(null);
		setIsExecuting(true);
		try {
			onSuccess(await executeBundledTransactions({
				step: buyStep,
				onBalanceInsufficientForFeeOption: handleBalanceInsufficientForWaasFeeOption,
				onTransactionFailed: handleTransactionFailed
			}));
		} catch (error$1) {
			const errorObj = error$1 instanceof Error ? error$1 : new Error(String(error$1));
			setError({
				title: "Purchase failed",
				message: errorObj.message || "Failed to complete purchase. Please try again.",
				details: errorObj
			});
			console.error("Buy transaction failed:", error$1);
		} finally {
			setIsExecuting(false);
		}
	};
	const dismissError = () => {
		setError(null);
	};
	const formattedPrice = formatPrice(BigInt(priceAmount || 0), currency?.decimals || 0);
	const isFree = formattedPrice === "0";
	const renderPriceUSD = () => {
		const priceUSD = marketOrder?.priceUSDFormatted || marketOrder?.priceUSD;
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
	const renderCurrencyPrice = () => {
		if (isFree) return "Free";
		if (Number.parseFloat(formattedPrice) < 1e-4) return /* @__PURE__ */ jsxs("div", {
			className: "flex items-center",
			children: [/* @__PURE__ */ jsx(ChevronLeftIcon, { className: "w-4" }), /* @__PURE__ */ jsxs(Text, { children: ["0.0001 ", currency?.symbol] })]
		});
		return `${formattedPrice} ${currency?.symbol}`;
	};
	const feeStep = isWaaS ? {
		label: "Select Fee",
		status: isSponsored || !!waas.selectedFeeOption ? "success" : isFeeSelectionVisible ? "selecting" : "idle",
		isSponsored,
		isSelecting: isFeeSelectionVisible,
		selectedOption: waas.selectedFeeOption,
		show: () => waas.show(),
		cancel: () => {
			waas.hide();
			if (pendingFeeOptionConfirmation?.id) rejectPendingFeeOption(pendingFeeOptionConfirmation.id);
		}
	} : void 0;
	return {
		data: {
			collectible,
			currency,
			marketOrder,
			collection
		},
		loading: {
			isLoadingBuyModalData,
			isLoadingBalance
		},
		chain: {
			isOnCorrectChain,
			currentChainId
		},
		balance: { hasSufficientBalance },
		transaction: {
			isApproving,
			isExecuting,
			isExecutingBundledTransactions
		},
		error: {
			error,
			dismissError
		},
		steps: {
			approvalStep,
			feeStep
		},
		connector: {
			isSequenceConnector,
			isWaaS
		},
		flags: { isMarket },
		permissions: {
			canApprove: hasSufficientBalance && !isLoadingBalance && !isLoadingBuyModalData && !isAnyTransactionPending && !isFeeSelectionVisible,
			canBuy: hasSufficientBalance && !isLoadingBalance && !isLoadingBuyModalData && (isSequenceConnector ? true : !approvalStep) && !isAnyTransactionPending && !isFeeSelectionVisible && (isShop && !!approvalStep ? isBundledTransactionsReady : true)
		},
		price: {
			formattedPrice,
			renderCurrencyPrice,
			renderPriceUSD
		},
		actions: {
			executeApproval,
			executeBuy
		}
	};
}

//#endregion
//#region src/react/ui/modals/BuyModal/components/CryptoPaymentModalSkeleton.tsx
const CryptoPaymentModalSkeleton = ({ networkMismatch }) => {
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
//#region src/react/ui/modals/BuyModal/components/CryptoPaymentModal.tsx
const CryptoPaymentModal = ({ chainId, steps, onSuccess }) => {
	const { data: { collectible, currency, collection }, loading: { isLoadingBuyModalData, isLoadingBalance }, chain: { isOnCorrectChain, currentChainId }, balance: { hasSufficientBalance }, transaction: { isApproving, isExecuting, isExecutingBundledTransactions }, error: { error, dismissError }, steps: { approvalStep, feeStep }, connector: { isSequenceConnector }, flags: { isMarket }, permissions: { canApprove, canBuy }, price: { formattedPrice, renderCurrencyPrice, renderPriceUSD }, actions: { executeApproval, executeBuy } } = useCryptoPaymentModalContext({
		chainId,
		steps,
		onSuccess
	});
	const { ensureCorrectChainAsync } = useEnsureCorrectChain();
	const [chainSwitchError, setChainSwitchError] = useState(null);
	const handleChainSwitchError = (error$1) => {
		setChainSwitchError({
			title: "Chain switch failed",
			message: `Failed to switch to ${getPresentableChainName(chainId)}. Please try changing the network in your wallet manually.`,
			details: error$1
		});
	};
	const dismissChainSwitchError = () => {
		setChainSwitchError(null);
	};
	const executeWithChainSwitch = async (action) => {
		dismissChainSwitchError();
		try {
			await ensureCorrectChainAsync(chainId);
		} catch (error$1) {
			if (error$1 instanceof Error) handleChainSwitchError(error$1);
		}
		if (action === "approval") await executeApproval();
		else await executeBuy();
	};
	const approvalButtonLabel = isApproving ? /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ jsx(Spinner, { size: "sm" }), " Approving Token..."]
	}) : "Approve Token";
	const buyButtonLabel = isExecuting || isExecutingBundledTransactions ? /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ jsx(Spinner, { size: "sm" }), " Confirming Purchase..."]
	}) : "Buy now";
	if (isLoadingBuyModalData || isLoadingBalance) return /* @__PURE__ */ jsx(CryptoPaymentModalSkeleton, { networkMismatch: !isOnCorrectChain && currentChainId !== void 0 });
	return /* @__PURE__ */ jsx("div", {
		className: "flex w-full flex-col",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col gap-4 p-4",
			children: [
				/* @__PURE__ */ jsx(CollectibleMetadataSummary, {
					checkoutMode: "crypto",
					collectible,
					collection,
					chainId,
					currency,
					formattedPrice,
					renderCurrencyPrice,
					renderPriceUSD,
					isMarket
				}),
				!isLoadingBalance && !isLoadingBuyModalData && !hasSufficientBalance && /* @__PURE__ */ jsxs(Text, {
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
				approvalStep && !isSequenceConnector && /* @__PURE__ */ jsx(Button, {
					onClick: async () => {
						await executeWithChainSwitch("approval");
					},
					disabled: !canApprove,
					variant: "primary",
					size: "lg",
					className: "w-full",
					children: approvalButtonLabel
				}),
				!isLoadingBalance && !isLoadingBuyModalData && /* @__PURE__ */ jsx(Button, {
					onClick: async () => {
						await executeWithChainSwitch("buy");
					},
					disabled: !canBuy,
					variant: "primary",
					size: "lg",
					className: "w-full",
					children: buyButtonLabel
				}),
				feeStep?.isSelecting && /* @__PURE__ */ jsx(selectWaasFeeOptions_default, {
					chainId,
					onCancel: feeStep.cancel,
					titleOnConfirm: "Processing purchase..."
				}),
				(chainSwitchError || error) && /* @__PURE__ */ jsx(ErrorLogBox, {
					title: chainSwitchError?.title ?? error?.title ?? "",
					message: chainSwitchError?.message ?? error?.message ?? "",
					error: chainSwitchError?.details ?? error?.details,
					onDismiss: () => {
						dismissChainSwitchError();
						dismissError();
					}
				})
			]
		})
	});
};

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
//#region src/react/ui/modals/BuyModal/components/sequence-checkout/ERC1155QuantityModal.tsx
const ERC1155QuantityModal = ({ order, quantityRemaining, unlimitedSupply, salePrice, chainId, cardType }) => {
	const minQuantity = 1n;
	const [quantity, setQuantity] = useState(minQuantity);
	const [localInvalidQuantity, setLocalInvalidQuantity] = useState(false);
	const maxQuantity = unlimitedSupply ? maxUint256 : quantityRemaining;
	const invalidQuantity = maxQuantity < minQuantity || localInvalidQuantity;
	const handleSetQuantity = () => {
		buyModalStore.send({
			type: "setQuantity",
			quantity: Number(quantity)
		});
		buyModalStore.send({ type: "openPaymentModal" });
	};
	return /* @__PURE__ */ jsx(ActionModal, {
		chainId,
		onClose: () => buyModalStore.send({ type: "close" }),
		title: "Select Quantity",
		disableAnimation: true,
		type: "buy",
		queries: {},
		primaryAction: {
			label: "Buy now",
			onClick: handleSetQuantity,
			disabled: invalidQuantity
		},
		secondaryAction: {
			label: "Cancel",
			variant: "secondary",
			onClick: () => buyModalStore.send({ type: "close" })
		},
		children: () => {
			return /* @__PURE__ */ jsxs("div", {
				className: "flex w-full flex-col gap-4",
				children: [/* @__PURE__ */ jsx(QuantityInput, {
					quantity,
					invalidQuantity,
					onQuantityChange: setQuantity,
					onInvalidQuantityChange: setLocalInvalidQuantity,
					maxQuantity
				}), /* @__PURE__ */ jsx(TotalPrice, {
					order,
					quantity,
					salePrice,
					chainId,
					cardType
				})]
			});
		}
	});
};
const TotalPrice = ({ order, quantity, salePrice, chainId, cardType }) => {
	const isShop = cardType === "shop";
	const isMarket = cardType === "market";
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const { data: currency, isLoading: isCurrencyLoading } = useCurrency({
		chainId,
		currencyAddress: order ? order.priceCurrencyAddress : salePrice?.currencyAddress
	});
	let error = null;
	let formattedPrice = "0";
	if (isMarket && currency && order) try {
		const marketplaceFeePercentage = (marketplaceConfig?.market?.collections?.find((col) => col.itemsAddress.toLowerCase() === order.collectionContractAddress.toLowerCase() && col.chainId === chainId))?.feePercentage ?? DEFAULT_MARKETPLACE_FEE_PERCENTAGE;
		formattedPrice = formatPriceWithFee(BigInt(order.priceAmount) * quantity, currency.decimals, marketplaceFeePercentage);
	} catch (e) {
		console.error("Error formatting price", e);
		error = "Unable to calculate total price";
	}
	if (isShop && salePrice && currency) formattedPrice = formatPriceWithFee(BigInt(salePrice.amount) * quantity, currency.decimals, 0);
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
		}), /* @__PURE__ */ jsx("div", {
			className: "flex items-center gap-0.5",
			children: !currency || isCurrencyLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-12" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
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
			] })
		})]
	});
};

//#endregion
//#region ../api/src/adapters/marketplace/marketplace.gen.ts
let StepType$1 = /* @__PURE__ */ function(StepType$2) {
	StepType$2["unknown"] = "unknown";
	StepType$2["tokenApproval"] = "tokenApproval";
	StepType$2["buy"] = "buy";
	StepType$2["sell"] = "sell";
	StepType$2["createListing"] = "createListing";
	StepType$2["createOffer"] = "createOffer";
	StepType$2["signEIP712"] = "signEIP712";
	StepType$2["signEIP191"] = "signEIP191";
	StepType$2["cancel"] = "cancel";
	return StepType$2;
}({});

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
//#region src/react/ui/modals/BuyModal/components/sequence-checkout/usePaymentModalParams.ts
const getBuyCollectableParams = async ({ address, chainId, collectionAddress, tokenId, successActionButtons, priceCurrencyAddress, customCreditCardProviderCallback, marketplaceKind, orderId, quantity, skipNativeBalanceCheck, nativeTokenAddress, buyAnalyticsId, onRampProvider, checkoutMode, steps, marketplaceType }) => {
	const checkoutOptions = typeof checkoutMode === "object" ? checkoutMode.options : void 0;
	const buyStep = steps?.find((step) => step.id === StepType$1.buy);
	const approveStep = steps?.find((step) => step.id === StepType$1.tokenApproval);
	const approvedSpenderAddress = approveStep ? decodeERC20Approval(approveStep.data).spender : void 0;
	if (!buyStep) throw new Error("Buy step not found");
	const creditCardProviders = customCreditCardProviderCallback ? ["custom"] : checkoutOptions?.nftCheckout || [];
	const supplementaryAnalyticsInfo = marketplaceType === "market" ? {
		requestId: orderId,
		...marketplaceKind && { marketplaceKind },
		buyAnalyticsId
	} : { marketplaceType: "shop" };
	const totalPrice = BigInt(buyStep.price) * BigInt(quantity);
	return {
		chain: chainId,
		collectibles: [{
			tokenId: tokenId?.toString() ?? "",
			quantity: quantity.toString()
		}],
		currencyAddress: priceCurrencyAddress,
		price: totalPrice.toString(),
		targetContractAddress: buyStep.to,
		approvedSpenderAddress,
		txData: buyStep.data,
		collectionAddress,
		recipientAddress: address,
		creditCardProviders,
		supplementaryAnalyticsInfo,
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
		onRampProvider,
		successActionButtons
	};
};
const usePaymentModalParams = (args) => {
	const { marketplaceKind, priceCurrencyAddress, quantity, steps, marketplaceType } = args;
	const buyModalProps = useBuyModalProps();
	const { checkoutMode } = useBuyModalContext();
	const { chainId, collectionAddress, skipNativeBalanceCheck, nativeTokenAddress, onRampProvider, successActionButtons } = buyModalProps;
	const tokenId = isMarketProps(buyModalProps) ? buyModalProps.tokenId : buyModalProps.item.tokenId;
	const orderId = isMarketProps(buyModalProps) ? buyModalProps.orderId : "";
	const customCreditCardProviderCallback = isMarketProps(buyModalProps) ? buyModalProps.customCreditCardProviderCallback : void 0;
	const buyAnalyticsId = useBuyAnalyticsId();
	const { address } = useAccount();
	return useQuery({
		queryKey: [
			"buyCollectableParams",
			buyModalProps,
			args
		],
		queryFn: !!address && !!priceCurrencyAddress && !!quantity && !!steps && (marketplaceType === "market" ? !!marketplaceKind : true) ? () => getBuyCollectableParams({
			chainId,
			address,
			collectionAddress,
			tokenId,
			marketplaceKind,
			orderId,
			quantity,
			priceCurrencyAddress,
			successActionButtons,
			customCreditCardProviderCallback,
			skipNativeBalanceCheck,
			nativeTokenAddress,
			buyAnalyticsId,
			onRampProvider,
			checkoutMode,
			steps,
			marketplaceType
		}) : skipToken,
		retry: false
	});
};

//#endregion
//#region src/react/ui/modals/BuyModal/components/sequence-checkout/SequenceCheckoutNew.tsx
const SequenceCheckout = ({ steps, contractType, primarySaleItem }) => {
	const modalProps = useBuyModalProps();
	const isMarket = isMarketProps(modalProps);
	const isShop = isShopProps(modalProps);
	const paymentModalState = usePaymentModalState();
	const { chainId, collectionAddress, hideQuantitySelector } = modalProps;
	const orderId = isMarket ? modalProps.orderId : "";
	const marketplaceKind = isMarket ? modalProps.marketplace : void 0;
	const { data: marketOrders } = useOrders({
		chainId,
		input: marketplaceKind && orderId ? [{
			contractAddress: collectionAddress,
			orderId,
			marketplace: marketplaceKind
		}] : [],
		query: { enabled: isMarket && !!orderId && !!marketplaceKind }
	});
	const marketOrder = marketOrders?.orders[0];
	const paymentModalParams = usePaymentModalParams({
		quantity: useQuantity(),
		marketplaceKind,
		priceCurrencyAddress: isMarket ? marketOrder?.priceCurrencyAddress : primarySaleItem?.currencyAddress,
		steps,
		marketplaceType: isMarket ? "market" : "shop"
	});
	if (!hideQuantitySelector && contractType === ContractType$1.ERC1155 && paymentModalState === "idle") {
		const quantityRemaining = isMarket ? marketOrder?.quantityRemaining : primarySaleItem?.supply;
		const unlimitedSupply = isShop && primarySaleItem?.unlimitedSupply ? primarySaleItem?.unlimitedSupply : false;
		return /* @__PURE__ */ jsx(ERC1155QuantityModal, {
			order: marketOrder,
			cardType: isMarket ? "market" : "shop",
			salePrice: isShop ? {
				amount: primarySaleItem?.priceAmount || 0n,
				currencyAddress: primarySaleItem?.currencyAddress
			} : void 0,
			quantityRemaining: quantityRemaining ?? 0n,
			unlimitedSupply,
			chainId
		});
	}
	if (paymentModalState === "closed") return null;
	return /* @__PURE__ */ jsx(ActionModal, {
		onClose: () => {
			buyModalStore.send({ type: "close" });
		},
		type: "buy",
		chainId,
		queries: { paymentModalParams },
		title: "Checkout",
		onErrorDismiss: () => {
			buyModalStore.send({ type: "close" });
		},
		onErrorAction: () => {
			buyModalStore.send({ type: "close" });
		},
		children: ({ paymentModalParams: paymentModalParams$1 }) => {
			if (!steps) return /* @__PURE__ */ jsxs("div", {
				className: "flex h-24 items-center justify-center gap-4",
				children: [/* @__PURE__ */ jsx(Spinner, { size: "lg" }), /* @__PURE__ */ jsx(Text, {
					className: "pulse",
					children: "Loading checkout"
				})]
			});
			return /* @__PURE__ */ jsx(PaymentModalOpener, { paymentModalParams: paymentModalParams$1 });
		}
	});
};
const PaymentModalOpener = ({ paymentModalParams }) => {
	const { openSelectPaymentModal } = useSelectPaymentModal();
	useEffect(() => {
		if (paymentModalParams) {
			openSelectPaymentModal(paymentModalParams);
			buyModalStore.send({ type: "openPaymentModal" });
		}
	}, [paymentModalParams, openSelectPaymentModal]);
	return null;
};
var SequenceCheckoutNew_default = SequenceCheckout;

//#endregion
//#region src/react/ui/modals/BuyModal/components/TrailsCss.ts
/**
* Custom CSS to style the Trails widget to match the Sequence Marketplace SDK design system.
*
* This CSS overrides the Trails widget's default theme variables with Sequence design tokens.
* The CSS is injected into the Trails widget's shadow DOM via the customCss prop.
*
* Note: The ShadowPortal wraps CSS variables in :root/:host selectors, but we provide
* the full CSS string here including both variable declarations and class overrides.
*
* Color mapping (Sequence Design System -> Trails Variables):
* - seq-color-background-primary (#000000 black) -> trails-bg-primary
* - seq-color-background-secondary (#18181b zinc-900) -> trails-bg-secondary
* - seq-color-background-raised (#27272a zinc-800) -> trails-bg-card, trails-bg-tertiary
* - seq-color-background-muted (#09090b zinc-950) -> used for inputs/dropdowns
* - seq-color-border-normal (#3f3f46 zinc-700) -> trails-border-primary
* - seq-color-border-hover (#52525b zinc-600) -> trails-border-secondary
* - seq-color-border-focus (#8b5cf6 violet-500) -> focus borders
*/
const TRAILS_CUSTOM_CSS = `
}

/* ========================================
 * CSS Variable Overrides - Match Sequence Design System
 * These are wrapped in :root/:host by ShadowPortal
 * ======================================== */

:root, :host, [data-theme="dark"] {
  /* Background Colors */
  --trails-bg-primary: rgb(0 0 0) !important;
  --trails-bg-secondary: rgb(24 24 27) !important;
  --trails-bg-secondary-hover: rgb(39 39 42) !important;
  --trails-bg-secondary-focus-border: rgb(63 63 70) !important;
  --trails-bg-tertiary: rgb(39 39 42) !important;
  --trails-bg-card: rgb(24 24 27) !important;
  --trails-bg-overlay: rgb(0 0 0) !important;
  
  /* Text Colors */
  --trails-text-primary: rgb(255 255 255) !important;
  --trails-text-secondary: rgba(255 255 255 / 0.8) !important;
  --trails-text-tertiary: rgba(255 255 255 / 0.6) !important;
  --trails-text-muted: rgb(113 113 122) !important;
  --trails-text-inverse: rgb(0 0 0) !important;
  
  /* Border Colors */
  --trails-border-primary: rgb(63 63 70) !important;
  --trails-border-secondary: rgb(82 82 91) !important;
  --trails-border-tertiary: rgb(39 39 42) !important;
  
  /* Interactive Colors */
  --trails-hover-bg: rgb(24 24 27) !important;
  --trails-hover-text: rgb(255 255 255) !important;
  
  /* Input Field Colors */
  --trails-input-bg: rgb(0 0 0) !important;
  --trails-input-border: rgb(39 39 42) !important;
  --trails-input-text: rgb(255 255 255) !important;
  --trails-input-placeholder: rgb(113 113 122) !important;
  --trails-input-focus-border: rgb(139 92 246) !important;
  
  /* Dropdown Colors */
  --trails-dropdown-bg: rgb(0 0 0) !important;
  --trails-dropdown-border: rgb(39 39 42) !important;
  --trails-dropdown-text: rgb(255 255 255) !important;
  --trails-dropdown-hover-bg: rgb(24 24 27) !important;
  --trails-dropdown-selected-bg: rgb(39 39 42) !important;
  --trails-dropdown-selected-text: rgb(255 255 255) !important;
  --trails-dropdown-focus-border: rgb(139 92 246) !important;
  
  /* Modal Button Colors */
  --trails-modal-button-bg: transparent !important;
  --trails-modal-button-hover-bg: rgba(255 255 255 / 0.1) !important;
  --trails-modal-button-text: rgb(255 255 255) !important;
  --trails-modal-button-shadow: 0 1px 2px 0 rgba(0 0 0 / 0.1) !important;
  
  /* Token List Colors */
  --trails-list-bg: rgb(0 0 0) !important;
  --trails-list-border: rgb(39 39 42) !important;
  --trails-list-hover-bg: rgb(24 24 27) !important;
  --trails-list-item-bg: transparent !important;
  --trails-list-item-selected-bg: rgb(39 39 42) !important;
  
  /* Widget Border and Radius */
  --trails-widget-border: none !important;
  --trails-border-radius-widget: 24px !important;
  --trails-border-radius-button: 8px !important;
  --trails-border-radius-input: 8px !important;
  --trails-border-radius-dropdown: 8px !important;
  --trails-border-radius-container: 8px !important;
  --trails-border-radius-list: 8px !important;
  --trails-border-radius-list-button: 8px !important;
  --trails-border-radius-large-button: 8px !important;
  
  /* Status Colors */
  --trails-success-bg: rgba(34 197 94 / 0.2) !important;
  --trails-success-text: rgb(34 197 94) !important;
  --trails-success-border: rgba(34 197 94 / 0.3) !important;
  
  --trails-warning-bg: rgba(234 179 8 / 0.2) !important;
  --trails-warning-text: rgb(234 179 8) !important;
  --trails-warning-border: rgba(234 179 8 / 0.3) !important;
  
  --trails-error-bg: rgba(239 68 68 / 0.2) !important;
  --trails-error-text: rgb(239 68 68) !important;
  --trails-error-border: rgba(239 68 68 / 0.3) !important;
  
  /* Shadow */
  --trails-shadow: 0 4px 6px -1px rgba(0 0 0 / 0.1), 0 2px 4px -1px rgba(0 0 0 / 0.06) !important;
  
  /* Primary Button */
  --trails-primary: rgb(255 255 255) !important;
  --trails-primary-hover: rgba(255 255 255 / 0.9) !important;
  --trails-primary-disabled: rgb(63 63 70) !important;
  --trails-primary-disabled-text: rgb(113 113 122) !important;
  
  /* Percentage Button Colors */
  --trails-percentage-button-bg: rgb(24 24 27) !important;
  --trails-percentage-button-text: rgb(161 161 170) !important;
  --trails-percentage-button-hover-bg: rgb(39 39 42) !important;
  
  /* Font Family */
  --trails-font-family: 'Inter', ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
}

/* ========================================
 * Direct Tailwind Class Overrides
 * Override hard-coded Tailwind classes used in Trails components
 * ======================================== */

/* White backgrounds -> black */
.bg-white,
.dark\\:bg-gray-900 {
  background-color: rgb(0 0 0) !important;
}

/* Gray-800 backgrounds -> black */
.bg-gray-800,
.dark\\:bg-gray-800 {
  background-color: rgb(0 0 0) !important;
}

/* Gray-700 backgrounds -> zinc-800 */
.bg-gray-700,
.dark\\:bg-gray-700 {
  background-color: rgb(39 39 42) !important;
}

/* Hover states */
.hover\\:bg-gray-50:hover {
  background-color: rgb(24 24 27) !important;
}

.dark\\:hover\\:bg-gray-800:hover {
  background-color: rgb(24 24 27) !important;
}

.dark\\:hover\\:bg-gray-700:hover {
  background-color: rgb(39 39 42) !important;
}

/* Focus states */
.focus-within\\:\\!bg-white:focus-within {
  background-color: rgb(0 0 0) !important;
}

.dark\\:focus-within\\:\\!bg-gray-800:focus-within {
  background-color: rgb(0 0 0) !important;
}

/* Border colors */
.border-gray-200 {
  border-color: rgb(39 39 42) !important;
}

.dark\\:border-gray-700 {
  border-color: rgb(39 39 42) !important;
}

.border-gray-300 {
  border-color: rgb(63 63 70) !important;
}

.dark\\:border-gray-600 {
  border-color: rgb(63 63 70) !important;
}

/* Text colors */
.text-gray-900 {
  color: rgb(255 255 255) !important;
}

.dark\\:text-white {
  color: rgb(255 255 255) !important;
}

.text-gray-500,
.dark\\:text-gray-400 {
  color: rgb(161 161 170) !important;
}

.text-black,
.dark\\:text-blue-300 {
  color: rgb(255 255 255) !important;
}

/* Primary button gradient - Match Sequence design */
.bg-blue-500 {
  background: linear-gradient(89.69deg, #4411e1 0.27%, #7537f9 99.73%) !important;
}

.hover\\:bg-blue-600:hover {
  background: linear-gradient(89.69deg, #3a0ec7 0.27%, #6229e0 99.73%) !important;
  opacity: 0.9;
}

{
`;

//#endregion
//#region src/react/ui/modals/BuyModal/components/BuyModalContent.tsx
const BuyModalContent = () => {
	const { config, modalProps, close, steps, primarySaleItem, marketOrder, collectible, buyStep, isLoading, collection, checkoutMode, formattedAmount, isShop, handleTrailsSuccess, handleTransactionSuccess, error, refetchAll } = useBuyModalContext();
	const currencyAddress = isShop ? primarySaleItem?.currencyAddress : marketOrder?.priceCurrencyAddress;
	const trailsApiUrl = getTrailsApiUrl(config);
	const sequenceIndexerUrl = getSequenceIndexerUrl(config);
	const sequenceNodeGatewayUrl = getSequenceNodeGatewayUrl(config);
	const sequenceApiUrl = getSequenceApiUrl(config);
	if (error) return /* @__PURE__ */ jsx(Modal, {
		isDismissible: true,
		onClose: close,
		overlayProps: MODAL_OVERLAY_PROPS,
		contentProps: {
			style: {
				width: "400px",
				height: "auto"
			},
			className: "overflow-y-auto"
		},
		children: /* @__PURE__ */ jsx(ModalInitializationError, {
			error,
			onTryAgain: refetchAll,
			onClose: close
		})
	});
	if (typeof checkoutMode === "object" && checkoutMode.mode === "sequence-checkout") return /* @__PURE__ */ jsx(SequenceCheckoutNew_default, {
		steps,
		contractType: collection?.type,
		primarySaleItem
	});
	return /* @__PURE__ */ jsxs(Dialog, {
		open: true,
		onOpenChange: (open) => !open && close(),
		children: [/* @__PURE__ */ jsx(DialogOverlay, { style: MODAL_OVERLAY_PROPS.style }), /* @__PURE__ */ jsx(DialogContent, {
			className: "h-auto w-[450px] overflow-y-auto overflow-x-hidden",
			children: /* @__PURE__ */ jsxs("div", {
				className: "relative flex grow flex-col items-center",
				children: [
					/* @__PURE__ */ jsx(Text, {
						className: "w-full text-center font-body font-bold text-large text-text-100",
						children: "Complete Your Purchase"
					}),
					isLoading && /* @__PURE__ */ jsx("div", {
						className: "flex w-full items-center justify-center py-8",
						children: /* @__PURE__ */ jsx(ProgressiveLoadingMessage, {})
					}),
					!isLoading && (checkoutMode === "crypto" || isShop && primarySaleItem?.priceAmount === 0n) && steps && steps.length > 0 && /* @__PURE__ */ jsx(CryptoPaymentModal, {
						chainId: modalProps.chainId,
						steps,
						onSuccess: handleTransactionSuccess
					}),
					!isLoading && checkoutMode === "trails" && buyStep && !(isShop && primarySaleItem?.priceAmount === 0n) && /* @__PURE__ */ jsxs("div", {
						className: "pointer-events-auto w-full",
						children: [collectible && /* @__PURE__ */ jsx(CollectibleMetadataSummary, {
							checkoutMode: "trails",
							collectible,
							collection
						}), /* @__PURE__ */ jsx(TrailsWidget, {
							apiKey: config.projectAccessKey,
							trailsApiUrl,
							sequenceIndexerUrl,
							sequenceNodeGatewayUrl,
							sequenceApiUrl,
							walletConnectProjectId: config.walletConnectProjectId,
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
							payMessage: "{TO_TOKEN_IMAGE}{TO_AMOUNT}{TO_TOKEN_SYMBOL}{TO_AMOUNT_USD}"
						})]
					})
				]
			})
		})]
	});
};
const ProgressiveLoadingMessage = () => {
	const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
	const timerRef = useRef(null);
	if (!timerRef.current) timerRef.current = setTimeout(() => {
		setShowSecondaryMessage(true);
	}, 3e3);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-4",
		children: [/* @__PURE__ */ jsx("div", {
			className: cn$1("transition-all duration-300", showSecondaryMessage ? "h-10 w-10" : "h-5 w-5"),
			children: /* @__PURE__ */ jsx(Spinner, { className: "h-full w-full transition-all duration-150" })
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ jsx("p", {
				className: "animate-pulse text-text-100",
				children: "Loading payment options..."
			}), showSecondaryMessage && /* @__PURE__ */ jsx("p", {
				className: "text-small text-text-50",
				children: "This is taking longer than expected."
			})]
		})]
	});
};

//#endregion
//#region src/react/ui/modals/BuyModal/components/Modal.tsx
const BuyModal = () => {
	if (!useIsOpen()) return null;
	return /* @__PURE__ */ jsx(BuyModalContent, {});
};

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
		priceAmountRaw: price.amountRaw?.toString() || "0",
		priceCurrencyAddress: price.currency.contractAddress,
		compareToPriceAmountRaw: floorPriceRaw?.toString() || "0",
		compareToPriceCurrencyAddress: listing?.priceCurrencyAddress || price.currency.contractAddress,
		query: { enabled: !!floorPriceRaw && !listingLoading && price.amountRaw !== 0n }
	});
	if (!floorPriceRaw || listingLoading || price.amountRaw === 0n || comparisonLoading) return null;
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
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" },
		offerCurrency: {
			symbol: "WETH",
			address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
		},
		listingCurrency: {
			symbol: "ETH",
			address: zeroAddress
		}
	},
	"10": {
		chainId: 10,
		openseaId: "optimism",
		name: "Optimism",
		nativeCurrency: {
			symbol: "ETH",
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0x4200000000000000000000000000000000000006" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x4200000000000000000000000000000000000006"
		},
		listingCurrency: {
			symbol: "ETH",
			address: zeroAddress
		}
	},
	"137": {
		chainId: 137,
		openseaId: "matic",
		name: "Polygon",
		nativeCurrency: {
			symbol: "POL",
			address: zeroAddress
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
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0x4200000000000000000000000000000000000006" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x4200000000000000000000000000000000000006"
		},
		listingCurrency: {
			symbol: "ETH",
			address: zeroAddress
		}
	},
	"998": {
		chainId: 998,
		openseaId: "hyperevm",
		name: "HyperEVM",
		nativeCurrency: {
			symbol: "HYPE",
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0x5555555555555555555555555555555555555555" },
		offerCurrency: {
			symbol: "WHYPE",
			address: "0x5555555555555555555555555555555555555555"
		},
		listingCurrency: {
			symbol: "HYPE",
			address: zeroAddress
		}
	},
	"130": {
		chainId: 130,
		openseaId: "unichain",
		name: "Unichain",
		nativeCurrency: {
			symbol: "ETH",
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0x4200000000000000000000000000000000000006" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x4200000000000000000000000000000000000006"
		},
		listingCurrency: {
			symbol: "ETH",
			address: zeroAddress
		}
	},
	"1329": {
		chainId: 1329,
		openseaId: "sei",
		name: "Sei",
		nativeCurrency: {
			symbol: "SEI",
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7" },
		offerCurrency: {
			symbol: "WSEI",
			address: "0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7"
		},
		listingCurrency: {
			symbol: "SEI",
			address: zeroAddress
		}
	},
	"1868": {
		chainId: 1868,
		openseaId: "soneium",
		name: "Soneium",
		nativeCurrency: {
			symbol: "ETH",
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0x4200000000000000000000000000000000000006" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x4200000000000000000000000000000000000006"
		},
		listingCurrency: {
			symbol: "ETH",
			address: zeroAddress
		}
	},
	"2020": {
		chainId: 2020,
		openseaId: "ronin",
		name: "Ronin",
		nativeCurrency: {
			symbol: "RON",
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0xe514d9deb7966c8be0ca922de8a064264ea6bcd4" },
		offerCurrency: {
			symbol: "WRON",
			address: "0xe514d9deb7966c8be0ca922de8a064264ea6bcd4"
		},
		listingCurrency: {
			symbol: "RON",
			address: zeroAddress
		}
	},
	"2741": {
		chainId: 2741,
		openseaId: "abstract",
		name: "Abstract",
		nativeCurrency: {
			symbol: "ETH",
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0x3439153eb7af838ad19d56e1571fbd09333c2809" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x3439153eb7af838ad19d56e1571fbd09333c2809"
		},
		listingCurrency: {
			symbol: "ETH",
			address: zeroAddress
		}
	},
	"8333": {
		chainId: 8333,
		openseaId: "b3",
		name: "B3",
		nativeCurrency: {
			symbol: "ETH",
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0x4200000000000000000000000000000000000006" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x4200000000000000000000000000000000000006"
		},
		listingCurrency: {
			symbol: "ETH",
			address: zeroAddress
		}
	},
	"8453": {
		chainId: 8453,
		openseaId: "base",
		name: "Base",
		nativeCurrency: {
			symbol: "ETH",
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0x4200000000000000000000000000000000000006" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x4200000000000000000000000000000000000006"
		},
		listingCurrency: {
			symbol: "ETH",
			address: zeroAddress
		}
	},
	"33139": {
		chainId: 33139,
		openseaId: "ape_chain",
		name: "ApeChain",
		nativeCurrency: {
			symbol: "APE",
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0x48b62137edfa95a428d35c09e44256a739f6b557" },
		offerCurrency: {
			symbol: "WAPE",
			address: "0x48b62137edfa95a428d35c09e44256a739f6b557"
		},
		listingCurrency: {
			symbol: "APE",
			address: zeroAddress
		}
	},
	"42161": {
		chainId: 42161,
		openseaId: "arbitrum",
		name: "Arbitrum",
		nativeCurrency: {
			symbol: "ETH",
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1"
		},
		listingCurrency: {
			symbol: "ETH",
			address: zeroAddress
		}
	},
	"42170": {
		chainId: 42170,
		openseaId: "arbitrum_nova",
		name: "Arbitrum Nova",
		nativeCurrency: {
			symbol: "ETH",
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0x722e8bdd2ce80a4422e880164f2079488e115365" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x722e8bdd2ce80a4422e880164f2079488e115365"
		},
		listingCurrency: {
			symbol: "ETH",
			address: zeroAddress
		}
	},
	"43114": {
		chainId: 43114,
		openseaId: "avalanche",
		name: "Avalanche",
		nativeCurrency: {
			symbol: "AVAX",
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7" },
		offerCurrency: {
			symbol: "WAVAX",
			address: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"
		},
		listingCurrency: {
			symbol: "AVAX",
			address: zeroAddress
		}
	},
	"43419": {
		chainId: 43419,
		openseaId: "gunzilla",
		name: "GUNZ",
		nativeCurrency: {
			symbol: "GUN",
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0x5aad7bba61d95c2c4e525a35f4062040264611f1" },
		offerCurrency: {
			symbol: "WGUN",
			address: "0x5aad7bba61d95c2c4e525a35f4062040264611f1"
		},
		listingCurrency: {
			symbol: "GUN",
			address: zeroAddress
		}
	},
	"50311": {
		chainId: 50311,
		openseaId: "somnia",
		name: "Somnia",
		nativeCurrency: {
			symbol: "SOMI",
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0x046ede9564a72571df6f5e44d0405360c0f4dcab" },
		offerCurrency: {
			symbol: "WSOMI",
			address: "0x046ede9564a72571df6f5e44d0405360c0f4dcab"
		},
		listingCurrency: {
			symbol: "SOMI",
			address: zeroAddress
		}
	},
	"80094": {
		chainId: 80094,
		openseaId: "bera_chain",
		name: "Berachain",
		nativeCurrency: {
			symbol: "BERA",
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0x6969696969696969696969696969696969696969" },
		offerCurrency: {
			symbol: "WBERA",
			address: "0x6969696969696969696969696969696969696969"
		},
		listingCurrency: {
			symbol: "BERA",
			address: zeroAddress
		}
	},
	"81457": {
		chainId: 81457,
		openseaId: "blast",
		name: "Blast",
		nativeCurrency: {
			symbol: "ETH",
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0x4300000000000000000000000000000000000004" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x4300000000000000000000000000000000000004"
		},
		listingCurrency: {
			symbol: "ETH",
			address: zeroAddress
		}
	},
	"7777777": {
		chainId: 7777777,
		openseaId: "zora",
		name: "Zora",
		nativeCurrency: {
			symbol: "ETH",
			address: zeroAddress
		},
		wrappedNativeCurrency: { address: "0x4200000000000000000000000000000000000006" },
		offerCurrency: {
			symbol: "WETH",
			address: "0x4200000000000000000000000000000000000006"
		},
		listingCurrency: {
			symbol: "ETH",
			address: zeroAddress
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
function PriceInput({ chainId, collectionAddress, price, onPriceChange, onCurrencyChange, checkBalance, secondCurrencyAsDefault, includeNativeCurrency, disabled, orderbookKind, modalType, feeData }) {
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
		currencyAddress: currencyAddress ?? zeroAddress,
		amountRaw: priceAmountRaw?.toString(),
		query: { enabled: orderbookKind === OrderbookKind.opensea && !!currencyAddress && !!priceAmountRaw }
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
	const balanceError = !!checkBalance?.enabled && !!isBalanceSuccess && !!priceAmountRaw && !!currencyDecimals && getTotalRequiredBalance() > (balance?.value || 0n);
	const hasEnoughForBaseOffer = !!isBalanceSuccess && !!priceAmountRaw && BigInt(priceAmountRaw) <= (balance?.value || 0n);
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
	const openseaLowestPriceCriteriaMet = orderbookKind === OrderbookKind.opensea && conversion?.usdAmount !== void 0 && conversion.usdAmount >= .01;
	if (checkBalance?.enabled) checkBalance.callback(balanceError);
	const [value, setValue] = useState("0");
	const prevCurrencyDecimals = useRef(currencyDecimals);
	const [openseaDecimalError, setOpenseaDecimalError] = useState(null);
	useEffect(() => {
		if (prevCurrencyDecimals.current !== currencyDecimals && value !== "0" && price && onPriceChange) try {
			const parsedAmount = parseUnits(value, Number(currencyDecimals));
			onPriceChange({
				...price,
				amountRaw: parsedAmount
			});
		} catch {
			onPriceChange({
				...price,
				amountRaw: 0n
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
						amountRaw: parsedAmount
					});
				} catch {
					onPriceChange({
						...price,
						amountRaw: 0n
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
				amountRaw: parsedAmount
			});
		} catch {
			onPriceChange({
				...price,
				amountRaw: 0n
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
			!balanceError && priceAmountRaw !== 0n && !openseaLowestPriceCriteriaMet && orderbookKind === OrderbookKind.opensea && !isConversionLoading && modalType === "offer" && !openseaDecimalError && /* @__PURE__ */ jsx(Text, {
				className: "absolute -bottom-5 font-body font-medium text-xs",
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
//#region src/react/ui/modals/_internal/helpers/currency.ts
function filterCurrenciesForOrderbook(currencies, orderbookKind, chainId, side) {
	if (!currencies || currencies.length === 0) return [];
	if (orderbookKind === OrderbookKind.opensea) {
		const openseaCurrency = getOpenseaCurrencyForChain(chainId, side);
		if (openseaCurrency) return currencies.filter((currency) => compareAddress(currency.contractAddress, openseaCurrency.address));
	}
	return currencies;
}
function getDefaultCurrency(currencies, orderbookKind, modalType) {
	if (currencies.length === 0) return null;
	if (modalType === "listing") return currencies[0];
	return orderbookKind !== OrderbookKind.sequence_marketplace_v2 && currencies.length > 1 ? currencies[1] : currencies[0];
}

//#endregion
//#region src/react/ui/modals/_internal/helpers/dnum-utils.ts
function isPositive(value) {
	return value[0] > 0n;
}
function fromBigIntString(bigIntString, decimals) {
	try {
		return [BigInt(bigIntString), decimals];
	} catch {
		return [0n, decimals];
	}
}

//#endregion
//#region src/react/ui/modals/CreateListingModal/internal/helpers/validation.ts
function validateListingForm({ price, quantity, balance }) {
	const validation = {
		price: {
			isValid: true,
			error: null
		},
		quantity: {
			isValid: true,
			error: null
		}
	};
	if (!isPositive(price)) validation.price = {
		isValid: false,
		error: "Price must be greater than 0"
	};
	if (!isPositive(quantity)) validation.quantity = {
		isValid: false,
		error: "Quantity must be greater than 0"
	};
	if (balance && greaterThan(quantity, balance)) validation.balance = {
		isValid: false,
		error: "Insufficient balance for this quantity"
	};
	return validation;
}
function isFormValid$1(validation) {
	return validation.price.isValid && validation.quantity.isValid && (validation.balance?.isValid ?? true);
}

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
//#region src/react/ui/modals/CreateListingModal/internal/store.ts
const initialContext$2 = {
	isOpen: false,
	collectionAddress: "",
	chainId: 0,
	tokenId: 0n,
	priceInput: "",
	currencyAddress: void 0,
	quantityInput: "1",
	expiryDays: 7,
	isPriceTouched: false,
	isQuantityTouched: false
};
const createListingModalStore = createStore({
	context: { ...initialContext$2 },
	on: {
		open: (_context, event) => ({
			...initialContext$2,
			isOpen: true,
			...event,
			expiryDays: 7,
			priceInput: "",
			quantityInput: "1",
			isPriceTouched: false,
			isQuantityTouched: false
		}),
		close: () => ({ ...initialContext$2 }),
		updatePrice: (context, event) => {
			const isBlurNormalization = context.priceInput === "" && event.value === "0";
			const shouldMarkTouched = context.priceInput !== event.value && !isBlurNormalization;
			return {
				...context,
				priceInput: event.value,
				isPriceTouched: shouldMarkTouched ? true : context.isPriceTouched
			};
		},
		touchPrice: (context) => ({
			...context,
			isPriceTouched: true
		}),
		selectCurrency: (context, event) => ({
			...context,
			currencyAddress: event.address
		}),
		updateQuantity: (context, event) => ({
			...context,
			quantityInput: event.value,
			isQuantityTouched: true
		}),
		touchQuantity: (context) => ({
			...context,
			isQuantityTouched: true
		}),
		updateExpiryDays: (context, event) => ({
			...context,
			expiryDays: event.days
		})
	}
});
const useCreateListingModalState = () => {
	const { isOpen, tokenId, collectionAddress, chainId, priceInput, currencyAddress, quantityInput, expiryDays, isPriceTouched, isQuantityTouched } = useSelector(createListingModalStore, (state) => state.context);
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const orderbookKind = findMarketCollection(marketplaceConfig?.market.collections ?? [], collectionAddress, chainId)?.destinationMarketplace;
	const closeModal = () => createListingModalStore.send({ type: "close" });
	const updatePriceInput = (value) => createListingModalStore.send({
		type: "updatePrice",
		value
	});
	const touchPriceInput = () => createListingModalStore.send({ type: "touchPrice" });
	const updateCurrency = (address) => createListingModalStore.send({
		type: "selectCurrency",
		address
	});
	const updateQuantityInput = (value) => createListingModalStore.send({
		type: "updateQuantity",
		value
	});
	const touchQuantityInput = () => createListingModalStore.send({ type: "touchQuantity" });
	const updateExpiryDays = (days) => createListingModalStore.send({
		type: "updateExpiryDays",
		days
	});
	return {
		isOpen,
		tokenId,
		collectionAddress,
		chainId,
		priceInput,
		currencyAddress,
		quantityInput,
		expiryDays,
		isPriceTouched,
		isQuantityTouched,
		orderbookKind,
		closeModal,
		updatePriceInput,
		touchPriceInput,
		updateCurrency,
		updateQuantityInput,
		touchQuantityInput,
		updateExpiryDays
	};
};

//#endregion
//#region src/react/ui/modals/CreateListingModal/internal/listing-mutations.ts
const useListingMutations = ({ chainId, collectionAddress, contractType, orderbookKind, listing, currencyDecimals, nftApprovalEnabled = true }) => {
	const sdkConfig = useConfig();
	const { address: ownerAddress } = useAccount();
	const publicClient = usePublicClient();
	const { show: showTxModal } = useTransactionStatusModal();
	const analytics = useAnalytics();
	const state = useCreateListingModalState();
	const { processStep } = useProcessStep();
	const { walletKind, isSequence } = useConnectorMetadata();
	const canBeBundled = isSequence && orderbookKind === OrderbookKind.sequence_marketplace_v2;
	const { data: currency } = useCurrency({
		chainId,
		currencyAddress: listing.currencyAddress
	});
	async function executeStepAndWait(step) {
		const res = await processStep(step, chainId);
		if (res.type === "transaction" && res.hash) await waitForTransactionReceipt({
			txHash: res.hash,
			chainId,
			sdkConfig
		});
		return res;
	}
	async function generateListingSteps() {
		if (!contractType) throw new Error("Contract type is required to generate listing steps");
		if (!ownerAddress) throw new Error("Wallet not connected");
		if (!orderbookKind) throw new Error("Orderbook kind is required");
		const marketplaceClient = getMarketplaceClient(sdkConfig);
		const request = {
			chainId,
			collectionAddress,
			owner: ownerAddress,
			walletType: walletKind,
			contractType,
			orderbook: orderbookKind,
			listing: {
				tokenId: listing.tokenId,
				quantity: listing.quantity,
				expiry: listing.expiry,
				currencyAddress: listing.currencyAddress,
				pricePerToken: listing.pricePerToken
			},
			additionalFees: []
		};
		const steps = (await marketplaceClient.generateListingTransaction(request)).steps;
		if (steps.length === 0) throw new Error("No steps generated");
		return steps;
	}
	const spenderAddress = getConduitAddressForOrderbook(orderbookKind);
	const collectibleApprovalQuery = useCollectibleApproval({
		collectionAddress,
		spenderAddress,
		chainId,
		contractType,
		enabled: nftApprovalEnabled && !canBeBundled && !!ownerAddress && !!contractType && !!orderbookKind && !!spenderAddress
	});
	const needsApproval = useMemo(() => {
		if (canBeBundled) return false;
		if (collectibleApprovalQuery.isApproved === void 0) return true;
		return !collectibleApprovalQuery.isApproved;
	}, [collectibleApprovalQuery.isApproved, canBeBundled]);
	return {
		approve: useMutation({ mutationFn: async () => {
			const approvalStep = (await generateListingSteps()).find((step) => step.id === StepType.tokenApproval);
			if (!approvalStep) throw new Error("No approval step found");
			return await executeStepAndWait(approvalStep);
		} }),
		createListing: useMutation({
			mutationFn: async () => {
				const listingSteps = (await generateListingSteps()).filter((step) => step.id !== StepType.tokenApproval);
				if (listingSteps.length === 0) throw new Error("No listing steps found");
				let hash;
				let orderId;
				for (const step of listingSteps) {
					const res = await executeStepAndWait(step);
					if (res.type === "transaction") hash = res.hash;
					else if (res.type === "signature") orderId = res.orderId;
				}
				if (currency && ownerAddress) {
					const currencyValueRaw = Number(listing.pricePerToken.toString());
					const currencyValueDecimal = toNumber(fromBigIntString(listing.pricePerToken.toString(), currencyDecimals));
					let requestId = orderId;
					if (hash && (orderbookKind === OrderbookKind.sequence_marketplace_v1 || orderbookKind === OrderbookKind.sequence_marketplace_v2) && publicClient) requestId = await getSequenceMarketplaceRequestId(hash, publicClient, ownerAddress);
					analytics.trackCreateListing({
						props: {
							orderbookKind: orderbookKind || OrderbookKind.sequence_marketplace_v2,
							collectionAddress,
							currencyAddress: listing.currencyAddress,
							currencySymbol: currency.symbol || "",
							tokenId: listing.tokenId.toString(),
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
				return {
					hash,
					orderId
				};
			},
			onSuccess: (res) => {
				state.closeModal();
				showTxModal({
					type: TransactionType$1.LISTING,
					chainId,
					hash: res.hash,
					orderId: res.orderId,
					collectionAddress,
					tokenId: state.tokenId,
					queriesToInvalidate: [
						["collectible", "market-lowest-listing"],
						["collectible", "market-listings"],
						["collectible", "market-count-listings"],
						["token", "balances"]
					]
				});
			}
		}),
		needsApproval,
		nftApprovalQuery: collectibleApprovalQuery
	};
};

//#endregion
//#region src/react/ui/modals/CreateListingModal/internal/context.ts
function useCreateListingModalContext() {
	const state = useCreateListingModalState();
	const { address } = useAccount();
	const config = useConfig();
	const collectionQuery = useCollectionMetadata({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress
	});
	const currenciesQuery = useCurrencyList({
		chainId: state.chainId,
		includeNativeCurrency: true
	});
	const collectibleBalanceQuery = useCollectibleBalance({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		tokenId: state.tokenId,
		userAddress: address ?? void 0,
		query: { enabled: !!address && collectionQuery.data?.type === "ERC1155" }
	});
	const { isWaaS, isSequence } = useConnectorMetadata();
	const canBeBundled = isSequence && state.orderbookKind === OrderbookKind.sequence_marketplace_v2;
	const availableCurrencies = useMemo(() => {
		if (!currenciesQuery.data) return [];
		return filterCurrenciesForOrderbook(currenciesQuery.data, state.orderbookKind, state.chainId, "listing");
	}, [
		currenciesQuery.data,
		state.orderbookKind,
		state.chainId
	]);
	const selectedCurrency = useMemo(() => {
		if (state.currencyAddress) return availableCurrencies.find((c) => c.contractAddress === state.currencyAddress) || null;
		return getDefaultCurrency(availableCurrencies, state.orderbookKind, "listing");
	}, [
		state.currencyAddress,
		availableCurrencies,
		state.orderbookKind
	]);
	const expiryDate = useMemo(() => new Date(Date.now() + state.expiryDays * 24 * 60 * 60 * 1e3), [state.expiryDays]);
	const priceDnum = useMemo(() => {
		if (!state.priceInput || state.priceInput === "") return [0n, selectedCurrency?.decimals ?? 18];
		try {
			return [BigInt(state.priceInput), selectedCurrency?.decimals ?? 18];
		} catch {
			return [0n, selectedCurrency?.decimals ?? 18];
		}
	}, [state.priceInput, selectedCurrency?.decimals]);
	const priceRaw = priceDnum[0];
	const quantityDnum = useMemo(() => {
		if (!state.quantityInput || state.quantityInput === "") return [0n, 0];
		try {
			return [BigInt(state.quantityInput), 0];
		} catch {
			return [0n, 0];
		}
	}, [state.quantityInput]);
	const quantityRaw = quantityDnum[0];
	const balanceDnum = useMemo(() => {
		if (collectibleBalanceQuery.data?.balance !== void 0) return [BigInt(collectibleBalanceQuery.data.balance), 0];
	}, [collectibleBalanceQuery.data?.balance]);
	const validation = useMemo(() => validateListingForm({
		price: priceDnum,
		quantity: quantityDnum,
		balance: balanceDnum
	}), [
		priceDnum,
		quantityDnum,
		balanceDnum
	]);
	const formIsValid = isFormValid$1(validation);
	const { approve, createListing, needsApproval, nftApprovalQuery } = useListingMutations({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		contractType: collectionQuery.data?.type,
		orderbookKind: state.orderbookKind,
		listing: {
			tokenId: state.tokenId,
			quantity: quantityRaw,
			expiry: dateToUnixTime(expiryDate).toString(),
			currencyAddress: selectedCurrency?.contractAddress ?? zeroAddress,
			pricePerToken: priceRaw
		},
		currencyDecimals: selectedCurrency?.decimals ?? 18,
		nftApprovalEnabled: !!address && !!collectionQuery.data?.type && !!state.orderbookKind && state.isOpen && !canBeBundled
	});
	const waas = useSelectWaasFeeOptionsStore();
	const { pendingFeeOptionConfirmation, rejectPendingFeeOption } = useWaasFeeOptions$1(state.chainId, config);
	const isSponsored = pendingFeeOptionConfirmation?.options?.length === 0;
	const isFeeSelectionVisible = waas.isVisible || !isSponsored && !!pendingFeeOptionConfirmation?.options;
	const steps = {};
	if (isWaaS) steps.fee = {
		label: "Select Fee",
		status: isSponsored || !!waas.selectedFeeOption ? "success" : isFeeSelectionVisible ? "selecting" : "idle",
		isSponsored,
		isSelecting: isFeeSelectionVisible,
		selectedOption: waas.selectedFeeOption,
		show: () => waas.show(),
		cancel: () => waas.hide()
	};
	const approveData = approve.data;
	const approveTransactionHash = approveData && "type" in approveData && approveData.type === "transaction" ? approveData.hash : void 0;
	if (needsApproval && !approve.isSuccess) {
		const guardResult = createApprovalGuard({
			isFormValid: formIsValid,
			txReady: true,
			walletConnected: !!address
		})();
		steps.approval = {
			label: "Approve",
			status: approve.isSuccess ? "success" : approve.isPending ? "pending" : approve.error ? "error" : "idle",
			isPending: approve.isPending,
			isSuccess: approve.isSuccess,
			isDisabled: !guardResult.canProceed,
			disabledReason: guardResult.error?.message || null,
			error: approve.error,
			canExecute: guardResult.canProceed,
			result: approveTransactionHash ? {
				type: "transaction",
				hash: approveTransactionHash
			} : null,
			execute: async () => {
				await approve.mutateAsync();
			},
			reset: () => approve.reset()
		};
	}
	const listingGuardResult = createFinalTransactionGuard({
		isFormValid: formIsValid,
		txReady: true,
		walletConnected: !!address,
		requiresApproval: needsApproval && !approve.isSuccess,
		approvalComplete: approve.isSuccess || !needsApproval
	})();
	const listingData = createListing.data;
	const listingTransactionHash = listingData?.hash;
	const listingOrderId = listingData?.orderId;
	steps.listing = {
		label: "Create Listing",
		status: createListing.isSuccess ? "success" : createListing.isPending ? "pending" : createListing.error ? "error" : "idle",
		isPending: createListing.isPending,
		isSuccess: createListing.isSuccess,
		isDisabled: !listingGuardResult.canProceed,
		disabledReason: listingGuardResult.error?.message || null,
		error: createListing.error,
		canExecute: listingGuardResult.canProceed,
		result: listingTransactionHash ? {
			type: "transaction",
			hash: listingTransactionHash
		} : listingOrderId ? {
			type: "signature",
			orderId: listingOrderId
		} : null,
		execute: async () => {
			await createListing.mutateAsync();
		}
	};
	const flow = computeFlowState(steps);
	const error = nftApprovalQuery.error || collectionQuery.error || currenciesQuery.error || collectibleBalanceQuery.error;
	const handleClose = () => {
		if (pendingFeeOptionConfirmation?.id) rejectPendingFeeOption(pendingFeeOptionConfirmation.id);
		waas.hide();
		state.closeModal();
	};
	return {
		isOpen: state.isOpen,
		close: handleClose,
		item: {
			chainId: state.chainId,
			collectionAddress: state.collectionAddress,
			tokenId: state.tokenId,
			orderbookKind: state.orderbookKind
		},
		listing: {
			price: {
				input: state.priceInput,
				amountRaw: priceRaw,
				currency: selectedCurrency
			},
			quantity: {
				input: state.quantityInput,
				parsed: quantityRaw
			},
			expiry: expiryDate
		},
		form: {
			price: {
				input: state.priceInput,
				update: state.updatePriceInput,
				touch: state.touchPriceInput,
				isTouched: state.isPriceTouched
			},
			quantity: {
				input: state.quantityInput,
				update: state.updateQuantityInput,
				touch: state.touchQuantityInput,
				isTouched: state.isQuantityTouched,
				validation: validation.quantity
			},
			expiry: { update: state.updateExpiryDays },
			isValid: formIsValid,
			validation: {
				price: validation.price,
				quantity: validation.quantity,
				balance: validation.balance
			},
			errors: {
				price: state.isPriceTouched ? validation.price.error : void 0,
				quantity: state.isQuantityTouched ? validation.quantity.error : void 0,
				balance: state.isQuantityTouched ? validation.balance?.error : void 0
			}
		},
		currencies: {
			available: availableCurrencies,
			selected: selectedCurrency,
			select: state.updateCurrency,
			isConfigured: availableCurrencies.length > 0
		},
		steps,
		flow,
		loading: {
			collection: collectionQuery.isLoading,
			currencies: currenciesQuery.isLoading,
			collectibleBalance: collectibleBalanceQuery.isLoading,
			nftApproval: nftApprovalQuery.isLoading
		},
		transactions: {
			approve: approveTransactionHash,
			listing: listingTransactionHash
		},
		error,
		queries: {
			collection: collectionQuery,
			currencies: currenciesQuery,
			collectibleBalance: collectibleBalanceQuery
		},
		get formError() {
			if (!this.currencies.isConfigured) return "No ERC-20 currencies are configured for this marketplace";
			return this.form.errors.price || this.form.errors.quantity || this.form.errors.balance;
		},
		get actions() {
			const needsApprovalAction = this.steps.approval && this.steps.approval.status !== "success";
			const currenciesBlocked = !this.currencies.isConfigured;
			return {
				approve: needsApprovalAction && !canBeBundled ? {
					label: this.steps.approval?.label,
					onClick: this.steps.approval?.execute || (() => {}),
					loading: this.steps.approval?.isPending,
					disabled: this.steps.approval?.isDisabled || currenciesBlocked,
					testid: "create-listing-approve-button"
				} : void 0,
				listing: {
					label: this.steps.listing.label,
					onClick: this.steps.listing.execute,
					loading: this.steps.listing.isPending,
					disabled: this.steps.listing.isDisabled || currenciesBlocked,
					variant: needsApprovalAction ? "ghost" : void 0,
					testid: "create-listing-submit-button"
				}
			};
		}
	};
}

//#endregion
//#region src/react/ui/modals/CreateListingModal/Modal.tsx
const CreateListingModal = () => {
	return useSelector(createListingModalStore, (state) => state.context.isOpen) ? /* @__PURE__ */ jsx(Modal$3, {}) : null;
};
const Modal$3 = () => {
	const ctx = useCreateListingModalContext();
	if (!ctx.isOpen) return null;
	return /* @__PURE__ */ jsx(ActionModal, {
		chainId: ctx.item.chainId,
		onClose: ctx.close,
		title: "List item for sale",
		type: "listing",
		primaryAction: ctx.steps.fee?.isSelecting ? void 0 : ctx.actions.approve ?? ctx.actions.listing,
		secondaryAction: ctx.steps.fee?.isSelecting ? void 0 : ctx.actions.approve ? ctx.actions.listing : void 0,
		queries: {
			collection: ctx.queries.collection,
			currencies: ctx.queries.currencies,
			collectibleBalance: ctx.queries.collectibleBalance
		},
		externalError: ctx.error,
		children: ({ collection, currencies, collectibleBalance }) => /* @__PURE__ */ jsxs(Fragment, { children: [currencies.length === 0 && /* @__PURE__ */ jsx("div", {
			className: "text-center text-gray-400",
			children: "No ERC-20s are configured for the marketplace, contact the marketplace owners"
		}), currencies.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(TokenPreview, {
				collectionName: collection?.name,
				collectionAddress: ctx.item.collectionAddress,
				tokenId: ctx.item.tokenId,
				chainId: ctx.item.chainId
			}),
			ctx.listing.price.currency && /* @__PURE__ */ jsx(PriceInput, {
				chainId: ctx.item.chainId,
				collectionAddress: ctx.item.collectionAddress,
				price: {
					amountRaw: ctx.listing.price.amountRaw,
					currency: ctx.listing.price.currency
				},
				onPriceChange: (newPrice) => {
					ctx.form.price.update(newPrice.amountRaw.toString());
					if (newPrice.currency) ctx.currencies.select(newPrice.currency.contractAddress);
				},
				onCurrencyChange: (newCurrency) => {
					ctx.currencies.select(newCurrency.contractAddress);
				},
				includeNativeCurrency: true,
				orderbookKind: ctx.item.orderbookKind,
				modalType: "listing",
				disabled: ctx.flow.isPending
			}),
			ctx.form.isValid && ctx.listing.price.currency && /* @__PURE__ */ jsx(FloorPriceText, {
				tokenId: ctx.item.tokenId,
				chainId: ctx.item.chainId,
				collectionAddress: ctx.item.collectionAddress,
				price: {
					amountRaw: ctx.listing.price.amountRaw,
					currency: ctx.listing.price.currency
				}
			}),
			collection?.type === "ERC1155" && collectibleBalance?.balance && /* @__PURE__ */ jsx(QuantityInput, {
				quantity: ctx.listing.quantity.parsed,
				invalidQuantity: !ctx.form.quantity.validation.isValid,
				onQuantityChange: (quantity) => ctx.form.quantity.update(quantity.toString()),
				onInvalidQuantityChange: () => {},
				maxQuantity: BigInt(collectibleBalance.balance),
				disabled: ctx.flow.isPending
			}),
			/* @__PURE__ */ jsx(expirationDateSelect_default, {
				date: ctx.listing.expiry,
				onDateChange: (date) => {
					const days = Math.ceil((date.getTime() - Date.now()) / (1440 * 60 * 1e3));
					ctx.form.expiry.update(days);
				},
				disabled: ctx.flow.isPending
			}),
			/* @__PURE__ */ jsx(TransactionDetails, {
				tokenId: ctx.item.tokenId,
				collectionAddress: ctx.item.collectionAddress,
				chainId: ctx.item.chainId,
				price: {
					amountRaw: ctx.listing.price.amountRaw,
					currency: ctx.listing.price.currency
				},
				currencyImageUrl: ctx.listing.price.currency?.imageUrl,
				includeMarketplaceFee: false
			}),
			ctx.steps.fee?.isSelecting && /* @__PURE__ */ jsx(selectWaasFeeOptions_default, {
				chainId: ctx.item.chainId,
				onCancel: ctx.steps.fee.cancel,
				titleOnConfirm: "Creating listing..."
			}),
			ctx.formError && /* @__PURE__ */ jsx("div", {
				className: "mt-2 text-red-500 text-sm",
				children: ctx.formError
			})
		] })] })
	});
};

//#endregion
//#region src/react/ui/modals/MakeOfferModal/internal/helpers/validation.ts
function validateOfferForm({ price, quantity, balance, lowestListing, orderbookKind, usdAmount }) {
	const validation = {
		price: {
			isValid: true,
			error: null
		},
		quantity: {
			isValid: true,
			error: null
		},
		balance: {
			isValid: true,
			error: null
		}
	};
	if (!isPositive(price)) validation.price = {
		isValid: false,
		error: "Price must be greater than 0"
	};
	if (!isPositive(quantity)) validation.quantity = {
		isValid: false,
		error: "Quantity must be greater than 0"
	};
	if (balance && greaterThan(price, balance)) validation.balance = {
		isValid: false,
		error: "Insufficient balance for this offer"
	};
	if (orderbookKind === "opensea" && lowestListing) {
		const meetsMinimum = greaterThan(price, lowestListing);
		validation.openseaCriteria = {
			isValid: meetsMinimum,
			error: meetsMinimum ? null : "Offer must be higher than lowest listing for OpenSea"
		};
	}
	if (orderbookKind === "opensea" && usdAmount !== void 0) {
		const meetsMinPrice = usdAmount >= .01;
		validation.openseaMinPrice = {
			isValid: meetsMinPrice,
			error: meetsMinPrice ? null : "Lowest price must be at least $0.01"
		};
	}
	return validation;
}
function isFormValid(validation) {
	return validation.price.isValid && validation.quantity.isValid && validation.balance.isValid && (validation.openseaCriteria?.isValid ?? true) && (validation.openseaMinPrice?.isValid ?? true);
}

//#endregion
//#region src/react/ui/modals/MakeOfferModal/internal/store.ts
const initialContext$1 = {
	isOpen: false,
	collectionAddress: "",
	chainId: 0,
	tokenId: 0n,
	priceInput: "",
	currencyAddress: void 0,
	quantityInput: "1",
	expiryDays: 7,
	isPriceTouched: false,
	isQuantityTouched: false
};
const makeOfferModalStore = createStore({
	context: { ...initialContext$1 },
	on: {
		open: (_context, event) => ({
			...initialContext$1,
			isOpen: true,
			...event,
			expiryDays: 7,
			priceInput: "",
			quantityInput: "1",
			isPriceTouched: false,
			isQuantityTouched: false
		}),
		close: () => ({ ...initialContext$1 }),
		updatePrice: (context, event) => {
			const isBlurNormalization = context.priceInput === "" && event.value === "0";
			const shouldMarkTouched = context.priceInput !== event.value && !isBlurNormalization;
			return {
				...context,
				priceInput: event.value,
				isPriceTouched: shouldMarkTouched ? true : context.isPriceTouched
			};
		},
		touchPrice: (context) => ({
			...context,
			isPriceTouched: true
		}),
		selectCurrency: (context, event) => ({
			...context,
			currencyAddress: event.address
		}),
		updateQuantity: (context, event) => ({
			...context,
			quantityInput: event.value,
			isQuantityTouched: true
		}),
		touchQuantity: (context) => ({
			...context,
			isQuantityTouched: true
		}),
		updateExpiryDays: (context, event) => ({
			...context,
			expiryDays: event.days
		})
	}
});
const useMakeOfferModalState = () => {
	const { isOpen, tokenId, collectionAddress, chainId, priceInput, currencyAddress, quantityInput, expiryDays, isPriceTouched, isQuantityTouched } = useSelector(makeOfferModalStore, (state) => state.context);
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const orderbookKind = findMarketCollection(marketplaceConfig?.market.collections ?? [], collectionAddress, chainId)?.destinationMarketplace;
	const closeModal = () => makeOfferModalStore.send({ type: "close" });
	const updatePriceInput = (value) => makeOfferModalStore.send({
		type: "updatePrice",
		value
	});
	const touchPriceInput = () => makeOfferModalStore.send({ type: "touchPrice" });
	const updateCurrency = (address) => makeOfferModalStore.send({
		type: "selectCurrency",
		address
	});
	const updateQuantityInput = (value) => makeOfferModalStore.send({
		type: "updateQuantity",
		value
	});
	const touchQuantityInput = () => makeOfferModalStore.send({ type: "touchQuantity" });
	const updateExpiryDays = (days) => makeOfferModalStore.send({
		type: "updateExpiryDays",
		days
	});
	return {
		isOpen,
		tokenId,
		collectionAddress,
		chainId,
		orderbookKind,
		priceInput,
		currencyAddress,
		quantityInput,
		expiryDays,
		isPriceTouched,
		isQuantityTouched,
		closeModal,
		updatePriceInput,
		touchPriceInput,
		updateCurrency,
		updateQuantityInput,
		touchQuantityInput,
		updateExpiryDays
	};
};

//#endregion
//#region src/react/ui/modals/MakeOfferModal/internal/offer-mutations.ts
const useOfferMutations = ({ chainId, collectionAddress, contractType, orderbookKind, offer, currencyDecimals, needsApproval }) => {
	const sdkConfig = useConfig();
	const { address: makerAddress } = useAccount();
	const { show: showTxModal } = useTransactionStatusModal();
	const analytics = useAnalytics();
	const state = useMakeOfferModalState();
	const { processStep } = useProcessStep();
	const { walletKind } = useConnectorMetadata();
	const { data: currency } = useCurrency({
		chainId,
		currencyAddress: offer.currencyAddress
	});
	async function executeStepAndWait(step) {
		const res = await processStep(step, chainId);
		if (res.type === "transaction" && res.hash) await waitForTransactionReceipt({
			txHash: res.hash,
			chainId,
			sdkConfig
		});
		return res;
	}
	/**
	* Generate the approval step on the frontend.
	* This approves max uint256 for the marketplace contract to spend the user's tokens.
	*/
	function createApprovalStep() {
		const spenderAddress = getConduitAddressForOrderbook(orderbookKind);
		if (!spenderAddress) throw new Error(`Unknown orderbook kind: ${orderbookKind}`);
		const approvalCalldata = encodeFunctionData({
			abi: ERC20_ABI,
			functionName: "approve",
			args: [spenderAddress, maxUint256]
		});
		return {
			id: StepType.tokenApproval,
			data: approvalCalldata,
			to: offer.currencyAddress,
			value: 0n,
			price: 0n
		};
	}
	async function generateOfferSteps() {
		if (!contractType) throw new Error("Contract type is required to generate offer steps");
		if (!makerAddress) throw new Error("Wallet not connected");
		if (!orderbookKind) throw new Error("Orderbook kind is required");
		const marketplaceClient = getMarketplaceClient(sdkConfig);
		const request = {
			chainId,
			collectionAddress,
			maker: makerAddress,
			walletType: walletKind,
			contractType,
			orderbook: orderbookKind,
			offer: {
				tokenId: offer.tokenId,
				quantity: offer.quantity,
				expiry: offer.expiry,
				currencyAddress: offer.currencyAddress,
				pricePerToken: offer.pricePerToken
			},
			additionalFees: [],
			offerType: OfferType.item
		};
		const steps = (await marketplaceClient.generateOfferTransaction(request)).steps;
		if (steps.length === 0) throw new Error("No steps generated");
		const offerStep = steps.find((step) => step.id !== StepType.tokenApproval);
		if (!offerStep) throw new Error("No offer step found in response");
		return { offerStep };
	}
	return {
		approve: useMutation({ mutationFn: async () => {
			return await executeStepAndWait(createApprovalStep());
		} }),
		makeOffer: useMutation({
			mutationFn: async () => {
				const { offerStep } = await generateOfferSteps();
				const res = await executeStepAndWait(offerStep);
				if (currency) {
					const currencyValueRaw = Number(offer.pricePerToken.toString());
					const currencyValueDecimal = toNumber(fromBigIntString(offer.pricePerToken.toString(), currencyDecimals));
					let requestId;
					if (res.type === "signature") requestId = res.orderId;
					analytics.trackCreateOffer({
						props: {
							orderbookKind: orderbookKind || OrderbookKind.sequence_marketplace_v2,
							collectionAddress,
							currencyAddress: offer.currencyAddress,
							currencySymbol: currency.symbol || "",
							chainId: chainId.toString(),
							requestId: requestId || "",
							txnHash: res.type === "transaction" ? res.hash : ""
						},
						nums: {
							currencyValueDecimal,
							currencyValueRaw
						}
					});
				}
				return res;
			},
			onSuccess: (res) => {
				state.closeModal();
				showTxModal({
					type: TransactionType$1.OFFER,
					chainId,
					hash: res?.type === "transaction" ? res.hash : void 0,
					orderId: res?.type === "signature" ? res.orderId : void 0,
					collectionAddress,
					tokenId: state.tokenId,
					queriesToInvalidate: [
						["collectible", "market-highest-offer"],
						["collectible", "market-offers"],
						["collectible", "market-offers-count"]
					]
				});
			}
		}),
		needsApproval
	};
};

//#endregion
//#region src/react/ui/modals/MakeOfferModal/internal/context.ts
function useMakeOfferModalContext() {
	const state = useMakeOfferModalState();
	const { address } = useAccount();
	const config = useConfig();
	const collectibleQuery = useCollectibleMetadata({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		tokenId: state.tokenId
	});
	const collectionQuery = useCollectionMetadata({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress
	});
	const currenciesQuery = useCurrencyList({
		chainId: state.chainId,
		includeNativeCurrency: false
	});
	const lowestListingQuery = useCollectibleMarketLowestListing({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		tokenId: state.tokenId
	});
	const { isWaaS, isSequence } = useConnectorMetadata();
	const canBeBundled = isSequence && state.orderbookKind === OrderbookKind.sequence_marketplace_v2;
	const availableCurrencies = useMemo(() => {
		if (!currenciesQuery.data) return [];
		return filterCurrenciesForOrderbook(currenciesQuery.data, state.orderbookKind, state.chainId, "offer");
	}, [
		currenciesQuery.data,
		state.orderbookKind,
		state.chainId
	]);
	const selectedCurrency = useMemo(() => {
		if (state.currencyAddress) return availableCurrencies.find((c) => c.contractAddress === state.currencyAddress) || null;
		return getDefaultCurrency(availableCurrencies, state.orderbookKind, "offer");
	}, [
		state.currencyAddress,
		availableCurrencies,
		state.orderbookKind
	]);
	const currencyBalanceQuery = useTokenCurrencyBalance({
		currencyAddress: selectedCurrency?.contractAddress,
		chainId: state.chainId,
		userAddress: address,
		query: { enabled: !!selectedCurrency?.contractAddress && !!address }
	});
	const { data: usdConversion } = useCurrencyConvertToUSD({
		chainId: state.chainId,
		currencyAddress: selectedCurrency?.contractAddress ?? zeroAddress,
		amountRaw: state.priceInput?.toString(),
		query: { enabled: state.orderbookKind === OrderbookKind.opensea && !!selectedCurrency?.contractAddress && !!state.priceInput }
	});
	const expiryDate = useMemo(() => new Date(Date.now() + state.expiryDays * 24 * 60 * 60 * 1e3), [state.expiryDays]);
	const priceDnum = [state.priceInput ? BigInt(state.priceInput) : 0n, selectedCurrency?.decimals ?? 0];
	const priceRaw = priceDnum[0];
	const quantityDnum = [BigInt(state.quantityInput), 0];
	const quantityRaw = BigInt(state.quantityInput);
	const validation = validateOfferForm({
		price: priceDnum,
		quantity: quantityDnum,
		balance: currencyBalanceQuery.data?.value !== void 0 && selectedCurrency?.decimals ? [currencyBalanceQuery.data.value, selectedCurrency.decimals] : void 0,
		lowestListing: lowestListingQuery.data?.priceAmount && selectedCurrency?.decimals ? [BigInt(lowestListingQuery.data.priceAmount), selectedCurrency.decimals] : void 0,
		orderbookKind: state.orderbookKind,
		usdAmount: usdConversion?.usdAmount
	});
	const formIsValid = isFormValid(validation);
	const spenderAddress = getConduitAddressForOrderbook(state.orderbookKind);
	const allowanceQuery = useERC20Allowance({
		tokenAddress: selectedCurrency?.contractAddress,
		spenderAddress,
		chainId: state.chainId,
		enabled: !!selectedCurrency?.contractAddress && !!address && !!spenderAddress && state.isOpen && !canBeBundled
	});
	const totalPriceNeeded = priceRaw * quantityRaw;
	const needsApproval = useMemo(() => {
		if (canBeBundled) return false;
		if (allowanceQuery.allowance === void 0) return true;
		return allowanceQuery.allowance < totalPriceNeeded;
	}, [allowanceQuery.allowance, totalPriceNeeded]);
	const { approve, makeOffer } = useOfferMutations({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		contractType: collectionQuery.data?.type,
		orderbookKind: state.orderbookKind,
		offer: {
			tokenId: state.tokenId,
			quantity: quantityRaw,
			expiry: dateToUnixTime(expiryDate),
			currencyAddress: selectedCurrency?.contractAddress ?? zeroAddress,
			pricePerToken: priceRaw
		},
		currencyDecimals: selectedCurrency?.decimals ?? 18,
		needsApproval
	});
	const waas = useSelectWaasFeeOptionsStore();
	const { pendingFeeOptionConfirmation, rejectPendingFeeOption } = useWaasFeeOptions$1(state.chainId, config);
	const isSponsored = pendingFeeOptionConfirmation?.options?.length === 0;
	const isFeeSelectionVisible = waas.isVisible || !isSponsored && !!pendingFeeOptionConfirmation?.options;
	const steps = {};
	if (isWaaS) steps.fee = {
		label: "Select Fee",
		status: isSponsored || !!waas.selectedFeeOption ? "success" : isFeeSelectionVisible ? "selecting" : "idle",
		isSponsored,
		isSelecting: isFeeSelectionVisible,
		selectedOption: waas.selectedFeeOption,
		show: () => waas.show(),
		cancel: () => waas.hide()
	};
	const approveData = approve.data;
	const approveTransactionHash = approveData && "type" in approveData && approveData.type === "transaction" ? approveData.hash : void 0;
	if (needsApproval && !approve.isSuccess && !canBeBundled) {
		const guardResult = createApprovalGuard({
			isFormValid: formIsValid,
			txReady: true,
			walletConnected: !!address
		})();
		steps.approval = {
			label: "Approve",
			status: approve.isSuccess ? "success" : approve.isPending ? "pending" : approve.error ? "error" : "idle",
			isPending: approve.isPending,
			isSuccess: approve.isSuccess,
			isDisabled: !guardResult.canProceed,
			disabledReason: guardResult.error?.message || null,
			error: approve.error,
			canExecute: guardResult.canProceed,
			result: approveTransactionHash ? {
				type: "transaction",
				hash: approveTransactionHash
			} : null,
			execute: async () => {
				await approve.mutateAsync();
			},
			reset: () => approve.reset()
		};
	}
	const offerGuardResult = createFinalTransactionGuard({
		isFormValid: formIsValid,
		txReady: true,
		walletConnected: !!address,
		requiresApproval: needsApproval && !approve.isSuccess,
		approvalComplete: approve.isSuccess || !needsApproval
	})();
	const offerTransactionHash = makeOffer.data && "type" in makeOffer.data && makeOffer.data.type === "transaction" ? makeOffer.data.hash : void 0;
	steps.offer = {
		label: "Make Offer",
		status: makeOffer.isSuccess ? "success" : makeOffer.isPending ? "pending" : makeOffer.error ? "error" : "idle",
		isPending: makeOffer.isPending,
		isSuccess: makeOffer.isSuccess,
		isDisabled: !offerGuardResult.canProceed,
		disabledReason: offerGuardResult.error?.message || null,
		error: makeOffer.error,
		canExecute: offerGuardResult.canProceed,
		result: offerTransactionHash ? {
			type: "transaction",
			hash: offerTransactionHash
		} : makeOffer.data?.type === "signature" ? {
			type: "signature",
			orderId: makeOffer.data.orderId ?? ""
		} : null,
		execute: async () => {
			await makeOffer.mutateAsync();
		}
	};
	const flow = computeFlowState(steps);
	const error = allowanceQuery.error || collectibleQuery.error || collectionQuery.error || currenciesQuery.error;
	const handleClose = () => {
		if (pendingFeeOptionConfirmation?.id) rejectPendingFeeOption(pendingFeeOptionConfirmation.id);
		waas.hide();
		state.closeModal();
	};
	return {
		isOpen: state.isOpen,
		close: handleClose,
		item: {
			chainId: state.chainId,
			collectionAddress: state.collectionAddress,
			tokenId: state.tokenId,
			orderbookKind: state.orderbookKind
		},
		tokenId: state.tokenId,
		collectionAddress: state.collectionAddress,
		chainId: state.chainId,
		collectible: collectibleQuery.data,
		collection: collectionQuery.data,
		offer: {
			price: {
				input: state.priceInput,
				amountRaw: priceRaw,
				currency: selectedCurrency
			},
			quantity: {
				input: state.quantityInput,
				parsed: quantityRaw
			},
			expiry: expiryDate
		},
		form: {
			price: {
				input: state.priceInput,
				update: state.updatePriceInput,
				touch: state.touchPriceInput,
				isTouched: state.isPriceTouched
			},
			quantity: {
				input: state.quantityInput,
				update: state.updateQuantityInput,
				touch: state.touchQuantityInput,
				isTouched: state.isQuantityTouched,
				validation: validation.quantity
			},
			expiry: { update: state.updateExpiryDays },
			isValid: formIsValid,
			validation: {
				price: validation.price,
				quantity: validation.quantity,
				balance: validation.balance,
				openseaCriteria: validation.openseaCriteria,
				openseaMinPrice: validation.openseaMinPrice
			},
			errors: {
				price: state.isPriceTouched ? validation.price.error : void 0,
				quantity: state.isQuantityTouched ? validation.quantity.error : void 0,
				balance: state.isPriceTouched ? validation.balance.error : void 0,
				openseaCriteria: state.isPriceTouched ? validation.openseaCriteria?.error : void 0,
				openseaMinPrice: state.isPriceTouched ? validation.openseaMinPrice?.error : void 0
			}
		},
		currencies: {
			available: availableCurrencies,
			selected: selectedCurrency,
			select: state.updateCurrency,
			isConfigured: availableCurrencies.length > 0
		},
		steps,
		flow,
		loading: {
			collectible: collectibleQuery.isLoading,
			collection: collectionQuery.isLoading,
			currencies: currenciesQuery.isLoading,
			allowance: allowanceQuery.isLoading
		},
		transactions: {
			approve: approve.data?.type === "transaction" ? approve.data.hash : void 0,
			offer: makeOffer.data?.type === "transaction" ? makeOffer.data.hash : void 0
		},
		error,
		queries: {
			collectible: collectibleQuery,
			collection: collectionQuery,
			currencies: currenciesQuery,
			lowestListing: lowestListingQuery
		},
		get formError() {
			if (!this.currencies.isConfigured) return "No ERC-20 currencies are configured for this marketplace";
			return this.form.errors.price || this.form.errors.quantity || this.form.errors.balance || this.form.errors.openseaCriteria || this.form.errors.openseaMinPrice;
		},
		get actions() {
			const needsApprovalAction = this.steps.approval && this.steps.approval.status !== "success" && priceRaw > 0n;
			const currenciesBlocked = !this.currencies.isConfigured;
			return {
				approve: needsApprovalAction && !canBeBundled ? {
					label: this.steps.approval?.label,
					onClick: this.steps.approval?.execute || (() => {}),
					loading: this.steps.approval?.isPending,
					disabled: this.steps.approval?.isDisabled || currenciesBlocked,
					testid: "make-offer-approve-button"
				} : void 0,
				offer: {
					label: this.steps.offer.label,
					onClick: this.steps.offer.execute,
					loading: this.steps.offer.isPending,
					disabled: this.steps.offer.isDisabled || currenciesBlocked,
					variant: needsApprovalAction ? "ghost" : void 0,
					testid: "make-offer-button"
				}
			};
		}
	};
}

//#endregion
//#region src/react/ui/modals/MakeOfferModal/Modal.tsx
const MakeOfferModal = () => {
	return useSelector(makeOfferModalStore, (state) => state.context.isOpen) ? /* @__PURE__ */ jsx(Modal$2, {}) : null;
};
const Modal$2 = () => {
	const ctx = useMakeOfferModalContext();
	if (!ctx.isOpen) return null;
	return /* @__PURE__ */ jsx(ActionModal, {
		chainId: ctx.item.chainId,
		onClose: ctx.close,
		title: "Make an offer",
		type: "offer",
		primaryAction: ctx.steps.fee?.isSelecting ? void 0 : ctx.actions.approve ?? ctx.actions.offer,
		secondaryAction: ctx.steps.fee?.isSelecting ? void 0 : ctx.actions.approve ? ctx.actions.offer : void 0,
		queries: {
			collectible: ctx.queries.collectible,
			collection: ctx.queries.collection,
			currencies: ctx.queries.currencies
		},
		externalError: ctx.error,
		children: ({ collectible, collection, currencies }) => /* @__PURE__ */ jsxs(Fragment, { children: [currencies.length === 0 && /* @__PURE__ */ jsx("div", {
			className: "text-center text-gray-400",
			children: "No ERC-20s are configured for the marketplace, contact the marketplace owners"
		}), currencies.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(TokenPreview, {
				chainId: collection.chainId,
				collectionAddress: collection.address,
				tokenId: collectible?.tokenId,
				collectionName: collection.name
			}),
			ctx.offer.price.currency && /* @__PURE__ */ jsx(PriceInput, {
				chainId: ctx.item.chainId,
				collectionAddress: ctx.item.collectionAddress,
				price: {
					amountRaw: ctx.offer.price.amountRaw,
					currency: ctx.offer.price.currency
				},
				onPriceChange: (newPrice) => {
					ctx.form.price.update(newPrice.amountRaw.toString());
					if (newPrice.currency) ctx.currencies.select(newPrice.currency.contractAddress);
				},
				onCurrencyChange: (newCurrency) => {
					ctx.currencies.select(newCurrency.contractAddress);
				},
				includeNativeCurrency: false,
				orderbookKind: ctx.item.orderbookKind,
				modalType: "offer",
				disabled: ctx.flow.isPending
			}),
			collection.type === "ERC1155" && /* @__PURE__ */ jsx(QuantityInput, {
				quantity: ctx.offer.quantity.parsed,
				invalidQuantity: !ctx.form.quantity.validation.isValid,
				onQuantityChange: (quantity) => ctx.form.quantity.update(quantity.toString()),
				onInvalidQuantityChange: () => {},
				maxQuantity: BigInt(Number.MAX_SAFE_INTEGER),
				disabled: ctx.flow.isPending
			}),
			ctx.form.isValid && !ctx.form.errors.balance && ctx.offer.price.currency && /* @__PURE__ */ jsx(FloorPriceText, {
				tokenId: ctx.item.tokenId,
				chainId: ctx.item.chainId,
				collectionAddress: ctx.item.collectionAddress,
				price: {
					amountRaw: ctx.offer.price.amountRaw,
					currency: ctx.offer.price.currency
				},
				onBuyNow: () => {}
			}),
			/* @__PURE__ */ jsx(expirationDateSelect_default, {
				date: ctx.offer.expiry,
				onDateChange: (date) => {
					const days = Math.ceil((date.getTime() - Date.now()) / (1440 * 60 * 1e3));
					ctx.form.expiry.update(days);
				},
				disabled: ctx.flow.isPending
			}),
			ctx.steps.fee?.isSelecting && /* @__PURE__ */ jsx(selectWaasFeeOptions_default, {
				chainId: ctx.item.chainId,
				onCancel: ctx.steps.fee.cancel,
				titleOnConfirm: "Creating offer..."
			}),
			ctx.formError && /* @__PURE__ */ jsx("div", {
				className: "mt-2 text-red-500 text-sm",
				children: ctx.formError
			})
		] })] })
	});
};

//#endregion
//#region src/react/ui/modals/TransferModal/_views/enterWalletAddress/_components/TokenQuantityInput.tsx
const TokenQuantityInput = ({ value, onChange, maxQuantity, invalid, disabled, helperText, onInvalidChange }) => {
	const [localInvalid, setLocalInvalid] = useState(false);
	const maxBelowMin = maxQuantity < 1n;
	const insufficientBalance = value > maxQuantity;
	const invalidQuantity = invalid || localInvalid || maxBelowMin;
	return /* @__PURE__ */ jsxs("div", {
		className: cn("flex flex-col gap-3", disabled && "opacity-70"),
		children: [/* @__PURE__ */ jsx(QuantityInput, {
			quantity: value,
			invalidQuantity,
			onQuantityChange: (quantity) => {
				onChange(quantity);
				setLocalInvalid(false);
				onInvalidChange?.(false);
			},
			onInvalidQuantityChange: (isInvalid) => {
				setLocalInvalid(isInvalid);
				onInvalidChange?.(isInvalid);
			},
			maxQuantity,
			disabled,
			className: "[&>label>div>div>div>input]:text-sm [&>label>div>div>div]:h-13 [&>label>div>div>div]:rounded-xl [&>label>div>div>span]:text-sm [&>label>div>div>span]:text-text-80 [&>label]:gap-1"
		}), /* @__PURE__ */ jsx(Text, {
			className: "font-body text-xs",
			color: insufficientBalance ? "negative" : "text50",
			fontWeight: "medium",
			children: helperText ?? `You have ${maxQuantity.toString()} of this item`
		})]
	});
};
var TokenQuantityInput_default = TokenQuantityInput;

//#endregion
//#region src/react/ui/modals/TransferModal/_views/enterWalletAddress/_components/WalletAddressInput.tsx
const MAX_WALLET_ADDRESS_LENGTH = 42;
const WalletAddressInput = ({ value, onChange, disabled }) => {
	const handleChangeWalletAddress = (event) => {
		onChange(event.target.value);
	};
	return /* @__PURE__ */ jsxs(Field, { children: [/* @__PURE__ */ jsx(FieldLabel, {
		className: "text-text-80 text-xs",
		children: "Wallet address"
	}), /* @__PURE__ */ jsx(TextInput, {
		autoFocus: true,
		value,
		maxLength: MAX_WALLET_ADDRESS_LENGTH,
		onChange: handleChangeWalletAddress,
		name: "walletAddress",
		placeholder: "Enter wallet address",
		disabled,
		type: "text",
		className: "h-9 rounded-sm [&>input]:h-9 [&>input]:text-sm"
	})] });
};
var WalletAddressInput_default = WalletAddressInput;

//#endregion
//#region src/react/ui/modals/TransferModal/internal/store.ts
const initialContext = {
	isOpen: false,
	chainId: 0,
	collectionAddress: "",
	tokenId: 0n,
	collectionType: void 0,
	receiverInput: "",
	quantityInput: 1n,
	isReceiverTouched: false,
	isQuantityTouched: false
};
const transferModalStore = createStore({
	context: { ...initialContext },
	on: {
		open: (_context, event) => ({
			...initialContext,
			...event,
			isOpen: true,
			quantityInput: 1n,
			isReceiverTouched: false,
			isQuantityTouched: false
		}),
		close: () => ({ ...initialContext }),
		updateReceiver: (context, event) => ({
			...context,
			receiverInput: event.value
		}),
		touchReceiver: (context) => ({
			...context,
			isReceiverTouched: true
		}),
		updateQuantity: (context, event) => ({
			...context,
			quantityInput: event.value,
			isQuantityTouched: true
		}),
		touchQuantity: (context) => ({
			...context,
			isQuantityTouched: true
		})
	}
});
const useTransferModalState = () => {
	return {
		...useSelector(transferModalStore, (snapshot) => snapshot.context),
		closeModal: () => transferModalStore.send({ type: "close" }),
		updateReceiverInput: (value) => transferModalStore.send({
			type: "updateReceiver",
			value
		}),
		touchReceiverInput: () => transferModalStore.send({ type: "touchReceiver" }),
		updateQuantityInput: (value) => transferModalStore.send({
			type: "updateQuantity",
			value
		}),
		touchQuantityInput: () => transferModalStore.send({ type: "touchQuantity" })
	};
};
const useTransferModal = (args) => {
	const { ensureCorrectChain } = useEnsureCorrectChain();
	const { address: accountAddress } = useAccount();
	useTokenBalances({
		chainId: args?.prefetch?.chainId ?? 0,
		contractAddress: args?.prefetch?.collectionAddress ?? "",
		tokenId: args?.prefetch?.tokenId,
		accountAddress: accountAddress ?? "",
		query: { enabled: !!accountAddress && !!args?.prefetch }
	});
	const show = (openArgs) => {
		ensureCorrectChain(Number(openArgs.chainId), { onSuccess: () => transferModalStore.send({
			type: "open",
			...openArgs
		}) });
	};
	return {
		show,
		close: () => transferModalStore.send({ type: "close" })
	};
};

//#endregion
//#region src/react/ui/modals/TransferModal/internal/context.ts
function useTransferModalContext() {
	const state = useTransferModalState();
	const { closeModal } = state;
	const { address } = useAccount();
	const config = useConfig();
	const { isWaaS } = useConnectorMetadata();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const collectionQuery = useCollectionMetadata({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress
	});
	const contractType = state.collectionType ?? collectionQuery.data?.type;
	const isErc1155 = contractType === ContractType$1.ERC1155;
	const isErc721 = contractType === ContractType$1.ERC721;
	const collectibleBalanceQuery = useCollectibleBalance({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		tokenId: state.tokenId,
		userAddress: address ?? void 0,
		query: { enabled: !!address && isErc1155 }
	});
	const balance = collectibleBalanceQuery.data?.balance !== void 0 ? BigInt(collectibleBalanceQuery.data.balance) : void 0;
	const receiverValidation = useMemo(() => {
		if (!state.receiverInput || state.receiverInput.trim() === "") return {
			isValid: false,
			error: "Wallet address is required"
		};
		if (!isAddress(state.receiverInput)) return {
			isValid: false,
			error: "Enter a valid wallet address"
		};
		if (address && compareAddress(state.receiverInput, address)) return {
			isValid: false,
			error: "You cannot transfer to your own address"
		};
		return {
			isValid: true,
			error: null
		};
	}, [address, state.receiverInput]);
	const quantityValidation = useMemo(() => {
		if (!isErc1155) return {
			isValid: true,
			error: null
		};
		if (!state.quantityInput || state.quantityInput <= 0n) return {
			isValid: false,
			error: "Quantity is required"
		};
		if (state.quantityInput <= 0n) return {
			isValid: false,
			error: "Quantity must be greater than 0"
		};
		if (balance !== void 0 && state.quantityInput > balance) return {
			isValid: false,
			error: "Quantity exceeds your balance"
		};
		return {
			isValid: true,
			error: null
		};
	}, [
		balance,
		isErc1155,
		state.quantityInput,
		state.quantityInput
	]);
	const contractTypeError = contractType && (isErc1155 || isErc721) ? null : contractType ? "Unsupported collection type" : null;
	const formIsValid = receiverValidation.isValid && quantityValidation.isValid && !contractTypeError;
	const { transferTokensAsync, hash, transferring, transferFailed, transferSuccess, error: transferError } = useTransferTokens();
	const waas = useSelectWaasFeeOptionsStore();
	const { pendingFeeOptionConfirmation, rejectPendingFeeOption } = useWaasFeeOptions$1(state.chainId, config);
	const isSponsored = pendingFeeOptionConfirmation?.options?.length === 0;
	const isFeeSelectionVisible = waas.isVisible || isWaaS && !isSponsored && !!pendingFeeOptionConfirmation?.options;
	const baseClose = useCallback(() => {
		if (pendingFeeOptionConfirmation?.id) rejectPendingFeeOption(pendingFeeOptionConfirmation.id);
		waas.hide();
		closeModal();
	}, [
		closeModal,
		pendingFeeOptionConfirmation?.id,
		rejectPendingFeeOption,
		waas
	]);
	const steps = {};
	if (isWaaS) steps.fee = {
		label: "Select Fee",
		status: isSponsored || !!waas.selectedFeeOption ? "success" : isFeeSelectionVisible ? "selecting" : "idle",
		isSponsored: isSponsored ?? false,
		isSelecting: isFeeSelectionVisible,
		selectedOption: waas.selectedFeeOption,
		show: () => selectWaasFeeOptionsStore.send({ type: "show" }),
		cancel: () => selectWaasFeeOptionsStore.send({ type: "hide" })
	};
	const feeGuard = steps.fee ? createFeeGuard({ feeSelectionVisible: steps.fee.isSelecting }) : () => ({ canProceed: true });
	const transferGuard = () => {
		if (!address) return {
			canProceed: false,
			error: /* @__PURE__ */ new Error("Please connect your wallet")
		};
		if (contractTypeError) return {
			canProceed: false,
			error: new Error(contractTypeError)
		};
		if (!formIsValid) {
			const errorMessage = receiverValidation.error || quantityValidation.error || contractTypeError || "Please fix form validation errors";
			return {
				canProceed: false,
				error: new Error(errorMessage)
			};
		}
		const feeCheck = feeGuard();
		if (!feeCheck.canProceed) return feeCheck;
		const finalGuard = createFinalTransactionGuard({
			isFormValid: formIsValid,
			txReady: !!contractType && (isErc721 || isErc1155 && state.quantityInput > 0n),
			walletConnected: !!address,
			requiresApproval: false,
			approvalComplete: true
		})();
		if (!finalGuard.canProceed) return finalGuard;
		return { canProceed: true };
	};
	const executeTransfer = useCallback(async () => {
		const guardResult = transferGuard();
		if (!guardResult.canProceed) throw guardResult.error || /* @__PURE__ */ new Error("Transfer not ready");
		const receiver = state.receiverInput;
		showTransactionStatusModal({
			hash: await transferTokensAsync(isErc1155 ? {
				receiverAddress: receiver,
				collectionAddress: state.collectionAddress,
				tokenId: state.tokenId,
				chainId: state.chainId,
				contractType: ContractType$1.ERC1155,
				quantity: state.quantityInput
			} : {
				receiverAddress: receiver,
				collectionAddress: state.collectionAddress,
				tokenId: state.tokenId,
				chainId: state.chainId,
				contractType: ContractType$1.ERC721
			}),
			collectionAddress: state.collectionAddress,
			chainId: state.chainId,
			tokenId: state.tokenId,
			type: TransactionType$1.TRANSFER,
			queriesToInvalidate: [["token", "balances"], ["collection", "balance-details"]]
		});
		baseClose();
	}, [
		baseClose,
		isErc1155,
		state.quantityInput,
		showTransactionStatusModal,
		state.chainId,
		state.collectionAddress,
		state.receiverInput,
		state.tokenId,
		transferGuard,
		transferTokensAsync
	]);
	const transferGuardResult = transferGuard();
	steps.transfer = {
		label: "Transfer",
		status: transferSuccess ? "success" : transferring ? "pending" : transferFailed ? "error" : "idle",
		isPending: transferring,
		isSuccess: transferSuccess,
		isDisabled: !transferGuardResult.canProceed,
		disabledReason: transferGuardResult.error?.message ?? null,
		error: transferError ?? null,
		canExecute: transferGuardResult.canProceed,
		result: hash ? {
			type: "transaction",
			hash
		} : null,
		execute: executeTransfer
	};
	const flow = computeFlowState(steps);
	const error = collectionQuery.error || collectibleBalanceQuery.error || null;
	return {
		isOpen: state.isOpen,
		close: baseClose,
		item: {
			chainId: state.chainId,
			collectionAddress: state.collectionAddress,
			tokenId: state.tokenId
		},
		form: {
			receiver: {
				input: state.receiverInput,
				update: state.updateReceiverInput,
				touch: state.touchReceiverInput,
				isTouched: state.isReceiverTouched,
				validation: receiverValidation
			},
			quantity: {
				input: state.quantityInput,
				update: state.updateQuantityInput,
				touch: state.touchQuantityInput,
				isTouched: state.isQuantityTouched,
				validation: quantityValidation
			},
			isValid: formIsValid,
			errors: {
				receiver: state.isReceiverTouched ? receiverValidation.error || void 0 : void 0,
				quantity: state.isQuantityTouched ? quantityValidation.error || void 0 : void 0,
				contractType: contractTypeError
			}
		},
		steps,
		flow,
		queries: {
			collection: collectionQuery,
			collectibleBalance: collectibleBalanceQuery
		},
		loading: {
			collection: collectionQuery.isLoading,
			collectibleBalance: collectibleBalanceQuery.isLoading
		},
		transactions: { transfer: hash },
		error,
		get formError() {
			return this.form.errors.receiver || this.form.errors.quantity || this.form.errors.contractType || this.steps.transfer.disabledReason || void 0;
		},
		actions: { transfer: {
			label: steps.transfer.label,
			onClick: steps.transfer.execute,
			loading: steps.transfer.isPending,
			disabled: steps.transfer.isDisabled,
			testid: "transfer-submit-button"
		} }
	};
}

//#endregion
//#region src/react/ui/modals/TransferModal/index.tsx
const TransferModal = () => {
	return useSelector(transferModalStore, (state) => state.context.isOpen) ? /* @__PURE__ */ jsx(Modal$1, {}) : null;
};
const Modal$1 = () => {
	const ctx = useTransferModalContext();
	if (!ctx.isOpen) return null;
	const primaryAction = ctx.steps.fee?.isSelecting ? void 0 : ctx.actions.transfer;
	return /* @__PURE__ */ jsx(ActionModal, {
		transactionType: TransactionType$1.TRANSFER,
		chainId: ctx.item.chainId,
		onClose: ctx.close,
		title: "Transfer your item",
		type: "transfer",
		primaryAction,
		queries: {
			collection: ctx.queries.collection,
			collectibleBalance: ctx.queries.collectibleBalance
		},
		externalError: ctx.error,
		children: ({ collection, collectibleBalance }) => /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(TokenPreview, {
				collectionName: collection?.name,
				collectionAddress: ctx.item.collectionAddress,
				tokenId: ctx.item.tokenId,
				chainId: ctx.item.chainId
			}),
			/* @__PURE__ */ jsx(WalletAddressInput_default, {
				value: ctx.form.receiver.input,
				onChange: (value) => {
					ctx.form.receiver.update(value);
					if (!ctx.form.receiver.isTouched) ctx.form.receiver.touch();
				},
				disabled: ctx.flow.isPending
			}),
			collection?.type === "ERC1155" && collectibleBalance?.balance && /* @__PURE__ */ jsx(TokenQuantityInput_default, {
				value: ctx.form.quantity.input,
				onChange: (value) => {
					ctx.form.quantity.update(value);
					if (!ctx.form.quantity.isTouched) ctx.form.quantity.touch();
				},
				maxQuantity: BigInt(collectibleBalance.balance),
				invalid: !!ctx.form.errors.quantity,
				disabled: ctx.flow.isPending,
				helperText: `You have ${collectibleBalance.balance} of this item`
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-3 rounded-xl bg-[hsla(39,71%,40%,0.3)] p-4",
				children: [/* @__PURE__ */ jsx(WarningIcon, {}), /* @__PURE__ */ jsx(Text, {
					className: "font-body font-medium text-sm text-text-80",
					children: "Items sent to the wrong wallet address can't be recovered!"
				})]
			}),
			ctx.steps.fee?.isSelecting && /* @__PURE__ */ jsx(selectWaasFeeOptions_default, {
				chainId: ctx.item.chainId,
				onCancel: ctx.steps.fee.cancel,
				titleOnConfirm: "Processing transfer..."
			}),
			ctx.formError && /* @__PURE__ */ jsx("div", {
				className: "mt-2 text-red-500 text-sm",
				children: ctx.formError
			})
		] })
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
/*! tailwindcss v4.1.18 | MIT License | https://tailwindcss.com */
@layer properties;
@layer theme, base, components, utilities;
@layer theme {
  :root, :host {
    --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --color-red-100: oklch(93.6% 0.032 17.717);
    --color-red-200: oklch(88.5% 0.062 18.334);
    --color-red-300: oklch(80.8% 0.114 19.571);
    --color-red-400: oklch(70.4% 0.191 22.216);
    --color-red-500: oklch(63.7% 0.237 25.331);
    --color-red-600: oklch(57.7% 0.245 27.325);
    --color-red-700: oklch(50.5% 0.213 27.518);
    --color-red-900: oklch(39.6% 0.141 25.723);
    --color-red-950: oklch(25.8% 0.092 26.042);
    --color-orange-300: oklch(83.7% 0.128 66.29);
    --color-orange-400: oklch(75% 0.183 55.934);
    --color-orange-500: oklch(70.5% 0.213 47.604);
    --color-orange-900: oklch(40.8% 0.123 38.172);
    --color-amber-300: oklch(87.9% 0.169 91.605);
    --color-amber-500: oklch(76.9% 0.188 70.08);
    --color-amber-600: oklch(66.6% 0.179 58.318);
    --color-yellow-100: oklch(97.3% 0.071 103.193);
    --color-yellow-300: oklch(90.5% 0.182 98.111);
    --color-yellow-400: oklch(85.2% 0.199 91.936);
    --color-yellow-500: oklch(79.5% 0.184 86.047);
    --color-yellow-600: oklch(68.1% 0.162 75.834);
    --color-yellow-700: oklch(55.4% 0.135 66.442);
    --color-yellow-900: oklch(42.1% 0.095 57.708);
    --color-yellow-950: oklch(28.6% 0.066 53.813);
    --color-green-200: oklch(92.5% 0.084 155.995);
    --color-green-400: oklch(79.2% 0.209 151.711);
    --color-green-500: oklch(72.3% 0.219 149.579);
    --color-green-600: oklch(62.7% 0.194 149.214);
    --color-green-700: oklch(52.7% 0.154 150.069);
    --color-green-900: oklch(39.3% 0.095 152.535);
    --color-green-950: oklch(26.6% 0.065 152.934);
    --color-blue-300: oklch(80.9% 0.105 251.813);
    --color-blue-400: oklch(70.7% 0.165 254.624);
    --color-blue-500: oklch(62.3% 0.214 259.815);
    --color-blue-600: oklch(54.6% 0.245 262.881);
    --color-blue-900: oklch(37.9% 0.146 265.522);
    --color-indigo-200: oklch(87% 0.065 274.039);
    --color-indigo-400: oklch(67.3% 0.182 276.935);
    --color-indigo-500: oklch(58.5% 0.233 277.117);
    --color-indigo-600: oklch(51.1% 0.262 276.966);
    --color-indigo-700: oklch(45.7% 0.24 277.023);
    --color-indigo-900: oklch(35.9% 0.144 278.697);
    --color-indigo-950: oklch(25.7% 0.09 281.288);
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
    --color-gray-200: oklch(92.8% 0.006 264.531);
    --color-gray-300: oklch(87.2% 0.01 258.338);
    --color-gray-400: oklch(70.7% 0.022 261.325);
    --color-gray-500: oklch(55.1% 0.027 264.364);
    --color-gray-600: oklch(44.6% 0.03 256.802);
    --color-gray-800: oklch(27.8% 0.033 256.848);
    --color-gray-900: oklch(21% 0.034 264.665);
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
    --radius-3xl: 1.5rem;
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
    --color-primary: var(--seq-color-primary);
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
  .right-2 {
    right: calc(var(--spacing) * 2);
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
  .order-1 {
    order: 1;
  }
  .order-2 {
    order: 2;
  }
  .order-3 {
    order: 3;
  }
  .order-123 {
    order: 123;
  }
  .order-456 {
    order: 456;
  }
  .order-789 {
    order: 789;
  }
  .order-first {
    order: -9999;
  }
  .order-last {
    order: 9999;
  }
  .grid-stack {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    grid-template-rows: repeat(1, minmax(0, 1fr));
    :is(& > *) {
      grid-column-start: 1;
    }
    :is(& > *) {
      grid-row-start: 1;
    }
  }
  .col-start-2 {
    grid-column-start: 2;
  }
  .col-start-3 {
    grid-column-start: 3;
  }
  .col-end-4 {
    grid-column-end: 4;
  }
  .row-start-3 {
    grid-row-start: 3;
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
  .line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
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
  .size-2 {
    width: calc(var(--spacing) * 2);
    height: calc(var(--spacing) * 2);
  }
  .size-2\.5 {
    width: calc(var(--spacing) * 2.5);
    height: calc(var(--spacing) * 2.5);
  }
  .size-3 {
    width: calc(var(--spacing) * 3);
    height: calc(var(--spacing) * 3);
  }
  .size-3\.5 {
    width: calc(var(--spacing) * 3.5);
    height: calc(var(--spacing) * 3.5);
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
  .size-full {
    width: 100%;
    height: 100%;
  }
  .h-\(--radix-select-trigger-height\) {
    height: var(--radix-select-trigger-height);
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
  .h-\[84px\] {
    height: 84px;
  }
  .h-\[98px\] {
    height: 98px;
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
  .h-screen {
    height: 100vh;
  }
  .max-h-\(--radix-dropdown-menu-content-available-height\) {
    max-height: var(--radix-dropdown-menu-content-available-height);
  }
  .max-h-\(--radix-select-content-available-height\) {
    max-height: var(--radix-select-content-available-height);
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
  .max-h-\[calc\(100dvh-80px\)\] {
    max-height: calc(100dvh - 80px);
  }
  .max-h-full {
    max-height: 100%;
  }
  .min-h-4 {
    min-height: calc(var(--spacing) * 4);
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
  .w-28 {
    width: calc(var(--spacing) * 28);
  }
  .w-32 {
    width: calc(var(--spacing) * 32);
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
  .w-\[450px\] {
    width: 450px;
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
  .max-w-sm {
    max-width: var(--container-sm);
  }
  .max-w-xs {
    max-width: var(--container-xs);
  }
  .min-w-\(--radix-select-trigger-width\) {
    min-width: var(--radix-select-trigger-width);
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
  .origin-\(--radix-select-content-transform-origin\) {
    transform-origin: var(--radix-select-content-transform-origin);
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
  .translate-x-16 {
    --tw-translate-x: calc(var(--spacing) * 16);
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
  .scroll-my-1 {
    scroll-margin-block: calc(var(--spacing) * 1);
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
  .grid-cols-\[auto_1fr_auto\] {
    grid-template-columns: auto 1fr auto;
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
  .justify-items-start {
    justify-items: start;
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
  .gap-y-2 {
    row-gap: calc(var(--spacing) * 2);
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
  .overflow-clip {
    overflow: clip;
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
  .rounded-3xl {
    border-radius: var(--radius-3xl);
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
  .border-\(--alert-border\) {
    border-color: var(--alert-border);
  }
  .border-\(--callout-header\) {
    border-color: var(--callout-header);
  }
  .border-amber-500 {
    border-color: var(--color-amber-500);
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
  .border-current {
    border-color: currentcolor;
  }
  .border-gray-200 {
    border-color: var(--color-gray-200);
  }
  .border-gray-300 {
    border-color: var(--color-gray-300);
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
  .bg-\(--alert-background\) {
    background-color: var(--alert-background);
  }
  .bg-\(--callout-content\) {
    background-color: var(--callout-content);
  }
  .bg-\(--callout-header\) {
    background-color: var(--callout-header);
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
  .bg-background-active {
    background-color: var(--seq-color-background-active);
  }
  .bg-background-input {
    background-color: var(--seq-color-background-input);
  }
  .bg-background-inverse {
    background-color: var(--seq-color-background-inverse);
  }
  .bg-background-inverse\/20 {
    background-color: var(--seq-color-background-inverse);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--seq-color-background-inverse) 20%, transparent);
    }
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
  .bg-gray-900 {
    background-color: var(--color-gray-900);
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
  .bg-white\/5 {
    background-color: color-mix(in srgb, #fff 5%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-white) 5%, transparent);
    }
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
  .stroke-2 {
    stroke-width: 2;
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
  .pr-8 {
    padding-right: calc(var(--spacing) * 8);
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
  .text-end {
    text-align: end;
  }
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .text-large {
    font-family: "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    font-size: var(--text-xl);
    line-height: var(--tw-leading, var(--text-xl--line-height));
    --tw-leading: calc(var(--spacing) * 7);
    line-height: calc(var(--spacing) * 7);
    --tw-font-weight: var(--font-weight-semibold);
    font-weight: var(--font-weight-semibold);
    --tw-tracking: var(--tracking-normal);
    letter-spacing: var(--tracking-normal);
  }
  .text-small {
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
  .wrap-anywhere {
    overflow-wrap: anywhere;
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
  .text-\(--alert-accent\) {
    color: var(--alert-accent);
  }
  .text-\(--callout-accent\) {
    color: var(--callout-accent);
  }
  .text-amber-300 {
    color: var(--color-amber-300);
  }
  .text-amber-500 {
    color: var(--color-amber-500);
  }
  .text-amber-600 {
    color: var(--color-amber-600);
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
  .text-gray-900 {
    color: var(--color-gray-900);
  }
  .text-green-500 {
    color: var(--color-green-500);
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
  .text-primary\/80 {
    color: var(--seq-color-primary);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--seq-color-primary) 80%, transparent);
    }
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
  .text-success {
    color: var(--seq-color-positive);
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
  .ring-black {
    --tw-ring-color: var(--color-black);
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
  .outline-1 {
    outline-style: var(--tw-outline-style);
    outline-width: 1px;
  }
  .outline-offset-1 {
    outline-offset: 1px;
  }
  .outline-offset-\[-2px\] {
    outline-offset: -2px;
  }
  .outline-border-focus {
    outline-color: var(--color-border-focus);
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
  .transition-\[translate\,opacity\] {
    transition-property: translate,opacity;
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
  .duration-\(--duration\) {
    --tw-duration: var(--duration);
    transition-duration: var(--duration);
  }
  .duration-100 {
    --tw-duration: 100ms;
    transition-duration: 100ms;
  }
  .duration-150 {
    --tw-duration: 150ms;
    transition-duration: 150ms;
  }
  .duration-200 {
    --tw-duration: 200ms;
    transition-duration: 200ms;
  }
  .duration-300 {
    --tw-duration: 300ms;
    transition-duration: 300ms;
  }
  .ease-in-out {
    --tw-ease: var(--ease-in-out);
    transition-timing-function: var(--ease-in-out);
  }
  .ease-linear {
    --tw-ease: linear;
    transition-timing-function: linear;
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
  .\[--alert-accent\:var\(--color-green-700\)\] {
    --alert-accent: var(--color-green-700);
  }
  .\[--alert-accent\:var\(--color-indigo-700\)\] {
    --alert-accent: var(--color-indigo-700);
  }
  .\[--alert-accent\:var\(--color-red-700\)\] {
    --alert-accent: var(--color-red-700);
  }
  .\[--alert-accent\:var\(--color-yellow-700\)\] {
    --alert-accent: var(--color-yellow-700);
  }
  .\[--alert-background\:var\(--color-green-200\)\] {
    --alert-background: var(--color-green-200);
  }
  .\[--alert-background\:var\(--color-indigo-200\)\] {
    --alert-background: var(--color-indigo-200);
  }
  .\[--alert-background\:var\(--color-red-200\)\] {
    --alert-background: var(--color-red-200);
  }
  .\[--alert-background\:var\(--color-yellow-100\)\] {
    --alert-background: var(--color-yellow-100);
  }
  .\[--alert-border\:var\(--color-green-500\)\] {
    --alert-border: var(--color-green-500);
  }
  .\[--alert-border\:var\(--color-indigo-500\)\] {
    --alert-border: var(--color-indigo-500);
  }
  .\[--alert-border\:var\(--color-red-500\)\] {
    --alert-border: var(--color-red-500);
  }
  .\[--alert-border\:var\(--color-yellow-500\)\] {
    --alert-border: var(--color-yellow-500);
  }
  .\[--callout-accent\:var\(--color-green-700\)\] {
    --callout-accent: var(--color-green-700);
  }
  .\[--callout-accent\:var\(--color-indigo-700\)\] {
    --callout-accent: var(--color-indigo-700);
  }
  .\[--callout-accent\:var\(--color-red-700\)\] {
    --callout-accent: var(--color-red-700);
  }
  .\[--callout-accent\:var\(--color-yellow-700\)\] {
    --callout-accent: var(--color-yellow-700);
  }
  .\[--callout-content\:var\(--color-green-200\)\] {
    --callout-content: var(--color-green-200);
  }
  .\[--callout-content\:var\(--color-indigo-200\)\] {
    --callout-content: var(--color-indigo-200);
  }
  .\[--callout-content\:var\(--color-red-200\)\] {
    --callout-content: var(--color-red-200);
  }
  .\[--callout-content\:var\(--color-yellow-100\)\] {
    --callout-content: var(--color-yellow-100);
  }
  .\[--callout-header\:var\(--color-green-500\)\] {
    --callout-header: var(--color-green-500);
  }
  .\[--callout-header\:var\(--color-indigo-500\)\] {
    --callout-header: var(--color-indigo-500);
  }
  .\[--callout-header\:var\(--color-red-500\)\] {
    --callout-header: var(--color-red-500);
  }
  .\[--callout-header\:var\(--color-yellow-500\)\] {
    --callout-header: var(--color-yellow-500);
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
  .not-in-data-current\:duration-1 {
    &:not(:where(*[data-current]) *) {
      --tw-duration: 1ms;
      transition-duration: 1ms;
    }
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
  .focus-within\:ring-2 {
    &:focus-within {
      --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
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
  .hover\:bg-background-inverse\/15 {
    &:hover {
      @media (hover: hover) {
        background-color: var(--seq-color-background-inverse);
        @supports (color: color-mix(in lab, red, red)) {
          background-color: color-mix(in oklab, var(--seq-color-background-inverse) 15%, transparent);
        }
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
  .hover\:text-primary {
    &:hover {
      @media (hover: hover) {
        color: var(--seq-color-primary);
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
  .focus\:bg-background-hover {
    &:focus {
      background-color: var(--seq-color-background-hover);
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
  .inert\:absolute {
    &:is([inert], [inert] *) {
      position: absolute;
    }
  }
  .inert\:z-0 {
    &:is([inert], [inert] *) {
      z-index: 0;
    }
  }
  .inert\:overflow-clip {
    &:is([inert], [inert] *) {
      overflow: clip;
    }
  }
  .inert\:opacity-0 {
    &:is([inert], [inert] *) {
      opacity: 0%;
    }
  }
  .in-data-current\:translate-x-6 {
    :where(*[data-current]) & {
      --tw-translate-x: calc(var(--spacing) * 6);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }
  }
  .in-data-current\:opacity-100 {
    :where(*[data-current]) & {
      opacity: 100%;
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
  .data-auto-advance\:data-current\:w-6 {
    &[data-auto-advance] {
      &[data-current] {
        width: calc(var(--spacing) * 6);
      }
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
  .data-disabled\:text-primary\/50 {
    &[data-disabled] {
      color: var(--seq-color-primary);
      @supports (color: color-mix(in lab, red, red)) {
        color: color-mix(in oklab, var(--seq-color-primary) 50%, transparent);
      }
    }
  }
  .data-disabled\:opacity-80 {
    &[data-disabled] {
      opacity: 80%;
    }
  }
  .data-entered\:translate-x-0 {
    &[data-entered] {
      --tw-translate-x: calc(var(--spacing) * 0);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }
  }
  .data-entered\:opacity-100 {
    &[data-entered] {
      opacity: 100%;
    }
  }
  .data-entering\:translate-x-0 {
    &[data-entering] {
      --tw-translate-x: calc(var(--spacing) * 0);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }
  }
  .data-entering\:opacity-100 {
    &[data-entering] {
      opacity: 100%;
    }
  }
  .data-exited\:translate-x-16 {
    &[data-exited] {
      --tw-translate-x: calc(var(--spacing) * 16);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }
  }
  .data-exited\:opacity-0 {
    &[data-exited] {
      opacity: 0%;
    }
  }
  .data-exited\:transition-none\! {
    &[data-exited] {
      transition-property: none !important;
    }
  }
  .data-exiting\:-translate-x-16 {
    &[data-exiting] {
      --tw-translate-x: calc(var(--spacing) * -16);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }
  }
  .data-exiting\:opacity-0 {
    &[data-exiting] {
      opacity: 0%;
    }
  }
  .data-highlighted\:bg-background-hover {
    &[data-highlighted] {
      background-color: var(--seq-color-background-hover);
    }
  }
  .data-ltr\:data-exited\:-translate-x-16 {
    &[data-ltr] {
      &[data-exited] {
        --tw-translate-x: calc(var(--spacing) * -16);
        translate: var(--tw-translate-x) var(--tw-translate-y);
      }
    }
  }
  .data-ltr\:data-exiting\:translate-x-16 {
    &[data-ltr] {
      &[data-exiting] {
        --tw-translate-x: calc(var(--spacing) * 16);
        translate: var(--tw-translate-x) var(--tw-translate-y);
      }
    }
  }
  .data-pause\:translate-x-0 {
    &[data-pause] {
      --tw-translate-x: calc(var(--spacing) * 0);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }
  }
  .data-pause\:duration-300 {
    &[data-pause] {
      --tw-duration: 300ms;
      transition-duration: 300ms;
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
  .data-\[inset\]\:pl-8 {
    &[data-inset] {
      padding-left: calc(var(--spacing) * 8);
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
  .data-\[placeholder\]\:text-muted {
    &[data-placeholder] {
      color: var(--seq-color-muted);
    }
  }
  .data-\[side\=bottom\]\:translate-y-1 {
    &[data-side="bottom"] {
      --tw-translate-y: calc(var(--spacing) * 1);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }
  }
  .data-\[side\=bottom\]\:slide-in-from-top-2 {
    &[data-side="bottom"] {
      --tw-enter-translate-y: calc(2*var(--spacing)*-1);
    }
  }
  .data-\[side\=left\]\:-translate-x-1 {
    &[data-side="left"] {
      --tw-translate-x: calc(var(--spacing) * -1);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }
  }
  .data-\[side\=left\]\:slide-in-from-right-2 {
    &[data-side="left"] {
      --tw-enter-translate-x: calc(2*var(--spacing));
    }
  }
  .data-\[side\=right\]\:translate-x-1 {
    &[data-side="right"] {
      --tw-translate-x: calc(var(--spacing) * 1);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }
  }
  .data-\[side\=right\]\:slide-in-from-left-2 {
    &[data-side="right"] {
      --tw-enter-translate-x: calc(2*var(--spacing)*-1);
    }
  }
  .data-\[side\=top\]\:-translate-y-1 {
    &[data-side="top"] {
      --tw-translate-y: calc(var(--spacing) * -1);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }
  }
  .data-\[side\=top\]\:slide-in-from-bottom-2 {
    &[data-side="top"] {
      --tw-enter-translate-y: calc(2*var(--spacing));
    }
  }
  .data-\[size\=default\]\:h-13 {
    &[data-size="default"] {
      height: calc(var(--spacing) * 13);
    }
  }
  .data-\[size\=sm\]\:h-8 {
    &[data-size="sm"] {
      height: calc(var(--spacing) * 8);
    }
  }
  .data-\[slot\=checkbox-group\]\:gap-3 {
    &[data-slot="checkbox-group"] {
      gap: calc(var(--spacing) * 3);
    }
  }
  .\*\:data-\[slot\=select-value\]\:line-clamp-1 {
    :is(& > *) {
      &[data-slot="select-value"] {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
    }
  }
  .\*\:data-\[slot\=select-value\]\:flex {
    :is(& > *) {
      &[data-slot="select-value"] {
        display: flex;
      }
    }
  }
  .\*\:data-\[slot\=select-value\]\:items-center {
    :is(& > *) {
      &[data-slot="select-value"] {
        align-items: center;
      }
    }
  }
  .\*\:data-\[slot\=select-value\]\:gap-2 {
    :is(& > *) {
      &[data-slot="select-value"] {
        gap: calc(var(--spacing) * 2);
      }
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
  .data-\[swipe\=move\]\:translate-x-\(--radix-toast-swipe-move-x\) {
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
  .sm\:col-start-3 {
    @media (width >= 40rem) {
      grid-column-start: 3;
    }
  }
  .sm\:col-end-3 {
    @media (width >= 40rem) {
      grid-column-end: 3;
    }
  }
  .sm\:row-start-1 {
    @media (width >= 40rem) {
      grid-row-start: 1;
    }
  }
  .sm\:row-end-3 {
    @media (width >= 40rem) {
      grid-row-end: 3;
    }
  }
  .sm\:mt-0 {
    @media (width >= 40rem) {
      margin-top: calc(var(--spacing) * 0);
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
  .sm\:items-center {
    @media (width >= 40rem) {
      align-items: center;
    }
  }
  .sm\:justify-between {
    @media (width >= 40rem) {
      justify-content: space-between;
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
  .md\:p-12 {
    @media (width >= 48rem) {
      padding: calc(var(--spacing) * 12);
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
  .dark\:\[--alert-accent\:var\(--color-green-400\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --alert-accent: var(--color-green-400);
    }
  }
  .dark\:\[--alert-accent\:var\(--color-indigo-400\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --alert-accent: var(--color-indigo-400);
    }
  }
  .dark\:\[--alert-accent\:var\(--color-red-400\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --alert-accent: var(--color-red-400);
    }
  }
  .dark\:\[--alert-accent\:var\(--color-yellow-400\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --alert-accent: var(--color-yellow-400);
    }
  }
  .dark\:\[--alert-background\:var\(--color-green-950\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --alert-background: var(--color-green-950);
    }
  }
  .dark\:\[--alert-background\:var\(--color-indigo-950\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --alert-background: var(--color-indigo-950);
    }
  }
  .dark\:\[--alert-background\:var\(--color-red-950\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --alert-background: var(--color-red-950);
    }
  }
  .dark\:\[--alert-background\:var\(--color-yellow-950\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --alert-background: var(--color-yellow-950);
    }
  }
  .dark\:\[--alert-border\:var\(--color-green-900\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --alert-border: var(--color-green-900);
    }
  }
  .dark\:\[--alert-border\:var\(--color-indigo-900\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --alert-border: var(--color-indigo-900);
    }
  }
  .dark\:\[--alert-border\:var\(--color-red-900\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --alert-border: var(--color-red-900);
    }
  }
  .dark\:\[--alert-border\:var\(--color-yellow-900\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --alert-border: var(--color-yellow-900);
    }
  }
  .dark\:\[--callout-accent\:var\(--color-green-400\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --callout-accent: var(--color-green-400);
    }
  }
  .dark\:\[--callout-accent\:var\(--color-indigo-400\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --callout-accent: var(--color-indigo-400);
    }
  }
  .dark\:\[--callout-accent\:var\(--color-red-400\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --callout-accent: var(--color-red-400);
    }
  }
  .dark\:\[--callout-accent\:var\(--color-yellow-400\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --callout-accent: var(--color-yellow-400);
    }
  }
  .dark\:\[--callout-content\:var\(--color-green-950\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --callout-content: var(--color-green-950);
    }
  }
  .dark\:\[--callout-content\:var\(--color-indigo-950\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --callout-content: var(--color-indigo-950);
    }
  }
  .dark\:\[--callout-content\:var\(--color-red-950\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --callout-content: var(--color-red-950);
    }
  }
  .dark\:\[--callout-content\:var\(--color-yellow-950\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --callout-content: var(--color-yellow-950);
    }
  }
  .dark\:\[--callout-header\:var\(--color-green-900\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --callout-header: var(--color-green-900);
    }
  }
  .dark\:\[--callout-header\:var\(--color-indigo-900\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --callout-header: var(--color-indigo-900);
    }
  }
  .dark\:\[--callout-header\:var\(--color-red-900\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --callout-header: var(--color-red-900);
    }
  }
  .dark\:\[--callout-header\:var\(--color-yellow-900\)\] {
    &:where([data-theme="dark"], [data-theme="dark"] *) {
      --callout-header: var(--color-yellow-900);
    }
  }
  .\[\&_\[data-slot\=alert-button\]\]\:text-\(--alert-accent\) {
    & [data-slot=alert-button] {
      color: var(--alert-accent);
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
  .\[\&_svg\]\:shrink-0 {
    & svg {
      flex-shrink: 0;
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
  .\[\&_svg\:not\(\[class\*\=\'size-\'\]\)\]\:size-4 {
    & svg:not([class*='size-']) {
      width: calc(var(--spacing) * 4);
      height: calc(var(--spacing) * 4);
    }
  }
  .\[\&_svg\:not\(\[class\*\=\'size-\'\]\)\]\:size-9 {
    & svg:not([class*='size-']) {
      width: calc(var(--spacing) * 9);
      height: calc(var(--spacing) * 9);
    }
  }
  .\[\&_svg\:not\(\[class\*\=\'text-\'\]\)\]\:text-muted {
    & svg:not([class*='text-']) {
      color: var(--seq-color-muted);
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
  .\*\:\[span\]\:last\:flex {
    :is(& > *) {
      &:is(span) {
        &:last-child {
          display: flex;
        }
      }
    }
  }
  .\*\:\[span\]\:last\:items-center {
    :is(& > *) {
      &:is(span) {
        &:last-child {
          align-items: center;
        }
      }
    }
  }
  .\*\:\[span\]\:last\:gap-2 {
    :is(& > *) {
      &:is(span) {
        &:last-child {
          gap: calc(var(--spacing) * 2);
        }
      }
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
  .\[\&\>div\>div\]\:pr-0 {
    &>div>div {
      padding-right: calc(var(--spacing) * 0);
    }
  }
  .\[\&\>input\]\:h-9 {
    &>input {
      height: calc(var(--spacing) * 9);
    }
  }
  .\[\&\>input\]\:text-sm {
    &>input {
      font-size: var(--text-sm);
      line-height: var(--tw-leading, var(--text-sm--line-height));
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
  .\[\&\>svg\]\:mr-2 {
    &>svg {
      margin-right: calc(var(--spacing) * 2);
    }
  }
  .\[\&\>svg\]\:self-start {
    &>svg {
      align-self: flex-start;
    }
  }
  .\[\&\>svg\]\:text-\(--alert-accent\) {
    &>svg {
      color: var(--alert-accent);
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
  --seq-color-info: var(--color-indigo-500);
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
  --seq-color-info: var(--color-indigo-600);
  --seq-color-warning: var(--color-yellow-500);
  --seq-color-destructive: var(--color-red-600);
  --seq-color-primary: var(--color-slate-800);
  --seq-color-secondary: var(--color-slate-800);
  --seq-color-muted: var(--color-slate-500);
  --seq-color-inverse: var(--color-slate-50);
  --seq-color-background-primary: var(--color-slate-50);
  --seq-color-background-secondary: white;
  --seq-color-background-muted: var(--color-slate-100);
  --seq-color-background-inverse: var(--color-slate-950);
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
  color: var(--color-primary);
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
.rdp-disabled:not(.rdp-selected) {
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
			defaultTheme: theme,
			root: container,
			children
		})
	}), document.body) : null;
};

//#endregion
//#region src/react/providers/modal-provider.tsx
const ModalProvider = ({ children }) => {
	const { shadowDom, experimentalShadowDomCssOverride } = useConfig();
	return /* @__PURE__ */ jsxs(Fragment, { children: [children, /* @__PURE__ */ jsx(SequenceCheckoutProvider, { children: /* @__PURE__ */ jsxs(ShadowRoot, {
		enabled: shadowDom ?? true,
		customCSS: experimentalShadowDomCssOverride,
		children: [
			/* @__PURE__ */ jsx(CreateListingModal, {}),
			/* @__PURE__ */ jsx(MakeOfferModal, {}),
			/* @__PURE__ */ jsx(TransferModal, {}),
			/* @__PURE__ */ jsx(SellModal, {}),
			/* @__PURE__ */ jsx(BuyModal, {}),
			/* @__PURE__ */ jsx(switchChainErrorModal_default, {}),
			/* @__PURE__ */ jsx(transactionStatusModal_default, {})
		]
	}) })] });
};

//#endregion
//#region src/react/ui/modals/MakeOfferModal/index.tsx
const useMakeOfferModal = () => {
	return {
		show: (args) => makeOfferModalStore.send({
			type: "open",
			...args
		}),
		close: () => makeOfferModalStore.send({ type: "close" })
	};
};

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
				tokenId: event.tokenId
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
	const { action, tokenId, collectionAddress, chainId, cardType, hideQuantitySelector, labelOverride, className } = props;
	const { show: showBuyModal } = useBuyModal();
	const { show: showMakeOfferModal } = useMakeOfferModal();
	if (cardType === "shop") {
		const { salesContractAddress } = props;
		return /* @__PURE__ */ jsx(ActionButtonBody, {
			action: CollectibleCardAction.BUY,
			tokenId,
			label: labelOverride?.buy ?? "Buy now",
			onClick: () => showBuyModal({
				chainId,
				collectionAddress,
				salesContractAddress,
				item: { tokenId },
				cardType: "shop",
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
				tokenId,
				orderId: lowestListing.orderId,
				marketplace: lowestListing.marketplace,
				cardType: "market",
				hideQuantitySelector
			}),
			icon: /* @__PURE__ */ jsx(CartIcon, {}),
			className
		});
	}
	if (action === CollectibleCardAction.OFFER) return /* @__PURE__ */ jsx(ActionButtonBody, {
		action: CollectibleCardAction.OFFER,
		tokenId,
		label: labelOverride?.offer ?? "Make an offer",
		onClick: () => showMakeOfferModal({
			collectionAddress,
			chainId,
			tokenId
		}),
		className
	});
	return null;
}

//#endregion
//#region src/react/ui/modals/CreateListingModal/index.tsx
const useCreateListingModal = () => {
	return {
		show: (args) => createListingModalStore.send({
			type: "open",
			...args
		}),
		close: () => createListingModalStore.send({ type: "close" })
	};
};

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/ActionButton/components/OwnerActions.tsx
function OwnerActions({ action, tokenId, collectionAddress, chainId, highestOffer, labelOverride, className }) {
	const { show: showCreateListingModal } = useCreateListingModal();
	const { show: showSellModal } = useSellModal();
	const { show: showTransferModal } = useTransferModal();
	if (action === CollectibleCardAction.LIST) return /* @__PURE__ */ jsx(ActionButtonBody, {
		label: labelOverride?.listing ?? "Create listing",
		tokenId,
		onClick: () => showCreateListingModal({
			collectionAddress,
			chainId,
			tokenId
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
			tokenId
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
		if (owned && pendingAction && address && actionsThatOwnersCannotPerform.includes(action) && pendingAction?.tokenId === tokenId) {
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
		if (address && !owned && pendingAction && pendingAction?.tokenId === tokenId) {
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
function ActionButton({ collectionAddress, chainId, tokenId, action, owned, highestOffer, lowestListing, onCannotPerformAction, cardType, salesContractAddress, prioritizeOwnerActions, salePrice, quantityRemaining, unlimitedSupply, hideQuantitySelector, labelOverride, className }) {
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
			quantityRemaining,
			unlimitedSupply,
			hideQuantitySelector,
			labelOverride
		} : {
			cardType: "market",
			lowestListing,
			action,
			tokenId,
			collectionAddress,
			chainId,
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
function MarketCardPresentation({ tokenId, chainId, collectionAddress, collectionType, collectibleMetadata, currency, lowestListing, highestOffer, balance, assetSrcPrefixUrl, onCollectibleClick, onOfferClick, action, showActionButton = true, onCannotPerformAction, prioritizeOwnerActions, hideQuantitySelector, classNames }) {
	return /* @__PURE__ */ jsxs(Card, {
		onClick: onCollectibleClick ? () => onCollectibleClick(tokenId) : void 0,
		onKeyDown: onCollectibleClick ? (e) => {
			if (e.key === "Enter" || e.key === " ") onCollectibleClick(tokenId);
		} : void 0,
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
							className: classNames?.cardPrice,
							type: "market"
						})
					}),
					/* @__PURE__ */ jsx(Card.Badge, {
						type: collectionType,
						balance,
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
function MarketCard({ tokenId, chainId, collectionAddress, collectionType, assetSrcPrefixUrl, cardLoading, collectible, onCollectibleClick, onOfferClick, balance, balanceIsLoading = false, onCannotPerformAction, prioritizeOwnerActions, hideQuantitySelector, classNames }) {
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
		action: determineCardAction({
			hasBalance: !!balance,
			hasOffer: !!highestOffer,
			hasListing: !!lowestListing
		}),
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
				/* @__PURE__ */ jsx(Card.Price, {
					className: classNames?.cardPrice,
					type: "market"
				}),
				/* @__PURE__ */ jsx(Card.Badge, {
					type: collectionType,
					balance,
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
function ShopCardPresentation({ tokenId, chainId, collectionAddress, collectionType, tokenMetadata, saleCurrency, salePrice, assetSrcPrefixUrl, shopState, cardType, salesContractAddress, quantityRemaining, unlimitedSupply, hideQuantitySelector, classNames }) {
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
						children: collectionType === ContractType$1.ERC1155 && salePrice?.amount !== void 0 && saleCurrency && /* @__PURE__ */ jsx(Card.Price, {
							amount: salePrice.amount,
							currency: saleCurrency,
							className: classNames?.cardPrice,
							type: "shop"
						})
					}),
					/* @__PURE__ */ jsx(Card.SaleDetails, {
						quantityRemaining,
						type: collectionType,
						unlimitedSupply,
						className: classNames?.cardSaleDetails
					})
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
function ShopCard({ tokenId, chainId, collectionAddress, collectionType, assetSrcPrefixUrl, cardLoading, cardType, salesContractAddress, tokenMetadata, salePrice, quantityInitial, quantityRemaining, unlimitedSupply, hideQuantitySelector, classNames }) {
	const { data: saleCurrency, isLoading: saleCurrencyLoading } = useCurrency({
		chainId,
		currencyAddress: salePrice?.currencyAddress,
		query: { enabled: !!salePrice?.currencyAddress && !!salesContractAddress && collectionType === ContractType$1.ERC1155 }
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
		quantityRemaining,
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
export { useMarketCardDataPaged as $, useCollectibleBalance as $t, useOrderSteps as A, useCollectionMarketItems as At, generateCancelTransaction as B, usePrimarySaleItems as Bt, useBuyModalContext as C, useCollectionActiveOffersCurrencies as Ct, useGetReceiptFromHash as D, useCollectionMetadata as Dt, useRoyalty as E, collectionActiveListingsCurrenciesQueryOptions as Et, generateListingTransaction as F, useCollectionList as Ft, useTransactionType as G, useCollectibleMarketLowestListing as Gt, useEnsureCorrectChain as H, useCollectibleMetadata as Ht, useGenerateListingTransaction as I, useMarketplaceConfig as It, useOpenConnectModal$1 as J, useCollectibleMarketListPaginated as Jt, usePrimarySaleTransactionSteps as K, useCollectibleMarketListingsCount as Kt, useCancelOrder as L, useCollectionBalanceDetails as Lt, useGenerateSellTransaction as M, useCollectionMarketFilteredCount as Mt, generateOfferTransaction as N, collectionMarketDetailPollingOptions as Nt, useTransferTokens as O, useCollectionMarketItemsPaginated as Ot, useGenerateOfferTransaction as P, useCollectionMarketDetailPolling as Pt, usePrimarySale721CardData as Q, useErc721SaleDetails as Qt, useCancelTransactionSteps as R, useCollectibleTokenBalances as Rt, ErrorBoundary as S, useCurrencyComparePrices as St, royaltyQueryOptions as T, useCollectionActiveListingsCurrencies as Tt, useAutoSelectFeeOption as U, useCollectibleMarketOffersCount as Ut, useGenerateCancelTransaction as V, usePrimarySaleItem as Vt, useBuyTransaction as W, useCollectibleMarketOffers as Wt, useFiltersProgressive as X, useCollectibleMarketHighestOffer as Xt, useFilters as Y, useCollectibleMarketList as Yt, usePrimarySale1155CardData as Z, useCollectibleMarketCount as Zt, PriceInput as _, useTokenBalances as _t, MarketCard as a, DatabeatAnalytics as an, ActionModal as at, LoadingModal as b, useCurrency as bt, useCreateListingModal as c, useSellModal as ct, TransferModal as d, useConnectorMetadata as dt, usePrimarySaleCheckoutOptions as en, useMarketCardData as et, useTransferModalContext as f, transactionPreview_default as ft, useCreateListingModalContext as g, useTokenCurrencyBalance as gt, CreateListingModal as h, useTokenMetadata as ht, NonTradableInventoryCard as i, MarketplaceSdkContext as in, selectWaasFeeOptions_default as it, generateSellTransaction as j, useCollectionMarketFloor as jt, useTransactionExecution as k, useCollectionMarketItemsCount as kt, useMakeOfferModal as l, transactionStatusModal_default as lt, useMakeOfferModalContext as m, useTokenMetadataSearch as mt, ShopCard as n, MarketplaceProvider as nn, TransactionDetails as nt, MarketCardPresentation as o, useAnalytics as on, BaseModal as ot, useTransferModal as p, useTokenRanges as pt, useMarketTransactionSteps as q, useCollectibleMarketListings as qt, ShopCardPresentation as r, MarketplaceQueryClientProvider as rn, TokenPreview as rt, ActionButton as s, useSellModalContext as st, CollectibleCard as t, useConfig as tn, SellModal as tt, ModalProvider as u, useTransactionStatusModal as ut, currencyOptionsSelect_default as v, useInventory as vt, useBuyModal as w, collectionActiveOffersCurrenciesQueryOptions as wt, ErrorModal as x, useCurrencyConvertToUSD as xt, FloorPriceText as y, useCurrencyList as yt, useProcessStep as z, usePrimarySaleItemsCount as zt };
//# sourceMappingURL=react.js.map