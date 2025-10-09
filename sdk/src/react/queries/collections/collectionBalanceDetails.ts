import type { GetTokenBalancesDetailsReturn } from '@0xsequence/indexer';
import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import {
	balanceQueries,
	getIndexerClient,
	type ValuesOptional,
} from '../_internal';
import type { StandardQueryOptions } from '../types/query';

export interface CollectionBalanceFilter {
	accountAddresses: Array<Address>;
	contractWhitelist?: Array<Address>;
	omitNativeBalances: boolean;
}

export interface FetchCollectionBalanceDetailsParams {
	chainId: number;
	filter: CollectionBalanceFilter;
	config: SdkConfig;
}

/**
 * Fetches detailed balance information for multiple accounts from the Indexer API
 */
export async function fetchCollectionBalanceDetails(
	params: FetchCollectionBalanceDetailsParams,
): Promise<GetTokenBalancesDetailsReturn> {
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
	const mergedResponse = responses.reduce<GetTokenBalancesDetailsReturn>(
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
		{ page: {}, nativeBalances: [], balances: [] },
	);

	if (!mergedResponse) {
		throw new Error('Failed to fetch collection balance details');
	}

	return mergedResponse;
}

export type CollectionBalanceDetailsQueryOptions =
	ValuesOptional<FetchCollectionBalanceDetailsParams> & {
		query?: StandardQueryOptions;
	};

export function getCollectionBalanceDetailsQueryKey(
	params: CollectionBalanceDetailsQueryOptions,
) {
	const apiArgs = {
		chainId: params.chainId!,
		filter: params.filter!,
	};

	return [...balanceQueries.collectionBalanceDetails, apiArgs] as const;
}

export function collectionBalanceDetailsQueryOptions(
	params: CollectionBalanceDetailsQueryOptions,
) {
	const enabled = Boolean(
		params.chainId &&
			params.filter?.accountAddresses?.length &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getCollectionBalanceDetailsQueryKey(params),
		queryFn: () =>
			fetchCollectionBalanceDetails({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				filter: params.filter!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
			}),
		...params.query,
		enabled,
	});
}
