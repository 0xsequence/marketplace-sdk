export const dateToUnixTime = (date: Date) =>
	Math.floor(date.getTime() / 1000).toString();
