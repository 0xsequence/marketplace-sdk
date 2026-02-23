import { f as truncateMiddle } from "./utils.js";
import { networks } from "@0xsequence/network";
import { CheckmarkIcon, Spinner, Text } from "@0xsequence/design-system";
import { jsx, jsxs } from "react/jsx-runtime";

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
export { TransactionFooter as n, PositiveCircle as t };
//# sourceMappingURL=transaction-footer.js.map