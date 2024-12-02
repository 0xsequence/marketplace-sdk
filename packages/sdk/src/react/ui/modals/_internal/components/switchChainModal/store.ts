import { observable } from "@legendapp/state";
import type { ShowSwitchChainModalArgs } from ".";
import type { SwitchChainErrorType } from "viem";
import type { ChainId } from "../../../../../_internal";

export interface SwitchChainModalState {
  isOpen: boolean;
  open: (args: ShowSwitchChainModalArgs) => void;
  close: () => void;
  state: {
    chainIdToSwitchTo: ChainId | undefined;
    isSwitching: boolean;
    onSwitchChain: () => void;
    onSuccess: () => void;
    onError: (error: SwitchChainErrorType) => void;
  };
}

export const initialState: SwitchChainModalState = {
  isOpen: false,
  open: ({ chainIdToSwitchTo, onSwitchChain, onError, onSuccess }) => {
    switchChainModal$.state.set({
      ...switchChainModal$.state.get(),
      chainIdToSwitchTo,
      onSwitchChain,
      onError,
      onSuccess,
    });
    switchChainModal$.isOpen.set(true);
  },
  close: () => {
    switchChainModal$.isOpen.set(false);
    switchChainModal$.state.set({
      ...initialState.state,
    });
  },
  state: {
    chainIdToSwitchTo: undefined,
    onError: () => {},
    onSuccess: () => {},
    onSwitchChain: () => {},
    isSwitching: false,
  },
};

export const switchChainModal$ = observable(initialState);
