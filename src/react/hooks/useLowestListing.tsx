import type { GetCollectibleLowestListingArgs } from '@api/marketplace.gen';
import { collectableKeys } from '@api/query-keys';
import type { QueryArgs } from '@api/query-types';
import { getMarketplaceClient } from '@api/services';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseLowestListingArgs = Omit<
	GetCollectibleLowestListingArgs,
	'ContractAddress'
> & {
	collectionAddress: string;
	chainId: string;
	query: QueryArgs;
};

const fetchLowestListing = async (
	args: UseLowestListingArgs,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient.getCollectibleLowestListing({
		...args,
		contractAddress: args.collectionAddress,
	});
};

export const lowestListingOptions = (
	args: UseLowestListingArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: [collectableKeys.lowestListings, args, config],
		queryFn: () => fetchLowestListing(args, config),
		...args.query,
	});
};

export const useLowestListing = (args: UseLowestListingArgs) => {
	const config = useConfig();
	return useQuery(lowestListingOptions(args, config));
};
