'use client';

import { SequenceCheckoutProvider } from '@0xsequence/checkout';
import type { ReactNode } from 'react';
import { useConfig } from '../hooks';
import SwitchChainErrorModal from '../ui/modals/_internal/components/switchChainErrorModal';
import TransactionStatusModal from '../ui/modals/_internal/components/transactionStatusModal';
import { BuyModal } from '../ui/modals/BuyModal/components/Modal';
import { CreateListingModal } from '../ui/modals/CreateListingModal/Modal';
import { MakeOfferModal } from '../ui/modals/MakeOfferModal/Modal';
import { SellModal } from '../ui/modals/SellModal/Modal';
import { TransferModal } from '../ui/modals/TransferModal';
import { ShadowRoot } from './shadow-root';

interface ModalProviderProps {
	children?: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
	const sdkConfig = useConfig();
	const { shadowDom, experimentalShadowDomCssOverride } = sdkConfig;

	return (
		<>
			{children}

			<SequenceCheckoutProvider>
				<ShadowRoot
					enabled={shadowDom ?? true}
					customCSS={experimentalShadowDomCssOverride}
				>
					<CreateListingModal />
					<MakeOfferModal />
					<TransferModal />
					<SellModal />
					<BuyModal />
					{/* Helper modals */}
					<SwitchChainErrorModal />
					<TransactionStatusModal />
				</ShadowRoot>
			</SequenceCheckoutProvider>
		</>
	);
};
