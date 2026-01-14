import type { GetOrdersRequest } from '@0xsequence/api-client';
import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import { getMarketplaceClient, type SdkQueryParams } from '../_internal';

export type FetchOrdersParams = GetOrdersRequest & { config: SdkConfig };

/**
 * Fetches orders from the marketplace API
 */
export async function fetchOrders(params: FetchOrdersParams) {
	const { config, ...apiParams } = params;

	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.getOrders({
		chainId: apiParams.chainId,
		input: apiParams.input,
		page: apiParams.page,
	});
}

export type OrdersQueryOptions = SdkQueryParams<
	Omit<FetchOrdersParams, 'config'>
>;

export function ordersQueryOptions(params: OrdersQueryOptions) {
	const { chainId, input, config } = params;
	const enabled = Boolean(
		config && chainId && input && (params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: ['orders', params],
		queryFn: () => {
			if (!chainId || !input || !config) {
				throw new Error('Missing required parameters for orders query');
			}
			return fetchOrders({
				chainId,
				input,
				page: params.page,
				config,
			});
		},
		...params.query,
		enabled,
	});
}
