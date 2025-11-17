import type { Address } from '@0xsequence/marketplace-api';
import type { SdkConfig } from '../../../types';
import {
	buildQueryOptions,
	getMetadataClient,
	type WithOptionalParams,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';
import { createCollectionQueryKey } from './queryKeys';

export interface FetchCollectionParams {
	chainId: number;
	collectionAddress: Address;
	config: SdkConfig;
	query?: StandardQueryOptions;
}

/**
 * Fetches collection information from the metadata API
 */
export async function fetchCollection(params: FetchCollectionParams) {
	const { chainId, collectionAddress, config } = params;

	const metadataClient = getMetadataClient(config);

	const result = await metadataClient.getContractInfo({
		chainId,
		contractAddress: collectionAddress,
	});

	return result.contractInfo;
}

export type CollectionQueryOptions = WithOptionalParams<FetchCollectionParams>;

export function getCollectionQueryKey(params: CollectionQueryOptions) {
	return createCollectionQueryKey('metadata', {
		chainId: params.chainId,
		contractAddress: params.collectionAddress,
	});
}

export function collectionQueryOptions(params: CollectionQueryOptions) {
	return buildQueryOptions(
		{
			getQueryKey: getCollectionQueryKey,
			requiredParams: ['chainId', 'collectionAddress', 'config'] as const,
			fetcher: fetchCollection,
		},
		params,
	);
}
