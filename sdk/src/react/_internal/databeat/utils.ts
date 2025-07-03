// Flattens an object and turns it into a string and number object for use with analytics
// Ignores arrays and converts booleans to strings
export function flattenAnalyticsArgs(args: object) {
	const analyticsProps: Record<string, string> = {};
	const analyticsNums: Record<string, number> = {};

	function recurse(obj: object, prefix = '') {
		for (const [key, value] of Object.entries(obj)) {
			const path = prefix ? `${prefix}.${key}` : key;
			if (typeof value === 'string' || typeof value === 'boolean') {
				analyticsProps[path] = value.toString();
			} else if (typeof value === 'number') {
				analyticsNums[path] = value;
			} else if (isPojo(value)) {
				recurse(value, path);
			}
		}
	}

	recurse(args);
	return { analyticsProps, analyticsNums };
}

function isPojo(val: unknown): val is Record<string, unknown> {
	return typeof val === 'object' && val !== null && !Array.isArray(val);
}
