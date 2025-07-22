'use client';

import { useSelector } from '@xstate/store/react';
import { ErrorModal } from '../../_internal/components/actionModal/ErrorModal';
import { sellModalStore } from '../store/sellModalStore';

export const SellModalError = () => {
	const chainId = useSelector(sellModalStore, (state) => state.context.chainId);
	const error = useSelector(sellModalStore, (state) => state.context.error);

	return (
		<ErrorModal
			isOpen={true}
			chainId={chainId || 1}
			onClose={() => sellModalStore.send({ type: 'close' })}
			title="You have an offer"
			message={
				error?.message || 'An error occurred while processing your transaction'
			}
		/>
	);
};
