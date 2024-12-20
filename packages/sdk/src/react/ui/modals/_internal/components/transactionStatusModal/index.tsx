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
import { TransactionStatus, transactionStatusModal$ } from './store';
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
import { getTransactionStatusModalTitle } from './util/getTitle';
import { getTransactionStatusModalMessage } from './util/getMessage';

export type ShowTransactionStatusModalArgs = {
	hash?: Hex;
	orderId?: string;
	price?: Price;
	collectionAddress: Hex;
	chainId: string;
	collectibleId: string;
	type: TransactionType;
	callbacks?: ModalCallbacks;
	queriesToInvalidate?: QueryKey[];
	confirmations?: number;
	blocked?: boolean;
};

export const useTransactionStatusModal = () => {
	return {
		show: (args: ShowTransactionStatusModalArgs) => {
			if (args.blocked) return;

			transactionStatusModal$.open(args);
		},
		close: () => transactionStatusModal$.close(),
	};
};

const TransactionStatusModal = observer(() => {
	const {
		type,
		hash,
		orderId,
		price,
		collectionAddress,
		chainId,
		collectibleId,
		callbacks,
		queriesToInvalidate,
		confirmations,
	} = transactionStatusModal$.state.get();
	const { data: collectible, isLoading: collectibleLoading } = useCollectible({
		collectionAddress,
		chainId,
		collectibleId,
	});
	const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
		orderId ? 'SUCCESS' : 'PENDING',
	);
	const title = getTransactionStatusModalTitle({
		transactionStatus,
		transactionType: type!,
		orderId,
	});
	const message = getTransactionStatusModalMessage({
		transactionStatus,
		transactionType: type!,
		collectibleName: collectible?.name || '',
		orderId,
	});
	const { onError, onSuccess }: ModalCallbacks = callbacks || {};
	const queryClient = getQueryClient();
	const publicClient = chainId ? getPublicRpcClient(chainId) : null;
	const waitForTransactionReceiptPromise =
		publicClient?.waitForTransactionReceipt({
			confirmations: confirmations || TRANSACTION_CONFIRMATIONS_DEFAULT,
			hash: hash!,
		});

	useEffect(() => {
		if (!transactionStatusModal$.isOpen.get()) return;

		console.log('Waiting for transaction receipt ...');
		waitForTransactionReceiptPromise
			?.then((receipt) => {
				if (receipt.status === 'success') {
					console.log('receipt', receipt);
					setTransactionStatus('SUCCESS');
				}
			})
			.catch((error) => {
				if (error instanceof WaitForTransactionReceiptTimeoutError) {
					setTransactionStatus('TIMEOUT');
					return;
				}

				setTransactionStatus('FAILED');
			});

		if (queriesToInvalidate) {
			queryClient.invalidateQueries({ queryKey: [...queriesToInvalidate] });
		}

		return () => {
			setTransactionStatus('PENDING');
		};
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

					<TransactionPreview
						orderId={orderId}
						price={price}
						collectionAddress={collectionAddress}
						chainId={chainId}
						collectible={collectible}
						collectibleLoading={collectibleLoading}
						currencyImageUrl={price?.currency.imageUrl}
						isConfirming={transactionStatus === 'PENDING'}
						isConfirmed={transactionStatus === 'SUCCESS'}
						isFailed={transactionStatus === 'FAILED'}
						isTimeout={transactionStatus === 'TIMEOUT'}
					/>

					<TransactionFooter
						transactionHash={hash}
						orderId={orderId}
						isConfirming={transactionStatus === 'PENDING'}
						isConfirmed={transactionStatus === 'SUCCESS'}
						isFailed={transactionStatus === 'FAILED'}
						isTimeout={transactionStatus === 'TIMEOUT'}
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
