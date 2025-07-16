import { DEFAULT_MARKETPLACE_FEE_PERCENTAGE } from "./src-Dz2CfBL0.js";
import { InvalidContractTypeError } from "./transaction-CnctdNzS.js";
import { getQueryClient } from "./get-query-client-D19vvfJo.js";
import { balanceQueries, collectableKeys, getMarketplaceClient, getSequenceApiClient } from "./api-BiMGqWdz.js";
import { ContractType, ExecuteType, OrderbookKind, StepType, WalletKind } from "./marketplace.gen-HpnpL5xU.js";
import { getNetwork } from "./network-CGD0oKtS.js";
import { TransactionType } from "./_internal-C75gOSNo.js";
import { CollectibleCardAction } from "./types-Yw2ywj6j.js";
import { SequenceMarketplaceV1_ABI } from "./marketplace-DmFiyBoS.js";
import { ERC721_SALE_ABI } from "./primary-sale-CmWxSfFQ.js";
import { calculateEarningsAfterFees, cn, compareAddress, formatPriceWithFee, truncateMiddle } from "./utils-D4D4JVMo.js";
import { useConfig } from "./useConfig-Ct2Tt1XY.js";
import { useAnalytics } from "./provider-DPGUA10G.js";
import { useMarketplaceConfig } from "./useMarketplaceConfig-C4vhw0Da.js";
import { useBalanceOfCollectible, useCollectible } from "./collectibles-C__9E_1t.js";
import { useCollection } from "./useCollection-DuPjD9nw.js";
import { sellModal$, useCurrency, useMarketCurrencies, useSellModal } from "./market-Bdi_YSuo.js";
import { useLowestListing } from "./orders-Dczf8-Ml.js";
import { useListBalances } from "./tokens-SIRpA1IC.js";
import { AlertMessage, MODAL_OVERLAY_PROPS, switchChainModal_default, useCheckoutOptionsSalesContract, useComparePrices, useRoyalty, useSwitchChainModal } from "./utils-CXVC-6SQ.js";
import { dateToUnixTime, useGenerateListingTransaction, useGenerateOfferTransaction, useGenerateSellTransaction, useTransferTokens, useWallet } from "./hooks-BbOoucIY.js";
import { useOpenConnectModal } from "./ui-BxgIUdC0.js";
import { BellIcon_default, CalendarIcon_default, CartIcon_default } from "./CalendarIcon-C9HCkZUY.js";
import { formatPriceNumber, getSupplyStatusText } from "./utils-BaOHXVu3.js";
import { ActionModal } from "./actionModal-CDvnN2XJ.js";
import { useWaasFeeOptions } from "@0xsequence/connect";
import { NetworkType, networks } from "@0xsequence/network";
import { useAccount, useBalance, useReadContracts, useSwitchChain } from "wagmi";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { skipToken, useQuery } from "@tanstack/react-query";
import { TransactionStatus } from "@0xsequence/indexer";
import { AddIcon, Button, CheckmarkIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, Divider, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger, ExternalLinkIcon, IconButton, Image, Modal, NetworkImage, NumericInput, Select, Skeleton, Spinner, SubtractIcon, Text, TextInput, TokenImage, WarningIcon, cn as cn$1 } from "@0xsequence/design-system";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import * as dn from "dnum";
import { WaitForTransactionReceiptTimeoutError, decodeFunctionData, encodeFunctionData, erc20Abi, formatUnits, isAddress, maxUint256, parseEventLogs, parseUnits, toHex, zeroAddress } from "viem";
import { observable } from "@legendapp/state";
import { addDays, differenceInDays, format, formatDistanceToNow, isSameDay, startOfDay } from "date-fns";
import { createStore } from "@xstate/store";
import { useSelector } from "@xstate/store/react";
import { addDays as addDays$1 } from "date-fns/addDays";
import { Show, observer, use$ } from "@legendapp/state/react";
import { avalanche, optimism } from "viem/chains";
import { useERC1155SaleContractCheckout, useSelectPaymentModal } from "@0xsequence/checkout";
import { DayPicker } from "react-day-picker";

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
	return props.marketplaceType === "shop";
}
function isMarketProps(props) {
	return !props.marketplaceType || props.marketplaceType === "market";
}
const initialContext$3 = {
	isOpen: false,
	props: null,
	buyAnalyticsId: "",
	onError: () => {},
	onSuccess: () => {},
	quantity: null,
	modalState: "idle",
	paymentModalState: "idle",
	checkoutModalState: "idle"
};
const buyModalStore = createStore({
	context: { ...initialContext$3 },
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
const useIsOpen$1 = () => useSelector(buyModalStore, (state) => state.context.isOpen);
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
//#region src/react/ui/modals/MakeOfferModal/store.ts
const offerPrice = {
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
	orderbookKind: void 0,
	callbacks: void 0,
	offerPrice: { ...offerPrice },
	offerPriceChanged: false,
	quantity: "1",
	invalidQuantity: false,
	expiry: new Date(addDays$1(/* @__PURE__ */ new Date(), 7).toJSON()),
	collectionType: void 0,
	steps: { ...steps$1 },
	offerIsBeingProcessed: false
};
const actions$1 = {
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
			...initialState$1,
			...actions$1
		});
		makeOfferModal$.steps.set({ ...steps$1 });
		makeOfferModal$.offerPrice.set({ ...offerPrice });
		makeOfferModal$.offerIsBeingProcessed.set(false);
	}
};
const makeOfferModal$ = observable({
	...initialState$1,
	...actions$1
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
				if (Date.now() - timestamp < 5 * 60 * 1e3 && typeof callback === "function") callback();
			}
		}
	};
};

