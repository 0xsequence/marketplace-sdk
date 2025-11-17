import type { Address } from 'viem';
import type { Page, SdkConfig } from '../../../types';
import type {
	ListCollectiblesRequest,
	ListCollectiblesResponse,
} from '../../_internal';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type WithOptionalParams,
} from '../../_internal';

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
		collectionAddress,
		chainId,
		page: pageParams,
		...additionalApiParams,
	});
}

export type ListCollectiblesPaginatedQueryOptions =
	WithOptionalParams<FetchListCollectiblesPaginatedParams>;

/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'market-list-paginated', { chainId, contractAddress, side, filter, page }]
 */
export function getListCollectiblesPaginatedQueryKey(
	params: WithOptionalParams<FetchListCollectiblesPaginatedParams>,
) {
	return [
		'collectible',
		'market-list-paginated',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
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
	return buildQueryOptions(
		{
			getQueryKey: getListCollectiblesPaginatedQueryKey,
			requiredParams: [
				'collectionAddress',
				'chainId',
				'side',
				'config',
			] as const,
			fetcher: fetchListCollectiblesPaginated,
		},
		params,
	);
}
