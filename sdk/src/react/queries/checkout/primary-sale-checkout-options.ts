import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import {
	getMarketplaceClient,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../../_internal';
import type {
	CheckoutOptionsItem,
	CheckoutOptionsSalesContractArgs,
	CheckoutOptionsSalesContractReturn,
} from '../../_internal/api/marketplace.gen';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchPrimarySaleCheckoutOptionsParams
	extends Omit<CheckoutOptionsSalesContractArgs, 'chainId' | 'wallet'> {
	chainId: number;
	walletAddress: Address;
	contractAddress: string;
	collectionAddress: string;
	items: Array<CheckoutOptionsItem>;
	config: SdkConfig;
}

/**
 * Fetches checkout options for primary sales contract from the Marketplace API
 */
export async function fetchPrimarySaleCheckoutOptions(
	params: FetchPrimarySaleCheckoutOptionsParams,
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

export type PrimarySaleCheckoutOptionsQueryOptions =
	ValuesOptional<FetchPrimarySaleCheckoutOptionsParams> & {
		query?: StandardQueryOptions;
	};

export function getPrimarySaleCheckoutOptionsQueryKey(
	params: PrimarySaleCheckoutOptionsQueryOptions,
) {
	const apiArgs = {
		chainId: String(params.chainId),
		wallet: params.walletAddress,
		contractAddress: params.contractAddress,
		collectionAddress: params.collectionAddress,
		items: params.items,
	} satisfies QueryKeyArgs<CheckoutOptionsSalesContractArgs>;

	return ['checkout', 'primary-sale-checkout-options', apiArgs] as const;
}

export function primarySaleCheckoutOptionsQueryOptions(
	params: PrimarySaleCheckoutOptionsQueryOptions,
) {
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
		queryKey: getPrimarySaleCheckoutOptionsQueryKey(params),
		queryFn: () =>
			fetchPrimarySaleCheckoutOptions({
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