//#endregion
//#region src/react/ui/components/_internals/action-button/components/ActionButtonBody.tsx
function ActionButtonBody({ tokenId, label, onClick, icon, action }) {
	const { wallet } = useWallet();
	const { openConnectModal } = useOpenConnectModal();
	const { setPendingAction } = useActionButtonStore();
	const handleClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (!wallet?.address && action) {
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
	const { action, tokenId, collectionAddress, chainId, quantityDecimals, quantityRemaining, unlimitedSupply, marketplaceType } = props;
	const { show: showBuyModal } = useBuyModal();
	const { show: showMakeOfferModal } = useMakeOfferModal();
	if (marketplaceType === "shop") {
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
				marketplaceType: "shop",
				salePrice: {
					amount: salePrice.amount,
					currencyAddress: salePrice.currencyAddress
				},
				quantityDecimals: quantityDecimals ?? 0,
				quantityRemaining: quantityRemaining ?? 0,
				unlimitedSupply
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
				marketplaceType: "market"
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
//#region src/react/ui/modals/CreateListingModal/store.ts
const listingPrice = {
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
	orderbookKind: OrderbookKind.sequence_marketplace_v2,
	collectionName: "",
	collectionType: void 0,
	listingPrice: { ...listingPrice },
	quantity: "1",
	invalidQuantity: false,
	expiry: new Date(addDays$1(/* @__PURE__ */ new Date(), 7).toJSON()),
	callbacks: void 0,
	steps: { ...steps },
	listingIsBeingProcessed: false
};
const actions = {
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
			...initialState,
			...actions
		});
		createListingModal$.listingPrice.set({ ...listingPrice });
		createListingModal$.steps.set({ ...steps });
		createListingModal$.listingIsBeingProcessed.set(false);
		createListingModal$.steps.approval.isExecuting.set(false);
		createListingModal$.steps.transaction.isExecuting.set(false);
	}
};
const createListingModal$ = observable({
	...initialState,
	...actions
});

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
		const value = option.token.contractAddress ?? "";
		return FeeOptionSelectItem({
			value,
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
			const selectedOption = options.find((option) => option.token.contractAddress === value);
			onSelectedFeeOptionChange(selectedOption);
		},
		defaultValue: options[0].token.contractAddress ?? void 0
	});
};
function FeeOptionSelectItem({ value, option }) {
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
				/* @__PURE__ */ jsx(Text, {
					className: "font-body text-sm",
					children: formatUnits(BigInt(option.value), option.token.decimals || 0)
				})
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
	const isVisible = useSelector(selectWaasFeeOptionsStore, (state) => state.context.isVisible);
	const selectedFeeOption = useSelector(selectWaasFeeOptionsStore, (state) => state.context.selectedFeeOption);
	const pendingFeeOptionConfirmation = useSelector(selectWaasFeeOptionsStore, (state) => state.context.pendingFeeOptionConfirmation);
	return {
		isVisible,
		selectedFeeOption,
		pendingFeeOptionConfirmation,
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
	const { address: userAddress } = useAccount();
	const { selectedFeeOption, setSelectedFeeOption, pendingFeeOptionConfirmation: storedPendingFeeOptionConfirmation, setPendingFeeOptionConfirmation } = useSelectWaasFeeOptionsStore();
	const [pendingFeeOptionConfirmationFromHook, confirmPendingFeeOption] = useWaasFeeOptions();
	const [feeOptionsConfirmed, setFeeOptionsConfirmed] = useState(false);
	useEffect(() => {
		setPendingFeeOptionConfirmation(pendingFeeOptionConfirmationFromHook);
	}, [pendingFeeOptionConfirmationFromHook, setPendingFeeOptionConfirmation]);
	const { data: currencyBalance, isLoading: currencyBalanceLoading } = useCurrencyBalance({
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
		className: cn("flex w-full flex-col gap-2 rounded-2xl bg-button-emphasis p-0 backdrop-blur-md", className),
		children: [
			/* @__PURE__ */ jsx(Divider, { className: "mt-0 mb-4" }),
			/* @__PURE__ */ jsx(Text, {
				className: "mb-2 font-body font-bold text-large text-text-100",
				children: feeOptionsConfirmed ? titleOnConfirm : "Select a fee option"
			}),
			!feeOptionsConfirmed && !pendingFeeOptionConfirmation && /* @__PURE__ */ jsx(Skeleton, { className: "h-[52px] w-full animate-shimmer rounded-xl" }),
			(feeOptionsConfirmed || pendingFeeOptionConfirmation) && /* @__PURE__ */ jsx("div", {
				className: cn("[&>label>button>span]:overflow-hidden [&>label>button]:w-full [&>label>button]:text-xs [&>label]:flex [&>label]:w-full", feeOptionsConfirmed && "pointer-events-none opacity-70"),
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
//#region src/react/ui/modals/_internal/hooks/useSelectWaasFeeOptions.ts
const useSelectWaasFeeOptions = ({ isProcessing, feeOptionsVisible, selectedFeeOption }) => {
	const { wallet } = useWallet();
	const isWaaS = wallet?.isWaaS;
	const isProcessingWithWaaS = isProcessing && isWaaS;
	const shouldHideActionButton = isProcessingWithWaaS && feeOptionsVisible === true && !!selectedFeeOption;
	const waasFeeOptionsShown = wallet?.isWaaS && isProcessing && feeOptionsVisible;
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
const initialContext$2 = {
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
	context: initialContext$2,
	on: {
		open: (_context, event) => ({
			...initialContext$2,
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
		close: () => initialContext$2
	}
});
const useIsOpen$2 = () => useSelector(transferModalStore, (state) => state.context.isOpen);
const useModalState$1 = () => useSelector(transferModalStore, (state) => state.context);
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
//#region src/react/ui/modals/_internal/components/quantityInput/index.tsx
function QuantityInput({ quantity, invalidQuantity, onQuantityChange, onInvalidQuantityChange, decimals, maxQuantity, className, disabled }) {
	const dnMaxQuantity = dn.from(maxQuantity, decimals);
	const dnOne = dn.from("1", decimals);
	const min = decimals > 0 ? Number(`0.${"1".padStart(decimals, "0")}`) : 0;
	const dnMin = dn.from(min, decimals);
	const [dnQuantity, setDnQuantity] = useState(dn.from(quantity, decimals));
	const [localQuantity, setLocalQuantity] = useState(quantity);
	useEffect(() => {
		setLocalQuantity(quantity);
		setDnQuantity(dn.from(quantity, decimals));
	}, [quantity, decimals]);
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
		const isLessThanMin = dn.lessThan(dnValue, dnMin);
		if (isLessThanMin) {
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
		const newValue = dn.add(dnQuantity, dnOne);
		if (dn.greaterThanOrEqual(newValue, dnMaxQuantity)) setQuantity({
			value: maxQuantity,
			isValid: true
		});
		else setQuantity({
			value: dn.toString(newValue, decimals),
			isValid: true
		});
	}
	function handleDecrement() {
		const newValue = dn.subtract(dnQuantity, dnOne);
		if (dn.lessThanOrEqual(newValue, dnMin)) setQuantity({
			value: String(min),
			isValid: true
		});
		else setQuantity({
			value: dn.toString(newValue, decimals),
			isValid: true
		});
	}
	return /* @__PURE__ */ jsxs("div", {
		className: cn("flex w-full flex-col [&>label>div>div>div:has(:disabled):hover]:opacity-100 [&>label>div>div>div:has(:disabled)]:opacity-100 [&>label>div>div>div>input]:text-xs [&>label>div>div>div]:h-9 [&>label>div>div>div]:rounded [&>label>div>div>div]:pr-0 [&>label>div>div>div]:pl-3 [&>label>div>div>div]:text-xs [&>label]:gap-[2px]", className, disabled && "pointer-events-none opacity-50"),
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
//#region src/react/ui/modals/TransferModal/_views/enterWalletAddress/_components/TokenQuantityInput.tsx
const TokenQuantityInput = ({ balanceAmount, collection, isProcessingWithWaaS }) => {
	const modalState = useModalState$1();
	const [invalidQuantity, setInvalidQuantity] = useState(false);
	let insufficientBalance = true;
	if (balanceAmount !== void 0 && modalState.quantity) try {
		const quantityBigInt = BigInt(modalState.quantity);
		insufficientBalance = quantityBigInt > balanceAmount;
	} catch (_e) {
		insufficientBalance = true;
	}
	return /* @__PURE__ */ jsxs("div", {
		className: cn$1("flex flex-col gap-3", isProcessingWithWaaS && "pointer-events-none opacity-50"),
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
	const { wallet } = useWallet();
	const isWaaS = wallet?.isWaaS;
	const { transferIsProcessing } = useModalState$1();
	const label = transferIsProcessing ? isWaaS ? /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-center gap-2",
		children: [/* @__PURE__ */ jsx(Spinner, {
			size: "sm",
			className: "text-white"
		}), /* @__PURE__ */ jsx("span", { children: "Loading fee options" })]
	}) : /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-center gap-2",
		children: [/* @__PURE__ */ jsx(Spinner, {
			size: "sm",
			className: "text-white"
		}), /* @__PURE__ */ jsx("span", { children: "Transferring" })]
	}) : "Transfer";
	return /* @__PURE__ */ jsx(Button, {
		className: "flex justify-self-end px-10",
		onClick,
		disabled: !!isDisabled,
		title: "Transfer",
		label,
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
	const { receiverAddress, transferIsProcessing } = useModalState$1();
	const isWalletAddressValid = isAddress(receiverAddress);
	const isSelfTransfer = isWalletAddressValid && connectedAddress && receiverAddress.toLowerCase() === connectedAddress.toLowerCase();
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
const initialContext$1 = {
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
	context: initialContext$1,
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
		close: () => ({ ...initialContext$1 }),
		updateStatus: (context, event) => ({
			...context,
			status: event.status
		})
	}
});
const useIsOpen$3 = () => useSelector(transactionStatusModalStore, (state) => state.context.isOpen);
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
	const { wallet } = useWallet();
	const [status, setStatus] = useState(hash ? "PENDING" : "SUCCESS");
	const { data: confirmationResult } = useQuery({
		queryKey: [
			"transaction-confirmation",
			hash,
			chainId,
			!!wallet
		],
		queryFn: !!wallet && hash ? async () => await wallet.handleConfirmTransactionStep(hash, Number(chainId)) : skipToken
	});
	useEffect(() => {
		if (!hash) {
			setStatus("SUCCESS");
			return;
		}
		if (!confirmationResult) {
			setStatus("PENDING");
			return;
		}
		try {
			if (confirmationResult.txnStatus === TransactionStatus.SUCCESSFUL) {
				setStatus("SUCCESS");
				callbacks?.onSuccess?.({ hash: hash || "0x0" });
				return;
			}
			setStatus("FAILED");
			callbacks?.onError?.(/* @__PURE__ */ new Error("Transaction failed"));
		} catch (error) {
			setStatus(error instanceof WaitForTransactionReceiptTimeoutError ? "TIMEOUT" : "FAILED");
			callbacks?.onError?.(error);
		}
	}, [confirmationResult, hash]);
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
		queryClient.invalidateQueries();
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
	const isOpen = useIsOpen$3();
	return isOpen ? /* @__PURE__ */ jsx(TransactionStatusModalContent, {}) : null;
};
function TransactionStatusModalContent() {
	const { transactionType: type, hash, orderId, price, collectionAddress, chainId, collectibleId, callbacks, queriesToInvalidate } = useTransactionModalState();
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
//#region src/react/ui/modals/TransferModal/_views/enterWalletAddress/useHandleTransfer.tsx
const useHandleTransfer = () => {
	const { receiverAddress, collectionAddress, collectibleId, quantity, chainId } = useModalState$1();
	const { transferTokensAsync } = useTransferTokens();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const { wallet } = useWallet();
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
		if (wallet?.isWaaS && pendingFeeOptionConfirmation) return;
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
	const { collectionAddress, collectibleId, chainId, quantity, receiverAddress, transferIsProcessing } = useModalState$1();
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
	const balanceAmount = tokenBalance?.pages[0].balances[0].balance;
	let insufficientBalance = true;
	if (balanceAmount !== void 0 && quantity) try {
		const quantityBigInt = BigInt(quantity);
		insufficientBalance = quantityBigInt > BigInt(balanceAmount);
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
	const isErc1155 = collection?.type === ContractType.ERC1155;
	const showQuantityInput = isErc1155 && !!balanceAmount;
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
const useTransferModal = () => {
	const { chainId: accountChainId } = useAccount();
	const { show: showSwitchNetworkModal } = useSwitchChainModal();
	const { wallet } = useWallet();
	const { switchChain } = useSwitchChain();
	const openModal = (args) => {
		transferModalStore.send({
			type: "open",
			...args
		});
	};
	const handleShowModal = (args) => {
		const targetChainId = Number(args.chainId);
		const isSameChain = accountChainId === targetChainId;
		if (!isSameChain) {
			if (wallet?.isWaaS) {
				switchChain({ chainId: targetChainId });
				openModal(args);
			} else showSwitchNetworkModal({
				chainIdToSwitchTo: targetChainId,
				onSuccess: () => openModal(args)
			});
			return;
		}
		openModal(args);
	};
	return {
		show: handleShowModal,
		close: () => transferModalStore.send({ type: "close" })
	};
};
const TransactionModalView = () => {
	const view = useView();
	switch (view) {
		case "enterReceiverAddress": return /* @__PURE__ */ jsx(enterWalletAddress_default, {});
		case "followWalletInstructions": return /* @__PURE__ */ jsx(followWalletInstructions_default, {});
		default: return null;
	}
};
const TransferModal = () => {
	const isOpen = useIsOpen$2();
	const modalState = useModalState$1();
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
	const { wallet } = useWallet();
	const address = wallet?.address;
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
	const shouldShowAction = !address ? [CollectibleCardAction.BUY, CollectibleCardAction.OFFER].includes(action) : true;
	const isOwnerAction = address && owned && [
		CollectibleCardAction.LIST,
		CollectibleCardAction.TRANSFER,
		CollectibleCardAction.SELL
	].includes(action);
	return {
		address,
		shouldShowAction,
		isOwnerAction
	};
};

//#endregion
//#region src/react/ui/components/_internals/action-button/ActionButton.tsx
function ActionButton({ collectionAddress, chainId, tokenId, orderbookKind, action, owned, highestOffer, lowestListing, onCannotPerformAction, marketplaceType, salesContractAddress, prioritizeOwnerActions, salePrice, quantityDecimals, quantityRemaining, unlimitedSupply }) {
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
	const nonOwnerProps = marketplaceType === "shop" && salesContractAddress && salePrice ? {
		marketplaceType: "shop",
		salesContractAddress,
		salePrice,
		action,
		tokenId,
		collectionAddress,
		chainId,
		quantityDecimals,
		quantityRemaining,
		unlimitedSupply
	} : {
		marketplaceType: "market",
		orderbookKind,
		lowestListing,
		action,
		tokenId,
		collectionAddress,
		chainId,
		quantityDecimals,
		quantityRemaining
	};
	return /* @__PURE__ */ jsx(NonOwnerActions, { ...nonOwnerProps });
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/components/ActionButtonWrapper.tsx
function ActionButtonWrapper({ show, chainId, collectionAddress, tokenId, orderbookKind, action, highestOffer, lowestListing, owned, onCannotPerformAction, marketplaceType, salesContractAddress, prioritizeOwnerActions, salePrice, quantityDecimals, quantityRemaining, unlimitedSupply }) {
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
			marketplaceType,
			salesContractAddress,
			prioritizeOwnerActions,
			salePrice,
			quantityDecimals,
			quantityRemaining,
			unlimitedSupply
		})
	});
}

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
	const isImage$1 = /.*\.(png|jpg|jpeg|gif|svg|webp)$/.test(fileName?.toLowerCase() || "");
	return isImage$1;
};
const isHtml = (fileName) => {
	const isHtml$1 = /.*\.(html\?.+|html)$/.test(fileName?.toLowerCase() || "");
	return isHtml$1;
};
const isVideo = (fileName) => {
	const isVideo$1 = /.*\.(mp4|ogg|webm)$/.test(fileName?.toLowerCase() || "");
	return isVideo$1;
};
const is3dModel = (fileName) => {
	const is3dFile = /.*\.(gltf|glb|obj|fbx|stl|usdz)$/.test(fileName?.toLowerCase() || "");
	return is3dFile;
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
	const validAssets = assets.filter((asset) => !!asset);
	const assetUrl = validAssets[currentAssetIndex];
	const proxiedAssetUrl = assetUrl ? assetSrcPrefixUrl ? `${assetSrcPrefixUrl}${assetUrl}` : assetUrl : "";
	const containerClassNames = cn("relative aspect-square overflow-hidden bg-background-secondary", containerClassName || className);
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
				const type = await getContentType(proxiedAssetUrl);
				setContentType({
					type,
					loading: false,
					failed: false
				});
			} catch {
				try {
					const type = await fetchContentType(proxiedAssetUrl);
					setContentType({
						type,
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
			className: cn("flex h-full w-full items-center justify-center", containerClassNames),
			children: fallbackContent
		});
		return /* @__PURE__ */ jsx("div", {
			className: cn("h-full w-full", containerClassNames),
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
		className: cn("flex w-full items-center justify-center rounded-lg", containerClassNames),
		children: [(assetLoading || contentType.loading || isLoading) && /* @__PURE__ */ jsx(MediaSkeleton, {}), /* @__PURE__ */ jsx("iframe", {
			title: name || "Collectible",
			className: cn("aspect-square w-full", mediaClassname),
			src: proxiedAssetUrl,
			allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
			sandbox: "allow-scripts",
			style: { border: "0px" },
			onError: shouldListenForLoad ? handleAssetError : void 0,
			onLoad: shouldListenForLoad ? handleAssetLoad : void 0
		})]
	});
	if (contentType.type === "3d-model" && !assetLoadFailed) return /* @__PURE__ */ jsx("div", {
		className: cn("h-full w-full", containerClassNames),
		children: /* @__PURE__ */ jsx(ModelViewer_default, {
			src: proxiedAssetUrl,
			posterSrc: chess_tile_default,
			onLoad: shouldListenForLoad ? handleAssetLoad : void 0,
			onError: shouldListenForLoad ? handleAssetError : void 0
		})
	});
	if (contentType.type === "video" && !assetLoadFailed) {
		const videoClassNames = cn("absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-hover", assetLoading || isLoading ? "invisible" : "visible", isSafari && "pointer-events-none", mediaClassname);
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
	const imgClassNames = cn("absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-hover", assetLoading || contentType.loading || isLoading ? "invisible" : "visible", mediaClassname);
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
//#region src/react/ui/components/marketplace-collectible-card/CollectibleCardSkeleton.tsx
function MarketplaceCollectibleCardSkeleton() {
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
			children: [/* @__PURE__ */ jsx(Skeleton, {
				size: "lg",
				className: "animate-shimmer"
			}), /* @__PURE__ */ jsx(Skeleton, {
				size: "sm",
				className: "animate-shimmer"
			})]
		})]
	});
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/components/BaseCard.tsx
function BaseCard({ isLoading, name, image, video, animationUrl, onClick, onKeyDown, className, assetSrcPrefixUrl, children }) {
	if (isLoading) return /* @__PURE__ */ jsx(MarketplaceCollectibleCardSkeleton, {});
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
					className
				}), children]
			})
		})
	});
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Footer.tsx
const formatPrice = (amount, currency) => {
	const { formattedNumber, isUnderflow, isOverflow } = formatPriceNumber(amount, currency.decimals);
	const isFree = amount === "0";
	if (isFree) return /* @__PURE__ */ jsx(Text, { children: "Free" });
	if (isUnderflow) return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center",
		children: [/* @__PURE__ */ jsx(ChevronLeftIcon, { className: "h-3 w-3 text-text-100" }), /* @__PURE__ */ jsx(Text, { children: `${formattedNumber} ${currency.symbol}` })]
	});
	if (isOverflow) return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center",
		children: [/* @__PURE__ */ jsx(ChevronRightIcon, { className: "h-3 w-3 text-text-100" }), /* @__PURE__ */ jsx(Text, { children: `${formattedNumber} ${currency.symbol}` })]
	});
	return /* @__PURE__ */ jsx("div", {
		className: "flex items-center gap-1",
		children: /* @__PURE__ */ jsxs(Text, { children: [
			formattedNumber,
			" ",
			currency.symbol
		] })
	});
};
const Footer = ({ name, type, decimals, onOfferClick, highestOffer, lowestListingPriceAmount, lowestListingCurrency, balance, quantityInitial, quantityRemaining, unlimitedSupply, marketplaceType, salePriceAmount, salePriceCurrency }) => {
	const listed = !!lowestListingPriceAmount && !!lowestListingCurrency;
	const isShop = marketplaceType === "shop";
	const isMarketplace = marketplaceType === "market";
	const displayName = (() => {
		if (name.length > 15 && highestOffer && !isShop) return `${name.substring(0, 13)}...`;
		if (name.length > 17 && !highestOffer && !isShop) return `${name.substring(0, 17)}...`;
		return name;
	})();
	return /* @__PURE__ */ jsxs("div", {
		className: "relative flex flex-col items-start gap-2 whitespace-nowrap bg-background-primary p-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "relative flex w-full items-center justify-between",
				children: [/* @__PURE__ */ jsx(Text, {
					className: cn$1("overflow-hidden text-ellipsis text-left font-body font-bold text-sm text-text-100", isShop && (quantityInitial === void 0 || quantityRemaining === void 0) && "text-text-50"),
					children: displayName || "Untitled"
				}), highestOffer && onOfferClick && !isShop && /* @__PURE__ */ jsx(IconButton, {
					className: "absolute top-0 right-0 h-[22px] w-[22px] hover:animate-bell-ring",
					size: "xs",
					variant: "primary",
					onClick: (e) => {
						onOfferClick?.(e);
					},
					icon: (props) => /* @__PURE__ */ jsx(BellIcon_default, {
						...props,
						size: "xs"
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: cn$1("flex items-center gap-1", isShop && !salePriceAmount && "hidden", isShop && type === ContractType.ERC721 && "hidden"),
				children: [(isMarketplace && listed && lowestListingCurrency?.imageUrl || isShop && salePriceCurrency && salePriceCurrency.imageUrl) && /* @__PURE__ */ jsx(Image, {
					alt: lowestListingCurrency?.symbol || salePriceCurrency?.symbol,
					className: "h-3 w-3",
					src: lowestListingCurrency?.imageUrl || salePriceCurrency?.imageUrl,
					onError: (e) => {
						e.currentTarget.style.display = "none";
					}
				}), /* @__PURE__ */ jsxs(Text, {
					className: cn$1("text-left font-body font-bold text-sm", listed && isMarketplace ? "text-text-100" : "text-text-50", isShop && salePriceAmount && salePriceCurrency && type === ContractType.ERC1155 && "text-text-100"),
					children: [
						listed && isMarketplace && formatPrice(lowestListingPriceAmount, lowestListingCurrency),
						!listed && isMarketplace && "Not listed yet",
						isShop && salePriceAmount && salePriceCurrency && type === ContractType.ERC1155 && formatPrice(salePriceAmount, salePriceCurrency)
					]
				})]
			}),
			isShop && /* @__PURE__ */ jsx(SaleDetailsPill, {
				quantityRemaining,
				collectionType: type,
				unlimitedSupply
			}),
			isShop && !salePriceAmount && /* @__PURE__ */ jsx("div", { className: "h-5 w-full" }),
			isMarketplace && /* @__PURE__ */ jsx(TokenTypeBalancePill, {
				balance,
				type,
				decimals
			})
		]
	});
};
const TokenTypeBalancePill = ({ balance, type, decimals }) => {
	const displayText = type === ContractType.ERC1155 ? balance ? `Owned: ${formatUnits(BigInt(balance), decimals ?? 0)}` : "ERC-1155" : "ERC-721";
	return /* @__PURE__ */ jsx(Text, {
		className: "rounded-lg bg-background-secondary px-2 py-1 text-left font-medium text-text-80 text-xs",
		children: displayText
	});
};
const SaleDetailsPill = ({ quantityRemaining, collectionType, unlimitedSupply }) => {
	const supplyText = getSupplyStatusText({
		quantityRemaining,
		collectionType,
		unlimitedSupply
	});
	return /* @__PURE__ */ jsx(Text, {
		className: "rounded-lg bg-background-secondary px-2 py-1 text-left font-medium text-text-80 text-xs",
		children: supplyText
	});
};

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/variants/MarketCard.tsx
function MarketCard({ collectibleId, chainId, collectionAddress, collectionType, assetSrcPrefixUrl, cardLoading, orderbookKind, collectible, onCollectibleClick, onOfferClick, balance, balanceIsLoading = false, onCannotPerformAction, prioritizeOwnerActions }) {
	const collectibleMetadata = collectible?.metadata;
	const highestOffer = collectible?.offer;
	const { data: lowestListingCurrency, isLoading: lowestListingCurrencyLoading } = useCurrency({
		chainId,
		currencyAddress: collectible?.listing?.priceCurrencyAddress,
		query: { enabled: !!collectible?.listing?.priceCurrencyAddress }
	});
	const isLoading = cardLoading || lowestListingCurrencyLoading;
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
		marketplaceType: "market",
		isLoading,
		name: collectibleMetadata.name || "",
		image: collectibleMetadata.image,
		video: collectibleMetadata.video,
		animationUrl: collectibleMetadata.animation_url,
		onClick: () => onCollectibleClick?.(collectibleId),
		onKeyDown: handleKeyDown,
		children: [/* @__PURE__ */ jsx(Footer, {
			name: collectibleMetadata.name || "",
			type: collectionType,
			onOfferClick: (e) => onOfferClick?.({
				order: highestOffer,
				e
			}),
			highestOffer,
			lowestListingPriceAmount: collectible?.listing?.priceAmount,
			lowestListingCurrency,
			balance,
			decimals: collectibleMetadata.decimals,
			quantityInitial: highestOffer?.quantityInitial !== void 0 ? highestOffer.quantityInitial : collectible?.listing?.quantityInitial !== void 0 ? collectible.listing.quantityInitial : void 0,
			quantityRemaining: highestOffer?.quantityRemaining !== void 0 ? highestOffer.quantityRemaining : collectible?.listing?.quantityRemaining !== void 0 ? collectible.listing.quantityRemaining : void 0,
			marketplaceType: "market"
		}), /* @__PURE__ */ jsx(ActionButtonWrapper, {
			show: showActionButton,
			chainId,
			collectionAddress,
			tokenId: collectibleId,
			orderbookKind,
			action,
			highestOffer,
			lowestListing: collectible?.listing,
			owned: !!balance,
			onCannotPerformAction,
			marketplaceType: "market",
			prioritizeOwnerActions
		})]
	});
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/variants/ShopCard.tsx
function ShopCard({ collectibleId, chainId, collectionAddress, collectionType, assetSrcPrefixUrl, cardLoading, marketplaceType, salesContractAddress, tokenMetadata, salePrice, quantityDecimals, quantityInitial, quantityRemaining, unlimitedSupply }) {
	const { data: saleCurrency, isLoading: saleCurrencyLoading } = useCurrency({
		chainId,
		currencyAddress: salePrice?.currencyAddress,
		query: { enabled: !!salePrice?.currencyAddress && !!salesContractAddress && collectionType === ContractType.ERC1155 }
	});
	const isLoading = cardLoading || saleCurrencyLoading;
	if (!tokenMetadata || !salePrice) {
		console.error("Token metadata or sale price is undefined", {
			tokenMetadata,
			salePrice
		});
		return null;
	}
	const showActionButton = salesContractAddress && collectionType === ContractType.ERC1155 && (unlimitedSupply || quantityRemaining !== void 0 && Number(quantityRemaining) > 0);
	const action = CollectibleCardAction.BUY;
	const mediaClassName = !quantityRemaining ? "opacity-50" : "opacity-100";
	return /* @__PURE__ */ jsxs(BaseCard, {
		collectibleId,
		chainId,
		collectionAddress,
		collectionType,
		assetSrcPrefixUrl,
		cardLoading,
		marketplaceType,
		isLoading,
		name: tokenMetadata.name || "",
		image: tokenMetadata.image,
		video: tokenMetadata.video,
		animationUrl: tokenMetadata.animation_url,
		className: mediaClassName,
		children: [/* @__PURE__ */ jsx(Footer, {
			name: tokenMetadata.name || "",
			type: collectionType,
			decimals: tokenMetadata.decimals,
			quantityInitial,
			quantityRemaining,
			unlimitedSupply,
			marketplaceType,
			salePriceAmount: salePrice?.amount,
			salePriceCurrency: saleCurrency
		}), /* @__PURE__ */ jsx(ActionButtonWrapper, {
			show: showActionButton,
			chainId,
			collectionAddress,
			tokenId: collectibleId,
			action,
			owned: false,
			marketplaceType,
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
	switch (props.marketplaceType) {
		case "shop": return /* @__PURE__ */ jsx(ShopCard, { ...props });
		case "market":
		default: return /* @__PURE__ */ jsx(MarketCard, { ...props });
	}
}

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
//#region src/react/ui/modals/_internal/components/actionModal/LoadingModal.tsx
const LoadingModal = ({ isOpen, chainId, onClose, title }) => /* @__PURE__ */ jsx(ActionModal, {
	isOpen,
	chainId,
	onClose,
	title,
	ctas: [],
	disableAnimation: true,
	children: /* @__PURE__ */ jsx("div", {
		className: "flex items-center justify-center p-4",
		"data-testid": "loading-modal",
		children: /* @__PURE__ */ jsx(Spinner, { size: "lg" })
	})
});

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
	const avalancheOrOptimism = chainId === avalanche.id || chainId === optimism.id;
	const receiver = avalancheOrOptimism ? avalancheAndOptimismPlatformFeeRecipient : defaultPlatformFeeRecipient;
	const percentageToBPS = (percentage) => Number(percentage) * 1e4 / 100;
	const feePercentage = marketCollection?.feePercentage ?? defaultFee;
	return {
		amount: percentageToBPS(feePercentage).toString(),
		receiver
	};
};

//#endregion
//#region src/react/ui/modals/BuyModal/hooks/useCheckoutOptions.ts
const useCheckoutOptions = (input) => {
	const config = useConfig();
	const { wallet } = useWallet();
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
		queryFn: wallet && input !== skipToken ? async () => {
			try {
				const marketplaceClient = getMarketplaceClient(config);
				const response = await marketplaceClient.checkoutOptionsMarketplace({
					chainId: String(input.chainId),
					wallet: await wallet.address(),
					orders: [{
						contractAddress: input.collectionAddress,
						orderId: input.orderId,
						marketplace: input.marketplace
					}],
					additionalFee: Number(fees.amount)
				});
				const orderResponse = await marketplaceClient.getOrders({
					chainId: String(input.chainId),
					input: [{
						contractAddress: input.collectionAddress,
						orderId: input.orderId,
						marketplace: input.marketplace
					}]
				});
				const order = orderResponse.orders[0];
				return {
					...response.options,
					order
				};
			} catch (error) {
				const errorMessage = error instanceof Error ? `Checkout options error: ${error.message}` : "Failed to load checkout options";
				throw new Error(errorMessage);
			}
		} : skipToken,
		enabled: !!wallet && input !== skipToken
	});
};

//#endregion
//#region src/react/ui/modals/BuyModal/hooks/useLoadData.ts
const useLoadData = () => {
	const props = useBuyModalProps();
	const { chainId, collectionAddress } = props;
	const onError = useOnError();
	const isMarket = isMarketProps(props);
	const isShop = isShopProps(props);
	const collectibleId = isMarket ? props.collectibleId : void 0;
	const { wallet, isLoading: walletLoading, isError: walletError } = useWallet();
	const { data: collection, isLoading: collectionLoading, isError: collectionError } = useCollection({
		chainId,
		collectionAddress
	});
	const { data: collectable, isLoading: collectableLoading, isError: collectableError } = useCollectible({
		chainId,
		collectionAddress,
		collectibleId
	});
	const { data: currency, isLoading: currencyLoading, isError: currencyError } = useCurrency({
		chainId,
		currencyAddress: isShop ? props.salePrice?.currencyAddress : void 0,
		query: { enabled: isShop }
	});
	const { data: marketplaceCheckoutOptions, isLoading: marketplaceCheckoutOptionsLoading, isError: marketplaceCheckoutOptionsError } = useCheckoutOptions(isMarket ? {
		chainId,
		collectionAddress,
		orderId: props.orderId,
		marketplace: props.marketplace
	} : skipToken);
	const { data: salesContractCheckoutOptions, isLoading: salesContractCheckoutOptionsLoading, isError: salesContractCheckoutOptionsError } = useCheckoutOptionsSalesContract(isShop ? {
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
		wallet,
		shopData,
		isLoading: collectionLoading || collectableLoading || isMarket && marketplaceCheckoutOptionsLoading || isShop && (currencyLoading || salesContractCheckoutOptionsLoading) || walletLoading,
		isError: walletError || collectionError || collectableError || currencyError || marketplaceCheckoutOptionsError || salesContractCheckoutOptionsError
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
const getBuyCollectableParams = async ({ chainId, collectionAddress, collectibleId, callbacks, priceCurrencyAddress, customCreditCardProviderCallback, config, wallet, marketplace, orderId, quantity, collectable, checkoutOptions, fee, skipNativeBalanceCheck, nativeTokenAddress, buyAnalyticsId }) => {
	const marketplaceClient = getMarketplaceClient(config);
	let steps$2 = [];
	try {
		({steps: steps$2} = await marketplaceClient.generateBuyTransaction({
			chainId: String(chainId),
			collectionAddress,
			buyer: await wallet.address(),
			marketplace,
			ordersData: [{
				orderId,
				quantity: quantity.toString(),
				tokenId: collectibleId
			}],
			additionalFees: [fee],
			walletType: WalletKind.unknown
		}));
	} catch (error) {
		callbacks?.onError?.(error);
		throw error;
	}
	const buyStep = steps$2.find((step) => step.id === StepType.buy);
	const approveStep = steps$2.find((step) => step.id === StepType.tokenApproval);
	const approvedSpenderAddress = approveStep ? decodeERC20Approval(approveStep.data).spender : void 0;
	if (!buyStep) throw new Error("Buy step not found");
	const creditCardProviders = customCreditCardProviderCallback ? ["custom"] : checkoutOptions.nftCheckout || [];
	const isTransakSupported = creditCardProviders.includes("transak");
	let transakContractId;
	if (isTransakSupported) {
		const sequenceApiClient = getSequenceApiClient(config);
		const transakContractIdResponse = await sequenceApiClient.checkoutOptionsGetTransakContractID({
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
		recipientAddress: await wallet.address(),
		enableMainCurrencyPayment: true,
		enableSwapPayments: !!checkoutOptions.swap,
		creditCardProviders,
		onSuccess: (hash) => {
			callbacks?.onSuccess?.({ hash });
		},
		supplementaryAnalyticsInfo: {
			requestId: orderId,
			marketplaceKind: marketplace,
			buyAnalyticsId,
			marketplaceType: "market"
		},
		onError: callbacks?.onError,
		onClose: () => {
			const queryClient = getQueryClient();
			queryClient.invalidateQueries();
			buyModalStore.send({ type: "close" });
		},
		skipNativeBalanceCheck,
		nativeTokenAddress,
		...customCreditCardProviderCallback && { customProviderCallback: () => {
			customCreditCardProviderCallback(buyStep);
			buyModalStore.send({ type: "close" });
		} },
		...transakContractId && { transakConfig: { contractId: transakContractId } }
	};
};
const usePaymentModalParams = (args) => {
	const { wallet, marketplace, collectable, checkoutOptions, priceCurrencyAddress, quantity, enabled } = args;
	const buyModalProps = useBuyModalProps();
	const { chainId, collectionAddress, skipNativeBalanceCheck, nativeTokenAddress } = buyModalProps;
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
	const queryEnabled = !!wallet && !!marketplace && !!collectable && !!checkoutOptions && !!priceCurrencyAddress && !!quantity && enabled;
	return useQuery({
		queryKey: [
			"buyCollectableParams",
			buyModalProps,
			args,
			fee
		],
		queryFn: queryEnabled ? () => getBuyCollectableParams({
			chainId,
			config,
			wallet,
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
				onError
			},
			customCreditCardProviderCallback,
			skipNativeBalanceCheck,
			nativeTokenAddress,
			buyAnalyticsId
		}) : skipToken
	});
};

//#endregion
//#region src/react/ui/modals/BuyModal/components/ERC721BuyModal.tsx
const ERC721BuyModal = ({ collectable, order, wallet, checkoutOptions }) => {
	const quantity = useQuantity();
	const onError = useOnError();
	useEffect(() => {
		if (!quantity) buyModalStore.send({
			type: "setQuantity",
			quantity: 1
		});
	}, [quantity]);
	const { data: paymentModalParams, isLoading: isPaymentModalParamsLoading, isError: isPaymentModalParamsError, error: paymentModalParamsErrorObj } = usePaymentModalParams({
		wallet,
		quantity: quantity ?? void 0,
		marketplace: order?.marketplace,
		collectable,
		checkoutOptions,
		priceCurrencyAddress: order?.priceCurrencyAddress,
		enabled: true
	});
	useEffect(() => {
		if (isPaymentModalParamsError && paymentModalParamsErrorObj) {
			const errorMessage = paymentModalParamsErrorObj instanceof Error ? paymentModalParamsErrorObj.message : "Failed to load payment parameters for ERC721 marketplace purchase";
			onError(new Error(errorMessage));
		}
	}, [
		isPaymentModalParamsError,
		paymentModalParamsErrorObj,
		onError
	]);
	if (isPaymentModalParamsLoading || !paymentModalParams) return null;
	if (isPaymentModalParamsError) return null;
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
var BuyModalErrorFormatter = class BuyModalErrorFormatter {
	static format(error) {
		switch (error.type) {
			case "PRICE_OVERFLOW": return "Price calculation exceeded safe limits. Please reduce quantity or contact support.";
			case "PRICE_CALCULATION_ERROR": return "Price calculation failed. Please refresh and try again.";
			case "INVALID_PRICE_FORMAT": return `Invalid price format. Expected: ${error.expectedFormat}`;
			case "INVALID_QUANTITY": return `Invalid quantity. Must be between ${error.min} and ${error.max}.`;
			case "NETWORK_ERROR": return error.retryable ? `Network error. ${error.message} Please try again.` : `Network unavailable. ${error.message}`;
			case "CONTRACT_ERROR": return `Blockchain error at ${error.contractAddress}. Please refresh and try again.`;
			case "CHECKOUT_ERROR": return error.retryable ? `Checkout failed with ${error.provider}. Please try again.` : `Checkout unavailable with ${error.provider}.`;
			case "VALIDATION_ERROR": return `${error.field}: ${error.message}`;
			case "STATE_ERROR": return `Invalid operation: ${error.message}`;
			default: return "An unexpected error occurred. Please try again.";
		}
	}
	static isRetryable(error) {
		switch (error.type) {
			case "NETWORK_ERROR":
			case "CHECKOUT_ERROR": return error.retryable;
			case "PRICE_CALCULATION_ERROR":
			case "CONTRACT_ERROR": return true;
			default: return false;
		}
	}
	static getRecoveryAction(error) {
		switch (error.type) {
			case "INVALID_QUANTITY": return "Adjust quantity";
			case "INVALID_PRICE_FORMAT": return "Enter valid price";
			case "NETWORK_ERROR":
			case "CONTRACT_ERROR": return "Retry transaction";
			case "CHECKOUT_ERROR": return "Try different payment method";
			default: return "Refresh and try again";
		}
	}
	/**
	* Transform class-based errors (BaseError/TransactionError) to user-friendly BuyModalError
	* This bridges the internal error system with the modal error system
	*/
	static fromTransactionError(error) {
		const errorName = error.name || error.constructor.name;
		switch (errorName) {
			case "PriceCalculationError": return BuyModalErrorFactory.priceCalculation("price calculation", [], error.message);
			case "SalesContractError": {
				const addressMatch = error.message.match(/0x[a-fA-F0-9]{40}/);
				return BuyModalErrorFactory.contractError(addressMatch?.[0] || "unknown", error.message);
			}
			case "QuantityValidationError": {
				const quantityMatch = error.message.match(/Invalid quantity: (\d+)/);
				const availableMatch = error.message.match(/available supply \((\d+)\)/);
				return BuyModalErrorFactory.invalidQuantity(Number(quantityMatch?.[1] || 0), 0, Number(availableMatch?.[1] || 0));
			}
			case "UserRejectedRequestError": return BuyModalErrorFactory.checkoutError("user", "User cancelled the transaction", "USER_REJECTED", false);
			case "NoWalletConnectedError": return BuyModalErrorFactory.stateError("disconnected", "purchase", "Please connect your wallet to continue");
			case "ChainSwitchError":
			case "NetworkError": return BuyModalErrorFactory.networkError(error.message, true);
			case "ShopDataValidationError": return BuyModalErrorFactory.validationError("shop-config", error.message);
			default: return BuyModalErrorFactory.stateError("unknown", "operation", error.message || "An unexpected error occurred");
		}
	}
	/**
	* Enhanced error wrapper that catches and transforms errors consistently
	*/
	static async withErrorHandling(operation, _context) {
		try {
			return await operation();
		} catch (error) {
			const buyModalError = BuyModalErrorFormatter.fromTransactionError(error);
			const enhancedError = error;
			enhancedError.buyModalError = buyModalError;
			throw enhancedError;
		}
	}
};

//#endregion
//#region src/react/ui/modals/BuyModal/hooks/useERC721SalePaymentParams.ts
const DEFAULT_PROOF = [toHex(0, { size: 32 })];
const encodeERC721MintData = ({ to, amount, paymentToken, price, proof = DEFAULT_PROOF }) => {
	const totalPrice = price * amount;
	return encodeFunctionData({
		abi: ERC721_SALE_ABI,
		functionName: "mint",
		args: [
			to,
			amount,
			paymentToken,
			totalPrice,
			proof
		]
	});
};
const getERC721SalePaymentParams = async ({ chainId, address, salesContractAddress, collectionAddress, price, currencyAddress, callbacks, customCreditCardProviderCallback, skipNativeBalanceCheck, nativeTokenAddress, checkoutProvider, quantity }) => {
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
			enableMainCurrencyPayment: true,
			enableSwapPayments: true,
			creditCardProviders,
			onSuccess: (hash) => {
				callbacks?.onSuccess?.({ hash });
			},
			onError: callbacks?.onError,
			onClose: () => {
				const queryClient = getQueryClient();
				queryClient.invalidateQueries();
				buyModalStore.send({ type: "close" });
			},
			skipNativeBalanceCheck,
			supplementaryAnalyticsInfo: { marketplaceType: "shop" },
			nativeTokenAddress,
			...customCreditCardProviderCallback && { customProviderCallback: () => {
				customCreditCardProviderCallback(price.toString());
				buyModalStore.send({ type: "close" });
			} }
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
	const queryEnabled = enabled && !!address && !!salesContractAddress && !!collectionAddress && !!price && !!currencyAddress;
	return useQuery({
		queryKey: ["erc721SalePaymentParams", args],
		queryFn: queryEnabled ? () => getERC721SalePaymentParams({
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
			quantity
		}) : skipToken
	});
};

//#endregion
//#region src/react/ui/modals/BuyModal/components/ERC721ShopModal.tsx
const ERC721ShopModal = ({ collection, shopData, chainId }) => {
	const quantity = Number(shopData.items[0]?.quantity ?? 1);
	const onError = useOnError();
	const { data: erc721SalePaymentParams, isLoading: isErc721PaymentParamsLoading, isError: isErc721PaymentParamsError, error: erc721PaymentParamsErrorObj } = useERC721SalePaymentParams({
		salesContractAddress: shopData.salesContractAddress,
		collectionAddress: collection.address,
		price: shopData.salePrice?.amount || "0",
		currencyAddress: shopData.salePrice?.currencyAddress || "",
		enabled: true,
		chainId,
		quantity
	});
	useEffect(() => {
		if (isErc721PaymentParamsError) {
			const errorMessage = erc721PaymentParamsErrorObj instanceof Error ? erc721PaymentParamsErrorObj.message : "Failed to load ERC721 sale parameters";
			const contractError = BuyModalErrorFactory.contractError(shopData.salesContractAddress, errorMessage);
			const error = new Error(BuyModalErrorFormatter.format(contractError));
			onError(error);
		}
	}, [
		isErc721PaymentParamsError,
		erc721PaymentParamsErrorObj,
		shopData.salesContractAddress,
		onError
	]);
	if (isErc721PaymentParamsLoading || !erc721SalePaymentParams) return null;
	if (isErc721PaymentParamsError) return null;
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
//#region src/react/ui/modals/BuyModal/components/ERC1155QuantityModal.tsx
const INFINITY_STRING = maxUint256.toString();
const ERC1155QuantityModal = ({ order, quantityDecimals, quantityRemaining, unlimitedSupply, salePrice, chainId, marketplaceType }) => {
	const isOpen = useIsOpen$1();
	const [localQuantity, setLocalQuantity] = useState("1");
	const [invalidQuantity, setInvalidQuantity] = useState(false);
	const maxQuantity = unlimitedSupply ? INFINITY_STRING : quantityRemaining;
	return /* @__PURE__ */ jsx(ActionModal, {
		isOpen,
		chainId,
		onClose: () => buyModalStore.send({ type: "close" }),
		title: "Select Quantity",
		disableAnimation: true,
		ctas: [{
			label: "Buy now",
			onClick: () => {
				buyModalStore.send({
					type: "setQuantity",
					quantity: Number(localQuantity)
				});
			},
			disabled: invalidQuantity
		}],
		children: /* @__PURE__ */ jsxs("div", {
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
				marketplaceType
			})]
		})
	});
};
const TotalPrice = ({ order, quantityStr, salePrice, chainId, marketplaceType }) => {
	const isShop = marketplaceType === "shop";
	const isMarket = marketplaceType === "market";
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const { data: currency, isLoading: isCurrencyLoading } = useCurrency({
		chainId,
		currencyAddress: order ? order.priceCurrencyAddress : salePrice?.currencyAddress
	});
	let error = null;
	let formattedPrice = "0";
	const quantity = BigInt(quantityStr);
	if (isMarket && currency && order) try {
		const marketCollection = marketplaceConfig?.market?.collections?.find((col) => col.itemsAddress.toLowerCase() === order.collectionContractAddress.toLowerCase() && col.chainId === chainId);
		const marketplaceFeePercentage = marketCollection?.feePercentage ?? DEFAULT_MARKETPLACE_FEE_PERCENTAGE;
		const quantity$1 = BigInt(quantityStr);
		const totalPriceRaw = BigInt(order ? order.priceAmount : "0") * quantity$1;
		formattedPrice = formatPriceWithFee(totalPriceRaw, currency.decimals, marketplaceFeePercentage);
	} catch (e) {
		console.error("Error formatting price", e);
		error = "Unable to calculate total price";
	}
	if (isShop && salePrice && currency) {
		const totalPriceRaw = BigInt(salePrice.amount) * quantity;
		formattedPrice = formatPriceWithFee(totalPriceRaw, currency.decimals, 0);
	}
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
			children: !currency || isCurrencyLoading ? /* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-2",
				children: /* @__PURE__ */ jsx(Text, {
					className: "font-body text-text-50 text-xs",
					children: "Loading..."
				})
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [
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
//#region src/react/ui/modals/BuyModal/components/ERC1155BuyModal.tsx
const ERC1155BuyModal = ({ collectable, order, wallet, checkoutOptions, chainId }) => {
	const quantity = useQuantity();
	const modalProps = useBuyModalProps();
	const marketplaceType = modalProps.marketplaceType || "market";
	const isShop = isShopProps(modalProps);
	const quantityDecimals = isShop ? modalProps.quantityDecimals : order?.quantityDecimals;
	const quantityRemaining = isShop ? modalProps.quantityRemaining?.toString() : order?.quantityRemaining;
	if (!quantity) return /* @__PURE__ */ jsx(ERC1155QuantityModal, {
		order,
		marketplaceType,
		quantityDecimals,
		quantityRemaining,
		chainId
	});
	if (!checkoutOptions) return null;
	return /* @__PURE__ */ jsx(Modal$4, {
		wallet,
		quantity,
		order,
		collectable,
		checkoutOptions
	});
};
const Modal$4 = ({ wallet, quantity, order, collectable, checkoutOptions }) => {
	const onError = useOnError();
	const { data: paymentModalParams, isLoading: isPaymentModalParamsLoading, isError: isPaymentModalParamsError, error: paymentModalParamsErrorObj } = usePaymentModalParams({
		wallet,
		quantity,
		marketplace: order?.marketplace,
		collectable,
		checkoutOptions,
		priceCurrencyAddress: order?.priceCurrencyAddress,
		enabled: true
	});
	useEffect(() => {
		if (isPaymentModalParamsError && paymentModalParamsErrorObj) {
			const errorMessage = paymentModalParamsErrorObj instanceof Error ? paymentModalParamsErrorObj.message : "Failed to load payment parameters for ERC1155 marketplace purchase";
			onError(new Error(errorMessage));
		}
	}, [
		isPaymentModalParamsError,
		paymentModalParamsErrorObj,
		onError
	]);
	if (isPaymentModalParamsLoading || !paymentModalParams) return null;
	if (isPaymentModalParamsError) return null;
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
	const checkout = useERC1155SaleContractCheckout({
		chain: chainId,
		chainId: chainId.toString(),
		contractAddress: salesContractAddress,
		collectionAddress,
		items: [{
			...items[0],
			quantity: quantity?.toString() || "1"
		}],
		wallet: accountAddress ?? "",
		...checkoutOptions && { checkoutOptions },
		onSuccess: (hash) => {
			onSuccess({ hash });
		},
		onError: (error) => {
			onError(error);
		},
		onClose: () => {
			const queryClient = getQueryClient();
			queryClient.invalidateQueries();
			buyModalStore.send({ type: "close" });
		},
		customProviderCallback,
		supplementaryAnalyticsInfo: {
			marketplaceType: "shop",
			saleAnalyticsId
		}
	});
	return {
		...checkout,
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
		marketplaceType: "shop",
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
		isOpen: true,
		chainId,
		onClose: () => buyModalStore.send({ type: "close" }),
		title: "Loading Sequence Pay"
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
	const { collection, collectable, wallet, isLoading, order, checkoutOptions, currency, shopData, isError } = useLoadData();
	useEffect(() => {
		if (isError) onError(/* @__PURE__ */ new Error("Failed to load data"));
	}, [isError, onError]);
	if (isError) return /* @__PURE__ */ jsx(ErrorModal, {
		isOpen: true,
		chainId,
		onClose: () => buyModalStore.send({ type: "close" }),
		title: "Loading Error"
	});
	if (isLoading || !collection) return /* @__PURE__ */ jsx(LoadingModal, {
		isOpen: true,
		chainId,
		onClose: () => buyModalStore.send({ type: "close" }),
		title: "Loading Sequence Pay"
	});
	if (isShop) {
		if (collection.type === "ERC721") {
			if (!shopData || !currency) return /* @__PURE__ */ jsx(LoadingModal, {
				isOpen: true,
				chainId,
				onClose: () => buyModalStore.send({ type: "close" }),
				title: "Loading Sequence Pay"
			});
			return /* @__PURE__ */ jsx(ERC721ShopModal, {
				collection,
				shopData,
				chainId
			});
		}
		if (collection.type === "ERC1155") {
			if (!shopData || !currency) return /* @__PURE__ */ jsx(LoadingModal, {
				isOpen: true,
				chainId,
				onClose: () => buyModalStore.send({ type: "close" }),
				title: "Loading Sequence Pay"
			});
			return /* @__PURE__ */ jsx(ERC1155ShopModal, {
				collection,
				shopData,
				chainId
			});
		}
	} else {
		if (collection.type === "ERC721") {
			if (!collectable || !order || !wallet || !checkoutOptions) return /* @__PURE__ */ jsx(LoadingModal, {
				isOpen: true,
				chainId,
				onClose: () => buyModalStore.send({ type: "close" }),
				title: "Loading Sequence Pay"
			});
			return /* @__PURE__ */ jsx(ERC721BuyModal, {
				collection,
				collectable,
				order,
				wallet,
				checkoutOptions,
				chainId
			});
		}
		if (collection.type === "ERC1155") {
			if (!collectable || !order || !wallet || !checkoutOptions) return /* @__PURE__ */ jsx(LoadingModal, {
				isOpen: true,
				chainId,
				onClose: () => buyModalStore.send({ type: "close" }),
				title: "Loading Sequence Pay"
			});
			return /* @__PURE__ */ jsx(ERC1155BuyModal, {
				collection,
				collectable,
				order,
				wallet,
				checkoutOptions,
				chainId
			});
		}
	}
	onError(/* @__PURE__ */ new Error(`Unsupported configuration: ${collection.type} in ${isShop ? "shop" : "market"} mode`));
	return /* @__PURE__ */ jsx(ErrorModal, {
		isOpen: true,
		chainId,
		onClose: () => buyModalStore.send({ type: "close" }),
		title: "Unsupported Configuration"
	});
};

//#endregion
//#region src/react/ui/modals/BuyModal/components/Modal.tsx
const BuyModal = () => {
	const isOpen = useIsOpen$1();
	if (!isOpen) return null;
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
	return /* @__PURE__ */ jsxs(DropdownMenuRoot, {
		open: isOpen,
		onOpenChange: setIsOpen,
		children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsx(Button, {
				leftIcon: CalendarIcon_default,
				className: "h-9 flex-1 rounded-sm p-2 font-medium text-xs",
				variant: "base",
				label: format(selectedDate, "dd/MM/yyyy HH:mm"),
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
						const isActive = matchingPreset === preset.value;
						return /* @__PURE__ */ jsx(Button, {
							onClick: () => {
								onSelectPreset(preset.value);
								setIsOpen(false);
							},
							variant: "text",
							className: `w-full justify-start py-1.5 font-bold text-xs transition-colors ${isActive ? "text-text-100" : "text-text-50 hover:text-text-80"}`,
							children: preset.label
						}, preset.value);
					})
				}), /* @__PURE__ */ jsx(calendar_default, {
					selectedDate,
					setSelectedDate: (date) => {
						setSelectedDate(date);
						setIsOpen(false);
					},
					mode: "single"
				})]
			})
		}) })]
	});
}

