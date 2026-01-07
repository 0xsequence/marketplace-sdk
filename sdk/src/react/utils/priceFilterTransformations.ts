import type { UrlPriceFilter } from '../hooks';
import type { PriceFilter } from '../ssr';

/**
 * Converts URL-safe price filters (strings) to API price filters (BigInt)
 */
function convertUrlPriceFiltersToApi(
	urlFilters?: UrlPriceFilter[],
): PriceFilter[] | undefined {
	if (!urlFilters) return undefined;
	return urlFilters.map((filter) => ({
		contractAddress: filter.contractAddress,
		...(filter.min && { min: BigInt(filter.min) }),
		...(filter.max && { max: BigInt(filter.max) }),
	}));
}

/**
 * Converts price filter strings to BigInt for API calls
 * Handles both string and bigint values for flexibility
 */
function transformPriceFilters(
	prices?: PriceFilter[],
): PriceFilter[] | undefined {
	if (!prices) return undefined;
	return prices.map((price) => ({
		contractAddress: price.contractAddress,
		...(price.min && {
			min: typeof price.min === 'string' ? BigInt(price.min) : price.min,
		}),
		...(price.max && {
			max: typeof price.max === 'string' ? BigInt(price.max) : price.max,
		}),
	}));
}

export { convertUrlPriceFiltersToApi, transformPriceFilters };
