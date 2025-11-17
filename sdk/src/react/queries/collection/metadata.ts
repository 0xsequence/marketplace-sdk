import type { Address, GetContractInfoArgs } from '@0xsequence/marketplace-api';
import {
	buildQueryOptions,
	getMetadataClient,
	type SdkQueryParams,
	type WithRequired,
} from '../../_internal';
import { createCollectionQueryKey } from './queryKeys';

export interface FetchCollectionParams extends GetContractInfoArgs {
	collectionAddress: Address;
}

export type CollectionQueryOptions = SdkQueryParams<FetchCollectionParams>;

/**
 * Fetches collection information from the metadata API
 */
export async function fetchCollection(
	params: WithRequired<
		CollectionQueryOptions,
		'chainId' | 'collectionAddress' | 'config'
	>,
) {
	const { chainId, collectionAddress, config } = params;

	const metadataClient = getMetadataClient(config);

	const result = await metadataClient.getContractInfo({
		chainId,
		contractAddress: collectionAddress,
	});

	return result.contractInfo;
}

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
