import {
  buildQueryOptions,
  getMarketplaceClient,
  type SdkQueryParams,
  type WithRequired,
} from '../../_internal';
import { createCollectibleQueryKey } from './queryKeys';
import type {
  GetPrimarySaleItemRequest,
  GetPrimarySaleItemResponse,
} from '@0xsequence/api-client';

export interface FetchPrimarySaleItemParams {
  chainId: string;
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
    chainId: params.chainId ?? '',
    primarySaleContractAddress: params.primarySaleContractAddress ?? '',
    tokenId: params.tokenId?.toString() ?? '',
  });
}

export function primarySaleItemQueryOptions(
  params: PrimarySaleItemQueryOptions,
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

export type { GetPrimarySaleItemRequest, GetPrimarySaleItemResponse };
