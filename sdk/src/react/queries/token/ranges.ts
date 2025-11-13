import type { Indexer } from '@0xsequence/marketplace-api';
import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import { getIndexerClient, type ValuesOptional } from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';
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
	ValuesOptional<FetchGetTokenRangesParams> & {
		query?: StandardQueryOptions;
	};

export function getTokenRangesQueryKey(params: GetTokenRangesQueryOptions) {
	const apiArgs = {
		chainId: params.chainId!,
		contractAddress: params.collectionAddress!,
	};

	return createTokenQueryKey('ranges', apiArgs);
}

export function getTokenRangesQueryOptions(params: GetTokenRangesQueryOptions) {
	const enabled = Boolean(
		params.chainId &&
			params.collectionAddress &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getTokenRangesQueryKey(params),
		queryFn: () =>
			fetchGetTokenRanges({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
			}),
		...params.query,
		enabled,
	});
}