//#endregion
//#region src/react/ui/modals/_internal/components/expirationDateSelect/index.tsx
const setToEndOfDay = (date) => {
	const endOfDay = new Date(date);
	endOfDay.setHours(23, 59, 59, 999);
	return endOfDay;
};
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
		const newDate = presetRange.value === "today" ? setToEndOfDay(baseDate) : addDays(baseDate, presetRange.offset);
		onDateChange(newDate);
	}
	function handleDateValueChange(date$1) {
		onDateChange(date$1);
	}
	if (!date) return /* @__PURE__ */ jsx(Skeleton, { className: "mr-3 h-7 w-20 rounded-2xl" });
	return /* @__PURE__ */ jsxs("div", {
		className: cn("relative w-full", disabled && "pointer-events-none opacity-50"),
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
function CurrencyOptionsSelect({ chainId, collectionAddress, secondCurrencyAsDefault, selectedCurrency, onCurrencyChange, includeNativeCurrency }) {
	const { data: currencies, isLoading: currenciesLoading } = useMarketCurrencies({
		chainId,
		collectionAddress,
		includeNativeCurrency
	});
	useEffect(() => {
		if (currencies && currencies.length > 0 && !selectedCurrency?.contractAddress) if (secondCurrencyAsDefault) onCurrencyChange(currencies[1]);
		else onCurrencyChange(currencies[0]);
	}, [
		currencies,
		selectedCurrency?.contractAddress,
		secondCurrencyAsDefault,
		onCurrencyChange
	]);
	if (!currencies || currenciesLoading || !selectedCurrency?.symbol) return /* @__PURE__ */ jsx(Skeleton, { className: "mr-3 h-7 w-20 rounded-2xl" });
	const options = currencies.map((currency) => ({
		label: currency.symbol,
		value: currency.contractAddress,
		content: currency.symbol
	}));
	const onChange = (value) => {
		const selectedCurrency$1 = currencies.find((currency) => currency.contractAddress === value);
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
function PriceInput({ chainId, collectionAddress, price, onPriceChange, onCurrencyChange, checkBalance, secondCurrencyAsDefault, includeNativeCurrency, disabled }) {
	const { address: accountAddress } = useAccount();
	const inputRef = useRef(null);
	const currency = price?.currency;
	const currencyDecimals = price?.currency?.decimals;
	const currencyAddress = price?.currency?.contractAddress;
	const priceAmountRaw = price?.amountRaw;
	const handleCurrencyChange = (newCurrency) => {
		if (price && onCurrencyChange) onCurrencyChange(newCurrency);
	};
	useEffect(() => {
		if (inputRef.current) inputRef.current.focus();
	}, []);
	const { data: balance, isSuccess: isBalanceSuccess } = useCurrencyBalance({
		currencyAddress,
		chainId,
		userAddress: accountAddress
	});
	const balanceError = !!checkBalance?.enabled && !!isBalanceSuccess && !!priceAmountRaw && !!currencyDecimals && BigInt(priceAmountRaw) > BigInt(balance?.value || 0n);
	if (checkBalance?.enabled) checkBalance.callback(balanceError);
	const [value, setValue] = useState("0");
	const prevCurrencyDecimals = useRef(currencyDecimals);
	useEffect(() => {
		if (prevCurrencyDecimals.current !== currencyDecimals && value !== "0" && price && onPriceChange) try {
			const parsedAmount = parseUnits(value, Number(currencyDecimals));
			const updatedPrice = {
				...price,
				amountRaw: parsedAmount.toString()
			};
			onPriceChange(updatedPrice);
		} catch {
			const updatedPrice = {
				...price,
				amountRaw: "0"
			};
			onPriceChange(updatedPrice);
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
		try {
			const parsedAmount = parseUnits(newValue, Number(currencyDecimals));
			const updatedPrice = {
				...price,
				amountRaw: parsedAmount.toString()
			};
			onPriceChange(updatedPrice);
		} catch {
			const updatedPrice = {
				...price,
				amountRaw: "0"
			};
			onPriceChange(updatedPrice);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: cn("price-input relative flex w-full flex-col", disabled && "pointer-events-none opacity-50"),
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "absolute top-8 left-2 flex items-center",
				children: /* @__PURE__ */ jsx(currencyImage_default, { price })
			}),
			/* @__PURE__ */ jsx("div", {
				className: "[&>label>div>div>.rounded-xl]:h-9 [&>label>div>div>.rounded-xl]:rounded-sm [&>label>div>div>.rounded-xl]:px-2 [&>label]:gap-1",
				children: /* @__PURE__ */ jsx(NumericInput, {
					ref: inputRef,
					className: "ml-5 w-full text-xs",
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
						includeNativeCurrency
					}),
					value,
					onChange: handleChange
				})
			}),
			balanceError && /* @__PURE__ */ jsx(Text, {
				className: "-bottom-5 absolute font-body font-medium text-xs",
				color: "negative",
				children: "Insufficient balance"
			})
		]
	});
}

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
	const priceLoading = !price || marketplaceConfigLoading || royaltyLoading;
	let formattedAmount = "0";
	if (price) {
		const fees = [];
		if (royalty !== null) fees.push(Number(royalty.percentage));
		if (marketplaceFeePercentage > 0) fees.push(marketplaceFeePercentage);
		formattedAmount = calculateEarningsAfterFees(BigInt(price.amountRaw), price.currency.decimals, fees);
	}
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
			}), priceLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24 animate-shimmer" }) : /* @__PURE__ */ jsxs(Text, {
				className: "font-body font-medium text-xs",
				color: "text100",
				children: [
					showPlaceholderPrice ? "0" : formattedAmount,
					" ",
					price.currency.symbol
				]
			})]
		})]
	});
}

