import { formatUnits } from 'viem';
import type { Address } from '@0xsequence/api-client';
import {
	buildQueryOptions,
	type Currency,
	getQueryClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';
import { marketCurrenciesQueryOptions } from './list';

export type FetchConvertPriceToUSDParams = {
	chainId: number;
	currencyAddress: Address;
	amountRaw: string;
};

export type ConvertPriceToUSDReturn = {
	usdAmount: number;
	usdAmountFormatted: string;
};

export type ConvertPriceToUSDQueryOptions =
	SdkQueryParams<FetchConvertPriceToUSDParams>;

/**
 * Converts a price amount from a specific currency to USD using exchange rates
 */
export async function fetchConvertPriceToUSD(
	params: WithRequired<
		ConvertPriceToUSDQueryOptions,
		'chainId' | 'currencyAddress' | 'amountRaw' | 'config'
	>,
): Promise<ConvertPriceToUSDReturn> {
	const { chainId, currencyAddress, amountRaw, config } = params;

	const queryClient = getQueryClient();
	const currencies = await queryClient.fetchQuery(
		marketCurrenciesQueryOptions({
			chainId,
			config,
		}),
	);

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

export function getConvertPriceToUSDQueryKey(
	params: ConvertPriceToUSDQueryOptions,
) {
	const apiArgs = {
		chainId: params.chainId,
		currencyAddress: params.currencyAddress,
		amountRaw: params.amountRaw,
	};

	return ['currency', 'convert-to-usd', apiArgs] as const;
}

export function convertPriceToUSDQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			ConvertPriceToUSDQueryOptions,
			'chainId' | 'currencyAddress' | 'amountRaw' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getConvertPriceToUSDQueryKey,
			requiredParams: [
				'chainId',
				'currencyAddress',
				'amountRaw',
				'config',
			] as const,
			fetcher: fetchConvertPriceToUSD,
		},
		params,
	);
}
