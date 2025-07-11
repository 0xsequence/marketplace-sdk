import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '../../../../types';
import {
	collectableKeys,
	getMarketplaceClient,
	type ListOffersForCollectibleArgs,
} from '../../../_internal';
import type { OrderFilter, Page } from '../../../_internal/api/marketplace.gen';
import { useConfig } from '../../config/useConfig';

interface UseListOffersForCollectibleArgs {
	chainId: number;
	collectionAddress: string;
	collectibleId: string;
	filter?: OrderFilter;
	page?: Page;
}

export type UseListOffersForCollectibleReturn = Awaited<
	ReturnType<typeof fetchListOffersForCollectible>
>;

const fetchListOffersForCollectible = async (
	config: SdkConfig,
	args: UseListOffersForCollectibleArgs,
) => {
	const arg = {
		chainId: String(args.chainId),
		contractAddress: args.collectionAddress,
		tokenId: args.collectibleId,
		filter: args.filter,
		page: args.page,
	} satisfies ListOffersForCollectibleArgs;

	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.listCollectibleOffers(arg);
};

export const listOffersForCollectibleOptions = (
	args: UseListOffersForCollectibleArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: [...collectableKeys.offers, args, config],
		queryFn: () => fetchListOffersForCollectible(config, args),
	});
};

export const useListOffersForCollectible = (
	args: UseListOffersForCollectibleArgs,
) => {
	const config = useConfig();

	return useQuery(listOffersForCollectibleOptions(args, config));
};