//#endregion
//#region src/react/ui/modals/CreateListingModal/hooks/useGetTokenApproval.ts
const ONE_DAY_IN_SECONDS$1 = 60 * 60 * 24;
const useGetTokenApprovalData$2 = (params) => {
	const config = useConfig();
	const { wallet } = useWallet();
	const { address } = useAccount();
	const marketplaceClient = getMarketplaceClient(config);
	const listing = {
		tokenId: params.tokenId,
		quantity: "1",
		currencyAddress: params.currencyAddress,
		pricePerToken: "100000",
		expiry: String(Number(dateToUnixTime(/* @__PURE__ */ new Date())) + ONE_DAY_IN_SECONDS$1)
	};
	const isEnabled = wallet && address && (params.query?.enabled ?? true) && !!params.currencyAddress;
	const { data, isLoading, isSuccess } = useQuery({
		queryKey: [
			"token-approval-data",
			params,
			address
		],
		queryFn: isEnabled ? async () => {
			const args = {
				chainId: String(params.chainId),
				collectionAddress: params.collectionAddress,
				owner: await wallet.address(),
				walletType: wallet.walletKind,
				contractType: params.contractType,
				orderbook: params.orderbook,
				listing
			};
			const steps$2 = await marketplaceClient.generateListingTransaction(args).then((resp) => resp.steps);
			const tokenApprovalStep = steps$2.find((step) => step.id === StepType.tokenApproval);
			if (!tokenApprovalStep) return { step: null };
			return { step: tokenApprovalStep };
		} : skipToken
	});
	return {
		data,
		isLoading,
		isSuccess
	};
};

