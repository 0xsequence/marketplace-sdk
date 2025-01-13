import { useSelectPaymentModal } from '@0xsequence/kit-checkout';
import type { Hash, Hex } from 'viem';
import type { ModalCallbacks } from '../../_internal/types';
import {
	type CheckoutOptions,
	getMarketplaceClient,
	type MarketplaceKind,
} from '../../../../_internal';
import { buyModal$ } from '../store';
import { useFees } from './useFees';
import { wallet } from '../../../../_internal/transaction-machine/wallet';
import { getConnectorClient, getWalletClient } from 'wagmi/actions';
import { Connector, useAccount, useConfig as useWagmiConfig } from 'wagmi';
import { useConfig } from '../../../../hooks';


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
	const config = useConfig();
	const marketplaceClient = getMarketplaceClient(Number(chainId), config);
  const fees = useFees({ chainId: Number(chainId), collectionAddress });
  const wagmiConfig = useWagmiConfig();
  const { connector } = useAccount();

	const buy = async (input: {
			orderId: string;
			quantity: string;
			collectableDecimals: number;
			marketplace: MarketplaceKind;
			checkoutOptions: CheckoutOptions;
  }) => {
    const wagmiWallet = await getWalletClient(wagmiConfig);

    const walletInstance = wallet({
			wallet: wagmiWallet,
			chains: wagmiConfig.chains,
      connector: connector as Connector
		});

			const { steps } = await marketplaceClient.generateBuyTransaction({
				collectionAddress,
				buyer: await walletInstance.address(),
				marketplace: input.marketplace,
				ordersData: [
					{
						orderId: input.orderId,
						quantity: input.quantity,
					},
				],
				additionalFees: [fees],
				walletType: walletInstance.walletKind,
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
				recipientAddress: await walletInstance.address(),
				enableMainCurrencyPayment: true,
				enableSwapPayments: !!input.checkoutOptions.swap,
				creditCardProviders: input.checkoutOptions.nftCheckout || [],
				onSuccess: (hash: string) => callbacks?.onSuccess?.(hash as Hash),
				onError: callbacks?.onError,
				onClose: () => {
					console.log('onClose');
					buyModal$.close();
			},
		});
	};
	return {
		buy,
	};
};
