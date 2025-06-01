'use client';

import { Card, Text } from '@0xsequence/design-system';
import type { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface PrimarySaleErrorBoundaryProps {
	children: ReactNode;
	chainId: number;
	onError?: (error: Error) => void;
}

/**
 * Specialized error boundary for primary sale components
 * Provides a more contextual error message for shop-related failures
 */
export function PrimarySaleErrorBoundary({
	children,
	chainId,
	onError,
}: PrimarySaleErrorBoundaryProps) {
	const handleError = (error: Error) => {
		console.error('[PrimarySale Error]:', error);
		onError?.(error);
	};

	const renderFallback = (error: Error, resetError: () => void) => {
		// Check for specific primary sale error types
		const isNetworkError = error.message.toLowerCase().includes('network');
		const isContractError = error.message.toLowerCase().includes('contract');
		const isCheckoutError = error.message.toLowerCase().includes('checkout');

		let errorMessage = 'Unable to load shop items. Please try again.';
		const actionText = 'Retry';

		if (isNetworkError) {
			errorMessage =
				'Network connection issue. Please check your connection and try again.';
		} else if (isContractError) {
			errorMessage =
				'Unable to connect to the sales contract. Please refresh the page.';
		} else if (isCheckoutError) {
			errorMessage = 'Checkout options unavailable. Please try again later.';
		}

		return (
			<Card className="mx-auto max-w-md p-6">
				<div className="flex flex-col items-center gap-4 text-center">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-negative/10">
						<Text color="negative" variant="medium">
							!
						</Text>
					</div>
					<div className="space-y-2">
						<Text variant="large" color="text100">
							Something went wrong
						</Text>
						<Text variant="normal" color="text80">
							{errorMessage}
						</Text>
					</div>
					<button
						type="button"
						onClick={resetError}
						className="rounded-lg bg-primary px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-primary/90"
					>
						{actionText}
					</button>
				</div>
			</Card>
		);
	};

	return (
		<ErrorBoundary
			chainId={chainId}
			fallback={renderFallback}
			onError={handleError}
		>
			{children}
		</ErrorBoundary>
	);
}
