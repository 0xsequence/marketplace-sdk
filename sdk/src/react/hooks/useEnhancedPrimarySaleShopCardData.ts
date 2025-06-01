import { useCallback, useEffect, useState } from 'react';
import type { Address } from 'viem';
import type { ContractType } from '../../types';
import type { ShopCollectibleCardProps } from '../ui/components/marketplace-collectible-card';
import { usePrimarySaleShopCardData } from './usePrimarySaleShopCardData';

interface UseEnhancedPrimarySaleShopCardDataProps {
	chainId: number;
	primarySaleContractAddress: Address;
	collectionAddress: Address;
	enabled?: boolean;
	onError?: (error: Error) => void;
	retryDelay?: number;
	maxRetries?: number;
}

interface EnhancedPrimarySaleData {
	collectibleCards: ShopCollectibleCardProps[];
	salePrice?: { amount: string; currencyAddress: Address };
	isLoading: boolean;
	error: Error | null;
	isRetrying: boolean;
	retry: () => void;
	retryCount: number;
}

/**
 * Enhanced version of usePrimarySaleShopCardData with error handling and retry logic
 */
export function useEnhancedPrimarySaleShopCardData({
	chainId,
	primarySaleContractAddress,
	collectionAddress,
	enabled = true,
	onError,
	retryDelay = 3000,
	maxRetries = 3,
}: UseEnhancedPrimarySaleShopCardDataProps): EnhancedPrimarySaleData {
	const [retryCount, setRetryCount] = useState(0);
	const [isRetrying, setIsRetrying] = useState(false);
	const [shouldRetry, setShouldRetry] = useState(false);

	const {
		collectibleCards,
		salePrice,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
	} = usePrimarySaleShopCardData({
		chainId,
		primarySaleContractAddress,
		collectionAddress,
		enabled: enabled && (!error || shouldRetry),
	});

	// Handle errors
	useEffect(() => {
		if (error && onError) {
			onError(error);
		}
	}, [error, onError]);

	// Auto-retry logic for specific errors
	useEffect(() => {
		if (!error || retryCount >= maxRetries) {
			return;
		}

		// Check if error is retryable
		const isNetworkError =
			error.message.toLowerCase().includes('network') ||
			error.message.toLowerCase().includes('fetch');
		const isTimeoutError = error.message.toLowerCase().includes('timeout');
		const isRetryableError = isNetworkError || isTimeoutError;

		if (isRetryableError && retryCount < maxRetries) {
			setIsRetrying(true);
			const timer = setTimeout(
				() => {
					setRetryCount((prev) => prev + 1);
					setShouldRetry(true);
					setIsRetrying(false);
				},
				retryDelay * (retryCount + 1),
			); // Exponential backoff

			return () => clearTimeout(timer);
		}
	}, [error, retryCount, maxRetries, retryDelay]);

	// Manual retry function
	const retry = useCallback(() => {
		setRetryCount(0);
		setShouldRetry(true);
		setIsRetrying(false);
	}, []);

	// Reset retry flag after successful load
	useEffect(() => {
		if (!error && shouldRetry) {
			setShouldRetry(false);
			setRetryCount(0);
		}
	}, [error, shouldRetry]);

	// Enhanced error object with more context
	const enhancedError = error
		? new Error(
				`Failed to load primary sale items: ${error.message}${
					retryCount > 0 ? ` (Retry ${retryCount}/${maxRetries})` : ''
				}`,
			)
		: null;

	return {
		collectibleCards,
		salePrice,
		isLoading: isLoading || isRetrying,
		error: enhancedError,
		isRetrying,
		retry,
		retryCount,
	};
}
