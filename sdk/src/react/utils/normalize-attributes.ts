import type { TokenMetadata } from '../../../../api/src/adapters/marketplace';

export type StandardizedAttribute = {
	name: string;
	value: string;
	display_type?: string | null | undefined;
};

type StandardizedAttributes = Record<string, StandardizedAttribute>;

type AttributeCandidate = {
	name?: unknown;
	value?: unknown;
	trait_type?: unknown;
	display_type?: unknown;
};

function isValidAttributePair(candidate: AttributeCandidate): candidate is
	| { name: string; value: string | number; display_type?: string | null }
	| {
			trait_type: string;
			value: string | number;
			display_type?: string | null;
	  } {
	return (
		(typeof candidate.name === 'string' ||
			typeof candidate.trait_type === 'string') &&
		(typeof candidate.value === 'string' ||
			typeof candidate.value === 'number') &&
		(candidate.display_type === undefined ||
			candidate.display_type === null ||
			typeof candidate.display_type === 'string')
	);
}

/**
 * Processes token metadata attributes into a standardized format
 * Handles both array-based attributes (OpenSea standard) and object-based attributes
 * @param attributes - Token attributes from metadata
 * @returns Object with standardized attributes containing name, value, and optional display_type
 */
export function processAttributes(
	attributes: TokenMetadata['attributes'],
): StandardizedAttributes {
	// Handle array-based attributes (e.g., OpenSea standard)
	if (Array.isArray(attributes)) {
		return Object.fromEntries(
			attributes
				// Filter out non-object attributes
				.filter(
					(attr): attr is AttributeCandidate =>
						attr !== null && typeof attr === 'object',
				)
				// Ensure attributes have valid name/value pairs
				.filter(isValidAttributePair)
				// Convert to [name, StandardizedAttribute] pairs
				.map((attr) => {
					const name = 'name' in attr ? attr.name : attr.trait_type;
					return [
						name,
						{
							name,
							value: String(attr.value),
							display_type: attr.display_type,
						},
					];
				}),
		);
	}

	// Handle object-based attributes
	if (attributes && typeof attributes === 'object') {
		return Object.fromEntries(
			Object.entries(attributes).map(([key, value]) => [
				key,
				{
					name: key,
					value:
						typeof value === 'object' && value !== null
							? JSON.stringify(value)
							: String(value),
					display_type: undefined,
				},
			]),
		);
	}

	return {};
}
