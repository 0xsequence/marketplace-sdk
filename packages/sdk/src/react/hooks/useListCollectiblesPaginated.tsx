import type { ChainId } from '@0xsequence/network';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type {
	MarketplaceKind,
	OrderSide,
	Page,
	PropertyType,
	SdkConfig,
	SortOrder,
} from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	type ListCollectiblesArgs,
	type ListCollectiblesReturn,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
import { listCollectiblesArgsSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const UseListCollectiblesPaginatedArgsSchema: z.ZodObject<
	z.objectUtil.extendShape<
		Omit<
			{
				side: z.ZodNativeEnum<OrderSide>;
				contractAddress: z.ZodString;
				filter: z.ZodOptional<
					z.ZodObject<
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
					>
				>;
				page: z.ZodOptional<
					z.ZodObject<
						{
							page: z.ZodNumber;
							pageSize: z.ZodNumber;
							more: z.ZodOptional<z.ZodBoolean>;
							sort: z.ZodOptional<
								z.ZodArray<
									z.ZodObject<
										{
											column: z.ZodString;
											order: z.ZodNativeEnum<SortOrder>;
										},
										'strip',
										z.ZodTypeAny,
										{
											order: SortOrder;
											column: string;
										},
										{
											order: SortOrder;
											column: string;
										}
									>,
									'many'
								>
							>;
						},
						'strip',
						z.ZodTypeAny,
						{
							page: number;
							pageSize: number;
							sort?:
								| {
										order: SortOrder;
										column: string;
								  }[]
								| undefined;
							more?: boolean | undefined;
						},
						{
							page: number;
							pageSize: number;
							sort?:
								| {
										order: SortOrder;
										column: string;
								  }[]
								| undefined;
							more?: boolean | undefined;
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
			query: z.ZodDefault<
				z.ZodOptional<
					z.ZodObject<
						{
							enabled: z.ZodOptional<z.ZodBoolean>;
							page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
							pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
						},
						'strip',
						z.ZodTypeAny,
						{
							page: number;
							pageSize: number;
							enabled?: boolean | undefined;
						},
						{
							page?: number | undefined;
							enabled?: boolean | undefined;
							pageSize?: number | undefined;
						}
					>
				>
			>;
		}
	>,
	'strip'
> = listCollectiblesArgsSchema
	.omit({
		contractAddress: true,
	})
	.extend({
		collectionAddress: AddressSchema,
		chainId: ChainIdSchema.pipe(z.coerce.string()),
		query: z
			.object({
				enabled: z.boolean().optional(),
				page: z.number().optional().default(1),
				pageSize: z.number().optional().default(30),
			})
			.optional()
			.default({}),
	});

export type UseListCollectiblesPaginatedArgs = z.infer<
	typeof UseListCollectiblesPaginatedArgsSchema
>;

export type UseListCollectiblesPaginatedReturn = Awaited<
	ReturnType<typeof fetchCollectiblesPaginated>
>;

const fetchCollectiblesPaginated = async (
	args: UseListCollectiblesPaginatedArgs,
	marketplaceClient: Awaited<ReturnType<typeof getMarketplaceClient>>,
): Promise<ListCollectiblesReturn> => {
	const parsedArgs = UseListCollectiblesPaginatedArgsSchema.parse(args);
	const page: Page = {
		page: parsedArgs.query?.page ?? 1,
		pageSize: parsedArgs.query?.pageSize ?? 30,
	};

	const arg = {
		...parsedArgs,
		contractAddress: parsedArgs.collectionAddress,
		page,
	} as ListCollectiblesArgs;

	return marketplaceClient.listCollectibles(arg);
};

export const listCollectiblesPaginatedOptions = (
	args: UseListCollectiblesPaginatedArgs,
	config: SdkConfig,
): any => {
	const marketplaceClient = getMarketplaceClient(
		args.chainId as string,
		config,
	);
	return queryOptions({
		queryKey: [...collectableKeys.lists, 'paginated', args],
		queryFn: () => fetchCollectiblesPaginated(args, marketplaceClient),
		enabled: args.query?.enabled ?? true,
	});
};

export const useListCollectiblesPaginated = (
	args: UseListCollectiblesPaginatedArgs,
): DefinedQueryObserverResult<TData, TError> => {
	const config = useConfig();
	return useQuery(listCollectiblesPaginatedOptions(args, config));
};
