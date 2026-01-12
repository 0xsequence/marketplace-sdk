import { act, renderHook, waitFor } from '@testing-library/react';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { PropertyType } from '../../../_internal';
import { useFilterState } from './filter-state';

function createWrapper() {
	return function Wrapper({ children }: { children: ReactNode }) {
		return <NuqsTestingAdapter>{children}</NuqsTestingAdapter>;
	};
}

describe('useFilterState', () => {
	describe('filter options', () => {
		it('should initialize with empty filter options', () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			expect(result.current.filterOptions).toEqual([]);
		});

		it('should set filter options', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			const newFilters = [
				{ name: 'color', type: PropertyType.STRING, values: ['red', 'blue'] },
			];

			await act(async () => {
				await result.current.setFilterOptions(newFilters);
			});

			await waitFor(() => {
				expect(result.current.filterOptions).toEqual(newFilters);
			});
		});

		it('should check if filter is active', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			expect(result.current.isFilterActive('color')).toBe(false);

			await act(async () => {
				await result.current.setFilterOptions([
					{ name: 'color', type: PropertyType.STRING, values: ['red'] },
				]);
			});

			await waitFor(() => {
				expect(result.current.isFilterActive('color')).toBe(true);
			});
		});

		it('should get filter by name', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			const colorFilter = {
				name: 'color',
				type: PropertyType.STRING,
				values: ['red', 'blue'],
			};

			await act(async () => {
				await result.current.setFilterOptions([colorFilter]);
			});

			await waitFor(() => {
				expect(result.current.getFilter('color')).toEqual(colorFilter);
			});
		});

		it('should return undefined for non-existent filter', () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			expect(result.current.getFilter('nonexistent')).toBeUndefined();
		});

		it('should delete filter by name', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			await act(async () => {
				await result.current.setFilterOptions([
					{ name: 'color', type: PropertyType.STRING, values: ['red'] },
					{ name: 'size', type: PropertyType.STRING, values: ['large'] },
				]);
			});

			await waitFor(() => {
				expect(result.current.filterOptions).toHaveLength(2);
			});

			await act(async () => {
				result.current.deleteFilter('color');
			});

			await waitFor(() => {
				expect(result.current.filterOptions).toHaveLength(1);
				expect(result.current.getFilter('color')).toBeUndefined();
				expect(result.current.getFilter('size')).toBeDefined();
			});
		});
	});

	describe('string filter operations', () => {
		it('should toggle string filter value on', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			await act(async () => {
				result.current.toggleStringFilterValue('color', 'red');
			});

			await waitFor(() => {
				expect(result.current.isStringValueSelected('color', 'red')).toBe(true);
			});
		});

		it('should toggle string filter value off', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			await act(async () => {
				result.current.toggleStringFilterValue('color', 'red');
			});

			await waitFor(() => {
				expect(result.current.isStringValueSelected('color', 'red')).toBe(true);
			});

			await act(async () => {
				result.current.toggleStringFilterValue('color', 'red');
			});

			await waitFor(() => {
				expect(result.current.isStringValueSelected('color', 'red')).toBe(
					false,
				);
			});
		});

		it('should toggle multiple string values for same filter', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			await act(async () => {
				result.current.toggleStringFilterValue('color', 'red');
			});

			await waitFor(() => {
				expect(result.current.isStringValueSelected('color', 'red')).toBe(true);
			});

			await act(async () => {
				result.current.toggleStringFilterValue('color', 'blue');
			});

			await waitFor(() => {
				expect(result.current.isStringValueSelected('color', 'blue')).toBe(
					true,
				);
				expect(result.current.isStringValueSelected('color', 'red')).toBe(true);
			});
		});

		it('should remove filter when last string value is toggled off', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			await act(async () => {
				result.current.toggleStringFilterValue('color', 'red');
			});

			await waitFor(() => {
				expect(result.current.isFilterActive('color')).toBe(true);
			});

			await act(async () => {
				result.current.toggleStringFilterValue('color', 'red');
			});

			await waitFor(() => {
				expect(result.current.isFilterActive('color')).toBe(false);
			});
		});

		it('should check if string value is selected', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			expect(result.current.isStringValueSelected('color', 'red')).toBe(false);

			await act(async () => {
				result.current.toggleStringFilterValue('color', 'red');
			});

			await waitFor(() => {
				expect(result.current.isStringValueSelected('color', 'red')).toBe(true);
				expect(result.current.isStringValueSelected('color', 'blue')).toBe(
					false,
				);
			});
		});
	});

	describe('int filter operations', () => {
		it('should set int filter value', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			await act(async () => {
				result.current.setIntFilterValue('level', 1, 10);
			});

			await waitFor(() => {
				expect(result.current.isIntFilterActive('level')).toBe(true);
			});
		});

		it('should get int filter range', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			await act(async () => {
				result.current.setIntFilterValue('level', 5, 15);
			});

			await waitFor(() => {
				expect(result.current.getIntFilterRange('level')).toEqual([5, 15]);
			});
		});

		it('should return undefined for non-existent int filter range', () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			expect(result.current.getIntFilterRange('nonexistent')).toBeUndefined();
		});

		it('should check if int filter is active', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			expect(result.current.isIntFilterActive('level')).toBe(false);

			await act(async () => {
				result.current.setIntFilterValue('level', 1, 10);
			});

			await waitFor(() => {
				expect(result.current.isIntFilterActive('level')).toBe(true);
			});
		});

		it('should remove int filter when both min and max are 0', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			await act(async () => {
				result.current.setIntFilterValue('level', 1, 10);
			});

			await waitFor(() => {
				expect(result.current.isIntFilterActive('level')).toBe(true);
			});

			await act(async () => {
				result.current.setIntFilterValue('level', 0, 0);
			});

			await waitFor(() => {
				expect(result.current.isIntFilterActive('level')).toBe(false);
			});
		});

		it('should get filter values for int filter', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			await act(async () => {
				result.current.setIntFilterValue('level', 3, 7);
			});

			await waitFor(() => {
				const values = result.current.getFilterValues('level');
				expect(values).toEqual({
					type: PropertyType.INT,
					min: 3,
					max: 7,
				});
			});
		});

		it('should return undefined for filter values of non-existent filter', () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			expect(result.current.getFilterValues('nonexistent')).toBeUndefined();
		});
	});

	describe('search text', () => {
		it('should initialize with empty search text', () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			expect(result.current.searchText).toBe('');
		});

		it('should set search text', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			await act(async () => {
				await result.current.setSearchText('test query');
			});

			await waitFor(() => {
				expect(result.current.searchText).toBe('test query');
			});
		});
	});

	describe('listed only filter', () => {
		it('should initialize with listed only as false', () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			expect(result.current.showListedOnly).toBe(false);
		});

		it('should set listed only', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			await act(async () => {
				await result.current.setShowListedOnly(true);
			});

			await waitFor(() => {
				expect(result.current.showListedOnly).toBe(true);
			});
		});
	});

	describe('price filter', () => {
		it('should initialize with price filter as false', () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			expect(result.current.showPriceFilter).toBe(false);
		});

		it('should set price filter visibility', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			await act(async () => {
				await result.current.setShowPriceFilter(true);
			});

			await waitFor(() => {
				expect(result.current.showPriceFilter).toBe(true);
			});
		});

		it('should initialize with empty price filters', () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			expect(result.current.priceFilters).toEqual([]);
		});

		it('should set price filter with min and max', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			await act(async () => {
				result.current.setPriceFilter('0x123', '100', '500');
			});

			await waitFor(() => {
				const priceFilter = result.current.getPriceFilter('0x123');
				expect(priceFilter).toEqual({
					contractAddress: '0x123',
					min: '100',
					max: '500',
				});
			});
		});

		it('should set price filter with only min', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			await act(async () => {
				result.current.setPriceFilter('0x123', '100', undefined);
			});

			await waitFor(() => {
				const priceFilter = result.current.getPriceFilter('0x123');
				expect(priceFilter).toEqual({
					contractAddress: '0x123',
					min: '100',
				});
			});
		});

		it('should set price filter with only max', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			await act(async () => {
				result.current.setPriceFilter('0x123', undefined, '500');
			});

			await waitFor(() => {
				const priceFilter = result.current.getPriceFilter('0x123');
				expect(priceFilter).toEqual({
					contractAddress: '0x123',
					max: '500',
				});
			});
		});

		it('should remove price filter when both min and max are undefined', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			await act(async () => {
				result.current.setPriceFilter('0x123', '100', '500');
			});

			await waitFor(() => {
				expect(result.current.getPriceFilter('0x123')).toBeDefined();
			});

			await act(async () => {
				result.current.setPriceFilter('0x123', undefined, undefined);
			});

			await waitFor(() => {
				expect(result.current.getPriceFilter('0x123')).toBeUndefined();
			});
		});

		it('should update existing price filter for same contract', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			await act(async () => {
				result.current.setPriceFilter('0x123', '100', '500');
			});

			await waitFor(() => {
				expect(result.current.getPriceFilter('0x123')).toEqual({
					contractAddress: '0x123',
					min: '100',
					max: '500',
				});
			});

			await act(async () => {
				result.current.setPriceFilter('0x123', '200', '600');
			});

			await waitFor(() => {
				expect(result.current.getPriceFilter('0x123')).toEqual({
					contractAddress: '0x123',
					min: '200',
					max: '600',
				});
				expect(result.current.priceFilters).toHaveLength(1);
			});
		});

		it('should return undefined for non-existent price filter', () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			expect(result.current.getPriceFilter('0xnonexistent')).toBeUndefined();
		});
	});

	describe('clear all filters', () => {
		it('should clear all filter state', async () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			// Set up various filters
			await act(async () => {
				result.current.toggleStringFilterValue('color', 'red');
				result.current.setIntFilterValue('level', 1, 10);
				await result.current.setSearchText('test');
				await result.current.setShowListedOnly(true);
				await result.current.setShowPriceFilter(true);
				result.current.setPriceFilter('0x123', '100', '500');
			});

			await waitFor(() => {
				expect(result.current.filterOptions.length).toBeGreaterThan(0);
				expect(result.current.searchText).toBe('test');
				expect(result.current.showListedOnly).toBe(true);
				expect(result.current.showPriceFilter).toBe(true);
				expect(result.current.priceFilters.length).toBeGreaterThan(0);
			});

			await act(async () => {
				result.current.clearAllFilters();
			});

			await waitFor(() => {
				expect(result.current.filterOptions).toEqual([]);
				expect(result.current.searchText).toBe('');
				expect(result.current.showListedOnly).toBe(false);
				expect(result.current.showPriceFilter).toBe(false);
				expect(result.current.priceFilters).toEqual([]);
			});
		});
	});

	describe('serialize', () => {
		it('should expose serialize function', () => {
			const { result } = renderHook(() => useFilterState(), {
				wrapper: createWrapper(),
			});

			expect(result.current.serialize).toBeDefined();
			expect(typeof result.current.serialize).toBe('function');
		});
	});
});
