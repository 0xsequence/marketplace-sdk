import { InfoIcon, Text, WarningIcon } from "@0xsequence/design-system";
import { jsx, jsxs } from "react/jsx-runtime";

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
			type === "info" && /* @__PURE__ */ jsx(InfoIcon, {
				size: "sm",
				color: "white"
			})
		]
	});
}

//#endregion
export { AlertMessage as t };
//# sourceMappingURL=alertMessage.js.map