import type { TokenMetadata } from '../../../../api/src/adapters/marketplace';

export type StandardizedProperty = {
	name: string;
	value: string;
};
type StandardizedProperties = Record<string, StandardizedProperty>;

/**
 * Processes token metadata properties into a standardized format
 * @param properties - Token properties from metadata
 * @returns Object with standardized properties containing name and value
 */
export function processProperties(
	properties: TokenMetadata['properties'],
): StandardizedProperties {
	// If properties is invalid or missing, return empty object
	if (
		!properties ||
		typeof properties !== 'object' ||
		Array.isArray(properties) ||
		Object.keys(properties).length === 0
	) {
		return {};
	}

	// Process properties into standardized format
	return Object.fromEntries(
		Object.entries(properties).map(([key, value]) => [
			key,
			{
				name: key,
				value:
					typeof value === 'object' && value !== null
						? // Handle nested objects with .value property or convert to JSON
							(() => {
								const nestedValue = (value as { value?: unknown }).value;
								if (nestedValue !== undefined) {
									if (typeof nestedValue === 'object' && nestedValue !== null) {
										return JSON.stringify(nestedValue);
									}
									if (
										typeof nestedValue === 'string' ||
										typeof nestedValue === 'number' ||
										typeof nestedValue === 'boolean'
									) {
										return String(nestedValue);
									}
									// Handle other primitive types (bigint, symbol, etc.)
									return JSON.stringify(nestedValue);
								}
								return JSON.stringify(value);
							})()
						: value !== null && value !== undefined
							? String(value)
							: '',
			},
		]),
	);
}
