import type { SdkConfig } from '../../../types';
import {
	buildQueryOptions,
	type GetFloorOrderRequest,
	getMarketplaceClient,
	type WithOptionalParams,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchFloorOrderParams extends GetFloorOrderRequest {
	config: SdkConfig;
	query?: StandardQueryOptions;
}

/**
 * Fetches the floor order for a collection from the marketplace API
 */
export async function fetchFloorOrder(params: FetchFloorOrderParams) {
	const { chainId, config, ...additionalApiParams } = params;

	const marketplaceClient = getMarketplaceClient(config);

	const apiArgs: GetFloorOrderRequest = {
		chainId,
		...additionalApiParams,
	};

	const result = await marketplaceClient.getFloorOrder(apiArgs);
	return result.collectible;
}

export type FloorOrderQueryOptions = WithOptionalParams<FetchFloorOrderParams>;

export function getFloorOrderQueryKey(params: FloorOrderQueryOptions) {
	return [
		'collection',
		'market-floor',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
			filter: params.filter,
		},
	] as const;
}

export function floorOrderQueryOptions(params: FloorOrderQueryOptions) {
	return buildQueryOptions(
		{
			getQueryKey: getFloorOrderQueryKey,
			requiredParams: ['chainId', 'collectionAddress', 'config'] as const,
			fetcher: fetchFloorOrder,
		},
		params,
	);
}
