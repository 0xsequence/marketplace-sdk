'use client'

import { n as getPresentableChainName } from "./network.js";
import { t as TransactionType } from "./_internal.js";
import { t as AlertMessage } from "./alertMessage.js";
import { useAccount } from "wagmi";
import { Modal, Text } from "@0xsequence/design-system";
import { jsx, jsxs } from "react/jsx-runtime";
import { createStore } from "@xstate/store";
import { useSelector } from "@xstate/store/react";

//#region src/react/ui/modals/_internal/components/consts.ts
const MODAL_WIDTH = "360px";
const MODAL_WIDTH_WIDER = "500px";
const MODAL_OVERLAY_PROPS = { style: { background: "hsla(0, 0%, 15%, 0.9)" } };
const MODAL_CONTENT_PROPS = (transactionType) => {
	if (transactionType === TransactionType.TRANSFER) return {
		style: { height: "auto" },
		className: `w-[${MODAL_WIDTH_WIDER}] md:w-[${MODAL_WIDTH}]`
	};
	return { style: {
		width: MODAL_WIDTH,
		height: "auto"
	} };
};

//#endregion
//#region src/react/ui/modals/_internal/components/switchChainErrorModal/store.ts
const initialContext = {
	isOpen: false,
	chainIdToSwitchTo: void 0,
	isSwitching: false
};
const switchChainErrorModalStore = createStore({
	context: initialContext,
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
const useIsOpen = () => useSelector(switchChainErrorModalStore, (state) => state.context.isOpen);
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
	const isOpen = useIsOpen();
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
export { MODAL_OVERLAY_PROPS as a, MODAL_CONTENT_PROPS as i, useSwitchChainErrorModal as n, useChainIdToSwitchTo as r, switchChainErrorModal_default as t };
//# sourceMappingURL=switchChainErrorModal.js.map