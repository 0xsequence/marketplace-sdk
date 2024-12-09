import { Show, observer } from '@legendapp/state/react';
import { useState } from 'react';
import type { Hex } from 'viem';
import { ContractType } from '../../../_internal';
import { useCollection, useCurrencies } from '../../../hooks';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import TokenPreview from '../_internal/components/tokenPreview';
import { makeOfferModal$ } from './_store';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import type { ModalCallbacks } from '../_internal/types';
import useMakeOffer from '../../../hooks/useMakeOffer';

export type ShowMakeOfferModalArgs = {
	collectionAddress: Hex;
	chainId: string;
	collectibleId: string;
};

export const useMakeOfferModal = (defaultCallbacks?: ModalCallbacks) => ({
	show: (args: ShowMakeOfferModalArgs) =>
		makeOfferModal$.open({ ...args, callbacks: defaultCallbacks }),
	close: makeOfferModal$.close,
});

export const MakeOfferModal = () => {
	return (
		<Show if={makeOfferModal$.isOpen}>
			<ModalContent />
		</Show>
	);
};

const ModalContent = observer(() => {
	const state = makeOfferModal$.get();
	const {
		collectionAddress,
		chainId,
		offerPrice,
		collectibleId,
		quantity,
		expiry,
	} = state;
	const [insufficientBalance, setInsufficientBalance] = useState(false);
	const {
		data: collection,
		isLoading: collectionIsLoading,
		isError: collectionIsError,
	} = useCollection({
		chainId,
		collectionAddress,
	});
	const { isLoading: currenciesIsLoading } = useCurrencies({
		chainId,
		collectionAddress,
	});
	const { transactionState, approve, execute } = useMakeOffer({
		closeModalFn: makeOfferModal$.close,
		collectionAddress,
		chainId,
		collectibleId,
		offerPrice,
		collection,
		quantity,
		expiry,
	});

	if (collectionIsLoading || currenciesIsLoading) {
		return (
			<LoadingModal
				store={makeOfferModal$}
				onClose={makeOfferModal$.close}
				title="Make an offer"
			/>
		);
	}

	if (collectionIsError) {
		return (
			<ErrorModal
				store={makeOfferModal$}
				onClose={makeOfferModal$.close}
				title="Make an offer"
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
			disabled: checkingSteps || transactionState?.approval.processing,
		},
		{
			label: 'Make offer',
			onClick: execute,
			pending:
				transactionState?.steps.checking ||
				transactionState?.transaction.executing,
			disabled: !transactionState?.transaction.ready || insufficientBalance,
		},
	];

	return (
		<ActionModal
			store={makeOfferModal$}
			onClose={() => makeOfferModal$.close()}
			title="Make an offer"
			ctas={ctas}
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
				$listingPrice={makeOfferModal$.offerPrice}
				checkBalance={{
					enabled: true,
					callback: (state) => setInsufficientBalance(state),
				}}
			/>

			{collection?.type === ContractType.ERC1155 && (
				<QuantityInput
					chainId={chainId}
					$quantity={makeOfferModal$.quantity}
					collectionAddress={collectionAddress}
					collectibleId={collectibleId}
				/>
			)}

			{!!offerPrice && (
				<FloorPriceText
					tokenId={collectibleId}
					chainId={chainId}
					collectionAddress={collectionAddress}
					price={offerPrice}
				/>
			)}

			<ExpirationDateSelect $date={makeOfferModal$.expiry} />
		</ActionModal>
	);
});
