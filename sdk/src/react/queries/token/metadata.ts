import type { GetTokenMetadataArgs } from '@0xsequence/marketplace-api';
import {
	buildQueryOptions,
	getMetadataClient,
	type QueryKeyArgs,
	type SdkQueryParams,
	type WithRequired,
} from '../../_internal';
import { createTokenQueryKey } from './queryKeys';

export interface FetchListTokenMetadataParams extends GetTokenMetadataArgs {
	tokenIds: bigint[];
}

export type ListTokenMetadataQueryOptions =
	SdkQueryParams<FetchListTokenMetadataParams>;

/**
 * Fetches token metadata from the metadata API
 */
export async function fetchListTokenMetadata(
	params: WithRequired<
		ListTokenMetadataQueryOptions,
		'chainId' | 'contractAddress' | 'tokenIds' | 'config'
	>,
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
