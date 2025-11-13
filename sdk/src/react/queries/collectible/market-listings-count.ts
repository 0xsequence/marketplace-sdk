import type { OrderFilter } from '@0xsequence/marketplace-api';
import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import type { ValuesOptional } from '../../_internal';
import { getMarketplaceClient } from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchCountListingsForCollectibleParams {
	chainId: number;
	collectionAddress: string;
	collectibleId: bigint;
	config: SdkConfig;
	filter?: OrderFilter;
}

/**
 * Fetches count of listings for a collectible from the marketplace API
 */
export async function fetchCountListingsForCollectible(
	params: FetchCountListingsForCollectibleParams,
) {
	const { collectionAddress, chainId, collectibleId, config, filter } = params;

	const client = getMarketplaceClient(config);

	const result = await client.getCountOfListingsForCollectible({
		contractAddress: collectionAddress,
		chainId: chainId,
		tokenId: collectibleId,
		filter,
	});
	return result.count;
}

export type CountListingsForCollectibleQueryOptions =
	ValuesOptional<FetchCountListingsForCollectibleParams> & {
		query?: StandardQueryOptions;
	};

export function getCountListingsForCollectibleQueryKey(
	params: CountListingsForCollectibleQueryOptions,
) {
	return [
		'collectible',
		'market-listings-count',
		{
			chainId: params.chainId ?? 0,
			contractAddress: params.collectionAddress ?? '',
			tokenId: params.collectibleId ?? 0n,
			filter: params.filter,
		},
	] as const;
}

export function countListingsForCollectibleQueryOptions(
	params: CountListingsForCollectibleQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.collectibleId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getCountListingsForCollectibleQueryKey(params),
		queryFn: () =>
			fetchCountListingsForCollectible({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectibleId: params.collectibleId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				filter: params.filter,
			}),
		...params.query,
		enabled,
	});
}
