import type {
	Address,
	GetTokenMetadataArgs,
} from '@0xsequence/marketplace-api';
import type { SdkConfig } from '../../../types';
import {
	buildQueryOptions,
	getMetadataClient,
	type WithOptionalParams,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';
import { createCollectibleQueryKey } from './queryKeys';

export interface FetchCollectibleParams {
	chainId: number;
	collectionAddress: Address;
	tokenId: bigint;
	config: SdkConfig;
	query?: StandardQueryOptions;
}

/**
 * Fetches collectible metadata from the metadata API
 */
export async function fetchCollectible(params: FetchCollectibleParams) {
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

export type CollectibleQueryOptions =
	WithOptionalParams<FetchCollectibleParams>;

/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'metadata', { chainId, contractAddress, tokenIds }]
 */
export function getCollectibleQueryKey(params: CollectibleQueryOptions) {
	const apiArgs = {
		chainId: params.chainId,
		contractAddress: params.collectionAddress,
		tokenIds: [params.tokenId!],
	};

	return createCollectibleQueryKey('metadata', apiArgs);
}

export function collectibleQueryOptions(params: CollectibleQueryOptions) {
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
		},
		params,
	);
}
