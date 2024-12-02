import { observable } from '@legendapp/state';
import type { Hex } from 'viem';
import type { Order } from '../../../_internal';

const initialState = {
  isOpen: false,
  collectionAddress: '' as Hex,
  chainId: '',
  tokenId: '',
  order: undefined as Order | undefined,
  hash: undefined as Hex | undefined,
  successCallback: undefined as ((hash: Hex) => void) | undefined,
  errorCallback: undefined as ((error: Error) => void) | undefined,

  open: (args: {
    collectionAddress: Hex,
    chainId: string,
    tokenId: string,
    order: Order,
    callbacks?: {
      onSuccess?: (hash: Hex) => void,
      onError?: (error: Error) => void
    }
  }) => {
    sellModal$.collectionAddress.set(args.collectionAddress);
    sellModal$.chainId.set(args.chainId);
    sellModal$.tokenId.set(args.tokenId);
    sellModal$.order.set(args.order);
    sellModal$.successCallback.set(args.callbacks?.onSuccess);
    sellModal$.errorCallback.set(args.callbacks?.onError);
    sellModal$.isOpen.set(true);
  },

  close: () => {
    sellModal$.isOpen.set(false);
    sellModal$.hash.set(undefined);
    sellModal$.successCallback.set(undefined);
    sellModal$.errorCallback.set(undefined);
  }
};

export const sellModal$ = observable(initialState);