import type {
	ListCollectionActivitiesRequest,
	ListCollectionActivitiesResponse,
	SortBy,
	WithOptionalParams,
} from '../../_internal';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithRequired,
} from '../../_internal';

export type ListCollectionActivitiesQueryOptions = SdkQueryParams<
	Omit<ListCollectionActivitiesRequest, 'page'> & {
		page?: number;
		pageSize?: number;
		sort?: SortBy[];
	}
>;

/**
 * Fetches collection activities from the Marketplace API
 */
export async function fetchListCollectionActivities(
	params: WithRequired<
		ListCollectionActivitiesQueryOptions,
		'collectionAddress' | 'chainId' | 'config'
	>,
): Promise<ListCollectionActivitiesResponse> {
	const { chainId, config, page, pageSize, sort, ...additionalApiParams } =
		params;
	const marketplaceClient = getMarketplaceClient(config);

	return await marketplaceClient.listCollectionActivities({
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

export function getListCollectionActivitiesQueryKey(
	params: ListCollectionActivitiesQueryOptions,
) {
	return [
		'collection',
		'market-activities',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
			page: params.page,
			pageSize: params.pageSize,
			sort: params.sort,
		},
	] as const;
}

export function listCollectionActivitiesQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			ListCollectionActivitiesQueryOptions,
			'collectionAddress' | 'chainId' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getListCollectionActivitiesQueryKey,
			requiredParams: ['collectionAddress', 'chainId', 'config'] as const,
			fetcher: fetchListCollectionActivities,
		},
		params,
	);
}
