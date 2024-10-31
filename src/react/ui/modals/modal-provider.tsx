import { observer } from '@legendapp/state/react';
import SwitchNetworkModal from './_internal/components/switchNetworkModal';
import TransactionStatusModal from './_internal/components/transactionStatusModal';
import { AccountModal } from './Account';
import { CreateListingModal } from './CreateListingModal';
import { MakeOfferModal } from './MakeOfferModal';
import { SellModal } from './SellModal';
import SuccessfulPurchaseModal from './SuccessfulPurchaseModal';
import { TransferModal } from './TransferModal';
import { _accountModalOpen$ } from './_internal/stores/accountModal';
import { createListingModal$ } from './CreateListingModal/_store';
import { makeOfferModal$ } from './MakeOfferModal/_store';
import { transferModal$ } from './TransferModal/_store';
import { sellModal$ } from './SellModal/_store';
import { successfulPurchaseModal$ } from './SuccessfulPurchaseModal/_store';
const MODAL_CONFIG = [
	{ condition: _accountModalOpen$, Component: AccountModal },
	{ condition: createListingModal$.isOpen, Component: CreateListingModal },
	{ condition: makeOfferModal$.isOpen, Component: MakeOfferModal },
	{ condition: transferModal$.isOpen, Component: TransferModal },
	{ condition: sellModal$.isOpen, Component: SellModal },
	{
		condition: successfulPurchaseModal$.isOpen,
		Component: SuccessfulPurchaseModal,
	},
];

const HELPER_MODALS = [SwitchNetworkModal, TransactionStatusModal];

export const ModalProvider = observer(() => {
	return (
		<>
			{MODAL_CONFIG.map(
				({ condition, Component }, index) =>
					condition.get() && <Component key={index} />,
			)}

			{HELPER_MODALS.map((HelperModal, index) => (
				<HelperModal key={index} />
			))}
		</>
	);
});
