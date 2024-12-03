import { CloseIcon, IconButton } from '@0xsequence/design-system';
import { Show, observer } from '@legendapp/state/react';
import { Close, Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import type {
	TransferErrorCallbacks,
	TransferSuccessCallbacks,
} from '../../../../types/callbacks';
import { useSwitchChainModal } from '../_internal/components/switchChainModal';
import { transferModal$ } from './_store';
import EnterWalletAddressView from './_views/enterWalletAddress';
import FollowWalletInstructionsView from './_views/followWalletInstructions';
import { closeButton, dialogOverlay, transferModalContent } from './styles.css';

export type ShowTransferModalArgs = {
	collectionAddress: Hex;
	tokenId: string;
	chainId: string;
};

export const useTransferModal = () => {
	const { chainId: accountChainId } = useAccount();
	const { show: showSwitchNetworkModal } = useSwitchChainModal();
	// const { errorCallbacks, successCallbacks } = transferModal$.state.get();

	const openModal = (args: ShowTransferModalArgs) => {
		transferModal$.open(args);
	};

	const handleShowModal = (args: ShowTransferModalArgs) => {
		const isSameChain = accountChainId === Number(args.chainId);

		if (!isSameChain) {
			showSwitchNetworkModal({
				chainIdToSwitchTo: Number(args.chainId),
				onSuccess: () => openModal(args),
			});
			return;
		}

		openModal(args);
	};

	return {
		show: handleShowModal,
		close: () => transferModal$.close(),
		onError: (callbacks: TransferErrorCallbacks) => {
			transferModal$.state.set({
				...transferModal$.state.get(),
				errorCallbacks: callbacks,
			});
		},
		onSuccess: (callbacks: TransferSuccessCallbacks) => {
			transferModal$.state.set({
				...transferModal$.state.get(),
				successCallbacks: callbacks,
			});
		},
	};
};

export const TransferModal = () => {
	return (
		<Show if={transferModal$.isOpen}>
			<Modal />
		</Show>
	);
};

const Modal = () => {
	return <ModalContent />;
};

const ModalContent = observer(() => {
	return (
		<Root open={true}>
			<Portal>
				<Overlay className={dialogOverlay} />

				<Content className={transferModalContent}>
					<TransactionModalView />

					<Close onClick={transferModal$.close} className={closeButton} asChild>
						<IconButton size="xs" aria-label="Close modal" icon={CloseIcon} />
					</Close>
				</Content>
			</Portal>
		</Root>
	);
});

const TransactionModalView = observer(() => {
	const { view } = transferModal$.get();

	switch (view) {
		case 'enterReceiverAddress':
			return <EnterWalletAddressView />;

		case 'followWalletInstructions':
			return <FollowWalletInstructionsView />;

		default:
			return null;
	}
});
