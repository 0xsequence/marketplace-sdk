import type { GetTokenMetadataArgs } from '@0xsequence/api-client';
import type { Address } from 'viem';
import {
	buildQueryOptions,
	getMetadataClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';
import { createTokenQueryKey } from './queryKeys';

export interface FetchListTokenMetadataParams {
	chainId: number;
	contractAddress: Address;
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
