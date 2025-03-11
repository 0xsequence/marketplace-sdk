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
				<Overlay className="bg-background-backdrop fixed inset-0 z-20" />

				<Content className="flex bg-background-primary rounded-2xl fixed z-20 w-[540px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 max-sm:w-full max-sm:bottom-0 max-sm:transform-none max-sm:top-auto max-sm:left-auto max-sm:rounded-b-none grid flex-col gap-6 p-7">
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
								? 'w-[147px] flex items-center justify-center [&>div]:justify-center'
								: 'w-[147px]'
						} flex justify-self-end`}
						name="switch-chain"
						id="switch-chain-button"
						size="sm"
						label={
							isSwitching$.get() ? (
								// TODO: The className is only for testing purposes.. It do not support testId prop
								<Spinner className="spinner" />
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
						className="absolute right-6 top-6"
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
