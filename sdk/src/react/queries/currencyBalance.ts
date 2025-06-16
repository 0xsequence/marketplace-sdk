import { queryOptions, skipToken } from '@tanstack/react-query';
import {
	type Address,
	type PublicClient,
	erc20Abi,
	formatUnits,
	zeroAddress,
} from 'viem';
import type { ValuesOptional } from '../_internal';
import type { StandardQueryOptions } from '../types/query';

export interface FetchCurrencyBalanceParams {
	currencyAddress: Address;
	chainId: number;
	userAddress: Address;
	publicClient: PublicClient;
}

export interface CurrencyBalanceReturn {
	value: bigint;
	formatted: string;
}

/**
 * Fetches currency balance for a user address using wagmi's publicClient
 */
export async function fetchCurrencyBalance(
	params: FetchCurrencyBalanceParams,
): Promise<CurrencyBalanceReturn> {
	const { currencyAddress, userAddress, publicClient } = params;

	if (currencyAddress === zeroAddress) {
		const balance = await publicClient.getBalance({
			address: userAddress,
		});
		return {
			value: balance,
			formatted: formatUnits(balance, 18),
		};
	}

	const [balance, decimals] = await Promise.all([
		publicClient.readContract({
			address: currencyAddress,
			abi: erc20Abi,
			functionName: 'balanceOf',
			args: [userAddress],
		}),
		publicClient.readContract({
			address: currencyAddress,
			abi: erc20Abi,
			functionName: 'decimals',
		}),
	]);

	return {
		value: balance,
		formatted: formatUnits(balance, decimals),
	};
}

export type CurrencyBalanceQueryOptions =
	ValuesOptional<FetchCurrencyBalanceParams> & {
		query?: StandardQueryOptions;
	};

export function currencyBalanceQueryOptions(
	params: CurrencyBalanceQueryOptions | typeof skipToken,
) {
	if (params === skipToken) {
		return queryOptions({
			queryKey: ['currency', 'balance', skipToken],
			queryFn: skipToken,
		});
	}

	const enabled = Boolean(
		params.currencyAddress &&
			params.chainId &&
			params.userAddress &&
			params.publicClient &&
			(params.query?.enabled ?? true),
	);

	if (!enabled) {
		return queryOptions({
			queryKey: ['currency', 'balance', params],
			queryFn: skipToken,
			...params.query,
			enabled: false,
		});
	}

	return queryOptions({
		queryKey: ['currency', 'balance', params],
		queryFn: () =>
			fetchCurrencyBalance({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				currencyAddress: params.currencyAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				userAddress: params.userAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				publicClient: params.publicClient!,
			}),
		...params.query,
		enabled,
	});
}
