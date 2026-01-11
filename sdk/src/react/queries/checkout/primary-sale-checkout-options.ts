import type {
	CheckoutOptionsSalesContractRequest,
	CheckoutOptionsSalesContractResponse,
	GetPrimarySaleCheckoutOptionsRequest,
} from '@0xsequence/api-client';
import { isAddress } from 'viem';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';

export type FetchPrimarySaleCheckoutOptionsParams =
	GetPrimarySaleCheckoutOptionsRequest;

/**
 * Fetches checkout options for primary sales contract from the Marketplace API
 */
export async function fetchPrimarySaleCheckoutOptions(
	params: WithRequired<
		PrimarySaleCheckoutOptionsQueryOptions,
		| 'chainId'
		| 'walletAddress'
		| 'contractAddress'
		| 'collectionAddress'
		| 'items'
		| 'config'
	>,
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
	SdkQueryParams<FetchPrimarySaleCheckoutOptionsParams>;

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
	params: WithOptionalParams<
		WithRequired<
			PrimarySaleCheckoutOptionsQueryOptions,
			| 'chainId'
			| 'walletAddress'
			| 'contractAddress'
			| 'collectionAddress'
			| 'items'
			| 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getPrimarySaleCheckoutOptionsQueryKey,
			requiredParams: [
				'chainId',
				'walletAddress',
				'contractAddress',
				'collectionAddress',
				'items',
				'config',
			] as const,
			fetcher: fetchPrimarySaleCheckoutOptions,
			customValidation: (params) =>
				(params.items?.length ?? 0) > 0 &&
				!!params.collectionAddress &&
				isAddress(params.collectionAddress),
		},
		params,
	);
}
