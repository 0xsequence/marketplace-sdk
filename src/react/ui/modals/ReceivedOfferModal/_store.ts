import {
	ApproveTokenMessageCallbacks,
	SellCollectibleMessageCallbacks,
	SwitchNetworkMessageCallbacks,
} from '@internal';
import { mergeIntoObservable, observable, when } from '@legendapp/state';
import {
	MarketplaceKind,
	StepType,
	type Order,
	type Price,
	type Step,
	type WalletKind,
} from '@types';
import { useMount, useSelector } from '@legendapp/state/react';
import { useCurrencies } from '@react-hooks/useCurrencies';
import { useGenerateSellTransaction } from '@react-hooks/useGenerateSellTransaction';
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi';
import { Hex } from 'viem';
import { ShowReceivedOfferModalArgs } from '.';

export interface ReceivedOfferModalState {
	isOpen: boolean;
	open: (args: ShowReceivedOfferModalArgs) => void;
	close: () => void;
	state: {
		collectionAddress: string;
		chainId: string;
		tokenId: string;
		order: Order | undefined;
		messages?: {
			approveToken?: ApproveTokenMessageCallbacks;
			sellCollectible?: SellCollectibleMessageCallbacks;
			switchNetwork?: SwitchNetworkMessageCallbacks;
		};
	};
	steps: {
		isLoading: () => boolean;
		stepsData: Step[] | undefined;
		_currentStep: null | 'switchChain' | 'tokenApproval' | 'sell';
		switchChain: {
			pending: boolean;
			isNeeded: () => boolean;
			execute: () => void;
		};
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

export const initialState: ReceivedOfferModalState = {
	isOpen: false,
	open: ({
		collectionAddress,
		chainId,
		tokenId,
		order,
		messages,
	}: ReceivedOfferModalState['state']) => {
		receivedOfferModal$.state.set({
			...receivedOfferModal$.state.get(),
			collectionAddress,
			chainId,
			tokenId,
			order,
			messages,
		});
		receivedOfferModal$.isOpen.set(true);
	},
	close: () => {
		receivedOfferModal$.isOpen.set(false);
		receivedOfferModal$.state.set({
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
		isLoading: () => !!receivedOfferModal$.steps.stepsData.get(),
		stepsData: undefined,
		_currentStep: null,
		switchChain: {} as ReceivedOfferModalState['steps']['switchChain'],
		tokenApproval: {} as ReceivedOfferModalState['steps']['tokenApproval'],
		sell: {} as ReceivedOfferModalState['steps']['sell'],
	},
};

export const receivedOfferModal$ = observable(initialState);

export const useHydrate = () => {
	const chainId = useSelector(receivedOfferModal$.state.chainId);

	const collectionAddress = useSelector(
		receivedOfferModal$.state.collectionAddress,
	);

	const order = useSelector(receivedOfferModal$.state.order);

	const { data: currencies, isSuccess: isSuccessCurrencies } = useCurrencies({
		chainId,
	});

	useSwitchChainHandler(chainId);
	useTokenApprovalHandler(chainId);
	useSellHandler(chainId);

	const isSuccess$ = observable(isSuccessCurrencies);

	const { generateSellTransaction } = useGenerateSellTransaction({
		onSuccess: receivedOfferModal$.state.messages?.sellCollectible?.onSuccess,
		chainId,
	});

	const { connector } = useAccount();

	useMount(() => {
		const setState = () => {
			const state = {
				collectionAddress,
				order,
				price: {
					amountRaw: order?.priceAmount,
					currency: currencies?.find(
						(c) => c.contractAddress === order?.priceCurrencyAddress,
					),
				} as Price,
			};
			mergeIntoObservable(receivedOfferModal$.state, state);
			generateSellTransaction({
				walletType: connector?.walletType as WalletKind,
				collectionAddress: state.collectionAddress,
				buyer: state.order?.createdBy || '',
				marketplace: MarketplaceKind.sequence_marketplace_v1,
				ordersData: [
					{
						...state.order,
						orderId: state.order?.orderId || '',
						quantity: '1',
					},
				],
				additionalFees: [],
			});
		};

		when(isSuccess$.get(), setState);
	});
};

const useSwitchChainHandler = (chainId: string) => {
	const { switchChain, isPending, isSuccess } = useSwitchChain();
	const { chainId: currentChainId } = useAccount();

	useMount(() => {
		receivedOfferModal$.steps.switchChain.assign({
			pending: isPending,
			isNeeded: () => currentChainId !== Number(chainId),
			execute: () => {
				receivedOfferModal$.steps._currentStep.set('switchChain');
				switchChain({ chainId: Number(chainId) });
			},
		});
	});

	if (isSuccess) {
		receivedOfferModal$.steps._currentStep.set(null);
	}
};

const useTokenApprovalHandler = (chainId: string) => {
	const { sendTransaction, isPending, isSuccess } = useSendTransaction();

	receivedOfferModal$.steps.tokenApproval.set({
		isNeeded: () => !!receivedOfferModal$.steps.tokenApproval.getStep(),
		getStep: () =>
			receivedOfferModal$.steps.stepsData
				?.get()
				?.find((s) => s.id === StepType.tokenApproval),
		pending:
			receivedOfferModal$.steps._currentStep.get() === 'tokenApproval' &&
			isPending,
		execute: () => {
			const step = receivedOfferModal$.steps.tokenApproval.getStep();
			if (!step) return;
			receivedOfferModal$.steps._currentStep.set('tokenApproval');
			sendTransaction({
				to: step.to as Hex,
				chainId: Number(chainId),
				data: step.data as Hex,
				value: BigInt(step.value || '0'),
			});
		},
	});

	if (
		isSuccess &&
		receivedOfferModal$.steps._currentStep.get() === 'tokenApproval'
	) {
		receivedOfferModal$.steps._currentStep.set(null);
	}
};

const useSellHandler = (chainId: string) => {
	const {
		generateSellTransactionAsync,
		isPending: generateOfferTransactionPending,
		error: generateOfferTransactionError,
	} = useGenerateSellTransaction({
		chainId,
	});

	const { sendTransaction, isPending: sendTransactionPending } =
		useSendTransaction();

	receivedOfferModal$.steps.sell.set({
		pending:
			receivedOfferModal$.steps._currentStep.get() === 'sell' &&
			(generateOfferTransactionPending || sendTransactionPending),
		execute: () => {
			receivedOfferModal$.steps._currentStep.set('sell');
			const { collectionAddress, order } = receivedOfferModal$.state.get();
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
				})
				.catch(() => {
					receivedOfferModal$.state.messages?.sellCollectible?.onUnknownError?.();
				});
		},
	});

	if (generateOfferTransactionError) {
		receivedOfferModal$.state.messages?.sellCollectible?.onUnknownError?.();
	}
};
