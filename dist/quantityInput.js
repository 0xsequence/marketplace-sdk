'use client'

import { l as cn$1 } from "./utils.js";
import { useState } from "react";
import { AddIcon, Field, FieldLabel, IconButton, NumericInput, SubtractIcon } from "@0xsequence/design-system";
import { jsx, jsxs } from "react/jsx-runtime";

//#region src/react/ui/modals/_internal/components/quantityInput/index.tsx
const MIN_QUANTITY = 1n;
function QuantityInput({ quantity, invalidQuantity, onQuantityChange, onInvalidQuantityChange, maxQuantity, className, disabled }) {
	const maxBelowMin = maxQuantity < MIN_QUANTITY;
	const [draftQuantity, setDraftQuantity] = useState(null);
	const displayQuantity = draftQuantity ?? quantity.toString();
	const setValidQuantity = (value) => {
		setDraftQuantity(null);
		onQuantityChange(value);
		onInvalidQuantityChange(false);
	};
	function handleChangeQuantity(value) {
		if (maxBelowMin) {
			setDraftQuantity(value);
			onInvalidQuantityChange(true);
			return;
		}
		let nextQuantity;
		try {
			nextQuantity = BigInt(value);
		} catch {
			setDraftQuantity(value);
			onInvalidQuantityChange(true);
			return;
		}
		if (nextQuantity < MIN_QUANTITY) {
			setDraftQuantity(value);
			onInvalidQuantityChange(true);
			return;
		}
		if (nextQuantity > maxQuantity) {
			setValidQuantity(maxQuantity);
			return;
		}
		setValidQuantity(nextQuantity);
	}
	function handleIncrement() {
		if (maxBelowMin) return;
		const newValue = quantity + 1n;
		if (newValue >= maxQuantity) setValidQuantity(maxQuantity);
		else setValidQuantity(newValue);
	}
	function handleDecrement() {
		if (maxBelowMin) return;
		const newValue = quantity - 1n;
		if (newValue <= MIN_QUANTITY) setValidQuantity(MIN_QUANTITY);
		else setValidQuantity(newValue);
	}
	return /* @__PURE__ */ jsxs("div", {
		className: cn$1("flex w-full flex-col", className, disabled && "pointer-events-none opacity-50"),
		children: [/* @__PURE__ */ jsxs(Field, { children: [/* @__PURE__ */ jsx(FieldLabel, {
			htmlFor: "quantity",
			className: "text-xs",
			children: "Enter quantity"
		}), /* @__PURE__ */ jsx(NumericInput, {
			"aria-label": "Enter quantity",
			className: "h-9 w-full rounded pr-0 [&>div]:pr-2 [&>input]:text-xs",
			name: "quantity",
			decimals: 0,
			controls: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ jsx(IconButton, {
					disabled: maxBelowMin || quantity <= MIN_QUANTITY,
					onClick: handleDecrement,
					size: "xs",
					icon: SubtractIcon
				}), /* @__PURE__ */ jsx(IconButton, {
					disabled: maxBelowMin || quantity >= maxQuantity,
					onClick: handleIncrement,
					size: "xs",
					icon: AddIcon
				})]
			}),
			value: displayQuantity,
			onChange: (e) => handleChangeQuantity(e.target.value),
			width: "full"
		})] }), invalidQuantity && maxQuantity > 0n && /* @__PURE__ */ jsx("div", {
			className: "mt-1.5 font-medium text-amber-500 text-xs",
			children: "Invalid quantity"
		})]
	});
}

//#endregion
export { QuantityInput as t };
//# sourceMappingURL=quantityInput.js.map