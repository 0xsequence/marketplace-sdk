import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	OrderSide,
	QueryArgSchema,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
import { collectiblesFilterSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const BaseSchema = z.object({
	chainId: z.number(),
	collectionAddress: AddressSchema,
	query: QueryArgSchema,
});

const UseCountOfCollectableSchema = BaseSchema.extend({
	filter: collectiblesFilterSchema,
	side: z.nativeEnum(OrderSide),
}).or(
	BaseSchema.extend({
		filter: z.undefined(),
		side: z.undefined(),
	}),
);

export type UseCountOfCollectablesArgs = z.infer<
	typeof UseCountOfCollectableSchema
>;

export type UseContOfCollectableReturn = Awaited<
	ReturnType<typeof fetchCountOfCollectables>
>;

const fetchCountOfCollectables = async (
	args: UseCountOfCollectablesArgs,
	config: SdkConfig,
) => {
	const parsedArgs = UseCountOfCollectableSchema.parse(args);
	const marketplaceClient = getMarketplaceClient(parsedArgs.chainId, config);
	if (parsedArgs.filter) {
		return marketplaceClient
			.getCountOfFilteredCollectibles({
				...parsedArgs,
				contractAddress: parsedArgs.collectionAddress,
				// biome-ignore lint/style/noNonNullAssertion: safe to assert here, as it's validated
				side: parsedArgs.side!,
			})
			.then((resp) => resp.count);
	}
	return marketplaceClient
		.getCountOfAllCollectibles({
			...parsedArgs,
			contractAddress: parsedArgs.collectionAddress,
		})
		.then((resp) => resp.count);
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
