import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	getMetadataClient,
} from '../_internal';
import { collectionOptions } from './options/collectionOptions';
import { useConfig } from './useConfig';

const UseCollectionSchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	query: QueryArgSchema,
});

export type UseCollectionArgs = z.input<typeof UseCollectionSchema>;

export type UseCollectionReturn = Awaited<ReturnType<typeof fetchCollection>>;

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

export const useCollection = (args: UseCollectionArgs) => {
	const config = useConfig();
	return useQuery(collectionOptions(args, config));
};
