'use client';

import { Modal } from '@0xsequence/design-system';
import { useSelector } from '@xstate/store/react';
import type { Address } from 'viem';
import { useAccount, useSwitchChain } from 'wagmi';
import type { FeeOption } from '../../../../types/waas-types';
import { useWallet } from '../../../_internal/wallet/useWallet';
import { MODAL_OVERLAY_PROPS } from '../_internal/components/consts';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import {
	hide as hideSelectWaasFeeOptions,
	selectWaasFeeOptionsStore,
} from '../_internal/components/selectWaasFeeOptions/store';
import { useSwitchChainModal } from '../_internal/components/switchChainModal';
import { useSelectWaasFeeOptions } from '../_internal/hooks/useSelectWaasFeeOptions';
import type { ModalCallbacks } from '../_internal/types';
import { close, open, transferModal$ } from './_store';
import EnterWalletAddressView from './_views/enterWalletAddress';
import FollowWalletInstructionsView from './_views/followWalletInstructions';

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
		open(args);
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
		const state = transferModal$.getSnapshot().context;
		transferModal$.send({
			type: 'open',
			chainId: state.state.chainId,
			collectionAddress: state.state.collectionAddress,
			collectibleId: state.state.collectibleId,
			callbacks,
		});
	};

	return {
		show: handleShowModal,
		close: close,
		onError: updateCallbacks,
		onSuccess: updateCallbacks,
	};
};

const TransactionModalView = () => {
	const view = useSelector(transferModal$, (state) => state.context.view);

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
	const isOpen = useSelector(transferModal$, (state) => state.context.isOpen);
	const chainId = useSelector(
		transferModal$,
		(state) => state.context.state.chainId,
	);
	const isTransferBeingProcessed = useSelector(
		transferModal$,
		(state) => state.context.state.transferIsBeingProcessed,
	);
	const feeOptionsVisible = useSelector(
		selectWaasFeeOptions$,
		(state) => state.context.isVisible,
	);
	const selectedFeeOption = useSelector(
		selectWaasFeeOptions$,
		(state) => state.context.selectedFeeOption,
	);
	const { waasFeeOptionsShown } = useSelectWaasFeeOptions({
		isProcessing: isTransferBeingProcessed,
		feeOptionsVisible: feeOptionsVisible,
		selectedFeeOption: selectedFeeOption as FeeOption,
	});

	if (!isOpen) return null;

	return (
		<Modal
			isDismissible={true}
			onClose={() => {
				close();
				hideSelectWaasFeeOptions();
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
					chainId={Number(chainId)}
					onCancel={() => {
						transferModal$.send({
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
