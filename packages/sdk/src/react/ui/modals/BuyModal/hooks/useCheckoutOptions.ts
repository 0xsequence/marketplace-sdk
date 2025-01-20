import type { Hex } from 'viem';
import {
	getMarketplaceClient,
	type MarketplaceKind,
} from '../../../../_internal';
import { useConfig } from '../../../../hooks';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import { useFees } from './useFees';
import { useQuery } from '@tanstack/react-query';

export const useCheckoutOptions = (input: {
	chainId: number;
	collectionAddress: Hex;
	orderId: string;
	marketplace: MarketplaceKind;
}) => {
	const config = useConfig();
	const { wallet } = useWallet();
	const fees = useFees({
		chainId: input.chainId,
		collectionAddress: input.collectionAddress,
	});

	return useQuery({
		queryKey: [
			'checkoutOptions',
			input.chainId,
			input.collectionAddress,
			input.orderId,
			input.marketplace,
		],
		queryFn: async () => {
			const marketplaceClient = getMarketplaceClient(input.chainId, config);
			return marketplaceClient
				.checkoutOptionsMarketplace({
					wallet: await wallet!.address(),
					orders: [
						{
							contractAddress: input.collectionAddress,
							orderId: input.orderId,
							marketplace: input.marketplace,
						},
					],
					additionalFee: Number(fees.amount),
				})
				.then((res) => res.options);
		},
		enabled: !!wallet,
	});
};
