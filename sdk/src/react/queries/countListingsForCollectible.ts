import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import {
	getMarketplaceClient,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../_internal';
import type {
	GetCountOfListingsForCollectibleArgs,
	OrderFilter,
} from '../_internal/api/marketplace.gen';
import { collectableKeys } from '../_internal/api/query-keys';
import type { StandardQueryOptions } from '../types/query';

export interface FetchCountListingsForCollectibleParams {
	chainId: number;
	collectionAddress: string;
	collectibleId: string;
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

	const apiArgs: GetCountOfListingsForCollectibleArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		tokenId: collectibleId,
		filter,
	};

	const result = await client.getCountOfListingsForCollectible(apiArgs);
	return result.count;
}

export type CountListingsForCollectibleQueryOptions =
	ValuesOptional<FetchCountListingsForCollectibleParams> & {
		query?: StandardQueryOptions;
	};

export function getCountListingsForCollectibleQueryKey(
	params: CountListingsForCollectibleQueryOptions,
) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		tokenId: params.collectibleId,
		filter: params.filter,
	} satisfies QueryKeyArgs<GetCountOfListingsForCollectibleArgs>;

	return [...collectableKeys.listingsCount, apiArgs] as const;
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
