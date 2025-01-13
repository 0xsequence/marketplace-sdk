import { useSelectPaymentModal } from '@0xsequence/kit-checkout';
import { useCallback } from 'react';
import type { Hash, Hex } from 'viem';
import { useWallet } from '../../../../_internal/transaction-machine/useWallet';
import type { ModalCallbacks } from '../../_internal/types';
import {
	type CheckoutOptions,
	getMarketplaceClient,
	type MarketplaceKind,
} from '../../../../_internal';
import { buyModal$ } from '../store';
import { useConfig } from '../../../../hooks';
import { useFees } from './useFees';

interface UseBuyCollectableProps {
	chainId: string;
	collectionAddress: string;
	tokenId: string;
	callbacks?: ModalCallbacks;
	priceCurrencyAddress: string;
}

export const useBuyCollectable = ({
	chainId,
	collectionAddress,
	tokenId,
	callbacks,
	priceCurrencyAddress,
}: UseBuyCollectableProps) => {
	const { openSelectPaymentModal } = useSelectPaymentModal();
	const { wallet } = useWallet();
	const config = useConfig();
	const marketplaceClient = getMarketplaceClient(Number(chainId), config);
	const fees = useFees({ chainId: Number(chainId), collectionAddress });

	const buy = useCallback(
		async (input: {
			orderId: string;
			quantity: string;
			collectableDecimals: number;
			marketplace: MarketplaceKind;
			checkoutOptions: CheckoutOptions;
		}) => {
			if (!wallet) return;

			const { steps } = await marketplaceClient.generateBuyTransaction({
				collectionAddress,
				buyer: await wallet.address(),
				marketplace: input.marketplace,
				ordersData: [
					{
						orderId: input.orderId,
						quantity: input.quantity,
					},
				],
				additionalFees: [fees],
				walletType: wallet.walletKind,
			});

			const step = steps[0];

			openSelectPaymentModal({
				chain: chainId,
				collectibles: [
					{
						tokenId: tokenId,
						quantity: input.quantity,
						decimals: input.collectableDecimals,
					},
				],
				currencyAddress: priceCurrencyAddress,
				price: step.value,
				targetContractAddress: step.to,
				txData: step.data as Hex,
				collectionAddress,
				recipientAddress: await wallet.address(),
				enableMainCurrencyPayment: true,
				enableSwapPayments: !!input.checkoutOptions.swap,
				creditCardProviders: input.checkoutOptions.nftCheckout || [],
				onSuccess: (hash: string) => callbacks?.onSuccess?.(hash as Hash),
				onError: callbacks?.onError,
				onClose: () => {
					buyModal$.close();
				},
			});
		},
		[wallet, chainId, collectionAddress, callbacks],
	);
	return {
		buy,
	};
};
