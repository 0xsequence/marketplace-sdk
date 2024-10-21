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
		</>
	);
};
