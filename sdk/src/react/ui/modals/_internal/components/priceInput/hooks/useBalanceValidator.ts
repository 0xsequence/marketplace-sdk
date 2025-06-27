import type { Dnum } from 'dnum';
import * as dn from 'dnum';
import { useMemo } from 'react';

export function useBalanceValidator(
	balance: bigint | undefined,
	priceAmountRaw: string,
	enabled: boolean,
) {
	return useMemo(() => {
		if (!enabled || !balance || !priceAmountRaw || priceAmountRaw === '0') {
			return false;
		}

		try {
			return BigInt(priceAmountRaw) > balance;
		} catch {
			return false;
		}
	}, [balance, priceAmountRaw, enabled]);
}

export function useDnumBalanceValidator(
	balance: bigint | undefined,
	dnPrice: Dnum | undefined,
	enabled: boolean,
) {
	return useMemo(() => {
		if (!enabled || !balance || !dnPrice) {
			return false;
		}

		// Convert balance to DNUM with same decimals as price for comparison
		const dnBalance: Dnum = [balance, dnPrice[1]];
		return dn.greaterThan(dnPrice, dnBalance);
	}, [balance, dnPrice, enabled]);
}
