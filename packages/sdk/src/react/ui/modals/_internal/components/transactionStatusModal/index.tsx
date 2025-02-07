import {
	CloseIcon,
	IconButton,
	Skeleton,
	Text,
	VisuallyHidden,
} from '@0xsequence/design-system';
import type { ChainId } from '@0xsequence/network';
import { use$ } from '@legendapp/state/react';
import {
	Close,
	Content,
	Overlay,
	Portal,
	Root,
	Title,
} from '@radix-ui/react-dialog';
import type { QueryKey } from '@tanstack/react-query';
import type { Hex } from 'viem';
import type { Price } from '../../../../../../types';
import { getProviderEl, getQueryClient } from '../../../../../_internal';
import type { TransactionType } from '../../../../../_internal/types';
import { useCollectible } from '../../../../../hooks';
import type { ModalCallbacks } from '../../types';
import TransactionFooter from '../transaction-footer';
import TransactionPreview from '../transactionPreview';
import { transactionStatusModal$ } from './store';
import {
	closeButton,
	dialogOverlay,
	transactionStatusModalContent,
} from './styles.css';
import { getTransactionStatusModalMessage } from './util/getMessage';
import { getTransactionStatusModalTitle } from './util/getTitle';
import useTransactionStatus from './hooks/useTransactionStatus';

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
};

const invalidateQueries = async (queriesToInvalidate?: QueryKey[]) => {
	const queryClient = getQueryClient();
	if (!queriesToInvalidate) {
		// Invalidate everything by default
		queryClient.invalidateQueries();
		return;
	}
	for (const queryKey of queriesToInvalidate) {
		await queryClient.invalidateQueries({ queryKey });
	}
};

export const useTransactionStatusModal = () => {
	return {
		show: (args: ShowTransactionStatusModalArgs) => {
			transactionStatusModal$.open(args);
		},
		close: () => transactionStatusModal$.close(),
	};
};

const TransactionStatusModal = () => {
	const isOpen = use$(transactionStatusModal$.isOpen);
	return isOpen ? <Modal /> : null;
};

function Modal() {
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
	} = use$(transactionStatusModal$.state);

	const { data: collectible, isLoading: collectibleLoading } = useCollectible({
		collectionAddress,
		chainId,
		collectibleId,
	});

	const transactionStatus = useTransactionStatus(hash, chainId, callbacks);

	const title = getTransactionStatusModalTitle({
		transactionStatus,
		transactionType: type,
		orderId,
	});

	const message = getTransactionStatusModalMessage({
		transactionStatus,
		transactionType: type,
		collectibleName: collectible?.name || '',
		orderId,
		price,
	});

	return (
		<Root open={true}>
			<Portal container={getProviderEl()}>
				<Overlay className={dialogOverlay} />
				<VisuallyHidden>
					<Title>Transaction status</Title>
				</VisuallyHidden>
				<Content
					className={transactionStatusModalContent}
					data-testid="transaction-status-modal"
				>
					{title ? (
						<Text
							fontSize="large"
							fontWeight="bold"
							color="text100"
							fontFamily="body"
							data-testid="transaction-status-title"
						>
							{title}
						</Text>
					) : (
						<Skeleton
							width="16"
							height="6"
							data-testid="transaction-modal-title-skeleton"
						/>
					)}

					{message ? (
						<Text
							fontSize="small"
							color="text80"
							fontFamily="body"
							data-testid="transaction-status-message"
						>
							{message}
						</Text>
					) : (
						<Skeleton
							width="20"
							height="4"
							data-testid="transaction-modal-content-skeleton"
						/>
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
							invalidateQueries(queriesToInvalidate);
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
}

export default TransactionStatusModal;
