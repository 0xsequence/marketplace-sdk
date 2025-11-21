import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import {
	collectableKeys,
	getMarketplaceClient,
	type ListPrimarySaleItemsArgs,
	type ListPrimarySaleItemsReturn,
	type Page,
	type PrimarySaleItemsFilter,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

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

export function getListPrimarySaleItemsQueryKey(
	params: ListPrimarySaleItemsQueryOptions,
) {
	const apiArgs = {
		chainId: String(params.chainId),
		primarySaleContractAddress: params.primarySaleContractAddress,
		filter: params.filter,
	} satisfies QueryKeyArgs<Omit<ListPrimarySaleItemsArgs, 'page'>>;

	return [...collectableKeys.listPrimarySaleItems, apiArgs] as const;
}

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
	const initialPage: PageParam = params.page || { page: 1, pageSize: 30 };

	return infiniteQueryOptions({
		queryKey: getListPrimarySaleItemsQueryKey(params),
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

export type { ListPrimarySaleItemsArgs, ListPrimarySaleItemsReturn };
