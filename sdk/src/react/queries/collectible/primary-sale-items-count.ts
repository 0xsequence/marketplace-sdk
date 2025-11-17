import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import {
	type GetCountOfPrimarySaleItemsResponse,
	getMarketplaceClient,
	type PrimarySaleItemsFilter,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchPrimarySaleItemsCountParams {
	chainId: number;
	primarySaleContractAddress: Address;
	filter?: PrimarySaleItemsFilter;
	config: SdkConfig;
}

/**
 * Fetches the count of primary sale items from the marketplace API
 */
export async function fetchPrimarySaleItemsCount(
	params: FetchPrimarySaleItemsCountParams,
): Promise<GetCountOfPrimarySaleItemsResponse> {
	const { chainId, primarySaleContractAddress, filter, config } = params;

	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.getCountOfPrimarySaleItems({
		chainId,
		primarySaleContractAddress,
		filter,
	});
}

export type PrimarySaleItemsCountQueryOptions =
	Partial<FetchPrimarySaleItemsCountParams> & {
		query?: StandardQueryOptions;
	};

export function getPrimarySaleItemsCountQueryKey(
	args: PrimarySaleItemsCountQueryOptions,
) {
	return [
		'collectible',
		'primary-sale-items-count',
		{
			chainId: args.chainId ?? 0,
			primarySaleContractAddress: args.primarySaleContractAddress ?? '',
			filter: args.filter,
		},
	] as const;
}

export const primarySaleItemsCountQueryOptions = (
	args: PrimarySaleItemsCountQueryOptions,
) => {
	const enabled = Boolean(
		args.primarySaleContractAddress &&
			args.chainId &&
			args.config &&
			(args.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getPrimarySaleItemsCountQueryKey(args),
		queryFn: () =>
			fetchPrimarySaleItemsCount({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: args.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				primarySaleContractAddress: args.primarySaleContractAddress!,
				filter: args.filter,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: args.config!,
			}),
		...args.query,
		enabled,
	});
};
