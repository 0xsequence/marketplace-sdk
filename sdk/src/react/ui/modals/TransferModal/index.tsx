'use client';

import { Modal } from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import type { Address } from 'viem';
import { useAccount, useSwitchChain } from 'wagmi';
import { useWallet } from '../../../_internal/wallet/useWallet';
import { MODAL_OVERLAY_PROPS } from '../_internal/components/consts';
import { useSwitchChainModal } from '../_internal/components/switchChainModal';
import SelectWaasFeeOptions from '../_internal/components/waasFeeOptionsBox';
import type { ModalCallbacks } from '../_internal/types';
import { transferModal$ } from './_store';
import EnterWalletAddressView from './_views/enterWalletAddress';
import FollowWalletInstructionsView from './_views/followWalletInstructions';

export type ShowTransferModalArgs = {
	collectionAddress: Address;
	collectibleId: string;
	chainId: string;
	callbacks?: ModalCallbacks;
};

export const useTransferModal = () => {
	const { chainId: accountChainId } = useAccount();
	const { show: showSwitchNetworkModal } = useSwitchChainModal();
	const { wallet } = useWallet();
	const { switchChain } = useSwitchChain();

	const openModal = (args: ShowTransferModalArgs) => {
		transferModal$.open(args);
	};

	const handleShowModal = (args: ShowTransferModalArgs) => {
		const targetChainId = Number(args.chainId);
		const isSameChain = accountChainId === targetChainId;

		if (!isSameChain) {
			if (wallet?.isWaaS) {
				switchChain({ chainId: targetChainId });

				openModal(args);
			} else {
				showSwitchNetworkModal({
					chainIdToSwitchTo: targetChainId,
					onSuccess: () => openModal(args),
				});
			}
			return;
		}

		openModal(args);
	};

	const updateCallbacks = (callbacks: ModalCallbacks) => {
		transferModal$.state.set({
			...transferModal$.state.get(),
			callbacks,
		});
	};

	return {
		show: handleShowModal,
		close: transferModal$.close,
		onError: updateCallbacks,
		onSuccess: updateCallbacks,
	};
};

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

const TransferModal = observer(() => {
	const isOpen = transferModal$.isOpen.get();
	const { chainId } = transferModal$.state.get();
	const { wallet } = useWallet();

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
					overflow: 'auto',
				},
			}}
		>
			<div className="flex w-full flex-col p-7">
				<TransactionModalView />
			</div>

			{wallet?.isWaaS &&
				transferModal$.state.transferIsBeingProcessed.get() && (
					<SelectWaasFeeOptions
						chainId={Number(chainId)}
						onCancel={() => {
							transferModal$.state.transferIsBeingProcessed.set(false);
						}}
					/>
				)}
		</Modal>
	);
});

export { TransferModal };
