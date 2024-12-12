import { Box } from '@0xsequence/design-system';
import { Show, observer } from '@legendapp/state/react';
import type { Hash, Hex } from 'viem';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import type { ContractType } from '../../../_internal';
import {
	useBalanceOfCollectible,
	useCollectible,
	useCollection,
} from '../../../hooks';
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
import useCreateListing from '../../../hooks/useCreateListing';

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
	const {
		collectionAddress,
		chainId,
		listingPrice,
		collectibleId,
		expiry,
		callbacks,
	} = state;
	const {
		data: collection,
		isLoading: collectionIsLoading,
		isError: collectionIsError,
	} = useCollection({
		chainId,
		collectionAddress,
	});
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
		data: balance,
		isLoading: balanceIsLoading,
		isError: balanceIsError,
	} = useBalanceOfCollectible({
		chainId,
		collectionAddress,
		collectableId: collectibleId,
		userAddress: useAccount().address!,
	});
	const { transactionState, approve, execute } = useCreateListing({
		closeModalFn: createListingModal$.close,
		collectionAddress,
		chainId,
		collectibleId,
		collectionType: collection?.type as ContractType,
		expiry: expiry,
		pricePerToken: listingPrice,
		quantity: parseUnits(
			createListingModal$.quantity.get(),
			collectible?.decimals || 0,
		).toString(),
		callbacks: callbacks || {},
	});

	if (collectionIsLoading) {
		return (
			<LoadingModal
				store={createListingModal$}
				onClose={createListingModal$.close}
				title="List item for sale"
			/>
		);
	}

			if (collectableIsError || collectionIsError || balanceIsError) {
		return (
			<ErrorModal
				store={createListingModal$}
				onClose={createListingModal$.close}
				title="List item for sale"
			/>
		);
	}

	const checkingSteps = transactionState?.steps.checking;

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: approve,
			hidden: !transactionState?.approval.needed || checkingSteps,
			pending: checkingSteps || transactionState?.approval.processing,
			variant: 'glass' as const,
			disabled: transactionState?.approval.processing,
		},
		{
			label: 'List item for sale',
			onClick: execute,
			pending:
				!transactionState ||
				transactionState.steps.checking ||
				transactionState.transaction.executing,
			disabled:
				listingPrice.amountRaw === '0' ||
				!transactionState ||
				transactionState.steps.checking ||
				transactionState.approval.needed ||
				!transactionState.transaction.ready ||
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
					<Box display="flex" flexDirection="column" width="full" gap="4">
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
							{collection?.type === 'ERC1155' && balance && (
								<QuantityInput
									$quantity={createListingModal$.quantity}
									$invalidQuantity={createListingModal$.invalidQuantity}
									decimals={collectible?.decimals || 0}
									maxQuantity={balance?.balance}
					/>
				)}
			</Box>

			<ExpirationDateSelect $date={createListingModal$.expiry} />

			<TransactionDetails
				collectibleId={collectibleId}
				collectionAddress={collectionAddress}
				chainId={chainId}
				price={createListingModal$.listingPrice.get()}
				currencyImageUrl={listingPrice.currency.imageUrl}
			/>
					</Box>
		</ActionModal>
	);
});
