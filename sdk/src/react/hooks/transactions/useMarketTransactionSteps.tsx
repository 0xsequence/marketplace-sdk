import type { Address } from '@0xsequence/api-client';
import {
	type AdditionalFee,
	type MarketplaceKind,
	type Step,
	WalletKind,
} from '@0xsequence/api-client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getMarketplaceClient } from '../../_internal/api';
import { useConfig, useConnectorMetadata } from '../config';

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
	const sequenceCheckoutModeOn =
		typeof config.checkoutMode === 'object'
			? config.checkoutMode.mode === 'sequence-checkout'
			: false;
	const marketplaceClient = useMemo(
		() => getMarketplaceClient(config),
		[config],
	);
	const { isSequence } = useConnectorMetadata();

	// Default to true when checkoutMode is undefined or 'trails'
	// Only false when explicitly set to 'crypto' or 'sequence-checkout'
	const useWithTrails =
		config.checkoutMode === 'trails' || config.checkoutMode === undefined;

	return useQuery<{ steps: Step[]; canBeUsedWithTrails: boolean }, Error>({
		queryKey: [
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
		],
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
				// We need to set walletType to unknown when its web-sdk/checkout
				walletType: sequenceCheckoutModeOn
					? WalletKind.unknown
					: isSequence
						? WalletKind.sequence
						: WalletKind.unknown,
				useWithTrails,
			});

			return {
				steps: response.steps,
				canBeUsedWithTrails: response.resp?.canBeUsedWithTrails ?? false,
			};
		},
		enabled: enabled && !!buyer,
	});
}
