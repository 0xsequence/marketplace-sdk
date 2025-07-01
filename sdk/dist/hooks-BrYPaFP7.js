'use client';
import { SEQUENCE_MARKET_V1_ADDRESS, SEQUENCE_MARKET_V2_ADDRESS } from "./src-Dz2CfBL0.js";
import { FilterCondition } from "./builder.gen-B9wR2nvF.js";
import { BaseError, ChainSwitchError, ChainSwitchUserRejectedError, NoWalletConnectedError, TransactionConfirmationError, TransactionExecutionError, TransactionSignatureError, UserRejectedRequestError, WalletInstanceNotFoundError } from "./transaction-B7pHesqY.js";
import { collectableKeys, collectionKeys, getIndexerClient, getMarketplaceClient, getMetadataClient, getQueryClient } from "./api-BwkAXGhb.js";
import { CollectionStatus, ContractType, ExecuteType, OrderSide, PropertyType, StepType, WalletKind } from "./marketplace.gen-lc2B0D_7.js";
import { getPresentableChainName } from "./network-CuCj_F5Q.js";
import { PROVIDER_ID } from "./_internal-DslqcNC1.js";
import { EIP2981_ABI } from "./marketplace-B5Z8G03R.js";
import { ERC1155_SALES_CONTRACT_ABI, ERC721_SALE_ABI } from "./primary-sale-utk1jDRd.js";
import { ERC1155_ABI, ERC721_ABI, SEQUENCE_1155_ITEMS_ABI } from "./token-D9gZVqbX.js";
import { compareAddress } from "./utils-Y02I14cD.js";
import { balanceOfCollectibleOptions, collectibleQueryOptions, collectionDetailsQueryOptions, countOfPrimarySaleItemsOptions, currencyQueryOptions, floorOrderQueryOptions, highestOfferQueryOptions, inventoryOptions, listBalancesOptions, listCollectiblesQueryOptions, listCollectionsQueryOptions, listTokenMetadataQueryOptions, lowestListingQueryOptions, marketCurrenciesQueryOptions, tokenSuppliesQueryOptions } from "./queries-CuHyCJ5v.js";
import { marketplaceConfigOptions } from "./marketplaceConfig-D0832T_-.js";
import { InfoIcon_default } from "./InfoIcon-BcHie7mJ.js";
import { useChain, useOpenConnectModal, useWaasFeeOptions } from "@0xsequence/connect";
import { useAccount, useChainId, usePublicClient, useReadContract, useSwitchChain, useWalletClient, useWriteContract } from "wagmi";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { QueryClientProvider, infiniteQueryOptions, queryOptions, skipToken, useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { Button, Modal, Spinner, Text, WarningIcon } from "@0xsequence/design-system";
import { jsx, jsxs } from "react/jsx-runtime";
import { BaseError as BaseError$1, TransactionReceiptNotFoundError, UserRejectedRequestError as UserRejectedRequestError$1, WaitForTransactionReceiptTimeoutError, custom, erc20Abi, erc721Abi, formatUnits, hexToBigInt, isHex, zeroAddress } from "viem";
import { createStore } from "@xstate/store";
import { useSelector } from "@xstate/store/react";
import { createSerializer, parseAsBoolean, parseAsJson, parseAsString, useQueryState } from "nuqs";
import { observable } from "@legendapp/state";

//#region src/react/queries/collectionBalanceDetails.ts
/**
* Fetches detailed balance information for multiple accounts from the Indexer API
*/
async function fetchCollectionBalanceDetails(params) {
	const { chainId, filter, config } = params;
	const indexerClient = getIndexerClient(chainId, config);
	const promises = filter.accountAddresses.map((accountAddress) => indexerClient.getTokenBalancesDetails({ filter: {
		accountAddresses: [accountAddress],
		contractWhitelist: filter.contractWhitelist,
		omitNativeBalances: filter.omitNativeBalances
	} }));
	const responses = await Promise.all(promises);
	const mergedResponse = responses.reduce((acc, curr) => {
		if (!curr) return acc;
		return {
			page: curr.page,
			nativeBalances: [...acc.nativeBalances || [], ...curr.nativeBalances || []],
			balances: [...acc.balances || [], ...curr.balances || []]
		};
	}, {
		page: {},
		nativeBalances: [],
		balances: []
	});
	if (!mergedResponse) throw new Error("Failed to fetch collection balance details");
	return mergedResponse;
}
function collectionBalanceDetailsQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.filter?.accountAddresses?.length && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [
			"balances",
			"collectionBalanceDetails",
			params
		],
		queryFn: () => fetchCollectionBalanceDetails({
			chainId: params.chainId,
			filter: params.filter,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/utils/_internal/error/context.ts
var MarketplaceSdkProviderNotFoundError = class extends BaseError {
	name = "MarketplaceSDKProviderNotFoundError";
	constructor() {
		super("`useConfig` must be used within `MarketplaceSdkProvider`.");
	}
};

//#endregion
//#region src/utils/_internal/error/config.ts
var ConfigError = class extends BaseError {
	name = "ConfigError";
};
var InvalidProjectAccessKeyError = class extends ConfigError {
	name = "InvalidProjectAccessKeyError";
	constructor(projectAccessKey) {
		super(`Invalid project access key: ${projectAccessKey}`);
	}
};

//#endregion
//#region src/react/provider.tsx
const MarketplaceSdkContext = createContext({});
function MarketplaceProvider({ config, children, openConnectModal }) {
	if (config.projectAccessKey === "" || !config.projectAccessKey) throw new InvalidProjectAccessKeyError(config.projectAccessKey);
	if (openConnectModal) {
		const context = {
			...config,
			openConnectModal
		};
		return /* @__PURE__ */ jsx(MarketplaceQueryClientProvider, { children: /* @__PURE__ */ jsx(MarketplaceSdkContext.Provider, {
			value: context,
			children: /* @__PURE__ */ jsx("div", {
				id: PROVIDER_ID,
				children
			})
		}) });
	}
	return /* @__PURE__ */ jsx(MarketplaceProviderWithSequenceConnect, {
		config,
		children
	});
}
function MarketplaceQueryClientProvider({ children }) {
	const queryClient = getQueryClient();
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children
	});
}
function MarketplaceProviderWithSequenceConnect({ config, children }) {
	const { setOpenConnectModal } = useOpenConnectModal();
	const context = {
		...config,
		openConnectModal: () => setOpenConnectModal(true)
	};
	return /* @__PURE__ */ jsx(MarketplaceQueryClientProvider, { children: /* @__PURE__ */ jsx(MarketplaceSdkContext.Provider, {
		value: context,
		children: /* @__PURE__ */ jsx("div", {
			id: PROVIDER_ID,
			children
		})
	}) });
}

//#endregion
//#region src/react/hooks/useConfig.tsx
function useConfig() {
	const context = useContext(MarketplaceSdkContext);
	if (!context) throw new MarketplaceSdkProviderNotFoundError();
	return context;
}

//#endregion
//#region src/react/hooks/useCollectionBalanceDetails.tsx
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
	const queryOptions$1 = collectionBalanceDetailsQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/useAutoSelectFeeOption.tsx
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
	const autoSelectedOption = useCallback(async () => {
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
	]);
	return autoSelectedOption();
}

//#endregion
//#region src/react/hooks/useMarketplaceConfig.tsx
const useMarketplaceConfig = () => {
	const config = useConfig();
	return useQuery(marketplaceConfigOptions(config));
};

