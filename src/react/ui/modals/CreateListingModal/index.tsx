import { ContractType, type GenerateListingTransactionArgs } from '@internal';
import { observer, useMount } from '@legendapp/state/react';
import { useCollection } from '@react-hooks/useCollection';
import { useGenerateListingTransaction } from '@react-hooks/useGenerateListingTransaction';
import { OrderbookKind } from '@types';
import { useAccount } from 'wagmi';
import {
	ActionModal,
	ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import { createListingModal$ } from './_store';
import { Box } from '@0xsequence/design-system';
import { useApproveToken } from '@react-hooks/useApproveToken';

export type ShowCreateListingModalArgs = {
	collectionAddress: string;
	chainId: string;
	collectibleId: string;
};

export const useCreateListingModal = () => {
	return {
		show: (args: ShowCreateListingModalArgs) => createListingModal$.open(args),
		close: () => createListingModal$.close(),
	};
};

export const CreateListingModal = observer(() => {
	return createListingModal$.isOpen.get() ? <Modal /> : null;
});

const Modal = observer(() => {
	const { address: accountAddress } = useAccount();
	const { collectionAddress, chainId, tokenId, listingPrice } =
		createListingModal$.state.get();
	const createListingPrice$ = createListingModal$.state.listingPrice;
	const { data: collection } = useCollection({
		chainId,
		collectionAddress,
	});
	const { tokenApprovalNeeded, approveToken } = useApproveToken({
		chainId,
		collectionAddress: collectionAddress,
		collectionType: collection?.type as ContractType,
		tokenId,
	});
	const { generateListingTransaction, isPending: creatingListing } =
		useGenerateListingTransaction({
			chainId: chainId,
		});

	function handleListItem(listing?: GenerateListingTransactionArgs['listing']) {
		const placeholderListing = {
			tokenId: '1',
			quantity: '1',
			expiry: Date.now().toString(),
			currencyAddress: '0x',
			pricePerToken: '0',
		} as GenerateListingTransactionArgs['listing'];

		generateListingTransaction({
			collectionAddress: collectionAddress,
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			owner: accountAddress!,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			contractType: collection?.type as ContractType,
			orderbook: OrderbookKind.sequence_marketplace_v1,
			listing: listing || placeholderListing,
		});
	}

	// call generateListingTransaction on mount to decide if it is needed to approve token
	useMount(() => {
		handleListItem();
	});

	async function handleCreateListing() {
		console.log('create listing');
	}

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: approveToken,
			hidden: !tokenApprovalNeeded,
			variant: 'glass' as const,
		},
		{
			label: 'List item for sale',
			onClick: handleCreateListing,
			pending: creatingListing,
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
				collectibleId={tokenId}
				chainId={chainId}
			/>

			<Box display="flex" flexDirection="column" width="full" gap="1">
				<PriceInput
					chainId={chainId}
					collectionAddress={collectionAddress}
					$listingPrice={createListingPrice$}
				/>
				{!!listingPrice && (
					<FloorPriceText
						chainId={chainId}
						collectionAddress={collectionAddress}
						price={listingPrice}
					/>
				)}
			</Box>

			{collection?.type === ContractType.ERC1155 && (
				<QuantityInput
					chainId={chainId}
					collectionAddress={collectionAddress}
					collectibleId={tokenId}
					$quantity={createListingModal$.state.quantity}
				/>
			)}

			<ExpirationDateSelect />

			<TransactionDetails
				collectibleId={tokenId}
				collectionAddress={collectionAddress}
				chainId={chainId}
				price={listingPrice}
			/>
		</ActionModal>
	);
});
