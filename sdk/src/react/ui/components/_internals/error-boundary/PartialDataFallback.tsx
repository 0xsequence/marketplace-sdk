'use client';

import { Box, Button, Card, Text } from '@0xsequence/design-system';
import { useState } from 'react';

interface PartialDataFallbackProps {
	loadedCount: number;
	failedCount: number;
	onRetryFailed?: () => void;
	onDismiss?: () => void;
}

/**
 * Fallback UI for when only some items fail to load
 * Shows a dismissible banner with retry option
 */
export function PartialDataFallback({
	loadedCount,
	failedCount,
	onRetryFailed,
	onDismiss,
}: PartialDataFallbackProps) {
	const [isDismissed, setIsDismissed] = useState(false);

	if (isDismissed) {
		return null;
	}

	const handleDismiss = () => {
		setIsDismissed(true);
		onDismiss?.();
	};

	return (
		<Card className="mb-6 border-warning/20 bg-warning/5">
			<Box padding="4">
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-start gap-3">
						<span className="text-2xl">⚠️</span>
						<div>
							<Text variant="normal" color="text100" className="font-medium">
								Some items couldn't be loaded
							</Text>
							<Text variant="small" color="text80" className="mt-1">
								{loadedCount} items loaded successfully, {failedCount} failed to
								load.
							</Text>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{onRetryFailed && (
							<Button onClick={onRetryFailed} variant="secondary" size="xs">
								Retry Failed
							</Button>
						)}
						<button
							type="button"
							onClick={handleDismiss}
							className="text-text50 transition-colors hover:text-text80"
							aria-label="Dismiss"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								role="img"
								aria-label="Close icon"
							>
								<path
									d="M12 4L4 12M4 4L12 12"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
								/>
							</svg>
						</button>
					</div>
				</div>
			</Box>
		</Card>
	);
}
