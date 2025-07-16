import { Address, Hash } from "viem";

//#region src/react/ui/modals/_internal/types.d.ts
type ModalCallbacks = {
  onSuccess?: ({
    hash,
    orderId
  }: {
    hash?: Hash;
    orderId?: string;
  }) => void;
  onError?: (error: Error) => void;
  onBuyAtFloorPrice?: () => void;
};
//#endregion
export { ModalCallbacks };
//# sourceMappingURL=types-BYMSlTl8.d.ts.map