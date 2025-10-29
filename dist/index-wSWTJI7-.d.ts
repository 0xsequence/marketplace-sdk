import { MarketplaceKind } from "./create-config-Cvi1W2a1.js";
import * as _0xsequence_network0 from "@0xsequence/network";
import { NetworkConfig } from "@0xsequence/network";
import { ComponentType } from "react";
import { ClassValue } from "clsx";
import { Image } from "@0xsequence/design-system";
import { Chain } from "viem";

//#region src/utils/address.d.ts
declare const truncateMiddle: (address: string, minPrefix?: number, minSuffix?: number) => string;
declare const truncateEnd: (text: string | undefined, truncateAt: number) => string;
declare const compareAddress: (a?: string, b?: string) => boolean;
//#endregion
//#region src/utils/cn.d.ts
declare function cn$1(...inputs: ClassValue[]): string;
//#endregion
//#region src/utils/getMarketplaceDetails.d.ts
interface Marketplace {
  logo: ComponentType<React.ComponentProps<typeof Image>>;
  displayName: string;
}
type MarketplaceDetailsProp = {
  originName: string;
  kind: MarketplaceKind;
};
declare function getMarketplaceDetails({
  originName,
  kind
}: MarketplaceDetailsProp): Marketplace | undefined;
//#endregion
//#region src/utils/network.d.ts
type ChainNameOrId = string | number;
declare const getNetwork: (nameOrId: ChainNameOrId) => _0xsequence_network0.NetworkMetadata;
declare const getPresentableChainName: (chainId: number) => string;
//#endregion
//#region src/utils/networkconfigToWagmiChain.d.ts
declare const networkToWagmiChain: (network: NetworkConfig) => Chain;
//#endregion
//#region src/utils/price.d.ts
type CalculatePriceDifferencePercentageArgs = {
  inputPriceRaw: bigint;
  basePriceRaw: bigint;
  decimals: number;
};
/**
 * Calculates the percentage difference between two prices
 * @param args - Object containing input price, base price, and decimals
 * @returns The percentage difference as a string with 2 decimal places
 * @example
 * ```ts
 * const diff = calculatePriceDifferencePercentage({
 *   inputPriceRaw: 1000000n,
 *   basePriceRaw: 900000n,
 *   decimals: 6
 * }); // Returns "11.11"
 * ```
 */
declare const calculatePriceDifferencePercentage: ({
  inputPriceRaw,
  basePriceRaw,
  decimals
}: CalculatePriceDifferencePercentageArgs) => string;
/**
 * Formats a raw price amount with the specified number of decimal places
 * @param amount - The raw price amount as a bigint
 * @param decimals - Number of decimal places to format to
 * @returns Formatted price string with proper decimal and thousands separators
 * @example
 * ```ts
 * const formatted = formatPrice(1000000n, 6); // Returns "1.000000"
 * ```
 */
declare const formatPrice: (amount: bigint, decimals: number) => string;
/**
 * Calculates the final earnings amount after applying multiple fee percentages
 * @param amount - The raw amount as a bigint (e.g., from a blockchain transaction)
 * @param decimals - The number of decimal places for the currency (e.g., 18 for ETH, 6 for USDC)
 * @param fees - Array of fee percentages to apply (e.g., [2.5, 1.0] for 2.5% and 1% fees)
 * @returns Formatted string representing the final earnings after all fees are applied
 * @throws Will return '0' if there's an error in calculation
 * @example
 * ```ts
 * const earnings = calculateEarningsAfterFees(
 *   1000000000000000000n, // 1 ETH
 *   18,                   // ETH decimals
 *   [2.5, 1.0]           // 2.5% and 1% fees
 * ); // Returns "0.96525" (1 ETH after 2.5% and 1% fees)
 * ```
 */
declare const calculateEarningsAfterFees: (amount: bigint, decimals: number, fees: number[]) => string;
/**
 * Formats a price amount with fee applied
 * @param amount - The raw price amount as a bigint
 * @param decimals - Number of decimal places for the currency
 * @param feePercentage - Fee percentage to apply (e.g., 3.5 for 3.5%)
 * @returns Formatted price string with fee applied and proper decimal/thousands separators
 * @example
 * ```ts
 * const priceWithFee = formatPriceWithFee(1000000n, 6, 3.5); // Returns "1.035"
 * ```
 */
declare const formatPriceWithFee: (amount: bigint, decimals: number, feePercentage: number) => string;
//#endregion
export { calculateEarningsAfterFees, calculatePriceDifferencePercentage, cn$1 as cn, compareAddress, formatPrice, formatPriceWithFee, getMarketplaceDetails, getNetwork, getPresentableChainName, networkToWagmiChain, truncateEnd, truncateMiddle };
//# sourceMappingURL=index-wSWTJI7-.d.ts.map