import type { Dnum } from 'dnum';
import * as dn from 'dnum';
import { useMemo } from 'react';
import { formatUnits, parseUnits } from 'viem';

export function usePriceFormatter(decimals: number) {
	return useMemo(
		() => ({
			format: (rawAmount: string): string => {
				if (!rawAmount || rawAmount === '0') return '0';
				try {
					return formatUnits(BigInt(rawAmount), decimals);
				} catch {
					return '0';
				}
			},
			parse: (displayValue: string): string => {
				if (!displayValue || displayValue === '0') return '0';
				try {
					return parseUnits(displayValue, decimals).toString();
				} catch {
					return '0';
				}
			},
		}),
		[decimals],
	);
}

export function useDnumFormatter() {
	return useMemo(
		() => ({
			format: (dnAmount: Dnum): string => {
				return dn.format(dnAmount);
			},
			formatWithOptions: (
				dnAmount: Dnum,
				options?: { digits?: number; compact?: boolean },
			) => {
				return dn.format(dnAmount, options);
			},
			parse: (displayValue: string, decimals: number): Dnum => {
				return dn.from(displayValue, decimals);
			},
			toString: (dnAmount: Dnum): string => {
				return dn.toString(dnAmount);
			},
		}),
		[],
	);
}
