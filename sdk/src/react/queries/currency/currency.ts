import { queryOptions, skipToken } from '@tanstack/react-query';
import type { Address } from 'viem';
import {
	type Currency,
	getMarketplaceClient,
	getQueryClient,
	type SdkQueryParams,
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

	let currencies = queryClient.getQueryData(['currency', 'list', chainId]) as
		| Currency[]
		| undefined;

	if (!currencies) {
		const marketplaceClient = getMarketplaceClient(config);
		currencies = await marketplaceClient
			.listCurrencies({ chainId })
			.then((resp) => resp.currencies as Currency[]);
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
		chainId: String(params.chainId!),
		currencyAddress: params.currencyAddress!,
	};

	return ['currency', 'currency', apiArgs] as const;
}

export function currencyQueryOptions(params: CurrencyQueryOptions) {
	const enabled = Boolean(
		params.chainId &&
			params.currencyAddress &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getCurrencyQueryKey(params),
		queryFn:
			params.chainId && params.currencyAddress && params.config
				? () =>
						fetchCurrency({
							// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
							chainId: params.chainId!,
							// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
							currencyAddress: params.currencyAddress!,
							// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
							config: params.config!,
						})
				: skipToken,
		...params.query,
		enabled,
	});
}
