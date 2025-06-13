import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import { type ValuesOptional, getMarketplaceClient } from '../_internal';
import type {
	CollectiblesFilter,
	GetCountOfAllCollectiblesArgs,
	GetCountOfFilteredCollectiblesArgs,
	OrderSide,
} from '../_internal/api/marketplace.gen';
import { collectableKeys } from '../_internal/api/query-keys';
import type { StandardQueryOptions } from '../types/query';

export interface FetchCountOfCollectablesParams {
	chainId: number;
	collectionAddress: string;
	config: SdkConfig;
	filter?: CollectiblesFilter;
	side?: OrderSide;
}

/**
 * Fetches count of collectibles from the marketplace API
 */
export async function fetchCountOfCollectables(
	params: FetchCountOfCollectablesParams,
) {
	const { collectionAddress, chainId, config, filter, side } = params;

	const client = getMarketplaceClient(config);

	if (filter && side) {
		const apiArgs: GetCountOfFilteredCollectiblesArgs = {
			contractAddress: collectionAddress,
			chainId: String(chainId),
			filter,
			side,
		};

		const result = await client.getCountOfFilteredCollectibles(apiArgs);
		return result;
	}

	const apiArgs: GetCountOfAllCollectiblesArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
	};

	const result = await client.getCountOfAllCollectibles(apiArgs);
	return result;
}

export type CountOfCollectablesQueryOptions =
	ValuesOptional<FetchCountOfCollectablesParams> & {
		query?: StandardQueryOptions;
	};

export function countOfCollectablesQueryOptions(
	params: CountOfCollectablesQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: [...collectableKeys.counts, params],
		queryFn: () =>
			fetchCountOfCollectables({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				filter: params.filter,
				side: params.side,
			}),
		...params.query,
		enabled,
	});
}
