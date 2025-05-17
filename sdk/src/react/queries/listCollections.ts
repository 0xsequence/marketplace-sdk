import { queryOptions, skipToken } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import type {
	Marketplace,
	NewMarketplaceType,
} from '../../types/new-marketplace-types';
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
	marketplaceType?: NewMarketplaceType;
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

	const results = await Promise.all(promises);
	const flattenedResults = results.flat();

	const collectionsWithMetadata = collections
		.map((collection) => {
			const metadata = flattenedResults.find(
				(result) => result.address === collection.itemsAddress,
			);
			return { collection, metadata };
		})
		.filter((collection) => collection.metadata !== undefined)
		.map(({ collection, metadata }) => ({
			...collection,
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			...metadata!,
		}));

	return collectionsWithMetadata;
};

export const listCollectionsOptions = ({
	marketplaceType,
	marketplaceConfig,
	config,
}: {
	marketplaceType?: NewMarketplaceType;
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
