export {
	type ApprovalStep,
	isSignatureStep,
	isTransactionStep,
	type SignatureStep,
	type TransactionStep,
} from '@0xsequence/api-client';

export const clamp = (val: number, min: number, max: number) =>
	Math.max(min, Math.min(max, val));

/**
 * Recursively converts all bigint values to strings in an object
 * This is needed for React Query keys which must be JSON-serializable
 */
export function serializeBigInts<T>(obj: T): T {
	if (obj === null || obj === undefined) return obj;

	if (typeof obj === 'bigint') {
		return obj.toString() as T;
	}

	if (Array.isArray(obj)) {
		return obj.map(serializeBigInts) as T;
	}

	if (typeof obj === 'object') {
		const result: any = {};
		for (const key in obj) {
			if (Object.hasOwn(obj, key)) {
				result[key] = serializeBigInts(obj[key]);
			}
		}
		return result as T;
	}

	return obj;
}
