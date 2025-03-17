import type { ChainId } from '@0xsequence/network';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { MarketplaceKind, PropertyType, SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	OrderSide,
	QueryArgSchema,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
import { collectiblesFilterSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const BaseSchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	query: QueryArgSchema,
});

const UseCountOfCollectableSchema: z.ZodUnion<
	[
		z.ZodObject<
			z.objectUtil.extendShape<
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
				{
					filter: z.ZodObject<
						{
							includeEmpty: z.ZodBoolean;
							searchText: z.ZodOptional<z.ZodString>;
							properties: z.ZodOptional<
								z.ZodArray<
									z.ZodObject<
										{
											name: z.ZodString;
											type: z.ZodNativeEnum<PropertyType>;
											min: z.ZodOptional<z.ZodNumber>;
											max: z.ZodOptional<z.ZodNumber>;
											values: z.ZodOptional<z.ZodArray<z.ZodAny, 'many'>>;
										},
										'strip',
										z.ZodTypeAny,
										{
											type: PropertyType;
											name: string;
											values?: any[] | undefined;
											min?: number | undefined;
											max?: number | undefined;
										},
										{
											type: PropertyType;
											name: string;
											values?: any[] | undefined;
											min?: number | undefined;
											max?: number | undefined;
										}
									>,
									'many'
								>
							>;
							marketplaces: z.ZodOptional<
								z.ZodArray<z.ZodNativeEnum<MarketplaceKind>, 'many'>
							>;
							inAccounts: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
							notInAccounts: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
							ordersCreatedBy: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
							ordersNotCreatedBy: z.ZodOptional<
								z.ZodArray<z.ZodString, 'many'>
							>;
						},
						'strip',
						z.ZodTypeAny,
						{
							includeEmpty: boolean;
							searchText?: string | undefined;
							properties?:
								| {
										type: PropertyType;
										name: string;
										values?: any[] | undefined;
										min?: number | undefined;
										max?: number | undefined;
								  }[]
								| undefined;
							marketplaces?: MarketplaceKind[] | undefined;
							inAccounts?: string[] | undefined;
							notInAccounts?: string[] | undefined;
							ordersCreatedBy?: string[] | undefined;
							ordersNotCreatedBy?: string[] | undefined;
						},
						{
							includeEmpty: boolean;
							searchText?: string | undefined;
							properties?:
								| {
										type: PropertyType;
										name: string;
										values?: any[] | undefined;
										min?: number | undefined;
										max?: number | undefined;
								  }[]
								| undefined;
							marketplaces?: MarketplaceKind[] | undefined;
							inAccounts?: string[] | undefined;
							notInAccounts?: string[] | undefined;
							ordersCreatedBy?: string[] | undefined;
							ordersNotCreatedBy?: string[] | undefined;
						}
					>;
					side: z.ZodNativeEnum<typeof OrderSide>;
				}
			>,
			'strip',
			z.ZodTypeAny,
			{
				filter: {
					includeEmpty: boolean;
					searchText?: string | undefined;
					properties?:
						| {
								type: PropertyType;
								name: string;
								values?: any[] | undefined;
								min?: number | undefined;
								max?: number | undefined;
						  }[]
						| undefined;
					marketplaces?: MarketplaceKind[] | undefined;
					inAccounts?: string[] | undefined;
					notInAccounts?: string[] | undefined;
					ordersCreatedBy?: string[] | undefined;
					ordersNotCreatedBy?: string[] | undefined;
				};
				chainId: string;
				side: OrderSide;
				query?:
					| {
							enabled?: boolean | undefined;
					  }
					| undefined;
				collectionAddress?: any;
			},
			{
				filter: {
					includeEmpty: boolean;
					searchText?: string | undefined;
					properties?:
						| {
								type: PropertyType;
								name: string;
								values?: any[] | undefined;
								min?: number | undefined;
								max?: number | undefined;
						  }[]
						| undefined;
					marketplaces?: MarketplaceKind[] | undefined;
					inAccounts?: string[] | undefined;
					notInAccounts?: string[] | undefined;
					ordersCreatedBy?: string[] | undefined;
					ordersNotCreatedBy?: string[] | undefined;
				};
				chainId: string | number;
				collectionAddress: string;
				side: OrderSide;
				query?:
					| {
							enabled?: boolean | undefined;
					  }
					| undefined;
			}
		>,
		z.ZodObject<
			z.objectUtil.extendShape<
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
				{
					filter: z.ZodUndefined;
					side: z.ZodUndefined;
				}
			>,
			'strip',
			z.ZodTypeAny,
			{
				chainId: string;
				filter?: undefined;
				query?:
					| {
							enabled?: boolean | undefined;
					  }
					| undefined;
				collectionAddress?: any;
				side?: undefined;
			},
			{
				chainId: string | number;
				collectionAddress: string;
				filter?: undefined;
				query?:
					| {
							enabled?: boolean | undefined;
					  }
					| undefined;
				side?: undefined;
			}
		>,
	]
> = BaseSchema.extend({
	filter: collectiblesFilterSchema,
	side: z.nativeEnum(OrderSide),
}).or(
	BaseSchema.extend({
		filter: z.undefined(),
		side: z.undefined(),
	}),
);

export type UseCountOfCollectablesArgs = z.infer<
	typeof UseCountOfCollectableSchema
>;

export type UseContOfCollectableReturn = Awaited<
	ReturnType<typeof fetchCountOfCollectables>
>;

const fetchCountOfCollectables = async (
	args: UseCountOfCollectablesArgs,
	config: SdkConfig,
): Promise<number> => {
	const parsedArgs = UseCountOfCollectableSchema.parse(args);
	const marketplaceClient = getMarketplaceClient(parsedArgs.chainId, config);
	if (parsedArgs.filter) {
		return marketplaceClient
			.getCountOfFilteredCollectibles({
				...parsedArgs,
				contractAddress: parsedArgs.collectionAddress,
				// biome-ignore lint/style/noNonNullAssertion: safe to assert here, as it's validated
				side: parsedArgs.side!,
			})
			.then((resp) => resp.count);
	}
	return marketplaceClient
		.getCountOfAllCollectibles({
			...parsedArgs,
			contractAddress: parsedArgs.collectionAddress,
		})
		.then((resp) => resp.count);
};

export const countOfCollectablesOptions = (
	args: UseCountOfCollectablesArgs,
	config: SdkConfig,
): any => {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.counts, args],
		queryFn: () => fetchCountOfCollectables(args, config),
	});
};

export const useCountOfCollectables = (
	args: UseCountOfCollectablesArgs,
): DefinedQueryObserverResult<TData, TError> => {
	const config = useConfig();
	return useQuery(countOfCollectablesOptions(args, config));
};
