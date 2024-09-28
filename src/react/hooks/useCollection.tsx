import { type ChainId } from '@0xsequence/network';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { getMetadataClient } from '../_internal/api/services';
import { collectionKeys } from '../_internal/api/queryKeys';
import { useConfig } from './useConfig';
import { SdkConfig } from '../../types/sdk-config';

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
