import type { GetContractInfoSdkArgs } from '@0xsequence/api-client';
import { isAddress } from 'viem';
import {
	buildQueryOptions,
	getMetadataClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';
import { createCollectionQueryKey } from './queryKeys';

export type FetchCollectionParams = GetContractInfoSdkArgs;

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
	// API wrapper handles collectionAddress → contractAddress transformation
	const result = await metadataClient.getContractInfo({
		chainId,
		collectionAddress,
	});
	return result.contractInfo;
}

export function getCollectionQueryKey(params: CollectionQueryOptions) {
	return createCollectionQueryKey('metadata', {
		chainId: params.chainId,
		contractAddress: params.collectionAddress,
	});
}

export function collectionQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			CollectionQueryOptions,
			'chainId' | 'collectionAddress' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getCollectionQueryKey,
			requiredParams: ['chainId', 'collectionAddress', 'config'] as const,
			fetcher: fetchCollection,
			customValidation: (p) =>
				!!p.collectionAddress && isAddress(p.collectionAddress),
		},
		params,
	);
}
