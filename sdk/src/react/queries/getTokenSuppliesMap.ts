import type { GetTokenSuppliesMapArgs } from '@0xsequence/indexer';
import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import {
	type ValuesOptional,
	collectableKeys,
	getIndexerClient,
} from '../_internal';
import type { StandardQueryOptions } from '../types/query';

export interface FetchGetTokenSuppliesMapParams
	extends Omit<GetTokenSuppliesMapArgs, 'tokenMap'> {
	chainId: number;
	tokenIds: string[];
	collectionAddress: string;
	config: SdkConfig;
}

/**
 * Fetches token supplies mapping from the indexer API
 */
export async function fetchGetTokenSuppliesMap(
	params: FetchGetTokenSuppliesMapParams,
) {
	const { chainId, tokenIds, collectionAddress, config } = params;
	const indexerClient = getIndexerClient(chainId, config);

	const {
		chainId: _,
		tokenIds: __,
		collectionAddress: ___,
		config: ____,
		...restParams
	} = params;

	return indexerClient.getTokenSuppliesMap({
		tokenMap: {
			[collectionAddress]: tokenIds,
		},
		includeMetadata: false,
		...restParams,
	});
}

export type GetTokenSuppliesMapQueryOptions =
	ValuesOptional<FetchGetTokenSuppliesMapParams> & {
		query?: StandardQueryOptions;
	};

export function getTokenSuppliesMapQueryOptions(
	params: GetTokenSuppliesMapQueryOptions,
) {
	const enabled = Boolean(
		params.chainId &&
			params.tokenIds?.length &&
			params.collectionAddress &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: [...collectableKeys.lists, 'tokenSuppliesMap', params],
		queryFn: () =>
			fetchGetTokenSuppliesMap({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				tokenIds: params.tokenIds!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
			}),
		...params.query,
		enabled,
	});
}
