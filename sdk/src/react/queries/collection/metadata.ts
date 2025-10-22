import type { GetContractInfoArgs } from '@0xsequence/metadata';
import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import {
	getMetadataClient,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../../_internal';

import type { StandardQueryOptions } from '../../types/query';

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

export function getCollectionQueryKey(params: CollectionQueryOptions) {
	const apiArgs = {
		chainID: String(params.chainId),
		contractAddress: params.collectionAddress,
	} satisfies QueryKeyArgs<GetContractInfoArgs>;

	return ['collection', 'metadata', apiArgs] as const;
}

export function collectionQueryOptions(params: CollectionQueryOptions) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getCollectionQueryKey(params),
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
