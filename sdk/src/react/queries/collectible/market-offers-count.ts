import type {
	GetCountOfOffersForCollectibleRequest,
	OrderFilter,
} from '@0xsequence/marketplace-api';
import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import { getMarketplaceClient, type ValuesOptional } from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchCountOffersForCollectibleParams {
	chainId: number;
	collectionAddress: string;
	collectibleId: bigint;
	config: SdkConfig;
	filter?: OrderFilter;
}

/**
 * Fetches count of offers for a collectible from the marketplace API
 */
export async function fetchCountOffersForCollectible(
	params: FetchCountOffersForCollectibleParams,
) {
	const { collectionAddress, chainId, collectibleId, config, filter } = params;

	const client = getMarketplaceClient(config);

	const result = await client.getCountOfOffersForCollectible({
		contractAddress: collectionAddress,
		chainId: chainId,
		tokenId: collectibleId,
		filter,
	});
	return result.count;
}

export type CountOffersForCollectibleQueryOptions =
	ValuesOptional<FetchCountOffersForCollectibleParams> & {
		query?: StandardQueryOptions;
	};

export function getCountOffersForCollectibleQueryKey(
	params: CountOffersForCollectibleQueryOptions,
) {
	const apiArgs: GetCountOfOffersForCollectibleRequest = {
		chainId: params.chainId ?? 0,
		contractAddress: params.collectionAddress ?? '',
		tokenId: params.collectibleId ?? 0n,
		filter: params.filter,
	};

	const client = getMarketplaceClient(params.config!);
	return client.queryKey.getCountOfOffersForCollectible({
		...apiArgs,
		chainId: apiArgs.chainId.toString(),
		tokenId: apiArgs.tokenId,
	});
}

export function countOffersForCollectibleQueryOptions(
	params: CountOffersForCollectibleQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.collectibleId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getCountOffersForCollectibleQueryKey(params),
		queryFn: () =>
			fetchCountOffersForCollectible({
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
