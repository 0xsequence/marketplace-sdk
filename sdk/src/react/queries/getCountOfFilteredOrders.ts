import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import {
	getMarketplaceClient,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../_internal';
import type {
	GetCountOfFilteredOrdersArgs,
	OrderSide,
	OrdersFilter,
} from '../_internal/api/marketplace.gen';
import { collectionKeys } from '../_internal/api/query-keys';
import type { StandardQueryOptions } from '../types/query';

export interface FetchGetCountOfFilteredOrdersParams {
	chainId: number;
	collectionAddress: string;
	config: SdkConfig;
	side: OrderSide;
	filter?: OrdersFilter;
}

export async function fetchGetCountOfFilteredOrders(
	params: FetchGetCountOfFilteredOrdersParams,
) {
	const { collectionAddress, chainId, config, side, filter } = params;

	const client = getMarketplaceClient(config);

	const apiArgs: GetCountOfFilteredOrdersArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
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
	const apiArgs = {
		// biome-ignore lint/style/noNonNullAssertion: Params are validated before query key generation
		chainId: String(params.chainId!),
		// biome-ignore lint/style/noNonNullAssertion: Params are validated before query key generation
		contractAddress: params.collectionAddress!,
		// biome-ignore lint/style/noNonNullAssertion: Params are validated before query key generation
		side: params.side!,
		filter: params.filter,
	} satisfies QueryKeyArgs<GetCountOfFilteredOrdersArgs>;

	return [...collectionKeys.getCountOfFilteredOrders, apiArgs] as const;
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
