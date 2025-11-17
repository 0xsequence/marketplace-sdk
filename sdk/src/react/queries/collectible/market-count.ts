import type {
	Address,
	CollectiblesFilter,
	GetCountOfAllCollectiblesRequest,
	GetCountOfFilteredCollectiblesRequest,
	OrderSide,
} from '@0xsequence/marketplace-api';
import type { SdkConfig } from '../../../types';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type WithOptionalParams,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchCountOfCollectablesParams {
	chainId: number;
	collectionAddress: Address;
	config: SdkConfig;
	filter?: CollectiblesFilter;
	side?: OrderSide;
	query?: StandardQueryOptions;
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
			collectionAddress,
			chainId,
			filter,
			side,
		};

		const result = await client.getCountOfFilteredCollectibles(apiArgs);
		return result.count;
	}

	const apiArgs: GetCountOfAllCollectiblesRequest = {
		collectionAddress,
		chainId,
	};

	const result = await client.getCountOfAllCollectibles(apiArgs);
	return result.count;
}

export type CountOfCollectablesQueryOptions =
	WithOptionalParams<FetchCountOfCollectablesParams>;

/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'market-count', { chainId, contractAddress, filter?, side? }]
 */
export function getCountOfCollectablesQueryKey(
	params: CountOfCollectablesQueryOptions,
) {
	return [
		'collectible',
		'market-count',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
			filter: params.filter,
			side: params.side,
		},
	] as const;
}

export function countOfCollectablesQueryOptions(
	params: CountOfCollectablesQueryOptions,
) {
	return buildQueryOptions(
		{
			getQueryKey: getCountOfCollectablesQueryKey,
			requiredParams: ['chainId', 'collectionAddress', 'config'] as const,
			fetcher: fetchCountOfCollectables,
		},
		params,
	);
}
