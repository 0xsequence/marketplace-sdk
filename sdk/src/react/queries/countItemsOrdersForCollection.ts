import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import { getMarketplaceClient, type ValuesOptional } from '../_internal';
import type {
	GetCountOfListingsArgs,
	OrderFilter,
} from '../_internal/api/marketplace.gen';
import { collectableKeys } from '../_internal/api/query-keys';
import type { StandardQueryOptions } from '../types/query';

export interface FetchCountItemsOrdersForCollectionParams {
	chainId: number;
	collectionAddress: string;
	config: SdkConfig;
	filter?: OrderFilter;
}

/**
 * Fetches count of orders for a collection from the marketplace API
 */
export async function fetchCountItemsOrdersForCollection(
	params: FetchCountItemsOrdersForCollectionParams,
) {
	const { collectionAddress, chainId, config, filter } = params;

	const client = getMarketplaceClient(config);

	const apiArgs: GetCountOfListingsArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		filter,
	};

	const result = await client.getCountOfListings(apiArgs);
	return result.count;
}

export type CountItemsOrdersForCollectionQueryOptions =
	ValuesOptional<FetchCountItemsOrdersForCollectionParams> & {
		query?: StandardQueryOptions;
	};

export function countItemsOrdersForCollectionQueryOptions(
	params: CountItemsOrdersForCollectionQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: [...collectableKeys.collectionItemsOrdersCount, params],
		queryFn: () =>
			fetchCountItemsOrdersForCollection({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				filter: params.filter,
			}),
		...params.query,
		enabled,
	});
}
