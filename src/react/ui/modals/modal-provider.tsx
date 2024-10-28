import SwitchNetworkModal from './_internal/components/switchNetworkModal';
import TransactionStatusModal from './_internal/components/transactionStatusModal';
import { AccountModal } from './Account';
import { CreateListingModal } from './CreateListingModal';
import { MakeOfferModal } from './MakeOfferModal';
import { ReceivedOfferModal } from './ReceivedOfferModal';
import SuccessfulPurchaseModal from './SuccessfulPurchaseModal';
import { TransferModal } from './TransferModal';

export const ModalProvider = () => {
	return (
		<>
			<AccountModal />
			<CreateListingModal />
			<MakeOfferModal />
			<TransferModal />
			<ReceivedOfferModal />
			<SuccessfulPurchaseModal />

			{/* Helper Modals */}
			<SwitchNetworkModal />
			<TransactionStatusModal />
		</>
	);
};
