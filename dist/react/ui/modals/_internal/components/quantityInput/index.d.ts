import * as react_jsx_runtime10 from "react/jsx-runtime";

//#region src/react/ui/modals/_internal/components/quantityInput/index.d.ts
type QuantityInputProps = {
  quantity: bigint;
  invalidQuantity: boolean;
  onQuantityChange: (quantity: bigint) => void;
  onInvalidQuantityChange: (invalid: boolean) => void;
  maxQuantity: bigint;
  className?: string;
  disabled?: boolean;
};
declare function QuantityInput({
  quantity,
  invalidQuantity,
  onQuantityChange,
  onInvalidQuantityChange,
  maxQuantity,
  className,
  disabled
}: QuantityInputProps): react_jsx_runtime10.JSX.Element;
//#endregion
export { QuantityInput as default };
//# sourceMappingURL=index.d.ts.map