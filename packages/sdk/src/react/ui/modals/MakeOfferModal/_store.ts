import { observable } from '@legendapp/state';
import { addDays } from 'date-fns/addDays';
import type { Hash, Hex } from 'viem';
import type { Currency, Price } from '../../../../types';

const initialState = {
  isOpen: false,
  collectionAddress: '' as Hex,
  chainId: '',
  collectibleId: '',
  collectionName: '',
  collectionType: undefined,
  offerPrice: {
    amountRaw: '0',
    currency: {} as Currency,
  } satisfies Price,
  quantity: '1',
  expiry: new Date(addDays(new Date(), 7).toJSON()),

  onError: undefined as undefined | ((error: Error) => void),
  onSuccess: undefined as undefined | ((hash: Hash) => void),

  open: (args: {
    collectionAddress: Hex;
    chainId: string;
    collectibleId: string;
    onSuccess?: (hash?: Hash) => void;
    onError?: (error: Error) => void;
  }) => {
    makeOfferModal$.collectionAddress.set(args.collectionAddress);
    makeOfferModal$.chainId.set(args.chainId);
    makeOfferModal$.collectibleId.set(args.collectibleId);
    makeOfferModal$.onSuccess.set(args.onSuccess);
    makeOfferModal$.onError.set(args.onError);
    makeOfferModal$.isOpen.set(true);
  },
  close: () => {
    makeOfferModal$.isOpen.set(false);
  },
};

export const makeOfferModal$ = observable(initialState);

import { useMount, useSelector } from '@legendapp/state/react';
import type { QueryKey } from '@tanstack/react-query';
import type { Hex } from 'viem';
import { useAccount, useSendTransaction } from 'wagmi';
import type { ShowMakeOfferModalArgs } from '.';
import {
	MakeOfferErrorCallbacks,
	MakeOfferSuccessCallbacks,
} from '../../../../types/callbacks';
import {
	type CollectionType,
	OrderbookKind,
	StepType,
	type WalletKind,
	collectableKeys,
} from '../../../_internal';
import {
	useCollectible,
	useCollection,
	useGenerateOfferTransaction,
} from '../../../hooks';
import { useTransactionStatusModal } from '../_internal/components/transactionStatusModal';
import {
	getMakeOfferTransactionMessage,
	getMakeOfferTransactionTitle,
} from './_utils/getMakeOfferTransactionTitleMessage';

