import { mergeIntoObservable, observable, when } from '@legendapp/state';
import { useMount, useSelector } from '@legendapp/state/react';
import { useCollection } from '@react-hooks/useCollection';
import { useCurrencies } from '@react-hooks/useCurrencies';
import { useGenerateOfferTransaction } from '@react-hooks/useGenerateOfferTransaction';
import {
	ContractType,
	type Currency,
	OrderbookKind,
	type Price,
	type Step,
	StepType,
	type WalletKind,
} from '@types';
import { addDays } from 'date-fns/addDays';
import type { Hex } from 'viem';
import { useAccount, useSendTransaction } from 'wagmi';
import type { ShowMakeOfferModalArgs } from '.';
import { useSwitchChainModal } from '../_internal/components/switchChainModal';
import {
	ApproveTokenMessageCallbacks,
	SellCollectibleMessageCallbacks,
	SwitchChainMessageCallbacks,
} from '@internal';

export interface MakeOfferModalState {
	isOpen: boolean;
	open: (args: ShowMakeOfferModalArgs) => void;
	close: () => void;
	onError: (error: Error) => void;
	state: {
		collectionName: string;
		collectionType: ContractType;
		offerPrice: Price;
		quantity: string;
		collectionAddress: string;
		chainId: string;
		collectibleId: string;
		expiry: Date;
		messages?: {
			approveToken?: ApproveTokenMessageCallbacks;
			sellCollectible?: SellCollectibleMessageCallbacks;
			switchChain?: SwitchChainMessageCallbacks;
		};
	};
	steps: {
		isLoading: () => boolean;
		stepsData: Step[] | undefined;
		_currentStep: null | 'switchChain' | 'tokenApproval' | 'createOffer';
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
		createOffer: {
			pending: boolean;
			execute: () => void;
		};
	};
}

export const initialState: MakeOfferModalState = {
	isOpen: false,
	open: ({
		collectionAddress,
		chainId,
		collectibleId,
	}: ShowMakeOfferModalArgs) => {
		makeOfferModal$.state.set({
			...makeOfferModal$.state.get(),
			collectionAddress,
			chainId,
			collectibleId,
		});
		makeOfferModal$.isOpen.set(true);
	},
	close: () => {
		makeOfferModal$.isOpen.set(false);
	},
	onError: () => {},
	state: {
		collectionName: '',
		offerPrice: {
			amountRaw: '0',
			currency: {} as Currency,
		},
		quantity: '1',
		expiry: new Date(addDays(new Date(), 7).toJSON()),
		collectionType: ContractType.UNKNOWN,
		collectionAddress: '',
		chainId: '',
		collectibleId: '',
	},
	steps: {
		isLoading: () => !!makeOfferModal$.steps.stepsData.get(),
		stepsData: undefined,
		_currentStep: null,
		switchChain: {} as MakeOfferModalState['steps']['switchChain'],
		tokenApproval: {} as MakeOfferModalState['steps']['tokenApproval'],
		createOffer: {} as MakeOfferModalState['steps']['createOffer'],
	},
};

export const makeOfferModal$ = observable(initialState);

const exp = new Date(addDays(new Date(), 7).toJSON());

export const useHydrate = () => {
	const chainId = useSelector(makeOfferModal$.state.chainId);

	const collectionAddress = useSelector(
		makeOfferModal$.state.collectionAddress,
	);

	const { data: collection, isSuccess: isSuccessCollection } = useCollection({
		chainId,
		collectionAddress,
	});

	const { data: currencies, isSuccess: isSuccessCurrencies } = useCurrencies({
		chainId,
		collectionAddress,
	});

	useSwitchChainHandler(chainId);
	useTokenApprovalHandler(chainId);
	useCreateOfferHandler(chainId);

	const isSuccess$ = observable(isSuccessCollection && isSuccessCurrencies);

	const onOfferSuccess = (data?: Step[]) => {
		makeOfferModal$.steps.stepsData.set(data);
	};

	const { generateOfferTransaction } = useGenerateOfferTransaction({
		chainId,
		onSuccess: onOfferSuccess,
	});

	const { connector, address: userAddress } = useAccount();

	useMount(() => {
		const setState = () => {
			const state = {
				collectionName: collection?.name || '',
				collectionType: collection?.type as ContractType,
				offerPrice: {
					amountRaw: '0',
					currency: currencies?.[0] || ({} as Currency),
				},
			};
			mergeIntoObservable(makeOfferModal$.state, state);
			generateOfferTransaction({
				collectionAddress,
				orderbook: OrderbookKind.sequence_marketplace_v1,
				offer: {
					tokenId: '1',
					quantity: '1',
					expiry: exp,
					currencyAddress: state.offerPrice.currency.contractAddress,
					pricePerToken: state.offerPrice.amountRaw || '1',
				},
				maker: userAddress!,
				contractType: collection?.type as ContractType,
				walletType: connector?.id as WalletKind,
			});
		};

		when(isSuccess$.get(), setState);
	});
};

