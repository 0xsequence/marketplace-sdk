import { mergeIntoObservable, observable, when } from '@legendapp/state';
import { useMount, useSelector } from '@legendapp/state/react';
import { useCollection } from '@react-hooks/useCollection';
import { useCurrencies } from '@react-hooks/useCurrencies';
import { useGenerateListingTransaction } from '@react-hooks/useGenerateListingTransaction';
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
import type { ShowCreateListingModalArgs } from '.';
import { Messages } from '../../../../types/messages';

export interface CreateListingModalState {
	isOpen: boolean;
	open: (args: ShowCreateListingModalArgs) => void;
	close: () => void;
	onError: (error: Error) => void;
	state: {
		collectionName: string;
		collectionType: ContractType;
		listingPrice: Price;
		quantity: string;
		collectionAddress: string;
		chainId: string;
		collectibleId: string;
		expiry: Date;
		messages?: Messages;
	};
	steps: {
		isLoading: () => boolean;
		stepsData: Step[] | undefined;
		_currentStep: null | 'tokenApproval' | 'createListing';
		tokenApproval: {
			isNeeded: () => boolean;
			pending: boolean;
			getStep: () => Step | undefined;
			execute: () => void;
		};
		createListing: {
			pending: boolean;
			execute: () => void;
		};
	};
}

export const initialState: CreateListingModalState = {
	isOpen: false,
	open: ({
		collectionAddress,
		chainId,
		collectibleId,
		messages,
	}: ShowCreateListingModalArgs) => {
		createListingModal$.state.set({
			...createListingModal$.state.get(),
			collectionAddress,
			chainId,
			collectibleId,
			messages,
		});
		createListingModal$.isOpen.set(true);
	},
	close: () => {
		createListingModal$.isOpen.set(false);
	},
	onError: () => {},
	state: {
		collectionName: '',
		listingPrice: {
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
		isLoading: () => !!createListingModal$.steps.stepsData.get(),
		stepsData: undefined,
		_currentStep: null,
		tokenApproval: {} as CreateListingModalState['steps']['tokenApproval'],
		createListing: {} as CreateListingModalState['steps']['createListing'],
	},
};

export const createListingModal$ = observable(initialState);

const exp = new Date(addDays(new Date(), 7).toJSON());

export const useHydrate = () => {
	const chainId = useSelector(createListingModal$.state.chainId);

	const collectionAddress = useSelector(
		createListingModal$.state.collectionAddress,
	);

	const { data: collection, isSuccess: isSuccessCollection } = useCollection({
		chainId,
		collectionAddress,
	});

	const { data: currencies, isSuccess: isSuccessCurrencies } = useCurrencies({
		chainId,
		collectionAddress,
	});

	useTokenApprovalHandler(chainId);
	useCreateListingHandler(chainId);

	const isSuccess$ = observable(isSuccessCollection && isSuccessCurrencies);

	const onListingSuccess = (data?: Step[]) => {
		createListingModal$.steps.stepsData.set(data);
	};

	const { generateListingTransaction } = useGenerateListingTransaction({
		chainId,
		onSuccess: onListingSuccess,
	});

	const { connector, address: userAddress } = useAccount();

	useMount(() => {
		const setState = () => {
			const state = {
				collectionName: collection?.name || '',
				collectionType: collection?.type as ContractType,
				listingPrice: {
					amountRaw: '0',
					currency: currencies?.[0] || ({} as Currency),
				},
			};
			mergeIntoObservable(createListingModal$.state, state);
			generateListingTransaction({
				collectionAddress,
				orderbook: OrderbookKind.sequence_marketplace_v1,
				listing: {
					tokenId: '1',
					quantity: '1',
					expiry: exp,
					currencyAddress: state.listingPrice.currency.contractAddress,
					pricePerToken: state.listingPrice.amountRaw || '1',
				},
				contractType: collection?.type as ContractType,
				walletType: connector?.id as WalletKind,
				owner: userAddress!,
			});
		};

		when(isSuccess$.get(), setState);
	});
};

const useTokenApprovalHandler = (chainId: string) => {
	const { sendTransaction, isPending, isSuccess } = useSendTransaction();

	createListingModal$.steps.tokenApproval.set({
		isNeeded: () => !!createListingModal$.steps.tokenApproval.getStep(),
		getStep: () =>
			createListingModal$.steps.stepsData
				?.get()
				?.find((s) => s.id === StepType.tokenApproval),
		pending:
			createListingModal$.steps._currentStep.get() === 'tokenApproval' &&
			isPending,
		execute: () => {
			const step = createListingModal$.steps.tokenApproval.getStep();
			if (!step) return;
			createListingModal$.steps._currentStep.set('tokenApproval');
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
		createListingModal$.steps._currentStep.get() === 'tokenApproval'
	) {
		createListingModal$.steps._currentStep.set(null);
	}
};

const useCreateListingHandler = (chainId: string) => {
	const { connector, address } = useAccount();
	const {
		generateListingTransactionAsync,
		isPending: generateListingTransactionPending,
		error: generateListingTransactionError,
	} = useGenerateListingTransaction({ chainId });

	const { sendTransaction, isPending: sendTransactionPending } =
		useSendTransaction();

	createListingModal$.steps.createListing.set({
		pending:
			createListingModal$.steps._currentStep.get() === 'createListing' &&
			(generateListingTransactionPending || sendTransactionPending),
		execute: () => {
			createListingModal$.steps._currentStep.set('createListing');
			generateListingTransactionAsync({
				collectionAddress: createListingModal$.state.collectionAddress.get(),
				contractType: createListingModal$.state.collectionType.get(),
				orderbook: OrderbookKind.sequence_marketplace_v1,
				walletType: connector?.id as WalletKind,
				listing: {
					tokenId: createListingModal$.state.collectibleId.get(),
					quantity: createListingModal$.state.quantity.get(),
					expiry: createListingModal$.state.expiry.get(),
					currencyAddress:
						createListingModal$.state.listingPrice.currency.contractAddress.get(),
					pricePerToken:
						createListingModal$.state.listingPrice.amountRaw.get() || '1',
				},
				owner: address!,
			})
				.then((steps) => {
					const step = steps.find((s) => s.id === StepType.createListing);
					if (!step) throw new Error('No steps found');
					sendTransaction({
						to: step.to as Hex,
						chainId: Number(chainId),
						data: step.data as Hex,
						value: BigInt(step.value || '0'),
					});
				})
				.catch((e) => {
					createListingModal$.onError(e as Error);
				});
		},
	});

	if (generateListingTransactionError) {
		createListingModal$.onError(generateListingTransactionError);
	}
};
