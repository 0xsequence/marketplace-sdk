import { k as Price } from "../../../../../../create-config.js";
import * as react_jsx_runtime18 from "react/jsx-runtime";
import { Address } from "viem";

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
}: TransactionDetailsProps): react_jsx_runtime18.JSX.Element;
//#endregion
export { TransactionDetails as default };
//# sourceMappingURL=index.d.ts.map