import { observable } from "@legendapp/state";
import { ShowTransactionStatusModalArgs as ShowTransactionStatusModalArgs } from ".";
import { TransactionStatus } from "@0xsequence/indexer";
import { Address } from "viem";

export type TransactionStatusExtended = TransactionStatus | "PENDING";

export interface TransactionStatusModalState {
  isOpen: boolean;
  open: (args: ShowTransactionStatusModalArgs) => void;
  close: () => void;
  state: {
    status: TransactionStatusExtended;
    collectionAddress: string;
    chainId: string;
    tokenId: string;
    title?: string;
    message?: string;
    creatorAddress?: Address;
  };
}

export const initialState: TransactionStatusModalState = {
  isOpen: false,
  open: ({
    collectionAddress,
    chainId,
    tokenId,
    title,
    message,
    creatorAddress,
  }) => {
    transactionStatusModal$.state.set({
      ...transactionStatusModal$.state.get(),
      collectionAddress,
      chainId,
      tokenId,
      title,
      message,
      creatorAddress,
    });
    transactionStatusModal$.isOpen.set(true);
  },
  close: () => {
    transactionStatusModal$.isOpen.set(false);
    transactionStatusModal$.state.set({
      ...initialState.state,
    });
  },
  state: {
    status: "PENDING",
    collectionAddress: "",
    chainId: "",
    tokenId: "",
    title: "",
    message: "",
    creatorAddress: undefined,
  },
};

export const transactionStatusModal$ = observable(initialState);
