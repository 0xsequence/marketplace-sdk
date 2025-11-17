import React, { ComponentProps } from "react";
import { Button } from "@0xsequence/design-system";
import * as react_jsx_runtime26 from "react/jsx-runtime";

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
}: ActionModalProps) => react_jsx_runtime26.JSX.Element | null;
//#endregion
export { ActionModal, ActionModalProps };
//# sourceMappingURL=index-CUB4YdNF.d.ts.map