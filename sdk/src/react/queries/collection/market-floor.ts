import type { CollectiblesFilter } from '@0xsequence/api-client';
import type { Address } from 'viem';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';

export interface FetchFloorOrderParams {
	chainId: number;
	collectionAddress: Address | undefined;
	filter?: CollectiblesFilter;
}

export type FloorOrderQueryOptions = SdkQueryParams<FetchFloorOrderParams>;

/**
 * Fetches the floor order for a collection from the marketplace API
 */
export async function fetchFloorOrder(
	params: WithRequired<
		FloorOrderQueryOptions,
		'chainId' | 'collectionAddress' | 'config'
	>,
) {
	const { config, ...apiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const result = await marketplaceClient.getFloorOrder(apiParams);
	return result.collectible;
}

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

export function floorOrderQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			FloorOrderQueryOptions,
			'chainId' | 'collectionAddress' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getFloorOrderQueryKey,
			requiredParams: ['chainId', 'collectionAddress', 'config'] as const,
			fetcher: fetchFloorOrder,
		},
		params,
	);
}
