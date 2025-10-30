'use client';

import { Modal } from '@0xsequence/design-system';
import type { Address } from 'viem';
import type { FeeOption } from '../../../../types/waas-types';
import type { CollectionType } from '../../../_internal';
import { useConnectorMetadata, useEnsureCorrectChain } from '../../../hooks';
import { MODAL_OVERLAY_PROPS } from '../_internal/components/consts';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import { useSelectWaasFeeOptions } from '../_internal/hooks/useSelectWaasFeeOptions';
import { useWaasFeeSelection } from '../_internal/hooks/useWaasFeeSelection';
import type { ModalCallbacks } from '../_internal/types';
import EnterWalletAddressView from './_views/enterWalletAddress';
import FollowWalletInstructionsView from './_views/followWalletInstructions';
import { transferModalStore, useIsOpen, useModalState, useView } from './store';

export type ShowTransferModalArgs = {
	collectionAddress: Address;
	collectibleId: string;
	chainId: number;
	collectionType?: CollectionType;
	callbacks?: ModalCallbacks;
};

export const useTransferModal = () => {
	const { ensureCorrectChain } = useEnsureCorrectChain();

	const openModal = (args: ShowTransferModalArgs) => {
		transferModalStore.send({ type: 'open', ...args });
	};

	const handleShowModal = (args: ShowTransferModalArgs) => {
		const targetChainId = Number(args.chainId);

		ensureCorrectChain(targetChainId, {
			onSuccess: () => openModal(args),
		});
	};

	return {
		show: handleShowModal,
		close: () => transferModalStore.send({ type: 'close' }),
	};
};

const TransactionModalView = () => {
	const view = useView();
	const { isWaaS } = useConnectorMetadata();

	switch (view) {
		case 'enterReceiverAddress':
			return <EnterWalletAddressView />;
		case 'followWalletInstructions':
			if (isWaaS) {
				return <EnterWalletAddressView />;
			}
			return <FollowWalletInstructionsView />;
		default:
			return null;
	}
};

const TransferModal = () => {
	const isOpen = useIsOpen();
	const modalState = useModalState();

	// WaaS fee selection management via custom hook
	const waasFees = useWaasFeeSelection({
		onCancel: () => {
			transferModalStore.send({
				type: 'failTransfer',
				error: new Error('Transfer cancelled'),
			});
		},
	});

	const { waasFeeOptionsShown } = useSelectWaasFeeOptions({
		isProcessing: modalState.transferIsProcessing,
		feeOptionsVisible: waasFees.isVisible,
		selectedFeeOption: waasFees.selectedFeeOption as FeeOption,
	});

	// Handlers are now provided by the waasFees hook

	if (!isOpen) return null;

	return (
		<Modal
			isDismissible={true}
			onClose={() => {
				transferModalStore.send({ type: 'close' });
				waasFees.reset();
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
					waasFees={waasFees}
					titleOnConfirm="Processing transfer..."
					className="p-7 pt-0"
				/>
			)}
		</Modal>
	);
};

export { TransferModal };