export interface MakeOfferModalState {
	isOpen: boolean;
	open: (args: ShowMakeOfferModalArgs) => void;
	close: () => void;
	state: {
		collectionName: string;
		collectionType: CollectionType | undefined;
		offerPrice: Price;
		quantity: string;
		collectionAddress: Hex;
		chainId: string;
		collectibleId: string;
		expiry: Date;
		errorCallbacks?: MakeOfferErrorCallbacks;
		successCallbacks?: MakeOfferSuccessCallbacks;
	};
	steps: {
		isLoading: () => boolean;
		stepsData: Step[] | undefined;
		_currentStep: null | 'tokenApproval' | 'createOffer';
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
	hash: Hex | undefined;
}

export const useHydrate = () => {
	const chainId = useSelector(makeOfferModal$.chainId);
	const collectionAddress = useSelector(
		makeOfferModal$.collectionAddress,
	);
	const currencyAddress = useSelector(
		makeOfferModal$.offerPrice.currency.contractAddress,
	);
	const collectionType = useSelector(makeOfferModal$.collectionType);
	const { data: collection, isSuccess: isSuccessCollection } = useCollection({
		chainId,
		collectionAddress,
	});

	when(isSuccessCollection, () => {
		makeOfferModal$.collectionName.set(collection!.name);
		makeOfferModal$.collectionType.set(
			collection!.type as CollectionType,
		);
	});

	useTokenApprovalHandler(chainId);
	useCreateOfferHandler(chainId);

	const onOfferSuccess = (data?: Step[]) => {
		makeOfferModal$.steps.stepsData.set(data);
	};

	const { generateOfferTransactionAsync } = useGenerateOfferTransaction({
		chainId,
		onSuccess: onOfferSuccess,
	});

	const { connector, address: userAddress } = useAccount();

	useMount(() => {
		const setSteps = async () => {
			const makeOfferTransactionData = await generateOfferTransactionAsync({
				collectionAddress,
				orderbook: OrderbookKind.sequence_marketplace_v1,
				offer: {
					tokenId: '1',
					quantity: '1',
					expiry: exp,
					currencyAddress,
					pricePerToken:
						makeOfferModal$.offerPrice.amountRaw.get() || '1',
				},
				maker: userAddress!,
				contractType: collectionType!,
				walletType: connector?.id as WalletKind,
			});
			makeOfferModal$.steps.stepsData.set(makeOfferTransactionData);
		};

		when(isSuccessCollection && collectionType && currencyAddress, setSteps);
	});
};

const useTokenApprovalHandler = (chainId: string) => {
	const { sendTransactionAsync, isPending, isSuccess } = useSendTransaction();
	const onError =
		makeOfferModal$.get().errorCallbacks?.onApproveTokenError;
	const onSuccess: (() => void) | undefined =
		makeOfferModal$.get().successCallbacks?.onApproveTokenSuccess;

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
			try {
				sendTransactionAsync({
					to: step.to as Hex,
					chainId: Number(chainId),
					data: step.data as Hex,
					value: BigInt(step.value || '0'),
				});

				onSuccess && onSuccess();
			} catch (error) {
				onError && onError(error);
			}
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
	const { collectibleId, collectionAddress, errorCallbacks, successCallbacks } =
		makeOfferModal$.get();
	const { connector, address } = useAccount();
	const {
		generateOfferTransactionAsync,
		isPending: generateOfferTransactionPending,
	} = useGenerateOfferTransaction({ chainId });
	const { data: collectible } = useCollectible({
		chainId,
		collectionAddress,
		collectibleId,
	});

	const { sendTransactionAsync, isPending: sendTransactionPending } =
		useSendTransaction();

	const { show: showTransactionStatusModal } = useTransactionStatusModal();

	makeOfferModal$.steps.createOffer.set({
		pending:
			makeOfferModal$.steps._currentStep.get() === 'createOffer' &&
			(generateOfferTransactionPending || sendTransactionPending),
		execute: () => {
			makeOfferModal$.steps._currentStep.set('createOffer');
			generateOfferTransactionAsync({
				collectionAddress: makeOfferModal$.collectionAddress.get(),
				maker: address!,
				contractType: makeOfferModal$.collectionType.get()!,
				orderbook: OrderbookKind.sequence_marketplace_v1,
				walletType: connector?.id as WalletKind,
				offer: {
					tokenId: makeOfferModal$.collectibleId.get(),
					quantity: makeOfferModal$.quantity.get(),
					expiry: makeOfferModal$.expiry.get(),
					currencyAddress:
						makeOfferModal$.offerPrice.currency.contractAddress.get(),
					pricePerToken: makeOfferModal$.offerPrice.amountRaw.get(),
				},
			})
				.then(async (steps) => {
					const step = steps.find((s) => s.id === StepType.createOffer);
					if (!step) throw new Error('No steps found');
					const hash = await sendTransactionAsync({
						to: step.to as Hex,
						chainId: Number(chainId),
						data: step.data as Hex,
						value: BigInt(step.value || '0'),
					});

					makeOfferModal$.hash.set(hash);

					makeOfferModal$.steps._currentStep.set(null);

					makeOfferModal$.close();

					showTransactionStatusModal({
						hash: hash!,
						price: makeOfferModal$.offerPrice.get(),
						collectionAddress,
						chainId,
						tokenId: collectibleId,
						getTitle: getMakeOfferTransactionTitle,
						getMessage: (params) =>
							getMakeOfferTransactionMessage(params, collectible?.name || ''),
						type: StepType.createOffer,
						callbacks: {
							onSuccess: successCallbacks?.onMakeOfferSuccess,
							onUnknownError: errorCallbacks?.onMakeOfferError,
						},
						queriesToInvalidate: collectableKeys.all as unknown as QueryKey[],
					});
				})
				.catch((error) => {
					errorCallbacks?.onMakeOfferError?.(error);
				});
		},
	});
};
