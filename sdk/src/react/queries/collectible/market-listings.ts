import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import type {
	ListCollectibleListingsRequest,
	ListCollectibleListingsResponse,
	ValuesOptional,
} from '../../_internal';
import { getMarketplaceClient } from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchListListingsForCollectibleParams
	extends Omit<ListCollectibleListingsRequest, 'chainId' | 'tokenId'> {
	chainId: number;
	collectionAddress: Address;
	collectibleId: bigint;
	config: SdkConfig;
}

/**
 * Fetches listings for a specific collectible from the Marketplace API
 */
export async function fetchListListingsForCollectible(
	params: FetchListListingsForCollectibleParams,
): Promise<ListCollectibleListingsResponse> {
	const {
		collectionAddress,
		chainId,
		collectibleId,
		config,
		...additionalApiParams
	} = params;
	const marketplaceClient = getMarketplaceClient(config);

	return await marketplaceClient.listListingsForCollectible({
		chainId,
		tokenId: collectibleId,
		...additionalApiParams,
	});
}

export type ListListingsForCollectibleQueryOptions =
	ValuesOptional<FetchListListingsForCollectibleParams> & {
		query?: StandardQueryOptions;
	};

export function getListListingsForCollectibleQueryKey(
	params: ListListingsForCollectibleQueryOptions,
) {
	return [
		'collectible',
		'market-listings',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
			tokenId: params.collectibleId ?? 0n,
			filter: params.filter,
			page: params.page,
		},
	] as const;
}

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
		queryKey: getListListingsForCollectibleQueryKey(params),
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