//#endregion
//#region src/utils/getSequenceMarketRequestId.ts
const getSequenceMarketplaceRequestId = async (hash, publicClient, walletAddress) => {
	try {
		const receipt = await publicClient.getTransactionReceipt({ hash });
		const logs = parseEventLogs({
			abi: SequenceMarketplaceV1_ABI,
			eventName: "RequestCreated",
			args: { creator: walletAddress },
			logs: receipt.logs
		});
		return logs[0].args.requestId.toString();
	} catch (error) {
		console.error(error);
	}
};

//#endregion
//#region src/react/ui/modals/CreateListingModal/hooks/useTransactionSteps.tsx
const useTransactionSteps$2 = ({ listingInput, chainId, collectionAddress, orderbookKind, callbacks, closeMainModal, steps$ }) => {
	const { wallet } = useWallet();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const { data: currencies } = useMarketCurrencies({ chainId });
	const currency = currencies?.find((currency$1) => currency$1.contractAddress === listingInput.listing.currencyAddress);
	const marketplaceClient = getMarketplaceClient(sdkConfig);
	const analytics = useAnalytics();
	const { generateListingTransactionAsync, isPending: generatingSteps } = useGenerateListingTransaction({
		chainId,
		onSuccess: (steps$2) => {
			if (!steps$2) return;
		}
	});
	const getListingSteps = async () => {
		if (!wallet) return;
		try {
			const address = await wallet.address();
			const steps$2 = await generateListingTransactionAsync({
				collectionAddress,
				owner: address,
				walletType: wallet.walletKind,
				contractType: listingInput.contractType,
				orderbook: orderbookKind,
				listing: {
					...listingInput.listing,
					expiry: /* @__PURE__ */ new Date(Number(listingInput.listing.expiry) * 1e3)
				}
			});
			return steps$2;
		} catch (error) {
			if (callbacks?.onError) callbacks.onError(error);
			else console.debug("onError callback not provided:", error);
		}
	};
	const executeApproval = async () => {
		if (!wallet) return;
		try {
			steps$.approval.isExecuting.set(true);
			const approvalStep = await getListingSteps().then((steps$2) => steps$2?.find((step) => step.id === StepType.tokenApproval));
			const hash = await wallet.handleSendTransactionStep(Number(chainId), approvalStep);
			await wallet.handleConfirmTransactionStep(hash, Number(chainId));
			steps$.approval.isExecuting.set(false);
			steps$.approval.exist.set(false);
		} catch (_error) {
			steps$.approval.isExecuting.set(false);
		}
	};
	const createListing = async ({ isTransactionExecuting }) => {
		if (!wallet) return;
		try {
			steps$.transaction.isExecuting.set(isTransactionExecuting);
			const steps$2 = await getListingSteps();
			const transactionStep = steps$2?.find((step) => step.id === StepType.createListing);
			const signatureStep = steps$2?.find((step) => step.id === StepType.signEIP712);
			console.debug("transactionStep", transactionStep);
			console.debug("signatureStep", signatureStep);
			if (!transactionStep && !signatureStep) throw new Error("No transaction or signature step found");
			let hash;
			let orderId;
			if (transactionStep) hash = await executeTransaction({ transactionStep });
			if (signatureStep) orderId = await executeSignature({ signatureStep });
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
				await wallet.handleConfirmTransactionStep(hash, Number(chainId));
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
				if (hash && (orderbookKind === OrderbookKind.sequence_marketplace_v1 || orderbookKind === OrderbookKind.sequence_marketplace_v2)) requestId = await getSequenceMarketplaceRequestId(hash, wallet.publicClient, await wallet.address());
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
	const executeTransaction = async ({ transactionStep }) => {
		if (!wallet) return;
		const hash = await wallet.handleSendTransactionStep(Number(chainId), transactionStep);
		return hash;
	};
	const executeSignature = async ({ signatureStep }) => {
		if (!wallet) return;
		const signature = await wallet.handleSignMessageStep(signatureStep);
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
	const { data: tokenApproval, isLoading: tokenApprovalIsLoading } = useGetTokenApprovalData$2({
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
		tokenApprovalIsLoading
	};
};

//#endregion
//#region src/react/ui/modals/CreateListingModal/Modal.tsx
const CreateListingModal = () => {
	return /* @__PURE__ */ jsx(Show, {
		if: createListingModal$.isOpen,
		children: () => /* @__PURE__ */ jsx(Modal$3, {})
	});
};
const Modal$3 = observer(() => {
	const state = createListingModal$.get();
	const { collectionAddress, chainId, listingPrice: listingPrice$1, collectibleId, orderbookKind, callbacks, listingIsBeingProcessed } = state;
	const steps$ = createListingModal$.steps;
	const { wallet } = useWallet();
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
	const { isLoading, executeApproval, createListing, tokenApprovalIsLoading } = useCreateListing({
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
	if (collectableIsError || collectionIsError || currenciesIsError) return /* @__PURE__ */ jsx(ErrorModal, {
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
			if (wallet?.isWaaS) selectWaasFeeOptionsStore.send({ type: "show" });
			await createListing({ isTransactionExecuting: !!wallet?.isWaaS });
		} catch (error) {
			console.error("Create listing failed:", error);
		} finally {
			createListingModal$.listingIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		}
	};
	const listCtaLabel = getActionLabel("List item for sale");
	const ctas = [{
		label: "Approve TOKEN",
		onClick: async () => await executeApproval(),
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
					disabled: shouldHideListButton
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
				maxQuantity: balance?.balance,
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
		]
	});
});

//#endregion
//#region src/react/ui/modals/MakeOfferModal/hooks/useGetTokenApproval.tsx
const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
const useGetTokenApprovalData$1 = (params) => {
	const config = useConfig();
	const { wallet } = useWallet();
	const marketplaceClient = getMarketplaceClient(config);
	const offer = {
		tokenId: params.tokenId,
		quantity: "1",
		currencyAddress: params.currencyAddress,
		pricePerToken: "1",
		expiry: String(Number(dateToUnixTime(/* @__PURE__ */ new Date())) + ONE_DAY_IN_SECONDS)
	};
	const isEnabled = wallet && params.query?.enabled !== false;
	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ["token-approval-data", params.currencyAddress],
		queryFn: isEnabled ? async () => {
			const args = {
				chainId: String(params.chainId),
				collectionAddress: params.collectionAddress,
				maker: await wallet.address(),
				walletType: wallet.walletKind,
				contractType: params.contractType,
				orderbook: params.orderbook,
				offer
			};
			const steps$2 = await marketplaceClient.generateOfferTransaction(args).then((resp) => resp.steps);
			const tokenApprovalStep = steps$2.find((step) => step.id === StepType.tokenApproval);
			if (!tokenApprovalStep) return { step: null };
			return { step: tokenApprovalStep };
		} : skipToken,
		enabled: !!wallet && !!params.collectionAddress && !!params.currencyAddress
	});
	return {
		data,
		isLoading,
		isSuccess
	};
};

//#endregion
//#region src/react/ui/modals/MakeOfferModal/hooks/useTransactionSteps.tsx
const useTransactionSteps$1 = ({ offerInput, chainId, collectionAddress, orderbookKind = OrderbookKind.sequence_marketplace_v2, callbacks, closeMainModal, steps$ }) => {
	const { wallet } = useWallet();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const analytics = useAnalytics();
	const marketplaceClient = getMarketplaceClient(sdkConfig);
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
		if (!wallet) return;
		try {
			const address = await wallet.address();
			const steps$2 = await generateOfferTransactionAsync({
				collectionAddress,
				maker: address,
				walletType: wallet.walletKind,
				contractType: offerInput.contractType,
				orderbook: orderbookKind,
				offer: {
					...offerInput.offer,
					expiry: /* @__PURE__ */ new Date(Number(offerInput.offer.expiry) * 1e3)
				}
			});
			return steps$2;
		} catch (error) {
			if (callbacks?.onError) callbacks.onError(error);
			else console.debug("onError callback not provided:", error);
		}
	};
	const executeApproval = async () => {
		if (!wallet) return;
		try {
			steps$.approval.isExecuting.set(true);
			const approvalStep = await getOfferSteps().then((steps$2) => steps$2?.find((step) => step.id === StepType.tokenApproval));
			const hash = await wallet.handleSendTransactionStep(Number(chainId), approvalStep);
			await wallet.handleConfirmTransactionStep(hash, Number(chainId));
			steps$.approval.isExecuting.set(false);
			steps$.approval.exist.set(false);
		} catch (_error) {
			steps$.approval.isExecuting.set(false);
		}
	};
	const makeOffer = async ({ isTransactionExecuting }) => {
		if (!wallet) return;
		try {
			steps$.transaction.isExecuting.set(isTransactionExecuting);
			const steps$2 = await getOfferSteps();
			const transactionStep = steps$2?.find((step) => step.id === StepType.createOffer);
			const signatureStep = steps$2?.find((step) => step.id === StepType.signEIP712);
			console.debug("transactionStep", transactionStep);
			console.debug("signatureStep", signatureStep);
			if (!transactionStep && !signatureStep) throw new Error("No transaction or signature step found");
			let hash;
			let orderId;
			if (transactionStep) hash = await executeTransaction({ transactionStep });
			if (signatureStep) orderId = await executeSignature({ signatureStep });
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
				await wallet.handleConfirmTransactionStep(hash, Number(chainId));
				steps$.transaction.isExecuting.set(false);
				steps$.transaction.exist.set(false);
			}
			if (orderId) {
				steps$.transaction.isExecuting.set(false);
				steps$.transaction.exist.set(false);
			}
			if (hash || orderId) {
				const currencyDecimal = currency?.decimals || 0;
				const currencyValueRaw = Number(offerInput.offer.pricePerToken);
				const currencyValueDecimal = Number(formatUnits(BigInt(currencyValueRaw), currencyDecimal));
				let requestId = orderId;
				if (hash && (orderbookKind === OrderbookKind.sequence_marketplace_v1 || orderbookKind === OrderbookKind.sequence_marketplace_v2)) requestId = await getSequenceMarketplaceRequestId(hash, wallet.publicClient, await wallet.address());
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
	const executeTransaction = async ({ transactionStep }) => {
		if (!wallet) return;
		const hash = await wallet.handleSendTransactionStep(Number(chainId), transactionStep);
		return hash;
	};
	const executeSignature = async ({ signatureStep }) => {
		if (!wallet) return;
		const signature = await wallet.handleSignMessageStep(signatureStep);
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
	return {
		generatingSteps,
		executeApproval,
		makeOffer
	};
};

//#endregion
//#region src/react/ui/modals/MakeOfferModal/hooks/useMakeOffer.tsx
const useMakeOffer = ({ offerInput, chainId, collectionAddress, orderbookKind, callbacks, closeMainModal, steps$ }) => {
	const { data: marketplaceConfig, isLoading: marketplaceIsLoading } = useMarketplaceConfig();
	const collectionConfig = marketplaceConfig?.market.collections.find((c) => c.itemsAddress === collectionAddress);
	orderbookKind = orderbookKind ?? collectionConfig?.destinationMarketplace ?? OrderbookKind.sequence_marketplace_v2;
	const { data: tokenApproval, isLoading: tokenApprovalIsLoading } = useGetTokenApprovalData$1({
		chainId,
		tokenId: offerInput.offer.tokenId,
		collectionAddress,
		currencyAddress: offerInput.offer.currencyAddress,
		contractType: offerInput.contractType,
		orderbook: orderbookKind,
		query: { enabled: !marketplaceIsLoading }
	});
	useEffect(() => {
		if (tokenApproval?.step && !tokenApprovalIsLoading) steps$.approval.exist.set(true);
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
		tokenApprovalIsLoading
	};
};

//#endregion
//#region src/react/ui/modals/MakeOfferModal/Modal.tsx
const MakeOfferModal = () => {
	return /* @__PURE__ */ jsx(Show, {
		if: makeOfferModal$.isOpen,
		children: () => /* @__PURE__ */ jsx(Modal$2, {})
	});
};
const Modal$2 = observer(() => {
	const state = makeOfferModal$.get();
	const { collectionAddress, chainId, offerPrice: offerPrice$1, offerPriceChanged, invalidQuantity, collectibleId, orderbookKind, callbacks } = state;
	const steps$ = makeOfferModal$.steps;
	const [insufficientBalance, setInsufficientBalance] = useState(false);
	const { data: collectible, isLoading: collectableIsLoading, isError: collectableIsError } = useCollectible({
		chainId,
		collectionAddress,
		collectibleId
	});
	const { wallet } = useWallet();
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
		includeNativeCurrency: false
	});
	const modalLoading = collectableIsLoading || collectionIsLoading || currenciesLoading;
	const { isLoading, executeApproval, makeOffer } = useMakeOffer({
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
		orderbookKind,
		callbacks,
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
	if (collectableIsError || collectionIsError || currenciesIsError) return /* @__PURE__ */ jsx(ErrorModal, {
		isOpen: makeOfferModal$.isOpen.get(),
		chainId: Number(chainId),
		onClose: makeOfferModal$.close,
		title: "Make an offer"
	});
	if (!modalLoading && (!currencies || currencies.length === 0)) return /* @__PURE__ */ jsx(ErrorModal, {
		isOpen: makeOfferModal$.isOpen.get(),
		chainId: Number(chainId),
		onClose: makeOfferModal$.close,
		title: "Make an offer",
		message: "No ERC-20s are configured for the marketplace, contact the marketplace owners"
	});
	const handleMakeOffer = async () => {
		makeOfferModal$.offerIsBeingProcessed.set(true);
		try {
			if (wallet?.isWaaS) selectWaasFeeOptionsStore.send({ type: "show" });
			await makeOffer({ isTransactionExecuting: wallet?.isWaaS ? getNetwork(Number(chainId)).type !== NetworkType.TESTNET : false });
		} catch (error) {
			console.error("Make offer failed:", error);
		} finally {
			makeOfferModal$.offerIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		}
	};
	const offerCtaLabel = getActionLabel("Make offer");
	const ctas = [{
		label: "Approve TOKEN",
		onClick: async () => await executeApproval(),
		hidden: !steps$.approval.exist.get(),
		pending: steps$.approval.isExecuting.get(),
		variant: "glass",
		disabled: invalidQuantity || isLoading || insufficientBalance || offerPrice$1.amountRaw === "0" || !offerPriceChanged
	}, {
		label: offerCtaLabel,
		onClick: () => handleMakeOffer(),
		pending: steps$?.transaction.isExecuting.get() || makeOfferModal$.offerIsBeingProcessed.get(),
		disabled: steps$.approval.isExecuting.get() || steps$.approval.exist.get() || offerPrice$1.amountRaw === "0" || insufficientBalance || isLoading || invalidQuantity
	}];
	return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(ActionModal, {
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
					callback: (state$1) => setInsufficientBalance(state$1)
				},
				disabled: shouldHideOfferButton
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
		]
	}) });
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
	const { wallet } = useWallet();
	const marketplaceClient = getMarketplaceClient(config);
	const { amount, receiver } = useMarketPlatformFee({
		chainId: Number(params.chainId),
		collectionAddress: params.collectionAddress
	});
	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ["token-approval-data", params.ordersData],
		queryFn: wallet ? async () => {
			const address = await wallet.address();
			const args = {
				chainId: String(params.chainId),
				collectionAddress: params.collectionAddress,
				walletType: wallet.walletKind,
				seller: address,
				marketplace: params.marketplace,
				ordersData: params.ordersData,
				additionalFees: [{
					amount,
					receiver
				}]
			};
			const steps$2 = await marketplaceClient.generateSellTransaction(args).then((resp) => resp.steps);
			const tokenApprovalStep = steps$2.find((step) => step.id === StepType.tokenApproval);
			if (!tokenApprovalStep) return { step: null };
			return { step: tokenApprovalStep };
		} : skipToken,
		enabled: !!wallet && !!params.collectionAddress
	});
	return {
		data,
		isLoading,
		isSuccess
	};
};

//#endregion
//#region src/react/ui/modals/SellModal/hooks/useTransactionSteps.tsx
const useTransactionSteps = ({ collectibleId, chainId, collectionAddress, marketplace, ordersData, callbacks, closeMainModal, steps$ }) => {
	const { wallet } = useWallet();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const marketplaceClient = getMarketplaceClient(sdkConfig);
	const analytics = useAnalytics();
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
		if (!wallet) return;
		try {
			const address = await wallet.address();
			const steps$2 = await generateSellTransactionAsync({
				collectionAddress,
				walletType: wallet.walletKind,
				marketplace,
				ordersData,
				additionalFees: [{
					amount,
					receiver
				}],
				seller: address
			});
			return steps$2;
		} catch (error) {
			if (callbacks?.onError) callbacks.onError(error);
			else console.debug("onError callback not provided:", error);
		}
	};
	const executeApproval = async () => {
		if (!wallet) return;
		try {
			steps$.approval.isExecuting.set(true);
			const approvalStep = await getSellSteps().then((steps$2) => steps$2?.find((step) => step.id === StepType.tokenApproval));
			const hash = await wallet.handleSendTransactionStep(Number(chainId), approvalStep);
			await wallet.handleConfirmTransactionStep(hash, Number(chainId));
			steps$.approval.isExecuting.set(false);
			steps$.approval.exist.set(false);
		} catch (_error) {
			steps$.approval.isExecuting.set(false);
		}
	};
	const sell = async ({ isTransactionExecuting }) => {
		if (!wallet) return;
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
			if (transactionStep) hash = await executeTransaction({ transactionStep });
			if (signatureStep) orderId = await executeSignature({ signatureStep });
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
				await wallet.handleConfirmTransactionStep(hash, Number(chainId));
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
						userId: await wallet.address(),
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
	const executeTransaction = async ({ transactionStep }) => {
		if (!wallet) return;
		const hash = await wallet.handleSendTransactionStep(Number(chainId), transactionStep);
		return hash;
	};
	const executeSignature = async ({ signatureStep }) => {
		if (!wallet) return;
		const signature = await wallet.handleSignMessageStep(signatureStep);
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
	return {
		generatingSteps,
		executeApproval,
		sell
	};
};

//#endregion
//#region src/react/ui/modals/SellModal/hooks/useSell.tsx
const useSell = ({ collectibleId, chainId, collectionAddress, marketplace, ordersData, callbacks, closeMainModal, steps$ }) => {
	const { data: tokenApproval, isLoading: tokenApprovalIsLoading } = useGetTokenApprovalData({
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
		tokenApprovalIsLoading
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
	const { data: collection, isLoading: collectionLoading, isError: collectionError } = useCollection({
		chainId,
		collectionAddress
	});
	const { data: currency, isLoading: currencyLoading, isError: currencyError } = useCurrency({
		chainId,
		currencyAddress: order?.priceCurrencyAddress
	});
	const { wallet } = useWallet();
	const { isVisible: feeOptionsVisible, selectedFeeOption } = useSelectWaasFeeOptionsStore();
	const network = getNetwork(Number(chainId));
	const isTestnet = network.type === NetworkType.TESTNET;
	const isProcessing = sellModal$.sellIsBeingProcessed.get();
	const isWaaS = wallet?.isWaaS;
	const { shouldHideActionButton: shouldHideSellButton } = useSelectWaasFeeOptions({
		isProcessing,
		feeOptionsVisible,
		selectedFeeOption
	});
	const { isLoading, executeApproval, sell } = useSell({
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
	if ((collectionError || order === void 0 || currencyError) && !modalLoading) return /* @__PURE__ */ jsx(ErrorModal, {
		isOpen: sellModal$.isOpen.get(),
		chainId: Number(chainId),
		onClose: sellModal$.close,
		title: "You have an offer"
	});
	const handleSell = async () => {
		sellModal$.sellIsBeingProcessed.set(true);
		try {
			if (wallet?.isWaaS) selectWaasFeeOptionsStore.send({ type: "show" });
			await sell({ isTransactionExecuting: wallet?.isWaaS ? !isTestnet : false });
		} catch (error) {
			console.error("Sell failed:", error);
		} finally {
			sellModal$.sellIsBeingProcessed.set(false);
			steps$.transaction.isExecuting.set(false);
		}
	};
	const sellCtaLabel = isProcessing ? isWaaS && !isTestnet ? "Loading fee options" : "Accept" : "Accept";
	const ctas = [{
		label: "Approve TOKEN",
		onClick: async () => await executeApproval(),
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
	const showWaasFeeOptions = wallet?.isWaaS && sellModal$.sellIsBeingProcessed.get() && feeOptionsVisible;
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
			})
		]
	});
});

//#endregion
//#region src/react/ui/modals/SuccessfulPurchaseModal/store.ts
const initialContext = {
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
	context: initialContext,
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
		close: () => ({ ...initialContext })
	}
});
const useIsOpen = () => useSelector(successfulPurchaseModalStore, (state) => state.context.isOpen);
const useModalState = () => useSelector(successfulPurchaseModalStore, (state) => state.context.state);

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
	const isOpen = useIsOpen();
	const modalState = useModalState();
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
	const shownCollectibles = total > 4 ? collectibles.slice(0, 4) : collectibles;
	return /* @__PURE__ */ jsx("div", {
		className: "grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2 [&:has(div:nth-child(4))>div]:col-[unset] [&>div:nth-child(1):only-child]:h-[312px] [&>div:nth-child(1):only-child]:w-[312px] [&>div:nth-child(3)]:col-[1/-1] [&>div:nth-child(3)]:justify-self-center",
		children: shownCollectibles.map((collectible) => {
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
//#region src/react/ui/modals/modal-provider.tsx
const ModalProvider = observer(() => {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(CreateListingModal, {}),
		/* @__PURE__ */ jsx(MakeOfferModal, {}),
		/* @__PURE__ */ jsx(TransferModal, {}),
		/* @__PURE__ */ jsx(SellModal, {}),
		/* @__PURE__ */ jsx(BuyModal, {}),
		/* @__PURE__ */ jsx(SuccessfulPurchaseModal_default, {}),
		/* @__PURE__ */ jsx(switchChainModal_default, {}),
		/* @__PURE__ */ jsx(transactionStatusModal_default, {})
	] });
});

//#endregion
export { CollectibleCard, Media, ModalProvider, useBuyModal, useCreateListingModal, useMakeOfferModal, useSuccessfulPurchaseModal, useTransferModal };
//# sourceMappingURL=react-D735RF4l.js.map