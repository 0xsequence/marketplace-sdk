export const dateToUnixTime = (date: Date): string =>
	Math.floor(date.getTime() / 1000).toString();
