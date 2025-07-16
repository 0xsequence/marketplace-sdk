import { ChainSwitchUserRejectedError } from "./transaction-CnctdNzS.js";
import { collectableKeys } from "./api-BiMGqWdz.js";
import { getPresentableChainName } from "./network-CGD0oKtS.js";
import { EIP2981_ABI } from "./marketplace-DmFiyBoS.js";
import { useConfig } from "./useConfig-UcRv5hCZ.js";
import { useConnectorMetadata } from "./useConnectorMetadata-C7idAjEN.js";
import { useCollectionBalanceDetails } from "./useCollectionBalanceDetails-BEI04WRk.js";
import { checkoutOptionsQueryOptions, checkoutOptionsSalesContractQueryOptions, comparePricesQueryOptions, convertPriceToUSDQueryOptions } from "./comparePrices-DF7qDrsf.js";
import { InfoIcon_default } from "./InfoIcon-CEpLpQZa.js";
import { useChain } from "@0xsequence/connect";
import { useAccount, usePublicClient, useReadContract, useSwitchChain } from "wagmi";
import { useCallback, useEffect } from "react";
import { skipToken, useQuery } from "@tanstack/react-query";
import { Button, Modal, Spinner, Text, WarningIcon } from "@0xsequence/design-system";
import { jsx, jsxs } from "react/jsx-runtime";
import { zeroAddress } from "viem";
import { createStore } from "@xstate/store";
import { useSelector } from "@xstate/store/react";

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
//#region src/react/hooks/utils/useCheckoutOptions.tsx
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
* const { data: checkoutOptions, isLoading } = useCheckoutOptions({
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
* const { data: checkoutOptions } = useCheckoutOptions({
*   chainId: 1,
*   orders: orders,
*   query: {
*     enabled: orders.length > 0,
*     staleTime: 30000
*   }
* })
* ```
*/
function useCheckoutOptions(params) {
	const { address } = useAccount();
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = checkoutOptionsQueryOptions({
		config,
		walletAddress: address,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = comparePricesQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
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
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = convertPriceToUSDQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
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
	const waitForReceipt = useCallback(async (transactionHash) => {
		if (!publicClient) throw new Error("Public client not found");
		const receipt = await publicClient.waitForTransactionReceipt({ hash: transactionHash });
		return receipt;
	}, [publicClient]);
	return { waitForReceipt };
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
//#region src/react/hooks/utils/useSwitchChainWithModal.ts
const useSwitchChainWithModal = () => {
	const { show: showSwitchChainModal } = useSwitchChainModal();
	const { isWaaS } = useConnectorMetadata();
	const { switchChainAsync } = useSwitchChain();
	return { switchChainWithModal: async (currentChainId, targetChainId) => {
		const chainIdMismatch = currentChainId !== Number(targetChainId);
		return new Promise((resolve, reject) => {
			if (chainIdMismatch) if (isWaaS) switchChainAsync({ chainId: targetChainId }).then(resolve).catch(reject);
			else showSwitchChainModal({
				chainIdToSwitchTo: targetChainId,
				onSuccess: () => resolve({ chainId: targetChainId }),
				onError: (error) => reject(error),
				onClose: () => reject(new ChainSwitchUserRejectedError())
			});
			else resolve({ chainId: targetChainId });
		});
	} };
};

//#endregion
export { AlertMessage, MODAL_CONTENT_PROPS, MODAL_OVERLAY_PROPS, switchChainModal_default, useAutoSelectFeeOption, useCheckoutOptions, useCheckoutOptionsSalesContract, useComparePrices, useConvertPriceToUSD, useGetReceiptFromHash, useRoyalty, useSwitchChainModal, useSwitchChainWithModal };
//# sourceMappingURL=utils-Dex2OzNk.js.map