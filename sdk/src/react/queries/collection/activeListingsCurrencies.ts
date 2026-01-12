import type {
	Address,
	Currency,
	GetCollectionActiveListingsCurrenciesRequest,
} from '@0xsequence/api-client';
import { isAddress } from 'viem';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';
import { createCollectionQueryKey } from './queryKeys';

export type FetchCollectionActiveListingsCurrenciesParams = Omit<
	GetCollectionActiveListingsCurrenciesRequest,
	'chainId' | 'contractAddress'
> & {
	chainId: number;
	collectionAddress: Address;
};

export type CollectionActiveListingsCurrenciesQueryOptions =
	SdkQueryParams<FetchCollectionActiveListingsCurrenciesParams>;

/**
 * Fetches the active listings currencies for a collection from the marketplace API
 */
export async function fetchCollectionActiveListingsCurrencies(
	params: WithRequired<
		CollectionActiveListingsCurrenciesQueryOptions,
		'chainId' | 'collectionAddress' | 'config'
	>,
): Promise<Currency[]> {
	const { collectionAddress, chainId, config } = params;

	const marketplaceClient = getMarketplaceClient(config);

	const result = await marketplaceClient.getCollectionActiveListingsCurrencies({
		contractAddress: collectionAddress,
		chainId: String(chainId),
	});
	return result.currencies;
}

export function getCollectionActiveListingsCurrenciesQueryKey(
	params: CollectionActiveListingsCurrenciesQueryOptions,
) {
	return createCollectionQueryKey('active-listings-currencies', {
		chainId: params.chainId,
		contractAddress: params.collectionAddress,
	});
}

export function collectionActiveListingsCurrenciesQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			CollectionActiveListingsCurrenciesQueryOptions,
			'chainId' | 'collectionAddress' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getCollectionActiveListingsCurrenciesQueryKey,
			requiredParams: ['chainId', 'collectionAddress', 'config'] as const,
			fetcher: fetchCollectionActiveListingsCurrencies,
			customValidation: (p) =>
				!!p.collectionAddress && isAddress(p.collectionAddress),
		},
		params,
	);
}
