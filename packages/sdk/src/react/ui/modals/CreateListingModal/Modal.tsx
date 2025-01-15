import { Box } from '@0xsequence/design-system';
import { Show, observer } from '@legendapp/state/react';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { type ContractType } from '../../../_internal';
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
import { createListingModal$ } from './store';
import { dateToUnixTime } from '../../../../utils/date';
import { useCreateListing } from './hooks/useCreateListing';

export const CreateListingModal = () => {
	return <Show if={createListingModal$.isOpen}>{() => <Modal />}</Show>;
};

const Modal = observer(() => {
	const state = createListingModal$.get();
	const {
		collectionAddress,
		chainId,
		listingPrice,
		collectibleId,
		orderbookKind,
		callbacks,
	} = state;
	const steps$ = createListingModal$.steps;

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
		userAddress: address ?? undefined,
	});

	const { isLoading, executeApproval, createListing, tokenApprovalIsLoading } =
		useCreateListing({
			listingInput: {
				contractType: collection?.type as ContractType,
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
			},
			chainId,
			collectionAddress,
			orderbookKind,
			callbacks,
			closeMainModal: () => createListingModal$.close(),
			steps$: steps$,
		});

	if (collectableIsLoading || collectionIsLoading) {
		return (
			<LoadingModal
				isOpen={createListingModal$.isOpen.get()}
				chainId={Number(chainId)}
				onClose={createListingModal$.close}
				title="List item for sale"
			/>
		);
	}

	if (collectableIsError || collectionIsError) {
		return (
			<ErrorModal
				isOpen={createListingModal$.isOpen.get()}
				chainId={Number(chainId)}
				onClose={createListingModal$.close}
				title="List item for sale"
			/>
		);
	}

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: async () => await executeApproval(),
			hidden: !steps$.approval.exist.get(),
			pending: steps$?.approval.isExecuting.get(),
			variant: 'glass' as const,
			disabled:
				createListingModal$.invalidQuantity.get() ||
				listingPrice.amountRaw === '0' ||
				steps$?.approval.isExecuting.get() ||
				tokenApprovalIsLoading ||
				isLoading,
		},
		{
			label: 'List item for sale',
			onClick: () => createListing(),
			pending: steps$?.transaction.isExecuting.get(),
			disabled:
				steps$.approval.exist.get() ||
				tokenApprovalIsLoading ||
				listingPrice.amountRaw === '0' ||
				createListingModal$.invalidQuantity.get() ||
				isLoading,
		},
	] satisfies ActionModalProps['ctas'];

	return (
		<ActionModal
			isOpen={createListingModal$.isOpen.get()}
			chainId={Number(chainId)}
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
					$price={createListingModal$.listingPrice}
				/>

				{listingPrice.amountRaw !== '0' && (
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
});
