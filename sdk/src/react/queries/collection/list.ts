import type { ContractInfo } from '@0xsequence/marketplace-api';
import { queryOptions, skipToken } from '@tanstack/react-query';
import type {
	CardType,
	MarketCollection,
	MarketplaceConfig,
	ShopCollection,
} from '../../../types';
import { compareAddress } from '../../../utils';
import {
	buildQueryOptions,
	getMetadataClient,
	type SdkQueryParams,
	type WithRequired,
} from '../../_internal';
import { createCollectionQueryKey } from './queryKeys';

/**
 * Combines market and shop collections from marketplace config
 */
function getAllCollections(marketplaceConfig: MarketplaceConfig) {
	return [
		...marketplaceConfig.market.collections,
		...marketplaceConfig.shop.collections,
	];
}

/**
 * Filters collections by card type if specified
 */
function filterCollectionsByCardType(
	collections: Array<MarketCollection | ShopCollection>,
	cardType?: CardType,
) {
	if (!cardType) {
		return collections;
	}
	return collections.filter((collection) => collection.cardType === cardType);
}

/**
 * Groups collections by chain ID for batch fetching
 */
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
	cardType?: CardType;
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
	const { cardType, marketplaceConfig, config } = params;
	const metadataClient = getMetadataClient(config);

	let collections = getAllCollections(marketplaceConfig);

	if (!collections?.length) {
		return [];
	}

	collections = filterCollectionsByCardType(collections, cardType);

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
		const firstError = settled[0] as PromiseRejectedResult;
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
		cardType: params.cardType,
		marketplaceConfig: params.marketplaceConfig,
	} as const;

	return createCollectionQueryKey('list', queryKeyParams);
}

export function listCollectionsQueryOptions(
	params: ListCollectionsQueryOptions,
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
	cardType,
	marketplaceConfig,
	config,
}: ListCollectionsQueryOptions & {
	marketplaceConfig: MarketplaceConfig | undefined;
}) => {
	return queryOptions({
		queryKey: ['collection', 'list', { cardType, marketplaceConfig, config }],
		queryFn:
			marketplaceConfig && config
				? () =>
						fetchListCollections({
							marketplaceConfig,
							config,
							cardType,
						})
				: skipToken,
		enabled: Boolean(marketplaceConfig && config),
	});
};
