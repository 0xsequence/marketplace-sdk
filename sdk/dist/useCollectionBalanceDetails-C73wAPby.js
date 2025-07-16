import { useConfig } from "./useConfig-Ct2Tt1XY.js";
import { collectionBalanceDetailsQueryOptions } from "./collectionBalanceDetails-DR7VD7D_.js";
import { useQuery } from "@tanstack/react-query";

//#region src/react/hooks/data/collections/useCollectionBalanceDetails.tsx
/**
* Hook to fetch detailed balance information for multiple accounts
*
* Retrieves token balances and native balances for multiple account addresses,
* with support for contract whitelisting and optional native balance exclusion.
* Aggregates results from multiple account addresses into a single response.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.filter - Filter configuration for balance queries
* @param params.filter.accountAddresses - Array of account addresses to query balances for
* @param params.filter.contractWhitelist - Optional array of contract addresses to filter by
* @param params.filter.omitNativeBalances - Whether to exclude native token balances
* @param params.query - Optional React Query configuration
*
* @returns Query result containing aggregated balance details for all accounts
*
* @example
* Basic usage:
* ```typescript
* const { data: balanceDetails, isLoading } = useCollectionBalanceDetails({
*   chainId: 137,
*   filter: {
*     accountAddresses: ['0x1234...', '0x5678...'],
*     omitNativeBalances: false
*   }
* })
*
* if (data) {
*   console.log(`Found ${data.balances.length} token balances`);
*   console.log(`Found ${data.nativeBalances.length} native balances`);
* }
* ```
*
* @example
* With contract whitelist:
* ```typescript
* const { data: balanceDetails } = useCollectionBalanceDetails({
*   chainId: 1,
*   filter: {
*     accountAddresses: [userAddress],
*     contractWhitelist: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'], // USDC only
*     omitNativeBalances: true
*   },
*   query: {
*     enabled: Boolean(userAddress),
*     refetchInterval: 60000 // Refresh every minute
*   }
* })
* ```
*/
function useCollectionBalanceDetails(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = collectionBalanceDetailsQueryOptions({
		config,
		...rest
	});
	return useQuery({ ...queryOptions$1 });
}

//#endregion
export { useCollectionBalanceDetails };
//# sourceMappingURL=useCollectionBalanceDetails-C73wAPby.js.map