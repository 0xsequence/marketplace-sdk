import { observable } from "@legendapp/state";
import type { Order } from "../../../_internal";
import type { ShowBuyModalArgs } from ".";

export interface BuyModalState {
  isOpen: boolean;
  open: (args: ShowBuyModalArgs) => void;
  close: () => void;
  state: {
    order: Order;
    quantity: string;
  };
}

export const initialState: BuyModalState = {
  isOpen: false,
  open: ({ order }: ShowBuyModalArgs) => {
    buyModal$.state.set({
      ...buyModal$.state.get(),
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
    order: undefined as unknown as Order,
    quantity: "1",
  },
};

export const buyModal$ = observable(initialState);
