import { format, getUnixTime } from 'date-fns';
import { de, enGB, enUS, es, fr, it, ja, ko, pt, zhCN } from 'date-fns/locale';

export const dateToUnixTime = (date: Date) => getUnixTime(date).toString();

/**
 * Detects the user's locale preference from browser settings
 * @returns The user's preferred locale string (e.g., 'en-US', 'en-GB', 'de-DE')
 */
export const getUserLocale = (): string => {
	if (typeof navigator !== 'undefined') {
		// Try to get the most specific locale first
		if (navigator.language) {
			return navigator.language;
		}
		// Fallback to the first language in the languages array
		if (navigator.languages && navigator.languages.length > 0) {
			return navigator.languages[0];
		}
	}
	// Default fallback
	return 'en-US';
};

/**
 * Maps locale strings to date-fns locale objects
 * @param locale The locale string (e.g., 'en-US', 'en-GB', 'de-DE')
 * @returns The corresponding date-fns locale object
 */
const getDateFnsLocale = (locale: string) => {
	const localeMap: Record<string, typeof enUS> = {
		'en-US': enUS,
		'en-GB': enGB,
		'de-DE': de,
		de: de,
		'fr-FR': fr,
		fr: fr,
		'es-ES': es,
		es: es,
		'it-IT': it,
		it: it,
		'ja-JP': ja,
		ja: ja,
		'ko-KR': ko,
		ko: ko,
		'zh-CN': zhCN,
		zh: zhCN,
		'pt-BR': pt,
		'pt-PT': pt,
		pt: pt,
	};

	// Try exact match first, then try language code only
	return localeMap[locale] || localeMap[locale.split('-')[0]] || enUS;
};

/**
 * Determines if the user's locale uses DD/MM/YYYY format (European style)
 * vs MM/DD/YYYY format (US style)
 * @param locale Optional locale string, defaults to user's detected locale
 * @returns true if DD/MM/YYYY format should be used, false for MM/DD/YYYY
 */
export const usesDayMonthFormat = (locale?: string): boolean => {
	const userLocale = locale || getUserLocale();

	// US and a few other countries use MM/DD/YYYY format
	const monthDayCountries = [
		'en-US', // United States
		'en-PH', // Philippines
		'en-CA', // Canada (though they also use DD/MM sometimes)
	];

	// Check if the locale starts with any of the month-day format countries
	return !monthDayCountries.some(
		(country) =>
			userLocale.startsWith(country.split('-')[0]) &&
			(userLocale === country || userLocale.startsWith(country)),
	);
};

/**
 * Gets the appropriate date format string based on user's locale
 * @param locale Optional locale string, defaults to user's detected locale
 * @param includeTime Whether to include time in the format
 * @returns Date format string compatible with date-fns format function
 */
export const getLocaleDateFormat = (
	locale?: string,
	includeTime = true,
): string => {
	const isDayMonthFormat = usesDayMonthFormat(locale);
	const dateFormat = isDayMonthFormat ? 'dd/MM/yyyy' : 'MM/dd/yyyy';

	return includeTime ? `${dateFormat} HH:mm` : dateFormat;
};

/**
 * Formats a date according to the user's locale preferences using date-fns
 * @param date The date to format
 * @param locale Optional locale string, defaults to user's detected locale
 * @param includeTime Whether to include time in the format
 * @returns Formatted date string
 */
export const formatDateForLocale = (
	date: Date,
	locale?: string,
	includeTime = true,
): string => {
	const userLocale = locale || getUserLocale();
	const dateFnsLocale = getDateFnsLocale(userLocale);
	const formatString = getLocaleDateFormat(userLocale, includeTime);

	return format(date, formatString, { locale: dateFnsLocale });
};
