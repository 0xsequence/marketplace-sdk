import { type Hex, toHex } from 'viem';

export const DEFAULT_PROOF = [toHex(0, { size: 32 })] as Hex[];
export const DEFAULT_DATA = '0x' as Hex;
