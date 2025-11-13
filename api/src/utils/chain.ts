import type { ChainId } from '../types/primitives';

/**
 * Normalize any chain identifier to number
 */
export function normalizeChainId(chainId: string | number | bigint): ChainId {
	if (typeof chainId === 'number') return chainId;
	if (typeof chainId === 'bigint') return Number(chainId);
	return Number(chainId);
}

/**
 * Convert chainId to API format (string) for metadata service
 */
export function toMetadataChainId(chainId: ChainId): string {
	return chainId.toString();
}
