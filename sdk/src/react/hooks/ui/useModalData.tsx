'use client';

import type { Address } from 'viem';
import { useCollection, useMarketCurrencies } from '../data';
import { useCurrency } from '../data/market/useCurrency';

interface UseModalDataConfig {
	chainId: number;
	collectionAddress: Address;
	currencyAddress?: Address;
}

export const useModalData = ({
	chainId,
	collectionAddress,
	currencyAddress,
}: UseModalDataConfig) => {
	const isLoading =
		collectionQuery.isLoading ||
		currenciesQuery.isLoading ||
		currencyQuery.isLoading;

	const isError =
		collectionQuery.isError || currenciesQuery.isError || currencyQuery.isError;

	const firstError =
		collectionQuery.error || currenciesQuery.error || currencyQuery.error;

	return {
		data: {
			collection: collectionQuery.data,
			currencies: currenciesQuery.data,
			currency: currencyQuery.data,
		},
		isLoading,
		isError,
		firstError,
	} as const;
};
