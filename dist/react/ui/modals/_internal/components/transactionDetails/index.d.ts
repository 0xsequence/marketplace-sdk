import "../../../../../../index2.js";
import { C as Price } from "../../../../../../create-config.js";
import "../../../../../../xstate-store.cjs.js";
import "../../../../../../index3.js";
import { Address } from "viem";
import * as react_jsx_runtime14 from "react/jsx-runtime";

//#region src/react/ui/modals/_internal/components/transactionDetails/index.d.ts
type TransactionDetailsProps = {
  tokenId: bigint;
  collectionAddress: Address;
  chainId: number;
  price?: Price;
  currencyImageUrl?: string;
  includeMarketplaceFee: boolean;
  showPlaceholderPrice?: boolean;
};
declare function TransactionDetails({
  tokenId,
  collectionAddress,
  chainId,
  includeMarketplaceFee,
  price,
  showPlaceholderPrice,
  currencyImageUrl
}: TransactionDetailsProps): react_jsx_runtime14.JSX.Element;
//#endregion
export { TransactionDetails as default };
//# sourceMappingURL=index.d.ts.map