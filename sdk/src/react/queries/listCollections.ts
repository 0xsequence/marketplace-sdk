import type { ContractInfo } from '@0xsequence/metadata';
import { queryOptions, skipToken } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import type { MarketCollection, ShopCollection } from '../../types';
import type {
	Marketplace,
	MarketplaceType,
} from '../../types/new-marketplace-types';
import { compareAddress } from '../../utils';
import { collectionKeys, getMetadataClient } from '../_internal';

const allCollections = (marketplaceConfig: Marketplace) => {
	return [
		...marketplaceConfig.market.collections,
		...marketplaceConfig.shop.collections,
	];
};

const fetchListCollections = async ({
	marketplaceType,
	marketplaceConfig,
	config,
}: {
	marketplaceType?: MarketplaceType;
	marketplaceConfig: Marketplace;
	config: SdkConfig;
}) => {
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
};

export const listCollectionsOptions = ({
	marketplaceType,
	marketplaceConfig,
	config,
}: {
	marketplaceType?: MarketplaceType;
	marketplaceConfig: Marketplace | undefined;
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
