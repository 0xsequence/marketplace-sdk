import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../../types';
import {
	AddressSchema,
	QueryArgSchema,
	collectionKeys,
	getMetadataClient,
} from '../../_internal';
import type { UseCollectionParams } from '../useCollection';

export const UseCollectionSchema = z.object({
	chainId: z.number(),
	collectionAddress: AddressSchema,
	query: QueryArgSchema,
});

export const fetchCollection = async (
	args: UseCollectionParams,
	config: SdkConfig,
) => {
	const parsedArgs = UseCollectionSchema.parse(args);
	const metadataClient = getMetadataClient(config);
	return metadataClient
		.getContractInfo({
			chainID: parsedArgs.chainId.toString(),
			contractAddress: parsedArgs.collectionAddress,
		})
		.then((resp) => resp.contractInfo);
};

export const collectionOptions = (
	args: UseCollectionParams,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...collectionKeys.detail, args, config],
		queryFn: () => fetchCollection(args, config),
	});
};
