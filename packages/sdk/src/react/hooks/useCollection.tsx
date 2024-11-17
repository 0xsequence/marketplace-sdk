import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	collectionKeys,
	getMetadataClient,
} from '#internal';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '#types';
import { z } from 'zod';
import { useConfig } from './useConfig';

const UseCollectionSchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	query: QueryArgSchema,
});

export type UseCollectionArgs = z.input<typeof UseCollectionSchema>;

export type UseCollectionReturn = Awaited<ReturnType<typeof fetchCollection>>;

const fetchCollection = async (args: UseCollectionArgs, config: SdkConfig) => {
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

export const useCollection = (args: UseCollectionArgs) => {
	const config = useConfig();
	return useQuery(collectionOptions(args, config));
};
