import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import {
	getMarketplaceClient,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../_internal';
import type {
	GetCountOfOffersForCollectibleArgs,
	OrderFilter,
} from '../_internal/api/marketplace.gen';
import { collectableKeys } from '../_internal/api/query-keys';
import type { StandardQueryOptions } from '../types/query';

export interface FetchCountOffersForCollectibleParams {
	chainId: number;
	collectionAddress: string;
	collectibleId: string;
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

	const apiArgs: GetCountOfOffersForCollectibleArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		tokenId: collectibleId,
		filter,
	};

	const result = await client.getCountOfOffersForCollectible(apiArgs);
	return result.count;
}

export type CountOffersForCollectibleQueryOptions =
	ValuesOptional<FetchCountOffersForCollectibleParams> & {
		query?: StandardQueryOptions;
	};

export function getCountOffersForCollectibleQueryKey(
	params: CountOffersForCollectibleQueryOptions,
) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		tokenId: params.collectibleId,
		filter: params.filter,
	} satisfies QueryKeyArgs<GetCountOfOffersForCollectibleArgs>;

	return [...collectableKeys.offersCount, apiArgs] as const;
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
