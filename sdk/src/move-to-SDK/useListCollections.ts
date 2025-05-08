import type { StoreConfig } from '~/lib/tmp/get-store-config-ssr';
import { useStoreConfig } from '~/lib/tmp/useStoreConfig';

import type { SdkConfig } from '@0xsequence/marketplace-sdk';
import { useConfig } from '@0xsequence/marketplace-sdk/react';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { getMetadataClient } from './tmp';
import type { marketplaceType } from './types';

type FetchListCollectionsArgs = {
	storeConfig?: StoreConfig;
	marketplaceType: marketplaceType;
	// query?: TODO: Add query
};

const fetchListCollections = async (
	{ storeConfig, marketplaceType }: FetchListCollectionsArgs,
	config: SdkConfig,
) => {
	const metadataClient = getMetadataClient(config);

	const collections =
		marketplaceType === 'shop'
			? storeConfig?.shop.collections
			: storeConfig?.marketplace.collections;

	if (!collections?.length) {
		return [];
	}

	// Group collections by chainId
	const collectionsByChain = collections.reduce<Record<string, string[]>>(
		(acc, curr) => {
			const { chainId, collectableAddress } = curr;
			if (!acc[chainId]) {
				acc[chainId] = [];
			}
			acc[chainId].push(collectableAddress);
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
	const metadataInfos = results.flat();

	return collections.map((collection) => {
		const address = collection.collectableAddress.toLowerCase();
		const metadataInfo = metadataInfos.find(
			(info) => info.address?.toLowerCase() === address,
		)!;

		return {
			...collection,
			...metadataInfo,
		};
	});
};

export const listCollectionsOptions = (
	args: FetchListCollectionsArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		// TODO: Add query key
		queryKey: ['collections', args.marketplaceType],
		queryFn: () => fetchListCollections(args, config),
	});
};

export const useListCollections = ({
	marketplaceType,
}: {
	marketplaceType: marketplaceType;
}) => {
	const config = useConfig();
	const { data: storeConfig, isLoading: isLoadingConfig } = useStoreConfig();

	return useQuery({
		...listCollectionsOptions({ storeConfig, marketplaceType }, config),
		enabled: !isLoadingConfig && !!storeConfig,
	});
};
