import { queryOptions } from '@tanstack/react-query';
import { type Address, formatUnits } from 'viem';
import type { SdkConfig } from '../../types';
import {
	type Currency,
	getQueryClient,
	type ValuesOptional,
} from '../_internal';
import type { StandardQueryOptions } from '../types/query';
import { marketCurrenciesQueryOptions } from './marketCurrencies';

export interface FetchConvertPriceToUSDParams {
	chainId: number;
	currencyAddress: Address;
	amountRaw: string;
	config: SdkConfig;
}

export interface ConvertPriceToUSDReturn {
	usdAmount: number;
	usdAmountFormatted: string;
}

/**
 * Converts a price amount from a specific currency to USD using exchange rates
 */
export async function fetchConvertPriceToUSD(
	params: FetchConvertPriceToUSDParams,
): Promise<ConvertPriceToUSDReturn> {
	const { chainId, currencyAddress, amountRaw, config } = params;

	const queryClient = getQueryClient();
	const currencies = (await queryClient.fetchQuery(
		marketCurrenciesQueryOptions({
			chainId,
			config,
		}),
	)) as Currency[];

	const currencyDetails = currencies.find(
		(c: Currency) =>
			c.contractAddress.toLowerCase() === currencyAddress.toLowerCase(),
	);

	if (!currencyDetails) {
		throw new Error('Currency not found');
	}

	const amountDecimal = Number(
		formatUnits(BigInt(amountRaw), currencyDetails.decimals),
	);
	const usdAmount = amountDecimal * currencyDetails.exchangeRate;

	return {
		usdAmount,
		usdAmountFormatted: usdAmount.toFixed(2),
	};
}

export type ConvertPriceToUSDQueryOptions =
	ValuesOptional<FetchConvertPriceToUSDParams> & {
		query?: StandardQueryOptions;
	};

export function convertPriceToUSDQueryOptions(
	params: ConvertPriceToUSDQueryOptions,
) {
	const enabled = Boolean(
		params.chainId &&
			params.currencyAddress &&
			params.amountRaw &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: ['currency', 'convertPriceToUSD', params],
		queryFn: () =>
			fetchConvertPriceToUSD({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				currencyAddress: params.currencyAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				amountRaw: params.amountRaw!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
			}),
		...params.query,
		enabled,
	});
}
