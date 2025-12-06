'use client'

import { c as cn$1 } from "./utils.js";
import { useEffect, useState } from "react";
import { AddIcon, Field, FieldLabel, IconButton, NumericInput, SubtractIcon } from "@0xsequence/design-system";
import { jsx, jsxs } from "react/jsx-runtime";
import * as dn from "dnum";

//#region src/react/ui/modals/_internal/components/quantityInput/index.tsx
function QuantityInput({ quantity, invalidQuantity, onQuantityChange, onInvalidQuantityChange, decimals = 0, maxQuantity, className, disabled }) {
	const dnMaxQuantity = dn.from(maxQuantity, decimals);
	const minIncrement = decimals > 0 ? `0.${"1".padStart(decimals, "0")}` : "1";
	const dnIncrement = dn.from(minIncrement, decimals);
	const min = decimals > 0 ? minIncrement : "1";
	const dnMin = dn.from(min, decimals);
	const dnQuantityInitial = dn.from(quantity, decimals);
	const [dnQuantity, setDnQuantity] = useState(dnQuantityInitial);
	const [localQuantity, setLocalQuantity] = useState(dn.toString(dnQuantityInitial, decimals));
	useEffect(() => {
		const dnInitialQuantity = dn.from(quantity, decimals);
		const dnMaxQuantity$1 = dn.from(maxQuantity, decimals);
		if (dn.greaterThan(dnInitialQuantity, dnMaxQuantity$1)) {
			setLocalQuantity(dn.toString(dnMaxQuantity$1, decimals));
			setDnQuantity(dnMaxQuantity$1);
			onQuantityChange(dnMaxQuantity$1[0]);
			onInvalidQuantityChange(false);
		} else {
			setLocalQuantity(dn.toString(dnInitialQuantity, decimals));
			setDnQuantity(dnInitialQuantity);
		}
	}, [
		quantity,
		decimals,
		maxQuantity,
		onQuantityChange,
		onInvalidQuantityChange
	]);
	const setValidQuantity = (value) => {
		setLocalQuantity(dn.toString(value, decimals));
		setDnQuantity(value);
		onQuantityChange(value[0]);
		onInvalidQuantityChange(false);
	};
	function handleChangeQuantity(value) {
		if (!value || Number.isNaN(Number(value)) || value.endsWith(".")) {
			setLocalQuantity(value);
			onInvalidQuantityChange(true);
			return;
		}
		const dnValue = dn.from(value, decimals);
		const isBiggerThanMax = dn.greaterThan(dnValue, dnMaxQuantity);
		if (dn.lessThan(dnValue, dnMin)) {
			setLocalQuantity(value);
			onInvalidQuantityChange(true);
			return;
		}
		if (isBiggerThanMax) {
			setValidQuantity(dnMaxQuantity);
			return;
		}
		setValidQuantity(dnValue);
	}
	function handleIncrement() {
		const newValue = dn.add(dnQuantity, dnIncrement);
		if (dn.greaterThanOrEqual(newValue, dnMaxQuantity)) setValidQuantity(dnMaxQuantity);
		else setValidQuantity(newValue);
	}
	function handleDecrement() {
		const newValue = dn.subtract(dnQuantity, dnIncrement);
		if (dn.lessThanOrEqual(newValue, dnMin)) setValidQuantity(dnMin);
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
			decimals: decimals || 0,
			controls: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1",
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
		})] }), invalidQuantity && /* @__PURE__ */ jsx("div", {
			className: "mt-1.5 font-medium text-amber-500 text-xs",
			children: "Invalid quantity"
		})]
	});
}

//#endregion
export { QuantityInput as t };
//# sourceMappingURL=quantityInput.js.map