import * as react_jsx_runtime15 from "react/jsx-runtime";
import { Address } from "viem";

//#region src/react/ui/modals/_internal/components/tokenPreview/index.d.ts
type TokenPreviewProps = {
  collectionName?: string;
  collectionAddress: Address;
  tokenId: bigint;
  chainId: number;
};
declare function TokenPreview({
  collectionName,
  collectionAddress,
  tokenId,
  chainId
}: TokenPreviewProps): react_jsx_runtime15.JSX.Element;
//#endregion
export { TokenPreview as default };
//# sourceMappingURL=index.d.ts.map