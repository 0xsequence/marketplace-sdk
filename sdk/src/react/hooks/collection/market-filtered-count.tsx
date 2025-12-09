'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type FetchGetCountOfFilteredOrdersParams,
	type GetCountOfFilteredOrdersQueryOptions,
	getCountOfFilteredOrdersQueryOptions,
} from '../../queries/collection/market-filtered-count';
import { useConfig } from '../config/useConfig';

export type UseCollectionMarketFilteredCountParams = Optional<
	GetCountOfFilteredOrdersQueryOptions,
	'config'
>;

export function useCollectionMarketFilteredCount(
	params: UseCollectionMarketFilteredCountParams,
) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = getCountOfFilteredOrdersQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { getCountOfFilteredOrdersQueryOptions };

export type {
	FetchGetCountOfFilteredOrdersParams,
	GetCountOfFilteredOrdersQueryOptions,
};
