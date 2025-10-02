import { describe, expect, test, vi } from 'vitest';
import {
	dateToUnixTime,
	formatDateForLocale,
	getLocaleDateFormat,
	getUserLocale,
	usesDayMonthFormat,
} from '../date';

describe('date utils', () => {
	describe('dateToUnixTime', () => {
		test('should convert date to unix timestamp string', () => {
			const date = new Date('2024-01-01T00:00:00Z');
			const result = dateToUnixTime(date);
			expect(result).toBe('1704067200');
		});

		test('should handle current date', () => {
			const now = new Date();
			const result = dateToUnixTime(now);
			const expectedTimestamp = Math.floor(now.getTime() / 1000).toString();
			expect(result).toBe(expectedTimestamp);
		});

		test('should handle dates with milliseconds', () => {
			const date = new Date('2024-01-01T00:00:00.999Z');
			const result = dateToUnixTime(date);
			expect(result).toBe('1704067200');
		});

		test('should handle dates before unix epoch', () => {
			const date = new Date('1969-12-31T23:59:59Z');
			const result = dateToUnixTime(date);
			expect(result).toBe('-1');
		});
	});

	describe('getUserLocale', () => {
		test('should return navigator.language when available', () => {
			const mockNavigator = {
				language: 'en-GB',
				languages: ['en-GB', 'en-US'],
			};
			vi.stubGlobal('navigator', mockNavigator);

			const result = getUserLocale();
			expect(result).toBe('en-GB');
		});

		test('should fallback to first language in languages array', () => {
			const mockNavigator = {
				language: undefined,
				languages: ['de-DE', 'en-US'],
			};
			vi.stubGlobal('navigator', mockNavigator);

			const result = getUserLocale();
			expect(result).toBe('de-DE');
		});

		test('should return en-US as default fallback', () => {
			vi.stubGlobal('navigator', undefined);

			const result = getUserLocale();
			expect(result).toBe('en-US');
		});
	});

	describe('usesDayMonthFormat', () => {
		test('should return false for US locale', () => {
			expect(usesDayMonthFormat('en-US')).toBe(false);
		});

		test('should return false for Philippines locale', () => {
			expect(usesDayMonthFormat('en-PH')).toBe(false);
		});

		test('should return false for Canada locale', () => {
			expect(usesDayMonthFormat('en-CA')).toBe(false);
		});

		test('should return true for UK locale', () => {
			expect(usesDayMonthFormat('en-GB')).toBe(true);
		});

		test('should return true for German locale', () => {
			expect(usesDayMonthFormat('de-DE')).toBe(true);
		});

		test('should return true for French locale', () => {
			expect(usesDayMonthFormat('fr-FR')).toBe(true);
		});

		test('should use detected locale when none provided', () => {
			const mockNavigator = {
				language: 'en-GB',
				languages: ['en-GB'],
			};
			vi.stubGlobal('navigator', mockNavigator);

			expect(usesDayMonthFormat()).toBe(true);
		});
	});

	describe('getLocaleDateFormat', () => {
		test('should return DD/MM/YYYY format for European locales', () => {
			expect(getLocaleDateFormat('en-GB', false)).toBe('dd/MM/yyyy');
			expect(getLocaleDateFormat('de-DE', false)).toBe('dd/MM/yyyy');
		});

		test('should return MM/DD/YYYY format for US locale', () => {
			expect(getLocaleDateFormat('en-US', false)).toBe('MM/dd/yyyy');
		});

		test('should include time when requested', () => {
			expect(getLocaleDateFormat('en-GB', true)).toBe('dd/MM/yyyy HH:mm');
			expect(getLocaleDateFormat('en-US', true)).toBe('MM/dd/yyyy HH:mm');
		});

		test('should default to including time', () => {
			expect(getLocaleDateFormat('en-GB')).toBe('dd/MM/yyyy HH:mm');
		});
	});

	describe('formatDateForLocale', () => {
		const testDate = new Date('2025-12-16T14:30:00Z');

		test('should format date according to locale', () => {
			// Note: Intl.DateTimeFormat behavior may vary by environment
			const usFormat = formatDateForLocale(testDate, 'en-US', false);
			const gbFormat = formatDateForLocale(testDate, 'en-GB', false);

			// Both should contain the same date elements, just in different order
			expect(usFormat).toContain('12');
			expect(usFormat).toContain('16');
			expect(usFormat).toContain('2025');

			expect(gbFormat).toContain('12');
			expect(gbFormat).toContain('16');
			expect(gbFormat).toContain('2025');
		});

		test('should include time when requested', () => {
			const result = formatDateForLocale(testDate, 'en-US', true);
			// Check that time is included (format may vary by timezone)
			expect(result).toMatch(/\d{1,2}:\d{2}/);
		});

		test('should use detected locale when none provided', () => {
			const mockNavigator = {
				language: 'en-US',
				languages: ['en-US'],
			};
			vi.stubGlobal('navigator', mockNavigator);

			const result = formatDateForLocale(testDate, undefined, false);
			expect(result).toBeTruthy();
		});
	});
});
