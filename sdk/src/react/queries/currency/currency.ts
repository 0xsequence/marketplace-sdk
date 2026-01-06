import type { Address } from 'viem';
import { isAddress } from 'viem';
import {
	buildQueryOptions,
	type Currency,
	getMarketplaceClient,
	getQueryClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';

export interface FetchCurrencyParams {
	chainId: number;
	currencyAddress: Address;
}

/**
 * Fetches currency details from the marketplace API
 */
export async function fetchCurrency(
	params: WithRequired<
		CurrencyQueryOptions,
		'chainId' | 'currencyAddress' | 'config'
	>,
): Promise<Currency | undefined> {
	const { chainId, currencyAddress, config } = params;
	const queryClient = getQueryClient();

	let currencies = queryClient.getQueryData<Currency[]>([
		'currency',
		'list',
		chainId,
	]);

	if (!currencies) {
		const marketplaceClient = getMarketplaceClient(config);
		const response = await marketplaceClient.listCurrencies({ chainId });
		currencies = response.currencies;
	}

	if (!currencies?.length) {
		throw new Error('No currencies returned');
	}
	const currency = currencies.find(
		(currency) =>
			currency.contractAddress.toLowerCase() === currencyAddress.toLowerCase(),
	);

	if (!currency) {
		throw new Error('Currency not found');
	}

	return currency;
}

export type CurrencyQueryOptions = SdkQueryParams<FetchCurrencyParams>;

export function getCurrencyQueryKey(params: CurrencyQueryOptions) {
	const apiArgs = {
		chainId: String(params.chainId ?? 0),
		currencyAddress: params.currencyAddress ?? '',
	};

	return ['currency', 'currency', apiArgs] as const;
}

export function currencyQueryOptions(
	params: WithOptionalParams<
		WithRequired<CurrencyQueryOptions, 'chainId' | 'currencyAddress' | 'config'>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getCurrencyQueryKey,
			requiredParams: ['chainId', 'currencyAddress', 'config'] as const,
			fetcher: fetchCurrency,
			customValidation: (p) =>
				!!p.currencyAddress && isAddress(p.currencyAddress),
		},
		params,
	);
}
