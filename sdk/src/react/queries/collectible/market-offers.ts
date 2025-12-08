import type {
	ListCollectibleOffersResponse,
	ListOffersForCollectibleRequest,
	Page,
	SortBy,
	WithOptionalParams,
} from '../../_internal';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithRequired,
} from '../../_internal';

export type ListOffersForCollectibleQueryOptions = SdkQueryParams<
	ListOffersForCollectibleRequest & {
		sort?: Array<SortBy>;
	}
>;

/**
 * Fetches offers for a specific collectible from the Marketplace API
 */
export async function fetchListOffersForCollectible(
	params: WithRequired<
		ListOffersForCollectibleQueryOptions,
		'chainId' | 'collectionAddress' | 'tokenId' | 'config'
	>,
): Promise<ListCollectibleOffersResponse> {
	const { config, sort, page, ...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);

	const effectiveSort =
		sort || (page && 'sort' in page ? page.sort : undefined);

	return await marketplaceClient.listOffersForCollectible({
		...additionalApiParams,
		page:
			page || effectiveSort
				? ({
						page: page?.page ?? 1,
						pageSize: page?.pageSize ?? 20,
						...(page?.more && { more: page.more }),
						...(effectiveSort && { sort: effectiveSort }),
					} as Page)
				: undefined,
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
			tokenId: params.tokenId ?? 0n,
			filter: params.filter,
			page: params.page,
		},
	] as const;
}

export function listOffersForCollectibleQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			ListOffersForCollectibleQueryOptions,
			'chainId' | 'collectionAddress' | 'tokenId' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getListOffersForCollectibleQueryKey,
			requiredParams: [
				'chainId',
				'collectionAddress',
				'tokenId',
				'config',
			] as const,
			fetcher: fetchListOffersForCollectible,
		},
		params,
	);
}
