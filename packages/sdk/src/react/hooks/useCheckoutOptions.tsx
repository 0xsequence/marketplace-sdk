import type { ChainId } from '@0xsequence/network';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	type CheckoutOptionsMarketplaceReturn,
	MarketplaceKind,
	QueryArgSchema,
	getMarketplaceClient,
} from '../_internal';
import { useConfig } from './useConfig';

const UseCheckoutOptionsSchema: z.ZodObject<
	{
		chainId: z.ZodPipeline<
			z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>,
			z.ZodString
		>;
		orders: z.ZodArray<
			z.ZodObject<
				{
					collectionAddress: z.ZodEffects<z.ZodString, Address, string>;
					orderId: z.ZodString;
					marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
				},
				'strip',
				z.ZodTypeAny,
				{
					orderId: string;
					marketplace: MarketplaceKind;
					collectionAddress?: any;
				},
				{
					orderId: string;
					marketplace: MarketplaceKind;
					collectionAddress: string;
				}
			>,
			'many'
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
	},
	'strip'
> = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	orders: z.array(
		z.object({
			collectionAddress: AddressSchema,
			orderId: z.string(),
			marketplace: z.nativeEnum(MarketplaceKind),
		}),
	),
	query: QueryArgSchema,
});

export type UseCheckoutOptionsArgs = z.infer<typeof UseCheckoutOptionsSchema>;

export type UseCheckoutOptionsReturn = Awaited<
	ReturnType<typeof fetchCheckoutOptions>
>;

const fetchCheckoutOptions = async (
	args: UseCheckoutOptionsArgs & { walletAddress: Hex },
	config: SdkConfig,
): Promise<CheckoutOptionsMarketplaceReturn> => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient.checkoutOptionsMarketplace({
		wallet: args.walletAddress,
		orders: args.orders.map((order) => ({
			contractAddress: order.collectionAddress,
			orderId: order.orderId,
			marketplace: order.marketplace,
		})),
		additionalFee: 0, //TODO: add additional fee
	});
};

export const checkoutOptionsOptions = (
	args: UseCheckoutOptionsArgs & { walletAddress: Hex },
	config: SdkConfig,
): any => {
	return queryOptions({
		queryKey: ['checkoutOptions', args],
		queryFn: () => fetchCheckoutOptions(args, config),
	});
};

export const useCheckoutOptions = (
	args: UseCheckoutOptionsArgs,
): DefinedQueryObserverResult<TData, TError> => {
	const { address } = useAccount();
	const config = useConfig();
	return useQuery(
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		checkoutOptionsOptions({ walletAddress: address!, ...args }, config),
	);
};
