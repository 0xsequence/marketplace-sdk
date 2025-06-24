import type { GetTokenSuppliesMapArgs } from '@0xsequence/indexer';
import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import { getIndexerClient, tokenKeys, type ValuesOptional } from '../_internal';
import type { StandardQueryOptions } from '../types/query';

export interface FetchGetTokenSuppliesMapParams
	extends Omit<GetTokenSuppliesMapArgs, 'tokenMap'> {
	chainId: number;
	tokenIds: string[];
	collectionAddress: string;
	config: SdkConfig;
}

/**
 * Fetches token supplies map from the indexer API
 */
export async function fetchGetTokenSuppliesMap(
	params: FetchGetTokenSuppliesMapParams,
) {
	const { chainId, tokenIds, collectionAddress, config, ...indexerArgs } =
		params;
	const indexerClient = getIndexerClient(chainId, config);

	const apiArgs: GetTokenSuppliesMapArgs = {
		tokenMap: {
			[collectionAddress]: tokenIds,
		},
		...indexerArgs,
	};

	const result = await indexerClient.getTokenSuppliesMap(apiArgs);
	return result;
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
		queryKey: [...tokenKeys.supplies, params],
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
				includeMetadata: params.includeMetadata,
				metadataOptions: params.metadataOptions,
			}),
		...params.query,
		enabled,
	});
}
