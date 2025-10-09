'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { Optional } from '../../../_internal';
import {
	type InventoryQueryOptions,
	indexerQueryOptions,
	inventoryQueryOptions,
} from '../../../queries/inventory';
import { useConfig } from '../../config/useConfig';

export type UseInventoryArgs = Optional<InventoryQueryOptions, 'config'>;

export function useInventory(params: UseInventoryArgs) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = params;

	const fullParams = {
		config,
		...rest,
	};

	const indexerQuery = useQuery(indexerQueryOptions(fullParams));

	const inventoryQuery = useInfiniteQuery(
		inventoryQueryOptions(fullParams, indexerQuery.data),
	);

	return {
		...inventoryQuery,
		isLoading: indexerQuery.isLoading || inventoryQuery.isLoading,
		isError: indexerQuery.isError || inventoryQuery.isError,
		error: indexerQuery.error || inventoryQuery.error,
		status: indexerQuery.isError ? 'error' : inventoryQuery.status,
	};
}

export type { InventoryQueryOptions };
