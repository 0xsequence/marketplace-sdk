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
 * Hook to fetch a list of collections from the marketplace
 *
 * This hook fetches collections from the marketplace configuration and enriches them with
 * metadata from the metadata API. Collections can be filtered by marketplace type (market/shop).
 *
 * @param params - Configuration parameters
 * @param params.marketplaceType - Optional filter for marketplace type ('market' or 'shop')
 * @param params.marketplaceConfig - Optional marketplace configuration (defaults from context)
 * @param params.config - Optional SDK configuration (defaults from context)
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing an array of collections with metadata
 *
 * @example
 * Basic usage - fetch all collections:
 * ```typescript
 * const { data: collections, isLoading } = useListCollections()
 * ```
 *
 * @example
 * Filter by marketplace type:
 * ```typescript
 * const { data: marketCollections } = useListCollections({
 *   marketplaceType: 'market'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data: collections } = useListCollections({
 *   query: {
 *     enabled: isReady,
 *     staleTime: 5 * 60 * 1000 // 5 minutes
 *   }
 * })
 * ```
 */
export function useListCollections(params: UseListCollectionsParams = {}) {
	const defaultConfig = useConfig();
	const { data: defaultMarketplaceConfig } = useMarketplaceConfig();

	const {
		config = defaultConfig,
		marketplaceConfig = defaultMarketplaceConfig,
		...rest
	} = params;

	const queryOptions = listCollectionsQueryOptions({
		config,
		marketplaceConfig,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { listCollectionsQueryOptions };

export type { FetchListCollectionsParams, ListCollectionsQueryOptions };
