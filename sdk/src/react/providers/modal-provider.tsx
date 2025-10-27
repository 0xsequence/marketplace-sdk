// import { SequenceCheckoutProvider } from '@0xsequence/checkout';
import { observer } from '@legendapp/state/react';
import type { ReactNode } from 'react';
import { marketplaceApiURL } from '../_internal';
import { useConfig } from '../hooks';
import SwitchChainErrorModal from '../ui/modals/_internal/components/switchChainErrorModal';
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
	const sdkConfig = useConfig();
	const { shadowDom, experimentalShadowDomCssOverride } = sdkConfig;

	const overrides = sdkConfig._internal?.overrides?.api?.marketplace;
	const marketplaceApiUrl =
		overrides?.url || marketplaceApiURL(overrides?.env || 'production');

	return (
		<>
			{children}
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
				<SwitchChainErrorModal />
				<TransactionStatusModal />
			</ShadowRoot>
		</>
	);
});
