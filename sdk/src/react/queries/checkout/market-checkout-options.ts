import type {
	CheckoutOptionsMarketplaceRequest,
	CheckoutOptionsMarketplaceResponse,
} from '@0xsequence/marketplace-api';
import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import {
	getMarketplaceClient,
	type MarketplaceKind,
	type ValuesOptional,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchMarketCheckoutOptionsParams
	extends Omit<
		CheckoutOptionsMarketplaceRequest,
		'chainId' | 'wallet' | 'orders'
	> {
	chainId: number;
	walletAddress: Address;
	orders: Array<{
		collectionAddress: string;
		orderId: string;
		marketplace: MarketplaceKind;
	}>;
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

export type MarketCheckoutOptionsQueryOptions =
	ValuesOptional<FetchMarketCheckoutOptionsParams> & {
		query?: StandardQueryOptions;
	};

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
	const enabled = Boolean(
		params.chainId &&
			params.walletAddress &&
			params.orders?.length &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getMarketCheckoutOptionsQueryKey(params),
		queryFn: () =>
			fetchMarketCheckoutOptions({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				walletAddress: params.walletAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				orders: params.orders!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				additionalFee: params.additionalFee ?? 0,
			}),
		...params.query,
		enabled,
	});
}
