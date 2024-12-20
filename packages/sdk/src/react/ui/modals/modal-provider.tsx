import { observer } from '@legendapp/state/react';
import { AccountModal } from './Account';
import { BuyModal } from './BuyModal';
import { CreateListingModal } from './CreateListingModal';
import { MakeOfferModal } from './MakeOfferModal';
import { SellModal } from './SellModal';
import SuccessfulPurchaseModal from './SuccessfulPurchaseModal';
import { TransferModal } from './TransferModal';
import SwitchChainModal from './_internal/components/switchChainModal';
import TransactionStatusModal from './_internal/components/transactionStatusModal';
import { _accountModalOpen$ } from './_internal/stores/accountModal';

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
