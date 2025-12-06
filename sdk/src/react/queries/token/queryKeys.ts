import { serializeBigInts } from '../../_internal/utils';

/**
 * Creates a type-safe query key for token domain with automatic bigint serialization
 *
 * @param operation - The specific operation (e.g., 'balances', 'metadata', 'ranges')
 * @param params - The query parameters (will be automatically serialized)
 * @returns A serialized query key safe for React Query
 */
export function createTokenQueryKey<T>(operation: string, params: T) {
	return ['token', operation, serializeBigInts(params)] as const;
}
