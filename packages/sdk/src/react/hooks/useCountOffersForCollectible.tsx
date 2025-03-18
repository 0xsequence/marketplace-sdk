import type { ChainId } from '@0xsequence/network';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { MarketplaceKind, SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	type GetCountOfOffersForCollectibleReturn,
	QueryArgSchema,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
import { countOffersForCollectibleArgsSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const UseCountOffersForCollectibleArgsSchema: z.ZodObject<
	z.objectUtil.extendShape<
		Omit<
			{
				contractAddress: z.ZodString;
				tokenId: z.ZodString;
				filter: z.ZodOptional<
					z.ZodObject<
						{
							createdBy: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
							marketplace: z.ZodOptional<
								z.ZodArray<z.ZodNativeEnum<MarketplaceKind>, 'many'>
							>;
							currencies: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
						},
						'strip',
						z.ZodTypeAny,
						{
							currencies?: string[] | undefined;
							marketplace?: MarketplaceKind[] | undefined;
							createdBy?: string[] | undefined;
						},
						{
							currencies?: string[] | undefined;
							marketplace?: MarketplaceKind[] | undefined;
							createdBy?: string[] | undefined;
						}
					>
				>;
			},
			'tokenId' | 'contractAddress'
		>,
		{
			collectionAddress: z.ZodEffects<z.ZodString, Address, string>;
			collectibleId: z.ZodString;
			chainId: z.ZodPipeline<
				z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>,
				z.ZodString
			>;
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
		}
	>,
	'strip'
> = countOffersForCollectibleArgsSchema
	.omit({
		contractAddress: true,
		tokenId: true,
	})
	.extend({
		collectionAddress: AddressSchema,
		collectibleId: z.string(),
		chainId: ChainIdSchema.pipe(z.coerce.string()),
		query: QueryArgSchema,
	});

export type UseCountOffersForCollectibleArgs = z.infer<
	typeof UseCountOffersForCollectibleArgsSchema
>;

export type UseCountOffersForCollectibleReturn = Awaited<
	ReturnType<typeof fetchCountOffersForCollectible>
>;

const fetchCountOffersForCollectible = async (
	args: UseCountOffersForCollectibleArgs,
	config: SdkConfig,
): Promise<GetCountOfOffersForCollectibleReturn> => {
	const parsedArgs = UseCountOffersForCollectibleArgsSchema.parse(args);
	const marketplaceClient = getMarketplaceClient(parsedArgs.chainId, config);
	return marketplaceClient.getCountOfOffersForCollectible({
		...parsedArgs,
		contractAddress: parsedArgs.collectionAddress,
		tokenId: parsedArgs.collectibleId,
	});
};

export const countOffersForCollectibleOptions = (
	args: UseCountOffersForCollectibleArgs,
	config: SdkConfig,
): any => {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.offersCount, args, config],
		queryFn: () => fetchCountOffersForCollectible(args, config),
	});
};

export const useCountOffersForCollectible = (
	args: UseCountOffersForCollectibleArgs,
): DefinedQueryObserverResult<TData, TError> => {
	const config = useConfig();
	return useQuery(countOffersForCollectibleOptions(args, config));
};
