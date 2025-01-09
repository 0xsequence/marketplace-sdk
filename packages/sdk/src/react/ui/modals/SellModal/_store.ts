import { observable } from '@legendapp/state';
import type { Hex } from 'viem';
import type { Order } from '../../../_internal';
import type { BaseModalState, ModalCallbacks } from '../_internal/types';

export type OpenSellModalArgs = {
  collectionAddress: Hex;
  chainId: string;
  tokenId: string;
  order: Order;
  callbacks?: ModalCallbacks;
};

type SellModalState = BaseModalState & {
  tokenId: string;
  order?: Order;
};

type Actions = {
  open: (args: OpenSellModalArgs) => void;
  close: () => void;
};

const initialState: SellModalState & Actions = {
  isOpen: false,
  collectionAddress: '' as Hex,
  chainId: '',
  tokenId: '',
  order: undefined,
  callbacks: undefined,

  open: (args) => {
    sellModal$.collectionAddress.set(args.collectionAddress);
    sellModal$.chainId.set(args.chainId);
    sellModal$.tokenId.set(args.tokenId);
    sellModal$.order.set(args.order);
    sellModal$.callbacks.set(args.callbacks);
    sellModal$.isOpen.set(true);
  },

  close: () => {
    sellModal$.isOpen.set(false);
    sellModal$.callbacks.set(undefined);
  },
};

export const sellModal$ = observable(initialState);
