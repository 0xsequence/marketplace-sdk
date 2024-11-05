import { transferModal$, useHydrate } from './_store';
import { closeButton, dialogOverlay, transferModalContent } from './styles.css';
import { CloseIcon, IconButton } from '@0xsequence/design-system';
import { observer, Show } from '@legendapp/state/react';
import { Close, Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import { useAccount } from 'wagmi';
import { useSwitchChainModal } from '../_internal/components/switchChainModal';
import { Messages } from '../../../../types/messages';
import { Hex } from 'viem';
import EnterWalletAddressView from './_views/enterWalletAddress';
import FollowWalletInstructionsView from './_views/followWalletInstructions';

export type ShowTransferModalArgs = {
	receiverAddress: string;
	collectionAddress: Hex;
	tokenId: string;
	chainId: string;
	quantity?: string;
	messages?: Messages;
};

export const useTransferModal = () => {
	const { chainId: accountChainId } = useAccount();
	const { show: showSwitchNetworkModal } = useSwitchChainModal();

	const openModal = (args: ShowTransferModalArgs) => {
		transferModal$.open(args);
	};

	const handleShowModal = (args: ShowTransferModalArgs) => {
		const isSameChain = accountChainId === Number(args.chainId);

		if (!isSameChain) {
			showSwitchNetworkModal({
				chainIdToSwitchTo: Number(args.chainId),
				onSwitchChain: () => openModal(args),
				messages: args.messages?.switchChain,
			});
			return;
		}

		openModal(args);
	};

	return {
		show: handleShowModal,
		close: () => transferModal$.close(),
	};
};

export const TransferModal = () => {
	return (
		<Show if={transferModal$.isOpen.get()}>
			<Modal />
		</Show>
	);
};

const Modal = () => {
	useHydrate();
	return <ModalContent />;
};

const ModalContent = observer(() => {
	return (
		<Root open={transferModal$.isOpen.get()}>
			<Portal>
				<Overlay className={dialogOverlay} />

				<Content className={transferModalContent}>
					<TransactionModalView />

					<Close
						onClick={() => {
							transferModal$.delete();
						}}
						className={closeButton}
						asChild
					>
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
