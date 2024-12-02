import { observable } from '@legendapp/state';
import { addDays } from 'date-fns/addDays';
import type { Hash, Hex } from 'viem';
import type { Currency, Price, Step } from '../../../../types';
import { ShowMakeOfferModalArgs } from '.';
import { CollectionType } from '../../../_internal';
import { MakeOfferErrorCallbacks, MakeOfferSuccessCallbacks } from '../../../../types/callbacks';
import type { ModalCallbacks } from '../_internal/types';

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

  callbacks: undefined as ModalCallbacks | undefined,

  open: (args: {
    collectionAddress: Hex;
    chainId: string;
    collectibleId: string;
    onSuccess?: (hash?: Hash) => void;
    onError?: (error: Error) => void;
    defaultCallbacks?: ModalCallbacks;
  }) => {
    makeOfferModal$.collectionAddress.set(args.collectionAddress);
    makeOfferModal$.chainId.set(args.chainId);
    makeOfferModal$.collectibleId.set(args.collectibleId);
    makeOfferModal$.callbacks.set({
      onSuccess: args.onSuccess,
      onError: args.onError
    } || args.defaultCallbacks);
    makeOfferModal$.isOpen.set(true);
  },
  close: () => {
    makeOfferModal$.isOpen.set(false);
    makeOfferModal$.callbacks.set(undefined);
  },
};

export const makeOfferModal$ = observable(initialState);
;

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