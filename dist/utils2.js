import { n as getIndexerClient } from "./api.js";
import { TransactionReceiptNotFoundError } from "viem";

//#region src/react/utils/normalize-attributes.ts
function isValidAttributePair(candidate) {
	return (typeof candidate.name === "string" || typeof candidate.trait_type === "string") && (typeof candidate.value === "string" || typeof candidate.value === "number") && (candidate.display_type === void 0 || candidate.display_type === null || typeof candidate.display_type === "string");
}
/**
* Processes token metadata attributes into a standardized format
* Handles both array-based attributes (OpenSea standard) and object-based attributes
* @param attributes - Token attributes from metadata
* @returns Object with standardized attributes containing name, value, and optional display_type
*/
function processAttributes(attributes) {
	if (Array.isArray(attributes)) return Object.fromEntries(attributes.filter((attr) => attr !== null && typeof attr === "object").filter(isValidAttributePair).map((attr) => {
		const name = "name" in attr ? attr.name : attr.trait_type;
		return [name, {
			name,
			value: String(attr.value),
			display_type: attr.display_type
		}];
	}));
	if (attributes && typeof attributes === "object") return Object.fromEntries(Object.entries(attributes).map(([key, value]) => [key, {
		name: key,
		value: typeof value === "object" && value !== null ? JSON.stringify(value) : String(value),
		display_type: void 0
	}]));
	return {};
}

//#endregion
//#region src/react/utils/normalize-properties.ts
/**
* Processes token metadata properties into a standardized format
* @param properties - Token properties from metadata
* @returns Object with standardized properties containing name and value
*/
function processProperties(properties) {
	if (!properties || typeof properties !== "object" || Array.isArray(properties) || Object.keys(properties).length === 0) return {};
	return Object.fromEntries(Object.entries(properties).map(([key, value]) => [key, {
		name: key,
		value: typeof value === "object" && value !== null ? (() => {
			const nestedValue = value.value;
			if (nestedValue !== void 0) {
				if (typeof nestedValue === "object" && nestedValue !== null) return JSON.stringify(nestedValue);
				if (typeof nestedValue === "string" || typeof nestedValue === "number" || typeof nestedValue === "boolean") return String(nestedValue);
				return JSON.stringify(nestedValue);
			}
			return JSON.stringify(value);
		})() : value !== null && value !== void 0 ? String(value) : ""
	}]));
}

//#endregion
//#region src/react/utils/waitForTransactionReceipt.ts
const MAX_RETRIES = 3;
const MAX_BLOCK_WAIT = 30;
const waitForTransactionReceipt = async ({ txHash, chainId, sdkConfig, maxBlockWait = MAX_BLOCK_WAIT }) => {
	const indexer = getIndexerClient(chainId, sdkConfig);
	let retries = 0;
	while (retries < MAX_RETRIES) try {
		return (await indexer.fetchTransactionReceipt({
			txnHash: txHash,
			maxBlockWait
		})).receipt;
	} catch (error) {
		retries++;
		console.error(`Failed to fetch transaction receipt (attempt ${retries}/${MAX_RETRIES}):`, error);
		if (retries >= MAX_RETRIES) throw TransactionReceiptNotFoundError;
	}
	throw TransactionReceiptNotFoundError;
};

//#endregion
export { processProperties as n, processAttributes as r, waitForTransactionReceipt as t };
//# sourceMappingURL=utils2.js.map