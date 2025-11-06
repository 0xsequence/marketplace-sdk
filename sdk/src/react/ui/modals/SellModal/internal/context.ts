import { useWaasFeeOptions } from '@0xsequence/connect';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import type {
	FeeOptionExtended,
	WaasFeeOptionConfirmation,
} from '../../../../../types/waas-types';
import {
	useCollectionDetail,
	useConnectorMetadata,
	useCurrency,
} from '../../../../hooks';
import { useSellMutations } from './sell-mutations';
import { useSellModalState } from './store';
import { useGenerateSellTransaction } from './use-generate-sell-transaction';

export type WaasFee = {
	feeOptionConfirmation: WaasFeeOptionConfirmation;
	selectedOption: FeeOptionExtended;
	optionConfirmed: boolean;
	setSelectedFeeOption: (option: FeeOptionExtended) => void;
	setOptionConfirmed: (confirmed: boolean) => void;
};

export type SellStepId = 'approve' | 'sell';
export type Step = {
	id: SellStepId;
	label: string;
	status: string;
	waasFee: WaasFee;
	isPending: boolean;
	isSuccess: boolean;
	isError: boolean;
	run: () => Promise<void>;
};

export type SellStep = Step & { id: 'sell' };

export type SellSteps = [...Step[], SellStep];

export function useSellModalContext() {
	const state = useSellModalState();
	const { address } = useAccount();
	const [selectedFeeOption, setSelectedFeeOption] = useState<
		FeeOptionExtended | undefined
	>(undefined);
	const [optionConfirmed, setOptionConfirmed] = useState(false);
	const [feeOptionConfirmation, confirmFeeOption, rejectFeeOption] =
		useWaasFeeOptions();

	useEffect(() => {
		const options = feeOptionConfirmation?.options as FeeOptionExtended[];
		const firstOptionWithBalance =
			options && options.length > 0
				? options.find((o) => o.hasEnoughBalanceForFee)
				: undefined;
		const noBalanceForAnyOption =
			options &&
			options.length > 0 &&
			options.every((o) => !o.hasEnoughBalanceForFee);

		if (firstOptionWithBalance) {
			setSelectedFeeOption(firstOptionWithBalance);
		}
		if (!noBalanceForAnyOption && options && options.length > 0) {
			setSelectedFeeOption(options[0]);
		}
	}, [feeOptionConfirmation]);

	const collectionQuery = useCollectionDetail({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		query: {
			enabled: !!state.isOpen,
		},
	});
	const currencyQuery = useCurrency({
		chainId: state.chainId,
		currencyAddress: state.currencyAddress,
		query: {
			enabled: !!state.isOpen,
		},
	});

	const { walletKind } = useConnectorMetadata();

	const sellSteps = useGenerateSellTransaction({
		chainId: state.chainId,
		collectionAddress: state.collectionAddress,
		seller: address,
		marketplace: state.order?.marketplace,
		walletType: walletKind,
		ordersData: state.order
			? [
					{
						orderId: state.order.orderId,
						quantity: state.order.quantityRemaining,
						tokenId: state.tokenId,
					},
				]
			: undefined,
	});

	const { approve, sell } = useSellMutations(sellSteps.data);

	const steps = [];

	// Approval step (if needed)
	if (sellSteps.data?.approveStep && !approve.isSuccess) {
		steps.push({
			id: 'approve' satisfies SellStepId,
			label: 'Approve Token',
			status: approve.status,
			isPending: approve.isPending,
			isSuccess: approve.isSuccess,
			isError: !!approve.error,
			waasFee: {
				feeOptionConfirmation: feeOptionConfirmation,
				selectedOption: selectedFeeOption,
				optionConfirmed: optionConfirmed,
				setSelectedFeeOption: setSelectedFeeOption,
				confirmFeeOption: confirmFeeOption,
				rejectFeeOption: rejectFeeOption,
				setOptionConfirmed: setOptionConfirmed,
			},
			run: () => approve.mutate(),
		});
	}

	// Sell step
	// TODO: sell step never completes here, it completes via the success callback, we need to change this
	steps.push({
		id: 'sell' satisfies SellStepId,
		label: 'Accept Offer',
		status: sell.status,
		isPending: sell.isPending,
		isSuccess: sell.isSuccess,
		isError: !!sell.error,
		waasFee: {
			feeOptionConfirmation: feeOptionConfirmation,
			selectedOption: selectedFeeOption,
			optionConfirmed: optionConfirmed,
			setSelectedFeeOption: setSelectedFeeOption,
			confirmFeeOption: confirmFeeOption,
			rejectFeeOption: rejectFeeOption,
			setOptionConfirmed: setOptionConfirmed,
		},
		run: () => sell.mutate(),
	});

	const nextStep = steps.find((step) => step.status === 'idle');

	const isPending = approve.isPending || sell.isPending || sellSteps.isLoading;
	const hasError = !!(
		approve.error ||
		sell.error ||
		sellSteps.error ||
		collectionQuery.error ||
		currencyQuery.error
	);

	const totalSteps = steps.length;
	const completedSteps = steps.filter((s) => s.isSuccess).length;
	const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

	const flowStatus: 'idle' | 'pending' | 'success' | 'error' = isPending
		? 'pending'
		: hasError
			? 'error'
			: completedSteps === totalSteps
				? 'success'
				: 'idle';

	const error =
		approve.error ||
		sell.error ||
		sellSteps.error ||
		collectionQuery.error ||
		currencyQuery.error;

	const handleClose = () => {
		if (selectedFeeOption) {
			setSelectedFeeOption(undefined);
			setOptionConfirmed(false);
		}

		if (feeOptionConfirmation?.id) {
			rejectFeeOption(feeOptionConfirmation.id);
		}

		state.closeModal();

		sell.reset();
		approve.reset();
	};

	return {
		isOpen: state.isOpen,
		close: handleClose,

		tokenId: state.tokenId,
		collectionAddress: state.collectionAddress,
		chainId: state.chainId,
		collection: collectionQuery.data,
		offer: {
			order: state.order,
			currency: currencyQuery.data,
			priceAmount: state.order?.priceAmount,
		},

		flow: {
			steps,
			nextStep,
			status: flowStatus,
			isPending,
			totalSteps,
			completedSteps,
			progress,
		},

		loading: {
			collection: collectionQuery.isLoading,
			currency: currencyQuery.isLoading,
			steps: sellSteps.isLoading,
		},

		transactions: {
			approve:
				approve.data?.type === 'transaction' ? approve.data.hash : undefined,
			sell: sell.data?.type === 'transaction' ? sell.data.hash : undefined,
		},

		error,
		queries: {
			collection: collectionQuery,
			currency: currencyQuery,
		},
	};
}

export type SellModalContext = ReturnType<typeof useSellModalContext>;
