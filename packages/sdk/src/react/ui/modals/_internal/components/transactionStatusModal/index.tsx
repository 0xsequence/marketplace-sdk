import {
	CloseIcon,
	IconButton,
	Skeleton,
	Text,
} from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import { Close, Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import { type QueryKey } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { WaitForTransactionReceiptTimeoutError, type Hex } from 'viem';
import type { Price } from '../../../../../../types';
import { getQueryClient } from '../../../../../_internal';
import { useCollectible } from '../../../../../hooks';
import TransactionFooter from '../transaction-footer';
import TransactionPreview from '../transactionPreview';
import {
	type ConfirmationStatus,
	transactionStatusModal$,
} from './store';
import {
	closeButton,
	dialogOverlay,
	transactionStatusModalContent,
} from './styles.css';
import { ChainId } from '@0xsequence/network';
import { getPublicRpcClient } from '../../../../../../utils';
import { TRANSACTION_CONFIRMATIONS_DEFAULT } from '@0xsequence/kit';
import { TransactionType } from '../../../../../_internal/transaction-machine/execute-transaction';
import { ModalCallbacks } from '../../types';

export type ShowTransactionStatusModalArgs = {
	hash: Hex;
	price?: Price;
	collectionAddress: Hex;
	chainId: string;
	collectibleId: string;
	getTitle?: (props: ConfirmationStatus) => string;
	getMessage?: (props: ConfirmationStatus) => string;
	type: TransactionType;
	callbacks?: ModalCallbacks;
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
		collectibleId,
		getTitle,
		getMessage,
		callbacks,
		queriesToInvalidate,
	} = transactionStatusModal$.state.get();
	const { data: collectible } = useCollectible({
		collectionAddress,
		chainId,
		collectibleId,
	});
	const [transactionStatus, setTransactionStatus] = useState<
		'pending' | 'success' | 'error' | 'timeout'
	>('pending');
	const title =
		getTitle &&
		getTitle({
			isConfirmed: transactionStatus === 'success',
			isConfirming: transactionStatus === 'pending',
			isFailed: transactionStatus === 'error',
			isTimeout: transactionStatus === 'timeout',
		});
	const message =
		getMessage &&
		getMessage({
			isConfirmed: transactionStatus === 'success',
			isConfirming: transactionStatus === 'pending',
			isFailed: transactionStatus === 'error',
			isTimeout: transactionStatus === 'timeout',
		});
	const { onError, onSuccess }: ModalCallbacks = callbacks || {};
	const queryClient = getQueryClient();
	const publicClient = chainId ? getPublicRpcClient(chainId) : null;
	const waitForTransactionReceiptPromise =
		publicClient?.waitForTransactionReceipt({
			confirmations: TRANSACTION_CONFIRMATIONS_DEFAULT,
			hash: hash!,
		});

	useEffect(() => {
		if (!transactionStatusModal$.isOpen.get()) return;

		console.log('Waiting for transaction receipt ...');
		waitForTransactionReceiptPromise
			?.then((receipt) => {
				if (receipt.status === 'success') {
					console.log('receipt', receipt);
					setTransactionStatus('success');
				}
			})
			.catch((error) => {
				if (error instanceof WaitForTransactionReceiptTimeoutError) {
					setTransactionStatus('timeout');
					return;
				}

				setTransactionStatus('error');
			});

		if (queriesToInvalidate) {
			queryClient.invalidateQueries({ queryKey: [...queriesToInvalidate] });
		}

    return () => {
      setTransactionStatus('pending');
    }
	}, [onSuccess, onError, transactionStatusModal$.isOpen.get()]);

	return (
		<Root open={transactionStatusModal$.isOpen.get()}>
			<Portal>
				<Overlay className={dialogOverlay} />

				<Content className={transactionStatusModalContent}>
					{title ? (
						<Text
							fontSize="large"
							fontWeight="bold"
							color="text100"
							fontFamily="body"
						>
							{title}
						</Text>
					) : (
						<Skeleton width="16" height="6" />
					)}

					{message ? (
						<Text fontSize="small" color="text80" fontFamily="body">
							{message}
						</Text>
					) : (
						<Skeleton width="20" height="4" />
					)}

					{collectible && (
						<TransactionPreview
							price={price}
							collectionAddress={collectionAddress}
							chainId={chainId}
							collectible={collectible}
							currencyImageUrl={price?.currency.imageUrl}
							isConfirming={transactionStatus === 'pending'}
							isConfirmed={transactionStatus === 'success'}
							isFailed={transactionStatus === 'error'}
              isTimeout={transactionStatus === 'timeout'}
						/>
					)}

					<TransactionFooter
						transactionHash={hash!}
						isConfirming={transactionStatus === 'pending'}
						isConfirmed={transactionStatus === 'success'}
						isFailed={transactionStatus === 'error'}
						isTimeout={transactionStatus === 'timeout'}
						chainId={chainId as unknown as ChainId}
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
