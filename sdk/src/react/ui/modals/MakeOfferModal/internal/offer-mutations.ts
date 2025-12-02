import { useMutation } from '@tanstack/react-query';
import { toNumber } from 'dnum';
import type { Address } from 'viem';
import { OrderbookKind } from '../../../../../types';
import { type Step, TransactionType } from '../../../../_internal';
import { useAnalytics } from '../../../../_internal/databeat';
import { useConfig, useCurrency, useProcessStep } from '../../../../hooks';
import { waitForTransactionReceipt } from '../../../../utils';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import { fromBigIntString } from './helpers/dnum-utils';
import { useMakeOfferModalState } from './store';

type GeneratedOfferSteps = {
	approveStep?: Step;
	offerStep?: Step;
};

type OfferMutationsParams = {
	priceRaw: string;
	currencyAddress: Address;
	currencyDecimals: number;
};

export const useOfferMutations = (
	tx: GeneratedOfferSteps | undefined,
	params: OfferMutationsParams,
) => {
	const sdkConfig = useConfig();
	const { show: showTxModal } = useTransactionStatusModal();
	const analytics = useAnalytics();
	const state = useMakeOfferModalState();
	const { processStep } = useProcessStep();
	const { data: currency } = useCurrency({
		chainId: state.chainId,
		currencyAddress: params.currencyAddress,
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

	const makeOffer = useMutation({
		mutationFn: async () => {
			if (!tx?.offerStep) throw new Error('No offer step available');
			const res = await executeStepAndWait(tx.offerStep);

			if (currency) {
				const currencyValueRaw = Number(params.priceRaw);
				const priceDnum = fromBigIntString(
					params.priceRaw,
					params.currencyDecimals,
				);
				const currencyValueDecimal = toNumber(priceDnum);

				let requestId: string | undefined;

				if (res.type === 'signature') {
					requestId = res.orderId;
				}

				analytics.trackCreateOffer({
					props: {
						orderbookKind:
							state.orderbookKind || OrderbookKind.sequence_marketplace_v2,
						collectionAddress: state.collectionAddress,
						currencyAddress: params.currencyAddress,
						currencySymbol: currency.symbol || '',
						chainId: state.chainId.toString(),
						requestId: requestId || '',
						txnHash: res.type === 'transaction' ? (res.hash as string) : '',
					},
					nums: {
						currencyValueDecimal,
						currencyValueRaw,
					},
				});
			}

			return res;
		},
		onSuccess: (res) => {
			state.closeModal();
			showTxModal({
				type: TransactionType.OFFER,
				chainId: state.chainId,
				hash: res?.type === 'transaction' ? res.hash : undefined,
				orderId: res?.type === 'signature' ? res.orderId : undefined,
				callbacks: state.callbacks,
				collectionAddress: state.collectionAddress,
				tokenId: state.tokenId,
				queriesToInvalidate: [
					['collectible', 'market-highest-offer'],
					['collectible', 'market-list-offers'],
					['collectible', 'market-count-offers'],
				],
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
		makeOffer,
	};
};
