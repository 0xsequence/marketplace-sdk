import { observable } from '@legendapp/state';
import { addDays } from 'date-fns/addDays';
import type { Hex } from 'viem';
import { type Currency, OrderbookKind, type Price } from '../../../../types';
import type { BaseModalState, ModalCallbacks } from '../_internal/types';
import { CollectionType } from '../../../_internal';

type MakeOfferState = BaseModalState & {
  orderbookKind: OrderbookKind;
  collectibleId: string;
  offerPrice: Price;
  offerPriceChanged: boolean;
  quantity: string;
  expiry: Date;
  invalidQuantity: boolean;
  collectionType?: CollectionType;
};

export type OpenMakeOfferModalArgs = {
  collectionAddress: Hex;
  chainId: string;
  collectibleId: string;
  orderbookKind: OrderbookKind;
  callbacks?: ModalCallbacks;
};

type Actions = {
  open: (args: OpenMakeOfferModalArgs) => void;
  close: () => void;
};

const initialState: MakeOfferState = {
  isOpen: false,
  collectionAddress: '' as Hex,
  chainId: '',
  collectibleId: '',
  orderbookKind: OrderbookKind.reservoir,
  callbacks: undefined,
  offerPrice: {
    amountRaw: '1',
    currency: {} as Currency,
  },
  offerPriceChanged: false,
  quantity: '1',
  invalidQuantity: false,
  expiry: new Date(addDays(new Date(), 7).toJSON()),
  collectionType: undefined,
};

const actions: Actions = {
  open: (args) => {
    makeOfferModal$.collectionAddress.set(args.collectionAddress);
    makeOfferModal$.chainId.set(args.chainId);
    makeOfferModal$.collectibleId.set(args.collectibleId);
    makeOfferModal$.orderbookKind.set(args.orderbookKind);
    makeOfferModal$.callbacks.set(args.callbacks);
    makeOfferModal$.isOpen.set(true);
  },
  close: () => {
    makeOfferModal$.isOpen.set(false);
    makeOfferModal$.set({ ...initialState, ...actions });
  },
};

export const makeOfferModal$ = observable<MakeOfferState & Actions>({
  ...initialState,
  ...actions,
});