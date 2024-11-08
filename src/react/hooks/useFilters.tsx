import {
	type ChainId,
	type QueryArg,
	collectableKeys,
	getMetadataClient,
} from '@internal';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseFiltersArgs = {
	chainId: ChainId;
	collectionAddress: string;
} & QueryArg;

export type UseFilterReturn = Awaited<ReturnType<typeof fetchFilters>>;

export const fetchFilters = async (args: UseFiltersArgs, config: SdkConfig) => {
	const metadataClient = getMetadataClient(config);
	return metadataClient
		.tokenCollectionFilters({
			chainID: String(args.chainId),
			contractAddress: args.collectionAddress,
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
