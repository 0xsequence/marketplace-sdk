import { Close, Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import { switchChainModal$ } from './store';
import {
	closeButton,
	dialogOverlay,
	switchChainCta,
	switchChainModalContent,
} from './styles.css';
import {
	Button,
	CloseIcon,
	IconButton,
	Spinner,
	Text,
} from '@0xsequence/design-system';
import AlertMessage from '../alertMessage';
import { observer } from '@legendapp/state/react';
import { useSwitchChain } from 'wagmi';
import { BaseError } from 'viem';
import { getPresentableChainName } from '../../../../../../utils/network';

import { UserRejectedRequestError } from 'viem';
import { SwitchChainNotSupportedError } from 'wagmi';
import type { SwitchChainCallbacks } from '../../../../../../types/messages';

export type ShowSwitchChainModalArgs = {
	chainIdToSwitchTo: number;
	onSwitchChain: () => void;
	callbacks?: SwitchChainCallbacks;
};

export const useSwitchChainModal = () => {
	return {
		show: (args: ShowSwitchChainModalArgs) => switchChainModal$.open(args),
		close: () => switchChainModal$.close(),
		isSwitching$: switchChainModal$.state.isSwitching,
	};
};

const SwitchChainModal = observer(() => {
	const chainIdToSwitchTo = switchChainModal$.state.chainIdToSwitchTo.get();
	const isSwitching$ = switchChainModal$.state.isSwitching;
	const chainName = getPresentableChainName(chainIdToSwitchTo!);
	const { switchChainAsync } = useSwitchChain();
	const {
		onSwitchingNotSupported,
		onUserRejectedRequest,
		onUnknownError,
		onSuccess,
	}: Partial<SwitchChainCallbacks> =
		switchChainModal$.state.callbacks.get() || {};

	async function handleSwitchChain() {
		isSwitching$.set(true);

		try {
			await switchChainAsync({ chainId: chainIdToSwitchTo! });

			switchChainModal$.state.onSwitchChain();
			onSuccess && onSuccess();

			switchChainModal$.close();
		} catch (error) {
			if (error instanceof BaseError) {
				const name = error.name as BaseError['name'];

				switch (name) {
					case SwitchChainNotSupportedError.name:
						onSwitchingNotSupported && onSwitchingNotSupported();
						break;
					case UserRejectedRequestError.name:
						onUserRejectedRequest && onUserRejectedRequest();
						break;
					default:
						onUnknownError && onUnknownError(error);
						break;
				}
			} else {
				onUnknownError && onUnknownError(error);
			}
		} finally {
			isSwitching$.set(false);
		}
	}

	return (
		<Root open={switchChainModal$.isOpen.get()}>
			<Portal>
				<Overlay className={dialogOverlay} />

				<Content className={switchChainModalContent}>
					<Text fontSize="large" fontWeight="bold" color="text100">
						Wrong network
					</Text>

					<AlertMessage
						type="warning"
						message={`You need to switch to ${chainName} network before completing the transaction`}
					/>

					<Button
						name="switch-chain"
						size="sm"
						label={isSwitching$.get() ? <Spinner /> : 'Switch Network'}
						variant="primary"
						pending={isSwitching$.get()}
						shape="square"
						className={
							isSwitching$.get()
								? switchChainCta.pending
								: switchChainCta.default
						}
						justifySelf="flex-end"
						onClick={handleSwitchChain}
					/>

					<Close
						onClick={() => {
							switchChainModal$.delete();
						}}
						className={closeButton}
						asChild
					>
						<IconButton size="xs" aria-label="Close modal" icon={CloseIcon} />
					</Close>
				</Content>
			</Portal>
		</Root>
	);
});

export default SwitchChainModal;
