'use client'

import { Button, ExternalLinkIcon, Image, Modal, Text } from "@0xsequence/design-system";
import { jsx, jsxs } from "react/jsx-runtime";
import { createStore } from "@xstate/store";
import { useSelector } from "@xstate/store/react";

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
export { useSuccessfulPurchaseModal as n, SuccessfulPurchaseModal_default as t };
//# sourceMappingURL=SuccessfulPurchaseModal.js.map