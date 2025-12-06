import { Address, Hash } from "viem";

//#region src/react/ui/modals/_internal/types.d.ts
interface ActionButton {
  label: string;
  action: () => void;
}
type ModalCallbacks = {
  onSuccess?: ({
    hash,
    orderId
  }: {
    hash?: Hash;
    orderId?: string;
  }) => void;
  onError?: (error: Error) => void;
  successActionButtons?: ActionButton[];
};
//#endregion
export { ModalCallbacks as n, ActionButton as t };
//# sourceMappingURL=types.d.ts.map