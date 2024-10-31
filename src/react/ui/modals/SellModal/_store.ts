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
import { ShowSellModalArgs } from '.';

export interface SellModalState {
	isOpen: boolean;
	open: (args: ShowSellModalArgs) => void;
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

export const initialState: SellModalState = {
	isOpen: false,
	open: ({
		collectionAddress,
		chainId,
		tokenId,
		order,
		messages,
	}: SellModalState['state']) => {
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
		switchChain: {} as SellModalState['steps']['switchChain'],
		tokenApproval: {} as SellModalState['steps']['tokenApproval'],
		sell: {} as SellModalState['steps']['sell'],
	},
};

export const sellModal$ = observable(initialState);

export const useHydrate = () => {
	const chainId = useSelector(sellModal$.state.chainId);

	const collectionAddress = useSelector(
		sellModal$.state.collectionAddress,
	);

	const order = useSelector(sellModal$.state.order);

	const { data: currencies, isSuccess: isSuccessCurrencies } = useCurrencies({
		chainId,
	});

	useSwitchChainHandler(chainId);
	useTokenApprovalHandler(chainId);
	useSellHandler(chainId);

	const isSuccess$ = observable(isSuccessCurrencies);

	const { generateSellTransaction } = useGenerateSellTransaction({
		onSuccess: sellModal$.state.messages?.sellCollectible?.onSuccess,
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
			mergeIntoObservable(sellModal$.state, state);
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
		sellModal$.steps.switchChain.assign({
			pending: isPending,
			isNeeded: () => currentChainId !== Number(chainId),
			execute: () => {
				sellModal$.steps._currentStep.set('switchChain');
				switchChain({ chainId: Number(chainId) });
			},
		});
	});

	if (isSuccess) {
		sellModal$.steps._currentStep.set(null);
	}
};

const useTokenApprovalHandler = (chainId: string) => {
	const { sendTransaction, isPending, isSuccess } = useSendTransaction();

	sellModal$.steps.tokenApproval.set({
		isNeeded: () => !!sellModal$.steps.tokenApproval.getStep(),
		getStep: () =>
			sellModal$.steps.stepsData
				?.get()
				?.find((s) => s.id === StepType.tokenApproval),
		pending:
			sellModal$.steps._currentStep.get() === 'tokenApproval' &&
			isPending,
		execute: () => {
			const step = sellModal$.steps.tokenApproval.getStep();
			if (!step) return;
			sellModal$.steps._currentStep.set('tokenApproval');
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
		sellModal$.steps._currentStep.get() === 'tokenApproval'
	) {
		sellModal$.steps._currentStep.set(null);
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

	sellModal$.steps.sell.set({
		pending:
			sellModal$.steps._currentStep.get() === 'sell' &&
			(generateOfferTransactionPending || sendTransactionPending),
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
				})
				.catch(() => {
					sellModal$.state.messages?.sellCollectible?.onUnknownError?.();
				});
		},
	});

	if (generateOfferTransactionError) {
		sellModal$.state.messages?.sellCollectible?.onUnknownError?.();
	}
};
