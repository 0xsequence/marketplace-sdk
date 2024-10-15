import { collectableKeys, getMarketplaceClient } from '@internal';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseFloorOrder = {
	chainId: string;
	collectionAddress: string;
};

const fetchFloorOrder = async (args: UseFloorOrder, config: SdkConfig) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient
		.getFloorOrder({ contractAddress: args.collectionAddress })
		.then((data) => data.collectible);
};

export const floorOrderOptions = (args: UseFloorOrder, config: SdkConfig) => {
	return queryOptions({
		queryKey: [collectableKeys.floorOrders, args, config],
		queryFn: () => fetchFloorOrder(args, config),
	});
};

export const useFloorOrder = (args: UseFloorOrder) => {
	const config = useConfig();
	return useQuery(floorOrderOptions(args, config));
};
