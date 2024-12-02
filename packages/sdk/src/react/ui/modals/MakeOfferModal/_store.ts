import { observable } from '@legendapp/state';
import { addDays } from 'date-fns/addDays';
import type { Hex } from 'viem';
import type { Currency, Price } from '../../../../types';
import type { BaseModalState, ModalCallbacks } from '../_internal/types';

type MakeOfferModalState = BaseModalState & {
  collectibleId: string;
  offerPrice: Price;
  quantity: string;
  expiry: Date;
};

const initialState: MakeOfferModalState & {
  open: (args: {
    collectionAddress: Hex;
    chainId: string;
    collectibleId: string;
    callbacks?: ModalCallbacks;
  }) => void;
  close: () => void;
} = {
  isOpen: false,
  collectionAddress: '' as Hex,
  chainId: '',
  collectibleId: '',
  callbacks: undefined,
  offerPrice: {
    amountRaw: '0',
    currency: {} as Currency,
  },
  quantity: '1',
  expiry: new Date(addDays(new Date(), 7).toJSON()),

  open: (args) => {
    makeOfferModal$.collectionAddress.set(args.collectionAddress);
    makeOfferModal$.chainId.set(args.chainId);
    makeOfferModal$.collectibleId.set(args.collectibleId);
    makeOfferModal$.callbacks.set(args.callbacks);
    makeOfferModal$.isOpen.set(true);
  },

  close: () => {
    makeOfferModal$.isOpen.set(false);
    makeOfferModal$.callbacks.set(undefined);
  }
};

export const makeOfferModal$ = observable(initialState);
