import type { Filter, Page } from '@0xsequence/metadata';
import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import {
	getMetadataClient,
	tokenKeys,
	type ValuesOptional,
} from '../_internal';
import type { StandardQueryOptions } from '../types/query';

export interface FetchSearchTokenMetadataParams {
	chainId: number;
	collectionAddress: string;
	filter: Filter;
	page?: Page;
	config: SdkConfig;
}

/**
 * Fetches token metadata from the metadata API using search filters
 */
export async function fetchSearchTokenMetadata(
	params: FetchSearchTokenMetadataParams,
) {
	const { chainId, collectionAddress, filter, page, config } = params;
	const metadataClient = getMetadataClient(config);

	const response = await metadataClient.searchTokenMetadata({
		chainID: chainId.toString(),
		contractAddress: collectionAddress,
		filter,
		page,
	});

	return {
		tokenMetadata: response.tokenMetadata,
		page: response.page,
	};
}

export type SearchTokenMetadataQueryOptions =
	ValuesOptional<FetchSearchTokenMetadataParams> & {
		query?: StandardQueryOptions;
	};

export function searchTokenMetadataQueryOptions(
	params: SearchTokenMetadataQueryOptions,
) {
	const enabled = Boolean(
		params.chainId &&
			params.collectionAddress &&
			params.filter &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: [...tokenKeys.metadata, 'search', params],
		queryFn: () =>
			fetchSearchTokenMetadata({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				filter: params.filter!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				page: params.page,
			}),
		...params.query,
		enabled,
	});
}
