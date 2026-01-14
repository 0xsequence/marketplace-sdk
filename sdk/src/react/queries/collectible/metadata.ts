import type {
	GetSingleTokenMetadataArgs,
	GetTokenMetadataArgs,
	TokenMetadata,
} from '@0xsequence/api-client';
import { isAddress } from 'viem';
import {
	buildQueryOptions,
	getMetadataClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';
import { createCollectibleQueryKey } from './queryKeys';

export type FetchCollectibleParams = GetSingleTokenMetadataArgs;

export type CollectibleQueryOptions = SdkQueryParams<FetchCollectibleParams>;

/**
 * Fetches collectible metadata from the metadata API
 */
export async function fetchCollectible(
	params: WithRequired<
		CollectibleQueryOptions,
		'chainId' | 'collectionAddress' | 'tokenId' | 'config'
	>,
): Promise<TokenMetadata | undefined> {
	const { tokenId, chainId, collectionAddress, config } = params;

	const metadataClient = getMetadataClient(config);

	const apiArgs: GetTokenMetadataArgs = {
		chainId,
		contractAddress: collectionAddress,
		tokenIds: [tokenId],
	};

	const result = await metadataClient.getTokenMetadata(apiArgs);
	// TanStack Query v5 requires non-undefined return values
	return result.tokenMetadata[0] ?? null;
}

/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'metadata', { chainId, contractAddress, tokenIds }]
 */
export function getCollectibleQueryKey(params: CollectibleQueryOptions) {
	const apiArgs = {
		chainId: params.chainId,
		contractAddress: params.collectionAddress,
		tokenIds: params.tokenId !== undefined ? [params.tokenId] : [],
	};

	return createCollectibleQueryKey('metadata', apiArgs);
}

export function collectibleQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			CollectibleQueryOptions,
			'chainId' | 'collectionAddress' | 'tokenId' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getCollectibleQueryKey,
			requiredParams: [
				'chainId',
				'collectionAddress',
				'tokenId',
				'config',
			] as const,
			fetcher: fetchCollectible,
			customValidation: (p) =>
				!!p.chainId &&
				p.chainId > 0 &&
				!!p.collectionAddress &&
				isAddress(p.collectionAddress),
		},
		params,
	);
}
