import type { MarketplaceAPI } from '@0xsequence/marketplace-api';
import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { Page, SdkConfig } from '../../../types';
import type {
	ListCollectibleActivitiesRequest,
	ListCollectibleActivitiesResponse,
	SortBy,
	ValuesOptional,
} from '../../_internal';
import { getMarketplaceClient } from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchListCollectibleActivitiesParams
	extends Omit<
		ListCollectibleActivitiesRequest,
		'chainId' | 'contractAddress' | 'page'
	> {
	chainId: number;
	collectionAddress: Address;
	page?: number;
	pageSize?: number;
	sort?: SortBy[];
	config: SdkConfig;
}

/**
 * Fetches collectible activities from the Marketplace API
 */
export async function fetchListCollectibleActivities(
	params: FetchListCollectibleActivitiesParams,
): Promise<ListCollectibleActivitiesResponse> {
	const {
		collectionAddress,
		chainId,
		config,
		page,
		pageSize,
		sort,
		...additionalApiParams
	} = params;
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
		contractAddress: collectionAddress,
		chainId: chainId,
		page: pageParams,
		...additionalApiParams,
	});
}

export type ListCollectibleActivitiesQueryOptions =
	ValuesOptional<FetchListCollectibleActivitiesParams> & {
		query?: StandardQueryOptions;
	};

export function getListCollectibleActivitiesQueryKey(
	params: ListCollectibleActivitiesQueryOptions,
) {
	// TODO: Do we actually want to do the page like this?
	const page =
		params.page || params.pageSize || params.sort
			? {
					page: params.page ?? 1,
					pageSize: params.pageSize ?? 10,
					sort: params.sort,
				}
			: undefined;

	const apiArgs: MarketplaceAPI.ListCollectibleActivitiesRequest = {
		chainId: (params.chainId ?? 0).toString(),
		contractAddress: params.collectionAddress ?? '',
		tokenId: params.tokenId ?? 0n,
		page: page,
	};

	const client = getMarketplaceClient(params.config!);
	return client.queryKey.listCollectibleActivities(apiArgs);
}

export function listCollectibleActivitiesQueryOptions(
	params: ListCollectibleActivitiesQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.tokenId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getListCollectibleActivitiesQueryKey(params),
		queryFn: () =>
			fetchListCollectibleActivities({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				tokenId: params.tokenId!,
				page: params.page,
				pageSize: params.pageSize,
				sort: params.sort,
			}),
		...params.query,
		enabled,
	});
}
