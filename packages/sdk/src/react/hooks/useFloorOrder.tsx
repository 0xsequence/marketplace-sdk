import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	collectableKeys,
	getMarketplaceClient,
} from '#internal';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '#types';
import { z } from 'zod';
import { useConfig } from './useConfig';

const UseFloorOrderSchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	query: QueryArgSchema,
});

export type UseFloorOrderArgs = z.infer<typeof UseFloorOrderSchema>;

export type UseFloorOrderReturn = Awaited<ReturnType<typeof fetchFloorOrder>>;

const fetchFloorOrder = async (args: UseFloorOrderArgs, config: SdkConfig) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient
		.getFloorOrder({ contractAddress: args.collectionAddress })
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
