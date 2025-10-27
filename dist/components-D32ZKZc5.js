import { s as ContractType } from "./marketplace.gen-_O21M9RA.js";
import { l as compareAddress } from "./utils-CzQhlK_U.js";
import { t as BellIcon_default } from "./BellIcon-GOMYh8MW.js";
import { i as formatPriceNumber, t as getSupplyStatusText } from "./utils-CVsaUPqD.js";
import { useAccount } from "wagmi";
import { ChevronLeftIcon, ChevronRightIcon, IconButton, Image, Text, cn } from "@0xsequence/design-system";
import { jsx, jsxs } from "react/jsx-runtime";
import { formatUnits } from "viem";

//#region src/react/ui/components/marketplace-collectible-card/components/footer/components/FooterName.tsx
const FooterName = ({ name, isShop, highestOffer, onOfferClick, quantityInitial, quantityRemaining, balance }) => {
	const { address: currentUserAddress } = useAccount();
	const displayName = (() => {
		if (name.length > 15 && highestOffer && !isShop) return `${name.substring(0, 13)}...`;
		if (name.length > 17 && !highestOffer && !isShop) return `${name.substring(0, 17)}...`;
		if (name.length > 17) return `${name.substring(0, 17)}...`;
		return name;
	})();
	return /* @__PURE__ */ jsxs("div", {
		className: "relative flex w-full items-center justify-between",
		children: [/* @__PURE__ */ jsx(Text, {
			className: cn("overflow-hidden text-ellipsis text-left font-body font-bold text-sm text-text-100", isShop && (quantityInitial === void 0 || quantityRemaining === void 0) && "text-text-50"),
			children: displayName || "Untitled"
		}), highestOffer && onOfferClick && !isShop && (() => {
			const canAcceptOffer = !(currentUserAddress && highestOffer.createdBy && compareAddress(highestOffer.createdBy, currentUserAddress)) && balance && Number(balance) > 0;
			return /* @__PURE__ */ jsx(IconButton, {
				className: `absolute top-0 right-0 z-10 h-[22px] w-[22px] ${!canAcceptOffer ? "opacity-50 hover:animate-none hover:opacity-50" : "hover:animate-bell-ring"}`,
				size: "xs",
				variant: "primary",
				onClick: (e) => {
					if (!canAcceptOffer) return;
					e.stopPropagation();
					e.preventDefault();
					onOfferClick?.(e);
				},
				onMouseEnter: (e) => {
					if (canAcceptOffer) e.stopPropagation();
				},
				icon: (props) => /* @__PURE__ */ jsx(BellIcon_default, {
					...props,
					size: "xs"
				})
			});
		})()]
	});
};

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/components/footer/components/PriceDisplay.tsx
const formatPrice = (amount, currency) => {
	const { formattedNumber, isUnderflow, isOverflow } = formatPriceNumber(amount, currency.decimals);
	if (amount === "0") return /* @__PURE__ */ jsx(Text, {
		className: "font-bold text-sm text-text-100",
		children: "Free"
	});
	if (isUnderflow) return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center",
		children: [/* @__PURE__ */ jsx(ChevronLeftIcon, { className: "h-3 w-3 text-text-100" }), /* @__PURE__ */ jsx(Text, {
			className: "font-bold text-sm text-text-100",
			children: `${formattedNumber} ${currency.symbol}`
		})]
	});
	if (isOverflow) return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center",
		children: [/* @__PURE__ */ jsx(ChevronRightIcon, { className: "h-3 w-3 text-text-100" }), /* @__PURE__ */ jsx(Text, {
			className: "font-bold text-sm text-text-100",
			children: `${formattedNumber} ${currency.symbol}`
		})]
	});
	return /* @__PURE__ */ jsxs(Text, {
		className: "font-bold text-sm text-text-100",
		children: [
			formattedNumber,
			" ",
			currency.symbol
		]
	});
};
const PriceDisplay = ({ amount, currency, showCurrencyIcon = true, className }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: cn("flex items-center gap-1", className),
		children: [showCurrencyIcon && currency.imageUrl && /* @__PURE__ */ jsx(Image, {
			alt: currency.symbol,
			className: "h-3 w-3",
			src: currency.imageUrl,
			onError: (e) => {
				e.currentTarget.style.display = "none";
			}
		}), formatPrice(amount, currency)]
	});
};

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/components/footer/components/SaleDetailsPill.tsx
const SaleDetailsPill = ({ quantityRemaining, collectionType, unlimitedSupply }) => {
	return /* @__PURE__ */ jsx(Text, {
		className: "rounded-lg bg-background-secondary px-2 py-1 text-left font-medium text-text-80 text-xs",
		children: getSupplyStatusText({
			quantityRemaining,
			collectionType,
			unlimitedSupply
		})
	});
};

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/components/footer/components/TokenTypeBalancePill.tsx
const TokenTypeBalancePill = ({ balance, type, decimals }) => {
	return /* @__PURE__ */ jsx(Text, {
		className: "rounded-lg bg-background-secondary px-2 py-1 text-left font-medium text-text-80 text-xs",
		children: type === ContractType.ERC1155 ? balance ? `Owned: ${formatUnits(BigInt(balance), decimals ?? 0)}` : "ERC-1155" : "ERC-721"
	});
};

//#endregion
export { FooterName as a, formatPrice as i, SaleDetailsPill as n, PriceDisplay as r, TokenTypeBalancePill as t };
//# sourceMappingURL=components-D32ZKZc5.js.map