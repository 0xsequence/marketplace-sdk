import type { ChainId } from '@0xsequence/network';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { CollectibleOrder, SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
import { useConfig } from './useConfig';

const UseFloorOrderSchema: z.ZodObject<
	{
		chainId: z.ZodPipeline<
			z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>,
			z.ZodString
		>;
		collectionAddress: z.ZodEffects<z.ZodString, Address, string>;
		query: z.ZodOptional<
			z.ZodObject<
				{
					enabled: z.ZodOptional<z.ZodBoolean>;
				},
				'strip',
				z.ZodTypeAny,
				{
					enabled?: boolean | undefined;
				},
				{
					enabled?: boolean | undefined;
				}
			>
		>;
	},
	'strip'
> = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	query: QueryArgSchema,
});

export type UseFloorOrderArgs = z.infer<typeof UseFloorOrderSchema>;

export type UseFloorOrderReturn = Awaited<ReturnType<typeof fetchFloorOrder>>;

const fetchFloorOrder = async (
	args: UseFloorOrderArgs,
	config: SdkConfig,
): Promise<CollectibleOrder> => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient
		.getFloorOrder({ contractAddress: args.collectionAddress })
		.then((data) => data.collectible);
};

export const floorOrderOptions = (
	args: UseFloorOrderArgs,
	config: SdkConfig,
): any => {
	return queryOptions({
		queryKey: [...collectableKeys.floorOrders, args, config],
		queryFn: () => fetchFloorOrder(args, config),
	});
};

export const useFloorOrder = (
	args: UseFloorOrderArgs,
): DefinedQueryObserverResult<TData, TError> => {
	const config = useConfig();
	return useQuery(floorOrderOptions(args, config));
};
