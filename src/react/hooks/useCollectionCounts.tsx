import {
	type ChainId,
	type CollectiblesFilter,
	type OrderSide,
	type QueryArg,
	collectableKeys,
	getMarketplaceClient,
} from '@internal';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { useConfig } from './useConfig';

type ExtendedCollectiblesFilter = { side: OrderSide } & CollectiblesFilter;

export type UseCountOfCollectablesArgs = {
	collectionAddress: string;
	chainId: ChainId;
	filter?: ExtendedCollectiblesFilter;
} & QueryArg;

export type UseHighestOfferReturn = ReturnType<typeof fetchCountOfCollectables>;

const fetchCountOfCollectables = async (
	args: UseCountOfCollectablesArgs,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	if (args.filter) {
		return marketplaceClient
			.getCountOfFilteredCollectibles({
				...args,
				contractAddress: args.collectionAddress,
				side: args.filter.side,
			})
			.then((resp) => resp.count);
		// biome-ignore lint/style/noUselessElse: <explanation>
	} else {
		return marketplaceClient
			.getCountOfAllCollectibles({
				...args,
				contractAddress: args.collectionAddress,
			})
			.then((resp) => resp.count);
	}
};

export const countOfCollectablesOptions = (
	args: UseCountOfCollectablesArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.counts, args],
		queryFn: () => fetchCountOfCollectables(args, config),
	});
};

export const useCountOfCollectables = (args: UseCountOfCollectablesArgs) => {
	const config = useConfig();
	return useQuery(countOfCollectablesOptions(args, config));
};
