import type {
	ChainId,
	GetTokenBalancesDetailsRequest,
	Indexer,
	TokenBalancesFilter,
} from '@0xsequence/api-client';
import {
	buildQueryOptions,
	getIndexerClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';
import { createCollectionQueryKey } from './queryKeys';

export type CollectionBalanceFilter = TokenBalancesFilter;

export type FetchCollectionBalanceDetailsParams = GetTokenBalancesDetailsRequest & {
	chainId: ChainId;
};

export type CollectionBalanceDetailsQueryOptions =
	SdkQueryParams<FetchCollectionBalanceDetailsParams>;

/**
 * Fetches detailed balance information for multiple accounts from the Indexer API
 */
export async function fetchCollectionBalanceDetails(
	params: WithRequired<
		CollectionBalanceDetailsQueryOptions,
		'chainId' | 'filter' | 'config'
	>,
): Promise<Indexer.GetTokenBalancesDetailsResponse> {
	const { chainId, filter, config } = params;

	const indexerClient = getIndexerClient(chainId, config);

	const promises = filter.accountAddresses.map((accountAddress) =>
		indexerClient.getTokenBalancesDetails({
			filter: {
				accountAddresses: [accountAddress],
				contractWhitelist: filter.contractWhitelist,
				omitNativeBalances: filter.omitNativeBalances,
			},
		}),
	);

	const responses = await Promise.all(promises);
	const mergedResponse =
		responses.reduce<Indexer.GetTokenBalancesDetailsResponse>(
			(acc, curr) => {
				if (!curr) return acc;
				return {
					page: curr.page,
					nativeBalances: [
						...(acc.nativeBalances || []),
						...(curr.nativeBalances || []),
					],
					balances: [...(acc.balances || []), ...(curr.balances || [])],
				};
			},
			{
				page: { page: 0, pageSize: 0, more: false },
				nativeBalances: [],
				balances: [],
			},
		);

	if (!mergedResponse) {
		throw new Error('Failed to fetch collection balance details');
	}

	return mergedResponse;
}

export function getCollectionBalanceDetailsQueryKey(
	params: CollectionBalanceDetailsQueryOptions,
) {
	const { chainId, filter } = params;

	return createCollectionQueryKey('balance-details', { chainId, filter });
}

export function collectionBalanceDetailsQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			CollectionBalanceDetailsQueryOptions,
			'chainId' | 'filter' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getCollectionBalanceDetailsQueryKey,
			requiredParams: ['chainId', 'filter', 'config'] as const,
			fetcher: fetchCollectionBalanceDetails,
			customValidation: (p) =>
				!!p.filter?.accountAddresses && p.filter.accountAddresses.length > 0,
		},
		params,
	);
}
