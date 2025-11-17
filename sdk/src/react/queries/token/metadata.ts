import type { GetTokenMetadataArgs } from '@0xsequence/marketplace-api';
import type { SdkConfig } from '../../../types';
import {
	buildQueryOptions,
	getMetadataClient,
	type QueryKeyArgs,
	type WithOptionalParams,
} from '../../_internal';
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
		chainId,
		contractAddress,
		tokenIds,
	});

	return response.tokenMetadata;
}

export type ListTokenMetadataQueryOptions =
	WithOptionalParams<FetchListTokenMetadataParams>;

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
	return buildQueryOptions(
		{
			getQueryKey: getListTokenMetadataQueryKey,
			requiredParams: [
				'chainId',
				'contractAddress',
				'tokenIds',
				'config',
			] as const,
			fetcher: fetchListTokenMetadata,
		},
		params,
	);
}
