import type {
	Address,
	GetCountOfAllOrdersRequest,
	OrderSide,
} from '@0xsequence/marketplace-api';
import type { SdkConfig } from '../../../types';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type WithOptionalParams,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchCountItemsOrdersForCollectionParams {
	chainId: number;
	collectionAddress: Address;
	config: SdkConfig;
	side: OrderSide;
	query?: StandardQueryOptions;
}

/**
 * Fetches count of orders for a collection from the marketplace API
 */
export async function fetchCountItemsOrdersForCollection(
	params: FetchCountItemsOrdersForCollectionParams,
) {
	const { chainId, collectionAddress, config, side } = params;

	const client = getMarketplaceClient(config);

	const apiArgs: GetCountOfAllOrdersRequest = {
		chainId,
		collectionAddress,
		side,
	};

	const result = await client.getCountOfAllOrders(apiArgs);
	return result.count;
}

export type CountItemsOrdersForCollectionQueryOptions =
	WithOptionalParams<FetchCountItemsOrdersForCollectionParams>;

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
	params: CountItemsOrdersForCollectionQueryOptions,
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
