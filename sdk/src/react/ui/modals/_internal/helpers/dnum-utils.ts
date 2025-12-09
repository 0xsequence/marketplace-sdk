import * as dnum from 'dnum';

export function parseInput(input: string, decimals: number): dnum.Dnum {
	if (!input || input === '') {
		return [0n, decimals];
	}

	try {
		return dnum.from(input, decimals);
	} catch {
		return [0n, decimals];
	}
}

export function isZero(value: dnum.Dnum): boolean {
	return value[0] === 0n;
}

export function isPositive(value: dnum.Dnum): boolean {
	return value[0] > 0n;
}

export function toBigIntString(value: dnum.Dnum): string {
	return value[0].toString();
}

export function fromBigIntString(
	bigIntString: string,
	decimals: number,
): dnum.Dnum {
	try {
		const value = BigInt(bigIntString);
		return [value, decimals];
	} catch {
		return [0n, decimals];
	}
}

// Re-export commonly used dnum functions for convenience
export { equal, greaterThan, lessThan, toNumber } from 'dnum';
