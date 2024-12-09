import { Box } from '@0xsequence/design-system';
import { Show, observer } from '@legendapp/state/react';
import type { Hash, Hex } from 'viem';
import { CreateReq, type ContractType } from '../../../_internal';
import { useCollection } from '../../../hooks';
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
import type { ModalCallbacks } from '../_internal/types';
import { createListingModal$ } from './_store';
import { useEffect, useState } from 'react';
import {
	TransactionState,
	TransactionType,
} from '../../../_internal/transaction-machine/execute-transaction';
import { useTransactionMachine } from '../../../_internal/transaction-machine/useTransactionMachine';

export type ShowCreateListingModalArgs = {
	collectionAddress: Hex;
	chainId: string;
	collectibleId: string;
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
	return (
		<Show if={createListingModal$.isOpen}>
			<Modal />
		</Show>
	);
};

export const Modal = observer(() => {
	const state = createListingModal$.get();
	const { collectionAddress, chainId, listingPrice, collectibleId } = state;
	const {
		data: collection,
		isLoading: collectionIsLoading,
		isError: collectionIsError,
	} = useCollection({
		chainId,
		collectionAddress,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [transactionState, setTransactionState] =
		useState<TransactionState | null>(null);

	const machine = useTransactionMachine(
		{
			collectionAddress,
			chainId,
			collectibleId,
			type: TransactionType.LISTING,
		},
		(hash) => {
			console.log('Transaction hash', hash);
		},
		(error) => {
			console.error('Transaction error', error);
		},
		createListingModal$.close,
		(hash) => {
			console.log('Transaction sent', hash);
		},
	);

	const listing = {
		tokenId: collectibleId,
		currencyAddress: listingPrice.currency.contractAddress,
	} as CreateReq;

	useEffect(() => {
		if (!machine || transactionState?.steps.checked) return;

		machine
			.refreshStepsGetState({
				listing: listing,
				contractType: collection?.type as ContractType,
			})
			.then((state) => {
				if (!state.steps) return;

				setTransactionState(state);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error('Error loading make offer steps', error);
				setIsLoading(false);
			});
	}, [machine]);

	if (collectionIsLoading) {
		return (
			<LoadingModal
				store={createListingModal$}
				onClose={createListingModal$.close}
				title="List item for sale"
			/>
		);
	}

	if (collectionIsError) {
		return (
			<ErrorModal
				store={createListingModal$}
				onClose={createListingModal$.close}
				title="List item for sale"
			/>
		);
	}

	const handleStepExecution = async () => {
		await transactionState?.transaction.execute({
			type: TransactionType.LISTING,
			props: {
				listing: listing,
				contractType: collection?.type as ContractType,
			},
		});
	};

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: async () => transactionState?.approval.approve(),
			hidden: !transactionState?.approval.needed || isLoading,
			pending: isLoading || transactionState?.approval.processing,
			variant: 'glass' as const,
			disabled: isLoading || transactionState?.approval.processing,
		},
		{
			label: 'List item for sale',
			onClick: handleStepExecution,
			pending:
				!transactionState ||
				isLoading ||
				transactionState.steps.checking ||
				transactionState.transaction.executing,
			disabled:
				!transactionState ||
				isLoading ||
				transactionState.steps.checking ||
				transactionState.transaction.executing,
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

			{collection?.type === 'ERC1155' && (
				<QuantityInput
					chainId={chainId}
					collectionAddress={collectionAddress}
					collectibleId={collectibleId}
					$quantity={createListingModal$.quantity}
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
});
