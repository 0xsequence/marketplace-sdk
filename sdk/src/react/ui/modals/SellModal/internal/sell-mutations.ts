import { useMutation } from '@tanstack/react-query';
import type { Hex } from 'viem';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { type Step, TransactionType } from '../../../../_internal';
import { useAnalytics } from '../../../../_internal/databeat';
import { useConfig, useCurrency, useProcessStep } from '../../../../hooks';
import { waitForTransactionReceipt } from '../../../../utils';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import { useSellModalState } from './store';
import type { useGenerateSellTransaction } from './use-generate-sell-transaction';

/**
 * Result type from processStep mutation
 */
export type ProcessStepResult =
	| { type: 'transaction'; hash: Hex }
	| { type: 'signature'; orderId?: string; signature?: Hex };

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

	const approve = useMutation<ProcessStepResult, Error, void>({
		mutationFn: async () => {
			if (!tx?.approveStep) throw new Error('No approval step available');
			return await executeStepAndWait(tx.approveStep);
		},
	});

	const sell = useMutation<ProcessStepResult, Error, void>({
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
						currencyAddress: currency.contractAddress,
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
			state.closeModal();
			showTxModal({
				type: TransactionType.SELL,
				chainId: state.chainId,
				hash: res?.type === 'transaction' ? res.hash : undefined,
				orderId: res?.type === 'signature' ? res.orderId : undefined,
				queriesToInvalidate: [
					['collectible', 'market-highest-offer'],
					['collectible', 'market-list-offers'],
					['collectible', 'market-count-offers'],
					['token', 'balances'],
					['collection', 'balance-details'],
				],
				collectionAddress: state.collectionAddress,
				tokenId: state.tokenId,
			});
		},
	});

	return {
		approve,
		sell,
	};
};
