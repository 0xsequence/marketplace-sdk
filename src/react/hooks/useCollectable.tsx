import { collectableKeys } from '@api/query-keys';
import { getMetadataClient } from '@api/services';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseCollectableArgs = {
	chainId: string;
	collectionAddress: string;
	tokenId: string;
};

const fetchCollectable = async (
	args: UseCollectableArgs,
	config: SdkConfig,
) => {
	const metadataClient = getMetadataClient(config);
	return metadataClient
		.getTokenMetadata({
			chainID: args.chainId,
			contractAddress: args.collectionAddress,
			tokenIDs: [args.tokenId],
		})
		.then((resp) => resp.tokenMetadata[0]!);
};

export const collectableOptions = (
	args: UseCollectableArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: [collectableKeys.details, args, config],
		queryFn: () => fetchCollectable(args, config),
	});
};

export const useCollectable = (args: UseCollectableArgs) => {
	const config = useConfig();
	return useQuery(collectableOptions(args, config));
};
