import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	type CheckoutOptionsItem,
	QueryArgSchema,
	getMarketplaceClient,
} from '../_internal';
import { useConfig } from './useConfig';

const UseCheckoutOptionsSalesContractSchema = z.object({
	chainId: z.number(),
	contractAddress: AddressSchema,
	collectionAddress: AddressSchema,
	items: z.array(z.any()), // CheckoutOptionsItem array
	query: QueryArgSchema,
});

export type UseCheckoutOptionsSalesContractArgs = z.infer<
	typeof UseCheckoutOptionsSalesContractSchema
>;

export type UseCheckoutOptionsSalesContractReturn = Awaited<
	ReturnType<typeof fetchCheckoutOptionsSalesContract>
>;

const fetchCheckoutOptionsSalesContract = async (
	args: UseCheckoutOptionsSalesContractArgs & { walletAddress: Hex },
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.checkoutOptionsSalesContract({
		chainId: String(args.chainId),
		wallet: args.walletAddress,
		contractAddress: args.contractAddress,
		collectionAddress: args.collectionAddress,
		items: args.items,
	});
};

export const checkoutOptionsSalesContractOptions = (
	args: UseCheckoutOptionsSalesContractArgs & { walletAddress: Hex },
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: ['checkoutOptionsSalesContract', args],
		queryFn: () => fetchCheckoutOptionsSalesContract(args, config),
	});
};

/**
 * Hook to fetch checkout options for sales contracts (primary sales)
 *
 * @param args - The arguments for fetching checkout options
 * @returns Query result containing the checkout options for sales contract
 *
 * @example
 * ```tsx
 * const { data: options, isLoading } = useCheckoutOptionsSalesContract({
 *   chainId: 1,
 *   contractAddress: '0x123...', // Sales contract address
 *   collectionAddress: '0x456...', // NFT collection address
 *   items: [{ tokenId: '1', quantity: '1' }],
 * });
 * ```
 */
export const useCheckoutOptionsSalesContract = (
	args: UseCheckoutOptionsSalesContractArgs,
) => {
	const { address } = useAccount();
	const config = useConfig();
	return useQuery(
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		checkoutOptionsSalesContractOptions(
			{ walletAddress: address!, ...args },
			config,
		),
	);
};
