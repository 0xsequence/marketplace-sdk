import type { Observable } from '@legendapp/state';
import type { Address, Hex } from 'viem';
import { OrderbookKind, type Price } from '../../../../../types';
import {
	ExecuteType,
	type Step,
	StepType,
	type TransactionSteps,
	balanceQueries,
	collectableKeys,
	getMarketplaceClient,
} from '../../../../_internal';
import { TransactionType } from '../../../../_internal/types';
import type { OfferInput } from '../../../../_internal/types';
import type { SignatureStep } from '../../../../_internal/utils';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import { useConfig, useCurrency } from '../../../../hooks';
import { useGenerateOfferTransaction } from '../../../../hooks/useGenerateOfferTransaction';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import type { ModalCallbacks } from '../../_internal/types';

export type ExecutionState = 'approval' | 'offer' | null;

interface UseTransactionStepsArgs {
	offerInput: OfferInput;
	chainId: string;
	collectionAddress: string;
	orderbookKind?: OrderbookKind;
	callbacks?: ModalCallbacks;
	closeMainModal: () => void;
	steps$: Observable<TransactionSteps>;
}

export const useTransactionSteps = ({
	offerInput,
	chainId,
	collectionAddress,
	orderbookKind = OrderbookKind.sequence_marketplace_v2,
	callbacks,
	closeMainModal,
	steps$,
}: UseTransactionStepsArgs) => {
	const { wallet } = useWallet();
	const expiry = new Date(Number(offerInput.offer.expiry) * 1000);
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const marketplaceClient = getMarketplaceClient(chainId, sdkConfig);
	const { generateOfferTransactionAsync, isPending: generatingSteps } =
		useGenerateOfferTransaction({
			chainId,
			onSuccess: (steps) => {
				if (!steps) return;
			},
		});
	const { data: currency } = useCurrency({
		chainId,
		currencyAddress: offerInput.offer.currencyAddress,
	});

	const getOfferSteps = async () => {
		if (!wallet) return;

		try {
			const address = await wallet.address();

			const steps = await generateOfferTransactionAsync({
				collectionAddress,
				maker: address,
				walletType: wallet.walletKind,
				contractType: offerInput.contractType,
				orderbook: orderbookKind,
				offer: {
					...offerInput.offer,
					expiry,
				},
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
			const approvalStep = await getOfferSteps().then((steps) =>
				steps?.find((step) => step.id === StepType.tokenApproval),
			);

			const hash = await wallet.handleSendTransactionStep(
				Number(chainId),
				approvalStep as any,
			);

			await wallet.handleConfirmTransactionStep(hash, Number(chainId));
			steps$.approval.isExecuting.set(false);
			steps$.approval.exist.set(false);
		} catch (error) {
			steps$.approval.isExecuting.set(false);
		}
	};

	const makeOffer = async () => {
		if (!wallet) return;

		try {
			steps$.transaction.isExecuting.set(true);
			const steps = await getOfferSteps();
			const transactionStep = steps?.find(
				(step) => step.id === StepType.createOffer,
			);
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
				type: TransactionType.OFFER,
				collectionAddress: collectionAddress as Address,
				chainId,
				collectibleId: offerInput.offer.tokenId,
				hash,
				orderId,
				callbacks,
				queriesToInvalidate: [
					balanceQueries.all,
					collectableKeys.highestOffers,
					collectableKeys.offers,
					collectableKeys.offersCount,
					collectableKeys.userBalances,
				],
				price: {
					amountRaw: offerInput.offer.pricePerToken,
					currency,
				} as Price,
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
	}: {
		transactionStep: Step;
	}) => {
		if (!wallet) return;

		const hash = await wallet.handleSendTransactionStep(
			Number(chainId),
			transactionStep as any,
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
		makeOffer,
	};
};
