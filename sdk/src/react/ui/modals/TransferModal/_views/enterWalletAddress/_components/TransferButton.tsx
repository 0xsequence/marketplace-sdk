'use client';

import { useWaasFeeOptions } from '@0xsequence/connect';
import { Button, Spinner } from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import { useWallet } from '../../../../../../_internal/wallet/useWallet';
import { transferModal$ } from '../../../_store';

const TransferButton = observer(
	({
		onClick,
		isDisabled,
	}: {
		onClick: () => Promise<void>;
		isDisabled: boolean | undefined;
	}) => {
		const { wallet } = useWallet();
		const isWaaS = wallet?.isWaaS;
		const [pendingFeeOptionConfirmation] = useWaasFeeOptions();
		const isProcessing = transferModal$.state.transferIsBeingProcessed.get();

		// Check if we're waiting for fee options (non-sponsored WaaS)
		const isWaitingForFeeOptions =
			isWaaS &&
			pendingFeeOptionConfirmation &&
			pendingFeeOptionConfirmation.options?.length > 0;

		const label = isProcessing ? (
			isWaitingForFeeOptions ? (
				<div className="flex items-center justify-center gap-2">
					<Spinner size="sm" className="text-white" />
					<span>Loading fee options</span>
				</div>
			) : (
				<div className="flex items-center justify-center gap-2">
					<Spinner size="sm" className="text-white" />
					<span>Transferring</span>
				</div>
			)
		) : (
			'Transfer'
		);

		return (
			<Button
				className="flex justify-self-end px-10"
				onClick={onClick}
				disabled={!!isDisabled}
				title="Transfer"
				label={label}
				variant="primary"
				shape="square"
				size="sm"
			/>
		);
	},
);

export default TransferButton;
