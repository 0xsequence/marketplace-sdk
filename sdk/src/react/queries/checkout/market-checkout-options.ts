import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import type { MarketplaceKind } from '../../_internal';
import {
	getMarketplaceClient,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../../_internal';
import type {
	CheckoutOptionsMarketplaceArgs,
	CheckoutOptionsMarketplaceReturn,
} from '../../_internal/api/marketplace.gen';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchMarketCheckoutOptionsParams
	extends Omit<
		CheckoutOptionsMarketplaceArgs,
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
): Promise<CheckoutOptionsMarketplaceReturn> {
	const { chainId, walletAddress, orders, config, additionalFee } = params;

	const client = getMarketplaceClient(config);

	const apiArgs: CheckoutOptionsMarketplaceArgs = {
		chainId: String(chainId),
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
	const apiArgs = {
		chainId: String(params.chainId),
		wallet: params.walletAddress,
		orders: params.orders?.map((order) => ({
			contractAddress: order.collectionAddress,
			orderId: order.orderId,
			marketplace: order.marketplace,
		})),
		additionalFee: params.additionalFee,
	} satisfies QueryKeyArgs<CheckoutOptionsMarketplaceArgs>;

	return ['checkout', 'market-checkout-options', apiArgs] as const;
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
