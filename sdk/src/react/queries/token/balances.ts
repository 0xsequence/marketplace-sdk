import type { Address, Hex } from 'viem';
import {
	buildInfiniteQueryOptions,
	getIndexerClient,
	type Optional,
	type SdkQueryParams,
	type WithOptionalInfiniteParams,
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
	page: { page: number; pageSize: number; more?: boolean },
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
		page: {
			page: page.page,
			pageSize: page.pageSize,
			more: page.more ?? false,
		},
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
export function listBalancesOptions(
	params: WithOptionalInfiniteParams<
		WithRequired<
			ListBalancesQueryOptions,
			'chainId' | 'accountAddress' | 'contractAddress' | 'config'
		>
	>,
) {
	return buildInfiniteQueryOptions(
		{
			getQueryKey: getListBalancesQueryKey,
			requiredParams: [
				'chainId',
				'accountAddress',
				'contractAddress',
				'config',
			] as const,
			fetcher: fetchBalances,
			getPageInfo: (response) => {
				if (!response.page) return undefined;
				return {
					page: response.page.page,
					pageSize: response.page.pageSize,
					more: response.page.more ?? false,
				};
			},
			customValidation: (p) =>
				!!p.chainId &&
				p.chainId > 0 &&
				!!p.accountAddress &&
				!!p.contractAddress,
		},
		params,
	);
}
