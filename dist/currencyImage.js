'use client'

import { useState } from "react";
import { TokenImage } from "@0xsequence/design-system";
import { jsx } from "react/jsx-runtime";

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
export { currencyImage_default as t };
//# sourceMappingURL=currencyImage.js.map