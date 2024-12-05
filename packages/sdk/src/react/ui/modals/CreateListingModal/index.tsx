import { Box } from '@0xsequence/design-system';
import { Show, observer } from '@legendapp/state/react';
import type { Hash, Hex } from 'viem';
import {
	type ContractType,
} from '../../../_internal';
import { useCollection } from '../../../hooks';
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
import type { ModalCallbacks } from '../_internal/types';
import { createListingModal$ } from './_store';

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

		const { getListingSteps } = useCreateListing({
			chainId,
			collectionAddress,
			onTransactionSent: (hash) => {
				if (!hash) return;
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

		const dateToUnixTime = (date: Date) =>
			Math.floor(date.getTime() / 1000).toString();

		const { isLoading, steps, refreshSteps } = getListingSteps({
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			contractType: collection!.type as ContractType,
			listing: {
				tokenId: collectibleId,
				quantity: createListingModal$.quantity.get(),
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
			},
			{
				label: 'List item for sale',
				onClick: () => handleStepExecution(() => steps?.transaction.execute()),
				pending: steps?.transaction.isExecuting || isLoading,
				disabled:
					steps?.approval.isPending ||
					listingPrice.amountRaw === '0' ||
					isLoading,
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
	},
);
