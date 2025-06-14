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
 * Hook to fetch collections from the marketplace with metadata
 *
 * Retrieves collections from the marketplace configuration and enriches them
 * with metadata from the metadata API. Supports filtering by marketplace type.
 *
 * @param params - Configuration parameters
 * @param params.marketplaceType - Optional filter by marketplace type ('market' or 'shop')
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing collections with metadata
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useListCollections({})
 * ```
 *
 * @example
 * With marketplace type filter:
 * ```typescript
 * const { data, isLoading } = useListCollections({
 *   marketplaceType: 'market'
 * })
 * ```
 */
export function useListCollections(params: UseListCollectionsParams = {}) {
	const defaultConfig = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();

	const { config = defaultConfig, ...rest } = params;

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
