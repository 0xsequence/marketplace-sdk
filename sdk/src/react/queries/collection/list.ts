import type { ContractInfo } from '@0xsequence/marketplace-api';
import { queryOptions, skipToken } from '@tanstack/react-query';
import type {
	CardType,
	MarketCollection,
	MarketplaceConfig,
	SdkConfig,
	ShopCollection,
} from '../../../types';
import { compareAddress } from '../../../utils';
import {
	buildQueryOptions,
	getMetadataClient,
	type WithOptionalParams,
} from '../../_internal';
import { createCollectionQueryKey } from './queryKeys';

const allCollections = (marketplaceConfig: MarketplaceConfig) => {
	return [
		...marketplaceConfig.market.collections,
		...marketplaceConfig.shop.collections,
	];
};

export interface FetchListCollectionsParams {
	cardType?: CardType;
	marketplaceConfig: MarketplaceConfig;
	config: SdkConfig;
}

/**
 * Fetches collections from the metadata API with marketplace config filtering
 */
export async function fetchListCollections(params: FetchListCollectionsParams) {
	const { cardType, marketplaceConfig, config } = params;
	const metadataClient = getMetadataClient(config);

	let collections = allCollections(marketplaceConfig);

	if (!collections?.length) {
		return [];
	}

	if (cardType) {
		collections = collections.filter(
			(collection) => collection.cardType === cardType,
		);
	}

	// Group collections by chainId
	const collectionsByChain = collections.reduce<Record<string, string[]>>(
		(acc, curr) => {
			const { chainId, itemsAddress } = curr;
			if (!acc[chainId]) {
				acc[chainId] = [];
			}
			acc[chainId].push(itemsAddress);
			return acc;
		},
		{},
	);

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

export type ListCollectionsQueryOptions =
	WithOptionalParams<FetchListCollectionsParams>;

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
}: {
	cardType?: CardType;
	marketplaceConfig: MarketplaceConfig | undefined;
	config: SdkConfig;
}) => {
	return queryOptions({
		queryKey: ['collection', 'list', { cardType, marketplaceConfig, config }],
		queryFn: marketplaceConfig
			? () =>
					fetchListCollections({
						marketplaceConfig,
						config,
						cardType,
					})
			: skipToken,
		enabled: Boolean(marketplaceConfig),
	});
};
