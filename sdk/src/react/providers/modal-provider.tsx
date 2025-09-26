import { SequenceCheckoutProvider } from '@0xsequence/checkout';
import { observer } from '@legendapp/state/react';
import type { ReactNode } from 'react';
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
	config?: {
		env?: {
			marketplaceApiUrl?: string;
		};
	};
}

export const ModalProvider = observer(
	({ children, config }: ModalProviderProps) => {
		const { shadowDom, experimentalShadowDomCssOverride } = useConfig();

		return (
			<>
				{children}
				<SequenceCheckoutProvider
					config={{
						env: {
							marketplaceApiUrl:
								config?.env?.marketplaceApiUrl ||
								'https://marketplace-api.sequence.app',
						},
					}}
				>
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
				</SequenceCheckoutProvider>
			</>
		);
	},
);
