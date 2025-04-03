import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	QueryArgSchema,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
import { getCollectibleLowestListingArgsSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const UseLowestListingSchema = getCollectibleLowestListingArgsSchema
	.omit({
		contractAddress: true,
	})
	.extend({
		collectionAddress: AddressSchema,
		chainId: z.number(),
		query: QueryArgSchema,
	});

export type UseLowestListingArgs = z.infer<typeof UseLowestListingSchema>;

export type UseLowestListingReturn = Awaited<
	ReturnType<typeof fetchLowestListing>
>;

const fetchLowestListing = async (
	args: UseLowestListingArgs,
	config: SdkConfig,
) => {
	const parsedArgs = UseLowestListingSchema.parse(args);
	const marketplaceClient = getMarketplaceClient(parsedArgs.chainId, config);
	return marketplaceClient.getCollectibleLowestListing({
		...parsedArgs,
		contractAddress: parsedArgs.collectionAddress,
	});
};

export const lowestListingOptions = (
	args: UseLowestListingArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.lowestListings, args, config],
		queryFn: () => fetchLowestListing(args, config),
	});
};

export const useLowestListing = (args: UseLowestListingArgs) => {
	const config = useConfig();
	return useQuery(lowestListingOptions(args, config));
};
