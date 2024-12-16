import { Box } from '@0xsequence/design-system';
import { Show, observer } from '@legendapp/state/react';
import type { QueryKey } from '@tanstack/react-query';
import type { Hex } from 'viem';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { type ContractType, collectableKeys } from '../../../_internal';
import { TransactionType } from '../../../_internal/transaction-machine/execute-transaction';
import {
	useBalanceOfCollectible,
	useCollectible,
	useCollection,
} from '../../../hooks';
import { useCreateListing } from '../../../hooks/useCreateListing';
import {
	ActionModal,
	type ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import { useTransactionStatusModal } from '../_internal/components/transactionStatusModal';
import type { ModalCallbacks } from '../_internal/types';
import { createListingModal$ } from './_store';
import { useState, useEffect } from 'react';

export type ShowCreateListingModalArgs = {
	collectionAddress: Hex;
	chainId: string;
	collectibleId: string;
	callbacks?: ModalCallbacks;
};

export const useCreateListingModal = (defaultCallbacks?: ModalCallbacks) => {
	return {
		show: (args: ShowCreateListingModalArgs) =>
			createListingModal$.open({ 
				...args, 
				callbacks: args.callbacks || defaultCallbacks 
			}),
		close: () => createListingModal$.close(),
	};
};

export const CreateListingModal = () => {
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	return (
		<Show if={createListingModal$.isOpen}>
			{() => <Modal showTransactionStatusModal={showTransactionStatusModal} />}
		</Show>
	);
};

type TransactionStatusModalReturn = ReturnType<
	typeof useTransactionStatusModal
>;

export const Modal = observer(
	({
		showTransactionStatusModal,
	}: {
		showTransactionStatusModal: TransactionStatusModalReturn['show'];
	}) => {
		const state = createListingModal$.get();
		const { collectionAddress, chainId, listingPrice, collectibleId } = state;
		const [stepIsLoading, setStepIsLoading] = useState(false);

		const {
			data: collectible,
			isLoading: collectableIsLoading,
			isError: collectableIsError,
		} = useCollectible({
			chainId,
			collectionAddress,
			collectibleId,
		});

		const {
			data: collection,
			isLoading: collectionIsLoading,
			isError: collectionIsError,
		} = useCollection({
			chainId,
			collectionAddress,
		});

		const { address } = useAccount();

		const { data: balance } = useBalanceOfCollectible({
			chainId,
			collectionAddress,
			collectableId: collectibleId,
			userAddress: address!,
		});

		const { getListingSteps, isLoading: machineLoading } = useCreateListing({
			chainId,
			collectionAddress,
			onTransactionSent: (hash) => {
				if (!hash) return;
				showTransactionStatusModal({
					hash,
					collectionAddress,
					chainId,
					price: createListingModal$.listingPrice.get(),
					collectibleId,
					type: TransactionType.LISTING,
					queriesToInvalidate: collectableKeys.all as unknown as QueryKey[],
				});
				createListingModal$.close();
			},
			onError: (error) => {
				if (typeof createListingModal$.callbacks?.onError === 'function') {
					createListingModal$.callbacks.onError(error);
				} else {
					console.debug('onError callback not provided:', error);
				}
			},
		});

		const dateToUnixTime = (date: Date) =>
			Math.floor(date.getTime() / 1000).toString();

		const { steps, refreshSteps } = getListingSteps({
			contractType: collection?.type as ContractType,
			listing: {
				tokenId: collectibleId,
				quantity: parseUnits(
					createListingModal$.quantity.get(),
						collectible?.decimals || 0,
				).toString(),
				expiry: dateToUnixTime(createListingModal$.expiry.get()),
				currencyAddress: listingPrice.currency.contractAddress,
				pricePerToken: listingPrice.amountRaw === '0' ? '1' : listingPrice.amountRaw,
			},
		});

		useEffect(() => {
			if (!listingPrice.currency.contractAddress) return;
			refreshSteps();
		}, [listingPrice.currency.contractAddress]);

		if (collectableIsLoading || collectionIsLoading || machineLoading) {
			return (
				<LoadingModal
					store={createListingModal$}
					onClose={createListingModal$.close}
					title="List item for sale"
				/>
			);
		}

		if (collectableIsError || collectionIsError) {
			return (
				<ErrorModal
					store={createListingModal$}
					onClose={createListingModal$.close}
					title="List item for sale"
				/>
			);
		}

		const handleStepExecution = async (execute?: any, close?: boolean) => {
			if (!execute) return;
			try {
				setStepIsLoading(true);
				await refreshSteps();
				await execute();
				if (close) createListingModal$.close();
			} catch (error) {
				createListingModal$.callbacks?.onError?.(error as Error);
			} finally {
				setStepIsLoading(false);
			}
		};

		const ctas = [
			{
				label: 'Approve TOKEN',
				onClick: () => handleStepExecution(() => steps?.approval.execute()),
				hidden: !steps?.approval.isPending,
				pending: steps?.approval.isExecuting || stepIsLoading,
				variant: 'glass' as const,
				disabled: createListingModal$.invalidQuantity.get(),
			},
			{
				label: 'List item for sale',
				onClick: () => handleStepExecution(() => steps?.transaction.execute(), true),
				pending: steps?.transaction.isExecuting || stepIsLoading,
				disabled:
					steps?.approval.isPending ||
					listingPrice.amountRaw === '0' ||
					stepIsLoading ||
					createListingModal$.invalidQuantity.get(),
			},
		] satisfies ActionModalProps['ctas'];

		return (
			<ActionModal
				store={createListingModal$}
				onClose={() => createListingModal$.close()}
				title="List item for sale"
				ctas={ctas}
			>
				<TokenPreview
					collectionName={collection?.name}
					collectionAddress={collectionAddress}
					collectibleId={collectibleId}
					chainId={chainId}
				/>

				<Box display="flex" flexDirection="column" width="full" gap="1">
					<PriceInput
						chainId={chainId}
						collectionAddress={collectionAddress}
						$listingPrice={createListingModal$.listingPrice}
					/>
					{!!listingPrice && (
						<FloorPriceText
							tokenId={collectibleId}
							chainId={chainId}
							collectionAddress={collectionAddress}
							price={listingPrice}
						/>
					)}
				</Box>

				{collection?.type === 'ERC1155' && balance && (
					<QuantityInput
						$quantity={createListingModal$.quantity}
						$invalidQuantity={createListingModal$.invalidQuantity}
						decimals={collectible?.decimals || 0}
						maxQuantity={balance?.balance}
					/>
				)}

				<ExpirationDateSelect $date={createListingModal$.expiry} />

				<TransactionDetails
					collectibleId={collectibleId}
					collectionAddress={collectionAddress}
					chainId={chainId}
					price={createListingModal$.listingPrice.get()}
					currencyImageUrl={listingPrice.currency.imageUrl}
				/>
			</ActionModal>
		);
	},
);
