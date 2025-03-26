import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../../types';
import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	collectionKeys,
	getMetadataClient,
} from '../../_internal';
import type { UseCollectionArgs } from '../useCollection';

export const UseCollectionSchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	query: QueryArgSchema,
});

export const fetchCollection = async (
	args: UseCollectionArgs,
	config: SdkConfig,
) => {
	const parsedArgs = UseCollectionSchema.parse(args);
	const metadataClient = getMetadataClient(config);
	return metadataClient
		.getContractInfo({
			chainID: parsedArgs.chainId,
			contractAddress: parsedArgs.collectionAddress,
		})
		.then((resp) => resp.contractInfo);
};

export const collectionOptions = (
	args: UseCollectionArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...collectionKeys.detail, args, config],
		queryFn: () => fetchCollection(args, config),
	});
};
