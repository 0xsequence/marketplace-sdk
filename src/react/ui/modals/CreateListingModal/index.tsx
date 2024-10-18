import { useState } from 'react';

import {
	ActionModal,
	type ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import { createListingModal$ } from './_store';
import { ContractType, type GenerateListingTransactionArgs } from '@internal';
import { observer, useMount } from '@legendapp/state/react';
import { useCollection } from '@react-hooks/useCollection';
import { useGenerateListingTransaction } from '@react-hooks/useGenerateListingTransaction';
import { OrderbookKind, StepType } from '@types';
import { useAccount } from 'wagmi';

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
	const { address: accountAddress } = useAccount();
	const { collectionAddress, chainId, collectibleId, listingPrice } =
		createListingModal$.state.get();
	const createListingPrice$ = createListingModal$.state.listingPrice;
	const { data: collection } = useCollection({
		chainId,
		collectionAddress,
	});
	const [quantity, setQuantity] = useState('1');
	const { data, generateListingTransaction } = useGenerateListingTransaction({
		chainId: chainId,
	});
	const tokenApprovalNeeded = data?.steps.some(
		(step) => (step.id as StepType) === StepType.tokenApproval,
	);
	const ctasToShow = tokenApprovalNeeded
		? [
				{
					label: 'Approve TOKEN',
					onClick: handleApproveToken,
					variant: 'glass' as const,
				},
				{
					label: 'List item for sale',
					onClick: handleCreateListing,
				},
			]
		: ([
				{
					label: 'List item for sale',
					onClick: handleApproveToken,
				},
			] as ActionModalProps['ctas']);

	// Call generateListingTransaction on mount to decide if it is needed to approve token
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

	async function handleApproveToken() {
		console.log('approve token');
	}

	return (
		<ActionModal
			store={createListingModal$}
			onClose={() => createListingModal$.close()}
			title="List item for sale"
			ctas={ctasToShow}
		>
			<TokenPreview
				collectionName={collection?.name}
				collectionAddress={collectionAddress}
				collectibleId={collectibleId}
				chainId={chainId}
			/>

			<PriceInput
				chainId={chainId}
				collectionAddress={collectionAddress}
				$listingPrice={createListingPrice$}
			/>
			{!!listingPrice && (
				<FloorPriceText
					chainId={chainId}
					collectionAddress={collectionAddress}
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					price={listingPrice}
				/>
			)}

			{collection?.type === ContractType.ERC1155 && (
				<QuantityInput
					chainId={chainId}
					collectionAddress={collectionAddress}
					collectibleId={collectibleId}
					quantity={quantity}
					setQuantity={setQuantity}
				/>
			)}

			<ExpirationDateSelect />

			<TransactionDetails
				collectibleId={collectibleId}
				collectionAddress={collectionAddress}
				chainId={chainId}
				price={listingPrice}
			/>
		</ActionModal>
	);
});
