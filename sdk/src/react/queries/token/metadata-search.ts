import type {
	Filter,
	Page,
	SearchTokenMetadataArgs,
	SearchTokenMetadataReturn,
} from '@0xsequence/marketplace-api';
import { infiniteQueryOptions } from '@tanstack/react-query';
import {
	getMetadataClient,
	type QueryKeyArgs,
	type SdkInfiniteQueryParams,
	type WithRequired,
} from '../../_internal';
import { createTokenQueryKey } from './queryKeys';

export interface FetchSearchTokenMetadataParams {
	chainId: number;
	collectionAddress: string;
	filter?: Filter;
	page?: Page;
}

export type SearchTokenMetadataQueryOptions =
	SdkInfiniteQueryParams<FetchSearchTokenMetadataParams>;

/**
 * Fetches token metadata from the metadata API using search filters
 */
export async function fetchSearchTokenMetadata(
	params: WithRequired<
		SearchTokenMetadataQueryOptions,
		'chainId' | 'collectionAddress' | 'config'
	>,
): Promise<SearchTokenMetadataReturn> {
	const { chainId, collectionAddress, filter, page, config } = params;
	const metadataClient = getMetadataClient(config);

	const response = await metadataClient.searchTokenMetadata({
		chainId,
		contractAddress: collectionAddress,
		filter: filter ?? {},
		page,
	});

	return {
		tokenMetadata: response.tokenMetadata,
		page: response.page,
	};
}

export function getSearchTokenMetadataQueryKey(
	params: SearchTokenMetadataQueryOptions,
) {
	const apiArgs = {
		chainId: params.chainId!,
		contractAddress: params.collectionAddress!,
		filter: params.filter,
	} satisfies QueryKeyArgs<Omit<SearchTokenMetadataArgs, 'page'>>;

	return createTokenQueryKey('metadata-search', apiArgs);
}

export function searchTokenMetadataQueryOptions(
	params: SearchTokenMetadataQueryOptions,
) {
	const enabled = Boolean(
		params.chainId &&
			params.collectionAddress &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	const initialPageParam = { page: 1, pageSize: 30 };

	return infiniteQueryOptions({
		queryKey: getSearchTokenMetadataQueryKey(params),
		queryFn: ({ pageParam = initialPageParam }) =>
			fetchSearchTokenMetadata({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				filter: params.filter!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				page: pageParam,
			}),
		initialPageParam,
		getNextPageParam: (lastPage) => {
			if (!lastPage.page?.more) return undefined;
			return {
				page: (lastPage.page.page || 1) + 1,
				pageSize: lastPage.page.pageSize || 20,
			};
		},
		...params.query,
		enabled,
	});
}
