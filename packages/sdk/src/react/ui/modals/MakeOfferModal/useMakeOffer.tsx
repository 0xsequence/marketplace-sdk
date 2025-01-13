import { OrderbookKind } from '../../../../types';
import { OfferInput } from '../../../_internal/transaction-machine/execute-transaction';
import { ModalCallbacks } from '../_internal/types';
import { useChainManagement } from './useChainManagement';
import { useTransactionSteps } from './useTransactionSteps';

interface UseMakeOfferArgs {
	offerInput: OfferInput;
	chainId: string;
	collectionAddress: string;
	orderbookKind?: OrderbookKind;
	callbacks?: ModalCallbacks;
}

export const useMakeOffer = ({
	offerInput,
	chainId,
	collectionAddress,
	orderbookKind = OrderbookKind.sequence_marketplace_v2,
	callbacks,
}: UseMakeOfferArgs) => {
	const { isLoading: chainLoading, wallet } = useChainManagement({ chainId });

	const { steps, generatingSteps } = useTransactionSteps({
		offerInput,
		chainId,
		collectionAddress,
		orderbookKind,
		wallet,
		callbacks,
	});

	return {
		steps,
		isLoading: chainLoading || generatingSteps,
	};
};
