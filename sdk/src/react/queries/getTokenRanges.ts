import type { GetTokenIDRangesReturn } from '@0xsequence/indexer';
import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import { type ValuesOptional, getIndexerClient } from '../_internal';
import type { StandardQueryOptions } from '../types/query';

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
): Promise<GetTokenIDRangesReturn> {
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

export function getTokenRangesQueryOptions(params: GetTokenRangesQueryOptions) {
	const enabled = Boolean(
		params.chainId &&
			params.collectionAddress &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: ['indexer', 'tokenRanges', params],
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
