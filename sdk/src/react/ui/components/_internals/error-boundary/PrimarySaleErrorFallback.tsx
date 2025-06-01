'use client';

import { Button, Card, Spinner, Text } from '@0xsequence/design-system';
import type { ReactNode } from 'react';

interface PrimarySaleErrorFallbackProps {
	error?: Error | null;
	isRetrying?: boolean;
	onRetry?: () => void;
	retryCount?: number;
	maxRetries?: number;
	children?: ReactNode;
}

/**
 * Fallback UI component for primary sale API failures
 * Provides user-friendly error messages and retry functionality
 */
export function PrimarySaleErrorFallback({
	error,
	isRetrying,
	onRetry,
	retryCount = 0,
	maxRetries = 3,
	children,
}: PrimarySaleErrorFallbackProps) {
	if (!error) {
		return <>{children}</>;
	}

	// Determine error type and appropriate message
	const errorMessage = error.message.toLowerCase();
	const isNetworkError =
		errorMessage.includes('network') || errorMessage.includes('fetch');
	const isContractError = errorMessage.includes('contract');
	const isNotFoundError =
		errorMessage.includes('not found') || errorMessage.includes('404');
	const isTimeoutError = errorMessage.includes('timeout');

	let title = 'Unable to Load Shop Items';
	let description =
		'Something went wrong while loading the shop. Please try again.';
	let icon = '⚠️';

	if (isNetworkError) {
		title = 'Connection Issue';
		description = 'Please check your internet connection and try again.';
		icon = '🌐';
	} else if (isContractError) {
		title = 'Sales Contract Error';
		description =
			'Unable to connect to the sales contract. Please refresh the page.';
		icon = '📄';
	} else if (isNotFoundError) {
		title = 'Shop Not Found';
		description = 'This shop may no longer be available.';
		icon = '🔍';
	} else if (isTimeoutError) {
		title = 'Request Timeout';
		description = 'The request took too long. Please try again.';
		icon = '⏰';
	}

	const canRetry = onRetry && retryCount < maxRetries;
	const retryText =
		retryCount > 0 ? `Retry (${retryCount}/${maxRetries})` : 'Try Again';

	return (
		<Card className="mx-auto my-8 max-w-md">
			<div className="p-6">
				<div className="flex flex-col items-center gap-4 text-center">
					{/* Icon */}
					<div className="text-4xl">{icon}</div>

					{/* Title */}
					<Text variant="large" color="text100" className="font-semibold">
						{title}
					</Text>

					{/* Description */}
					<Text variant="normal" color="text80" className="max-w-sm">
						{description}
					</Text>

					{/* Error details (for debugging) */}
					{process.env.NODE_ENV === 'development' && (
						<details className="w-full text-left">
							<summary className="cursor-pointer text-sm text-text50">
								Technical Details
							</summary>
							<pre className="mt-2 overflow-auto rounded bg-backgroundSecondary p-2 text-xs">
								{error.stack || error.message}
							</pre>
						</details>
					)}

					{/* Action buttons */}
					<div className="flex gap-3">
						{canRetry && (
							<Button
								onClick={onRetry}
								disabled={isRetrying}
								variant="primary"
								size="sm"
							>
								{isRetrying ? (
									<>
										<Spinner size="sm" />
										<span>Retrying...</span>
									</>
								) : (
									retryText
								)}
							</Button>
						)}
						<Button
							onClick={() => window.location.reload()}
							variant="ghost"
							size="sm"
						>
							Refresh Page
						</Button>
					</div>
				</div>
			</div>
		</Card>
	);
}
