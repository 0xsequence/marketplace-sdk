import { SequenceCheckoutProvider } from '@0xsequence/checkout';
import { observer } from '@legendapp/state/react';
import type { ReactNode } from 'react';
import { useConfig } from '../hooks';
import SwitchChainModal from '../ui/modals/_internal/components/switchChainModal';
import TransactionStatusModal from '../ui/modals/_internal/components/transactionStatusModal';
import { BuyModal } from '../ui/modals/BuyModal/components/Modal';
import { CreateListingModal } from '../ui/modals/CreateListingModal/Modal';
import { MakeOfferModal } from '../ui/modals/MakeOfferModal/Modal';
import { SellModal } from '../ui/modals/SellModal/Modal';
import SuccessfulPurchaseModal from '../ui/modals/SuccessfulPurchaseModal';
import { TransferModal } from '../ui/modals/TransferModal';
import { ShadowRoot } from './shadow-root';

interface ModalProviderProps {
	children?: ReactNode;
}

export const ModalProvider = observer(({ children }: ModalProviderProps) => {
	const { shadowDom, experimentalShadowDomCssOverride } = useConfig();

	return (
		<>
			{children}
			{/* <SequenceCheckoutProvider> */}
			<ShadowRoot
				enabled={shadowDom ?? true}
				customCSS={experimentalShadowDomCssOverride}
			>
				<CreateListingModal />
				<MakeOfferModal />
				<TransferModal />
				<SellModal />
				<BuyModal />
				<SuccessfulPurchaseModal />
				{/* Helper modals */}
				<SwitchChainModal />
				<TransactionStatusModal />
			</ShadowRoot>
			{/* </SequenceCheckoutProvider> */}
		</>
	);
});
