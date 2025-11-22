'use client';

import { Modal, Skeleton, Text } from '@0xsequence/design-system';
import type { ChainId } from '@0xsequence/network';
import type { QueryKey } from '@tanstack/react-query';
import type { Address, Hex } from 'viem';
import type { Price } from '../../../../../../types';
import { getQueryClient } from '../../../../../_internal';
import type { TransactionType } from '../../../../../_internal/types';
import { useCollectibleDetail } from '../../../../../hooks';
import type { ModalCallbacks } from '../../types';
import { MODAL_OVERLAY_PROPS } from '../consts';
import TransactionFooter from '../transaction-footer';
import TransactionPreview from '../transactionPreview';
import useTransactionStatus from './hooks/useTransactionStatus';
import {
	transactionStatusModalStore,
	useIsOpen,
	useTransactionModalState,
} from './store';
import { getTransactionStatusModalMessage } from './util/getMessage';
import { getTransactionStatusModalTitle } from './util/getTitle';

export type ShowTransactionStatusModalArgs = {
	hash?: Hex;
	orderId?: string;
	price?: Price;
	collectionAddress: Address;
	chainId: number;
	tokenId: bigint;
	type: TransactionType;
	callbacks?: ModalCallbacks;
	queriesToInvalidate?: QueryKey[];
};

const invalidateQueries = async (queriesToInvalidate?: QueryKey[]) => {
	const queryClient = getQueryClient();
	if (!queriesToInvalidate) {
		// Invalidate everything by default
		queryClient.invalidateQueries({
			predicate: (query) => !query.meta?.persistent,
		});
		return;
	}
	for (const queryKey of queriesToInvalidate) {
		await queryClient.invalidateQueries({ queryKey });
	}
};

export const useTransactionStatusModal = () => {
	return {
		show: (args: ShowTransactionStatusModalArgs) => {
			const { type: transactionType, ...rest } = args;
			transactionStatusModalStore.send({
				type: 'open',
				transactionType,
				...rest,
			});
		},
		close: () => {
			transactionStatusModalStore.send({ type: 'close' });
		},
	};
};

const TransactionStatusModal = () => {
	const isOpen = useIsOpen();
	return isOpen ? <TransactionStatusModalContent /> : null;
};

function TransactionStatusModalContent() {
	const {
		transactionType: type,
		hash,
		orderId,
		price,
		collectionAddress,
		chainId,
		tokenId,
		callbacks,
		queriesToInvalidate,
	} = useTransactionModalState();

	const { data: collectible, isLoading: collectibleLoading } =
		useCollectibleDetail({
			collectionAddress,
			chainId,
			tokenId,
		});

	const transactionStatus = useTransactionStatus(hash, chainId, callbacks);

	const title = getTransactionStatusModalTitle({
		transactionStatus,
		transactionType: type,
		orderId,
	});

	const message = type
		? getTransactionStatusModalMessage({
				transactionStatus,
				transactionType: type,
				collectibleName: collectible?.name || '',
				orderId,
				price,
			})
		: '';

	const handleClose = () => {
		invalidateQueries(queriesToInvalidate);
		transactionStatusModalStore.send({ type: 'close' });
	};

	return (
		<Modal
			isDismissible={true}
			onClose={handleClose}
			size="sm"
			overlayProps={MODAL_OVERLAY_PROPS}
			data-testid="transaction-status-modal"
		>
			<div className="grid flex-col gap-6 p-7">
				{title ? (
					<Text
						className="font-body text-xl"
						fontWeight="bold"
						color="text100"
						data-testid="transaction-status-title"
					>
						{title}
					</Text>
				) : (
					<Skeleton
						className="h-6 w-16"
						data-testid="transaction-modal-title-skeleton"
					/>
				)}

				{message ? (
					<Text
						className="font-body text-sm"
						color="text80"
						data-testid="transaction-status-message"
					>
						{message}
					</Text>
				) : (
					<Skeleton
						className="h-4 w-20"
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
			</div>
		</Modal>
	);
}

export default TransactionStatusModal;
