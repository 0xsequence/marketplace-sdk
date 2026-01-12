import type {
	GetTokenMetadataSdkArgs,
	TokenMetadata,
} from '@0xsequence/api-client';
import {
	buildQueryOptions,
	getMetadataClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';
import { createTokenQueryKey } from './queryKeys';

export type FetchListTokenMetadataParams = GetTokenMetadataSdkArgs;

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
): Promise<TokenMetadata[]> {
	const { config, contractAddress, chainId, tokenIds } = params;
	const metadataClient = getMetadataClient(config);

	const apiArgs = {
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
	params: WithOptionalParams<
		WithRequired<
			ListTokenMetadataQueryOptions,
			'chainId' | 'contractAddress' | 'tokenIds' | 'config'
		>
	>,
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
			customValidation: (p) =>
				!!p.chainId &&
				p.chainId > 0 &&
				!!p.tokenIds &&
				p.tokenIds.length > 0 &&
				!!p.contractAddress,
		},
		params,
	);
}
