import type { Page, SdkConfig } from '../../../types';
import type {
	ListCollectionActivitiesRequest,
	ListCollectionActivitiesResponse,
	SortBy,
} from '../../_internal';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type WithOptionalParams,
} from '../../_internal';

export interface FetchListCollectionActivitiesParams
	extends Omit<ListCollectionActivitiesRequest, 'page'> {
	page?: number;
	pageSize?: number;
	sort?: SortBy[];
	config: SdkConfig;
}

/**
 * Fetches collection activities from the Marketplace API
 */
export async function fetchListCollectionActivities(
	params: FetchListCollectionActivitiesParams,
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

export type ListCollectionActivitiesQueryOptions =
	WithOptionalParams<FetchListCollectionActivitiesParams>;

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
