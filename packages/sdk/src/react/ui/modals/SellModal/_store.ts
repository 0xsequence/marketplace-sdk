import { observable } from '@legendapp/state';
import type { Hex } from 'viem';
import type { Order } from '../../../_internal';
import type { SellErrorCallbacks, SellSuccessCallbacks } from '../../../../types/callbacks';

const initialState = {
  isOpen: false,
  collectionAddress: '' as Hex,
  chainId: '',
  tokenId: '',
  order: undefined as Order | undefined,
  hash: undefined as Hex | undefined,
  
  errorCallbacks: undefined as SellErrorCallbacks | undefined,
  successCallbacks: undefined as SellSuccessCallbacks | undefined,

  open: (args: {
    collectionAddress: Hex,
    chainId: string,
    tokenId: string,
    order: Order
  }) => {
    sellModal$.collectionAddress.set(args.collectionAddress);
    sellModal$.chainId.set(args.chainId);
    sellModal$.tokenId.set(args.tokenId);
    sellModal$.order.set(args.order);
    sellModal$.isOpen.set(true);
  },

  close: () => {
    sellModal$.isOpen.set(false);
    sellModal$.hash.set(undefined);
  },

  setCallbacks: (callbacks: {
    error?: SellErrorCallbacks,
    success?: SellSuccessCallbacks
  }) => {
    if (callbacks.error) sellModal$.errorCallbacks.set(callbacks.error);
    if (callbacks.success) sellModal$.successCallbacks.set(callbacks.success);
  }
};

export const sellModal$ = observable(initialState);