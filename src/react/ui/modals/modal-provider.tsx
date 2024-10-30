import { observer } from '@legendapp/state/react';
import SwitchNetworkModal from './_internal/components/switchNetworkModal';
import TransactionStatusModal from './_internal/components/transactionStatusModal';
import { AccountModal } from './Account';
import { CreateListingModal } from './CreateListingModal';
import { MakeOfferModal } from './MakeOfferModal';
import { ReceivedOfferModal } from './ReceivedOfferModal';
import SuccessfulPurchaseModal from './SuccessfulPurchaseModal';
import { TransferModal } from './TransferModal';
import { _accountModalOpen$ } from './_internal/stores/accountModal';
import { createListingModal$ } from './CreateListingModal/_store';
import { makeOfferModal$ } from './MakeOfferModal/_store';
import { transferModal$ } from './TransferModal/_store';
import { receivedOfferModal$ } from './ReceivedOfferModal/_store';
import { successfulPurchaseModal$ } from './SuccessfulPurchaseModal/_store';

export const ModalProvider = observer(() => {
	return (
		<>
			{_accountModalOpen$.get() && <AccountModal />}
			{createListingModal$.isOpen.get() && <CreateListingModal />}
			{makeOfferModal$.isOpen.get() && <MakeOfferModal />}
			{transferModal$.isOpen.get() && <TransferModal />}
			{receivedOfferModal$.isOpen.get() && <ReceivedOfferModal />}
			{successfulPurchaseModal$.isOpen.get() && <SuccessfulPurchaseModal />}

			{/* Helper Modals */}
			<SwitchNetworkModal />
			<TransactionStatusModal />
		</>
	);
});
