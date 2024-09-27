import { collectionKeys } from '../_internal/queryKeys';
import { getMetadataClient } from '../_internal/services';
import { type Config } from '../types/config';
import { useConfig } from './useConfig';
import { type ChainId } from '@0xsequence/network';
import { queryOptions, useQuery } from '@tanstack/react-query';

export type UseCollectionArgs = {
  chainId: string | ChainId;
  collectionAddress: string;
};

const fetchCollection = async (args: UseCollectionArgs, config: Config) => {
  const metadataClient = getMetadataClient(config);
  return metadataClient
    .getContractInfo({
      chainID: String(args.chainId),
      contractAddress: args.collectionAddress,
    })
    .then((resp) => resp.contractInfo);
};

export const collectionOptions = (args: UseCollectionArgs, config: Config) => {
  return queryOptions({
    queryKey: [collectionKeys.detail, args, config],
    queryFn: () => fetchCollection(args, config),
  });
};

export const useCollection = (args: UseCollectionArgs) => {
  const config = useConfig();
  return useQuery(collectionOptions(args, config));
};
