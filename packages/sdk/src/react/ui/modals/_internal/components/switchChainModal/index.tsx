import { Button, Modal, Spinner, Text } from '@0xsequence/design-system';
import type { ObservableBoolean } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import type { JSX } from 'react/jsx-runtime';
import type { SwitchChainError } from 'viem';
import { useSwitchChain } from 'wagmi';
import { getPresentableChainName } from '../../../../../../utils/network';
import type { ChainId } from '../../../../../_internal';
import AlertMessage from '../alertMessage';
import { MODAL_OVERLAY_PROPS } from '../consts';
import { switchChainModal$ } from './store';

export type ShowSwitchChainModalArgs = {
	chainIdToSwitchTo: ChainId;
	onSuccess?: () => void;
	onError?: (error: SwitchChainError) => void;
	onClose?: () => void;
};

export const useSwitchChainModal = (): {
	show: (args: ShowSwitchChainModalArgs) => void;
	close: () => void;
	isSwitching$: ObservableBoolean;
} => {
	return {
		show: (args: ShowSwitchChainModalArgs): void =>
			switchChainModal$.open(args),
		close: (): void => switchChainModal$.delete(),
		isSwitching$: switchChainModal$.state.isSwitching,
	};
};

const SwitchChainModal: () => JSX.Element | null = observer(
	(): JSX.Element | null => {
		const chainIdToSwitchTo = switchChainModal$.state.chainIdToSwitchTo.get();
		const isSwitching$ = switchChainModal$.state.isSwitching;
		const chainName = chainIdToSwitchTo
			? getPresentableChainName(chainIdToSwitchTo)
			: '';
		const { switchChainAsync } = useSwitchChain();

		async function handleSwitchChain() {
			isSwitching$.set(true);

			try {
				if (!chainIdToSwitchTo) return;
				await switchChainAsync({ chainId: Number(chainIdToSwitchTo) });

				if (
					switchChainModal$.state.onSuccess &&
					typeof switchChainModal$.state.onSuccess === 'function'
				) {
					switchChainModal$.state.onSuccess();
				}

				switchChainModal$.delete();
			} catch (error) {
				if (
					error instanceof Error &&
					switchChainModal$.state.onError.get() &&
					typeof switchChainModal$.state.onError.get() === 'function'
				) {
					switchChainModal$.state.onError.get()?.(error as SwitchChainError);
				}
			} finally {
				isSwitching$.set(false);
			}
		}

		const handleClose = () => {
			if (
				switchChainModal$.state.onClose &&
				typeof switchChainModal$.state.onClose === 'function'
			) {
				switchChainModal$.state.onClose();
			}
			switchChainModal$.delete();
		};

		if (!chainIdToSwitchTo) return null;

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
							isSwitching$.get()
								? 'flex w-[147px] items-center justify-center [&>div]:justify-center'
								: 'w-[147px]'
						} flex justify-self-end`}
						name="switch-chain"
						id="switch-chain-button"
						size="sm"
						label={
							isSwitching$.get() ? (
								<Spinner className="spinner" />
							) : (
								'Switch Network'
							)
						}
						variant="primary"
						pending={isSwitching$.get()}
						shape="square"
						onClick={handleSwitchChain}
						data-testid="switch-chain-button"
					/>
				</div>
			</Modal>
		);
	},
);

export default SwitchChainModal;
