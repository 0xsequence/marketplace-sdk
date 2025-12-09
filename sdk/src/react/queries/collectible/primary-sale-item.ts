import type {
	CollectiblePrimarySaleItem,
	GetPrimarySaleItemResponse,
} from '@0xsequence/api-client';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';
import { createCollectibleQueryKey } from './queryKeys';

export interface FetchPrimarySaleItemParams {
	chainId: number;
	primarySaleContractAddress: string;
	tokenId: string | bigint;
}

export type PrimarySaleItemQueryOptions =
	SdkQueryParams<FetchPrimarySaleItemParams>;

/**
 * Fetches a single primary sale item from the marketplace API
 */
export async function fetchPrimarySaleItem(
	params: WithRequired<
		PrimarySaleItemQueryOptions,
		'chainId' | 'primarySaleContractAddress' | 'tokenId' | 'config'
	>,
): Promise<GetPrimarySaleItemResponse> {
	const { chainId, primarySaleContractAddress, tokenId, config } = params;

	const marketplaceClient = getMarketplaceClient(config);

	return marketplaceClient.getPrimarySaleItem({
		chainId,
		primarySaleContractAddress,
		tokenId: BigInt(tokenId),
	});
}

export function getPrimarySaleItemQueryKey(
	params: PrimarySaleItemQueryOptions,
) {
	return createCollectibleQueryKey('primary-sale-item', {
		chainId: params.chainId ?? 0,
		primarySaleContractAddress: params.primarySaleContractAddress ?? '',
		tokenId: params.tokenId?.toString() ?? '',
	});
}

export function primarySaleItemQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			PrimarySaleItemQueryOptions,
			'chainId' | 'primarySaleContractAddress' | 'tokenId' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getPrimarySaleItemQueryKey,
			requiredParams: [
				'chainId',
				'primarySaleContractAddress',
				'tokenId',
				'config',
			] as const,
			fetcher: fetchPrimarySaleItem,
		},
		params,
	);
}

export type { CollectiblePrimarySaleItem, GetPrimarySaleItemResponse };
