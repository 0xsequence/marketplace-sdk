import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import {
	getMarketplaceClient,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../_internal';
import type {
	GetCountOfAllOrdersArgs,
	OrderSide,
} from '../_internal/api/marketplace.gen';
import { collectionKeys } from '../_internal/api/query-keys';
import type { StandardQueryOptions } from '../types/query';

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

	const apiArgs: GetCountOfAllOrdersArgs = {
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
		// biome-ignore lint/style/noNonNullAssertion: Params are validated before query key generation
		chainId: String(params.chainId!),
		// biome-ignore lint/style/noNonNullAssertion: Params are validated before query key generation
		contractAddress: params.collectionAddress!,
		// biome-ignore lint/style/noNonNullAssertion: Params are validated before query key generation
		side: params.side!,
	} satisfies QueryKeyArgs<GetCountOfAllOrdersArgs>;

	return [...collectionKeys.collectionItemsOrdersCount, apiArgs] as const;
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
