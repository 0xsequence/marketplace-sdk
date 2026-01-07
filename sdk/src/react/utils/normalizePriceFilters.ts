import type { PriceFilter } from '../ssr';

type PriceLike = {
	contractAddress: string;
	min?: string | bigint;
	max?: string | bigint;
};

function normalizePriceFilters(
	filters?: PriceLike[],
): PriceFilter[] | undefined {
	if (!filters) return undefined;

	return filters.map(({ contractAddress, min, max }) => ({
		contractAddress,
		...(min !== undefined && {
			min: typeof min === 'bigint' ? min : BigInt(min),
		}),
		...(max !== undefined && {
			max: typeof max === 'bigint' ? max : BigInt(max),
		}),
	}));
}

export { normalizePriceFilters };
