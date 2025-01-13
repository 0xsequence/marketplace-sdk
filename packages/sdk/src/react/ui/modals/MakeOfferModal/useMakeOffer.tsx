import { OrderbookKind } from '../../../../types';
import { OfferInput } from '../../../_internal/transaction-machine/execute-transaction';
import { useWallet } from '../../../_internal/transaction-machine/useWallet';
import { ModalCallbacks } from '../_internal/types';
import { useGetTokenApprovalData } from './useGetTokenApproval';
import { useTransactionSteps } from './useTransactionSteps';

interface UseMakeOfferArgs {
	offerInput: OfferInput;
	chainId: string;
	collectionAddress: string;
	orderbookKind?: OrderbookKind;
	callbacks?: ModalCallbacks;
	closeMainModal: () => void;
}

export const useMakeOffer = ({
	offerInput,
	chainId,
	collectionAddress,
	orderbookKind = OrderbookKind.sequence_marketplace_v2,
	callbacks,
	closeMainModal,
}: UseMakeOfferArgs) => {
	const { wallet, isLoading: walletLoading } = useWallet();
	const { data: tokenApproval, isLoading: tokenApprovalIsLoading } =
		useGetTokenApprovalData({
			chainId,
			tokenId: offerInput.offer.tokenId,
			collectionAddress,
			currencyAddress: offerInput.offer.currencyAddress,
			contractType: offerInput.contractType,
			orderbook: orderbookKind,
		});

	const {
		generatingSteps,
		executionState,
		executeApproval,
		executeTransaction,
	} = useTransactionSteps({
		offerInput,
		chainId,
		collectionAddress,
		orderbookKind,
		wallet,
		callbacks,
		closeMainModal,
	});

	return {
		isLoading: walletLoading || generatingSteps,
		executionState,
		executeApproval,
		executeTransaction,
		tokenApprovalStepExists: tokenApproval?.step !== null,
		tokenApprovalIsLoading,
	};
};
