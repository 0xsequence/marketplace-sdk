import { Close, Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import { switchChainModal$ } from './store';
import {
	closeButton,
	dialogOverlay,
	switchNetworkCta,
	switchNetworkModalContent,
} from './styles.css';
import {
	Button,
	CloseIcon,
	IconButton,
	Spinner,
	Text,
	useToast,
} from '@0xsequence/design-system';
import AlertMessage from '../alertMessage';
import { observer } from '@legendapp/state/react';
import { useSwitchChain } from 'wagmi';
import { BaseError } from 'viem';
import { errorMessages } from './consts';
import { getPresentableChainName } from '../../../../../../utils/network';

export type ShowSwitchChainModalArgs = {
	chainIdToSwitchTo: number;
	onSwitchChain: () => void;
};

export const useSwitchNetworkModal = () => {
	return {
		show: (args: ShowSwitchChainModalArgs) => switchChainModal$.open(args),
		close: () => switchChainModal$.close(),
	};
};

const SwitchNetworkModal = observer(() => {
	const chainIdToSwitchTo = switchChainModal$.state.chainIdToSwitchTo.get();
	const isSwitching$ = switchChainModal$.state.isSwitching;
	const chainName = getPresentableChainName(chainIdToSwitchTo!);
	const { switchChainAsync } = useSwitchChain();
	const toast = useToast();

	async function handleSwitchNetwork() {
		isSwitching$.set(true);

		try {
			await switchChainAsync({ chainId: chainIdToSwitchTo! });

			switchChainModal$.state.onSwitchChain();

			switchChainModal$.delete();
		} catch (error) {
			if (error instanceof BaseError) {
				const name = error.name as BaseError['name'];

				switch (name) {
					case errorMessages.switchingNotSupported.name:
						toast({
							title: errorMessages.switchingNotSupported.title,
							description: errorMessages.switchingNotSupported.description,
							variant: 'error',
						});
						break;
					case errorMessages.userRejectedRequest.name:
						toast({
							title: errorMessages.userRejectedRequest.title,
							description: errorMessages.userRejectedRequest.description,
							variant: 'error',
						});
						break;
					default:
						toast({
							title: errorMessages.unknown.title,
							description: errorMessages.unknown.description,
							variant: 'error',
						});
						break;
				}
			} else {
				toast({
					title: errorMessages.unknown.title,
					description: errorMessages.unknown.description,
					variant: 'error',
				});
			}
		} finally {
			isSwitching$.set(false);
		}
	}

	return (
		<Root open={switchChainModal$.isOpen.get()}>
			<Portal>
				<Overlay className={dialogOverlay} />

				<Content className={switchNetworkModalContent}>
					<Text fontSize="large" fontWeight="bold" color="text100">
						Wrong network
					</Text>

					<AlertMessage
						type="warning"
						message={`You need to switch to ${chainName} network before completing the transaction`}
					/>

					<Button
						name="switch-network"
						size="sm"
						label={isSwitching$.get() ? <Spinner /> : 'Switch Network'}
						variant="primary"
						pending={isSwitching$.get()}
						shape="square"
						className={
							isSwitching$.get()
								? switchNetworkCta.pending
								: switchNetworkCta.default
						}
						justifySelf="flex-end"
						onClick={handleSwitchNetwork}
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

export default SwitchNetworkModal;
