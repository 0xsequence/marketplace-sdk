import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import type { MarketplaceKind } from '../../_internal';
import {
	checkoutKeys,
	getMarketplaceClient,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../../_internal';
import type {
	CheckoutOptionsMarketplaceArgs,
	CheckoutOptionsMarketplaceReturn,
} from '../../_internal/api/marketplace.gen';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchCheckoutOptionsParams
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
export async function fetchCheckoutOptions(
	params: FetchCheckoutOptionsParams,
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

export type CheckoutOptionsQueryOptions =
	ValuesOptional<FetchCheckoutOptionsParams> & {
		query?: StandardQueryOptions;
	};

export function getCheckoutOptionsQueryKey(
	params: CheckoutOptionsQueryOptions,
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

	return [...checkoutKeys.options, apiArgs] as const;
}

export function checkoutOptionsQueryOptions(
	params: CheckoutOptionsQueryOptions,
) {
	const enabled = Boolean(
		params.chainId &&
			params.walletAddress &&
			params.orders?.length &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getCheckoutOptionsQueryKey(params),
		queryFn: () =>
			fetchCheckoutOptions({
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
