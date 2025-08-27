import { ContractType } from "./marketplace.gen-JzNYpM0U.js";
import { formatUnits } from "viem";

//#region src/react/ui/components/marketplace-collectible-card/utils/formatPrice.ts
const OVERFLOW_PRICE = 1e8;
const UNDERFLOW_PRICE = 1e-4;
const formatPriceNumber = (amount, decimals) => {
	const formattedPrice = formatUnits(BigInt(amount), decimals);
	const numericPrice = Number.parseFloat(formattedPrice);
	if (numericPrice < UNDERFLOW_PRICE) return {
		formattedNumber: UNDERFLOW_PRICE.toString(),
		isUnderflow: true,
		isOverflow: false
	};
	if (numericPrice > OVERFLOW_PRICE) return {
		formattedNumber: OVERFLOW_PRICE.toLocaleString("en-US", { maximumFractionDigits: 2 }),
		isUnderflow: false,
		isOverflow: true
	};
	const maxDecimals = numericPrice < .01 ? 6 : 4;
	return {
		formattedNumber: numericPrice.toLocaleString("en-US", {
			minimumFractionDigits: 0,
			maximumFractionDigits: maxDecimals
		}),
		isUnderflow: false,
		isOverflow: false
	};
};

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/utils/supplyStatus.ts
const getSupplyStatusText = ({ quantityRemaining, collectionType, unlimitedSupply }) => {
	if (unlimitedSupply) return "Unlimited Supply";
	if (collectionType === ContractType.ERC721 && quantityRemaining === void 0) return "Out of stock";
	if (collectionType === ContractType.ERC1155 && !unlimitedSupply && quantityRemaining === "0") return "Out of stock";
	if (quantityRemaining && Number(quantityRemaining) > 0) return `Supply: ${quantityRemaining}`;
	return "Out of stock";
};

//#endregion
export { OVERFLOW_PRICE, UNDERFLOW_PRICE, formatPriceNumber, getSupplyStatusText };
//# sourceMappingURL=utils-wquIhK6T.js.map