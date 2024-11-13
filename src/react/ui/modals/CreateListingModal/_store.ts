import { collectableKeys, type CollectionType } from '@internal';
import { observable, when } from '@legendapp/state';
import { useMount, useSelector } from '@legendapp/state/react';
import { useCollectible } from '@react-hooks/useCollectible';
import { useCollection } from '@react-hooks/useCollection';
import { useGenerateListingTransaction } from '@react-hooks/useGenerateListingTransaction';
import {
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
import { useTransactionStatusModal } from '../_internal/components/transactionStatusModal';
import {
	getCreateListingTransactionMessage,
	getCreateListingTransactionTitle,
} from './_utils/getCreateListingTransactionTitleMessage';
import {
	BaseCallbacks,
	CreateListingCallbacks,
} from '../../../../types/callbacks';
import { QueryKey } from '@tanstack/react-query';

export interface CreateListingModalState {
	isOpen: boolean;
	open: (args: ShowCreateListingModalArgs) => void;
	close: () => void;
	state: {
		collectionName: string;
		collectionType: CollectionType | undefined;
		listingPrice: Price;
		quantity: string;
		collectionAddress: Hex;
		chainId: string;
		collectibleId: string;
		expiry: Date;
		callbacks?: CreateListingCallbacks;
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
	hash: Hex | undefined;
}

export const initialState: CreateListingModalState = {
	isOpen: false,
	open: ({
		collectionAddress,
		chainId,
		collectibleId,
		callbacks,
	}: ShowCreateListingModalArgs) => {
		createListingModal$.state.set({
			...createListingModal$.state.get(),
			collectionAddress,
			chainId,
			collectibleId,
			callbacks,
		});
		createListingModal$.isOpen.set(true);
	},
	close: () => {
		createListingModal$.isOpen.set(false);
	},
	state: {
		collectionName: '',
		listingPrice: {
			amountRaw: '0',
			currency: {} as Currency,
		},
		quantity: '1',
		expiry: new Date(addDays(new Date(), 7).toJSON()),
		collectionType: undefined,
		collectionAddress: '' as Hex,
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
	hash: undefined,
};

export const createListingModal$ = observable(initialState);

const exp = new Date(addDays(new Date(), 7).toJSON());

export const useHydrate = () => {
	const chainId = useSelector(createListingModal$.state.chainId);
	const collectionAddress = useSelector(
		createListingModal$.state.collectionAddress,
	);
	const collectionType = useSelector(createListingModal$.state.collectionType);
	const { data: collection, isSuccess: isSuccessCollection } = useCollection({
		chainId,
		collectionAddress,
	});

	when(isSuccessCollection, () => {
		createListingModal$.state.collectionName.set(collection!.name);
		createListingModal$.state.collectionType.set(
			collection!.type as CollectionType,
		);
	});

	useTokenApprovalHandler(chainId);
	useCreateListingHandler(chainId);
	useShowTransactionStatusModal();

	const onListingSuccess = (data?: Step[]) => {
		createListingModal$.steps.stepsData.set(data);
	};

	const { generateListingTransactionAsync } = useGenerateListingTransaction({
		chainId,
		onSuccess: onListingSuccess,
	});

	const { connector, address: userAddress } = useAccount();

	useMount(() => {
		const setSteps = async () => {
			const createListingTransactionSteps =
				await generateListingTransactionAsync({
					collectionAddress,
					orderbook: OrderbookKind.sequence_marketplace_v1,
					listing: {
						tokenId: '1',
						quantity: '1',
						expiry: exp,
						currencyAddress:
							createListingModal$.state.listingPrice.currency.contractAddress.get(),
						pricePerToken:
							createListingModal$.state.listingPrice.amountRaw.get() || '1',
					},
					contractType: collectionType!,
					walletType: connector?.id as WalletKind,
					owner: userAddress!,
				});

			createListingModal$.steps.stepsData.set(createListingTransactionSteps);
		};

		when(isSuccessCollection && collectionType, setSteps);
	});
};

const useTokenApprovalHandler = (chainId: string) => {
	const { sendTransactionAsync, isPending, isSuccess } = useSendTransaction();
	const { onUnknownError, onSuccess }: BaseCallbacks =
		createListingModal$.state.get().callbacks?.approveToken || {};

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

			try {
				sendTransactionAsync({
					to: step.to as Hex,
					chainId: Number(chainId),
					data: step.data as Hex,
					value: BigInt(step.value || '0'),
				});

				onSuccess && onSuccess();
			} catch (error) {
				onUnknownError && onUnknownError(error);
			}
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
	const { collectibleId, collectionAddress, callbacks } =
		createListingModal$.state.get();
	const { connector, address } = useAccount();
	const {
		generateListingTransactionAsync,
		isPending: generateListingTransactionPending,
	} = useGenerateListingTransaction({ chainId });
	const { data: collectible } = useCollectible({
		chainId,
		collectionAddress,
		collectibleId,
	});
	const { onUnknownError }: BaseCallbacks =
		createListingModal$.state.get().callbacks?.createListing || {};

	const { sendTransactionAsync, isPending: sendTransactionPending } =
		useSendTransaction();

	const { show: showTransactionStatusModal } = useTransactionStatusModal();

	createListingModal$.steps.createListing.set({
		pending:
			createListingModal$.steps._currentStep.get() === 'createListing' &&
			(generateListingTransactionPending || sendTransactionPending),
		execute: () => {
			createListingModal$.steps._currentStep.set('createListing');
			generateListingTransactionAsync({
				collectionAddress: createListingModal$.state.collectionAddress.get(),
				contractType: createListingModal$.state.collectionType.get()!,
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
				.then(async (steps) => {
					const step = steps.find((s) => s.id === StepType.createListing);
					if (!step) throw new Error('No steps found');
					const hash = await sendTransactionAsync({
						to: step.to as Hex,
						chainId: Number(chainId),
						data: step.data as Hex,
						value: BigInt(step.value || '0'),
					});

					createListingModal$.hash.set(hash);

					createListingModal$.steps._currentStep.set(null);

					createListingModal$.close();

					showTransactionStatusModal({
						hash: hash!,
						price: createListingModal$.state.listingPrice.get(),
						collectionAddress,
						chainId,
						tokenId: collectibleId,
						getTitle: getCreateListingTransactionTitle,
						getMessage: (params) =>
							getCreateListingTransactionMessage(
								params,
								collectible?.name || '',
							),
						type: 'transfer',
						callbacks: callbacks?.createListing,
						queriesToInvalidate: collectableKeys.all as unknown as QueryKey[],
					});
				})
				.catch((error) => {
					onUnknownError && onUnknownError(error);
				});
		},
	});
};

const useShowTransactionStatusModal = () => {
	const { hash } = createListingModal$.get();
	const { collectibleId, chainId, collectionAddress } =
		createListingModal$.state.get();
	const { data: collectible } = useCollectible({
		collectionAddress,
		chainId,
		collectibleId,
	});

	const { show: showTransactionStatusModal } = useTransactionStatusModal();

	when(!!hash, () => {
		showTransactionStatusModal({
			hash: hash!,
			collectionAddress,
			chainId,
			price: createListingModal$.state.listingPrice.get(),
			tokenId: collectibleId,
			getTitle: getCreateListingTransactionTitle,
			getMessage: (params) =>
				getCreateListingTransactionMessage(params, collectible?.name || ''),
			type: StepType.createListing,
		});
	});
};
