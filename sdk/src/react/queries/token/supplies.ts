import type {
	Address,
	GetTokenSuppliesRequest,
	IndexerPage,
} from '@0xsequence/api-client';
import { infiniteQueryOptions } from '@tanstack/react-query';
import {
	getIndexerClient,
	type SdkInfiniteQueryParams,
	type WithRequired,
} from '../../_internal';
import { createTokenQueryKey } from './queryKeys';

export type FetchTokenSuppliesParams = Omit<
	GetTokenSuppliesRequest,
	'contractAddress' | 'collectionAddress'
> & {
	chainId: number;
	collectionAddress: Address;
	page?: IndexerPage;
};

export type TokenSuppliesQueryOptions =
	SdkInfiniteQueryParams<FetchTokenSuppliesParams>;

/**
 * Fetches token supplies with support for indexer API
 */
export async function fetchTokenSupplies(
	params: WithRequired<
		TokenSuppliesQueryOptions,
		'chainId' | 'collectionAddress' | 'config'
	>,
) {
	const { chainId, config, ...apiParams } = params;
	const indexerClient = getIndexerClient(chainId, config);
	const result = await indexerClient.getTokenSupplies(apiParams);
	return result;
}

export function getTokenSuppliesQueryKey(params: TokenSuppliesQueryOptions) {
	const apiArgs = {
		chainId: params.chainId ?? 0,
		collectionAddress: params.collectionAddress ?? '',
		includeMetadata: params.includeMetadata,
		metadataOptions: params.metadataOptions,
	};

	return createTokenQueryKey('supplies', apiArgs);
}

export function tokenSuppliesQueryOptions(params: TokenSuppliesQueryOptions) {
	const enabled = Boolean(
		params.chainId &&
			params.collectionAddress &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	const initialPageParam: IndexerPage = { page: 1, pageSize: 30, more: false };

	const queryFn = async ({ pageParam = initialPageParam }) => {
		const requiredParams = params as WithRequired<
			TokenSuppliesQueryOptions,
			'chainId' | 'collectionAddress' | 'config'
		>;
		return fetchTokenSupplies({
			chainId: requiredParams.chainId,
			collectionAddress: requiredParams.collectionAddress,
			config: requiredParams.config,
			includeMetadata: params.includeMetadata,
			metadataOptions: params.metadataOptions,
			page: pageParam,
		});
	};

	return infiniteQueryOptions({
		queryKey: getTokenSuppliesQueryKey(params),
		queryFn,
		initialPageParam,
		getNextPageParam: (lastPage) =>
			lastPage.page?.more ? lastPage.page : undefined,
		...params.query,
		enabled,
	});
}
