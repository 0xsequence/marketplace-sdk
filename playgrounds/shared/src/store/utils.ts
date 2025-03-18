import type { Hex } from 'viem';

export const isValidHexAddress = (address: Hex) =>
	typeof address === 'string' &&
	address.startsWith('0x') &&
	address.length === 42;

export const isNotUndefined = (value: string) =>
	value !== undefined && value !== null && value !== '';
