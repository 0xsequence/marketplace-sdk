import { observer } from '@legendapp/state/react';
import { BuyModal } from './BuyModal/components/Modal';
import { CreateListingModal } from './CreateListingModal/Modal';
import { MakeOfferModal } from './MakeOfferModal/Modal';
import { SellModal } from './SellModal/Modal';
import SuccessfulPurchaseModal from './SuccessfulPurchaseModal';
import { TransferModal } from './TransferModal';
import SwitchChainModal from './_internal/components/switchChainModal';
import TransactionStatusModal from './_internal/components/transactionStatusModal';

export const ModalProvider = observer(() => {
	return (
		<>
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
