import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { Page, SdkConfig } from '../../../types';
import type {
	ListCollectiblesRequest,
	ListCollectiblesResponse,
	ValuesOptional,
} from '../../_internal';
import { getMarketplaceClient } from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchListCollectiblesPaginatedParams
	extends Omit<
		ListCollectiblesRequest,
		'chainId' | 'contractAddress' | 'page'
	> {
	chainId: number;
	collectionAddress: Address;
	page?: number;
	pageSize?: number;
	config: SdkConfig;
}

/**
 * Fetches a list of collectibles with pagination support from the Marketplace API
 */
export async function fetchListCollectiblesPaginated(
	params: FetchListCollectiblesPaginatedParams,
): Promise<ListCollectiblesResponse> {
	const {
		collectionAddress,
		chainId,
		config,
		page = 1,
		pageSize = 30,
		...additionalApiParams
	} = params;
	const marketplaceClient = getMarketplaceClient(config);

	const pageParams: Page = {
		page,
		pageSize,
	};

	return await marketplaceClient.listCollectibles({
		contractAddress: collectionAddress,
		chainId,
		page: pageParams,
		...additionalApiParams,
	});
}

export type ListCollectiblesPaginatedQueryOptions =
	ValuesOptional<FetchListCollectiblesPaginatedParams> & {
		query?: StandardQueryOptions;
	};

/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'market-list-paginated', { chainId, contractAddress, side, filter, page }]
 */
export function getListCollectiblesPaginatedQueryKey(
	params: ListCollectiblesPaginatedQueryOptions,
) {
	return [
		'collectible',
		'market-list-paginated',
		{
			chainId: params.chainId ?? 0,
			contractAddress: params.collectionAddress ?? '',
			side: params.side,
			filter: params.filter,
			page: params.page,
			pageSize: params.pageSize,
		},
	] as const;
}

export function listCollectiblesPaginatedQueryOptions(
	params: ListCollectiblesPaginatedQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.side &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getListCollectiblesPaginatedQueryKey(params),
		queryFn: () =>
			fetchListCollectiblesPaginated({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				side: params.side!,
				filter: params.filter,
				page: params.page,
				pageSize: params.pageSize,
			}),
		...params.query,
		enabled,
	});
}
