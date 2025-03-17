import type { TokenMetadata } from '@0xsequence/metadata';
import type { ChainId } from '@0xsequence/network';
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

const UseCollectibleSchema: z.ZodObject<
	{
		chainId: z.ZodPipeline<
			z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>,
			z.ZodString
		>;
		collectionAddress: z.ZodEffects<z.ZodString, Address, string>;
		collectibleId: z.ZodString;
		query: z.ZodOptional<
			z.ZodObject<
				{
					enabled: z.ZodOptional<z.ZodBoolean>;
				},
				'strip',
				z.ZodTypeAny,
				{
					enabled?: boolean | undefined;
				},
				{
					enabled?: boolean | undefined;
				}
			>
		>;
	},
	'strip'
> = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	collectibleId: z.string(),
	query: QueryArgSchema,
});

export type UseCollectibleArgs = z.infer<typeof UseCollectibleSchema>;

export type UseCollectibleReturn = Awaited<ReturnType<typeof fetchCollectible>>;

const fetchCollectible = async (
	args: UseCollectibleArgs,
	config: SdkConfig,
): Promise<TokenMetadata> => {
	const parsedArgs = UseCollectibleSchema.parse(args);
	const metadataClient = getMetadataClient(config);
	return metadataClient
		.getTokenMetadata({
			chainID: parsedArgs.chainId,
			contractAddress: parsedArgs.collectionAddress,
			tokenIDs: [parsedArgs.collectibleId],
		})
		.then((resp) => resp.tokenMetadata[0]);
};

export const collectibleOptions = (
	args: UseCollectibleArgs,
	config: SdkConfig,
): any => {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.details, args, config],
		queryFn: () => fetchCollectible(args, config),
	});
};

export const useCollectible = (
	args: UseCollectibleArgs,
): DefinedQueryObserverResult<TData, TError> => {
	const config = useConfig();
	return useQuery(collectibleOptions(args, config));
};