//#endregion
//#region src/react/hooks/useBalanceOfCollectible.tsx
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
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const collection = marketplaceConfig?.market.collections.find((collection$1) => collection$1.itemsAddress === args.collectionAddress);
	const isLaos721 = collection?.contractType === ContractType.LAOS_ERC_721;
	return useQuery(balanceOfCollectibleOptions({
		...args,
		isLaos721
	}, config));
}

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
//#region src/react/_internal/wallet/wallet.ts
const isSequenceWallet = (connector) => connector.id === "sequence" || connector.id === "sequence-waas";
const wallet = ({ wallet: wallet$1, chains, connector, sdkConfig, publicClient }) => {
	const logger = createLogger("Wallet");
	const walletInstance = {
		transport: custom(wallet$1.transport),
		isWaaS: connector.id.endsWith("waas"),
		walletKind: isSequenceWallet(connector) ? WalletKind.sequence : WalletKind.unknown,
		getChainId: wallet$1.getChainId,
		address: async () => {
			let address = wallet$1.account?.address;
			if (!address) [address] = await wallet$1.getAddresses();
			return address;
		},
		switchChain: async (chainId) => {
			logger.debug("Switching chain", { targetChainId: chainId });
			try {
				await wallet$1.switchChain({ id: chainId });
				logger.info("Chain switch successful", { chainId });
				return;
			} catch (e) {
				const error = e;
				logger.error("Chain switch failed", error);
				switch (error.name) {
					case "SwitchChainNotSupportedError": throw new ChainSwitchError(await wallet$1.getChainId(), chainId);
					case "UserRejectedRequestError": throw new UserRejectedRequestError();
					case "ChainNotConfiguredError": return;
					default: throw new ChainSwitchError(await wallet$1.getChainId(), chainId);
				}
			}
		},
		handleSignMessageStep: async (stepItem) => {
			try {
				if (stepItem.id === StepType.signEIP191) {
					logger.debug("Signing with EIP-191", { data: stepItem.data });
					const message = isHex(stepItem.data) ? { raw: stepItem.data } : stepItem.data;
					return await wallet$1.signMessage({
						account: wallet$1.account,
						message
					});
				}
				if (stepItem.id === StepType.signEIP712) {
					logger.debug("Signing with EIP-712", {
						domain: stepItem.domain,
						types: stepItem.signature?.types
					});
					return await wallet$1.signTypedData({
						account: wallet$1.account,
						domain: stepItem.signature.domain,
						types: stepItem.signature.types,
						primaryType: stepItem.signature.primaryType,
						message: stepItem.signature.value
					});
				}
			} catch (e) {
				const error = e;
				logger.error("Signature failed", error);
				if (error.cause instanceof BaseError$1) {
					const viemError = error.cause;
					if (viemError instanceof UserRejectedRequestError$1) throw new UserRejectedRequestError();
				}
				throw new TransactionSignatureError(stepItem.id, error);
			}
		},
		handleSendTransactionStep: async (chainId, stepItem) => {
			logger.debug("Sending transaction", {
				chainId,
				to: stepItem.to,
				value: stepItem.value
			});
			const chain = chains.find((chain$1) => chain$1.id === chainId);
			try {
				return await wallet$1.sendTransaction({
					chain,
					data: stepItem.data,
					account: wallet$1.account,
					to: stepItem.to,
					value: hexToBigInt(stepItem.value || "0x0"),
					...stepItem.maxFeePerGas && { maxFeePerGas: hexToBigInt(stepItem.maxFeePerGas) },
					...stepItem.maxPriorityFeePerGas && { maxPriorityFeePerGas: hexToBigInt(stepItem.maxPriorityFeePerGas) },
					...stepItem.gas && { gas: hexToBigInt(stepItem.gas) }
				});
			} catch (e) {
				const error = e;
				logger.error("Transaction failed", error);
				if (error.cause instanceof BaseError$1) {
					const viemError = error.cause;
					if (viemError instanceof UserRejectedRequestError$1) throw new UserRejectedRequestError();
				}
				throw new TransactionExecutionError(stepItem.id, error);
			}
		},
		handleConfirmTransactionStep: async (txHash, chainId) => {
			logger.debug("Confirming transaction", {
				txHash,
				chainId
			});
			try {
				const receipt = await awaitTransactionReceipt({
					txHash,
					chainId,
					sdkConfig
				});
				logger.info("Transaction confirmed", {
					txHash,
					receipt
				});
				return receipt;
			} catch (error) {
				logger.error("Transaction confirmation failed", error);
				throw new TransactionConfirmationError(txHash, error);
			}
		},
		hasTokenApproval: async ({ tokenType, contractAddress, spender }) => {
			const walletAddress = await walletInstance.address();
			const spenderAddress = spender === "sequenceMarketV1" ? SEQUENCE_MARKET_V1_ADDRESS : spender === "sequenceMarketV2" ? SEQUENCE_MARKET_V2_ADDRESS : spender;
			switch (tokenType) {
				case "ERC20": return await publicClient.readContract({
					address: contractAddress,
					abi: erc20Abi,
					functionName: "allowance",
					args: [walletAddress, spenderAddress]
				});
				case "ERC721": return await publicClient.readContract({
					address: contractAddress,
					abi: erc721Abi,
					functionName: "isApprovedForAll",
					args: [walletAddress, spenderAddress]
				});
				case "ERC1155": return await publicClient.readContract({
					address: contractAddress,
					abi: ERC1155_ABI,
					functionName: "isApprovedForAll",
					args: [walletAddress, spenderAddress]
				});
				default: throw new Error("Unsupported contract type for approval checking");
			}
		},
		publicClient
	};
	return walletInstance;
};
const ONE_MIN = 60 * 1e3;
const THREE_MIN = 3 * ONE_MIN;
const awaitTransactionReceipt = async ({ txHash, chainId, sdkConfig, timeout = THREE_MIN }) => {
	const indexer = getIndexerClient(chainId, sdkConfig);
	return Promise.race([new Promise((resolve, reject) => {
		indexer.subscribeReceipts({ filter: { txnHash: txHash } }, {
			onMessage: ({ receipt }) => {
				resolve(receipt);
			},
			onError: () => {
				reject(TransactionReceiptNotFoundError);
			}
		});
	}), new Promise((_, reject) => {
		setTimeout(() => {
			reject(WaitForTransactionReceiptTimeoutError);
		}, timeout);
	})]);
};

