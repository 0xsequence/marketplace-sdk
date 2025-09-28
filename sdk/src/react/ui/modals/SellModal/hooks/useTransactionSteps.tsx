import type { Observable } from '@legendapp/state';
import type { Address, Hex } from 'viem';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import {
	balanceQueries,
	collectableKeys,
	type MarketplaceKind,
	StepType,
	type TransactionSteps,
} from '../../../../_internal';
import { useAnalytics } from '../../../../_internal/databeat';
import { TransactionType } from '../../../../_internal/types';
import {
	useConfig,
	useConnectorMetadata,
	useGenerateSellTransaction,
	useMarketCurrencies,
	useProcessStep,
} from '../../../../hooks';
import { waitForTransactionReceipt } from '../../../../utils/waitForTransactionReceipt';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import type { ModalCallbacks } from '../../_internal/types';
import { useMarketPlatformFee } from '../../BuyModal/hooks/useMarketPlatformFee';
import { sellModal$ } from '../store';
import type { SellOrder } from './useSell';
export type ExecutionState = 'approval' | 'sell' | null;

interface UseTransactionStepsArgs {
	collectibleId: string;
	chainId: number;
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
	const { address } = useAccount();
	const { walletKind } = useConnectorMetadata();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const analytics = useAnalytics();
	const { processStep } = useProcessStep();

	const { amount, receiver } = useMarketPlatformFee({
		chainId,
		collectionAddress: collectionAddress,
	});

	const { data: currencies } = useMarketCurrencies({
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
		if (!address) return;

		try {
			const steps = await generateSellTransactionAsync({
				collectionAddress,
				walletType: walletKind,
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
		if (!address) return;

		try {
			steps$.approval.isExecuting.set(true);
			const approvalStep = await getSellSteps().then((steps) =>
				steps?.find((step) => step.id === StepType.tokenApproval),
			);

			if (!approvalStep) {
				throw new Error('No approval step found');
			}

			const result = await processStep(approvalStep, chainId);

			if (result.type === 'transaction') {
				await waitForTransactionReceipt({
					txHash: result.hash,
					chainId,
					sdkConfig,
				});
				steps$.approval.isExecuting.set(false);
				steps$.approval.exist.set(false);
			}
		} catch (error) {
			sellModal$.error.set(error as Error);
			steps$.approval.isExecuting.set(false);
		}
	};

	const sell = async ({
		isTransactionExecuting,
	}: {
		isTransactionExecuting: boolean;
	}) => {
		if (!address) return;

		try {
			steps$.transaction.isExecuting.set(isTransactionExecuting);
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
				const result = await processStep(transactionStep, chainId);
				if (result.type === 'transaction') {
					hash = result.hash;
				}
			}

			if (signatureStep) {
				const result = await processStep(signatureStep, chainId);
				if (result.type === 'signature') {
					orderId = result.orderId;
				}
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
				await waitForTransactionReceipt({
					txHash: hash,
					chainId,
					sdkConfig,
				});
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
						userId: address,
						collectionAddress,
						currencyAddress: ordersData[0].currencyAddress,
						currencySymbol,
						requestId: ordersData[0].orderId,
						tokenId: collectibleId,
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
			console.error('Sell failed:', error);
			steps$.transaction.isExecuting.set(false);
			steps$.transaction.exist.set(false);
			sellModal$.error.set(error as Error);

			if (callbacks?.onError && typeof callbacks.onError === 'function') {
				callbacks.onError(error as Error);
			}
		}
	};

	return {
		generatingSteps,
		executeApproval,
		sell,
	};
};
