import type {
	CheckoutOptionsMarketplaceRequest,
	CheckoutOptionsMarketplaceResponse,
} from '@0xsequence/marketplace-api';
import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type MarketplaceKind,
	type WithOptionalParams,
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
	config: SdkConfig;
}

/**
 * Fetches checkout options from the Marketplace API
 */
export async function fetchMarketCheckoutOptions(
	params: FetchMarketCheckoutOptionsParams,
): Promise<CheckoutOptionsMarketplaceResponse> {
	const { chainId, walletAddress, orders, config, additionalFee } = params;

	const client = getMarketplaceClient(config);

	const apiArgs: CheckoutOptionsMarketplaceRequest = {
		chainId,
		wallet: walletAddress,
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

export function getMarketCheckoutOptionsQueryKey(
	params: WithOptionalParams<FetchMarketCheckoutOptionsParams>,
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
	params: WithOptionalParams<FetchMarketCheckoutOptionsParams>,
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
