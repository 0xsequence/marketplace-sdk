import { collectableKeys } from '@api/queryKeys';
import { getMarketplaceClient } from '@api/services';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseLowestListingsArgs = {
	chainId: string;
	collectionAddress: string;
	tokenId: string;
};

const fetchLowestListing = async (
	args: UseLowestListingsArgs,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient.getCollectibleLowestListing({
		contractAddress: args.collectionAddress,
		tokenId: args.tokenId,
	});
};

export const lowestListingOptions = (
	args: UseLowestListingsArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: [collectableKeys.lowestListings, args, config],
		queryFn: () => fetchLowestListing(args, config),
	});
};

export const useLowestListing = (args: UseLowestListingsArgs) => {
	const config = useConfig();
	return useQuery(lowestListingOptions(args, config));
};
