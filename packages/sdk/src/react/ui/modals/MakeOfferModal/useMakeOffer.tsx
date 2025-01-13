import { OrderbookKind } from '../../../../types';
import { OfferInput } from '../../../_internal/transaction-machine/execute-transaction';
import { useWallet } from '../../../_internal/transaction-machine/useWallet';
import { ModalCallbacks } from '../_internal/types';
import { useTransactionSteps } from './useTransactionSteps';

interface UseMakeOfferArgs {
	offerInput: OfferInput;
	offerPriceChanged: boolean;
	chainId: string;
	collectionAddress: string;
	orderbookKind?: OrderbookKind;
	callbacks?: ModalCallbacks;
	closeMainModal: () => void;
}

export const useMakeOffer = ({
	offerInput,
	offerPriceChanged,
	chainId,
	collectionAddress,
	orderbookKind = OrderbookKind.sequence_marketplace_v2,
	callbacks,
	closeMainModal,
}: UseMakeOfferArgs) => {
	const { wallet, isLoading: walletLoading } = useWallet();

	const { steps, generatingSteps, executionState } = useTransactionSteps({
		offerInput,
		offerPriceChanged,
		chainId,
		collectionAddress,
		orderbookKind,
		wallet,
		callbacks,
		closeMainModal,
	});

	return {
		steps,
		isLoading: walletLoading || generatingSteps,
		executionState,
	};
};
