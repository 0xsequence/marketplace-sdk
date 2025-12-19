import type {
	ListPrimarySaleItemsRequest,
	ListPrimarySaleItemsResponse,
	Page,
	PrimarySaleItemsFilter,
} from '@0xsequence/api-client';
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

	const queryFn = async ({ pageParam }: { pageParam: PageParam }) => {
		const requiredParams = params as WithRequired<
			ListPrimarySaleItemsQueryOptions,
			'chainId' | 'primarySaleContractAddress' | 'config'
		>;
		return fetchPrimarySaleItems({
			chainId: requiredParams.chainId,
			primarySaleContractAddress: requiredParams.primarySaleContractAddress,
			filter: params.filter,
			page: pageParam,
			config: requiredParams.config,
		});
	};

	return infiniteQueryOptions({
		queryKey: getPrimarySaleItemsQueryKey(params),
		queryFn,
		initialPageParam: initialPage,
		getNextPageParam: (lastPage) =>
			lastPage.page?.more
				? {
						page: lastPage.page.page + 1,
						pageSize: lastPage.page.pageSize,
						more: true,
					}
				: undefined,
		...params.query,
		enabled,
	});
};

export type { ListPrimarySaleItemsRequest, ListPrimarySaleItemsResponse };