//#endregion
//#region src/react/_internal/wallet/useWallet.ts
const useWallet = () => {
	const { chains } = useSwitchChain();
	const { data: walletClient, isLoading: wagmiWalletIsLoading, isError: wagmiWalletIsError } = useWalletClient();
	const { connector, isConnected, isConnecting } = useAccount();
	const sdkConfig = useConfig();
	const chainId = useChainId();
	const publicClient = usePublicClient();
	const { data, isLoading, isError } = useQuery({
		queryKey: [
			"wallet",
			chainId,
			connector?.uid
		],
		queryFn: walletClient && connector && isConnected && publicClient ? () => {
			return wallet({
				wallet: walletClient,
				chains,
				connector,
				sdkConfig,
				publicClient
			});
		} : skipToken,
		staleTime: Number.POSITIVE_INFINITY
	});
	return {
		wallet: data,
		isLoading: isLoading || isConnecting || wagmiWalletIsLoading,
		isError: isError || wagmiWalletIsError
	};
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
//#region src/react/ui/modals/_internal/components/switchChainModal/store.ts
const initialContext = {
	isOpen: false,
	chainIdToSwitchTo: void 0,
	isSwitching: false,
	onSuccess: void 0,
	onError: void 0,
	onClose: void 0
};
const switchChainModalStore = createStore({
	context: initialContext,
	on: {
		open: (context, event) => ({
			...context,
			isOpen: true,
			chainIdToSwitchTo: event.chainIdToSwitchTo,
			onSuccess: event.onSuccess,
			onError: event.onError,
			onClose: event.onClose
		}),
		close: (context) => ({
			...context,
			isOpen: false,
			chainIdToSwitchTo: void 0,
			isSwitching: false,
			onSuccess: void 0,
			onError: void 0,
			onClose: void 0
		}),
		setSwitching: (context, event) => ({
			...context,
			isSwitching: event.isSwitching
		})
	}
});
const useIsOpen = () => useSelector(switchChainModalStore, (state) => state.context.isOpen);
const useChainIdToSwitchTo = () => useSelector(switchChainModalStore, (state) => state.context.chainIdToSwitchTo);
const useIsSwitching = () => useSelector(switchChainModalStore, (state) => state.context.isSwitching);
const useOnSuccess = () => useSelector(switchChainModalStore, (state) => state.context.onSuccess);
const useOnError = () => useSelector(switchChainModalStore, (state) => state.context.onError);
const useOnClose = () => useSelector(switchChainModalStore, (state) => state.context.onClose);

//#endregion
//#region src/react/ui/modals/_internal/components/switchChainModal/index.tsx
const useSwitchChainModal = () => {
	return {
		show: (args) => switchChainModalStore.send({
			type: "open",
			...args
		}),
		close: () => switchChainModalStore.send({ type: "close" })
	};
};
const SwitchChainModal = () => {
	const isOpen = useIsOpen();
	const chainIdToSwitchTo = useChainIdToSwitchTo();
	const isSwitching = useIsSwitching();
	const onSuccess = useOnSuccess();
	const onError = useOnError();
	const onClose = useOnClose();
	const chainName = chainIdToSwitchTo ? getPresentableChainName(chainIdToSwitchTo) : "";
	const { switchChainAsync } = useSwitchChain();
	async function handleSwitchChain() {
		switchChainModalStore.send({
			type: "setSwitching",
			isSwitching: true
		});
		try {
			if (!chainIdToSwitchTo) return;
			await switchChainAsync({ chainId: Number(chainIdToSwitchTo) });
			if (onSuccess && typeof onSuccess === "function") onSuccess();
			switchChainModalStore.send({ type: "close" });
		} catch (error) {
			if (error instanceof Error && onError && typeof onError === "function") onError(error);
		} finally {
			switchChainModalStore.send({
				type: "setSwitching",
				isSwitching: false
			});
		}
	}
	const handleClose = () => {
		if (onClose && typeof onClose === "function") onClose();
		switchChainModalStore.send({ type: "close" });
	};
	if (!isOpen || !chainIdToSwitchTo) return null;
	return /* @__PURE__ */ jsx(Modal, {
		isDismissible: true,
		onClose: handleClose,
		disableAnimation: true,
		size: "sm",
		overlayProps: MODAL_OVERLAY_PROPS,
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid flex-col gap-6 p-7",
			children: [
				/* @__PURE__ */ jsx(Text, {
					className: "text-xl",
					fontWeight: "bold",
					color: "text100",
					children: "Wrong network"
				}),
				/* @__PURE__ */ jsx(AlertMessage, {
					type: "warning",
					message: `You need to switch to ${chainName} network before completing the transaction`
				}),
				/* @__PURE__ */ jsx(Button, {
					className: `${isSwitching ? "flex w-[147px] items-center justify-center [&>div]:justify-center" : "w-[147px]"} flex justify-self-end`,
					name: "switch-chain",
					id: "switch-chain-button",
					size: "sm",
					label: isSwitching ? /* @__PURE__ */ jsx("div", {
						"data-testid": "switch-chain-spinner",
						children: /* @__PURE__ */ jsx(Spinner, { className: "spinner" })
					}) : "Switch Network",
					variant: "primary",
					pending: isSwitching,
					shape: "square",
					onClick: handleSwitchChain,
					"data-testid": "switch-chain-button"
				})
			]
		})
	});
};
var switchChainModal_default = SwitchChainModal;

