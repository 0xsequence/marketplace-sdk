import { Image, Skeleton, Text } from "@0xsequence/design-system";
import { jsx, jsxs } from "react/jsx-runtime";
import { formatDistanceToNow } from "date-fns";

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
export { TransactionHeader as t };
//# sourceMappingURL=transactionHeader.js.map