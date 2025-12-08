import type {
	GetCountOfAllOrdersRequest,
	OrderSide,
} from '@0xsequence/api-client';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';

export interface FetchCountItemsOrdersForCollectionParams
	extends GetCountOfAllOrdersRequest {
	side: OrderSide;
}

export type CountItemsOrdersForCollectionQueryOptions =
	SdkQueryParams<FetchCountItemsOrdersForCollectionParams>;

/**
 * Fetches count of orders for a collection from the marketplace API
 */
export async function fetchCountItemsOrdersForCollection(
	params: WithRequired<
		CountItemsOrdersForCollectionQueryOptions,
		'chainId' | 'collectionAddress' | 'side' | 'config'
	>,
) {
	const { config, ...apiParams } = params;
	const client = getMarketplaceClient(config);
	const result = await client.getCountOfAllOrders(apiParams);
	return result.count;
}

export function getCountItemsOrdersForCollectionQueryKey(
	params: CountItemsOrdersForCollectionQueryOptions,
) {
	return [
		'collection',
		'market-items-count',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
			side: params.side,
		},
	] as const;
}

export function countItemsOrdersForCollectionQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			CountItemsOrdersForCollectionQueryOptions,
			'chainId' | 'collectionAddress' | 'side' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getCountItemsOrdersForCollectionQueryKey,
			requiredParams: [
				'chainId',
				'collectionAddress',
				'config',
				'side',
			] as const,
			fetcher: fetchCountItemsOrdersForCollection,
		},
		params,
	);
}
