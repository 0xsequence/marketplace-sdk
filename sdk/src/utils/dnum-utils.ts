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

export function toRawValue(value: dnum.Dnum): bigint {
	return value[0];
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

export function applyFeeMultiplier(
	amount: dnum.Dnum,
	feePercentage: number,
	operation: 'add' | 'subtract',
): dnum.Dnum {
	if (feePercentage === 0) {
		return amount;
	}

	const multiplier =
		operation === 'add' ? 1 + feePercentage / 100 : 1 - feePercentage / 100;

	const feeMultiplier = dnum.from(multiplier.toString(), amount[1]);
	return dnum.multiply(amount, feeMultiplier);
}

export function calculateFeeAmount(
	amount: dnum.Dnum,
	feePercentage: number,
): dnum.Dnum {
	if (feePercentage === 0) {
		return [0n, amount[1]];
	}

	const feeDecimal = dnum.from((feePercentage / 100).toString(), amount[1]);
	return dnum.multiply(amount, feeDecimal);
}

export { equal, greaterThan, lessThan, toNumber } from 'dnum';
