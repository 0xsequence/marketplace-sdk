import { SdkConfig } from '../../../types/sdk-config';
import { collectableKeys } from '../../_internal/api/queryKeys';
import { getMetadataClient } from '../../_internal/api/services';
import { useConfig } from '../useConfig';
import { type ChainId } from '@0xsequence/network';
import { queryOptions, useQuery } from '@tanstack/react-query';

export type UseFiltersArgs = {
	chainId: string | ChainId;
	collectionAddress: string;
};

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
		queryKey: [collectableKeys.filter, args, config],
		queryFn: () => fetchFilters(args, config),
	});
};

export const useFilters = (args: UseFiltersArgs) => {
	const config = useConfig();
	return useQuery(filtersOptions(args, config));
};
