import { useMutation } from '@tanstack/react-query';
import type { Address, Hex } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';
import { OrderbookKind } from '../../../../../types';
import { getSequenceMarketplaceRequestId } from '../../../../../utils/getSequenceMarketRequestId';
import { type Step, TransactionType } from '../../../../_internal';
import {
	balanceQueries,
	collectableKeys,
} from '../../../../_internal/api/query-keys';
import { useAnalytics } from '../../../../_internal/databeat';
import {
	useConfig,
	useMarketCurrencies,
	useProcessStep,
} from '../../../../hooks';
import { waitForTransactionReceipt } from '../../../../utils';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import { fromWeiString, toNumber } from './helpers/dnum-utils';
import { useCreateListingModalState } from './store';

type GeneratedListingSteps = {
	approveStep?: Step;
	listStep?: Step;
};

type ListingMutationsParams = {
	priceInWei: string;
	currencyAddress: Address;
	currencyDecimals: number;
};

export const useListingMutations = (
	tx: GeneratedListingSteps | undefined,
	params: ListingMutationsParams,
) => {
	const sdkConfig = useConfig();
	const { show: showTxModal } = useTransactionStatusModal();
	const analytics = useAnalytics();
	const state = useCreateListingModalState();
	const { processStep } = useProcessStep();
	const { address } = useAccount();
	const publicClient = usePublicClient();
	const { data: currencies } = useMarketCurrencies({
		chainId: state.chainId,
	});

	const currency = currencies?.find(
		(c) => c.contractAddress === params.currencyAddress,
	);

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

	const list = useMutation({
		mutationFn: async () => {
			if (!tx?.listStep) throw new Error('No list step available');
			const res = await executeStepAndWait(tx.listStep);

			// Analytics tracking
			if (currency) {
				// Convert wei string to number for raw value
				const currencyValueRaw = Number(params.priceInWei);

				// Convert wei to decimal using dnum for safe conversion
				const priceDnum = fromWeiString(
					params.priceInWei,
					params.currencyDecimals,
				);
				const currencyValueDecimal = toNumber(priceDnum);

				let requestId: string | undefined;

				if (res.type === 'signature') {
					requestId = res.orderId;
				} else if (
					res.type === 'transaction' &&
					res.hash &&
					(state.orderbookKind === OrderbookKind.sequence_marketplace_v1 ||
						state.orderbookKind === OrderbookKind.sequence_marketplace_v2)
				) {
					requestId = await getSequenceMarketplaceRequestId(
						res.hash as Hex,
						publicClient!,
						address!,
					);
				}

				analytics.trackCreateListing({
					props: {
						orderbookKind:
							state.orderbookKind || OrderbookKind.sequence_marketplace_v2,
						collectionAddress: state.collectionAddress,
						currencyAddress: params.currencyAddress,
						currencySymbol: currency.symbol || '',
						tokenId: state.collectibleId,
						requestId: requestId || '',
						chainId: state.chainId.toString(),
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
				type: TransactionType.LISTING,
				chainId: state.chainId,
				hash: res?.type === 'transaction' ? res.hash : undefined,
				orderId: res?.type === 'signature' ? res.orderId : undefined,
				callbacks: state.callbacks,
				queriesToInvalidate: [
					balanceQueries.all,
					collectableKeys.lowestListings,
					collectableKeys.listings,
					collectableKeys.listingsCount,
					collectableKeys.userBalances,
				],
				collectionAddress: state.collectionAddress,
				collectibleId: state.collectibleId,
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
		list,
	};
};
