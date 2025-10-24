import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import type { ValuesOptional } from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';
import { fetchConvertPriceToUSD } from './convert-to-usd';

export interface FetchComparePricesParams {
	chainId: number;
	// First price details
	priceAmountRaw: string;
	priceCurrencyAddress: Address;
	// Second price details (to compare against)
	compareToPriceAmountRaw: string;
	compareToPriceCurrencyAddress: Address;
	config: SdkConfig;
}

export type ComparePricesReturn = {
	percentageDifference: number;
	percentageDifferenceFormatted: string;
	status: 'above' | 'same' | 'below';
};

/**
 * Compares prices between different currencies by converting both to USD
 */
export async function fetchComparePrices(
	params: FetchComparePricesParams,
): Promise<ComparePricesReturn> {
	const {
		chainId,
		priceAmountRaw,
		priceCurrencyAddress,
		compareToPriceAmountRaw,
		compareToPriceCurrencyAddress,
		config,
	} = params;

	const [priceUSD, compareToPriceUSD] = await Promise.all([
		fetchConvertPriceToUSD({
			chainId,
			currencyAddress: priceCurrencyAddress,
			amountRaw: priceAmountRaw,
			config,
		}),
		fetchConvertPriceToUSD({
			chainId,
			currencyAddress: compareToPriceCurrencyAddress,
			amountRaw: compareToPriceAmountRaw,
			config,
		}),
	]);

	const difference = priceUSD.usdAmount - compareToPriceUSD.usdAmount;

	if (compareToPriceUSD.usdAmount === 0) {
		throw new Error('Cannot compare to zero price');
	}

	const percentageDifference = (difference / compareToPriceUSD.usdAmount) * 100;
	const isAbove = percentageDifference > 0;
	const isSame = percentageDifference === 0;

	return {
		percentageDifference,
		percentageDifferenceFormatted: Math.abs(percentageDifference).toFixed(2),
		status: isAbove ? 'above' : isSame ? 'same' : 'below',
	};
}

export type ComparePricesQueryOptions =
	ValuesOptional<FetchComparePricesParams> & {
		query?: StandardQueryOptions;
	};

export function getComparePricesQueryKey(params: ComparePricesQueryOptions) {
	const apiArgs = {
		chainId: params.chainId!,
		priceAmountRaw: params.priceAmountRaw!,
		priceCurrencyAddress: params.priceCurrencyAddress!,
		compareToPriceAmountRaw: params.compareToPriceAmountRaw!,
		compareToPriceCurrencyAddress: params.compareToPriceCurrencyAddress!,
	};

	return ['currency', 'compare-prices', apiArgs] as const;
}

export function comparePricesQueryOptions(params: ComparePricesQueryOptions) {
	const enabled = Boolean(
		params.chainId &&
			params.priceAmountRaw &&
			params.priceCurrencyAddress &&
			params.compareToPriceAmountRaw &&
			params.compareToPriceCurrencyAddress &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getComparePricesQueryKey(params),
		queryFn: () =>
			fetchComparePrices({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				priceAmountRaw: params.priceAmountRaw!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				priceCurrencyAddress: params.priceCurrencyAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				compareToPriceAmountRaw: params.compareToPriceAmountRaw!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				compareToPriceCurrencyAddress: params.compareToPriceCurrencyAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
			}),
		...params.query,
		enabled,
	});
}
