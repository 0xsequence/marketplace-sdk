import type { ContractInfo } from '@0xsequence/metadata';
import type { ChainId } from '@0xsequence/network';
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

export const UseCollectionSchema: z.ZodObject<
	{
		chainId: z.ZodPipeline<
			z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>,
			z.ZodString
		>;
		collectionAddress: z.ZodEffects<z.ZodString, Address, string>;
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
	query: QueryArgSchema,
});

export const fetchCollection = async (
	args: UseCollectionArgs,
	config: SdkConfig,
): Promise<ContractInfo> => {
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
): any => {
	return queryOptions({
		...args.query,
		queryKey: [...collectionKeys.detail, args, config],
		queryFn: () => fetchCollection(args, config),
	});
};
