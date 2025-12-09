import type {
	GetCountOfPrimarySaleItemsRequest,
	GetCountOfPrimarySaleItemsResponse,
	PrimarySaleItemsFilter,
} from '@0xsequence/api-client';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';

export interface FetchPrimarySaleItemsCountParams
	extends GetCountOfPrimarySaleItemsRequest {
	filter?: PrimarySaleItemsFilter;
}

export type PrimarySaleItemsCountQueryOptions =
	SdkQueryParams<FetchPrimarySaleItemsCountParams>;

/**
 * Fetches the count of primary sale items from the marketplace API
 */
export async function fetchPrimarySaleItemsCount(
	params: WithRequired<
		PrimarySaleItemsCountQueryOptions,
		'chainId' | 'primarySaleContractAddress' | 'config'
	>,
): Promise<GetCountOfPrimarySaleItemsResponse> {
	const { config, ...apiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.getCountOfPrimarySaleItems(apiParams);
}

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
	params: WithOptionalParams<
		WithRequired<
			PrimarySaleItemsCountQueryOptions,
			'primarySaleContractAddress' | 'chainId' | 'config'
		>
	>,
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
