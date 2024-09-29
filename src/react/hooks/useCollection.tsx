import { type ChainId } from '@0xsequence/network';
import { collectionKeys } from '@api/queryKeys';
import { getMetadataClient } from '@api/services';
import { queryOptions, useQuery } from '@tanstack/react-query';

import { SdkConfig } from '@types';

export type UseCollectionArgs = {
	chainId: string | ChainId;
	collectionAddress: string;
};

const fetchCollection = async (args: UseCollectionArgs, config: SdkConfig) => {
	const metadataClient = getMetadataClient(config);
	return metadataClient
		.getContractInfo({
			chainID: String(args.chainId),
			contractAddress: args.collectionAddress,
		})
		.then((resp) => resp.contractInfo);
};

export const collectionOptions = (
	args: UseCollectionArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: [collectionKeys.detail, args, config],
		queryFn: () => fetchCollection(args, config),
	});
};

export const useCollection = (args: UseCollectionArgs) => {
	const config = useConfig();
	return useQuery(collectionOptions(args, config));
};
