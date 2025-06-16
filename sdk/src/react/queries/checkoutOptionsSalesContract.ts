import { queryOptions, skipToken } from '@tanstack/react-query';
import type { Hex } from 'viem';
import type { SdkConfig } from '../../types';
import { type ValuesOptional, getMarketplaceClient } from '../_internal';
import type {
	CheckoutOptionsItem,
	CheckoutOptionsSalesContractArgs,
	CheckoutOptionsSalesContractReturn,
} from '../_internal/api/marketplace.gen';
import type { StandardQueryOptions } from '../types/query';

export interface FetchCheckoutOptionsSalesContractParams
	extends Omit<CheckoutOptionsSalesContractArgs, 'chainId' | 'wallet'> {
	chainId: number;
	walletAddress: Hex;
	contractAddress: string;
	collectionAddress: string;
	items: Array<CheckoutOptionsItem>;
	config: SdkConfig;
}

/**
 * Fetches checkout options for sales contract from the Marketplace API
 */
export async function fetchCheckoutOptionsSalesContract(
	params: FetchCheckoutOptionsSalesContractParams,
): Promise<CheckoutOptionsSalesContractReturn> {
	const {
		chainId,
		walletAddress,
		contractAddress,
		collectionAddress,
		items,
		config,
	} = params;

	const client = getMarketplaceClient(config);

	const apiArgs: CheckoutOptionsSalesContractArgs = {
		chainId: String(chainId),
		wallet: walletAddress,
		contractAddress,
		collectionAddress,
		items,
	};

	const result = await client.checkoutOptionsSalesContract(apiArgs);
	return result;
}

export type CheckoutOptionsSalesContractQueryOptions =
	ValuesOptional<FetchCheckoutOptionsSalesContractParams> & {
		query?: StandardQueryOptions;
	};

export function checkoutOptionsSalesContractQueryOptions(
	params: CheckoutOptionsSalesContractQueryOptions | typeof skipToken,
) {
	if (params === skipToken) {
		return queryOptions({
			queryKey: ['checkout', 'options', 'salesContract', skipToken],
			queryFn: skipToken,
		});
	}

	const enabled = Boolean(
		params.chainId &&
			params.walletAddress &&
			params.contractAddress &&
			params.collectionAddress &&
			params.items?.length &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: ['checkout', 'options', 'salesContract', params],
		queryFn: () =>
			fetchCheckoutOptionsSalesContract({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				walletAddress: params.walletAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				contractAddress: params.contractAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				items: params.items!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
			}),
		...params.query,
		enabled,
	});
}
