/**
 * Safely parse string to bigint
 */
export function parseBigInt(value: string | number | bigint): bigint {
	if (typeof value === 'bigint') return value;
	if (typeof value === 'number') return BigInt(value);
	try {
		return BigInt(value);
	} catch {
		return 0n;
	}
}

/**
 * Format bigint for display (with decimals)
 */
export function formatAmount(amount: bigint, decimals: number): string {
	const str = amount.toString().padStart(decimals + 1, '0');
	const intPart = str.slice(0, -decimals) || '0';
	const decPart = str.slice(-decimals);
	return `${intPart}.${decPart}`;
}

/**
 * Parse formatted amount back to bigint
 */
export function parseAmount(value: string, decimals: number): bigint {
	const [intPart = '0', decPart = ''] = value.split('.');
	const paddedDec = decPart.padEnd(decimals, '0').slice(0, decimals);
	return BigInt(intPart + paddedDec);
}
