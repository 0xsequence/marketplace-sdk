import type { ContractInfo } from '@0xsequence/api-client';
import { queryOptions, skipToken } from '@tanstack/react-query';
import type {
	MarketCollection,
	MarketplaceConfig,
	ShopCollection,
} from '../../../types';
import { compareAddress } from '../../../utils';
import {
	buildQueryOptions,
	getMetadataClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';
import { createCollectionQueryKey } from './queryKeys';

function getAllCollections(marketplaceConfig: MarketplaceConfig) {
	return [
		...marketplaceConfig.market.collections,
		...marketplaceConfig.shop.collections,
	];
}

function filterCollectionsByType(
	collections: Array<MarketCollection | ShopCollection>,
	collectionType?: 'market' | 'shop',
) {
	if (!collectionType) {
		return collections;
	}
	return collections.filter(
		(c) => c.marketplaceCollectionType === collectionType,
	);
}

function groupCollectionsByChain(
	collections: Array<MarketCollection | ShopCollection>,
) {
	return collections.reduce<Record<string, string[]>>((acc, curr) => {
		const { chainId, itemsAddress } = curr;
		if (!acc[chainId]) {
			acc[chainId] = [];
		}
		acc[chainId].push(itemsAddress);
		return acc;
	}, {});
}

export interface FetchListCollectionsParams {
	collectionType?: 'market' | 'shop';
	marketplaceConfig: MarketplaceConfig;
}

export type ListCollectionsQueryOptions =
	SdkQueryParams<FetchListCollectionsParams>;

/**
 * Fetches collections from the metadata API with marketplace config filtering
 */
export async function fetchListCollections(
	params: WithRequired<
		ListCollectionsQueryOptions,
		'marketplaceConfig' | 'config'
	>,
) {
	const { collectionType, marketplaceConfig, config } = params;
	const metadataClient = getMetadataClient(config);

	let collections = getAllCollections(marketplaceConfig);

	if (!collections?.length) {
		return [];
	}

	collections = filterCollectionsByType(collections, collectionType);

	// Group collections by chainId for batch fetching
	const collectionsByChain = groupCollectionsByChain(collections);

	// Fetch collections for each chain
	const promises = Object.entries(collectionsByChain).map(
		([chainId, addresses]) =>
			metadataClient
				.getContractInfoBatch({
					chainId: Number(chainId),
					contractAddresses: addresses,
				})
				.then((resp) => Object.values(resp.contractInfoMap)),
	);

	const settled = await Promise.allSettled(promises);

	// If all promises failed, throw the first error
	if (settled.every((result) => result.status === 'rejected')) {
		const firstError = settled[0];
		throw firstError.reason;
	}

	const results = settled
		.filter(
			(r): r is PromiseFulfilledResult<ContractInfo[]> =>
				r.status === 'fulfilled',
		)
		.flatMap((r) => r.value);

	const collectionsWithMetadata = collections
		.map((collection) => {
			const metadata = results.find((result) =>
				compareAddress(result.address, collection.itemsAddress),
			);
			return { collection, metadata };
		})
		.filter(
			(
				item,
			): item is {
				collection: MarketCollection | ShopCollection;
				metadata: ContractInfo;
			} => item.metadata !== undefined,
		)
		.map(({ collection, metadata }) => ({
			...collection,
			...metadata,
		}));

	return collectionsWithMetadata;
}

export function getListCollectionsQueryKey(
	params: ListCollectionsQueryOptions,
) {
	const queryKeyParams = {
		collectionType: params.collectionType,
		marketplaceConfig: params.marketplaceConfig,
	} as const;

	return createCollectionQueryKey('list', queryKeyParams);
}

export function listCollectionsQueryOptions(
	params: WithOptionalParams<
		WithRequired<ListCollectionsQueryOptions, 'marketplaceConfig' | 'config'>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getListCollectionsQueryKey,
			requiredParams: ['marketplaceConfig', 'config'] as const,
			fetcher: fetchListCollections,
		},
		params,
	);
}

// Keep old function for backward compatibility during migration
export const listCollectionsOptions = ({
	collectionType,
	marketplaceConfig,
	config,
	query,
}: ListCollectionsQueryOptions) => {
	return queryOptions({
		queryKey: [
			'collection',
			'list',
			{ collectionType, marketplaceConfig, config },
		],
		queryFn:
			marketplaceConfig && config
				? () =>
						fetchListCollections({
							marketplaceConfig,
							config,
							collectionType,
						})
				: skipToken,
		...query,
	});
};
