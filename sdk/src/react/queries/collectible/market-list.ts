import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { Page, SdkConfig } from '../../../types';
import type { CardType } from '../../../types/types';
import { compareAddress } from '../../../utils';
import type {
	ListCollectiblesArgs,
	ListCollectiblesReturn,
	QueryKeyArgs,
	ValuesOptional,
} from '../../_internal';
import { getMarketplaceClient } from '../../_internal';
import type { StandardInfiniteQueryOptions } from '../../types/query';
import { fetchMarketplaceConfig } from '../marketplace/config';

export interface FetchListCollectiblesParams
	extends Omit<ListCollectiblesArgs, 'chainId' | 'contractAddress'> {
	chainId: number;
	collectionAddress: Address;
	cardType?: CardType;
	config: SdkConfig;
	enabled?: boolean;
}

/**
 * Fetches a list of collectibles with pagination support from the Marketplace API
 */
export async function fetchListCollectibles(
	params: FetchListCollectiblesParams,
	page: Page,
): Promise<ListCollectiblesReturn> {
	const { collectionAddress, chainId, config, ...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const marketplaceConfig = await fetchMarketplaceConfig({ config });
	const isMarketCollection = marketplaceConfig?.market.collections.some(
		(collection) => compareAddress(collection.itemsAddress, collectionAddress),
	);

	// If it's not a market collection, return an empty list. those collections are not compatible with the ListCollectibles endpoint.
	if (params.enabled === false || !isMarketCollection) {
		return {
			collectibles: [],
			page: {
				page: 1,
				pageSize: 30,
				more: false,
			},
		};
	}

	const apiArgs: ListCollectiblesArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		page: page,
		...additionalApiParams,
	};

	return await marketplaceClient.listCollectibles(apiArgs);
}

export type ListCollectiblesQueryOptions =
	ValuesOptional<FetchListCollectiblesParams> & {
		query?: StandardInfiniteQueryOptions;
	};

/**
 * Query key structure: [resource, operation, params]
 * - resource: folder name ('collectible')
 * - operation: file name ('list')
 * @example ['collectible', 'market-list', { chainId, contractAddress, side, filter }]
 */

/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'market-list', { chainId, contractAddress, side, filter }]
 */
export function getListCollectiblesQueryKey(
	params: ListCollectiblesQueryOptions,
) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		side: params.side,
		filter: params.filter,
	} satisfies QueryKeyArgs<Omit<ListCollectiblesArgs, 'page'>>;

	return ['collectible', 'market-list', apiArgs] as const;
}

export function listCollectiblesQueryOptions(
	params: ListCollectiblesQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.side &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return infiniteQueryOptions({
		queryKey: getListCollectiblesQueryKey(params),
		queryFn: async ({ pageParam }) => {
			return fetchListCollectibles(
				{
					// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
					chainId: params.chainId!,
					// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
					collectionAddress: params.collectionAddress!,
					// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
					config: params.config!,
					// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
					side: params.side!,
					filter: params.filter,
					cardType: params.cardType,
				},
				pageParam,
			);
		},
		initialPageParam: { page: 1, pageSize: 30 } as Page,
		getNextPageParam: (lastPage) =>
			lastPage.page?.more ? lastPage.page : undefined,
		...params.query,
		enabled,
	});
}
