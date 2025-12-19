import { t as FeeOption } from "./waas-types.js";

//#region src/react/ui/modals/_internal/types/steps.d.ts
type StepStatus = 'idle' | 'pending' | 'success' | 'error';
type TransactionResult = {
  type: 'transaction';
  hash: string;
} | {
  type: 'signature';
  orderId: string;
} | {
  type: 'sponsored';
  hash: string;
};
type BaseStep = {
  label: string;
  status: StepStatus;
  isPending: boolean;
  isSuccess: boolean;
  isDisabled: boolean;
  disabledReason: string | null;
  error: Error | null;
};
type FeeStep = {
  label: string;
  status: 'idle' | 'selecting' | 'success';
  isSponsored: boolean;
  isSelecting: boolean;
  selectedOption: FeeOption | undefined;
  show: () => void;
  cancel: () => void;
};
type ApprovalStep = BaseStep & {
  canExecute: boolean;
  result: TransactionResult | null;
  invalidated?: boolean;
  invalidationReason?: string | null;
  execute: () => Promise<void>;
  reset: () => void;
};
type TransactionStep = BaseStep & {
  canExecute: boolean;
  result: TransactionResult | null;
  execute: () => Promise<void>;
};
type BaseStepName = 'form' | 'fee' | 'approval';
type FlowStepInfo<TFinalStepName extends string = 'transaction'> = {
  name: BaseStepName | TFinalStepName;
  status: StepStatus;
};
type FlowState<TFinalStepName extends string = 'transaction'> = {
  status: 'idle' | 'pending' | 'success' | 'error';
  isPending: boolean;
  isSuccess: boolean;
  currentStep: BaseStepName | TFinalStepName;
  nextStep: BaseStepName | TFinalStepName | null;
  progress: {
    current: number;
    total: number;
    percent: number;
  };
  allSteps: FlowStepInfo<TFinalStepName>[];
  hasInvalidatedSteps: boolean;
};
//#endregion
export { TransactionStep as i, FeeStep as n, FlowState as r, ApprovalStep as t };
//# sourceMappingURL=steps.d.ts.map