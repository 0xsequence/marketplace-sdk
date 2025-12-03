import type { ContractInfo } from '@0xsequence/metadata';
import { queryOptions, skipToken } from '@tanstack/react-query';
import type { CardType, SdkConfig } from '../../../types';
import type {
	MarketCollection,
	MarketplaceConfig,
	ShopCollection,
} from '../../../types/new-marketplace-types';
import { compareAddress } from '../../../utils';
import {
	collectionKeys,
	getMetadataClient,
	type ValuesOptional,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

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

export function getListCollectionsQueryKey(
	params: ListCollectionsQueryOptions,
) {
	const queryKeyParams = {
		cardType: params.cardType,
		marketplaceConfig: params.marketplaceConfig,
	} as const;

	return [...collectionKeys.list, queryKeyParams] as const;
}

export function listCollectionsQueryOptions(
	params: ListCollectionsQueryOptions,
) {
	const enabled = Boolean(
		params.marketplaceConfig &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getListCollectionsQueryKey(params),
		queryFn: enabled
			? () =>
					fetchListCollections({
						// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
						marketplaceConfig: params.marketplaceConfig!,
						// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
						config: params.config!,
						cardType: params.cardType,
					})
			: skipToken,
		...params.query,
		enabled,
	});
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
		queryKey: [...collectionKeys.list, { cardType, marketplaceConfig, config }],
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
