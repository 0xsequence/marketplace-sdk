import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import {
	getMarketplaceClient,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../../_internal';
import type {
	CollectiblesFilter,
	GetCountOfAllCollectiblesRequest,
	GetCountOfFilteredCollectiblesRequest,
	OrderSide,
} from '../../_internal/api/marketplace.gen';
import type { StandardQueryOptions } from '../../types/query';

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
		const apiArgs: GetCountOfFilteredCollectiblesRequest = {
			contractAddress: collectionAddress,
			chainId: String(chainId),
			filter,
			side,
		};

		const result = await client.getCountOfFilteredCollectibles(apiArgs);
		return result.count;
	}

	const apiArgs: GetCountOfAllCollectiblesRequest = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
	};

	const result = await client.getCountOfAllCollectibles(apiArgs);
	return result.count;
}

export type CountOfCollectablesQueryOptions =
	ValuesOptional<FetchCountOfCollectablesParams> & {
		query?: StandardQueryOptions;
	};

/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'market-count', { chainId, contractAddress, filter?, side? }]
 */
export function getCountOfCollectablesQueryKey(
	params: CountOfCollectablesQueryOptions,
) {
	if (params.filter && params.side) {
		const apiArgs = {
			chainId: String(params.chainId),
			contractAddress: params.collectionAddress,
			filter: params.filter,
			side: params.side,
		} satisfies QueryKeyArgs<GetCountOfFilteredCollectiblesRequest>;

		return ['collectible', 'market-count', apiArgs] as const;
	}

	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
	} satisfies QueryKeyArgs<GetCountOfAllCollectiblesRequest>;

	return ['collectible', 'market-count', apiArgs] as const;
}

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
		queryKey: getCountOfCollectablesQueryKey(params),
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
