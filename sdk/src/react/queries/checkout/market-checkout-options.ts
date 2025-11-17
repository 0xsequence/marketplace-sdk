import type { CheckoutOptionsMarketplaceResponse } from '@0xsequence/marketplace-api';
import type { Address } from 'viem';
import {
	buildQueryOptions,
	type CheckoutOptionsMarketplaceRequest,
	getMarketplaceClient,
	type MarketplaceKind,
	type SdkQueryParams,
	type WithRequired,
} from '../../_internal';

export interface FetchMarketCheckoutOptionsParams {
	chainId: number;
	walletAddress: Address;
	orders: Array<{
		collectionAddress: string;
		orderId: string;
		marketplace: MarketplaceKind;
	}>;
	additionalFee?: number;
}

/**
 * Fetches checkout options from the Marketplace API
 */
export async function fetchMarketCheckoutOptions(
	params: WithRequired<
		MarketCheckoutOptionsQueryOptions,
		'chainId' | 'walletAddress' | 'orders' | 'config'
	>,
): Promise<CheckoutOptionsMarketplaceResponse> {
	const { chainId, walletAddress, orders, config, additionalFee } = params;

	const client = getMarketplaceClient(config);

	const apiArgs: CheckoutOptionsMarketplaceRequest = {
		chainId,
		walletAddress,
		orders: orders.map((order) => ({
			contractAddress: order.collectionAddress,
			orderId: order.orderId,
			marketplace: order.marketplace,
		})),
		additionalFee: additionalFee ?? 0,
	};

	const result = await client.checkoutOptionsMarketplace(apiArgs);
	return result;
}

export type MarketCheckoutOptionsQueryOptions =
	SdkQueryParams<FetchMarketCheckoutOptionsParams>;

export function getMarketCheckoutOptionsQueryKey(
	params: MarketCheckoutOptionsQueryOptions,
) {
	return [
		'checkout',
		'market',
		{
			chainId: params.chainId ?? 0,
			walletAddress: params.walletAddress ?? '0x',
			orders: params.orders ?? [],
			additionalFee: params.additionalFee ?? 0,
		},
	] as const;
}

export function marketCheckoutOptionsQueryOptions(
	params: MarketCheckoutOptionsQueryOptions,
) {
	return buildQueryOptions(
		{
			getQueryKey: getMarketCheckoutOptionsQueryKey,
			requiredParams: ['chainId', 'walletAddress', 'orders', 'config'] as const,
			fetcher: fetchMarketCheckoutOptions,
			customValidation: (params) => (params.orders?.length ?? 0) > 0,
		},
		params,
	);
}
