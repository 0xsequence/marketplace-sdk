import type { Indexer } from '@0xsequence/marketplace-api';
import type { Address } from 'viem';
import {
	buildQueryOptions,
	getIndexerClient,
	type SdkQueryParams,
	type WithRequired,
} from '../../_internal';
import { createTokenQueryKey } from './queryKeys';

export interface FetchGetTokenRangesParams {
	chainId: number;
	collectionAddress: Address;
}

export type GetTokenRangesQueryOptions =
	SdkQueryParams<FetchGetTokenRangesParams>;

/**
 * Fetches token ID ranges for a collection from the Indexer API
 */
export async function fetchGetTokenRanges(
	params: WithRequired<
		GetTokenRangesQueryOptions,
		'chainId' | 'collectionAddress' | 'config'
	>,
): Promise<Indexer.GetTokenIDRangesResponse> {
	const { chainId, collectionAddress, config } = params;
	const indexerClient = getIndexerClient(chainId, config);
	const response = await indexerClient.getTokenIDRanges({ collectionAddress });

	if (!response) {
		throw new Error('Failed to fetch token ranges');
	}

	return response;
}

export function getTokenRangesQueryKey(params: GetTokenRangesQueryOptions) {
	const apiArgs = {
		chainId: params.chainId,
		collectionAddress: params.collectionAddress,
	};

	return createTokenQueryKey('ranges', apiArgs);
}

export function getTokenRangesQueryOptions(params: GetTokenRangesQueryOptions) {
	return buildQueryOptions(
		{
			getQueryKey: getTokenRangesQueryKey,
			requiredParams: ['chainId', 'collectionAddress', 'config'] as const,
			fetcher: fetchGetTokenRanges,
		},
		params,
	);
}
