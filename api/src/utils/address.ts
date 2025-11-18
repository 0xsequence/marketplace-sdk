/**
 * Address transformation utilities
 */

import type { Address } from '../types/primitives';

/**
 * Normalize an address string to the Address type
 * Performs basic validation to ensure it's a valid Ethereum address format
 */
export function normalizeAddress(address: string): Address {
	if (!address.startsWith('0x')) {
		throw new Error(`Invalid address format: ${address}`);
	}
	return address as Address;
}

/**
 * Convert Address back to string (identity function, but useful for symmetry)
 */
export function toApiAddress(address: Address): string {
	return address;
}
