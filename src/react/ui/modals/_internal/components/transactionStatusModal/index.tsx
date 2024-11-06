import { observer } from '@legendapp/state/react';
import {
	ConfirmationStatus,
	StatusOrderType,
	transactionStatusModal$,
} from './store';
import { Close, Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import {
	closeButton,
	dialogOverlay,
	transactionStatusModalContent,
} from './styles.css';
import {
	CloseIcon,
	IconButton,
	Skeleton,
	Text,
} from '@0xsequence/design-system';
import { useCollectible } from '@react-hooks/useCollectible';
import { Hex } from 'viem';
import TransactionPreview from '../transactionPreview';
import { Price, TokenMetadata } from '@types';
import TransactionFooter from '../transaction-footer';
import { useTransactionReceipt } from 'wagmi';

export type ShowTransactionStatusModalArgs = {
	hash: Hex;
	price?: Price;
	collectionAddress: string;
	chainId: string;
	tokenId: string;
	getTitle?: (props: ConfirmationStatus) => string;
	getMessage?: (props: ConfirmationStatus) => string;
	type: StatusOrderType;
};

export const useTransactionStatusModal = () => {
	return {
		show: (args: ShowTransactionStatusModalArgs) =>
			transactionStatusModal$.open(args),
		close: () => transactionStatusModal$.close(),
	};
};

const TransactionStatusModal = observer(() => {
	const {
		hash,
		price,
		collectionAddress,
		chainId,
		tokenId,
		getTitle,
		getMessage,
	} = transactionStatusModal$.state.get();
	const { data: collectible } = useCollectible({
		collectionAddress,
		chainId,
		collectibleId: tokenId,
	});
	const {
		isLoading: isConfirming,
		isSuccess: isConfirmed,
		isError: isFailed,
	} = useTransactionReceipt({ hash });
	const title = getTitle && getTitle({ isConfirmed, isConfirming, isFailed });
	const message =
		getMessage && getMessage({ isConfirmed, isConfirming, isFailed });

	return (
		<Root open={transactionStatusModal$.isOpen.get()}>
			<Portal>
				<Overlay className={dialogOverlay} />

				<Content className={transactionStatusModalContent}>
					{title ? (
						<Text fontSize="large" fontWeight="bold" color="text100">
							{title}
						</Text>
					) : (
						<Skeleton width="16" height="6" />
					)}

					{message ? (
						<Text fontSize="small" color="text80">
							{message}
						</Text>
					) : (
						<Skeleton width="20" height="4" />
					)}

					<TransactionPreview
						price={price}
						collectionAddress={collectionAddress}
						chainId={chainId}
						collectible={collectible as TokenMetadata}
						isConfirming={isConfirming}
						isConfirmed={isConfirmed}
						isFailed={isFailed}
					/>

					<TransactionFooter
						transactionHash={hash!}
						isConfirming={isConfirming}
						isConfirmed={isConfirmed}
						isFailed={isFailed}
					/>

					<Close
						onClick={() => {
							transactionStatusModal$.close();
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

export default TransactionStatusModal;
