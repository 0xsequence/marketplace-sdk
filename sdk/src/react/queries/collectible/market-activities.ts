import type { Page, SdkConfig } from '../../../types';
import type {
	ListCollectibleActivitiesRequest,
	ListCollectibleActivitiesResponse,
	SortBy,
	WithOptionalParams,
} from '../../_internal';
import { buildQueryOptions, getMarketplaceClient } from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchListCollectibleActivitiesParams
	extends Omit<ListCollectibleActivitiesRequest, 'page'> {
	page?: number;
	pageSize?: number;
	sort?: SortBy[];
	config: SdkConfig;
	query?: StandardQueryOptions;
}

/**
 * Fetches collectible activities from the Marketplace API
 */
export async function fetchListCollectibleActivities(
	params: FetchListCollectibleActivitiesParams,
): Promise<ListCollectibleActivitiesResponse> {
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

	return await marketplaceClient.listCollectibleActivities({
		chainId,
		page: pageParams,
		...additionalApiParams,
	});
}

export type ListCollectibleActivitiesQueryOptions =
	WithOptionalParams<FetchListCollectibleActivitiesParams>;

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
	params: ListCollectibleActivitiesQueryOptions,
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
		},
		params,
	);
}
