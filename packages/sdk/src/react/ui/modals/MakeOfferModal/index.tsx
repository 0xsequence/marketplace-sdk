import { Show, observer } from '@legendapp/state/react';
import { useEffect, useState } from 'react';
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
import { useTransactionMachine } from '../../../_internal/transaction-machine/useTransactionMachine';
import {
	TransactionState,
	TransactionType,
} from '../../../_internal/transaction-machine/execute-transaction';

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
	const { collectionAddress, chainId, offerPrice, collectibleId } = state;
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
	const [isLoading, setIsLoading] = useState(false);
	const [transactionState, setTransactionState] =
		useState<TransactionState | null>(null);

	const machine = useTransactionMachine(
		{
			collectionAddress,
			chainId,
			collectibleId,
			type: TransactionType.OFFER,
		},
		(hash) => {
			console.log('Transaction hash', hash);
		},
		(error) => {
			console.error('Transaction error', error);
		},
		makeOfferModal$.close,
		(hash) => {
			console.log('Transaction sent', hash);
		},
	);

	const dateToUnixTime = (date: Date) =>
		Math.floor(date.getTime() / 1000).toString();

	const offer = {
		tokenId: collectibleId,
		quantity: makeOfferModal$.quantity.get(),
		expiry: dateToUnixTime(makeOfferModal$.expiry.get()),
		currencyAddress: offerPrice.currency.contractAddress,
		pricePerToken: offerPrice.amountRaw,
	};

	const currencyAddress = offerPrice.currency.contractAddress;

	// first loading steps
	useEffect(() => {
		if (!currencyAddress || !machine || transactionState?.steps.checked) return;

		machine
			.refreshStepsGetState({
				offer: offer,
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
	}, [currencyAddress, machine]);

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

	const handleStepExecution = async () => {
		await transactionState?.transaction.execute({
			type: TransactionType.OFFER,
			props: {
				offer: offer,
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
			label: 'Make offer',
			onClick: async () => await handleStepExecution(),
			pending:
				!transactionState ||
				isLoading ||
				transactionState.steps.checking ||
				transactionState.transaction.executing,
			disabled:
				!transactionState ||
				isLoading ||
				transactionState.steps.checking ||
				transactionState.transaction.executing ||
				insufficientBalance,
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
