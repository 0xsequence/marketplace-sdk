'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../_internal';
import {
	type FetchListCollectionsParams,
	type ListCollectionsQueryOptions,
	listCollectionsQueryOptions,
} from '../queries/listCollections';
import { useConfig } from './useConfig';
import { useMarketplaceConfig } from './useMarketplaceConfig';

export type UseListCollectionsParams = Optional<
	ListCollectionsQueryOptions,
	'config' | 'marketplaceConfig'
>;

/**
 * Hook to fetch collections from marketplace configuration
 *
 * Retrieves all collections configured in the marketplace, with optional filtering
 * by marketplace type. Combines metadata from the metadata API with marketplace
 * configuration to provide complete collection information.
 *
 * @param params - Configuration parameters
 * @param params.marketplaceType - Optional filter by marketplace type
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing array of collections with metadata
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: collections, isLoading } = useListCollections();
 *
 * if (isLoading) return <div>Loading collections...</div>;
 *
 * return (
 *   <div>
 *     {collections?.map(collection => (
 *       <div key={collection.itemsAddress}>
 *         {collection.name}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 *
 * @example
 * Filtering by marketplace type:
 * ```typescript
 * const { data: marketCollections } = useListCollections({
 *   marketplaceType: 'market'
 * });
 * ```
 */
export function useListCollections(params: UseListCollectionsParams = {}) {
	const defaultConfig = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();

	const {
		config = defaultConfig,
		marketplaceConfig: paramMarketplaceConfig,
		...rest
	} = params;

	const queryOptions = listCollectionsQueryOptions({
		config,
		marketplaceConfig: paramMarketplaceConfig || marketplaceConfig,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { listCollectionsQueryOptions };

export type { FetchListCollectionsParams, ListCollectionsQueryOptions };
