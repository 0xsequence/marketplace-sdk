import type {
	CollectiblesFilter,
	GetCountOfAllCollectiblesRequest,
	GetCountOfFilteredCollectiblesRequest,
	OrderSide,
} from '@0xsequence/api-client';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';

export interface FetchCountOfCollectablesParams
	extends GetCountOfAllCollectiblesRequest {
	filter?: CollectiblesFilter;
	side?: OrderSide;
}

export type CountOfCollectablesQueryOptions =
	SdkQueryParams<FetchCountOfCollectablesParams>;

/**
 * Fetches count of collectibles from the marketplace API
 */
export async function fetchCountOfCollectables(
	params: WithRequired<
		CountOfCollectablesQueryOptions,
		'chainId' | 'collectionAddress' | 'config'
	>,
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
	params: WithOptionalParams<
		WithRequired<
			CountOfCollectablesQueryOptions,
			'chainId' | 'collectionAddress' | 'config'
		>
	>,
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
