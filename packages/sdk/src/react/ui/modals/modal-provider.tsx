import { observer } from '@legendapp/state/react';
import { BuyModal } from './BuyModal/Modal';
import { CreateListingModal } from './CreateListingModal/Modal';
import { MakeOfferModal } from './MakeOfferModal/Modal';
import { SellModal } from './SellModal/Modal';
import SuccessfulPurchaseModal from './SuccessfulPurchaseModal';
import { TransferModal } from './TransferModal';
import SwitchChainModal from './_internal/components/switchChainModal';
import TransactionStatusModal from './_internal/components/transactionStatusModal';
import { _accountModalOpen$ } from './_internal/stores/accountModal';
import { JSX } from 'react/jsx-runtime';

export const ModalProvider: () => JSX.Element = observer((): JSX.Element => {
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
