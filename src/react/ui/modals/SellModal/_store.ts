import { observable, when } from '@legendapp/state';
import {
	MarketplaceKind,
	StepType,
	type Order,
	type Step,
	type WalletKind,
} from '@types';
import { useMount, useSelector } from '@legendapp/state/react';
import { useGenerateSellTransaction } from '@react-hooks/useGenerateSellTransaction';
import { useAccount, useSendTransaction } from 'wagmi';
import { Hex } from 'viem';
import { ShowSellModalArgs } from '.';
import { Messages } from '../../../../types/messages';

export interface SellModalState {
	isOpen: boolean;
	open: (args: ShowSellModalArgs) => void;
	close: () => void;
	state: {
		collectionAddress: string;
		chainId: string;
		tokenId: string;
		order: Order | undefined;
		messages?: Messages;
	};
	steps: {
		isLoading: () => boolean;
		stepsData: Step[] | undefined;
		_currentStep: null | 'tokenApproval' | 'sell';
		tokenApproval: {
			isNeeded: () => boolean;
			pending: boolean;
			getStep: () => Step | undefined;
			execute: () => void;
		};
		sell: {
			pending: boolean;
			execute: () => void;
		};
	};
}

export const initialState: SellModalState = {
	isOpen: false,
	open: ({
		collectionAddress,
		chainId,
		tokenId,
		order,
		messages,
	}: ShowSellModalArgs) => {
		sellModal$.state.set({
			...sellModal$.state.get(),
			collectionAddress,
			chainId,
			tokenId,
			order,
			messages,
		});
		sellModal$.isOpen.set(true);
	},
	close: () => {
		sellModal$.isOpen.set(false);
		sellModal$.state.set({
			...initialState.state,
		});
	},
	state: {
		collectionAddress: '',
		chainId: '',
		tokenId: '',
		order: undefined,
	},
	steps: {
		isLoading: () => !!sellModal$.steps.stepsData.get(),
		stepsData: undefined,
		_currentStep: null,
		tokenApproval: {} as SellModalState['steps']['tokenApproval'],
		sell: {} as SellModalState['steps']['sell'],
	},
};

export const sellModal$ = observable(initialState);

export const useHydrate = () => {
	const chainId = useSelector(sellModal$.state.chainId);

	const collectionAddress = useSelector(sellModal$.state.collectionAddress);

	const order = useSelector(sellModal$.state.order);

	useTokenApprovalHandler(chainId);
	useSellHandler(chainId);

	const { generateSellTransactionAsync } = useGenerateSellTransaction({
		chainId,
	});

	const { connector } = useAccount();

	useMount(() => {
		const setSteps = async () => {
			const sellTransactionData = await generateSellTransactionAsync({
				walletType: connector?.walletType as WalletKind,
				collectionAddress: collectionAddress,
				buyer: order!.createdBy,
				marketplace: MarketplaceKind.sequence_marketplace_v1,
				ordersData: [
					{
						...order!,
						orderId: order!.orderId,
						quantity: '1',
					},
				],
				additionalFees: [],
			});
			sellModal$.steps.stepsData.set(sellTransactionData.steps);
		};

		when(() => !!order && !!connector, setSteps);
	});
};

const useTokenApprovalHandler = (chainId: string) => {
	const { sendTransactionAsync, isPending, isSuccess } = useSendTransaction();
	const {
		onUnknownError,
		onSuccess,
	}: { onUnknownError?: Function; onSuccess?: Function } =
		sellModal$.state.get().messages?.approveToken || {};

	sellModal$.steps.tokenApproval.set({
		isNeeded: () => !!sellModal$.steps.tokenApproval.getStep(),
		getStep: () =>
			sellModal$.steps.stepsData
				?.get()
				?.find((s) => s.id === StepType.tokenApproval),
		pending:
			sellModal$.steps._currentStep.get() === 'tokenApproval' && isPending,
		execute: async () => {
			const step = sellModal$.steps.tokenApproval.getStep();
			if (!step) return;
			sellModal$.steps._currentStep.set('tokenApproval');
			try {
				await sendTransactionAsync({
					to: step.to as Hex,
					chainId: Number(chainId),
					data: step.data as Hex,
					value: BigInt(step.value || '0'),
				});
				onSuccess && onSuccess();
			} catch (error) {
				onUnknownError && onUnknownError();
			}
		},
	});

	if (isSuccess && sellModal$.steps._currentStep.get() === 'tokenApproval') {
		sellModal$.steps._currentStep.set(null);
	}
};

const useSellHandler = (chainId: string) => {
	const {
		generateSellTransactionAsync,
		isPending: generateSellTransactionPending,
		error: generateSellTransactionError,
	} = useGenerateSellTransaction({
		chainId,
	});
	const {
		onUnknownError,
		onSuccess,
	}: { onUnknownError?: Function; onSuccess?: Function } =
		sellModal$.state.get().messages?.sellCollectible || {};

	const { sendTransaction, isPending: sendTransactionPending } =
		useSendTransaction();

	sellModal$.steps.sell.set({
		pending:
			sellModal$.steps._currentStep.get() === 'sell' &&
			(generateSellTransactionPending || sendTransactionPending),
		execute: () => {
			sellModal$.steps._currentStep.set('sell');
			const { collectionAddress, order } = sellModal$.state.get();
			generateSellTransactionAsync({
				collectionAddress: collectionAddress,
				buyer: order!.createdBy,
				marketplace: order!.marketplace,
				ordersData: [
					{
						...order!,
						quantity: '1',
					},
				],
				additionalFees: [
					{
						amount: String(order!.feeBps),
						receiver: order!.feeBreakdown[0].recipientAddress,
					},
				],
			})
				.then((response) => {
					const step = response.steps.find((s) => s.id === StepType.sell);
					if (!step) throw new Error('No steps found');
					sendTransaction({
						to: step.to as Hex,
						chainId: Number(chainId),
						data: step.data as Hex,
						value: BigInt(step.value || '0'),
					});
					onSuccess && onSuccess();
				})
				.catch(() => {
					onUnknownError && onUnknownError();
				});
		},
	});

	if (generateSellTransactionError) {
		sellModal$.state.messages?.sellCollectible?.onUnknownError?.();
	}
};
