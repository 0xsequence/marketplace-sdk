import type { GetCountOfFilteredOrdersRequest } from '@0xsequence/api-client';
import { isAddress } from 'viem';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';

export type FetchGetCountOfFilteredOrdersParams =
	GetCountOfFilteredOrdersRequest;

export type GetCountOfFilteredOrdersQueryOptions =
	SdkQueryParams<FetchGetCountOfFilteredOrdersParams>;

export async function fetchGetCountOfFilteredOrders(
	params: WithRequired<
		GetCountOfFilteredOrdersQueryOptions,
		'chainId' | 'collectionAddress' | 'side' | 'config'
	>,
) {
	const { config, ...apiParams } = params;
	const client = getMarketplaceClient(config);
	const result = await client.getCountOfFilteredOrders(apiParams);
	return result.count;
}

export function getCountOfFilteredOrdersQueryKey(
	params: GetCountOfFilteredOrdersQueryOptions,
) {
	return [
		'collection',
		'market-filtered-count',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
			side: params.side,
			filter: params.filter,
		},
	] as const;
}

export function getCountOfFilteredOrdersQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			GetCountOfFilteredOrdersQueryOptions,
			'chainId' | 'collectionAddress' | 'side' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getCountOfFilteredOrdersQueryKey,
			requiredParams: [
				'chainId',
				'collectionAddress',
				'config',
				'side',
			] as const,
			fetcher: fetchGetCountOfFilteredOrders,
			customValidation: (p) =>
				!!p.collectionAddress && isAddress(p.collectionAddress),
		},
		params,
	);
}
