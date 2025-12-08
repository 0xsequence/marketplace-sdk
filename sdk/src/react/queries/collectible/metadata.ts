import type { Address, GetTokenMetadataArgs } from '@0xsequence/api-client';
import {
	buildQueryOptions,
	getMetadataClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';
import { createCollectibleQueryKey } from './queryKeys';

export interface FetchCollectibleParams {
	chainId: number;
	collectionAddress: Address;
	tokenId: bigint;
}

export type CollectibleQueryOptions = SdkQueryParams<FetchCollectibleParams>;

/**
 * Fetches collectible metadata from the metadata API
 */
export async function fetchCollectible(
	params: WithRequired<
		CollectibleQueryOptions,
		'chainId' | 'collectionAddress' | 'tokenId' | 'config'
	>,
) {
	const { tokenId, chainId, collectionAddress, config } = params;

	const metadataClient = getMetadataClient(config);

	const apiArgs: GetTokenMetadataArgs = {
		chainId,
		contractAddress: collectionAddress,
		tokenIds: [tokenId],
	};

	const result = await metadataClient.getTokenMetadata(apiArgs);
	return result.tokenMetadata[0];
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
			customValidation: (p) => !!p.chainId && p.chainId > 0,
		},
		params,
	);
}
