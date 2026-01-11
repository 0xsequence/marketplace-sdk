import type {
	Address,
	ChainId,
	GetTokenBalancesRequest,
	IndexerPage,
	TokenId,
} from '@0xsequence/api-client';
import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Hex } from 'viem';
import {
	getIndexerClient,
	type SdkQueryParams,
	type WithRequired,
} from '../../_internal';
import { createTokenQueryKey } from './queryKeys';

export type FetchBalancesParams = Pick<
	GetTokenBalancesRequest,
	'accountAddress' | 'includeMetadata'
> & {
	chainId: ChainId;
	contractAddress?: Address;
	tokenId?: TokenId;
	metadataOptions?: {
		verifiedOnly?: boolean;
		unverifiedOnly?: boolean;
		includeContracts?: Hex[];
	};
	includeCollectionTokens?: boolean;
	page?: IndexerPage;
};

export type ListBalancesQueryOptions = SdkQueryParams<FetchBalancesParams>;

/**
 * @deprecated Use ListBalancesQueryOptions instead
 */
export type UseListBalancesArgs = Omit<ListBalancesQueryOptions, 'config'> & {
	config?: ListBalancesQueryOptions['config'];
};

export async function fetchBalances(
	params: WithRequired<
		ListBalancesQueryOptions,
		'chainId' | 'accountAddress' | 'config'
	>,
	page: IndexerPage,
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

	const queryFn = ({ pageParam }: { pageParam: IndexerPage }) => {
		const requiredParams = params as WithRequired<
			ListBalancesQueryOptions,
			'chainId' | 'accountAddress' | 'config'
		>;
		return fetchBalances(
			{
				...params,
				chainId: requiredParams.chainId,
				accountAddress: requiredParams.accountAddress,
				config: requiredParams.config,
			},
			pageParam,
		);
	};

	return infiniteQueryOptions({
		...params.query,
		enabled: (params.query?.enabled ?? true) && enabled,
		queryKey: getListBalancesQueryKey(params),
		queryFn,
		initialPageParam: { page: 1, pageSize: 30, more: false },
		getNextPageParam: (lastPage) =>
			lastPage.page?.more
				? {
						page: (lastPage.page.page ?? 0) + 1,
						pageSize: lastPage.page.pageSize,
						more: true,
					}
				: undefined,
	});
}
