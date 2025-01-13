import { observer } from '@legendapp/state/react';
import { AccountModal } from './Account';
import { MakeOfferModal } from './MakeOfferModal/Modal';
import { SellModal } from './SellModal/Modal';
import SuccessfulPurchaseModal from './SuccessfulPurchaseModal';
import { TransferModal } from './TransferModal';
import SwitchChainModal from './_internal/components/switchChainModal';
import TransactionStatusModal from './_internal/components/transactionStatusModal';
import { _accountModalOpen$ } from './_internal/stores/accountModal';
import { CreateListingModal } from './CreateListingModal/Modal';
import { BuyModal } from './BuyModal/Modal';

export const ModalProvider = observer(() => {
	return (
		<>
			<AccountModal />
			<CreateListingModal />
			<MakeOfferModal />
			<TransferModal />
			<SellModal />
			<BuyModal />
			<SuccessfulPurchaseModal />
			{/* Helper modals */}
			<SwitchChainModal />
			<TransactionStatusModal />
		</>
	);
});
