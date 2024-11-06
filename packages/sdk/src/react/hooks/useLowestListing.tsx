import {
	type ChainId,
	type GetCollectibleLowestListingArgs,
	type QueryArg,
	collectableKeys,
	getMarketplaceClient,
} from '@internal';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseLowestListingArgs = Omit<
	GetCollectibleLowestListingArgs,
	'contractAddress'
> & {
	collectionAddress: string;
	chainId: ChainId;
} & QueryArg;

export type UseLowestListingReturn = ReturnType<typeof fetchLowestListing>;

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
		...args.query,
		queryKey: [...collectableKeys.lowestListings, args, config],
		queryFn: () => fetchLowestListing(args, config),
	});
};

export const useLowestListing = (args: UseLowestListingArgs) => {
	const config = useConfig();
	return useQuery(lowestListingOptions(args, config));
};
