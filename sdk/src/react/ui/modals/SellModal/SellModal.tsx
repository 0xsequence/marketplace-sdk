'use client';

import { useSelector } from '@xstate/store/react';
import { useConnectorMetadata } from '../../../hooks/config/useConnectorMetadata';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import { selectWaasFeeOptionsStore } from '../_internal/components/selectWaasFeeOptions/store';
import {
	SellModalContent,
	SellModalError,
	SellModalLoading,
	SellModalSuccess,
} from './components';
import { useCtas } from './hooks/useCtas';
import { sellModalStore } from './store/sellModalStore';

export const SellModal = () => {
	const isOpen = useSelector(sellModalStore, (state) => state.context.isOpen);
	const status = useSelector(sellModalStore, (state) => state.context.status);
	const chainId = useSelector(sellModalStore, (state) => state.context.chainId);
	const feeOptionsVisible = useSelector(
		sellModalStore,
		(state) => state.context.feeOptionsVisible,
	);

	const { isWaaS } = useConnectorMetadata();
	const ctas = useCtas();

	if (!isOpen) return null;

	const handleClose = () => {
		sellModalStore.send({ type: 'close' });
		selectWaasFeeOptionsStore.send({ type: 'hide' });
	};

	const showWaasFeeOptions =
		isWaaS && feeOptionsVisible && status === 'selecting_fees';

	const isLoading = ['checking_approval', 'approving', 'executing'].includes(
		status,
	);


	return (
		<>
			<ActionModal
				isOpen={isOpen}
				chainId={chainId || 1}
				onClose={handleClose}
				title="You have an offer"
				ctas={ctas}
				modalLoading={isLoading}
			>
				{status === 'error' && <SellModalError />}
				{status === 'checking_approval' && (
					<SellModalLoading message="Checking approval..." />
				)}
				{status === 'approving' && (
					<SellModalLoading message="Approving token..." />
				)}
				{status === 'executing' && (
					<SellModalLoading message="Accepting offer..." />
				)}
				{[
					'idle',
					'awaiting_approval',
					'ready_to_sell',
					'selecting_fees',
				].includes(status) && <SellModalContent />}
				{status === 'completed' && <SellModalSuccess />}
			</ActionModal>

			{showWaasFeeOptions && (
				<SelectWaasFeeOptions
					chainId={chainId ?? 0}
					onCancel={() => {
						sellModalStore.send({ type: 'hideFeeOptions' });
					}}
					titleOnConfirm="Accepting offer..."
				/>
			)}
		</>
	);
};
