import type { Indexer } from '@0xsequence/marketplace-api';
import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Address, Hex } from 'viem';
import {
	getIndexerClient,
	type SdkQueryParams,
	type WithRequired,
} from '../../_internal';
import { createTokenQueryKey } from './queryKeys';

export interface FetchBalancesParams {
	chainId: number;
	accountAddress?: Address;
	contractAddress?: Address;
	tokenId?: bigint;
	includeMetadata?: boolean;
	metadataOptions?: {
		verifiedOnly?: boolean;
		unverifiedOnly?: boolean;
		includeContracts?: Hex[];
	};
	includeCollectionTokens?: boolean;
	page?: Indexer.Page;
}

export type ListBalancesQueryOptions = SdkQueryParams<FetchBalancesParams>;

/**
 * @deprecated Use ListBalancesQueryOptions instead
 */
export type UseListBalancesArgs = ListBalancesQueryOptions;

export async function fetchBalances(
	params: WithRequired<
		ListBalancesQueryOptions,
		'chainId' | 'accountAddress' | 'config'
	>,
	page: Indexer.Page,
) {
	const {
		chainId,
		accountAddress,
		contractAddress,
		tokenId,
		includeMetadata,
		metadataOptions,
		config,
	} = params;
	const indexerClient = getIndexerClient(chainId, config);
	return indexerClient.getTokenBalances({
		accountAddress,
		contractAddress,
		tokenId,
		includeMetadata,
		metadataOptions,
		page,
	});
}

export function getListBalancesQueryKey(params: ListBalancesQueryOptions) {
	const apiArgs = {
		chainId: params.chainId,
		accountAddress: params.accountAddress,
		contractAddress: params.contractAddress,
		tokenId: params.tokenId,
		includeMetadata: params.includeMetadata,
		metadataOptions: params.metadataOptions,
		includeCollectionTokens: params.includeCollectionTokens,
	};

	return createTokenQueryKey('balances', apiArgs);
}

/**
 * Creates a tanstack infinite query options object for the balances query
 *
 * @param params - The query parameters including config
 * @returns Query options configuration
 */
export function listBalancesOptions(params: ListBalancesQueryOptions) {
	const enabled =
		!!params.chainId && !!params.accountAddress && !!params.config;

	return infiniteQueryOptions({
		...params.query,
		enabled: (params.query?.enabled ?? true) && enabled,
		queryKey: getListBalancesQueryKey(params),
		queryFn: ({ pageParam }) =>
			fetchBalances(
				{
					...params,
					// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
					chainId: params.chainId!,
					// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
					accountAddress: params.accountAddress!,
					// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
					config: params.config!,
				},
				pageParam,
			),
		initialPageParam: { page: 1, pageSize: 30, more: false },
		getNextPageParam: (lastPage) =>
			lastPage.page?.more
				? {
						page: lastPage.page.page + 1,
						pageSize: lastPage.page.pageSize,
						more: true,
					}
				: undefined,
	});
}
