import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import type {
	ListCollectibleListingsArgs,
	ListCollectibleListingsReturn,
	ValuesOptional,
} from '../_internal';
import { collectableKeys, getMarketplaceClient } from '../_internal';
import type { StandardQueryOptions } from '../types/query';

export interface FetchListListingsForCollectibleParams
	extends Omit<
		ListCollectibleListingsArgs,
		'chainId' | 'contractAddress' | 'tokenId'
	> {
	chainId: number;
	collectionAddress: Address;
	collectibleId: string;
	config: SdkConfig;
}

/**
 * Fetches listings for a specific collectible from the Marketplace API
 */
export async function fetchListListingsForCollectible(
	params: FetchListListingsForCollectibleParams,
): Promise<ListCollectibleListingsReturn> {
	const {
		collectionAddress,
		chainId,
		collectibleId,
		config,
		...additionalApiParams
	} = params;
	const marketplaceClient = getMarketplaceClient(config);

	const apiArgs: ListCollectibleListingsArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		tokenId: collectibleId,
		...additionalApiParams,
	};

	return await marketplaceClient.listCollectibleListings(apiArgs);
}

export type ListListingsForCollectibleQueryOptions =
	ValuesOptional<FetchListListingsForCollectibleParams> & {
		query?: StandardQueryOptions;
	};

export function listListingsForCollectibleQueryOptions(
	params: ListListingsForCollectibleQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.collectibleId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: [...collectableKeys.listings, params],
		queryFn: () =>
			fetchListListingsForCollectible({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectibleId: params.collectibleId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				filter: params.filter,
				page: params.page,
			}),
		...params.query,
		enabled,
	});
}
