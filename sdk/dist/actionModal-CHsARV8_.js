import { MODAL_CONTENT_PROPS, MODAL_OVERLAY_PROPS, useSwitchChainModal, useWallet } from "./hooks-BrYPaFP7.js";
import { Button, Modal, Spinner, Text } from "@0xsequence/design-system";
import { jsx, jsxs } from "react/jsx-runtime";
import { createStore } from "@xstate/store";
import { useSelector } from "@xstate/store/react";

//#region src/react/ui/modals/_internal/components/actionModal/ActionModal.tsx
const ActionModal = ({ isOpen, onClose, title, children, ctas, chainId, disableAnimation, modalLoading, spinnerContainerClassname, hideCtas }) => {
	const { show: showSwitchChainModal } = useSwitchChainModal();
	const { wallet, isLoading, isError } = useWallet();
	const checkChain = async ({ onSuccess }) => {
		const walletChainId = await wallet?.getChainId();
		const chainMismatch = walletChainId !== Number(chainId);
		if (chainMismatch) showSwitchChainModal({
			chainIdToSwitchTo: chainId,
			onSuccess
		});
		else onSuccess();
	};
	if (wallet?.isWaaS) wallet.switchChain(Number(chainId));
	if (!isOpen || !chainId) return null;
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
				modalLoading || isLoading || isError ? /* @__PURE__ */ jsxs("div", {
					className: `flex ${spinnerContainerClassname} w-full items-center justify-center`,
					"data-testid": "error-loading-wrapper",
					children: [isError && /* @__PURE__ */ jsx(Text, {
						"data-testid": "error-loading-text",
						className: "text-center font-body text-error100 text-small",
						children: "Error loading modal"
					}), (isLoading || modalLoading) && /* @__PURE__ */ jsx("div", {
						"data-testid": "spinner",
						children: /* @__PURE__ */ jsx(Spinner, { size: "lg" })
					})]
				}) : children,
				!hideCtas && !isLoading && !isError && /* @__PURE__ */ jsx("div", {
					className: "flex w-full flex-col gap-2",
					children: ctas.map((cta) => !cta.hidden && /* @__PURE__ */ jsx(Button, {
						className: "w-full rounded-[12px] [&>div]:justify-center",
						onClick: async () => {
							await checkChain({ onSuccess: () => {
								cta.onClick();
							} });
						},
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
//#region src/react/ui/modals/_internal/components/actionModal/store.ts
const initialContext = {
	isOpen: false,
	chainId: null,
	collectionAddress: null
};
const actionModalStore = createStore({
	context: initialContext,
	on: {
		open: (context, event) => ({
			...context,
			isOpen: true,
			chainId: event.chainId,
			collectionAddress: event.collectionAddress
		}),
		close: (context) => ({
			...context,
			isOpen: false,
			chainId: null,
			collectionAddress: null
		})
	}
});
const useActionModalState = () => useSelector(actionModalStore, (state) => state.context);
const useIsActionModalOpen = () => useSelector(actionModalStore, (state) => state.context.isOpen);
const useActionModalChainId = () => useSelector(actionModalStore, (state) => state.context.chainId);
const useActionModalCollectionAddress = () => useSelector(actionModalStore, (state) => state.context.collectionAddress);
function openModal(chainId, collectionAddress) {
	actionModalStore.send({
		type: "open",
		chainId,
		collectionAddress
	});
}
function closeModal() {
	actionModalStore.send({ type: "close" });
}

//#endregion
export { ActionModal, actionModalStore, closeModal, openModal, useActionModalChainId, useActionModalCollectionAddress, useActionModalState, useIsActionModalOpen };
//# sourceMappingURL=actionModal-CHsARV8_.js.map