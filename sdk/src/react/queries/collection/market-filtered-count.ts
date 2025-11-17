import type {
	GetCountOfFilteredOrdersRequest,
	OrderSide,
	OrdersFilter,
} from '@0xsequence/marketplace-api';
import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import { getMarketplaceClient, type ValuesOptional } from '../../_internal';

import type { StandardQueryOptions } from '../../types/query';

export interface FetchGetCountOfFilteredOrdersParams {
	chainId: number;
	config: SdkConfig;
	side: OrderSide;
	filter?: OrdersFilter;
}

export async function fetchGetCountOfFilteredOrders(
	params: FetchGetCountOfFilteredOrdersParams,
) {
	const { chainId, config, side, filter } = params;

	const client = getMarketplaceClient(config);

	const apiArgs: GetCountOfFilteredOrdersRequest = {
		chainId,
		side,
		filter,
	};

	const result = await client.getCountOfFilteredOrders(apiArgs);
	return result.count;
}

export type GetCountOfFilteredOrdersQueryOptions =
	ValuesOptional<FetchGetCountOfFilteredOrdersParams> & {
		query?: StandardQueryOptions;
	};

export function getCountOfFilteredOrdersQueryKey(
	params: GetCountOfFilteredOrdersQueryOptions,
) {
	return [
		'collection',
		'market-filtered-count',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
			side: params.side,
			filter: params.filter,
		},
	] as const;
}

export function getCountOfFilteredOrdersQueryOptions(
	params: GetCountOfFilteredOrdersQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.config &&
			params.side &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getCountOfFilteredOrdersQueryKey(params),
		queryFn: () =>
			fetchGetCountOfFilteredOrders({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				side: params.side!,
				filter: params.filter,
			}),
		...params.query,
		enabled,
	});
}
