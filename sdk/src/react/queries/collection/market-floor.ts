import { isAddress } from 'viem';
import {
	buildQueryOptions,
	type GetFloorOrderRequest,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';

export type FloorOrderQueryOptions = SdkQueryParams<GetFloorOrderRequest>;

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
			customValidation: (p) =>
				!!p.collectionAddress && isAddress(p.collectionAddress),
		},
		params,
	);
}
