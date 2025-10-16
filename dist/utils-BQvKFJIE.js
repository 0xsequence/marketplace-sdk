import { MarketplaceKind$1 as MarketplaceKind } from "./marketplace.gen-D_dVD9lc.js";
import { AlienSwapLogo, BlurLogo, LooksRareLogo, MagicEdenLogo, MintifyLogo, OpenSeaLogo, SequenceLogo, X2y2Logo } from "./marketplace-logos-Csv2MBwf.js";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as dn from "dnum";
import { formatUnits } from "viem";

//#region src/utils/address.ts
const truncateMiddle = (address, minPrefix = 20, minSuffix = 3) => {
	if (minPrefix + minSuffix >= 40) return address;
	return `${address.substring(0, 2 + minPrefix)}…${address.substring(address.length - minSuffix)}`;
};
const truncateEnd = (text, truncateAt) => {
	if (!text) return "";
	let finalText = text;
	if (text.length >= truncateAt) finalText = `${text.slice(0, truncateAt)}...`;
	return finalText;
};
const compareAddress = (a = "", b = "") => {
	return a.toLowerCase() === b.toLowerCase();
};

//#endregion
//#region src/utils/cn.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}

//#endregion
//#region src/utils/getMarketplaceDetails.ts
const MARKETPLACES = {
	sequence: {
		logo: SequenceLogo,
		displayName: "Sequence"
	},
	opensea: {
		logo: OpenSeaLogo,
		displayName: "OpenSea"
	},
	magiceden: {
		logo: MagicEdenLogo,
		displayName: "Magic Eden"
	},
	mintify: {
		logo: MintifyLogo,
		displayName: "Mintify"
	},
	looksrare: {
		logo: LooksRareLogo,
		displayName: "Looks Rare"
	},
	x2y2: {
		logo: X2y2Logo,
		displayName: "X2Y2"
	},
	blur: {
		logo: BlurLogo,
		displayName: "Blur"
	},
	alienswap: {
		logo: AlienSwapLogo,
		displayName: "AlienSwap"
	}
};
const KIND_TO_MARKETPLACE = {
	[MarketplaceKind.sequence_marketplace_v1]: "sequence",
	[MarketplaceKind.sequence_marketplace_v2]: "sequence",
	[MarketplaceKind.opensea]: "opensea",
	[MarketplaceKind.mintify]: "mintify",
	[MarketplaceKind.looks_rare]: "looksrare",
	[MarketplaceKind.x2y2]: "x2y2",
	[MarketplaceKind.blur]: "blur",
	[MarketplaceKind.magic_eden]: "magiceden"
};
function getMarketplaceDetails({ originName, kind }) {
	if (kind === MarketplaceKind.sequence_marketplace_v1 || kind === MarketplaceKind.sequence_marketplace_v2) return MARKETPLACES.sequence;
	let name = originName.toLowerCase();
	try {
		new URL(name);
		name = getRootDomain(name) || name;
	} catch {}
	name = name.replace(/ /g, "");
	const details = MARKETPLACES[name];
	if (details) return details;
	if (KIND_TO_MARKETPLACE[kind]) return MARKETPLACES[KIND_TO_MARKETPLACE[kind]];
}
function getRootDomain(url) {
	const domain = url.replace(/^(https?:\/\/)?(www\.)?/, "");
	const parts = domain.split(".");
	return parts[parts.length - 2] || parts[0];
}

//#endregion
//#region src/utils/price.ts
/**
* Calculates the percentage difference between two prices
* @param args - Object containing input price, base price, and decimals
* @returns The percentage difference as a string with 2 decimal places
* @example
* ```ts
* const diff = calculatePriceDifferencePercentage({
*   inputPriceRaw: 1000000n,
*   basePriceRaw: 900000n,
*   decimals: 6
* }); // Returns "11.11"
* ```
*/
const calculatePriceDifferencePercentage = ({ inputPriceRaw, basePriceRaw, decimals }) => {
	const inputPrice = Number(formatUnits(inputPriceRaw, decimals));
	const basePrice = Number(formatUnits(basePriceRaw, decimals));
	const difference = inputPrice - basePrice;
	const percentageDifference = difference / basePrice * 100;
	return percentageDifference.toFixed(2);
};
/**
* Formats a raw price amount with the specified number of decimal places
* @param amount - The raw price amount as a bigint
* @param decimals - Number of decimal places to format to
* @returns Formatted price string with proper decimal and thousands separators
* @example
* ```ts
* const formatted = formatPrice(1000000n, 6); // Returns "1.000000"
* ```
*/
const formatPrice = (amount, decimals) => {
	const formattedUnits = Number(formatUnits(amount, decimals));
	return formattedUnits.toLocaleString("en-US", {
		minimumFractionDigits: 0,
		maximumFractionDigits: decimals
	});
};
/**
* Calculates the final earnings amount after applying multiple fee percentages
* @param amount - The raw amount as a bigint (e.g., from a blockchain transaction)
* @param decimals - The number of decimal places for the currency (e.g., 18 for ETH, 6 for USDC)
* @param fees - Array of fee percentages to apply (e.g., [2.5, 1.0] for 2.5% and 1% fees)
* @returns Formatted string representing the final earnings after all fees are applied
* @throws Will return '0' if there's an error in calculation
* @example
* ```ts
* const earnings = calculateEarningsAfterFees(
*   1000000000000000000n, // 1 ETH
*   18,                   // ETH decimals
*   [2.5, 1.0]           // 2.5% and 1% fees
* ); // Returns "0.96525" (1 ETH after 2.5% and 1% fees)
* ```
*/
const calculateEarningsAfterFees = (amount, decimals, fees) => {
	try {
		const decimalAmount = Number(formatUnits(amount, decimals));
		let earnings = dn.from(decimalAmount.toString(), decimals);
		for (const fee of fees) if (fee > 0) {
			const feeMultiplier = dn.from((1 - fee / 100).toString(), decimals);
			earnings = dn.multiply(earnings, feeMultiplier);
		}
		return dn.format(earnings, {
			digits: decimals,
			trailingZeros: false,
			locale: "en-US"
		});
	} catch (error) {
		console.error("Error calculating earnings after fees:", error);
		return "0";
	}
};
/**
* Formats a price amount with fee applied
* @param amount - The raw price amount as a bigint
* @param decimals - Number of decimal places for the currency
* @param feePercentage - Fee percentage to apply (e.g., 3.5 for 3.5%)
* @returns Formatted price string with fee applied and proper decimal/thousands separators
* @example
* ```ts
* const priceWithFee = formatPriceWithFee(1000000n, 6, 3.5); // Returns "1.035"
* ```
*/
const formatPriceWithFee = (amount, decimals, feePercentage) => {
	try {
		const decimalAmount = Number(formatUnits(amount, decimals));
		const price = dn.from(decimalAmount.toString(), decimals);
		const feeMultiplier = dn.from((1 + feePercentage / 100).toString(), decimals);
		const totalPrice = dn.multiply(price, feeMultiplier);
		return dn.format(totalPrice, {
			digits: decimals,
			trailingZeros: false,
			locale: "en-US"
		});
	} catch (error) {
		console.error("Error formatting price with fee:", error);
		return "0";
	}
};

//#endregion
export { calculateEarningsAfterFees, calculatePriceDifferencePercentage, cn, compareAddress, formatPrice, formatPriceWithFee, getMarketplaceDetails, truncateEnd, truncateMiddle };
//# sourceMappingURL=utils-BQvKFJIE.js.map