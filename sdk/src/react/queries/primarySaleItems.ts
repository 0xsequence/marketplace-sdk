import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import {
	getMarketplaceClient,
	type ListPrimarySaleItemsArgs,
	type ListPrimarySaleItemsReturn,
	type Page,
	type PrimarySaleItemsFilter,
	type ValuesOptional,
} from '../_internal';
import type { StandardQueryOptions } from '../types/query';

export interface FetchPrimarySaleItemsParams {
	chainId: number;
	primarySaleContractAddress: Address;
	filter?: PrimarySaleItemsFilter;
	page?: Page;
	config: SdkConfig;
}

/**
 * Fetches primary sale items from the marketplace API
 */
export async function fetchPrimarySaleItems(
	params: FetchPrimarySaleItemsParams,
): Promise<ListPrimarySaleItemsReturn> {
	const { chainId, primarySaleContractAddress, filter, page, config } = params;

	const marketplaceClient = getMarketplaceClient(config);

	return marketplaceClient.listPrimarySaleItems({
		chainId: String(chainId),
		primarySaleContractAddress,
		filter,
		page,
	});
}

export type ListPrimarySaleItemsQueryOptions =
	ValuesOptional<FetchPrimarySaleItemsParams> & {
		query?: StandardQueryOptions;
	};

export const listPrimarySaleItemsQueryOptions = (
	params: ListPrimarySaleItemsQueryOptions,
) => {
	const enabled = Boolean(
		params.primarySaleContractAddress &&
			params.chainId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	type PageParam = { page: number; pageSize: number };
	const initialPage: PageParam = { page: 1, pageSize: 30 };

	return infiniteQueryOptions({
		queryKey: ['listPrimarySaleItems', params],
		queryFn: async ({ pageParam }) => {
			return fetchPrimarySaleItems({
				chainId: params.chainId!,
				primarySaleContractAddress: params.primarySaleContractAddress!,
				filter: params.filter,
				page: pageParam,
				config: params.config!,
			});
		},
		initialPageParam: initialPage,
		getNextPageParam: (lastPage) =>
			lastPage.page?.more
				? {
						page: (lastPage.page?.page || 1) + 1,
						pageSize: lastPage.page?.pageSize || 30,
					}
				: undefined,
		...params.query,
		enabled,
	});
};

export type { ListPrimarySaleItemsArgs, ListPrimarySaleItemsReturn };
