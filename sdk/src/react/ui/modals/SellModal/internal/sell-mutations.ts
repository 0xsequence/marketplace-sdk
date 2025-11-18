import { useMutation } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { type Step, TransactionType } from '../../../../_internal';
import { useAnalytics } from '../../../../_internal/databeat';
import { useConfig, useCurrency, useProcessStep } from '../../../../hooks';
import { waitForTransactionReceipt } from '../../../../utils';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import { useSellModalState } from './store';
import type { useGenerateSellTransaction } from './use-generate-sell-transaction';

export const useSellMutations = (
	tx: ReturnType<typeof useGenerateSellTransaction>['data'],
) => {
	const sdkConfig = useConfig();
	const { show: showTxModal } = useTransactionStatusModal();
	const analytics = useAnalytics();
	const state = useSellModalState();
	const { processStep } = useProcessStep();
	const { address } = useAccount();
	const { data: currency } = useCurrency({
		chainId: state.chainId,
		currencyAddress: state.currencyAddress,
	});

	async function executeStepAndWait(step: Step) {
		const res = await processStep(step, state.chainId);
		if (res.type === 'transaction' && res.hash) {
			await waitForTransactionReceipt({
				txHash: res.hash,
				chainId: state.chainId,
				sdkConfig,
			});
		}
		return res;
	}

	const approve = useMutation({
		mutationFn: async () => {
			if (!tx?.approveStep) throw new Error('No approval step available');
			return await executeStepAndWait(tx.approveStep);
		},
		onError: (e) => state.callbacks?.onError?.(e as Error),
	});

	const sell = useMutation({
		mutationFn: async () => {
			if (!tx?.sellStep) throw new Error('No sell step available');
			const res = await executeStepAndWait(tx.sellStep);

			if (currency && state.order?.priceAmount) {
				const dec = currency.decimals ?? 0;
				const raw = state.order.priceAmount;
				const currencyValueDecimal = Number(formatUnits(BigInt(raw), dec));

				analytics.trackSellItems({
					props: {
						marketplaceKind: state.order.marketplace,
						userId: address || '',
						collectionAddress: state.collectionAddress,
						currencyAddress: currency.contractAddress, // Currency now has Address type
						currencySymbol: currency.symbol || '',
						requestId: state.order.orderId,
						tokenId: state.tokenId.toString(),
						chainId: state.chainId.toString(),
						txnHash: res.type === 'transaction' ? res.hash : '',
					},
					nums: {
						currencyValueDecimal,
						currencyValueRaw: Number(raw),
					},
				});
			}

			return res;
		},
		onSuccess: (res) => {
			// TODO: this should be solved in a headless way
			state.closeModal();
			showTxModal({
				type: TransactionType.SELL,
				chainId: state.chainId,
				hash: res?.type === 'transaction' ? res.hash : undefined,
				orderId: res?.type === 'signature' ? res.orderId : undefined,
				callbacks: state.callbacks,
				queriesToInvalidate: [['balances']], //TODO: Add other queries to invalidate
				collectionAddress: state.collectionAddress,
				tokenId: state.tokenId,
			});

			state.callbacks?.onSuccess?.({
				hash: res?.type === 'transaction' ? res.hash : undefined,
				orderId: res?.type === 'signature' ? res.orderId : undefined,
			});
		},
		onError: (e) => state.callbacks?.onError?.(e as Error),
	});

	return {
		approve,
		sell,
	};
};
