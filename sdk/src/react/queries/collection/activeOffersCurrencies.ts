import type {
	Currency,
	GetCollectionActiveOffersCurrenciesRequest,
} from '@0xsequence/api-client';
import type { Address } from '@0xsequence/api-client';
import { isAddress } from 'viem';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';
import { createCollectionQueryKey } from './queryKeys';

export type FetchCollectionActiveOffersCurrenciesParams = Omit<
	GetCollectionActiveOffersCurrenciesRequest,
	'chainId' | 'contractAddress'
> & {
	chainId: number;
	collectionAddress: Address;
};

export type CollectionActiveOffersCurrenciesQueryOptions =
	SdkQueryParams<FetchCollectionActiveOffersCurrenciesParams>;

/**
 * Fetches the active offers currencies for a collection from the marketplace API
 */
export async function fetchCollectionActiveOffersCurrencies(
	params: WithRequired<
		CollectionActiveOffersCurrenciesQueryOptions,
		'chainId' | 'collectionAddress' | 'config'
	>,
): Promise<Currency[]> {
	const { collectionAddress, chainId, config } = params;

	const marketplaceClient = getMarketplaceClient(config);

	const result = await marketplaceClient.getCollectionActiveOffersCurrencies({
		contractAddress: collectionAddress,
		chainId: String(chainId),
	});
	return result.currencies;
}

export function getCollectionActiveOffersCurrenciesQueryKey(
	params: CollectionActiveOffersCurrenciesQueryOptions,
) {
	return createCollectionQueryKey('active-offers-currencies', {
		chainId: params.chainId,
		contractAddress: params.collectionAddress,
	});
}

export function collectionActiveOffersCurrenciesQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			CollectionActiveOffersCurrenciesQueryOptions,
			'chainId' | 'collectionAddress' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getCollectionActiveOffersCurrenciesQueryKey,
			requiredParams: ['chainId', 'collectionAddress', 'config'] as const,
			fetcher: fetchCollectionActiveOffersCurrencies,
			customValidation: (p) =>
				!!p.collectionAddress && isAddress(p.collectionAddress),
		},
		params,
	);
}
