import {
	CloseIcon,
	IconButton,
	Skeleton,
	Text,
} from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import { Close, Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import { useCollectible } from '#react-hooks';
import type { Price, TokenMetadata } from '#types';
import type { Hex } from 'viem';
import { useTransactionReceipt } from 'wagmi';
import TransactionFooter from '../transaction-footer';
import TransactionPreview from '../transactionPreview';
import {
	type ConfirmationStatus,
	type StatusOrderType,
	transactionStatusModal$,
} from './store';
import {
	closeButton,
	dialogOverlay,
	transactionStatusModalContent,
} from './styles.css';
import { BaseCallbacks } from '../../../../../../types/callbacks';
import { useEffect } from 'react';
import { getQueryClient } from '#internal';
import { QueryKey } from '@tanstack/react-query';

export type ShowTransactionStatusModalArgs = {
	hash: Hex;
	price?: Price;
	collectionAddress: Hex;
	chainId: string;
	tokenId: string;
	getTitle?: (props: ConfirmationStatus) => string;
	getMessage?: (props: ConfirmationStatus) => string;
	type: StatusOrderType;
	callbacks?: BaseCallbacks;
	queriesToInvalidate?: QueryKey[];
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
		callbacks,
		queriesToInvalidate,
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
		error,
	} = useTransactionReceipt({ hash });
	const title = getTitle && getTitle({ isConfirmed, isConfirming, isFailed });
	const message =
		getMessage && getMessage({ isConfirmed, isConfirming, isFailed });
	const { onUnknownError, onSuccess }: BaseCallbacks = callbacks || {};
	const queryClient = getQueryClient();

	useEffect(() => {
		if (!transactionStatusModal$.isOpen.get()) return;

		let isSubscribed = true;

		if (isConfirmed && isSubscribed && onSuccess) {
			onSuccess();
		}

		if (isFailed && isSubscribed && onUnknownError) {
			onUnknownError(error);
		}

		if (isSubscribed && queriesToInvalidate) {
			queryClient.invalidateQueries({ queryKey: [...queriesToInvalidate] });
		}

		return () => {
			isSubscribed = false;
		};
	}, [isConfirmed, isFailed, onSuccess, onUnknownError, error]);

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
