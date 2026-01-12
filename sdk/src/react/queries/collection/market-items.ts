import { isAddress } from 'viem';
import type { Page } from '../../../types';
import type {
	ListOrdersWithCollectiblesRequest,
	ListOrdersWithCollectiblesResponse,
	WithOptionalParams,
} from '../../_internal';
import {
	buildInfiniteQueryOptions,
	getMarketplaceClient,
	type SdkInfiniteQueryParams,
	type WithRequired,
} from '../../_internal';
import { createCollectionQueryKey } from './queryKeys';

export type ListItemsOrdersForCollectionQueryOptions =
	SdkInfiniteQueryParams<ListOrdersWithCollectiblesRequest>;

export async function fetchListItemsOrdersForCollection(
	params: WithRequired<
		ListItemsOrdersForCollectionQueryOptions,
		'chainId' | 'collectionAddress' | 'side' | 'config'
	>,
	page: Page,
): Promise<ListOrdersWithCollectiblesResponse> {
	const { config, ...apiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);

	return await marketplaceClient.listOrdersWithCollectibles({
		...apiParams,
		page,
	});
}

export function getListItemsOrdersForCollectionQueryKey(
	params: ListItemsOrdersForCollectionQueryOptions,
) {
	const apiArgs = {
		chainId: params.chainId,
		collectionAddress: params.collectionAddress,
		side: params.side,
		filter: params.filter,
	};

	return createCollectionQueryKey('market-items', apiArgs);
}

export function listItemsOrdersForCollectionQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			ListItemsOrdersForCollectionQueryOptions,
			'chainId' | 'collectionAddress' | 'side' | 'config'
		>
	>,
) {
	return buildInfiniteQueryOptions(
		{
			getQueryKey: getListItemsOrdersForCollectionQueryKey,
			requiredParams: [
				'chainId',
				'collectionAddress',
				'side',
				'config',
			] as const,
			fetcher: fetchListItemsOrdersForCollection,
			getPageInfo: (response) => response.page,
			customValidation: (p) =>
				!!p.collectionAddress && isAddress(p.collectionAddress),
		},
		params,
	);
}
