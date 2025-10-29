import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import {
	getMarketplaceClient,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../../_internal';
import type {
	GetCountOfAllOrdersRequest,
	OrderSide,
} from '../../_internal/api/marketplace.gen';

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
		chainId: String(chainId),
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
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		side: params.side,
	} satisfies QueryKeyArgs<GetCountOfAllOrdersRequest>;

	return ['order', 'collection-items-count', apiArgs] as const;
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
