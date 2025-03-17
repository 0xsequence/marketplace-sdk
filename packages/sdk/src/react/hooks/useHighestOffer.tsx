import type { ChainId } from '@0xsequence/network';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { MarketplaceKind, SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	type GetCollectibleHighestOfferReturn,
	QueryArgSchema,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
import { getCollectibleHighestOfferArgsSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const UseHighestOfferArgsSchema: z.ZodObject<
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
			'contractAddress'
		>,
		{
			collectionAddress: z.ZodEffects<z.ZodString, Address, string>;
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
> = getCollectibleHighestOfferArgsSchema
	.omit({
		contractAddress: true,
	})
	.extend({
		collectionAddress: AddressSchema,
		chainId: ChainIdSchema.pipe(z.coerce.string()),
		query: QueryArgSchema,
	});

export type UseHighestOfferArgs = z.infer<typeof UseHighestOfferArgsSchema>;

export type UseHighestOfferReturn = Awaited<
	ReturnType<typeof fetchHighestOffer>
>;

const fetchHighestOffer = async (
	args: UseHighestOfferArgs,
	config: SdkConfig,
): Promise<GetCollectibleHighestOfferReturn> => {
	const parsedArgs = UseHighestOfferArgsSchema.parse(args);
	const marketplaceClient = getMarketplaceClient(parsedArgs.chainId, config);
	return marketplaceClient.getCollectibleHighestOffer({
		...parsedArgs,
		contractAddress: parsedArgs.collectionAddress,
	});
};

export const highestOfferOptions = (
	args: UseHighestOfferArgs,
	config: SdkConfig,
): any => {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.highestOffers, args, config],
		queryFn: () => fetchHighestOffer(args, config),
	});
};

export const useHighestOffer = (
	args: UseHighestOfferArgs,
): DefinedQueryObserverResult<TData, TError> => {
	const config = useConfig();
	return useQuery(highestOfferOptions(args, config));
};
