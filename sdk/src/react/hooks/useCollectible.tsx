import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	collectableKeys,
	getMetadataClient,
} from '../_internal';
import { useConfig } from './useConfig';

const UseCollectibleSchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	collectibleId: z.string().optional(),
	query: QueryArgSchema,
});

export type UseCollectibleArgs = z.infer<typeof UseCollectibleSchema>;

export type UseCollectibleReturn = Awaited<ReturnType<typeof fetchCollectible>>;

const fetchCollectible = async (
	args: UseCollectibleArgs,
	config: SdkConfig,
) => {
	const parsedArgs = UseCollectibleSchema.parse(args);
	const metadataClient = getMetadataClient(config);
	const tokenIds = parsedArgs.collectibleId ? [parsedArgs.collectibleId] : [];

	return metadataClient
		.getTokenMetadata({
			chainID: parsedArgs.chainId,
			contractAddress: parsedArgs.collectionAddress,
			tokenIDs: tokenIds,
		})
		.then((resp) => resp.tokenMetadata[0]);
};

export const collectibleOptions = (
	args: UseCollectibleArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.details, args, config],
		queryFn: () => fetchCollectible(args, config),
	});
};

export const useCollectible = (args: UseCollectibleArgs) => {
	const config = useConfig();
	return useQuery(collectibleOptions(args, config));
};
