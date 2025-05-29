import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	QueryArgSchema,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
import { useConfig } from './useConfig';

const UseFloorOrderSchema = z.object({
	chainId: z.number(),
	collectionAddress: AddressSchema,
	query: QueryArgSchema,
});

export type UseFloorOrderArgs = z.infer<typeof UseFloorOrderSchema>;

export type UseFloorOrderReturn = Awaited<ReturnType<typeof fetchFloorOrder>>;

const fetchFloorOrder = async (args: UseFloorOrderArgs, config: SdkConfig) => {
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient
		.getFloorOrder({
			chainId: String(args.chainId),
			contractAddress: args.collectionAddress,
		})
		.then((data) => data.collectible);
};

export const floorOrderOptions = (
	args: UseFloorOrderArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: [...collectableKeys.floorOrders, args, config],
		queryFn: () => fetchFloorOrder(args, config),
	});
};

export const useFloorOrder = (args: UseFloorOrderArgs) => {
	const config = useConfig();
	return useQuery(floorOrderOptions(args, config));
};
