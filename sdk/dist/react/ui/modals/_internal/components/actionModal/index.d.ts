import React, { ComponentProps } from "react";
import { Button } from "@0xsequence/design-system";
import * as react_jsx_runtime6 from "react/jsx-runtime";
import { Address } from "viem";
import * as _xstate_store7 from "@xstate/store";

//#region src/react/ui/modals/_internal/components/actionModal/ActionModal.d.ts
interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  ctas: {
    label: React.ReactNode;
    onClick: (() => Promise<void>) | (() => void);
    pending?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    variant?: ComponentProps<typeof Button>['variant'];
    testid?: string;
  }[];
  chainId: number;
  modalLoading?: boolean;
  spinnerContainerClassname?: string;
  disableAnimation?: boolean;
  hideCtas?: boolean;
}
declare const ActionModal: ({
  isOpen,
  onClose,
  title,
  children,
  ctas,
  chainId,
  disableAnimation,
  modalLoading,
  spinnerContainerClassname,
  hideCtas
}: ActionModalProps) => react_jsx_runtime6.JSX.Element | null;
//#endregion
//#region src/react/ui/modals/_internal/components/actionModal/store.d.ts
interface ActionModalState {
  isOpen: boolean;
  chainId: number | null;
  collectionAddress: Address | null;
}
declare const actionModalStore: _xstate_store7.Store<ActionModalState, _xstate_store7.ExtractEvents<{
  open: {
    chainId: number;
    collectionAddress: Address;
  };
  close: unknown;
}>, {
  type: string;
}>;
declare const useActionModalState: () => ActionModalState;
declare const useIsActionModalOpen: () => boolean;
declare const useActionModalChainId: () => number | null;
declare const useActionModalCollectionAddress: () => `0x${string}` | null;
declare function openModal(chainId: number, collectionAddress: Address): void;
declare function closeModal(): void;
//#endregion
export { ActionModal, ActionModalProps, ActionModalState, actionModalStore, closeModal, openModal, useActionModalChainId, useActionModalCollectionAddress, useActionModalState, useIsActionModalOpen };
//# sourceMappingURL=index.d.ts.map