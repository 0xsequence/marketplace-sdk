import { observable } from "@legendapp/state";

import type { Hex } from "viem";
import type { Order } from "../../../_internal";
import type { ShowBuyModalArgs } from ".";

export interface BuyModalState {
  isOpen: boolean;
  open: (args: ShowBuyModalArgs) => void;
  close: () => void;
  state: {
    collectionAddress: Hex;
    chainId: string;
    tokenId: string;
    order: Order | undefined;
    quantity: string;
  };
}

export const initialState: BuyModalState = {
  isOpen: false,
  open: ({ collectionAddress, chainId, tokenId, order }: ShowBuyModalArgs) => {
    buyModal$.state.set({
      ...buyModal$.state.get(),
      collectionAddress,
      chainId,
      tokenId,
      order,
    });
    buyModal$.isOpen.set(true);
  },
  close: () => {
    buyModal$.isOpen.set(false);
    buyModal$.state.set({
      ...initialState.state,
    });
  },
  state: {
    collectionAddress: "" as Hex,
    chainId: "",
    tokenId: "",
    order: undefined,
    quantity: "1",
  },
};

export const buyModal$ = observable(initialState);
