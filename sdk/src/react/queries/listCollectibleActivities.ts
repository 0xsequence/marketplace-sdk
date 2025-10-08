import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { Page, SdkConfig } from '../../types';
import type {
	ListCollectibleActivitiesArgs,
	ListCollectibleActivitiesReturn,
	QueryKeyArgs,
	SortBy,
	ValuesOptional,
} from '../_internal';
import { collectableKeys, getMarketplaceClient } from '../_internal';
import type { StandardQueryOptions } from '../types/query';

export interface FetchListCollectibleActivitiesParams
	extends Omit<
		ListCollectibleActivitiesArgs,
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
): Promise<ListCollectibleActivitiesReturn> {
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

	const apiArgs: ListCollectibleActivitiesArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		page: pageParams,
		...additionalApiParams,
	};

	return await marketplaceClient.listCollectibleActivities(apiArgs);
}

export type ListCollectibleActivitiesQueryOptions =
	ValuesOptional<FetchListCollectibleActivitiesParams> & {
		query?: StandardQueryOptions;
	};

export function getListCollectibleActivitiesQueryKey(
	params: ListCollectibleActivitiesQueryOptions,
) {
	const page =
		params.page || params.pageSize || params.sort
			? {
					page: params.page ?? 1,
					pageSize: params.pageSize ?? 10,
					sort: params.sort,
				}
			: undefined;

	const apiArgs = {
		// biome-ignore lint/style/noNonNullAssertion: Params are validated before query key generation
		chainId: String(params.chainId!),
		// biome-ignore lint/style/noNonNullAssertion: Params are validated before query key generation
		contractAddress: params.collectionAddress!,
		// biome-ignore lint/style/noNonNullAssertion: Params are validated before query key generation
		tokenId: params.tokenId!,
		page: page,
	} satisfies QueryKeyArgs<ListCollectibleActivitiesArgs>;

	return [...collectableKeys.collectibleActivities, apiArgs] as const;
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
