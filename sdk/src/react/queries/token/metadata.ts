import type { GetTokenMetadataArgs } from '@0xsequence/marketplace-api';
import {
	buildQueryOptions,
	getMetadataClient,
	type SdkQueryParams,
	type WithRequired,
} from '../../_internal';
import { createTokenQueryKey } from './queryKeys';

export interface FetchListTokenMetadataParams {
	chainId: number;
	contractAddress: string;
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
	const { config, contractAddress, chainId, tokenIds } = params;
	const metadataClient = getMetadataClient(config);

	const apiArgs: GetTokenMetadataArgs = {
		chainId,
		tokenIds,
		contractAddress,
	};

	const response = await metadataClient.getTokenMetadata(apiArgs);
	return response.tokenMetadata;
}

export function getListTokenMetadataQueryKey(
	params: ListTokenMetadataQueryOptions,
) {
	const apiArgs = {
		chainId: params.chainId,
		contractAddress: params.contractAddress,
		tokenIds: params.tokenIds,
	};

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
			customValidation: (p) => !!p.tokenIds && p.tokenIds.length > 0,
		},
		params,
	);
}
