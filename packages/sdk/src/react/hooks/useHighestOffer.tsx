import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	collectableKeys,
	getMarketplaceClient,
} from '@internal';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { z } from 'zod';
import { getCollectibleHighestOfferArgsSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const UseHighestOfferArgsSchema = getCollectibleHighestOfferArgsSchema
	.omit({
		contractAddress: true,
	})
	.extend({
		collectionAddress: AddressSchema,
		chainId: ChainIdSchema.pipe(z.coerce.string()),
		query: QueryArgSchema,
	});

export type UseHighestOfferArgs = z.infer<typeof UseHighestOfferArgsSchema>;

export type UseHighestOfferReturn = Awaited<
	ReturnType<typeof fetchHighestOffer>
>;

const fetchHighestOffer = async (
	args: UseHighestOfferArgs,
	config: SdkConfig,
) => {
	const parsedArgs = UseHighestOfferArgsSchema.parse(args);
	const marketplaceClient = getMarketplaceClient(parsedArgs.chainId, config);
	return marketplaceClient.getCollectibleHighestOffer({
		...parsedArgs,
		contractAddress: parsedArgs.collectionAddress,
	});
};

export const highestOfferOptions = (
	args: UseHighestOfferArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.highestOffers, args, config],
		queryFn: () => fetchHighestOffer(args, config),
	});
};

export const useHighestOffer = (args: UseHighestOfferArgs) => {
	const config = useConfig();
	return useQuery(highestOfferOptions(args, config));
};
