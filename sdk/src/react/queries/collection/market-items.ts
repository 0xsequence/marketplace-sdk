import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { Page, SdkConfig } from '../../../types';
import type {
	ListOrdersWithCollectiblesRequest,
	ListOrdersWithCollectiblesResponse,
	ValuesOptional,
} from '../../_internal';
import { getMarketplaceClient } from '../../_internal';
import type { StandardInfiniteQueryOptions } from '../../types/query';

export interface FetchListItemsOrdersForCollectionParams
	extends Omit<ListOrdersWithCollectiblesRequest, 'chainId'> {
	chainId: number;
	collectionAddress: Address;
	config: SdkConfig;
}

export async function fetchListItemsOrdersForCollection(
	params: FetchListItemsOrdersForCollectionParams,
	page: Page,
): Promise<ListOrdersWithCollectiblesResponse> {
	const { chainId, config, ...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);

	const apiArgs: ListOrdersWithCollectiblesRequest = {
		chainId,
		page,
		...additionalApiParams,
	};

	return await marketplaceClient.listOrdersWithCollectibles(apiArgs);
}

export type ListItemsOrdersForCollectionQueryOptions =
	ValuesOptional<FetchListItemsOrdersForCollectionParams> & {
		query?: StandardInfiniteQueryOptions;
	};

export function getListItemsOrdersForCollectionQueryKey(
	params: ListItemsOrdersForCollectionQueryOptions,
) {
	return [
		'collection',
		'market-items',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
			side: params.side,
			filter: params.filter,
		},
	] as const;
}

export function listItemsOrdersForCollectionQueryOptions(
	params: ListItemsOrdersForCollectionQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.config &&
			params.side &&
			(params.query?.enabled ?? true),
	);

	return infiniteQueryOptions({
		queryKey: getListItemsOrdersForCollectionQueryKey(params),
		queryFn: async ({ pageParam }) => {
			return fetchListItemsOrdersForCollection(
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
				},
				pageParam,
			);
		},
		initialPageParam: (params.page || { page: 1, pageSize: 30 }) as Page,
		getNextPageParam: (lastPage) =>
			lastPage.page?.more ? lastPage.page : undefined,
		...params.query,
		enabled,
	});
}
