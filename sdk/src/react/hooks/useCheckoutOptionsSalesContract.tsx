import { queryOptions, skipToken, useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import type { SdkConfig } from '../../types';
import {
	type CheckoutOptionsSalesContractArgs,
	getMarketplaceClient,
} from '../_internal';
import { useConfig } from './useConfig';

type UseCheckoutOptionsSalesContractArgs = Omit<
	CheckoutOptionsSalesContractArgs,
	'wallet' | 'chainId'
> & { chainId: number };

const fetchCheckoutOptionsSalesContract = async (
	args: CheckoutOptionsSalesContractArgs,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.checkoutOptionsSalesContract({
		chainId: args.chainId,
		wallet: args.wallet,
		contractAddress: args.contractAddress,
		collectionAddress: args.collectionAddress,
		items: args.items,
	});
};

export const checkoutOptionsSalesContractOptions = (
	args: UseCheckoutOptionsSalesContractArgs & { wallet?: Hex },
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: ['checkoutOptionsSalesContract', args],
		queryFn: () =>
			fetchCheckoutOptionsSalesContract(
				{
					chainId: String(args.chainId),
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					wallet: args.wallet!,
					contractAddress: args.contractAddress,
					collectionAddress: args.collectionAddress,
					items: args.items,
				},
				config,
			),
		enabled: !!args.wallet,
	});
};

export const useCheckoutOptionsSalesContract = (
	args: UseCheckoutOptionsSalesContractArgs,
) => {
	const { address } = useAccount();
	const config = useConfig();
	return useQuery(
		checkoutOptionsSalesContractOptions({ ...args, wallet: address }, config),
	);
};
