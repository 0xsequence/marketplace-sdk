import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { Page, SdkConfig } from '../../types';
import type {
	ListListingsArgs,
	ListListingsReturn,
	ValuesOptional,
} from '../_internal';
import { collectableKeys, getMarketplaceClient } from '../_internal';
import type { StandardInfiniteQueryOptions } from '../types/query';

export interface FetchListItemsOrdersForCollectionParams
	extends Omit<ListListingsArgs, 'chainId' | 'contractAddress'> {
	chainId: number;
	collectionAddress: Address;
	config: SdkConfig;
}

export async function fetchListItemsOrdersForCollection(
	params: FetchListItemsOrdersForCollectionParams,
	page: Page,
): Promise<ListListingsReturn> {
	const { collectionAddress, chainId, config, ...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);

	const apiArgs: ListListingsArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		page: page,
		...additionalApiParams,
	};

	return await marketplaceClient.listListings(apiArgs);
}

export type ListItemsOrdersForCollectionQueryOptions =
	ValuesOptional<FetchListItemsOrdersForCollectionParams> & {
		query?: StandardInfiniteQueryOptions;
	};

export function listItemsOrdersForCollectionQueryOptions(
	params: ListItemsOrdersForCollectionQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return infiniteQueryOptions({
		queryKey: [...collectableKeys.collectionItemsOrders, params],
		queryFn: async ({ pageParam }) => {
			return fetchListItemsOrdersForCollection(
				{
					// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
					chainId: params.chainId!,
					// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
					collectionAddress: params.collectionAddress!,
					// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
					config: params.config!,
					filter: params.filter,
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
