import type { TokenId } from '../types/primitives';

/**
 * Normalize any token identifier to bigint
 */
export function normalizeTokenId(tokenId: string | number | bigint): TokenId {
	if (typeof tokenId === 'bigint') return tokenId;
	if (typeof tokenId === 'string') return BigInt(tokenId);
	return BigInt(tokenId);
}

/**
 * Convert tokenId to API format (string)
 */
export function toApiTokenId(tokenId: TokenId): string {
	return tokenId.toString();
}
