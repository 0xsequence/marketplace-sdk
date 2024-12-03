import {
	Button,
	CloseIcon,
	IconButton,
	Spinner,
	Text,
} from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import { Close, Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import type { SwitchChainErrorType } from 'viem';
import { useSwitchChain } from 'wagmi';
import { getPresentableChainName } from '../../../../../../utils/network';
import type { ChainId } from '../../../../../_internal';
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
	onSwitchChain: () => void;
	onSuccess?: () => void;
	onError?: (error: SwitchChainErrorType) => void;
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

	async function handleSwitchChain() {
		isSwitching$.set(true);

		try {
			await switchChainAsync({ chainId: Number(chainIdToSwitchTo!) });

			switchChainModal$.state.onSwitchChain();
			switchChainModal$.state.onSuccess?.();

			switchChainModal$.close();
		} catch (error) {
			switchChainModal$.state.onError?.(error as SwitchChainErrorType);
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
