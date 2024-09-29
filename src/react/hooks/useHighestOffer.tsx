import type { GetCollectibleHighestOfferArgs } from '@api/marketplace.gen';
import { collectableKeys } from '@api/query-keys';
import { getMarketplaceClient } from '@api/services';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseHighestOfferArgs = Omit<
	GetCollectibleHighestOfferArgs,
	'contractAddress'
> & {
	collectionAddress: string;
	chainId: string;
};

const fetchHighestOffer = async (
	args: UseHighestOfferArgs,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient.getCollectibleHighestOffer({
		...args,
		contractAddress: args.collectionAddress,
	});
};

export const highestOfferOptions = (
	args: UseHighestOfferArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: [collectableKeys.highestOffers, args, config],
		queryFn: () => fetchHighestOffer(args, config),
	});
};

export const useHighestOffer = (args: UseHighestOfferArgs) => {
	const config = useConfig();
	return useQuery(highestOfferOptions(args, config));
};
