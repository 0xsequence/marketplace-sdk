import { AccountModal } from './Account';
import { CreateListingModal } from './CreateListingModal';
import { MakeOfferModal } from './MakeOfferModal';
import { TransferModal } from './TransferModal';

export const ModalProvider = () => {
	return (
		<>
			<AccountModal />
			<CreateListingModal />
			<MakeOfferModal />
			<TransferModal />
		</>
	);
};
