import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { Page, SdkConfig } from '../../../types';
import type {
	ListOrdersWithCollectiblesArgs,
	ListOrdersWithCollectiblesReturn,
	QueryKeyArgs,
	ValuesOptional,
} from '../../_internal';
import { getMarketplaceClient } from '../../_internal';
import type { StandardInfiniteQueryOptions } from '../../types/query';

export interface FetchListItemsOrdersForCollectionParams
	extends Omit<ListOrdersWithCollectiblesArgs, 'chainId' | 'contractAddress'> {
	chainId: number;
	collectionAddress: Address;
	config: SdkConfig;
}

export async function fetchListItemsOrdersForCollection(
	params: FetchListItemsOrdersForCollectionParams,
	page: Page,
): Promise<ListOrdersWithCollectiblesReturn> {
	const { collectionAddress, chainId, config, ...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);

	const apiArgs: ListOrdersWithCollectiblesArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		page: page,
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
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		side: params.side,
		filter: params.filter,
	} satisfies QueryKeyArgs<Omit<ListOrdersWithCollectiblesArgs, 'page'>>;

	return ['collection', 'market-items', apiArgs] as const;
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
