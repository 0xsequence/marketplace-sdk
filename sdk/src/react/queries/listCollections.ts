import type { ContractInfo } from '@0xsequence/metadata';
import { queryOptions, skipToken } from '@tanstack/react-query';
import type { MarketplaceType, SdkConfig } from '../../types';
import type {
	MarketCollection,
	MarketplaceConfig,
	ShopCollection,
} from '../../types/new-marketplace-types';
import { compareAddress } from '../../utils';
import {
	collectionKeys,
	getMetadataClient,
	type ValuesOptional,
} from '../_internal';
import type { StandardQueryOptions } from '../types/query';

const allCollections = (marketplaceConfig: MarketplaceConfig) => {
	return [
		...marketplaceConfig.market.collections,
		...marketplaceConfig.shop.collections,
	];
};

export interface FetchListCollectionsParams {
	marketplaceType?: MarketplaceType;
	marketplaceConfig: MarketplaceConfig;
	config: SdkConfig;
}

/**
 * Fetches list of collections from the metadata API with marketplace filtering
 */
export async function fetchListCollections(params: FetchListCollectionsParams) {
	const { marketplaceType, marketplaceConfig, config } = params;
	const metadataClient = getMetadataClient(config);

	let collections = allCollections(marketplaceConfig);

	if (!collections?.length) {
		return [];
	}

	if (marketplaceType) {
		collections = collections.filter(
			(collection) => collection.marketplaceType === marketplaceType,
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
					chainID: chainId,
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
	ValuesOptional<FetchListCollectionsParams> & {
		query?: StandardQueryOptions;
	};

export function listCollectionsQueryOptions(
	params: ListCollectionsQueryOptions,
) {
	const enabled = Boolean(
		params.marketplaceConfig &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: [...collectionKeys.list, params],
		queryFn: enabled
			? () =>
					fetchListCollections({
						// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
						marketplaceConfig: params.marketplaceConfig!,
						// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
						config: params.config!,
						marketplaceType: params.marketplaceType,
					})
			: skipToken,
		...params.query,
		enabled,
	});
}

// Keep old function for backward compatibility during migration
export const listCollectionsOptions = ({
	marketplaceType,
	marketplaceConfig,
	config,
}: {
	marketplaceType?: MarketplaceType;
	marketplaceConfig: MarketplaceConfig | undefined;
	config: SdkConfig;
}) => {
	return queryOptions({
		queryKey: [...collectionKeys.list, marketplaceType],
		queryFn: marketplaceConfig
			? () =>
					fetchListCollections({
						marketplaceType,
						marketplaceConfig,
						config,
					})
			: skipToken,
	});
};
