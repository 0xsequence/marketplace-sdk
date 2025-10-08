import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { Page, SdkConfig } from '../../types';
import type {
	ListCollectionActivitiesArgs,
	ListCollectionActivitiesReturn,
	QueryKeyArgs,
	SortBy,
	ValuesOptional,
} from '../_internal';
import { getMarketplaceClient } from '../_internal';
import { collectionKeys } from '../_internal/api';
import type { StandardQueryOptions } from '../types/query';

export interface FetchListCollectionActivitiesParams
	extends Omit<
		ListCollectionActivitiesArgs,
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
 * Fetches collection activities from the Marketplace API
 */
export async function fetchListCollectionActivities(
	params: FetchListCollectionActivitiesParams,
): Promise<ListCollectionActivitiesReturn> {
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

	const apiArgs: ListCollectionActivitiesArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		page: pageParams,
		...additionalApiParams,
	};

	return await marketplaceClient.listCollectionActivities(apiArgs);
}

export type ListCollectionActivitiesQueryOptions =
	ValuesOptional<FetchListCollectionActivitiesParams> & {
		query?: StandardQueryOptions;
	};

export function getListCollectionActivitiesQueryKey(
	params: ListCollectionActivitiesQueryOptions,
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
		page: page,
	} satisfies QueryKeyArgs<ListCollectionActivitiesArgs>;

	return [...collectionKeys.collectionActivities, apiArgs] as const;
}

export function listCollectionActivitiesQueryOptions(
	params: ListCollectionActivitiesQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getListCollectionActivitiesQueryKey(params),
		queryFn: () =>
			fetchListCollectionActivities({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				page: params.page,
				pageSize: params.pageSize,
				sort: params.sort,
			}),
		...params.query,
		enabled,
	});
}
