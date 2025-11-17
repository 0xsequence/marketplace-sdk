import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import {
	buildQueryOptions,
	type GetCountOfPrimarySaleItemsResponse,
	getMarketplaceClient,
	type PrimarySaleItemsFilter,
	type WithOptionalParams,
} from '../../_internal';

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
	WithOptionalParams<FetchPrimarySaleItemsCountParams>;

export function getPrimarySaleItemsCountQueryKey(
	params: PrimarySaleItemsCountQueryOptions,
) {
	return [
		'collectible',
		'primary-sale-items-count',
		{
			chainId: params.chainId ?? 0,
			primarySaleContractAddress: params.primarySaleContractAddress ?? '',
			filter: params.filter,
		},
	] as const;
}

export const primarySaleItemsCountQueryOptions = (
	params: PrimarySaleItemsCountQueryOptions,
) => {
	return buildQueryOptions(
		{
			getQueryKey: getPrimarySaleItemsCountQueryKey,
			requiredParams: [
				'primarySaleContractAddress',
				'chainId',
				'config',
			] as const,
			fetcher: fetchPrimarySaleItemsCount,
		},
		params,
	);
};
