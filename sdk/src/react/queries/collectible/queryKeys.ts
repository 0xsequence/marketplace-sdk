import { serializeBigInts } from '../../_internal/utils';

/**
 * Creates a type-safe query key for collectible domain with automatic bigint serialization
 *
 * @param operation - The specific operation (e.g., 'balance', 'metadata')
 * @param params - The query parameters (will be automatically serialized)
 * @returns A serialized query key safe for React Query
 */
export function createCollectibleQueryKey<T>(operation: string, params: T) {
	return ['collectible', operation, serializeBigInts(params)] as const;
}
