/**
 * Type normalization utilities
 *
 * Converts between API types and SDK-friendly types:
 * - string → Address (validated 0x-prefixed address)
 * - string/number → ChainId (number)
 * - string/number → TokenId (bigint)
 * - string → bigint (with safe parsing and formatting)
 */

import type { Address, ChainId, TokenId } from '../types/primitives';

// ============================================================================
// Address Normalization
// ============================================================================

/**
 * Normalize an address string to the Address type
 * Performs validation to ensure it's a valid Ethereum address format
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

/** Convert Address back to string (identity function, useful for symmetry) */
export function toApiAddress(address: Address): string {
	return address;
}

// ============================================================================
// ChainId Normalization
// ============================================================================

/** Normalize any chain identifier to number */
export function normalizeChainId(chainId: string | number | bigint): ChainId {
	if (typeof chainId === 'number') return chainId;
	if (typeof chainId === 'bigint') return Number(chainId);
	return Number(chainId);
}

/** Convert chainId to API format (string) for metadata service */
export function toMetadataChainId(chainId: ChainId): string {
	return chainId.toString();
}

// ============================================================================
// TokenId Normalization
// ============================================================================

/** Normalize any token identifier to bigint */
export function normalizeTokenId(tokenId: string | number | bigint): TokenId {
	if (typeof tokenId === 'bigint') return tokenId;
	if (typeof tokenId === 'string') return BigInt(tokenId);
	return BigInt(tokenId);
}

/** Convert tokenId to API format (string) */
export function toApiTokenId(tokenId: TokenId): string {
	return tokenId.toString();
}

// ============================================================================
// BigInt Utilities
// ============================================================================

/** Safely parse string to bigint */
export function parseBigInt(value: string | number | bigint): bigint {
	if (typeof value === 'bigint') return value;
	if (typeof value === 'number') return BigInt(value);
	try {
		return BigInt(value);
	} catch {
		return 0n;
	}
}

/** Format bigint for display (with decimals) */
export function formatAmount(amount: bigint, decimals: number): string {
	const str = amount.toString().padStart(decimals + 1, '0');
	const intPart = str.slice(0, -decimals) || '0';
	const decPart = str.slice(-decimals);
	return `${intPart}.${decPart}`;
}

/** Parse formatted amount back to bigint */
export function parseAmount(value: string, decimals: number): bigint {
	const [intPart = '0', decPart = ''] = value.split('.');
	const paddedDec = decPart.padEnd(decimals, '0').slice(0, decimals);
	return BigInt(intPart + paddedDec);
}
