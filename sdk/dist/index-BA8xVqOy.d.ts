import { ContractType, CreateReq, MarketplaceKind } from "./new-marketplace-types-Cggo50UM.js";

//#region src/react/_internal/consts.d.ts
declare const DEFAULT_NETWORK = 137;
//#endregion
//#region src/react/_internal/get-provider.d.ts
declare const PROVIDER_ID = "sdk-provider";
declare function getProviderEl(): HTMLElement | null;
//#endregion
//#region src/react/_internal/types.d.ts
interface QueryArg {
  enabled?: boolean;
}
type CollectableId = string | number;
type CollectionType = ContractType.ERC1155 | ContractType.ERC721;
type TransactionStep = {
  exist: boolean;
  isExecuting: boolean;
  execute: () => Promise<void>;
};
type TransactionSteps = {
  approval: TransactionStep;
  transaction: TransactionStep;
};
declare enum TransactionType {
  BUY = "BUY",
  SELL = "SELL",
  LISTING = "LISTING",
  OFFER = "OFFER",
  TRANSFER = "TRANSFER",
  CANCEL = "CANCEL",
}
interface BuyInput {
  orderId: string;
  collectableDecimals: number;
  marketplace: MarketplaceKind;
  quantity: string;
}
interface SellInput {
  orderId: string;
  marketplace: MarketplaceKind;
  quantity?: string;
}
interface ListingInput {
  contractType: ContractType;
  listing: CreateReq;
}
interface OfferInput {
  contractType: ContractType;
  offer: CreateReq;
}
interface CancelInput {
  orderId: string;
  marketplace: MarketplaceKind;
}
type ValuesOptional<T> = { [K in keyof T]: T[K] | undefined };
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
//#endregion
export { BuyInput, CancelInput, CollectableId, CollectionType, DEFAULT_NETWORK, ListingInput, OfferInput, Optional, PROVIDER_ID, QueryArg, SellInput, TransactionSteps, TransactionType, ValuesOptional, getProviderEl };
//# sourceMappingURL=index-BA8xVqOy.d.ts.map