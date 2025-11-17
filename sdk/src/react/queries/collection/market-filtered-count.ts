import type {
	Address,
	GetCountOfFilteredOrdersRequest,
	OrderSide,
	OrdersFilter,
} from '@0xsequence/marketplace-api';
import type { SdkConfig } from '../../../types';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type WithOptionalParams,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchGetCountOfFilteredOrdersParams {
	chainId: number;
	collectionAddress: Address;
	config: SdkConfig;
	side: OrderSide;
	filter?: OrdersFilter;
	query?: StandardQueryOptions;
}

export async function fetchGetCountOfFilteredOrders(
	params: FetchGetCountOfFilteredOrdersParams,
) {
	const { chainId, collectionAddress, config, side, filter } = params;

	const client = getMarketplaceClient(config);

	const apiArgs: GetCountOfFilteredOrdersRequest = {
		chainId,
		collectionAddress,
		side,
		filter,
	};

	const result = await client.getCountOfFilteredOrders(apiArgs);
	return result.count;
}

export type GetCountOfFilteredOrdersQueryOptions =
	WithOptionalParams<FetchGetCountOfFilteredOrdersParams>;

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
	return buildQueryOptions(
		{
			getQueryKey: getCountOfFilteredOrdersQueryKey,
			requiredParams: [
				'chainId',
				'collectionAddress',
				'config',
				'side',
			] as const,
			fetcher: fetchGetCountOfFilteredOrders,
		},
		params,
	);
}
