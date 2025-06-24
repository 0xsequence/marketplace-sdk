import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import {
	getMetadataClient,
	tokenKeys,
	type ValuesOptional,
} from '../_internal';
import type { StandardQueryOptions } from '../types/query';

export interface FetchListTokenMetadataParams {
	chainId: number;
	contractAddress: string;
	tokenIds: string[];
	config: SdkConfig;
}

/**
 * Fetches token metadata from the metadata API
 */
export async function fetchListTokenMetadata(
	params: FetchListTokenMetadataParams,
) {
	const { chainId, contractAddress, tokenIds, config } = params;
	const metadataClient = getMetadataClient(config);

	const response = await metadataClient.getTokenMetadata({
		chainID: chainId.toString(),
		contractAddress: contractAddress,
		tokenIDs: tokenIds,
	});

	return response.tokenMetadata;
}

export type ListTokenMetadataQueryOptions =
	ValuesOptional<FetchListTokenMetadataParams> & {
		query?: StandardQueryOptions;
	};

export function listTokenMetadataQueryOptions(
	params: ListTokenMetadataQueryOptions,
) {
	const enabled = Boolean(
		params.chainId &&
			params.contractAddress &&
			params.tokenIds?.length &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: [...tokenKeys.metadata, params],
		queryFn: () =>
			fetchListTokenMetadata({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				contractAddress: params.contractAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				tokenIds: params.tokenIds!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
			}),
		...params.query,
		enabled,
	});
}
