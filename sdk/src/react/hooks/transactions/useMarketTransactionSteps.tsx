import type { Address } from '@0xsequence/api-client';
import {
	type AdditionalFee,
	type MarketplaceKind,
	type Step,
	WalletKind,
} from '@0xsequence/api-client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { getMarketplaceClient } from '../../_internal/api';
import { useConfig } from '../config';

export interface UseMarketTransactionStepsParams {
	chainId: number;
	collectionAddress: Address;
	buyer: Address;
	marketplace: MarketplaceKind;
	orderId: string;
	tokenId: bigint;
	quantity: bigint;
	additionalFees?: AdditionalFee[];
	enabled?: boolean;
}

/**
 * Hook to generate transaction steps for market transactions (secondary sales)
 * This directly calls the marketplace API without using generators
 */
export function useMarketTransactionSteps({
	chainId,
	collectionAddress,
	buyer,
	marketplace,
	orderId,
	tokenId,
	quantity,
	additionalFees = [],
	enabled = true,
}: UseMarketTransactionStepsParams) {
	const config = useConfig();
	const queryClient = useQueryClient();
	const marketplaceClient = useMemo(
		() => getMarketplaceClient(config),
		[config],
	);

	// Default to true when checkoutMode is undefined or 'trails'
	// Only false when explicitly set to 'crypto' or 'sequence-checkout'
	const useWithTrails =
		config.checkoutMode === 'trails' || config.checkoutMode === undefined;

	const queryKey = [
		'market-transaction-steps',
		{
			chainId,
			collectionAddress,
			buyer,
			orderId,
			tokenId,
			quantity,
			useWithTrails,
		},
	];

	const query = useQuery<
		{ steps: Step[]; canBeUsedWithTrails: boolean },
		Error
	>({
		queryKey,
		queryFn: async () => {
			const response = await marketplaceClient.generateBuyTransaction({
				chainId,
				collectionAddress,
				buyer,
				marketplace,
				ordersData: [
					{
						orderId,
						quantity,
						tokenId,
					},
				],
				additionalFees,
				walletType: WalletKind.unknown,
				useWithTrails,
			});

			return {
				steps: response.steps,
				canBeUsedWithTrails: response.resp?.canBeUsedWithTrails ?? false,
			};
		},
		enabled: enabled && !!buyer,
		retry: false,
	});

	// Abort and refetch every 3 seconds until we have data
	useEffect(() => {
		if (
			!query.data &&
			enabled &&
			buyer &&
			query.fetchStatus === 'fetching' &&
			!query.isError
		) {
			const intervalId = setInterval(() => {
				// Cancel all queries with this key
				queryClient.cancelQueries({ queryKey });

				query.refetch();
			}, 3000);

			return () => {
				clearInterval(intervalId);
			};
		}
	}, [
		query.data,
		enabled,
		buyer,
		query.fetchStatus,
		query.isError,
		query,
		queryClient,
		queryKey,
	]);

	return query;
}
