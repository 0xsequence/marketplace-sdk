import type { Indexer } from '@0xsequence/marketplace-api';
import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import {
	buildQueryOptions,
	getIndexerClient,
	type WithOptionalParams,
} from '../../_internal';
import { createTokenQueryKey } from './queryKeys';

export interface FetchGetTokenRangesParams {
	chainId: number;
	collectionAddress: Address;
	config: SdkConfig;
}

/**
 * Fetches token ID ranges for a collection from the Indexer API
 */
export async function fetchGetTokenRanges(
	params: FetchGetTokenRangesParams,
): Promise<Indexer.GetTokenIDRangesResponse> {
	const { chainId, collectionAddress, config } = params;

	const indexerClient = getIndexerClient(chainId, config);

	const response = await indexerClient.getTokenIDRanges({
		contractAddress: collectionAddress,
	});

	if (!response) {
		throw new Error('Failed to fetch token ranges');
	}

	return response;
}

export type GetTokenRangesQueryOptions =
	WithOptionalParams<FetchGetTokenRangesParams>;

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
