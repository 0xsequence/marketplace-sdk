import type {
	Address,
	MetadataPage,
	SearchTokenMetadataArgs,
	SearchTokenMetadataReturn,
} from '@0xsequence/api-client';
import { infiniteQueryOptions } from '@tanstack/react-query';
import {
	getMetadataClient,
	type SdkInfiniteQueryParams,
	type WithRequired,
} from '../../_internal';
import { createTokenQueryKey } from './queryKeys';

export type FetchSearchTokenMetadataParams = Pick<
	SearchTokenMetadataArgs,
	'chainId' | 'filter'
> & {
	collectionAddress: Address;
	page?: MetadataPage;
};

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
		collectionAddress,
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
		chainId: params.chainId ?? 0,
		collectionAddress: params.collectionAddress ?? '',
		filter: params.filter,
	};

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

	const queryFn = ({ pageParam = initialPageParam }) => {
		const requiredParams = params as WithRequired<
			SearchTokenMetadataQueryOptions,
			'chainId' | 'collectionAddress' | 'config'
		>;
		return fetchSearchTokenMetadata({
			chainId: requiredParams.chainId,
			collectionAddress: requiredParams.collectionAddress,
			filter: params.filter,
			config: requiredParams.config,
			page: pageParam,
		});
	};

	return infiniteQueryOptions({
		queryKey: getSearchTokenMetadataQueryKey(params),
		queryFn,
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
