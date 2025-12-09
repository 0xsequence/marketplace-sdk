import { isSignatureStep, isTransactionStep } from "@0xsequence/api-client";

//#region src/react/_internal/utils.ts
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
/**
* Recursively converts all bigint values to strings in an object
* This is needed for React Query keys which must be JSON-serializable
*/
function serializeBigInts(obj) {
	if (obj === null || obj === void 0) return obj;
	if (typeof obj === "bigint") return obj.toString();
	if (Array.isArray(obj)) return obj.map(serializeBigInts);
	if (typeof obj === "object") {
		const result = {};
		for (const key in obj) if (Object.hasOwn(obj, key)) result[key] = serializeBigInts(obj[key]);
		return result;
	}
	return obj;
}

//#endregion
export { serializeBigInts as i, isSignatureStep as n, isTransactionStep as r, clamp as t };
//# sourceMappingURL=utils2.js.map