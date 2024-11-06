import { transferModal$ } from './_store';
import EnterWalletAddressView from './_views/enterWalletAddress';
import FollowWalletInstructionsView from './_views/followWalletInstructions';
import TransferTransactionCompletedView from './_views/transactionCompleted';
import TransferTransactionProcessingView from './_views/transactionProcessing';
import { closeButton, dialogOverlay, transferModalContent } from './styles.css';
import { CloseIcon, IconButton } from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import { Close, Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import type { TokenMetadata } from '@types';

export type ShowTransferModalArgs = {
	collectibleMetadata: TokenMetadata;
	chainId: number;
	collectionAddress: string;
};

export const useTransferModal = () => {
	return {
		show: (args: ShowTransferModalArgs) => transferModal$.open(args),
		close: () => transferModal$.close(),
	};
};

export const TransferModal = observer(() => {
	return (
		transferModal$.get() && (
			<Root open={transferModal$.isOpen.get()}>
				<Portal>
					<Overlay className={dialogOverlay} />

					<Content className={transferModalContent}>
						<TransactionModalView />

						<Close
							onClick={() => {
								transferModal$.delete();
							}}
							className={closeButton}
							asChild
						>
							<IconButton size="xs" aria-label="Close modal" icon={CloseIcon} />
						</Close>
					</Content>
				</Portal>
			</Root>
		)
	);
});

const TransactionModalView = observer(() => {
	if (transferModal$.state.get().step === 0) {
		return <EnterWalletAddressView />;
	}

	if (transferModal$.state.get().step === 1) {
		return <FollowWalletInstructionsView />;
	}

	if (transferModal$.state.get().step === 2) {
		return <TransferTransactionProcessingView />;
	}

	if (transferModal$.state.get().step === 3) {
		return <TransferTransactionCompletedView />;
	}

	return null;
});
