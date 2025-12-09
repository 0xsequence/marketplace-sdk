import { serializeBigInts } from '../../_internal/utils';

/**
 * Creates a type-safe query key for marketplace domain with automatic bigint serialization
 *
 * @param operation - The specific operation (e.g., 'config', 'filters')
 * @param params - The query parameters (will be automatically serialized)
 * @returns A serialized query key safe for React Query
 */
export function createMarketplaceQueryKey<T>(operation: string, params: T) {
	return ['marketplace', operation, serializeBigInts(params)] as const;
}
