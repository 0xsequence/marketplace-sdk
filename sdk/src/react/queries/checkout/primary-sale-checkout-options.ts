import type {
	CheckoutOptionsSalesContractRequest,
	CheckoutOptionsSalesContractResponse,
} from '@0xsequence/marketplace-api';
import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import { getMarketplaceClient, type ValuesOptional } from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchPrimarySaleCheckoutOptionsParams
	extends Omit<CheckoutOptionsSalesContractRequest, 'chainId' | 'wallet'> {
	chainId: number;
	walletAddress: Address;
	config: SdkConfig;
}

/**
 * Fetches checkout options for primary sales contract from the Marketplace API
 */
export async function fetchPrimarySaleCheckoutOptions(
	params: FetchPrimarySaleCheckoutOptionsParams,
): Promise<CheckoutOptionsSalesContractResponse> {
	const {
		chainId,
		walletAddress,
		contractAddress,
		collectionAddress,
		items,
		config,
	} = params;

	const client = getMarketplaceClient(config);

	const apiArgs: CheckoutOptionsSalesContractRequest = {
		chainId,
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
	return [
		'checkout',
		'primary-sale',
		{
			chainId: params.chainId ?? 0,
			walletAddress: params.walletAddress ?? '0x',
			contractAddress: params.contractAddress ?? '',
			collectionAddress: params.collectionAddress ?? '',
			items: params.items ?? [],
		},
	] as const;
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