//#endregion
//#region src/react/hooks/useGenerateCancelTransaction.tsx
const generateCancelTransaction = async (args, config) => {
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.generateCancelTransaction({
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
			exact: false
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
//#region src/react/hooks/useCancelTransactionSteps.tsx
const useCancelTransactionSteps = ({ collectionAddress, chainId, callbacks, setSteps, onSuccess, onError }) => {
	const { show: showSwitchChainModal } = useSwitchChainModal();
	const { wallet: wallet$1, isLoading, isError } = useWallet();
	const walletIsInitialized = wallet$1 && !isLoading && !isError;
	const sdkConfig = useConfig();
	const marketplaceClient = getMarketplaceClient(sdkConfig);
	const { generateCancelTransactionAsync } = useGenerateCancelTransaction({ chainId });
	const getWalletChainId = async () => {
		return await wallet$1?.getChainId();
	};
	const switchChain = async () => {
		await wallet$1?.switchChain(Number(chainId));
	};
	const checkAndSwitchChain = async () => {
		const walletChainId = await getWalletChainId();
		const isWaaS = wallet$1?.isWaaS;
		const chainIdMismatch = walletChainId !== Number(chainId);
		return new Promise((resolve, reject) => {
			if (chainIdMismatch) if (isWaaS) switchChain().then(resolve).catch(reject);
			else showSwitchChainModal({
				chainIdToSwitchTo: chainId,
				onSuccess: () => resolve({ chainId }),
				onError: (error) => reject(error),
				onClose: () => reject(new ChainSwitchUserRejectedError())
			});
			else resolve({ chainId });
		});
	};
	const getCancelSteps = async ({ orderId, marketplace }) => {
		try {
			const address = await wallet$1?.address();
			if (!address) throw new Error("Wallet address not found");
			const steps = await generateCancelTransactionAsync({
				chainId,
				collectionAddress,
				maker: address,
				marketplace,
				orderId
			});
			return steps;
		} catch (error) {
			if (callbacks?.onError) callbacks.onError(error);
			else console.debug("onError callback not provided:", error);
		}
	};
	const cancelOrder = async ({ orderId, marketplace }) => {
		const queryClient = getQueryClient();
		if (!walletIsInitialized) throw new WalletInstanceNotFoundError();
		try {
			await checkAndSwitchChain();
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
			if (transactionStep && wallet$1) {
				hash = await executeTransaction({ transactionStep });
				if (hash) {
					await wallet$1.handleConfirmTransactionStep(hash, Number(chainId));
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
				reservoirOrderId = await executeSignature({ signatureStep });
				if (onSuccess && typeof onSuccess === "function") {
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
		} catch (error) {
			invalidateQueriesOnCancel({ queryClient });
			setSteps((prev) => ({
				...prev,
				isExecuting: false
			}));
			if (onError && typeof onError === "function") onError(error);
		}
	};
	const executeTransaction = async ({ transactionStep }) => {
		const hash = await wallet$1?.handleSendTransactionStep(Number(chainId), transactionStep);
		return hash;
	};
	const executeSignature = async ({ signatureStep }) => {
		const signature = await wallet$1?.handleSignMessageStep(signatureStep);
		const result = await marketplaceClient.execute({
			chainId: String(chainId),
			signature,
			method: signatureStep.post?.method,
			endpoint: signatureStep.post?.endpoint,
			body: signatureStep.post?.body,
			executeType: ExecuteType.order
		});
		return result.orderId;
	};
	return { cancelOrder };
};

//#endregion
//#region src/react/hooks/useCancelOrder.tsx
const useCancelOrder = ({ collectionAddress, chainId, onSuccess, onError }) => {
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
		enabled: !!pendingFeeOptionConfirmation
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
		isExecuting: steps.isExecuting,
		cancellingOrderId
	};
};

//#endregion
//#region src/react/queries/checkoutOptionsSalesContract.ts
/**
* Fetches checkout options for sales contract from the Marketplace API
*/
async function fetchCheckoutOptionsSalesContract(params) {
	const { chainId, walletAddress, contractAddress, collectionAddress, items, config } = params;
	const client = getMarketplaceClient(config);
	const apiArgs = {
		chainId: String(chainId),
		wallet: walletAddress,
		contractAddress,
		collectionAddress,
		items
	};
	const result = await client.checkoutOptionsSalesContract(apiArgs);
	return result;
}
function checkoutOptionsSalesContractQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.walletAddress && params.contractAddress && params.collectionAddress && params.items?.length && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [
			"checkout",
			"options",
			"salesContract",
			params
		],
		queryFn: () => fetchCheckoutOptionsSalesContract({
			chainId: params.chainId,
			walletAddress: params.walletAddress,
			contractAddress: params.contractAddress,
			collectionAddress: params.collectionAddress,
			items: params.items,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/hooks/useCheckoutOptionsSalesContract.tsx
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
	const queryOptions$1 = checkoutOptionsSalesContractQueryOptions(params === skipToken ? {
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
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/useCollectible.tsx
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = collectibleQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/queries/collection.ts
/**
* Fetches collection information from the metadata API
*/
async function fetchCollection(params) {
	const { collectionAddress, chainId, config } = params;
	const metadataClient = getMetadataClient(config);
	const result = await metadataClient.getContractInfo({
		chainID: chainId.toString(),
		contractAddress: collectionAddress
	});
	return result.contractInfo;
}
function collectionQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectionKeys.detail, params],
		queryFn: () => fetchCollection({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/hooks/useCollection.tsx
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = collectionQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/useCollectionDetails.ts
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = collectionDetailsQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/useCollectionDetailsPolling.tsx
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
			const interval = Math.min(INITIAL_POLLING_INTERVAL * 1.5 ** currentAttempt, MAX_POLLING_INTERVAL);
			return interval;
		},
		refetchOnWindowFocus: false,
		retry: false,
		enabled: args.query?.enabled ?? true
	});
};
const useCollectionDetailsPolling = (args) => {
	const config = useConfig();
	return useQuery(collectionDetailsPollingOptions(args, config));
};

//#endregion
//#region src/react/queries/convertPriceToUSD.ts
/**
* Converts a price amount from a specific currency to USD using exchange rates
*/
async function fetchConvertPriceToUSD(params) {
	const { chainId, currencyAddress, amountRaw, config } = params;
	const queryClient = getQueryClient();
	const currencies = await queryClient.fetchQuery(marketCurrenciesQueryOptions({
		chainId,
		config
	}));
	const currencyDetails = currencies.find((c) => c.contractAddress.toLowerCase() === currencyAddress.toLowerCase());
	if (!currencyDetails) throw new Error("Currency not found");
	const amountDecimal = Number(formatUnits(BigInt(amountRaw), currencyDetails.decimals));
	const usdAmount = amountDecimal * currencyDetails.exchangeRate;
	return {
		usdAmount,
		usdAmountFormatted: usdAmount.toFixed(2)
	};
}
function convertPriceToUSDQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.currencyAddress && params.amountRaw && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [
			"currency",
			"convertPriceToUSD",
			params
		],
		queryFn: () => fetchConvertPriceToUSD({
			chainId: params.chainId,
			currencyAddress: params.currencyAddress,
			amountRaw: params.amountRaw,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/comparePrices.ts
/**
* Compares prices between different currencies by converting both to USD
*/
async function fetchComparePrices(params) {
	const { chainId, priceAmountRaw, priceCurrencyAddress, compareToPriceAmountRaw, compareToPriceCurrencyAddress, config } = params;
	const [priceUSD, compareToPriceUSD] = await Promise.all([fetchConvertPriceToUSD({
		chainId,
		currencyAddress: priceCurrencyAddress,
		amountRaw: priceAmountRaw,
		config
	}), fetchConvertPriceToUSD({
		chainId,
		currencyAddress: compareToPriceCurrencyAddress,
		amountRaw: compareToPriceAmountRaw,
		config
	})]);
	const difference = priceUSD.usdAmount - compareToPriceUSD.usdAmount;
	if (compareToPriceUSD.usdAmount === 0) throw new Error("Cannot compare to zero price");
	const percentageDifference = difference / compareToPriceUSD.usdAmount * 100;
	const isAbove = percentageDifference > 0;
	const isSame = percentageDifference === 0;
	return {
		percentageDifference,
		percentageDifferenceFormatted: Math.abs(percentageDifference).toFixed(2),
		status: isAbove ? "above" : isSame ? "same" : "below"
	};
}
function comparePricesQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.priceAmountRaw && params.priceCurrencyAddress && params.compareToPriceAmountRaw && params.compareToPriceCurrencyAddress && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [
			"currency",
			"conversion",
			"compare",
			params
		],
		queryFn: () => fetchComparePrices({
			chainId: params.chainId,
			priceAmountRaw: params.priceAmountRaw,
			priceCurrencyAddress: params.priceCurrencyAddress,
			compareToPriceAmountRaw: params.compareToPriceAmountRaw,
			compareToPriceCurrencyAddress: params.compareToPriceCurrencyAddress,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/hooks/useComparePrices.tsx
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = comparePricesQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/useConvertPriceToUSD.tsx
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = convertPriceToUSDQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/queries/countListingsForCollectible.ts
/**
* Fetches count of listings for a collectible from the marketplace API
*/
async function fetchCountListingsForCollectible(params) {
	const { collectionAddress, chainId, collectibleId, config, filter } = params;
	const client = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		tokenId: collectibleId,
		filter
	};
	const result = await client.getCountOfListingsForCollectible(apiArgs);
	return result.count;
}
function countListingsForCollectibleQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.collectibleId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.listingsCount, params],
		queryFn: () => fetchCountListingsForCollectible({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			collectibleId: params.collectibleId,
			config: params.config,
			filter: params.filter
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/hooks/useCountListingsForCollectible.tsx
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = countListingsForCollectibleQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/queries/countOfCollectables.ts
/**
* Fetches count of collectibles from the marketplace API
*/
async function fetchCountOfCollectables(params) {
	const { collectionAddress, chainId, config, filter, side } = params;
	const client = getMarketplaceClient(config);
	if (filter && side) {
		const apiArgs$1 = {
			contractAddress: collectionAddress,
			chainId: String(chainId),
			filter,
			side
		};
		const result$1 = await client.getCountOfFilteredCollectibles(apiArgs$1);
		return result$1.count;
	}
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId)
	};
	const result = await client.getCountOfAllCollectibles(apiArgs);
	return result.count;
}
function countOfCollectablesQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.counts, params],
		queryFn: () => fetchCountOfCollectables({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config,
			filter: params.filter,
			side: params.side
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/hooks/useCountOfCollectables.tsx
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = countOfCollectablesQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/queries/countOffersForCollectible.ts
/**
* Fetches count of offers for a collectible from the marketplace API
*/
async function fetchCountOffersForCollectible(params) {
	const { collectionAddress, chainId, collectibleId, config, filter } = params;
	const client = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		tokenId: collectibleId,
		filter
	};
	const result = await client.getCountOfOffersForCollectible(apiArgs);
	return result.count;
}
function countOffersForCollectibleQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.collectibleId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.offersCount, params],
		queryFn: () => fetchCountOffersForCollectible({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			collectibleId: params.collectibleId,
			config: params.config,
			filter: params.filter
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/hooks/useCountOffersForCollectible.tsx
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = countOffersForCollectibleQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/useCountOfPrimarySaleItems.tsx
function useCountOfPrimarySaleItems(args) {
	const config = useConfig();
	return useQuery(countOfPrimarySaleItemsOptions(args, config));
}

//#endregion
//#region src/react/hooks/useCurrency.tsx
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
//#region src/react/hooks/useTokenSupplies.ts
/**
* Hook to fetch token supplies from the indexer or LAOS API
*
* Retrieves supply information for tokens from a specific collection.
* Automatically chooses between indexer and LAOS APIs based on the isLaos721 flag.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.isLaos721 - Whether to use LAOS API instead of indexer
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
* With LAOS API:
* ```typescript
* const { data, isLoading } = useTokenSupplies({
*   chainId: 1,
*   collectionAddress: '0x...',
*   isLaos721: true
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = tokenSuppliesQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/useERC721SaleMintedTokens.tsx
function useERC721SaleMintedTokens({ chainId, contractAddress, salesContractAddress, tokenIds, enabled = true }) {
	const { data: saleDetails, isLoading: saleDetailsLoading, error: saleDetailsError } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC721_SALE_ABI,
		functionName: "saleDetails",
		query: { enabled }
	});
	const { data: tokenSupplies, isLoading: tokenSuppliesLoading } = useTokenSupplies({
		chainId,
		collectionAddress: contractAddress
	});
	const isLoading = saleDetailsLoading || tokenSuppliesLoading;
	const ownedCount = tokenIds.reduce((count, tokenId) => {
		let supply;
		if (tokenSupplies) supply = tokenSupplies.tokenIDs.find((s) => s.tokenID === tokenId);
		const hasOwner = supply ? BigInt(supply.supply) > 0n : false;
		return count + (hasOwner ? 1 : 0);
	}, 0);
	const totalSupplyCap = saleDetails?.supplyCap ? Number(saleDetails.supplyCap) : 0;
	const remainingCount = Math.max(0, totalSupplyCap - ownedCount);
	return {
		ownedCount,
		totalSupplyCap,
		remainingCount,
		isLoading,
		error: saleDetailsError,
		saleDetails
	};
}

//#endregion
//#region src/react/hooks/useFilterState.tsx
const validateFilters = (value) => {
	if (!Array.isArray(value)) return [];
	return value.filter((f) => typeof f === "object" && typeof f.name === "string" && Object.values(PropertyType).includes(f.type));
};
const filtersParser = parseAsJson(validateFilters).withDefault([]);
const searchParser = parseAsString.withDefault("");
const listedOnlyParser = parseAsBoolean.withDefault(false);
const serialize = createSerializer({
	filters: filtersParser,
	search: searchParser,
	listedOnly: listedOnlyParser
}, { urlKeys: {
	filters: "f",
	search: "q",
	listedOnly: "l"
} });
function useFilterState() {
	const [filterOptions, setFilterOptions] = useQueryState("filters", filtersParser);
	const [searchText, setSearchText] = useQueryState("search", searchParser);
	const [showListedOnly, setShowListedOnly] = useQueryState("listedOnly", listedOnlyParser);
	const helpers = useMemo(() => ({
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
			const otherFilters = filterOptions?.filter((f) => !(f.name === name)) ?? [];
			setFilterOptions(otherFilters);
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
				const otherFilters$1 = filterOptions?.filter((f) => !(f.name === name)) ?? [];
				setFilterOptions(otherFilters$1);
				return;
			}
			const otherFilters = filterOptions?.filter((f) => !(f.name === name)) ?? [];
			setFilterOptions([...otherFilters, {
				name,
				type: PropertyType.INT,
				min,
				max
			}]);
		},
		clearAllFilters: () => {
			setShowListedOnly(false);
			setFilterOptions([]);
			setSearchText("");
		}
	}), [
		filterOptions,
		setFilterOptions,
		setShowListedOnly,
		setSearchText
	]);
	return {
		filterOptions,
		searchText,
		showListedOnly,
		setFilterOptions,
		setSearchText,
		setShowListedOnly,
		...helpers,
		serialize
	};
}

//#endregion
//#region src/react/queries/filters.ts
/**
* Fetches collection filters from the Metadata API with optional marketplace filtering
*/
async function fetchFilters(params) {
	const { chainId, collectionAddress, showAllFilters, excludePropertyValues, config } = params;
	const metadataClient = getMetadataClient(config);
	const filters = await metadataClient.getTokenMetadataPropertyFilters({
		chainID: chainId.toString(),
		contractAddress: collectionAddress,
		excludeProperties: [],
		excludePropertyValues
	}).then((resp) => resp.filters);
	if (showAllFilters) return filters;
	const queryClient = getQueryClient();
	const marketplaceConfig = await queryClient.fetchQuery(marketplaceConfigOptions(config));
	const collectionFilters = marketplaceConfig.market.collections.find((c) => compareAddress(c.itemsAddress, collectionAddress))?.filterSettings;
	if (!collectionFilters?.exclusions || collectionFilters.exclusions.length === 0 || !collectionFilters.filterOrder || collectionFilters.filterOrder.length === 0) return filters;
	const { filterOrder, exclusions } = collectionFilters;
	const sortedFilters = filters.toSorted((a, b) => {
		const aIndex = filterOrder.indexOf(a.name) > -1 ? filterOrder.indexOf(a.name) : filterOrder.length;
		const bIndex = filterOrder.indexOf(b.name) > -1 ? filterOrder.indexOf(b.name) : filterOrder.length;
		return aIndex - bIndex;
	});
	const filteredResults = sortedFilters.reduce((acc, filter) => {
		const exclusionRule = exclusions.find((rule) => rule.key === filter.name);
		if (!exclusionRule) {
			acc.push(filter);
			return acc;
		}
		if (exclusionRule.condition === FilterCondition.ENTIRE_KEY) return acc;
		if (exclusionRule.condition === FilterCondition.SPECIFIC_VALUE && exclusionRule.value) {
			const filteredValues = filter.values?.filter((value) => value !== exclusionRule.value) || [];
			if (filteredValues.length > 0) acc.push({
				...filter,
				values: filteredValues
			});
		}
		return acc;
	}, []);
	return filteredResults;
}
function filtersQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.collectionAddress && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: ["filters", params],
		queryFn: () => fetchFilters({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			showAllFilters: params.showAllFilters,
			excludePropertyValues: params.excludePropertyValues,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/hooks/useFilters.tsx
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
	const queryOptions$1 = filtersQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
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
//#region src/react/hooks/useFloorOrder.tsx
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = floorOrderQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/utils/date.ts
const dateToUnixTime = (date) => Math.floor(date.getTime() / 1e3).toString();

//#endregion
//#region src/react/hooks/useGenerateListingTransaction.tsx
const generateListingTransaction = async (params, config) => {
	const args = {
		...params,
		chainId: String(params.chainId),
		listing: {
			...params.listing,
			expiry: dateToUnixTime(params.listing.expiry)
		}
	};
	const marketplaceClient = getMarketplaceClient(config);
	return (await marketplaceClient.generateListingTransaction(args)).steps;
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
//#region src/react/hooks/useGenerateOfferTransaction.tsx
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
	const marketplaceClient = getMarketplaceClient(config);
	return (await marketplaceClient.generateOfferTransaction(args)).steps;
};
const useGenerateOfferTransaction = (params) => {
	const config = useConfig();
	const { wallet: wallet$1 } = useWallet();
	const { mutate, mutateAsync,...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args) => generateOfferTransaction({
			...args,
			chainId: params.chainId
		}, config, wallet$1?.walletKind)
	});
	return {
		...result,
		generateOfferTransaction: mutate,
		generateOfferTransactionAsync: mutateAsync
	};
};

//#endregion
//#region src/react/hooks/useGenerateSellTransaction.tsx
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
//#region src/react/queries/primarySaleItems.ts
/**
* Fetches primary sale items from the marketplace API
*/
async function fetchPrimarySaleItems(params) {
	const { chainId, primarySaleContractAddress, filter, page, config } = params;
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.listPrimarySaleItems({
		chainId: String(chainId),
		primarySaleContractAddress,
		filter,
		page
	});
}
const listPrimarySaleItemsQueryOptions = (params) => {
	const enabled = Boolean(params.primarySaleContractAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	const initialPage = {
		page: 1,
		pageSize: 30
	};
	return infiniteQueryOptions({
		queryKey: ["listPrimarySaleItems", params],
		queryFn: async ({ pageParam }) => {
			return fetchPrimarySaleItems({
				chainId: params.chainId,
				primarySaleContractAddress: params.primarySaleContractAddress,
				filter: params.filter,
				page: pageParam,
				config: params.config
			});
		},
		initialPageParam: initialPage,
		getNextPageParam: (lastPage) => lastPage.page?.more ? {
			page: (lastPage.page?.page || 1) + 1,
			pageSize: lastPage.page?.pageSize || 30
		} : void 0,
		...params.query,
		enabled
	});
};

//#endregion
//#region src/react/hooks/useGetCountOfPrimarySaleItems.tsx
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = listPrimarySaleItemsQueryOptions({
		config,
		...rest
	});
	return useInfiniteQuery(queryOptions$1);
}

//#endregion
//#region src/react/queries/getTokenRanges.ts
/**
* Fetches token ID ranges for a collection from the Indexer API
*/
async function fetchGetTokenRanges(params) {
	const { chainId, collectionAddress, config } = params;
	const indexerClient = getIndexerClient(chainId, config);
	const response = await indexerClient.getTokenIDRanges({ contractAddress: collectionAddress });
	if (!response) throw new Error("Failed to fetch token ranges");
	return response;
}
function getTokenRangesQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.collectionAddress && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [
			"indexer",
			"tokenRanges",
			params
		],
		queryFn: () => fetchGetTokenRanges({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/hooks/useGetTokenRanges.tsx
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = getTokenRangesQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/useHighestOffer.tsx
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = highestOfferQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/useInventory.tsx
function useInventory(args) {
	const config = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const isLaos721 = marketplaceConfig?.market?.collections?.find((c) => c.itemsAddress === args.collectionAddress && c.chainId === args.chainId)?.contractType === ContractType.LAOS_ERC_721;
	return useInfiniteQuery(inventoryOptions({
		...args,
		isLaos721
	}, config));
}

//#endregion
//#region src/react/hooks/useListCollectibles.tsx
/**
* Hook to fetch a list of collectibles with infinite pagination support
*
* Fetches collectibles from the marketplace with support for filtering, pagination,
* and special handling for shop marketplace types and LAOS721 contracts.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.collectionAddress - The collection contract address
* @param params.side - Order side (listing or bid)
* @param params.filter - Optional filtering parameters
* @param params.isLaos721 - Whether the collection is a LAOS721 contract
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
*
* @example
* For LAOS721 collections:
* ```typescript
* const { data } = useListCollectibles({
*   chainId: 137,
*   collectionAddress: '0x...',
*   side: OrderSide.listing,
*   isLaos721: true,
*   filter: {
*     inAccounts: ['0x...']
*   }
* })
* ```
*/
function useListCollectibles(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = listCollectiblesQueryOptions({
		config,
		...rest
	});
	return useInfiniteQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/useListPrimarySaleItems.tsx
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = listPrimarySaleItemsQueryOptions({
		config,
		...rest
	});
	return useInfiniteQuery(queryOptions$1);
}

//#endregion
//#region src/react/hooks/useList721ShopCardData.tsx
function useList721ShopCardData({ tokenIds, chainId, contractAddress, salesContractAddress, enabled = true }) {
	const { showListedOnly } = useFilterState();
	const { data: primarySaleItems, isLoading: primarySaleItemsLoading, error: primarySaleItemsError } = useListPrimarySaleItems({
		chainId,
		primarySaleContractAddress: salesContractAddress,
		filter: { includeEmpty: !showListedOnly }
	});
	const firstAvailableTokenId = primarySaleItems?.pages[0]?.primarySaleItems[0]?.primarySaleItem.tokenId?.toString();
	const hasMintedTokens = Boolean(firstAvailableTokenId) && Number(firstAvailableTokenId) > 0;
	const { data: mintedTokensMetadata, isLoading: mintedTokensMetadataLoading } = useListCollectibles({
		chainId,
		collectionAddress: contractAddress,
		side: OrderSide.listing,
		filter: { includeEmpty: true },
		query: { enabled: enabled && hasMintedTokens }
	});
	const { data: saleDetails, isLoading: saleDetailsLoading, error: saleDetailsError } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC721_SALE_ABI,
		functionName: "saleDetails",
		query: { enabled }
	});
	const isLoading = saleDetailsLoading || primarySaleItemsLoading || mintedTokensMetadataLoading;
	const mintedTokensMetadataMap = /* @__PURE__ */ new Map();
	for (const page of mintedTokensMetadata?.pages ?? []) for (const collectible of page.collectibles) mintedTokensMetadataMap.set(collectible.metadata.tokenId, collectible.metadata);
	const collectibleCards = tokenIds.map((tokenId) => {
		const minted = hasMintedTokens && Number(tokenId) < Number(firstAvailableTokenId);
		const matchingPrimarySaleItem = primarySaleItems?.pages.find((item) => item.primarySaleItems.find((primarySaleItem) => primarySaleItem.primarySaleItem.tokenId?.toString() === tokenId))?.primarySaleItems.find((primarySaleItem) => primarySaleItem.primarySaleItem.tokenId?.toString() === tokenId);
		const saleData = matchingPrimarySaleItem?.primarySaleItem;
		let tokenMetadata = matchingPrimarySaleItem?.metadata;
		if (minted && mintedTokensMetadataMap.has(tokenId)) tokenMetadata = mintedTokensMetadataMap.get(tokenId);
		tokenMetadata = tokenMetadata || {};
		const salePrice = saleData ? {
			amount: saleData.priceAmount?.toString() || "",
			currencyAddress: saleData.currencyAddress
		} : {
			amount: saleDetails?.cost?.toString() || "",
			currencyAddress: saleDetails?.paymentToken ?? "0x"
		};
		const quantityInitial = saleData?.supply?.toString() ?? (saleDetails?.supplyCap ? saleDetails.supplyCap.toString() : void 0);
		const quantityRemaining = minted ? void 0 : "1";
		const saleStartsAt = saleData?.startDate?.toString() ?? saleDetails?.startTime?.toString();
		const saleEndsAt = saleData?.endDate?.toString() ?? saleDetails?.endTime?.toString();
		return {
			collectibleId: tokenId,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType.ERC721,
			tokenMetadata,
			cardLoading: isLoading,
			salesContractAddress,
			salePrice,
			quantityInitial,
			quantityRemaining,
			quantityDecimals: 0,
			saleStartsAt,
			saleEndsAt,
			marketplaceType: "shop"
		};
	});
	return {
		salePrice: collectibleCards[0]?.salePrice,
		collectibleCards,
		saleDetailsError,
		primarySaleItemsError,
		saleDetails,
		primarySaleItems,
		isLoading
	};
}

//#endregion
//#region src/react/hooks/useList1155ShopCardData.tsx
function useList1155ShopCardData({ tokenIds, chainId, contractAddress, salesContractAddress, enabled = true }) {
	const { showListedOnly } = useFilterState();
	const { data: primarySaleItems, isLoading: primarySaleItemsLoading, error: primarySaleItemsError } = useListPrimarySaleItems({
		chainId,
		primarySaleContractAddress: salesContractAddress,
		filter: { includeEmpty: !showListedOnly }
	});
	const { data: collection, isLoading: collectionLoading } = useCollection({
		chainId,
		collectionAddress: contractAddress
	});
	const { data: paymentToken, isLoading: paymentTokenLoading } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: "paymentToken",
		query: { enabled }
	});
	const isLoading = primarySaleItemsLoading || collectionLoading || paymentTokenLoading;
	const allPrimarySaleItems = primarySaleItems?.pages.flatMap((page) => page.primarySaleItems) ?? [];
	const collectibleCards = tokenIds.map((tokenId) => {
		const matchingPrimarySaleItem = allPrimarySaleItems.find((item) => item.primarySaleItem.tokenId?.toString() === tokenId);
		const saleData = matchingPrimarySaleItem?.primarySaleItem;
		const tokenMetadata = matchingPrimarySaleItem?.metadata || {};
		const salePrice = {
			amount: saleData?.priceAmount?.toString() || "",
			currencyAddress: saleData?.currencyAddress || paymentToken || "0x"
		};
		const supply = saleData?.supply?.toString();
		const unlimitedSupply = saleData?.unlimitedSupply;
		return {
			collectibleId: tokenId,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType.ERC1155,
			tokenMetadata,
			cardLoading: isLoading,
			salesContractAddress,
			salePrice,
			quantityInitial: supply,
			quantityDecimals: collection?.decimals || 0,
			quantityRemaining: supply,
			unlimitedSupply,
			saleStartsAt: saleData?.startDate?.toString(),
			saleEndsAt: saleData?.endDate?.toString(),
			marketplaceType: "shop"
		};
	});
	return {
		collectibleCards,
		tokenMetadataError: primarySaleItemsError,
		tokenSaleDetailsError: null,
		isLoading
	};
}

//#endregion
//#region src/react/hooks/useListBalances.tsx
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
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const isLaos721 = marketplaceConfig?.market?.collections?.find((c) => c.itemsAddress === args.contractAddress && c.chainId === args.chainId)?.contractType === ContractType.LAOS_ERC_721;
	return useInfiniteQuery(listBalancesOptions({
		...args,
		isLaos721
	}, config));
}

//#endregion
//#region src/react/queries/listCollectibleActivities.ts
/**
* Fetches collectible activities from the Marketplace API
*/
async function fetchListCollectibleActivities(params) {
	const { collectionAddress, chainId, config, page, pageSize, sort,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const pageParams = page || pageSize || sort ? {
		page: page ?? 1,
		pageSize: pageSize ?? 10,
		sort
	} : void 0;
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		page: pageParams,
		...additionalApiParams
	};
	return await marketplaceClient.listCollectibleActivities(apiArgs);
}
function listCollectibleActivitiesQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.tokenId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.collectibleActivities, params],
		queryFn: () => fetchListCollectibleActivities({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config,
			tokenId: params.tokenId,
			page: params.page,
			pageSize: params.pageSize,
			sort: params.sort
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/hooks/useListCollectibleActivities.tsx
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = listCollectibleActivitiesQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/queries/listCollectiblesPaginated.ts
/**
* Fetches a list of collectibles with pagination support from the Marketplace API
*/
async function fetchListCollectiblesPaginated(params) {
	const { collectionAddress, chainId, config, page = 1, pageSize = 30,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const pageParams = {
		page,
		pageSize
	};
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		page: pageParams,
		...additionalApiParams
	};
	return await marketplaceClient.listCollectibles(apiArgs);
}
function listCollectiblesPaginatedQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.side && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [
			...collectableKeys.lists,
			"paginated",
			params
		],
		queryFn: () => fetchListCollectiblesPaginated({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config,
			side: params.side,
			filter: params.filter,
			page: params.page,
			pageSize: params.pageSize
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/hooks/useListCollectiblesPaginated.tsx
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = listCollectiblesPaginatedQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/queries/listCollectionActivities.ts
/**
* Fetches collection activities from the Marketplace API
*/
async function fetchListCollectionActivities(params) {
	const { collectionAddress, chainId, config, page, pageSize, sort,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const pageParams = page || pageSize || sort ? {
		page: page ?? 1,
		pageSize: pageSize ?? 10,
		sort
	} : void 0;
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		page: pageParams,
		...additionalApiParams
	};
	return await marketplaceClient.listCollectionActivities(apiArgs);
}
function listCollectionActivitiesQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectionKeys.collectionActivities, params],
		queryFn: () => fetchListCollectionActivities({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config,
			page: params.page,
			pageSize: params.pageSize,
			sort: params.sort
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/hooks/useListCollectionActivities.tsx
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = listCollectionActivitiesQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/useListCollections.tsx
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
	const { config = defaultConfig, marketplaceConfig: paramMarketplaceConfig,...rest } = params;
	const queryOptions$1 = listCollectionsQueryOptions({
		config,
		marketplaceConfig: paramMarketplaceConfig || marketplaceConfig,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/queries/listListingsForCollectible.ts
/**
* Fetches listings for a specific collectible from the Marketplace API
*/
async function fetchListListingsForCollectible(params) {
	const { collectionAddress, chainId, collectibleId, config,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		tokenId: collectibleId,
		...additionalApiParams
	};
	return await marketplaceClient.listCollectibleListings(apiArgs);
}
function listListingsForCollectibleQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.collectibleId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.listings, params],
		queryFn: () => fetchListListingsForCollectible({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			collectibleId: params.collectibleId,
			config: params.config,
			filter: params.filter,
			page: params.page
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/hooks/useListListingsForCollectible.tsx
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = listListingsForCollectibleQueryOptions({
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
//#region src/react/hooks/useListMarketCardData.tsx
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
//#region src/react/hooks/useListOffersForCollectible.tsx
const fetchListOffersForCollectible = async (config, args) => {
	const arg = {
		chainId: String(args.chainId),
		contractAddress: args.collectionAddress,
		tokenId: args.collectibleId,
		filter: args.filter,
		page: args.page
	};
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.listCollectibleOffers(arg);
};
const listOffersForCollectibleOptions = (args, config) => {
	return queryOptions({
		queryKey: [
			...collectableKeys.offers,
			args,
			config
		],
		queryFn: () => fetchListOffersForCollectible(config, args)
	});
};
const useListOffersForCollectible = (args) => {
	const config = useConfig();
	return useQuery(listOffersForCollectibleOptions(args, config));
};

//#endregion
//#region src/react/hooks/useListShopCardData.tsx
function useListShopCardData({ tokenIds, chainId, contractAddress, salesContractAddress, contractType, enabled = true }) {
	const shouldUse721 = contractType === ContractType.ERC721;
	const shouldUse1155 = contractType === ContractType.ERC1155;
	const erc721Data = useList721ShopCardData({
		tokenIds,
		chainId,
		contractAddress,
		salesContractAddress,
		enabled: enabled && shouldUse721
	});
	const erc1155Data = useList1155ShopCardData({
		tokenIds,
		chainId,
		contractAddress,
		salesContractAddress,
		enabled: enabled && shouldUse1155
	});
	if (shouldUse721) return erc721Data;
	if (shouldUse1155) return {
		collectibleCards: erc1155Data.collectibleCards,
		isLoading: erc1155Data.isLoading,
		saleDetailsError: erc1155Data.tokenSaleDetailsError,
		primarySaleItemsError: erc1155Data.tokenMetadataError,
		saleDetails: void 0,
		primarySaleItems: void 0,
		salePrice: erc1155Data.collectibleCards[0]?.salePrice
	};
	return {
		collectibleCards: [],
		isLoading: !contractType,
		collectionDetailsError: null,
		saleDetailsError: null,
		primarySaleItemsError: null,
		saleDetails: void 0,
		primarySaleItems: void 0,
		salePrice: void 0
	};
}

//#endregion
//#region src/react/hooks/useListTokenMetadata.tsx
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = listTokenMetadataQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/useLowestListing.tsx
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = lowestListingQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
//#region src/react/hooks/useMarketCurrencies.tsx
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
//#region src/react/hooks/useOpenConnectModal.tsx
const useOpenConnectModal$1 = () => {
	const context = useConfig();
	return { openConnectModal: context.openConnectModal };
};

//#endregion
//#region src/react/hooks/useRoyalty.tsx
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
	const scopeKey = `${collectableKeys.royaltyPercentage.join(".")}-${chainId}-${collectionAddress}-${collectibleId}`;
	const contractResult = useReadContract({
		scopeKey,
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
//#region src/react/hooks/useShopCollectibleSaleData.tsx
function useShopCollectibleSaleData({ chainId, salesContractAddress, itemsContractAddress, tokenId, collectionType, enabled = true }) {
	const { data: erc721SaleDetails, isLoading: erc721SaleLoading, error: erc721SaleError } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC721_SALE_ABI,
		functionName: "saleDetails",
		query: { enabled: enabled && collectionType === ContractType.ERC721 }
	});
	const { data: erc721TotalSupply, isLoading: erc721SupplyLoading, error: erc721SupplyError } = useReadContract({
		chainId,
		address: itemsContractAddress,
		abi: ERC721_ABI,
		functionName: "totalSupply",
		query: { enabled: enabled && collectionType === ContractType.ERC721 }
	});
	const { data: erc1155TokenSaleDetails, isLoading: erc1155TokenSaleLoading, error: erc1155TokenSaleError } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: "tokenSaleDetails",
		args: collectionType === ContractType.ERC1155 ? [BigInt(tokenId)] : void 0,
		query: { enabled: enabled && collectionType === ContractType.ERC1155 }
	});
	const { data: erc1155GlobalSaleDetails, isLoading: erc1155GlobalSaleLoading, error: erc1155GlobalSaleError } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: "globalSaleDetails",
		query: { enabled: enabled && collectionType === ContractType.ERC1155 }
	});
	const { data: erc1155PaymentToken, isLoading: erc1155PaymentTokenLoading, error: erc1155PaymentTokenError } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: "paymentToken",
		query: { enabled: enabled && collectionType === ContractType.ERC1155 }
	});
	const { data: erc1155TotalSupply, isLoading: erc1155SupplyLoading, error: erc1155SupplyError } = useReadContract({
		chainId,
		address: itemsContractAddress,
		abi: SEQUENCE_1155_ITEMS_ABI,
		functionName: "totalSupply",
		query: { enabled: enabled && collectionType === ContractType.ERC1155 }
	});
	return useMemo(() => {
		const isLoading = collectionType === ContractType.ERC721 ? erc721SaleLoading || erc721SupplyLoading : erc1155TokenSaleLoading || erc1155GlobalSaleLoading || erc1155PaymentTokenLoading || erc1155SupplyLoading;
		const error = collectionType === ContractType.ERC721 ? erc721SaleError || erc721SupplyError : erc1155TokenSaleError || erc1155GlobalSaleError || erc1155PaymentTokenError || erc1155SupplyError;
		if (isLoading) return {
			salePrice: null,
			paymentToken: null,
			supplyCap: "0",
			totalMinted: "0",
			quantityRemaining: "0",
			startTime: null,
			endTime: null,
			isActive: false,
			isLoading: true,
			error: null,
			isAvailable: false
		};
		if (error) return {
			salePrice: null,
			paymentToken: null,
			supplyCap: "0",
			totalMinted: "0",
			quantityRemaining: "0",
			startTime: null,
			endTime: null,
			isActive: false,
			isLoading: false,
			error,
			isAvailable: false
		};
		if (collectionType === ContractType.ERC721 && erc721SaleDetails && erc721TotalSupply !== void 0) {
			const saleDetails = erc721SaleDetails;
			const supplyCap = saleDetails.supplyCap.toString();
			const totalMinted = erc721TotalSupply.toString();
			const quantityRemaining = (saleDetails.supplyCap - erc721TotalSupply).toString();
			const now = Math.floor(Date.now() / 1e3);
			const startTime = Number(saleDetails.startTime);
			const endTime = Number(saleDetails.endTime);
			const isActive = now >= startTime && now <= endTime;
			return {
				salePrice: {
					amount: saleDetails.cost.toString(),
					currencyAddress: saleDetails.paymentToken
				},
				paymentToken: saleDetails.paymentToken,
				supplyCap,
				totalMinted,
				quantityRemaining,
				startTime,
				endTime,
				isActive,
				isLoading: false,
				error: null,
				isAvailable: BigInt(quantityRemaining) > 0 && isActive
			};
		}
		if (collectionType === ContractType.ERC1155 && erc1155PaymentToken && erc1155TotalSupply !== void 0 && (erc1155TokenSaleDetails || erc1155GlobalSaleDetails)) {
			const tokenSaleDetails = erc1155TokenSaleDetails;
			const globalSaleDetails = erc1155GlobalSaleDetails;
			const useGlobal = tokenSaleDetails && tokenSaleDetails.supplyCap === 0n;
			const finalSaleDetails = useGlobal ? globalSaleDetails : tokenSaleDetails || globalSaleDetails;
			if (!finalSaleDetails) return {
				salePrice: null,
				paymentToken: null,
				supplyCap: "0",
				totalMinted: "0",
				quantityRemaining: "0",
				startTime: null,
				endTime: null,
				isActive: false,
				isLoading: false,
				error: null,
				isAvailable: false
			};
			const supplyCap = finalSaleDetails.supplyCap.toString();
			const totalMintedBigInt = erc1155TotalSupply ? BigInt(erc1155TotalSupply) : 0n;
			const totalMinted = totalMintedBigInt.toString();
			const quantityRemaining = (finalSaleDetails.supplyCap - totalMintedBigInt).toString();
			const now = Math.floor(Date.now() / 1e3);
			const startTime = Number(finalSaleDetails.startTime);
			const endTime = Number(finalSaleDetails.endTime);
			const isActive = now >= startTime && now <= endTime;
			return {
				salePrice: {
					amount: finalSaleDetails.cost.toString(),
					currencyAddress: erc1155PaymentToken
				},
				paymentToken: erc1155PaymentToken,
				supplyCap,
				totalMinted,
				quantityRemaining,
				startTime,
				endTime,
				isActive,
				isLoading: false,
				error: null,
				isAvailable: BigInt(quantityRemaining) > 0 && isActive
			};
		}
		return {
			salePrice: null,
			paymentToken: null,
			supplyCap: "0",
			totalMinted: "0",
			quantityRemaining: "0",
			startTime: null,
			endTime: null,
			isActive: false,
			isLoading: false,
			error: null,
			isAvailable: false
		};
	}, [
		collectionType,
		erc721SaleDetails,
		erc721TotalSupply,
		erc721SaleLoading,
		erc721SupplyLoading,
		erc721SaleError,
		erc721SupplyError,
		erc1155TokenSaleDetails,
		erc1155GlobalSaleDetails,
		erc1155PaymentToken,
		erc1155TotalSupply,
		erc1155TokenSaleLoading,
		erc1155GlobalSaleLoading,
		erc1155PaymentTokenLoading,
		erc1155SupplyLoading,
		erc1155TokenSaleError,
		erc1155GlobalSaleError,
		erc1155PaymentTokenError,
		erc1155SupplyError
	]);
}

//#endregion
//#region src/react/hooks/useTransferTokens.tsx
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
		const config = prepareTransferConfig(params, accountAddress);
		return await writeContractAsync(config);
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
export { AlertMessage, MODAL_CONTENT_PROPS, MODAL_OVERLAY_PROPS, MarketplaceProvider, MarketplaceQueryClientProvider, MarketplaceSdkContext, checkoutOptionsSalesContractQueryOptions, collectionBalanceDetailsQueryOptions, collectionDetailsPollingOptions, collectionQueryOptions, comparePricesQueryOptions, convertPriceToUSDQueryOptions, countListingsForCollectibleQueryOptions, countOfCollectablesQueryOptions, countOffersForCollectibleQueryOptions, dateToUnixTime, filtersQueryOptions, generateCancelTransaction, generateListingTransaction, generateOfferTransaction, generateSellTransaction, getTokenRangesQueryOptions, listCollectibleActivitiesQueryOptions, listCollectiblesPaginatedQueryOptions, listCollectionActivitiesQueryOptions, listListingsForCollectibleQueryOptions, listOffersForCollectibleOptions, sellModal$, switchChainModal_default, useAutoSelectFeeOption, useBalanceOfCollectible, useCancelOrder, useCheckoutOptionsSalesContract, useCollectible, useCollection, useCollectionBalanceDetails, useCollectionDetails, useCollectionDetailsPolling, useComparePrices, useConfig, useConvertPriceToUSD, useCountListingsForCollectible, useCountOfCollectables, useCountOfPrimarySaleItems, useCountOffersForCollectible, useCurrency, useERC721SaleMintedTokens, useFilterState, useFilters, useFiltersProgressive, useFloorOrder, useGenerateCancelTransaction, useGenerateListingTransaction, useGenerateOfferTransaction, useGenerateSellTransaction, useGetCountOfPrimarySaleItems, useGetTokenRanges, useHighestOffer, useInventory, useList1155ShopCardData, useList721ShopCardData, useListBalances, useListCollectibleActivities, useListCollectibles, useListCollectiblesPaginated, useListCollectionActivities, useListCollections, useListListingsForCollectible, useListMarketCardData, useListOffersForCollectible, useListPrimarySaleItems, useListShopCardData, useListTokenMetadata, useLowestListing, useMarketCurrencies, useMarketplaceConfig, useOpenConnectModal$1 as useOpenConnectModal, useRoyalty, useSellModal, useShopCollectibleSaleData, useSwitchChainModal, useTokenSupplies, useTransferTokens, useWallet };
//# sourceMappingURL=hooks-BrYPaFP7.js.map