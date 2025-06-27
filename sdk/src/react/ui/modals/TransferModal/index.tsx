'use client';

import { Modal } from '@0xsequence/design-system';
import type { Address } from 'viem';
import { useAccount, useSwitchChain } from 'wagmi';
import type { FeeOption } from '../../../../types/waas-types';
import { useWallet } from '../../../_internal/wallet/useWallet';
import { MODAL_OVERLAY_PROPS } from '../_internal/components/consts';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../_internal/components/selectWaasFeeOptions/store';
import { useSwitchChainModal } from '../_internal/components/switchChainModal';
import { useSelectWaasFeeOptions } from '../_internal/hooks/useSelectWaasFeeOptions';
import type { ModalCallbacks } from '../_internal/types';
import EnterWalletAddressView from './_views/enterWalletAddress';
import FollowWalletInstructionsView from './_views/followWalletInstructions';
import { transferModalStore, useIsOpen, useModalState, useView } from './store';

export type ShowTransferModalArgs = {
	collectionAddress: Address;
	collectibleId: string;
	chainId: number;
	callbacks?: ModalCallbacks;
};

export const useTransferModal = () => {
	const { chainId: accountChainId } = useAccount();
	const { show: showSwitchNetworkModal } = useSwitchChainModal();
	const { wallet } = useWallet();
	const { switchChain } = useSwitchChain();

	const openModal = (args: ShowTransferModalArgs) => {
		transferModalStore.send({ type: 'open', ...args });
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
		transferModalStore.send({ type: 'updateState', callbacks });
	};

	return {
		show: handleShowModal,
		close: () => transferModalStore.send({ type: 'close' }),
		onError: updateCallbacks,
		onSuccess: updateCallbacks,
	};
};

const TransactionModalView = () => {
	const view = useView();

	switch (view) {
		case 'enterReceiverAddress':
			return <EnterWalletAddressView />;
		case 'followWalletInstructions':
			return <FollowWalletInstructionsView />;
		default:
			return null;
	}
};

const TransferModal = () => {
	const isOpen = useIsOpen();
	const modalState = useModalState();
	const { isVisible: feeOptionsVisible, selectedFeeOption } =
		useSelectWaasFeeOptionsStore();
	const { waasFeeOptionsShown } = useSelectWaasFeeOptions({
		isProcessing: modalState.transferIsBeingProcessed,
		feeOptionsVisible,
		selectedFeeOption: selectedFeeOption as FeeOption,
	});

	if (!isOpen) return null;

	return (
		<Modal
			isDismissible={true}
			onClose={() => {
				transferModalStore.send({ type: 'close' });
				selectWaasFeeOptionsStore.send({ type: 'hide' });
			}}
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

			{waasFeeOptionsShown && (
				<SelectWaasFeeOptions
					chainId={Number(modalState.chainId)}
					onCancel={() => {
						transferModalStore.send({
							type: 'setTransferIsBeingProcessed',
							isProcessing: false,
						});
					}}
					titleOnConfirm="Processing transfer..."
					className="p-7 pt-0"
				/>
			)}
		</Modal>
	);
};

export { TransferModal };
