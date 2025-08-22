'use client';

import { Modal, Text } from '@0xsequence/design-system';
import { getPresentableChainName } from '../../../../../../utils/network';
import AlertMessage from '../alertMessage';
import { MODAL_OVERLAY_PROPS } from '../consts';
import {
	switchChainModalStore,
	useChainIdToSwitchTo,
	useIsOpen,
} from './store';

export type ShowSwitchChainModalArgs = {
	chainIdToSwitchTo: number;
};

export const useSwitchChainErrorModal = () => {
	return {
		show: (args: ShowSwitchChainModalArgs) =>
			switchChainModalStore.send({ type: 'open', ...args }),
	};
};

const SwitchChainErrorModal = () => {
	const isOpen = useIsOpen();
	const chainIdToSwitchTo = useChainIdToSwitchTo();

	const chainName = chainIdToSwitchTo
		? getPresentableChainName(chainIdToSwitchTo)
		: '';

	const handleClose = () => {
		switchChainModalStore.send({ type: 'close' });
	};

	if (!isOpen || !chainIdToSwitchTo) return null;

	return (
		<Modal
			isDismissible={true}
			onClose={handleClose}
			disableAnimation
			size="sm"
			overlayProps={MODAL_OVERLAY_PROPS}
		>
			<div className="grid flex-col gap-6 p-7">
				<Text className="text-xl" fontWeight="bold" color="text100">
					Switching network failed
				</Text>

				<AlertMessage
					type="warning"
					message={`There was an error switching to ${chainName}. Please try changing the network in your wallet manually.`}
				/>
			</div>
		</Modal>
	);
};

export default SwitchChainErrorModal;
