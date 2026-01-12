import type { Address, ChainId } from '@0xsequence/api-client';
import {
	buildQueryOptions,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';
import { fetchConvertPriceToUSD } from './convert-to-usd';

export type FetchComparePricesParams = {
	chainId?: ChainId;
	priceAmountRaw?: string;
	priceCurrencyAddress?: Address;
	compareToPriceAmountRaw?: string;
	compareToPriceCurrencyAddress?: Address;
};

export type ComparePricesReturn = {
	percentageDifference: number;
	percentageDifferenceFormatted: string;
	status: 'above' | 'same' | 'below';
};

export type ComparePricesQueryOptions =
	SdkQueryParams<FetchComparePricesParams>;

/**
 * Compares prices between different currencies by converting both to USD
 */
export async function fetchComparePrices(
	params: WithRequired<
		ComparePricesQueryOptions,
		| 'chainId'
		| 'priceAmountRaw'
		| 'priceCurrencyAddress'
		| 'compareToPriceAmountRaw'
		| 'compareToPriceCurrencyAddress'
		| 'config'
	>,
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

export function getComparePricesQueryKey(params: ComparePricesQueryOptions) {
	const apiArgs = {
		chainId: params.chainId,
		priceAmountRaw: params.priceAmountRaw,
		priceCurrencyAddress: params.priceCurrencyAddress,
		compareToPriceAmountRaw: params.compareToPriceAmountRaw,
		compareToPriceCurrencyAddress: params.compareToPriceCurrencyAddress,
	};

	return ['currency', 'compare-prices', apiArgs] as const;
}

export function comparePricesQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			ComparePricesQueryOptions,
			| 'chainId'
			| 'priceAmountRaw'
			| 'priceCurrencyAddress'
			| 'compareToPriceAmountRaw'
			| 'compareToPriceCurrencyAddress'
			| 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getComparePricesQueryKey,
			requiredParams: [
				'chainId',
				'priceAmountRaw',
				'priceCurrencyAddress',
				'compareToPriceAmountRaw',
				'compareToPriceCurrencyAddress',
				'config',
			] as const,
			fetcher: fetchComparePrices,
		},
		params,
	);
}
