import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	QueryArgSchema,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
import { countListingsForCollectibleArgsSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const UseCountListingsForCollectibleArgsSchema =
	countListingsForCollectibleArgsSchema
		.omit({
			contractAddress: true,
			tokenId: true,
		})
		.extend({
			collectionAddress: AddressSchema,
			collectibleId: z.string(),
			chainId: z.number(),
			query: QueryArgSchema,
		});

export type UseCountListingsForCollectibleArgs = z.infer<
	typeof UseCountListingsForCollectibleArgsSchema
>;

export type UseCountListingsForCollectibleReturn = Awaited<
	ReturnType<typeof fetchCountListingsForCollectible>
>;

const fetchCountListingsForCollectible = async (
	args: UseCountListingsForCollectibleArgs,
	config: SdkConfig,
) => {
	const parsedArgs = UseCountListingsForCollectibleArgsSchema.parse(args);
	const marketplaceClient = getMarketplaceClient(parsedArgs.chainId, config);
	return marketplaceClient.getCountOfListingsForCollectible({
		...parsedArgs,
		contractAddress: parsedArgs.collectionAddress,
		tokenId: parsedArgs.collectibleId,
	});
};

export const countListingsForCollectibleOptions = (
	args: UseCountListingsForCollectibleArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.listingsCount, args, config],
		queryFn: () => fetchCountListingsForCollectible(args, config),
	});
};

export const useCountListingsForCollectible = (
	args: UseCountListingsForCollectibleArgs,
) => {
	const config = useConfig();
	return useQuery(countListingsForCollectibleOptions(args, config));
};
