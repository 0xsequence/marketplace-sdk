import { Box } from '@0xsequence/design-system';
import { Show, observer } from '@legendapp/state/react';
import type { QueryKey } from '@tanstack/react-query';
import type { Hash, Hex } from 'viem';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import {
	type ContractType,
	OrderbookKind,
	collectableKeys,
} from '../../../_internal';
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
import { TransactionType } from '../../../_internal/transaction-machine/execute-transaction';

export type ShowCreateListingModalArgs = {
	collectionAddress: Hex;
	chainId: string;
	collectibleId: string;
	orderbookKind: OrderbookKind;
	onSuccess?: (hash?: Hash) => void;
	onError?: (error: Error) => void;
};

export const useCreateListingModal = (callbacks?: ModalCallbacks) => {
	return {
		show: (args: ShowCreateListingModalArgs) =>
			createListingModal$.open({ ...args, defaultCallbacks: callbacks }),
		close: () => createListingModal$.close(),
	};
};

export const CreateListingModal = () => {
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	return (
		<Show if={createListingModal$.isOpen}>
			<Modal showTransactionStatusModal={showTransactionStatusModal} />
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
		const {
			collectionAddress,
			chainId,
			listingPrice,
			collectibleId,
			orderbookKind,
		} = state;
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
			orderbookKind,
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
					createListingModal$.onError(error);
				} else {
					console.debug('onError callback not provided:', error);
				}
			},
		});

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const handleStepExecution = async (execute?: any) => {
			if (!execute) return;
			try {
				await refreshSteps();
				await execute();
			} catch (error) {
				createListingModal$.onError?.(error as Error);
			}
		};

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

		const dateToUnixTime = (date: Date) =>
			Math.floor(date.getTime() / 1000).toString();

		const { isLoading, steps, refreshSteps } = getListingSteps({
			contractType: collection!.type as ContractType,
			listing: {
				tokenId: collectibleId,
				quantity: parseUnits(
					createListingModal$.quantity.get(),
					collectible?.decimals || 0,
				).toString(),
				expiry: dateToUnixTime(createListingModal$.expiry.get()),
				currencyAddress: listingPrice.currency.contractAddress,
				pricePerToken: listingPrice.amountRaw,
			},
		});

		const ctas = [
			{
				label: 'Approve TOKEN',
				onClick: () => handleStepExecution(() => steps?.approval.execute()),
				hidden: !steps?.approval.isPending,
				pending: steps?.approval.isExecuting,
				variant: 'glass' as const,
				disabled: createListingModal$.invalidQuantity.get(),
			},
			{
				label: 'List item for sale',
				onClick: () => handleStepExecution(() => steps?.transaction.execute()),
				pending: steps?.transaction.isExecuting || isLoading,
				disabled:
					steps?.approval.isPending ||
					listingPrice.amountRaw === '0' ||
					isLoading ||
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
