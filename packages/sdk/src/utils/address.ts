export const truncateMiddle = (
	address: string,
	minPrefix = 20,
	minSuffix = 3,
): string => {
	if (minPrefix + minSuffix >= 40) {
		return address;
	}
	return `${address.substring(0, 2 + minPrefix)}…${address.substring(address.length - minSuffix)}`;
};

export const truncateEnd = (text: string | undefined, truncateAt: number): string => {
	if (!text) return '';

	let finalText = text;

	if (text.length >= truncateAt) {
		finalText = `${text.slice(0, truncateAt)}...`;
	}

	return finalText;
};

export const compareAddress = (a = '', b = ''): boolean => {
	return a.toLowerCase() === b.toLowerCase();
};
