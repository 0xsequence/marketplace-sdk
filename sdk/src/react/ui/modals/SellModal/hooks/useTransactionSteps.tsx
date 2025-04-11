import type { Observable } from '@legendapp/state';
import { formatUnits } from 'viem';
import type { Address, Hex } from 'viem';
import {
	ExecuteType,
	type MarketplaceKind,
	type Step,
	StepType,
	type TransactionSteps,
	balanceQueries,
	collectableKeys,
	getMarketplaceClient,
} from '../../../../_internal';
import { useAnalytics } from '../../../../_internal/databeat';
import { TransactionType } from '../../../../_internal/types';
import type {
	SignatureStep,
	TransactionStep,
} from '../../../../_internal/utils';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import {
	useConfig,
	useCurrencies,
	useGenerateSellTransaction,
} from '../../../../hooks';
import { useFees } from '../../BuyModal/hooks/useFees';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import type { ModalCallbacks } from '../../_internal/types';
import { sellModalStore } from '../store';
export type ExecutionState = 'approval' | 'sell' | null;

export type SellOrder = {
	orderId: string;
	tokenId: string;
	quantity: string;
	pricePerToken: string;
	currencyAddress: string;
};

interface UseTransactionStepsArgs {
	collectibleId: string;
	chainId: number;
	collectionAddress: string;
	marketplace: MarketplaceKind;
	ordersData: Array<SellOrder>;
	callbacks?: ModalCallbacks;
}

export const useTransactionSteps = ({
	collectibleId,
	chainId,
	collectionAddress,
	marketplace,
	ordersData,
	callbacks,
}: UseTransactionStepsArgs) => {
	const { wallet } = useWallet();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const marketplaceClient = getMarketplaceClient(chainId, sdkConfig);
	const analytics = useAnalytics();

	const { amount, receiver } = useFees({
		chainId,
		collectionAddress: collectionAddress,
	});

	const { data: currencies } = useCurrencies({
		chainId,
	});

	const { generateSellTransactionAsync, isPending: generatingSteps } =
		useGenerateSellTransaction({
			chainId,
			onSuccess: (steps) => {
				if (!steps) return;
			},
		});

	const getSellSteps = async () => {
		if (!wallet) return;

		try {
			const address = await wallet.address();

			const steps = await generateSellTransactionAsync({
				collectionAddress,
				walletType: wallet.walletKind,
				marketplace,
				ordersData,
				additionalFees: [
					{
						amount,
						receiver,
					},
				],
				seller: address,
			});

			return steps;
		} catch (error) {
			if (callbacks?.onError) {
				callbacks.onError(error as Error);
			} else {
				console.debug('onError callback not provided:', error);
			}
		}
	};

	const executeApproval = async () => {
		if (!wallet) return;

		try {
			const approvalStep = await getSellSteps().then((steps) =>
				steps?.find((step) => step.id === StepType.tokenApproval),
			);

			const hash = await wallet.handleSendTransactionStep(
				chainId,
				approvalStep as TransactionStep,
			);

			await wallet.handleConfirmTransactionStep(hash, chainId);
			return hash;
		} catch (error) {
			if (callbacks?.onError) {
				callbacks.onError(error as Error);
			} else {
				console.debug('onError callback not provided:', error);
			}
		}
	};

	const sell = async () => {
		if (!wallet) return;

		try {
			const steps = await getSellSteps();
			const transactionStep = steps?.find((step) => step.id === StepType.sell);
			const signatureStep = steps?.find(
				(step) => step.id === StepType.signEIP712,
			);

			console.debug('transactionStep', transactionStep);
			console.debug('signatureStep', signatureStep);

			if (!transactionStep && !signatureStep) {
				throw new Error('No transaction or signature step found');
			}

			let hash: Hex | undefined;
			let orderId: string | undefined;

			if (transactionStep) {
				hash = await executeTransaction({ transactionStep });
			}

			if (signatureStep) {
				orderId = await executeSignature({ signatureStep });
			}

			sellModalStore.send({ type: 'close' });

			showTransactionStatusModal({
				type: TransactionType.SELL,
				collectionAddress: collectionAddress as Address,
				chainId,
				collectibleId,
				hash,
				orderId,
				callbacks,
				queriesToInvalidate: [balanceQueries.all, collectableKeys.userBalances],
			});

			if (hash) {
				await wallet.handleConfirmTransactionStep(hash, Number(chainId));
			}

			if (hash || orderId) {
				const currency = currencies?.find(
					(currency) =>
						currency.contractAddress === ordersData[0].currencyAddress,
				);
				const currencyDecimal = currency?.decimals || 0;
				const currencySymbol = currency?.symbol || '';
				const currencyValueRaw = Number(ordersData[0].pricePerToken);
				const currencyValueDecimal = Number(
					formatUnits(BigInt(currencyValueRaw), currencyDecimal),
				);

				analytics.trackSellItems({
					props: {
						marketplaceKind: marketplace,
						collectionAddress,
						currencyAddress: ordersData[0].currencyAddress,
						currencySymbol,
						chainId: chainId.toString(),
						txnHash: hash || '',
					},
					nums: {
						currencyValueDecimal,
						currencyValueRaw,
					},
				});
			}
		} catch (error) {
			if (callbacks?.onError && typeof callbacks.onError === 'function') {
				callbacks.onError(error as Error);
			}
		}
	};

	const executeTransaction = async ({
		transactionStep,
	}: {
		transactionStep: Step;
	}) => {
		if (!wallet) return;

		const hash = await wallet.handleSendTransactionStep(
			Number(chainId),
			transactionStep as TransactionStep,
		);

		return hash;
	};

	const executeSignature = async ({
		signatureStep,
	}: {
		signatureStep: Step;
	}) => {
		if (!wallet) return;

		const signature = await wallet.handleSignMessageStep(
			signatureStep as SignatureStep,
		);

		const result = await marketplaceClient.execute({
			signature: signature as string,
			executeType: ExecuteType.order,
			body: signatureStep.post?.body,
		});

		return result.orderId;
	};

	return {
		generatingSteps,
		executeApproval,
		sell,
	};
};
