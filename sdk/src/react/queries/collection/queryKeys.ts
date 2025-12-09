import { serializeBigInts } from '../../_internal/utils';

/**
 * Creates a type-safe query key for collection domain with automatic bigint serialization
 *
 * @param operation - The specific operation (e.g., 'balance-details', 'metadata')
 * @param params - The query parameters (will be automatically serialized)
 * @returns A serialized query key safe for React Query
 */
export function createCollectionQueryKey<T>(operation: string, params: T) {
	return ['collection', operation, serializeBigInts(params)] as const;
}
