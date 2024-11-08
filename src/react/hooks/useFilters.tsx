import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	collectableKeys,
	getMetadataClient,
} from '@internal';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { z } from 'zod';
import { useConfig } from './useConfig';

const UseFiltersSchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	query: QueryArgSchema,
});

export type UseFiltersArgs = z.infer<typeof UseFiltersSchema>;

export type UseFilterReturn = Awaited<ReturnType<typeof fetchFilters>>;

export const fetchFilters = async (args: UseFiltersArgs, config: SdkConfig) => {
	const parsedArgs = UseFiltersSchema.parse(args);
	const metadataClient = getMetadataClient(config);
	return metadataClient
		.tokenCollectionFilters({
			chainID: parsedArgs.chainId,
			contractAddress: parsedArgs.collectionAddress,
		})
		.then((resp) => resp.filters);
};

export const filtersOptions = (args: UseFiltersArgs, config: SdkConfig) => {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.filter, args, config],
		queryFn: () => fetchFilters(args, config),
	});
};

export const useFilters = (args: UseFiltersArgs) => {
	const config = useConfig();
	return useQuery(filtersOptions(args, config));
};
