import type { Observable } from '@legendapp/state';
import { type Address, formatUnits, type Hex } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';
import { OrderbookKind, type Price } from '../../../../../types';
import type { WaasFeeConfirmationState } from '../../../../../types/waas-types';
import { getSequenceMarketplaceRequestId } from '../../../../../utils/getSequenceMarketRequestId';
import {
	OfferType,
	StepType,
	type TransactionSteps,
} from '../../../../_internal';
import { useAnalytics } from '../../../../_internal/databeat';
import type { OfferInput } from '../../../../_internal/types';
import { TransactionType } from '../../../../_internal/types';

import {
	useConfig,
	useConnectorMetadata,
	useGenerateOfferTransaction,
	useProcessStep,
} from '../../../../hooks';
import { useCurrency } from '../../../../hooks/currency/currency';
import { waitForTransactionReceipt } from '../../../../utils/waitForTransactionReceipt';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import type { ModalCallbacks } from '../../_internal/types';
export type ExecutionState = 'approval' | 'offer' | null;

interface UseTransactionStepsArgs {
	offerInput: OfferInput;
	chainId: number;
	collectionAddress: Address;
	orderbookKind?: OrderbookKind;
	callbacks?: ModalCallbacks;
	closeMainModal: () => void;
	steps$: Observable<TransactionSteps>;
	waasFeeConfirmation?: WaasFeeConfirmationState;
}

export const useTransactionSteps = ({
	offerInput,
	chainId,
	collectionAddress,
	orderbookKind = OrderbookKind.sequence_marketplace_v2,
	callbacks,
	closeMainModal,
	steps$,
	waasFeeConfirmation,
}: UseTransactionStepsArgs) => {
	const { address } = useAccount();
	const publicClient = usePublicClient({ chainId });
	const { walletKind } = useConnectorMetadata();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const analytics = useAnalytics();
	const { processStep } = useProcessStep();
	const { generateOfferTransactionAsync, isPending: generatingSteps } =
		useGenerateOfferTransaction({
			chainId,
			onSuccess: (steps) => {
				if (!steps) return;
			},
		});
	const { data: currency } = useCurrency({
		chainId,
		currencyAddress: offerInput.offer.currencyAddress as Address,
	});

	const getOfferSteps = async () => {
		if (!address) return;

		try {
			const steps = await generateOfferTransactionAsync({
				collectionAddress,
				maker: address,
				walletType: walletKind,
				contractType: offerInput.contractType,
				orderbook: orderbookKind,
				offer: {
					...offerInput.offer,
					expiry: new Date(Number(offerInput.offer.expiry) * 1000),
				},
				offerType: OfferType.item,
				additionalFees: [],
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
		try {
			steps$.approval.isExecuting.set(true);
			const approvalStep = await getOfferSteps().then((steps) =>
				steps?.find((step) => step.id === StepType.tokenApproval),
			);

			if (!approvalStep) {
				throw new Error('No approval step found');
			}

			const result = await processStep({
				step: approvalStep,
				chainId,
				waasFeeConfirmation,
			});

			if (result.type === 'transaction') {
				await waitForTransactionReceipt({
					txHash: result.hash,
					chainId,
					sdkConfig,
				});
				steps$.approval.isExecuting.set(false);
				steps$.approval.exist.set(false);
			}
		} catch (_error) {
			steps$.approval.isExecuting.set(false);
		}
	};

	const makeOffer = async ({
		isTransactionExecuting,
	}: {
		isTransactionExecuting: boolean;
	}) => {
		try {
			steps$.transaction.isExecuting.set(isTransactionExecuting);
			const steps = await getOfferSteps();

			if (!steps) {
				throw new Error('No transaction or signature step found');
			}

			let hash: Hex | undefined;
			let orderId: string | undefined;

			if (steps) {
				for (const step of steps) {
					const result = await processStep({
						step,
						chainId,
						waasFeeConfirmation,
					});
					if (result.type === 'transaction') {
						hash = result.hash;
					}
				}
			}

			closeMainModal();

			showTransactionStatusModal({
				type: TransactionType.OFFER,
				collectionAddress: collectionAddress as Address,
				chainId,
				collectibleId: offerInput.offer.tokenId,
				hash,
				orderId,
				callbacks,
				queriesToInvalidate: [
					['collectible', 'market-highest-offer'],
					['collectible', 'market-list-offers'],
					['collectible', 'market-count-offers'],
					['token', 'balances'],
				],
				price: {
					amountRaw: offerInput.offer.pricePerToken,
					currency,
				} as Price,
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
				const currencyDecimal = currency?.decimals || 0;
				const currencyValueRaw = Number(offerInput.offer.pricePerToken);
				const currencyValueDecimal = Number(
					formatUnits(BigInt(currencyValueRaw), currencyDecimal),
				);

				let requestId = orderId;

				if (
					hash &&
					publicClient &&
					address &&
					(orderbookKind === OrderbookKind.sequence_marketplace_v1 ||
						orderbookKind === OrderbookKind.sequence_marketplace_v2)
				) {
					requestId = await getSequenceMarketplaceRequestId(
						hash,
						publicClient,
						address,
					);
				}

				analytics.trackCreateOffer({
					props: {
						orderbookKind,
						collectionAddress,
						currencyAddress: offerInput.offer.currencyAddress,
						currencySymbol: currency?.symbol || '',
						chainId: chainId.toString(),
						requestId: requestId || '',
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

	return {
		generatingSteps,
		executeApproval,
		makeOffer,
	};
};
