import type { GetTokenMetadataArgs } from '@0xsequence/metadata';
import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import { type ValuesOptional, getMetadataClient } from '../_internal';
import { collectableKeys } from '../_internal/api/query-keys';
import type { StandardQueryOptions } from '../types/query';

export interface FetchCollectibleParams
	extends Omit<
		GetTokenMetadataArgs,
		'chainID' | 'contractAddress' | 'tokenIDs'
	> {
	chainId: number;
	collectionAddress: string;
	collectibleId: string;
	config: SdkConfig;
}

/**
 * Fetches collectible metadata from the metadata API
 */
export async function fetchCollectible(params: FetchCollectibleParams) {
	const { collectionAddress, collectibleId, chainId, config } = params;

	const metadataClient = getMetadataClient(config);

	const apiArgs: GetTokenMetadataArgs = {
		contractAddress: collectionAddress,
		chainID: String(chainId),
		tokenIDs: [collectibleId],
	};

	const result = await metadataClient.getTokenMetadata(apiArgs);
	return result.tokenMetadata[0];
}

export type CollectibleQueryOptions = ValuesOptional<FetchCollectibleParams> & {
	query?: StandardQueryOptions;
};

export function collectibleQueryOptions(params: CollectibleQueryOptions) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.collectibleId &&
			params.chainId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: [...collectableKeys.details, params],
		queryFn: () =>
			fetchCollectible({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectibleId: params.collectibleId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
			}),
		...params.query,
		enabled,
	});
}
