import {
	Button,
	CloseIcon,
	IconButton,
	Spinner,
	Text,
} from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import { Close, Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import type { SwitchChainError } from 'viem';
import { useSwitchChain } from 'wagmi';
import { getPresentableChainName } from '../../../../../../utils/network';
import { type ChainId, getProviderEl } from '../../../../../_internal';
import AlertMessage from '../alertMessage';
import { switchChainModal$ } from './store';
import {
	closeButton,
	dialogOverlay,
	switchChainCta,
	switchChainModalContent,
} from './styles.css';

export type ShowSwitchChainModalArgs = {
	chainIdToSwitchTo: ChainId;
	onSuccess?: () => void;
	onError?: (error: SwitchChainError) => void;
	onClose?: () => void;
};

export const useSwitchChainModal = () => {
	return {
		show: (args: ShowSwitchChainModalArgs) => switchChainModal$.open(args),
		close: () => switchChainModal$.delete(),
		isSwitching$: switchChainModal$.state.isSwitching,
	};
};

const SwitchChainModal = observer(() => {
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

	return (
		<Root open={switchChainModal$.isOpen.get()}>
			<Portal container={getProviderEl()}>
				<Overlay className={dialogOverlay} />

				<Content className={switchChainModalContent}>
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
								? switchChainCta.pending
								: switchChainCta.default
						} flex justify-self-end`}
						name="switch-chain"
						id="switch-chain-button"
						size="sm"
						label={
							isSwitching$.get() ? (
								<Spinner data-testid="switch-chain-spinner" />
							) : (
								'Switch Network'
							)
						}
						variant="primary"
						pending={isSwitching$.get()}
						shape="square"
						onClick={handleSwitchChain}
					/>

					<Close
						data-testid="switch-chain-modal-close-button"
						onClick={() => {
							if (
								switchChainModal$.state.onClose &&
								typeof switchChainModal$.state.onClose === 'function'
							) {
								switchChainModal$.state.onClose();
							}
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
