import { useEffect, useState } from 'react';
import { useTransactionMachine } from '../_internal/transaction-machine/useTransactionMachine';
import {
	TransactionState,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import { ContractType, Price } from '../../types';

export default function useMakeOffer({
	closeModalFn,
	collectionAddress,
	chainId,
	collectibleId,
	offerPrice,
	collection,
	quantity,
	expiry,
}: {
	closeModalFn: () => void;
	collectionAddress: string;
	chainId: string;
	collectibleId: string;
	offerPrice: Price;
	collection: any;
	quantity: string;
	expiry: Date;
}) {
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
		closeModalFn,
		(hash) => {
			console.log('Transaction sent', hash);
		},
	);

	const dateToUnixTime = (date: Date) =>
		Math.floor(date.getTime() / 1000).toString();

	const offer = {
		tokenId: collectibleId,
		quantity,
		expiry: dateToUnixTime(expiry),
		currencyAddress: offerPrice.currency.contractAddress,
		pricePerToken: offerPrice.amountRaw,
	};

	const currencyAddress = offerPrice.currency.contractAddress;

	const approve = async () => {
		if (!transactionState?.approval.approve) return;

		await transactionState?.approval.approve();
	};

	const execute = async () => {
		await transactionState?.transaction.execute({
			type: TransactionType.OFFER,
			props: {
				offer: offer,
				contractType: collection?.type as ContractType,
			},
		});
	};

	function refreshStepsGetState() {
		if (!currencyAddress || !machine || offerPrice.amountRaw === '0') return;

		machine
			.refreshStepsGetState({
				type: TransactionType.OFFER,
				props: {
					contractType: collection?.type as ContractType,
					offer: offer,
				},
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
	}

	useEffect(() => {
		if (transactionState?.steps.checked) return;

		refreshStepsGetState();
	}, [currencyAddress, machine, offerPrice.amountRaw]);

	return {
		isLoading,
		transactionState,
		approve,
		execute,
	};
}
