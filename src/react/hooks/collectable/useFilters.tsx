import { SdkConfig } from '../../../types/sdk-config';
import { collectableKeys } from '../../_internal/api/queryKeys';
import { getMetadataClient } from '../../_internal/services';
import { useConfig } from '../useConfig';
import { type ChainId } from '@0xsequence/network';
import { queryOptions, useQuery } from '@tanstack/react-query';

export type UseCollectableFiltersArgs = {
	chainId: string | ChainId;
	collectionAddress: string;
};

export const fetchCollectibleFilters = async (
	args: UseCollectableFiltersArgs,
	config: SdkConfig,
) => {
	const metadataClient = getMetadataClient(config);
	return metadataClient
		.tokenCollectionFilters({
			chainID: String(args.chainId),
			contractAddress: args.collectionAddress,
		})
		.then((resp) => resp.filters);
};

export const collectableFiltersOptions = (
	args: UseCollectableFiltersArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: [collectableKeys.filter, args, config],
		queryFn: () => fetchCollectibleFilters(args, config),
	});
};

export const useCollectableFilters = (args: UseCollectableFiltersArgs) => {
	const config = useConfig();
	return useQuery(collectableFiltersOptions(args, config));
};
