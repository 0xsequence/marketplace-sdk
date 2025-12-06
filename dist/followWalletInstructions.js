import { t as AlertMessage } from "./alertMessage.js";
import { Button, Text } from "@0xsequence/design-system";
import { jsx, jsxs } from "react/jsx-runtime";
import { observer } from "@legendapp/state/react";

//#region src/react/ui/modals/TransferModal/messages.ts
const baseMessages = {
	enterReceiverAddress: "Items sent to the wrong wallet address can't be recovered!",
	followWalletInstructions: "Follow your wallet's instructions to submit a transaction to transfer your assets."
};
function getMessage(key) {
	return baseMessages[key];
}

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
export { getMessage as n, followWalletInstructions_default as t };
//# sourceMappingURL=followWalletInstructions.js.map