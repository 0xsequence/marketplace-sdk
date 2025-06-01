'use client';

import { Button, Card, Text } from '@0xsequence/design-system';

interface FailedCardPlaceholderProps {
	tokenId: string;
	error?: string;
	onRetry?: () => void;
}

/**
 * Placeholder card shown when a specific item fails to load
 * Maintains grid layout consistency
 */
export function FailedCardPlaceholder({
	tokenId,
	error,
	onRetry,
}: FailedCardPlaceholderProps) {
	return (
		<Card className="group relative overflow-hidden border-negative/20 bg-negative/5">
			{/* Failed image placeholder */}
			<div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-backgroundSecondary">
				<div className="p-4 text-center">
					<div className="mb-2 text-4xl">❌</div>
					<Text variant="small" color="text50">
						Failed to load
					</Text>
				</div>
			</div>

			{/* Content */}
			<div className="space-y-3 p-4">
				<Text variant="normal" color="text80" className="font-medium">
					Item #{tokenId}
				</Text>

				{error && (
					<Text variant="small" color="text50" className="line-clamp-2">
						{error}
					</Text>
				)}

				{onRetry && (
					<Button
						onClick={onRetry}
						variant="ghost"
						size="xs"
						className="w-full"
					>
						Retry
					</Button>
				)}
			</div>
		</Card>
	);
}
