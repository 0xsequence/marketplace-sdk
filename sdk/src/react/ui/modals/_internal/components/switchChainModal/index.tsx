'use client';

import { Button, Modal, Spinner, Text } from '@0xsequence/design-system';
import type { SwitchChainError } from 'viem';
import { useSwitchChain } from 'wagmi';
import { getPresentableChainName } from '../../../../../../utils/network';
import AlertMessage from '../alertMessage';
import { MODAL_OVERLAY_PROPS } from '../consts';
import {
	switchChainModal,
	switchChainModalStore,
	useChainIdToSwitchTo,
	useIsOpen,
	useIsSwitching,
	useOnClose,
	useOnError,
	useOnSuccess,
} from './store';

export type ShowSwitchChainModalArgs = {
	chainIdToSwitchTo: number;
	onSuccess?: () => void;
	onError?: (error: SwitchChainError) => void;
	onClose?: () => void;
};

export const useSwitchChainModal = () => {
	return {
		show: (args: ShowSwitchChainModalArgs) => switchChainModal.open(args),
		close: () => switchChainModal.delete(),
	};
};

const SwitchChainModal = () => {
	const isOpen = useIsOpen();
	const chainIdToSwitchTo = useChainIdToSwitchTo();
	const isSwitching = useIsSwitching();
	const onSuccess = useOnSuccess();
	const onError = useOnError();
	const onClose = useOnClose();

	const chainName = chainIdToSwitchTo
		? getPresentableChainName(chainIdToSwitchTo)
		: '';
	const { switchChainAsync } = useSwitchChain();

	async function handleSwitchChain() {
		switchChainModalStore.send({ type: 'setSwitching', isSwitching: true });

		try {
			if (!chainIdToSwitchTo) return;
			await switchChainAsync({ chainId: Number(chainIdToSwitchTo) });

			if (onSuccess && typeof onSuccess === 'function') {
				onSuccess();
			}

			switchChainModalStore.send({ type: 'close' });
		} catch (error) {
			if (error instanceof Error && onError && typeof onError === 'function') {
				onError(error as SwitchChainError);
			}
		} finally {
			switchChainModalStore.send({ type: 'setSwitching', isSwitching: false });
		}
	}

	const handleClose = () => {
		if (onClose && typeof onClose === 'function') {
			onClose();
		}
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
					Wrong network
				</Text>

				<AlertMessage
					type="warning"
					message={`You need to switch to ${chainName} network before completing the transaction`}
				/>

				<Button
					className={`${
						isSwitching
							? 'flex w-[147px] items-center justify-center [&>div]:justify-center'
							: 'w-[147px]'
					} flex justify-self-end`}
					name="switch-chain"
					id="switch-chain-button"
					size="sm"
					label={
						isSwitching ? (
							<div data-testid="switch-chain-spinner">
								<Spinner className="spinner" />
							</div>
						) : (
							'Switch Network'
						)
					}
					variant="primary"
					pending={isSwitching}
					shape="square"
					onClick={handleSwitchChain}
					data-testid="switch-chain-button"
				/>
			</div>
		</Modal>
	);
};

export default SwitchChainModal;
