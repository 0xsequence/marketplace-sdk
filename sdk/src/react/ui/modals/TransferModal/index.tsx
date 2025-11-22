'use client';

import { Modal } from '@0xsequence/design-system';
import type { Address } from 'viem';
import type { CollectionType } from '../../../_internal';
import { useConnectorMetadata, useEnsureCorrectChain } from '../../../hooks';
import { MODAL_OVERLAY_PROPS } from '../_internal/components/consts';
import type { ModalCallbacks } from '../_internal/types';
import EnterWalletAddressView from './_views/enterWalletAddress';
import FollowWalletInstructionsView from './_views/followWalletInstructions';
import { transferModalStore, useIsOpen, useView } from './store';

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

	if (!isOpen) return null;

	return (
		<Modal
			isDismissible={true}
			onClose={() => {
				transferModalStore.send({ type: 'close' });
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
		</Modal>
	);
};

export { TransferModal };
