import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Address, Hex } from 'viem';
import { useAccount } from 'wagmi';
import type { SdkConfig } from '../../types';
import type { MarketplaceKind } from '../_internal';
import { getMarketplaceClient } from '../_internal';
import { useConfig } from './useConfig';

/**
 * Order details for checkout options
 */
export interface CheckoutOrder {
	/** The contract address of the NFT collection */
	collectionAddress: Address;
	/** The unique identifier of the order */
	orderId: string;
	/** The marketplace where the order is listed */
	marketplace: MarketplaceKind;
}

/**
 * Arguments for fetching checkout options
 */
export interface UseCheckoutOptionsArgs {
	/** The blockchain network ID (e.g., 1 for Ethereum mainnet, 137 for Polygon) */
	chainId: number;
	/** Array of orders to checkout */
	orders: CheckoutOrder[];
	/** Query configuration options */
	query?: {
		/** Whether the query should be enabled/disabled */
		enabled?: boolean;
	};
}

/**
 * Return type for the useCheckoutOptions hook containing available payment methods
 */
export type UseCheckoutOptionsReturn = Awaited<
	ReturnType<typeof fetchCheckoutOptions>
>;

const fetchCheckoutOptions = async (
	args: UseCheckoutOptionsArgs & { walletAddress: Hex },
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient.checkoutOptionsMarketplace({
		wallet: args.walletAddress,
		orders: args.orders.map((order) => ({
			contractAddress: order.collectionAddress,
			orderId: order.orderId,
			marketplace: order.marketplace,
		})),
		additionalFee: 0, //TODO: add additional fee
	});
};

export const checkoutOptionsOptions = (
	args: UseCheckoutOptionsArgs & { walletAddress: Hex },
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: ['checkoutOptions', args],
		queryFn: () => fetchCheckoutOptions(args, config),
	});
};

/**
 * Hook to fetch available checkout options for purchasing collectables
 *
 * Retrieves available payment methods including crypto, swap options, NFT checkout
 * providers, and on-ramp options for a specific set of orders. Requires a connected wallet.
 *
 * @param args - Configuration object containing orders and chain information
 * @returns React Query result with checkout options, loading state, and error handling
 *
 * @example
 * ```tsx
 * const { data: checkoutOptions, isLoading, error } = useCheckoutOptions({
 *   chainId: 137,
 *   orders: [
 *     {
 *       collectionAddress: '0x...',
 *       orderId: '123',
 *       marketplace: MarketplaceKind.opensea
 *     }
 *   ]
 * });
 *
 * if (isLoading) return <div>Loading checkout options...</div>;
 * if (error) return <div>Error loading checkout options</div>;
 *
 * return (
 *   <div>
 *     <h3>Payment Options Available:</h3>
 *     <p>Crypto: {checkoutOptions?.options.crypto ? 'Yes' : 'No'}</p>
 *     <p>Swap providers: {checkoutOptions?.options.swap.length}</p>
 *     <p>On-ramp providers: {checkoutOptions?.options.onRamp.length}</p>
 *   </div>
 * );
 * ```
 */
export const useCheckoutOptions = (args: UseCheckoutOptionsArgs) => {
	const { address } = useAccount();
	const config = useConfig();
	return useQuery(
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		checkoutOptionsOptions({ walletAddress: address!, ...args }, config),
	);
};