const useSwitchChainHandler = (chainId: string) => {
	const { show, isSwitching$ } = useSwitchChainModal();
	const { chainId: currentChainId } = useAccount();

	useMount(() => {
		makeOfferModal$.steps.switchChain.assign({
			pending: isSwitching$.get(),
			isNeeded: () => currentChainId !== Number(chainId),
			execute: () => {
				makeOfferModal$.steps._currentStep.set('switchChain');
				show({
					chainIdToSwitchTo: Number(chainId),
					onSwitchChain: () => {
						makeOfferModal$.steps._currentStep.set(null);
					},
				});
			},
		});
	});
};

const useTokenApprovalHandler = (chainId: string) => {
	const { sendTransaction, isPending, isSuccess } = useSendTransaction();

	makeOfferModal$.steps.tokenApproval.set({
		isNeeded: () => !!makeOfferModal$.steps.tokenApproval.getStep(),
		getStep: () =>
			makeOfferModal$.steps.stepsData
				?.get()
				?.find((s) => s.id === StepType.tokenApproval),
		pending:
			makeOfferModal$.steps._currentStep.get() === 'tokenApproval' && isPending,
		execute: () => {
			const step = makeOfferModal$.steps.tokenApproval.getStep();
			if (!step) return;
			makeOfferModal$.steps._currentStep.set('tokenApproval');
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
		makeOfferModal$.steps._currentStep.get() === 'tokenApproval'
	) {
		makeOfferModal$.steps._currentStep.set(null);
	}
};

const useCreateOfferHandler = (chainId: string) => {
	const { connector, address } = useAccount();
	const {
		generateOfferTransactionAsync,
		isPending: generateOfferTransactionPending,
		error: generateOfferTransactionError,
	} = useGenerateOfferTransaction({ chainId });

	const { sendTransaction, isPending: sendTransactionPending } =
		useSendTransaction();

	makeOfferModal$.steps.createOffer.set({
		pending:
			makeOfferModal$.steps._currentStep.get() === 'createOffer' &&
			(generateOfferTransactionPending || sendTransactionPending),
		execute: () => {
			makeOfferModal$.steps._currentStep.set('createOffer');
			generateOfferTransactionAsync({
				collectionAddress: makeOfferModal$.state.collectionAddress.get(),
				maker: address!,
				contractType: makeOfferModal$.state.collectionType.get(),
				orderbook: OrderbookKind.sequence_marketplace_v1,
				walletType: connector?.id as WalletKind,
				offer: {
					tokenId: makeOfferModal$.state.collectibleId.get(),
					quantity: makeOfferModal$.state.quantity.get(),
					expiry: makeOfferModal$.state.expiry.get(),
					currencyAddress:
						makeOfferModal$.state.offerPrice.currency.contractAddress.get(),
					pricePerToken:
						makeOfferModal$.state.offerPrice.amountRaw.get() || '1',
				},
			})
				.then((steps) => {
					const step = steps.find((s) => s.id === StepType.createOffer);
					if (!step) throw new Error('No steps found');
					sendTransaction({
						to: step.to as Hex,
						chainId: Number(chainId),
						data: step.data as Hex,
						value: BigInt(step.value || '0'),
					});
				})
				.catch((e) => {
					makeOfferModal$.onError(e as Error);
				});
		},
	});

	if (generateOfferTransactionError) {
		makeOfferModal$.onError(generateOfferTransactionError);
	}
};
