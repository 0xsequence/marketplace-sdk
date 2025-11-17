import type { Indexer } from '@0xsequence/marketplace-api';
import { infiniteQueryOptions } from '@tanstack/react-query';
import {
	getIndexerClient,
	type SdkInfiniteQueryParams,
	type WithRequired,
} from '../../_internal';
import { createTokenQueryKey } from './queryKeys';

export interface FetchTokenSuppliesParams
	extends Omit<
		Indexer.GetTokenSuppliesRequest,
		'contractAddress' | 'collectionAddress'
	> {
	chainId: number;
	collectionAddress: `0x${string}`;
	page?: Indexer.Page;
}

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
		chainId: params.chainId!,
		collectionAddress: params.collectionAddress!,
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

	const initialPageParam: Indexer.Page = { page: 1, pageSize: 30, more: false };

	const queryFn = async ({ pageParam = initialPageParam }) =>
		fetchTokenSupplies({
			// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
			chainId: params.chainId!,
			// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
			collectionAddress: params.collectionAddress!,
			// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
			config: params.config!,
			includeMetadata: params.includeMetadata,
			metadataOptions: params.metadataOptions,
			page: pageParam,
		});

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
