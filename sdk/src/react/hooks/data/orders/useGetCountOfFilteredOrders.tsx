'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../../_internal';
import {
	type FetchGetCountOfFilteredOrdersParams,
	type GetCountOfFilteredOrdersQueryOptions,
	getCountOfFilteredOrdersQueryOptions,
} from '../../../queries/orders/getCountOfFilteredOrders';
import { useConfig } from '../../config/useConfig';

export type UseGetCountOfFilteredOrdersParams = Optional<
	GetCountOfFilteredOrdersQueryOptions,
	'config'
>;

export function useGetCountOfFilteredOrders(
	params: UseGetCountOfFilteredOrdersParams,
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
