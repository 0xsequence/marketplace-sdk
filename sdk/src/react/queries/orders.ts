import type { Page } from '@0xsequence/api-client';
import { queryOptions } from '@tanstack/react-query';
import type { GetOrdersResponse } from '../../../../api/src/adapters/marketplace';
import type { GetOrdersInput } from '../../../../api/src/adapters/marketplace/marketplace.gen';
import type { SdkConfig } from '../../types';
import { getMarketplaceClient, type ValuesOptional } from '../_internal';
import type { StandardQueryOptions } from '../types/query';

export interface FetchOrdersParams {
	chainId: number;
	input: GetOrdersInput[];
	page?: Page;
	config: SdkConfig;
}

/**
 * Fetches orders from the marketplace API
 */
export async function fetchOrders(
	params: FetchOrdersParams,
): Promise<GetOrdersResponse> {
	const { config, ...apiParams } = params;

	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.getOrders({
		chainId: apiParams.chainId,
		input: apiParams.input,
		page: apiParams.page,
	});
}

export type OrdersQueryOptions = ValuesOptional<FetchOrdersParams> & {
	query?: StandardQueryOptions;
};

export function ordersQueryOptions(params: OrdersQueryOptions) {
	const enabled = Boolean(
		params.config &&
			params.chainId &&
			params.input &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: ['orders', params],
		queryFn: () =>
			fetchOrders({
				chainId: params.chainId!,
				input: params.input!,
				page: params.page,
				config: params.config!,
			}),
		...params.query,
		enabled,
	});
}
