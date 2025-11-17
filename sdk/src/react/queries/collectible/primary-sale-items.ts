import type {
	ListPrimarySaleItemsRequest,
	ListPrimarySaleItemsResponse,
	Page,
	PrimarySaleItemsFilter,
} from '@0xsequence/marketplace-api';
import { infiniteQueryOptions } from '@tanstack/react-query';
import {
	getMarketplaceClient,
	type SdkInfiniteQueryParams,
	type WithRequired,
} from '../../_internal';

export interface FetchPrimarySaleItemsParams
	extends Omit<ListPrimarySaleItemsRequest, 'page'> {
	filter?: PrimarySaleItemsFilter;
	page?: Page;
}

export type ListPrimarySaleItemsQueryOptions =
	SdkInfiniteQueryParams<FetchPrimarySaleItemsParams>;

/**
 * Fetches primary sale items from the marketplace API
 */
export async function fetchPrimarySaleItems(
	params: WithRequired<
		ListPrimarySaleItemsQueryOptions,
		'chainId' | 'primarySaleContractAddress' | 'config'
	>,
): Promise<ListPrimarySaleItemsResponse> {
	const { chainId, primarySaleContractAddress, filter, page, config } = params;

	const marketplaceClient = getMarketplaceClient(config);

	return marketplaceClient.listPrimarySaleItems({
		chainId,
		primarySaleContractAddress,
		filter,
		page,
	});
}

export function getPrimarySaleItemsQueryKey(
	params: ListPrimarySaleItemsQueryOptions,
) {
	return [
		'collectible',
		'primary-sale-items',
		{
			chainId: params.chainId ?? 0,
			primarySaleContractAddress: params.primarySaleContractAddress ?? '',
			filter: params.filter,
		},
	] as const;
}

export const primarySaleItemsQueryOptions = (
	params: ListPrimarySaleItemsQueryOptions,
) => {
	const enabled = Boolean(
		params.primarySaleContractAddress &&
			params.chainId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	type PageParam = { page: number; pageSize: number };
	const initialPage: PageParam = params.page || { page: 1, pageSize: 30 };

	return infiniteQueryOptions({
		queryKey: getPrimarySaleItemsQueryKey(params),
		queryFn: async ({ pageParam }) => {
			return fetchPrimarySaleItems({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				primarySaleContractAddress: params.primarySaleContractAddress!,
				filter: params.filter,
				page: pageParam,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
			});
		},
		initialPageParam: initialPage,
		getNextPageParam: (lastPage) =>
			lastPage.page?.more ? lastPage.page : undefined,
		...params.query,
		enabled,
	});
};

export type { ListPrimarySaleItemsRequest, ListPrimarySaleItemsResponse };
