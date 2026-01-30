import { st as index_d_exports$1 } from "./index2.js";
import { c as SdkConfig } from "./create-config.js";
import { ContractType } from "@0xsequence/indexer";
import { Address, Hash, Hex, TypedDataDomain } from "viem";

//#region ../api/src/adapters/marketplace/marketplace.gen.d.ts

declare enum MetadataStatus {
  NOT_AVAILABLE = "NOT_AVAILABLE",
  REFRESHING = "REFRESHING",
  AVAILABLE = "AVAILABLE",
}
interface TokenMetadata$1 {
  tokenId: bigint;
  name: string;
  description?: string;
  image?: string;
  video?: string;
  audio?: string;
  properties?: {
    [key: string]: any;
  };
  attributes: Array<{
    [key: string]: any;
  }>;
  image_data?: string;
  external_url?: string;
  background_color?: string;
  animation_url?: string;
  decimals?: number;
  updatedAt?: string;
  assets?: Array<Asset>;
  status: MetadataStatus;
}
interface Asset {
  id: number;
  collectionId: number;
  tokenId: bigint;
  url?: string;
  metadataField: string;
  name?: string;
  filesize?: number;
  mimeType?: string;
  width?: number;
  height?: number;
  updatedAt?: string;
}
//#endregion
//#region src/react/utils/normalize-attributes.d.ts
type StandardizedAttribute = {
  name: string;
  value: string;
  display_type?: string | null | undefined;
};
type StandardizedAttributes = Record<string, StandardizedAttribute>;
/**
 * Processes token metadata attributes into a standardized format
 * Handles both array-based attributes (OpenSea standard) and object-based attributes
 * @param attributes - Token attributes from metadata
 * @returns Object with standardized attributes containing name, value, and optional display_type
 */
declare function processAttributes(attributes: TokenMetadata$1['attributes']): StandardizedAttributes;
//#endregion
//#region src/react/utils/normalize-properties.d.ts
type StandardizedProperty = {
  name: string;
  value: string;
};
type StandardizedProperties = Record<string, StandardizedProperty>;
/**
 * Processes token metadata properties into a standardized format
 * @param properties - Token properties from metadata
 * @returns Object with standardized properties containing name and value
 */
declare function processProperties(properties: TokenMetadata$1['properties']): StandardizedProperties;
//#endregion
//#region src/react/utils/waitForTransactionReceipt.d.ts
declare const waitForTransactionReceipt: ({
  txHash,
  chainId,
  sdkConfig,
  maxBlockWait
}: {
  txHash: Hex;
  chainId: number;
  sdkConfig: SdkConfig;
  maxBlockWait?: number;
}) => Promise<index_d_exports$1.TransactionReceipt>;
//#endregion
export { processAttributes as a, StandardizedAttribute as i, StandardizedProperty as n, processProperties as r, waitForTransactionReceipt as t };
//# sourceMappingURL=index39.d.ts.map