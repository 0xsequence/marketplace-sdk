import type { Page } from '../../../types';
import type {
	ListCollectionActivitiesRequest,
	ListCollectionActivitiesResponse,
	SortBy,
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

	const pageParams: Page | undefined =
		page || pageSize || sort
			? {
					page: page ?? 1,
					pageSize: pageSize ?? 10,
					sort,
				}
			: undefined;

	const apiArgs: ListCollectionActivitiesRequest = {
		chainId,
		page: pageParams,
		...additionalApiParams,
	};

	return await marketplaceClient.listCollectionActivities(apiArgs);
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
	params: ListCollectionActivitiesQueryOptions,
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
