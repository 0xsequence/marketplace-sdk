import type { SdkConfig } from '../../../types';
import type {
	ListCollectibleOffersResponse,
	ListOffersForCollectibleRequest,
	Page,
	SortBy,
	WithOptionalParams,
} from '../../_internal';
import { buildQueryOptions, getMarketplaceClient } from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchListOffersForCollectibleParams
	extends Omit<ListOffersForCollectibleRequest, 'tokenId'> {
	collectibleId: bigint;
	config: SdkConfig;
	sort?: Array<SortBy>;
	query?: StandardQueryOptions;
}

/**
 * Fetches offers for a specific collectible from the Marketplace API
 */
export async function fetchListOffersForCollectible(
	params: FetchListOffersForCollectibleParams,
): Promise<ListCollectibleOffersResponse> {
	const { chainId, collectibleId, config, sort, page, ...additionalApiParams } =
		params;
	const marketplaceClient = getMarketplaceClient(config);

	const finalSort = sort || (page && 'sort' in page ? page.sort : undefined);

	let finalPage: Page | undefined;
	if (page || finalSort) {
		finalPage = {
			page: page?.page ?? 1,
			pageSize: page?.pageSize ?? 20,
			...(page?.more && { more: page.more }),
			...(finalSort && { sort: finalSort }),
		} as Page;
	}

	return await marketplaceClient.listOffersForCollectible({
		chainId,
		tokenId: collectibleId,
		page: finalPage,
		...additionalApiParams,
	});
}

export type ListOffersForCollectibleQueryOptions =
	WithOptionalParams<FetchListOffersForCollectibleParams>;

export function getListOffersForCollectibleQueryKey(
	params: ListOffersForCollectibleQueryOptions,
) {
	return [
		'collectible',
		'market-offers',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
			tokenId: params.collectibleId ?? 0n,
			filter: params.filter,
			page: params.page,
		},
	] as const;
}

export function listOffersForCollectibleQueryOptions(
	params: ListOffersForCollectibleQueryOptions,
) {
	return buildQueryOptions(
		{
			getQueryKey: getListOffersForCollectibleQueryKey,
			requiredParams: [
				'chainId',
				'collectionAddress',
				'collectibleId',
				'config',
			] as const,
			fetcher: fetchListOffersForCollectible,
		},
		params,
	);
}
