import type {
	ListCollectibleOffersResponse,
	ListOffersForCollectibleRequest,
	Page,
	SortBy,
} from '../../_internal';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithRequired,
} from '../../_internal';

export type ListOffersForCollectibleQueryOptions = SdkQueryParams<
	Omit<ListOffersForCollectibleRequest, 'tokenId'> & {
		collectibleId: bigint;
		sort?: Array<SortBy>;
	}
>;

/**
 * Fetches offers for a specific collectible from the Marketplace API
 */
export async function fetchListOffersForCollectible(
	params: WithRequired<
		ListOffersForCollectibleQueryOptions,
		'chainId' | 'collectionAddress' | 'collectibleId' | 'config'
	>,
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
