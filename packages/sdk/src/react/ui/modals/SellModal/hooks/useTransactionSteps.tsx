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
import type { SellOrder } from './useSell';
export type ExecutionState = 'approval' | 'sell' | null;

interface UseTransactionStepsArgs {
	collectibleId: string;
	chainId: string;
	collectionAddress: string;
	marketplace: MarketplaceKind;
	ordersData: Array<SellOrder>;
	callbacks?: ModalCallbacks;
	closeMainModal: () => void;
	steps$: Observable<TransactionSteps>;
}

export const useTransactionSteps = ({
	collectibleId,
	chainId,
	collectionAddress,
	marketplace,
	ordersData,
	callbacks,
	closeMainModal,
	steps$,
}: UseTransactionStepsArgs) => {
	const { wallet } = useWallet();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const marketplaceClient = getMarketplaceClient(chainId, sdkConfig);
	const analytics = useAnalytics();

	const { amount, receiver } = useFees({
		chainId: Number(chainId),
		collectionAddress: collectionAddress,
	});

	const { data: currencies } = useCurrencies({
		chainId: Number(chainId),
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
			steps$.approval.isExecuting.set(true);
			const approvalStep = await getSellSteps().then((steps) =>
				steps?.find((step) => step.id === StepType.tokenApproval),
			);

			const hash = await wallet.handleSendTransactionStep(
				Number(chainId),
				approvalStep as TransactionStep,
			);

			await wallet.handleConfirmTransactionStep(hash, Number(chainId));
			steps$.approval.isExecuting.set(false);
			steps$.approval.exist.set(false);
		} catch (error) {
			steps$.approval.isExecuting.set(false);
		}
	};

	const sell = async () => {
		if (!wallet) return;

		try {
			steps$.transaction.isExecuting.set(true);
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

			closeMainModal();

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
				steps$.transaction.isExecuting.set(false);
				steps$.transaction.exist.set(false);
			}

			if (orderId) {
				// no need to wait for receipt, because the order is already created
				steps$.transaction.isExecuting.set(false);
				steps$.transaction.exist.set(false);
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
						chainId,
						txnHash: hash || '',
					},
					nums: {
						currencyValueDecimal,
						currencyValueRaw,
					},
				});
			}
		} catch (error) {
			steps$.transaction.isExecuting.set(false);
			steps$.transaction.exist.set(false);
			if (callbacks?.onError && typeof callbacks.onError === 'function') {
				callbacks.onError(error as Error);
			}
		}
	};

	const executeTransaction = async ({
		transactionStep,
	}: { transactionStep: Step }) => {
		if (!wallet) return;

		const hash = await wallet.handleSendTransactionStep(
			Number(chainId),
			transactionStep as TransactionStep,
		);

		return hash;
	};

	const executeSignature = async ({
		signatureStep,
	}: { signatureStep: Step }) => {
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
