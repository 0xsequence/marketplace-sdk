import { isAddress } from 'viem';
import type {
	ListCollectibleActivitiesRequest,
	ListCollectibleActivitiesResponse,
	SortBy,
	WithOptionalParams,
} from '../../_internal';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithRequired,
} from '../../_internal';

export type ListCollectibleActivitiesQueryOptions = SdkQueryParams<
	Omit<ListCollectibleActivitiesRequest, 'page'> & {
		page?: number;
		pageSize?: number;
		sort?: SortBy[];
	}
>;

/**
 * Fetches collectible activities from the Marketplace API
 */
export async function fetchListCollectibleActivities(
	params: WithRequired<
		ListCollectibleActivitiesQueryOptions,
		'chainId' | 'collectionAddress' | 'tokenId' | 'config'
	>,
): Promise<ListCollectibleActivitiesResponse> {
	const { chainId, config, page, pageSize, sort, ...additionalApiParams } =
		params;
	const marketplaceClient = getMarketplaceClient(config);

	return await marketplaceClient.listCollectibleActivities({
		chainId,
		page:
			page || pageSize || sort
				? {
						page: page ?? 1,
						pageSize: pageSize ?? 10,
						sort,
					}
				: undefined,
		...additionalApiParams,
	});
}

export function getListCollectibleActivitiesQueryKey(
	params: ListCollectibleActivitiesQueryOptions,
) {
	return [
		'collectible',
		'market-activities',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
			tokenId: params.tokenId ?? 0n,
			page: params.page,
			pageSize: params.pageSize,
			sort: params.sort,
		},
	] as const;
}

export function listCollectibleActivitiesQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			ListCollectibleActivitiesQueryOptions,
			'chainId' | 'collectionAddress' | 'tokenId' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getListCollectibleActivitiesQueryKey,
			requiredParams: [
				'chainId',
				'collectionAddress',
				'tokenId',
				'config',
			] as const,
			fetcher: fetchListCollectibleActivities,
			customValidation: (p) =>
				!!p.collectionAddress && isAddress(p.collectionAddress),
		},
		params,
	);
}
