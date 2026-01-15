'use client';

import { Text, WarningIcon } from '@0xsequence/design-system';
import { useSelector } from '@xstate/store/react';
import { TransactionType } from '../../../_internal';
import { ActionModal } from '../_internal/components/baseModal/ActionModal';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import TokenPreview from '../_internal/components/tokenPreview';
import TokenQuantityInput from './_views/enterWalletAddress/_components/TokenQuantityInput';
import WalletAddressInput from './_views/enterWalletAddress/_components/WalletAddressInput';
import { useTransferModalContext } from './internal/context';
import {
	type ShowTransferModalArgs,
	transferModalStore,
	type UseTransferModalArgs,
	useTransferModal,
} from './internal/store';

export const TransferModal = () => {
	const isOpen = useSelector(
		transferModalStore,
		(state) => state.context.isOpen,
	);
	return isOpen ? <Modal /> : null;
};

const Modal = () => {
	const ctx = useTransferModalContext();

	if (!ctx.isOpen) {
		return null;
	}

	const primaryAction = ctx.steps.fee?.isSelecting
		? undefined
		: ctx.actions.transfer;

	return (
		<ActionModal
			transactionType={TransactionType.TRANSFER}
			chainId={ctx.item.chainId}
			onClose={ctx.close}
			title="Transfer your item"
			type="transfer"
			primaryAction={primaryAction}
			queries={{
				collection: ctx.queries.collection,
				collectibleBalance: ctx.queries.collectibleBalance,
			}}
			externalError={ctx.error}
		>
			{({ collection, collectibleBalance }) => (
				<>
					<TokenPreview
						collectionName={collection?.name}
						collectionAddress={ctx.item.collectionAddress}
						tokenId={ctx.item.tokenId}
						chainId={ctx.item.chainId}
					/>

					<WalletAddressInput
						value={ctx.form.receiver.input}
						onChange={(value) => {
							ctx.form.receiver.update(value);
							if (!ctx.form.receiver.isTouched) {
								ctx.form.receiver.touch();
							}
						}}
						disabled={ctx.flow.isPending}
					/>

					{collection?.type === 'ERC1155' && collectibleBalance?.balance && (
						<TokenQuantityInput
							value={ctx.form.quantity.input}
							onChange={(value) => {
								ctx.form.quantity.update(value);
								if (!ctx.form.quantity.isTouched) {
									ctx.form.quantity.touch();
								}
							}}
							maxQuantity={BigInt(collectibleBalance.balance)}
							invalid={!!ctx.form.errors.quantity}
							disabled={ctx.flow.isPending}
							helperText={`You have ${collectibleBalance.balance} of this item`}
						/>
					)}

					<div className="flex items-center justify-between gap-3 rounded-xl bg-[hsla(39,71%,40%,0.3)] p-4">
						<WarningIcon />
						<Text className="font-body font-medium text-sm text-text-80">
							Items sent to the wrong wallet address can&apos;t be recovered!
						</Text>
					</div>

					{ctx.steps.fee?.isSelecting && (
						<SelectWaasFeeOptions
							chainId={ctx.item.chainId}
							onCancel={ctx.steps.fee.cancel}
							titleOnConfirm="Processing transfer..."
						/>
					)}

					{ctx.formError && (
						<div className="mt-2 text-red-500 text-sm">{ctx.formError}</div>
					)}
				</>
			)}
		</ActionModal>
	);
};

export { useTransferModal };
export {
	type TransferModalContext,
	useTransferModalContext,
} from './internal/context';
export type { ShowTransferModalArgs, UseTransferModalArgs };
