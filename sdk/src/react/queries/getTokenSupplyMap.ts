import type {
	GetTokenSuppliesMapArgs,
	GetTokenSuppliesMapReturn,
	GetTokenSuppliesReturn,
} from '@0xsequence/indexer';
import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import {
	getIndexerClient,
	LaosAPI,
	tokenKeys,
	type ValuesOptional,
} from '../_internal';
import type { StandardQueryOptions } from '../types/query';

export interface FetchGetTokenSupplyMapParams
	extends Omit<GetTokenSuppliesMapArgs, 'tokenMap'> {
	chainId: number;
	tokenIds: string[];
	collectionAddress: string;
	config: SdkConfig;
	isLaos721?: boolean;
}

/**
 * Fetches token supplies map with support for both indexer and LAOS APIs
 * Returns a normalized structure that works with both API responses
 */
export async function fetchGetTokenSupplyMap(
	params: FetchGetTokenSupplyMapParams,
): Promise<GetTokenSuppliesMapReturn | GetTokenSuppliesReturn> {
	const {
		chainId,
		tokenIds,
		collectionAddress,
		config,
		isLaos721,
		...indexerArgs
	} = params;

	if (isLaos721) {
		const laosApi = new LaosAPI();
		return laosApi.getTokenSupplies({
			chainId: chainId.toString(),
			contractAddress: collectionAddress,
		});
	}

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

export type GetTokenSupplyMapQueryOptions =
	ValuesOptional<FetchGetTokenSupplyMapParams> & {
		query?: StandardQueryOptions;
	};

export function getTokenSupplyMapQueryOptions(
	params: GetTokenSupplyMapQueryOptions,
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
			fetchGetTokenSupplyMap({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				tokenIds: params.tokenIds!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				isLaos721: params.isLaos721,
				includeMetadata: params.includeMetadata,
				metadataOptions: params.metadataOptions,
			}),
		...params.query,
		enabled,
	});
}
