import type {
	GetCountOfFilteredOrdersRequest,
	OrderSide,
	OrdersFilter,
} from '@0xsequence/marketplace-api';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithRequired,
} from '../../_internal';

export interface FetchGetCountOfFilteredOrdersParams
	extends GetCountOfFilteredOrdersRequest {
	side: OrderSide;
	filter?: OrdersFilter;
}

export type GetCountOfFilteredOrdersQueryOptions =
	SdkQueryParams<FetchGetCountOfFilteredOrdersParams>;

export async function fetchGetCountOfFilteredOrders(
	params: WithRequired<
		GetCountOfFilteredOrdersQueryOptions,
		'chainId' | 'collectionAddress' | 'side' | 'config'
	>,
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
