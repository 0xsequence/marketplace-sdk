'use client';

import { Modal } from '@0xsequence/design-system';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import type { FeeOption } from '../../../../types/waas-types';
import type { CollectionType } from '../../../_internal';
import {
	useConnectorMetadata,
	useEnsureCorrectChain,
	useListBalances,
} from '../../../hooks';
import { MODAL_OVERLAY_PROPS } from '../_internal/components/consts';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import TokenPreview from '../_internal/components/tokenPreview';
import TokenQuantityInput from './_views/enterWalletAddress/_components/TokenQuantityInput';
import WalletAddressInput from './_views/enterWalletAddress/_components/WalletAddressInput';
import { useTransferModalContext } from './internal/context';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../_internal/components/selectWaasFeeOptions/store';
import { useSelectWaasFeeOptions } from '../_internal/hooks/useSelectWaasFeeOptions';
import type { ModalCallbacks } from '../_internal/types';
import EnterWalletAddressView from './_views/enterWalletAddress';
import FollowWalletInstructionsView from './_views/followWalletInstructions';
import { transferModalStore, useIsOpen, useModalState, useView } from './store';

export type ShowTransferModalArgs = {
	collectionAddress: Address;
	tokenId: bigint;
	chainId: number;
	collectionType?: CollectionType;
	callbacks?: ModalCallbacks;
};

export type UseTransferModalArgs = {
	prefetch?: {
		tokenId: bigint;
		chainId: number;
		collectionAddress: Address;
	};
};

export const useTransferModal = (args?: UseTransferModalArgs) => {
	const { ensureCorrectChain } = useEnsureCorrectChain();
	const { address: accountAddress } = useAccount();
	// Prefetch balances if `prefetch` is provided
	useListBalances({
		chainId: args?.prefetch?.chainId ?? 0,
		contractAddress: args?.prefetch?.collectionAddress,
		tokenId: args?.prefetch?.tokenId,
		accountAddress,
		query: { enabled: !!accountAddress && !!args?.prefetch },
	});

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
	const { isVisible: feeOptionsVisible, selectedFeeOption } =
		useSelectWaasFeeOptionsStore();
	const { waasFeeOptionsShown } = useSelectWaasFeeOptions({
		isProcessing: modalState.transferIsProcessing,
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
							type: 'failTransfer',
							error: new Error('Transfer cancelled'),
						});
					}}
					titleOnConfirm="Processing transfer..."
					className="p-7 pt-0"
				/>
			)}
		</Modal>
	);
};

export { useTransferModal };
export type { ShowTransferModalArgs, UseTransferModalArgs };
