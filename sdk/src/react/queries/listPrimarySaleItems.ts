import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import { type ValuesOptional, getMarketplaceClient } from '../_internal';
import type {
	ListPrimarySaleItemsArgs,
	Page,
	PrimarySaleItemsFilter,
} from '../_internal/api/marketplace.gen';
import type { StandardQueryOptions } from '../types/query';

export interface FetchListPrimarySaleItemsParams {
	chainId: number;
	primarySaleContractAddress: string;
	config: SdkConfig;
	filter?: PrimarySaleItemsFilter;
	page?: Page;
}

/**
 * Fetches primary sale items from the marketplace API
 */
export async function fetchListPrimarySaleItems(
	params: FetchListPrimarySaleItemsParams,
) {
	const { primarySaleContractAddress, chainId, config, filter, page } = params;

	const client = getMarketplaceClient(config);

	const apiArgs: ListPrimarySaleItemsArgs = {
		primarySaleContractAddress,
		chainId: String(chainId),
		filter,
		page,
	};

	const result = await client.listPrimarySaleItems(apiArgs);
	return result;
}

export type ListPrimarySaleItemsQueryOptions =
	ValuesOptional<FetchListPrimarySaleItemsParams> & {
		query?: StandardQueryOptions;
	};

export function listPrimarySaleItemsQueryOptions(
	params: ListPrimarySaleItemsQueryOptions,
) {
	const enabled = Boolean(
		params.primarySaleContractAddress &&
			params.chainId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: ['primarySaleItems', params],
		queryFn: () =>
			fetchListPrimarySaleItems({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				primarySaleContractAddress: params.primarySaleContractAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				filter: params.filter,
				page: params.page,
			}),
		...params.query,
		enabled,
	});
}
