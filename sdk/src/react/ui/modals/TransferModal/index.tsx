'use client';

import { Modal } from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import { MODAL_OVERLAY_PROPS } from '../_internal/components/consts';
import { useSwitchChainModal } from '../_internal/components/switchChainModal';
import type { ModalCallbacks } from '../_internal/types';
import { transferModal$ } from './_store';
import EnterWalletAddressView from './_views/enterWalletAddress';
import FollowWalletInstructionsView from './_views/followWalletInstructions';

export type ShowTransferModalArgs = {
	collectionAddress: Hex;
	collectibleId: string;
	chainId: string;
	callbacks?: ModalCallbacks;
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
				onSuccess: () => openModal(args),
			});
			return;
		}

		openModal(args);
	};

	return {
		show: handleShowModal,
		close: () => transferModal$.close(),
		onError: (callbacks: ModalCallbacks) => {
			transferModal$.state.set({
				...transferModal$.state.get(),
				callbacks,
			});
		},
		onSuccess: (callbacks: ModalCallbacks) => {
			transferModal$.state.set({
				...transferModal$.state.get(),
				callbacks,
			});
		},
	};
};

const TransferModal = observer(() => {
	const isOpen = transferModal$.isOpen.get();

	if (!isOpen) return null;

	return (
		<Modal
			isDismissible={true}
			onClose={transferModal$.close}
			size="sm"
			overlayProps={MODAL_OVERLAY_PROPS}
			contentProps={{
				style: {
					height: 'auto',
				},
			}}
		>
			<div className="flex w-full flex-col p-7">
				<TransactionModalView />
			</div>
		</Modal>
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

export { TransferModal };
