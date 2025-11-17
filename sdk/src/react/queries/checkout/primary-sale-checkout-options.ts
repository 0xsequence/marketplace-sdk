import type {
	CheckoutOptionsItem,
	CheckoutOptionsSalesContractRequest,
	CheckoutOptionsSalesContractResponse,
} from '@0xsequence/marketplace-api';
import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type WithOptionalParams,
} from '../../_internal';

export interface FetchPrimarySaleCheckoutOptionsParams {
	chainId: number;
	walletAddress: Address;
	contractAddress: string;
	collectionAddress: string;
	items: CheckoutOptionsItem[];
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

export function getPrimarySaleCheckoutOptionsQueryKey(
	params: WithOptionalParams<FetchPrimarySaleCheckoutOptionsParams>,
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
	params: WithOptionalParams<FetchPrimarySaleCheckoutOptionsParams>,
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
			customValidation: (params) => (params.items?.length ?? 0) > 0,
		},
		params,
	);
}
