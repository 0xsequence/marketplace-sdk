import type { GetTokenSuppliesMapArgs } from '@0xsequence/indexer';
import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import {
	getIndexerClient,
	LaosAPI,
	tokenKeys,
	type ValuesOptional,
} from '../_internal';
import type { StandardQueryOptions } from '../types/query';

export interface FetchGetTokenSuppliesMapParams
	extends Omit<GetTokenSuppliesMapArgs, 'tokenMap'> {
	chainId: number;
	tokenIds: string[];
	collectionAddress: string;
	config: SdkConfig;
	isLaos721?: boolean;
}

export interface NormalizedTokenSuppliesResponse {
	tokenIDs: Array<{ tokenID: string; supply: string }>;
}

/**
 * Fetches token supplies map with support for both indexer and LAOS APIs
 * Returns a normalized structure that always has the same format
 */
export async function fetchGetTokenSuppliesMap(
	params: FetchGetTokenSuppliesMapParams,
): Promise<NormalizedTokenSuppliesResponse> {
	const { chainId, tokenIds, collectionAddress, config, isLaos721, ...rest } =
		params;

	if (isLaos721) {
		const laosApi = new LaosAPI();
		const result = await laosApi.getTokenSupplies({
			chainId: chainId.toString(),
			contractAddress: collectionAddress,
			...rest,
		});

		return result as NormalizedTokenSuppliesResponse;
	}

	const indexerClient = getIndexerClient(chainId, config);

	const apiArgs: GetTokenSuppliesMapArgs = {
		tokenMap: {
			[collectionAddress]: tokenIds,
		},
		...rest,
	};

	const result = await indexerClient.getTokenSuppliesMap(apiArgs);

	// Normalize indexer response to match LAOS format
	const supplies = result.supplies[collectionAddress] || [];
	return {
		tokenIDs: supplies,
	};
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

	return queryOptions<NormalizedTokenSuppliesResponse>({
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
				isLaos721: params.isLaos721,
				includeMetadata: params.includeMetadata,
				metadataOptions: params.metadataOptions,
			}),
		...params.query,
		enabled,
	});
}
