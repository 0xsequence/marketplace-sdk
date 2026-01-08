import type { Indexer } from '@0xsequence/api-client';
import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Address, Hex } from 'viem';
import {
	getIndexerClient,
	type Optional,
	type SdkQueryParams,
	type WithRequired,
} from '../../_internal';
import { createTokenQueryKey } from './queryKeys';

export interface FetchBalancesParams {
	chainId: number;
	accountAddress: Address;
	contractAddress: Address;
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
 * Balances query params with accountAddress and contractAddress as required
 */
export type UseListBalancesParams = Optional<
	ListBalancesQueryOptions,
	'config'
> &
	Required<
		Pick<ListBalancesQueryOptions, 'accountAddress' | 'contractAddress'>
	>;

export async function fetchBalances(
	params: WithRequired<
		ListBalancesQueryOptions,
		'chainId' | 'accountAddress' | 'contractAddress' | 'config'
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
		!!params.chainId &&
		!!params.accountAddress &&
		!!params.contractAddress &&
		!!params.config;

	const queryFn = ({ pageParam }: { pageParam: Indexer.Page }) => {
		const requiredParams = params as WithRequired<
			ListBalancesQueryOptions,
			'chainId' | 'accountAddress' | 'contractAddress' | 'config'
		>;
		return fetchBalances(
			{
				...params,
				chainId: requiredParams.chainId,
				accountAddress: requiredParams.accountAddress,
				contractAddress: requiredParams.contractAddress,
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
						page: lastPage.page.page + 1,
						pageSize: lastPage.page.pageSize,
						more: true,
					}
				: undefined,
	});
}
