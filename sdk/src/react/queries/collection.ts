import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import { getMetadataClient, type ValuesOptional } from '../_internal';
import { collectionKeys } from '../_internal/api/query-keys';
import type { StandardQueryOptions } from '../types/query';

export interface FetchCollectionParams {
	chainId: number;
	collectionAddress: string;
	config: SdkConfig;
}

/**
 * Fetches collection information from the metadata API
 */
export async function fetchCollection(params: FetchCollectionParams) {
	const { collectionAddress, chainId, config } = params;

	const metadataClient = getMetadataClient(config);

	const result = await metadataClient.getContractInfo({
		chainID: chainId.toString(),
		contractAddress: collectionAddress,
	});

	return result.contractInfo;
}

export type CollectionQueryOptions = ValuesOptional<FetchCollectionParams> & {
	query?: StandardQueryOptions;
};

export function collectionQueryOptions(params: CollectionQueryOptions) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: [...collectionKeys.detail, params],
		queryFn: () =>
			fetchCollection({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
			}),
		...params.query,
		enabled,
	});
}
