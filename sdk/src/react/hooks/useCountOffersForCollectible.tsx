import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
import { countOffersForCollectibleArgsSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const UseCountOffersForCollectibleArgsSchema =
	countOffersForCollectibleArgsSchema
		.omit({
			contractAddress: true,
			tokenId: true,
		})
		.extend({
			collectionAddress: AddressSchema,
			collectibleId: z.string(),
			chainId: ChainIdSchema.pipe(z.coerce.string()),
			query: QueryArgSchema,
		});

export type UseCountOffersForCollectibleArgs = z.infer<
	typeof UseCountOffersForCollectibleArgsSchema
>;

export type UseCountOffersForCollectibleReturn = Awaited<
	ReturnType<typeof fetchCountOffersForCollectible>
>;

const fetchCountOffersForCollectible = async (
	args: UseCountOffersForCollectibleArgs,
	config: SdkConfig,
) => {
	const parsedArgs = UseCountOffersForCollectibleArgsSchema.parse(args);
	const marketplaceClient = getMarketplaceClient(parsedArgs.chainId, config);
	return marketplaceClient.getCountOfOffersForCollectible({
		...parsedArgs,
		contractAddress: parsedArgs.collectionAddress,
		tokenId: parsedArgs.collectibleId,
	});
};

export const countOffersForCollectibleOptions = (
	args: UseCountOffersForCollectibleArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.offersCount, args, config],
		queryFn: () => fetchCountOffersForCollectible(args, config),
	});
};

export const useCountOffersForCollectible = (
	args: UseCountOffersForCollectibleArgs,
) => {
	const config = useConfig();
	return useQuery(countOffersForCollectibleOptions(args, config));
};
