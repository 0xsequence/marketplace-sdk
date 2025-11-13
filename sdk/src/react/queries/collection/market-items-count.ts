import type {
	GetCountOfAllOrdersRequest,
	OrderSide,
} from '@0xsequence/marketplace-api';
import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import { getMarketplaceClient, type ValuesOptional } from '../../_internal';

import type { StandardQueryOptions } from '../../types/query';

export interface FetchCountItemsOrdersForCollectionParams {
	chainId: number;
	collectionAddress: string;
	config: SdkConfig;
	side: OrderSide;
}

/**
 * Fetches count of orders for a collection from the marketplace API
 */
export async function fetchCountItemsOrdersForCollection(
	params: FetchCountItemsOrdersForCollectionParams,
) {
	const { collectionAddress, chainId, config, side } = params;

	const client = getMarketplaceClient(config);

	const apiArgs: GetCountOfAllOrdersRequest = {
		contractAddress: collectionAddress,
		chainId: chainId,
		side,
	};

	const result = await client.getCountOfAllOrders(apiArgs);
	return result.count;
}

export type CountItemsOrdersForCollectionQueryOptions =
	ValuesOptional<FetchCountItemsOrdersForCollectionParams> & {
		query?: StandardQueryOptions;
	};

export function getCountItemsOrdersForCollectionQueryKey(
	params: CountItemsOrdersForCollectionQueryOptions,
) {
	return [
		'collection',
		'market-items-count',
		{
			chainId: params.chainId ?? 0,
			contractAddress: params.collectionAddress ?? '',
			side: params.side,
		},
	] as const;
}

export function countItemsOrdersForCollectionQueryOptions(
	params: CountItemsOrdersForCollectionQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.config &&
			params.side &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getCountItemsOrdersForCollectionQueryKey(params),
		queryFn: () =>
			fetchCountItemsOrdersForCollection({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				side: params.side!,
			}),
		...params.query,
		enabled,
	});
}
