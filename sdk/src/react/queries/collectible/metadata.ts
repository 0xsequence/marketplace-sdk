import type { GetTokenMetadataArgs } from '@0xsequence/marketplace-api';
import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import {
	getMetadataClient,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';
import { createCollectibleQueryKey } from './queryKeys';

export interface FetchCollectibleParams
	extends Omit<
		GetTokenMetadataArgs,
		'chainId' | 'contractAddress' | 'tokenIds'
	> {
	chainId: number;
	collectionAddress: string;
	collectibleId: bigint;
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
		chainId: chainId,
		tokenIds: [collectibleId],
	};

	const result = await metadataClient.getTokenMetadata(apiArgs);
	return result.tokenMetadata[0];
}

export type CollectibleQueryOptions = ValuesOptional<FetchCollectibleParams> & {
	query?: StandardQueryOptions;
};

/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'metadata', { chainId, contractAddress, tokenIds }]
 */
export function getCollectibleQueryKey(params: CollectibleQueryOptions) {
	const apiArgs = {
		chainId: params.chainId,
		contractAddress: params.collectionAddress,
		// biome-ignore lint/style/noNonNullAssertion: Dont need to validate here
		tokenIds: [params.collectibleId!],
	} satisfies QueryKeyArgs<GetTokenMetadataArgs>;

	return createCollectibleQueryKey('metadata', apiArgs);
}

export function collectibleQueryOptions(params: CollectibleQueryOptions) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.collectibleId &&
			params.chainId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getCollectibleQueryKey(params),
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
