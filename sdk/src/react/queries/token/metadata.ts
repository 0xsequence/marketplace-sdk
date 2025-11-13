import type { GetTokenMetadataArgs } from '@0xsequence/marketplace-api';
import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import {
	getMetadataClient,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';
import { createTokenQueryKey } from './queryKeys';

export interface FetchListTokenMetadataParams {
	chainId: number;
	contractAddress: string;
	tokenIds: bigint[];
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
		chainId: chainId,
		contractAddress: contractAddress,
		tokenIds: tokenIds,
	});

	return response.tokenMetadata;
}

export type ListTokenMetadataQueryOptions =
	ValuesOptional<FetchListTokenMetadataParams> & {
		query?: StandardQueryOptions;
	};

export function getListTokenMetadataQueryKey(
	params: ListTokenMetadataQueryOptions,
) {
	const apiArgs = {
		chainId: params.chainId,
		contractAddress: params.contractAddress,
		tokenIds: params.tokenIds,
	} satisfies QueryKeyArgs<GetTokenMetadataArgs>;

	return createTokenQueryKey('metadata', apiArgs);
}

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
		queryKey: getListTokenMetadataQueryKey(params),
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
