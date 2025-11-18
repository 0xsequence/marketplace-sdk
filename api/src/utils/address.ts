/**
 * Address transformation utilities
 */

import type { Address } from '../types/primitives';

/**
 * Normalize an address string to the Address type
 * Performs validation to ensure it's a valid Ethereum address format
 * @param address - Address string from API
 * @returns Validated Address type
 * @throws Error if address format is invalid
 */
export function normalizeAddress(address: string): Address {
	if (!address) {
		throw new Error('Address cannot be empty');
	}

	if (!address.startsWith('0x')) {
		throw new Error(`Invalid address format: missing 0x prefix - ${address}`);
	}

	// Ethereum addresses are 20 bytes (40 hex chars) + '0x' prefix = 42 chars
	if (address.length !== 42) {
		throw new Error(
			`Invalid address length: expected 42 characters, got ${address.length} - ${address}`,
		);
	}

	// Validate hex characters (0-9, a-f, A-F)
	const hexPattern = /^0x[0-9a-fA-F]{40}$/;
	if (!hexPattern.test(address)) {
		throw new Error(
			`Invalid address format: contains non-hex characters - ${address}`,
		);
	}

	return address as Address;
}

/**
 * Convert Address back to string (identity function, but useful for symmetry)
 */
export function toApiAddress(address: Address): string {
	return address;
}
