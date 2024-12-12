import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	MarketplaceKind,
	QueryArgSchema,
	WalletKind,
	getMarketplaceClient,
} from '../_internal';
import { useConfig } from './useConfig';

export const UseGenerateBuyTransactionArgsSchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	marketplace: z.nativeEnum(MarketplaceKind),
	ordersData: z.array(
		z.object({
			orderId: z.string(),
			quantity: z.string(),
			marketplace: z.string(),
		}),
	),
	walletType: z.nativeEnum(WalletKind).optional(),
	query: QueryArgSchema,
});

type UseGenerateBuyTransactionArgs = z.infer<
	typeof UseGenerateBuyTransactionArgsSchema
>;

export const fetchGenerateBuyTransaction = async (
	args: UseGenerateBuyTransactionArgs & { buyer: Hex },
	config: SdkConfig,
) => {
	const parsedArgs = UseGenerateBuyTransactionArgsSchema.parse(args);
	const marketplaceClient = getMarketplaceClient(parsedArgs.chainId, config);

	return marketplaceClient
		.generateBuyTransaction({
			...parsedArgs,
			buyer: args.buyer,
			additionalFees: [], // TODO: Add additional fees
		})
		.then((data) => data.steps);
};

export const generateBuyTransactionOptions = (
	args: UseGenerateBuyTransactionArgs & { buyer: Hex },
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: ['generateBuyTransaction', args],
		queryFn: () => fetchGenerateBuyTransaction(args, config),
		...args.query,
	});
};

export const useGenerateBuyTransaction = (
	args: UseGenerateBuyTransactionArgs,
) => {
	const { address } = useAccount();
	const config = useConfig();
	return useQuery(
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		generateBuyTransactionOptions({ buyer: address!, ...args }, config),
	);
};
